import { pool } from '../../config/db.js';
import { withTransaction } from '../../utils/dbTx.js';
import { badRequest, forbidden, notFound } from '../../utils/httpError.js';
import { slugify } from '../../utils/slugify.js';

function parseJsonMaybe(value, fallback) {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'object') return value;
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch {
      return fallback;
    }
  }
  return fallback;
}

async function assertBusinessOwned({ conn, userId, businessId }) {
  const [rows] = await conn.query('SELECT id, user_id FROM businesses WHERE id = :businessId', { businessId });
  const business = rows?.[0];
  if (!business) throw notFound('Business not found');
  if (Number(business.user_id) !== Number(userId)) throw forbidden();
}

async function getWebsiteRow({ conn, websiteId }) {
  const [rows] = await conn.query(
    'SELECT w.id, w.business_id, w.template_id, w.name, w.slug, w.status, w.settings_json, w.seo_json, w.created_at, w.updated_at, w.published_at, b.user_id AS owner_user_id FROM websites w JOIN businesses b ON b.id = w.business_id WHERE w.id = :websiteId',
    { websiteId }
  );
  return rows?.[0] ?? null;
}

async function assertWebsiteOwned({ conn, userId, websiteId }) {
  const website = await getWebsiteRow({ conn, websiteId });
  if (!website) throw notFound('Website not found');
  if (Number(website.owner_user_id) !== Number(userId)) throw forbidden();
  return website;
}

async function listPagesWithComponents({ conn, websiteId }) {
  const [pages] = await conn.query(
    'SELECT id, website_id, name, path, sort_order, meta_json, created_at, updated_at FROM pages WHERE website_id = :websiteId ORDER BY sort_order ASC, id ASC',
    { websiteId }
  );

  if (pages.length === 0) return [];

  const pageIds = pages.map((p) => p.id);
  const [components] = await conn.query(
    `SELECT id, page_id, type, order_index, props_json, style_json, created_at, updated_at
     FROM components
     WHERE page_id IN (${pageIds.map(() => '?').join(',')})
     ORDER BY page_id ASC, order_index ASC, id ASC`,
    pageIds
  );

  const byPage = new Map();
  for (const c of components) {
    const arr = byPage.get(c.page_id) ?? [];
    arr.push(c);
    byPage.set(c.page_id, arr);
  }

  return pages.map((p) => ({
    id: p.id,
    name: p.name,
    path: p.path,
    sortOrder: p.sort_order,
    meta: parseJsonMaybe(p.meta_json, {}),
    components: (byPage.get(p.id) ?? []).map((c) => ({
      id: c.id,
      type: c.type,
      orderIndex: c.order_index,
      props: parseJsonMaybe(c.props_json, {}),
      styles: parseJsonMaybe(c.style_json, {}),
    })),
  }));
}

async function createVersionSnapshot({ conn, websiteId, userId, snapshot }) {
  const [rows] = await conn.query(
    'SELECT COALESCE(MAX(version_number), 0) AS max_version FROM website_versions WHERE website_id = :websiteId',
    { websiteId }
  );
  const nextVersion = Number(rows?.[0]?.max_version ?? 0) + 1;

  await conn.query(
    'INSERT INTO website_versions (website_id, version_number, snapshot_json, created_by_user_id) VALUES (:websiteId, :versionNumber, :snapshotJson, :userId)',
    {
      websiteId,
      versionNumber: nextVersion,
      snapshotJson: JSON.stringify(snapshot),
      userId,
    }
  );

  return nextVersion;
}

async function replacePagesAndComponents({ conn, websiteId, pages }) {
  const [existingPages] = await conn.query('SELECT id FROM pages WHERE website_id = :websiteId', { websiteId });
  const existingPageIds = existingPages.map((p) => p.id);

  if (existingPageIds.length) {
    await conn.query(
      `DELETE FROM components WHERE page_id IN (${existingPageIds.map(() => '?').join(',')})`,
      existingPageIds
    );
  }

  await conn.query('DELETE FROM pages WHERE website_id = :websiteId', { websiteId });

  for (const p of pages) {
    const [pageResult] = await conn.query(
      'INSERT INTO pages (website_id, name, path, sort_order, meta_json) VALUES (:websiteId, :name, :path, :sortOrder, :metaJson)',
      {
        websiteId,
        name: p.name,
        path: p.path,
        sortOrder: p.sortOrder ?? 0,
        metaJson: JSON.stringify(p.meta ?? {}),
      }
    );

    const pageId = pageResult.insertId;

    for (const c of p.components ?? []) {
      await conn.query(
        'INSERT INTO components (page_id, type, order_index, props_json, style_json) VALUES (:pageId, :type, :orderIndex, :propsJson, :styleJson)',
        {
          pageId,
          type: c.type,
          orderIndex: c.orderIndex,
          propsJson: JSON.stringify(c.props ?? {}),
          styleJson: JSON.stringify(c.styles ?? {}),
        }
      );
    }
  }
}

export const websitesService = {
  async listWebsitesForBusiness({ userId, businessId }) {
    const conn = pool;
    await assertBusinessOwned({ conn, userId, businessId });

    const [rows] = await conn.query(
      'SELECT id, business_id, template_id, name, slug, status, created_at, updated_at, published_at FROM websites WHERE business_id = :businessId ORDER BY created_at DESC',
      { businessId }
    );
    return rows;
  },

  async createWebsiteFromTemplate({ userId, businessId, templateId, name, slug }) {
    const requestedSlug = slug ? slugify(slug) : slugify(name);
    if (!requestedSlug) throw badRequest('Invalid slug');

    return withTransaction(async (conn) => {
      await assertBusinessOwned({ conn, userId, businessId });

      const [trows] = await conn.query('SELECT id, structure_json FROM templates WHERE id = :templateId', {
        templateId,
      });
      const tpl = trows?.[0];
      if (!tpl) throw notFound('Template not found');

      const [existing] = await conn.query('SELECT id FROM websites WHERE slug = :slug', { slug: requestedSlug });
      if (existing.length) throw badRequest('Slug already exists');

      const settings = {
        theme: { primary: '#6366f1', background: '#070a12' },
        navbar: { logoText: name },
      };
      const seo = { title: name, description: '', ogImage: null };

      const [wres] = await conn.query(
        'INSERT INTO websites (business_id, template_id, name, slug, status, settings_json, seo_json) VALUES (:businessId, :templateId, :name, :slug, :status, :settingsJson, :seoJson)',
        {
          businessId,
          templateId,
          name,
          slug: requestedSlug,
          status: 'DRAFT',
          settingsJson: JSON.stringify(settings),
          seoJson: JSON.stringify(seo),
        }
      );

      const websiteId = wres.insertId;

      const structure = parseJsonMaybe(tpl.structure_json, {});
      const pages = structure?.pages ?? [];

      await replacePagesAndComponents({
        conn,
        websiteId,
        pages: pages.map((p, idx) => ({
          name: p.name,
          path: p.path,
          sortOrder: idx,
          meta: p.meta ?? {},
          components: (p.components ?? []).map((c, cidx) => ({
            type: c.type,
            orderIndex: cidx,
            props: c.props ?? {},
            styles: c.styles ?? {},
          })),
        })),
      });

      const snapshot = {
        website: {
          id: websiteId,
          businessId,
          templateId,
          name,
          slug: requestedSlug,
          status: 'DRAFT',
          settings,
          seo,
        },
        pages,
      };

      await createVersionSnapshot({ conn, websiteId, userId, snapshot });

      return {
        id: websiteId,
        business_id: businessId,
        template_id: templateId,
        name,
        slug: requestedSlug,
        status: 'DRAFT',
      };
    });
  },

  async getWebsite({ userId, websiteId }) {
    const conn = pool;
    const website = await assertWebsiteOwned({ conn, userId, websiteId });
    return {
      id: website.id,
      businessId: website.business_id,
      templateId: website.template_id,
      name: website.name,
      slug: website.slug,
      status: website.status,
      settings: parseJsonMaybe(website.settings_json, {}),
      seo: parseJsonMaybe(website.seo_json, {}),
      createdAt: website.created_at,
      updatedAt: website.updated_at,
      publishedAt: website.published_at,
    };
  },

  async getWebsiteStructure({ userId, websiteId }) {
    const conn = pool;
    const website = await assertWebsiteOwned({ conn, userId, websiteId });
    const pages = await listPagesWithComponents({ conn, websiteId });

    return {
      website: {
        id: website.id,
        businessId: website.business_id,
        templateId: website.template_id,
        name: website.name,
        slug: website.slug,
        status: website.status,
        settings: parseJsonMaybe(website.settings_json, {}),
        seo: parseJsonMaybe(website.seo_json, {}),
      },
      pages,
    };
  },

  async replaceWebsiteStructure({ userId, websiteId, pages }) {
    return withTransaction(async (conn) => {
      const website = await assertWebsiteOwned({ conn, userId, websiteId });
      const currentPages = await listPagesWithComponents({ conn, websiteId });

      const snapshot = {
        website: {
          id: website.id,
          businessId: website.business_id,
          templateId: website.template_id,
          name: website.name,
          slug: website.slug,
          status: website.status,
          settings: website.settings_json,
          seo: website.seo_json,
        },
        pages: currentPages,
      };

      await createVersionSnapshot({ conn, websiteId, userId, snapshot });

      await replacePagesAndComponents({ conn, websiteId, pages });

      return this.getWebsiteStructure({ userId, websiteId });
    });
  },

  async updateWebsiteSeo({ userId, websiteId, seo }) {
    const conn = pool;
    await assertWebsiteOwned({ conn, userId, websiteId });
    await conn.query('UPDATE websites SET seo_json = :seoJson WHERE id = :websiteId', {
      websiteId,
      seoJson: JSON.stringify(seo ?? {}),
    });
    return this.getWebsite({ userId, websiteId });
  },

  async updateWebsiteSettings({ userId, websiteId, settings }) {
    const conn = pool;
    await assertWebsiteOwned({ conn, userId, websiteId });
    await conn.query('UPDATE websites SET settings_json = :settingsJson WHERE id = :websiteId', {
      websiteId,
      settingsJson: JSON.stringify(settings ?? {}),
    });
    return this.getWebsite({ userId, websiteId });
  },

  async publishWebsite({ userId, websiteId }) {
    const conn = pool;
    const website = await assertWebsiteOwned({ conn, userId, websiteId });
    if (website.status === 'PUBLISHED') return this.getWebsite({ userId, websiteId });

    await conn.query(
      "UPDATE websites SET status = 'PUBLISHED', published_at = NOW() WHERE id = :websiteId",
      { websiteId }
    );

    return this.getWebsite({ userId, websiteId });
  },

  async unpublishWebsite({ userId, websiteId }) {
    const conn = pool;
    const website = await assertWebsiteOwned({ conn, userId, websiteId });
    if (website.status === 'DRAFT') return this.getWebsite({ userId, websiteId });

    await conn.query(
      "UPDATE websites SET status = 'DRAFT', published_at = NULL WHERE id = :websiteId",
      { websiteId }
    );

    return this.getWebsite({ userId, websiteId });
  },

  async listWebsiteVersions({ userId, websiteId }) {
    const conn = pool;
    await assertWebsiteOwned({ conn, userId, websiteId });

    const [rows] = await conn.query(
      'SELECT id, website_id, version_number, created_by_user_id, created_at FROM website_versions WHERE website_id = :websiteId ORDER BY version_number DESC',
      { websiteId }
    );

    return rows;
  },

  async restoreWebsiteVersion({ userId, websiteId, versionId }) {
    return withTransaction(async (conn) => {
      await assertWebsiteOwned({ conn, userId, websiteId });

      const [vrows] = await conn.query(
        'SELECT id, snapshot_json FROM website_versions WHERE id = :versionId AND website_id = :websiteId',
        { versionId, websiteId }
      );
      const version = vrows?.[0];
      if (!version) throw notFound('Version not found');

      const snapshot = parseJsonMaybe(version.snapshot_json, {});
      const pages = snapshot?.pages ?? [];

      const normalizedPages = pages.map((p, idx) => ({
        name: p.name,
        path: p.path,
        sortOrder: p.sortOrder ?? p.sort_order ?? idx,
        meta: p.meta ?? p.meta_json ?? {},
        components: (p.components ?? []).map((c, cidx) => ({
          type: c.type,
          orderIndex: c.orderIndex ?? c.order_index ?? cidx,
          props: c.props ?? c.props_json ?? {},
          styles: c.styles ?? c.style_json ?? {},
        })),
      }));

      const currentPages = await listPagesWithComponents({ conn, websiteId });
      const website = await getWebsiteRow({ conn, websiteId });

      await createVersionSnapshot({
        conn,
        websiteId,
        userId,
        snapshot: {
          website: {
            id: website.id,
            businessId: website.business_id,
            templateId: website.template_id,
            name: website.name,
            slug: website.slug,
            status: website.status,
            settings: parseJsonMaybe(website.settings_json, {}),
            seo: parseJsonMaybe(website.seo_json, {}),
          },
          pages: currentPages,
        },
      });

      await replacePagesAndComponents({ conn, websiteId, pages: normalizedPages });

      return this.getWebsiteStructure({ userId, websiteId });
    });
  },
};
