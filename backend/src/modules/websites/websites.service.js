import { pool } from '../../config/db.js';
import { badRequest, forbidden, notFound } from '../../utils/httpError.js';
import { withTransaction } from '../../utils/dbTx.js';
import { slugify } from '../../utils/slugify.js';

function defaultDesignSystem({ brandName }) {
  return {
    colors: {
      primary: '#6366f1',
      secondary: '#22c55e',
      background: '#070a12',
      surface: 'rgba(255,255,255,0.06)',
      text: 'rgba(255,255,255,0.92)',
      mutedText: 'rgba(255,255,255,0.70)',
    },
    typography: {
      fontFamily: 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji"',
      baseFontSize: 16,
      lineHeight: 1.5,
      headingWeight: 600,
      bodyWeight: 400,
    },
    radius: {
      sm: 10,
      md: 16,
      lg: 24,
    },
    shadow: {
      card: '0 10px 30px rgba(0,0,0,0.35)',
    },
    buttons: {
      style: 'solid',
      radius: 12,
    },
    links: {
      underline: false,
    },
    spacing: {
      sectionY: 64,
      containerX: 16,
    },
    brand: {
      name: brandName ?? 'Website',
    },
  };
}

function mergeDesignSystem(base, override) {
  const o = override ?? {};
  return {
    ...(base ?? {}),
    colors: { ...(base?.colors ?? {}), ...(o?.colors ?? {}) },
    typography: { ...(base?.typography ?? {}), ...(o?.typography ?? {}) },
    radius: { ...(base?.radius ?? {}), ...(o?.radius ?? {}) },
    shadow: { ...(base?.shadow ?? {}), ...(o?.shadow ?? {}) },
    buttons: { ...(base?.buttons ?? {}), ...(o?.buttons ?? {}) },
    links: { ...(base?.links ?? {}), ...(o?.links ?? {}) },
    spacing: { ...(base?.spacing ?? {}), ...(o?.spacing ?? {}) },
    brand: { ...(base?.brand ?? {}), ...(o?.brand ?? {}) },
  };
}

function parseJsonMaybe(json, fallback) {
  if (json == null) return fallback;
  if (typeof json === 'object') return json;
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

async function generateUniqueWebsiteSlug({ conn, baseSlug }) {
  const cleanBase = slugify(baseSlug);
  if (!cleanBase) return '';

  const [rows] = await conn.query(
    'SELECT slug FROM websites WHERE slug = :base OR slug LIKE :pattern',
    {
      base: cleanBase,
      pattern: `${cleanBase}-%`,
    }
  );

  if (!rows.length) return cleanBase;

  let maxSuffix = 1;
  for (const r of rows) {
    const s = String(r.slug ?? '');
    if (s === cleanBase) {
      maxSuffix = Math.max(maxSuffix, 1);
      continue;
    }
    const m = s.match(new RegExp(`^${cleanBase}-(\\d+)$`));
    if (m?.[1]) {
      const n = Number(m[1]);
      if (Number.isFinite(n)) maxSuffix = Math.max(maxSuffix, n);
    }
  }

  const next = maxSuffix + 1;
  const suffix = `-${next}`;
  const trimmedBase = cleanBase.slice(0, 160 - suffix.length);
  return `${trimmedBase}${suffix}`;
}

function ensureArray(value) {
  return Array.isArray(value) ? value : [];
}

function enhanceHomePageComponents({ components, templateName, category }) {
  const comps = ensureArray(components).map((c) => ({
    type: c?.type,
    props: c?.props ?? {},
    styles: c?.styles ?? {},
  }));

  const hasType = (t) => comps.some((c) => c?.type === t);

  const inserted = [...comps];

  if (!hasType('LOGO_CLOUD')) {
    const logoLabel = category ? `Trusted by ${category}` : 'Trusted by';
    const logoCloud = {
      type: 'LOGO_CLOUD',
      props: {
        label: logoLabel,
        logos: [
          { src: '', alt: 'Brand One' },
          { src: '', alt: 'Brand Two' },
          { src: '', alt: 'Brand Three' },
          { src: '', alt: 'Brand Four' },
          { src: '', alt: 'Brand Five' },
          { src: '', alt: 'Brand Six' },
        ],
      },
      styles: {},
    };

    const heroIndex = inserted.findIndex((c) => c.type === 'HERO');
    const idx = heroIndex >= 0 ? heroIndex + 1 : 1;
    inserted.splice(idx, 0, logoCloud);
  }

  const commerceCats = new Set(['Ecommerce', 'Marketplace', 'Sports', 'Apparel', 'Restaurant']);
  const entertainmentCats = new Set(['Entertainment', 'Software']);

  const shouldPreferProductGrid = commerceCats.has(String(category ?? ''));
  const shouldPreferCarousel = entertainmentCats.has(String(category ?? ''));

  if (!hasType('PRODUCT_GRID') && !hasType('FEATURE_CAROUSEL')) {
    if (shouldPreferProductGrid) {
      inserted.push({
        type: 'PRODUCT_GRID',
        props: {
          headline: templateName ? `${templateName} picks` : 'Popular products',
          subheadline: 'Curated picks with transparent pricing.',
          cta: { label: 'View all', href: '/contact' },
          products: [
            {
              name: 'Product name',
              description: 'Short product description',
              price: '€49',
              badge: 'New',
              imageUrl: '',
              cta: { label: 'Buy', href: '/contact' },
            },
            {
              name: 'Product name',
              description: 'Short product description',
              price: '€79',
              badge: 'Best seller',
              imageUrl: '',
              cta: { label: 'Buy', href: '/contact' },
            },
            {
              name: 'Product name',
              description: 'Short product description',
              price: '€29',
              badge: null,
              imageUrl: '',
              cta: { label: 'Buy', href: '/contact' },
            },
            {
              name: 'Product name',
              description: 'Short product description',
              price: '€99',
              badge: null,
              imageUrl: '',
              cta: { label: 'Buy', href: '/contact' },
            },
          ],
        },
        styles: {},
      });
    } else if (shouldPreferCarousel) {
      inserted.push({
        type: 'FEATURE_CAROUSEL',
        props: {
          headline: 'Featured',
          subheadline: 'A horizontal carousel section (Netflix-style row).',
          cta: { label: 'See all', href: '/contact' },
          items: [
            { title: 'Feature item', tagline: 'Short tagline', imageUrl: '', cta: { label: 'Open', href: '/contact' } },
            { title: 'Feature item', tagline: 'Short tagline', imageUrl: '', cta: { label: 'Open', href: '/contact' } },
            { title: 'Feature item', tagline: 'Short tagline', imageUrl: '', cta: { label: 'Open', href: '/contact' } },
            { title: 'Feature item', tagline: 'Short tagline', imageUrl: '', cta: { label: 'Open', href: '/contact' } },
          ],
        },
        styles: {},
      });
    }
  }

  return inserted;
}

function enhanceTemplateStructure({ structure, templateName, category }) {
  const pages = ensureArray(structure?.pages).map((p) => ({
    name: p?.name,
    path: p?.path,
    meta: p?.meta ?? {},
    components: ensureArray(p?.components),
  }));

  const nextPages = pages.map((p) => {
    if (p.path !== '/') return p;
    return {
      ...p,
      components: enhanceHomePageComponents({
        components: p.components,
        templateName,
        category,
      }),
    };
  });

  return {
    ...(structure ?? {}),
    pages: nextPages,
  };
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

      const [trows] = await conn.query('SELECT id, name, category, structure_json FROM templates WHERE id = :templateId', {
        templateId,
      });
      const tpl = trows?.[0];
      if (!tpl) throw notFound('Template not found');

      const structure = parseJsonMaybe(tpl.structure_json, {});
      const baseDesignSystem = defaultDesignSystem({ brandName: name });
      const designSystem = mergeDesignSystem(baseDesignSystem, structure?.designSystem);

      let finalSlug = await generateUniqueWebsiteSlug({ conn, baseSlug: requestedSlug });
      if (!finalSlug) throw badRequest('Invalid slug');

      const settings = {
        designSystem,
        theme: {
          primary: designSystem?.colors?.primary ?? '#6366f1',
          background: designSystem?.colors?.background ?? '#070a12',
        },
        navbar: { logoText: name },
      };
      const seo = { title: name, description: '', ogImage: null };

      let wres;
      for (let attempt = 0; attempt < 20; attempt++) {
        try {
          [wres] = await conn.query(
            'INSERT INTO websites (business_id, template_id, name, slug, status, settings_json, seo_json) VALUES (:businessId, :templateId, :name, :slug, :status, :settingsJson, :seoJson)',
            {
              businessId,
              templateId,
              name,
              slug: finalSlug,
              status: 'DRAFT',
              settingsJson: JSON.stringify(settings),
              seoJson: JSON.stringify(seo),
            }
          );
          break;
        } catch (err) {
          if (err?.code !== 'ER_DUP_ENTRY') throw err;
          finalSlug = await generateUniqueWebsiteSlug({ conn, baseSlug: requestedSlug });
        }
      }
      if (!wres?.insertId) throw badRequest('Slug already exists');

      const websiteId = wres.insertId;

      const enhancedStructure = enhanceTemplateStructure({
        structure,
        templateName: tpl.name,
        category: tpl.category,
      });
      const pages = enhancedStructure?.pages ?? [];

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
          slug: finalSlug,
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
        slug: finalSlug,
        status: 'DRAFT',
      };
    });
  },

  async createBlankWebsite({ userId, businessId, name, slug }) {
    const requestedSlug = slug ? slugify(slug) : slugify(name);
    if (!requestedSlug) throw badRequest('Invalid slug');

    return withTransaction(async (conn) => {
      await assertBusinessOwned({ conn, userId, businessId });

      const designSystem = defaultDesignSystem({ brandName: name });

      let finalSlug = await generateUniqueWebsiteSlug({ conn, baseSlug: requestedSlug });
      if (!finalSlug) throw badRequest('Invalid slug');

      const settings = {
        designSystem,
        theme: {
          primary: designSystem?.colors?.primary ?? '#6366f1',
          background: designSystem?.colors?.background ?? '#070a12',
        },
        navbar: { logoText: name },
      };
      const seo = { title: name, description: '', ogImage: null };

      let wres;
      for (let attempt = 0; attempt < 20; attempt++) {
        try {
          [wres] = await conn.query(
            'INSERT INTO websites (business_id, template_id, name, slug, status, settings_json, seo_json) VALUES (:businessId, NULL, :name, :slug, :status, :settingsJson, :seoJson)',
            {
              businessId,
              name,
              slug: finalSlug,
              status: 'DRAFT',
              settingsJson: JSON.stringify(settings),
              seoJson: JSON.stringify(seo),
            }
          );
          break;
        } catch (err) {
          if (err?.code !== 'ER_DUP_ENTRY') throw err;
          finalSlug = await generateUniqueWebsiteSlug({ conn, baseSlug: requestedSlug });
        }
      }
      if (!wres?.insertId) throw badRequest('Slug already exists');

      const websiteId = wres.insertId;

      const pages = [
        {
          name: 'Home',
          path: '/',
          sortOrder: 0,
          meta: { title: name, description: '' },
          components: [],
        },
      ];

      await replacePagesAndComponents({ conn, websiteId, pages });

      await createVersionSnapshot({
        conn,
        websiteId,
        userId,
        snapshot: {
          website: {
            id: websiteId,
            businessId,
            templateId: null,
            name,
            slug: finalSlug,
            status: 'DRAFT',
            settings,
            seo,
          },
          pages,
        },
      });

      return {
        id: websiteId,
        business_id: businessId,
        template_id: null,
        name,
        slug: finalSlug,
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
