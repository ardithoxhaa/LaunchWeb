import { pool } from '../../config/db.js';
import { badRequest, forbidden, notFound } from '../../utils/httpError.js';
import { withTransaction } from '../../utils/dbTx.js';
import { slugify } from '../../utils/slugify.js';
import crypto from 'node:crypto';

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

function makeNodeId() {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  return crypto.randomBytes(16).toString('hex');
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

function buildDefaultBuilderFromFlatComponents(components) {
  // Create a separate section for each component for proper layout
  const sections = (components ?? []).map((c) => ({
    id: makeNodeId(),
    type: 'SECTION',
    props: {},
    style: c.styles ?? {},
    responsive: {},
    children: [
      {
        id: makeNodeId(),
        type: 'CONTAINER',
        props: { width: 'boxed' },
        style: {},
        responsive: {},
        children: [
          {
            id: makeNodeId(),
            type: 'COLUMN',
            props: { width: 100 },
            style: {},
            responsive: {},
            children: [
              {
                id: makeNodeId(),
                type: 'WIDGET',
                widgetType: c.type,
                props: c.props ?? {},
                style: c.styles ?? {},
                responsive: {},
                children: [],
              },
            ],
          },
        ],
      },
    ],
  }));

  return {
    version: 1,
    root: {
      id: makeNodeId(),
      type: 'ROOT',
      children: sections,
    },
  };
}

async function listPagesWithBuilder({ conn, websiteId }) {
  // Step 1: Get page metadata without large builder_json (avoids MySQL sort memory issues)
  const [pagesMeta] = await conn.query(
    'SELECT id, website_id, name, path, sort_order, meta_json FROM pages WHERE website_id = :websiteId ORDER BY sort_order ASC, id ASC',
    { websiteId }
  );
  if (pagesMeta.length === 0) return [];

  // Step 2: Get builder_json separately (no sorting needed for this query)
  const metaPageIds = pagesMeta.map((p) => p.id);
  const [builderRows] = await conn.query(
    `SELECT id, builder_json FROM pages WHERE id IN (${metaPageIds.map(() => '?').join(',')})`,
    metaPageIds
  );
  
  // Step 3: Create a map of page id to builder_json
  const builderMap = new Map();
  for (const row of builderRows) {
    builderMap.set(row.id, row.builder_json);
  }
  
  // Step 4: Merge the data
  const pages = pagesMeta.map(p => ({
    ...p,
    builder_json: builderMap.get(p.id) || null
  }));

  // Step 5: Get components for these pages
  const [components] = await conn.query(
    `SELECT id, page_id, type, order_index, props_json, style_json
     FROM components
     WHERE page_id IN (${metaPageIds.map(() => '?').join(',')})
     ORDER BY page_id ASC, order_index ASC, id ASC`,
    metaPageIds
  );

  const byPage = new Map();
  for (const c of components) {
    const arr = byPage.get(c.page_id) ?? [];
    arr.push({
      id: c.id,
      type: c.type,
      orderIndex: c.order_index,
      props: parseJsonMaybe(c.props_json, {}),
      styles: parseJsonMaybe(c.style_json, {}),
    });
    byPage.set(c.page_id, arr);
  }

  const needsInit = [];
  const result = pages.map((p) => {
    const builder = parseJsonMaybe(p.builder_json, null);
    if (!builder) {
      needsInit.push(p.id);
    }
    return {
      id: p.id,
      name: p.name,
      path: p.path,
      sortOrder: p.sort_order,
      meta: parseJsonMaybe(p.meta_json, {}),
      builder: builder ?? null,
      _flatComponents: byPage.get(p.id) ?? [],
    };
  });

  if (needsInit.length) {
    for (const p of result) {
      if (p.builder) continue;
      const nextBuilder = buildDefaultBuilderFromFlatComponents(p._flatComponents);
      p.builder = nextBuilder;
      await conn.query('UPDATE pages SET builder_json = :builderJson WHERE id = :id', {
        id: p.id,
        builderJson: JSON.stringify(nextBuilder),
      });
    }
  }

  return result.map(({ _flatComponents, ...p }) => p);
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
    // Build builder_json structure from components
    const builderJson = buildBuilderJsonFromComponents(p.components ?? []);
    
    const [pageResult] = await conn.query(
      'INSERT INTO pages (website_id, name, path, sort_order, meta_json, builder_json) VALUES (:websiteId, :name, :path, :sortOrder, :metaJson, :builderJson)',
      {
        websiteId,
        name: p.name,
        path: p.path,
        sortOrder: p.sortOrder ?? 0,
        metaJson: JSON.stringify(p.meta ?? {}),
        builderJson: JSON.stringify(builderJson),
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

function buildBuilderJsonFromComponents(components) {
  const generateId = () => Math.random().toString(36).substring(2, 10);
  
  // Create a section for each component (each component gets its own full-width section)
  const sections = components.map((comp, idx) => ({
    id: generateId(),
    type: 'SECTION',
    props: {},
    style: comp.styles || {},
    responsive: {},
    children: [{
      id: generateId(),
      type: 'CONTAINER',
      props: { width: 'boxed' },
      style: {},
      responsive: {},
      children: [{
        id: generateId(),
        type: 'COLUMN',
        props: { width: 100 },
        style: {},
        responsive: {},
        children: [{
          id: generateId(),
          type: 'WIDGET',
          widgetType: comp.type,
          props: comp.props || {},
          style: comp.styles || {},
          responsive: {},
          children: [],
        }],
      }],
    }],
  }));

  return {
    version: 1,
    root: {
      id: generateId(),
      type: 'ROOT',
      children: sections,
    },
  };
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

  async getWebsiteBuilder({ userId, websiteId }) {
    const conn = pool;
    const website = await assertWebsiteOwned({ conn, userId, websiteId });
    const pages = await listPagesWithBuilder({ conn, websiteId });

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

  async replaceWebsiteBuilder({ userId, websiteId, pages }) {
    return withTransaction(async (conn) => {
      const website = await assertWebsiteOwned({ conn, userId, websiteId });
      const currentBuilderPages = await listPagesWithBuilder({ conn, websiteId });

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
        builderPages: currentBuilderPages.map((p) => ({
          id: p.id,
          name: p.name,
          path: p.path,
          sortOrder: p.sortOrder,
          meta: p.meta,
          builder: p.builder,
        })),
      };

      await createVersionSnapshot({ conn, websiteId, userId, snapshot });

      for (const p of pages ?? []) {
        if (!p?.id) continue;
        await conn.query(
          'UPDATE pages SET name = :name, path = :path, sort_order = :sortOrder, meta_json = :metaJson, builder_json = :builderJson WHERE id = :id AND website_id = :websiteId',
          {
            id: p.id,
            websiteId,
            name: p.name,
            path: p.path,
            sortOrder: p.sortOrder ?? 0,
            metaJson: JSON.stringify(p.meta ?? {}),
            builderJson: JSON.stringify(p.builder ?? {}),
          }
        );
      }

      return this.getWebsiteBuilder({ userId, websiteId });
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

  async checkSlugAvailability({ slug, excludeWebsiteId }) {
    const conn = pool;
    let query = 'SELECT id FROM websites WHERE slug = :slug';
    const params = { slug };
    
    if (excludeWebsiteId) {
      query += ' AND id != :excludeWebsiteId';
      params.excludeWebsiteId = excludeWebsiteId;
    }
    
    const [rows] = await conn.query(query, params);
    return rows.length === 0;
  },

  async updateWebsiteSlug({ userId, websiteId, slug }) {
    const conn = pool;
    await assertWebsiteOwned({ conn, userId, websiteId });
    
    // Check if slug is available
    const [existing] = await conn.query(
      'SELECT id FROM websites WHERE slug = :slug AND id != :websiteId',
      { slug, websiteId }
    );
    
    if (existing.length > 0) {
      throw badRequest('This domain/slug is already in use by another website');
    }
    
    await conn.query('UPDATE websites SET slug = :slug WHERE id = :websiteId', {
      websiteId,
      slug,
    });
    
    return this.getWebsite({ userId, websiteId });
  },

  async addPage({ userId, websiteId, name, path }) {
    const conn = pool;
    await assertWebsiteOwned({ conn, userId, websiteId });
    
    // Check if path already exists for this website
    const [existing] = await conn.query(
      'SELECT id FROM pages WHERE website_id = :websiteId AND path = :path',
      { websiteId, path }
    );
    
    if (existing.length > 0) {
      throw badRequest('A page with this path already exists');
    }
    
    // Get max sort order
    const [maxOrder] = await conn.query(
      'SELECT COALESCE(MAX(sort_order), -1) AS max_order FROM pages WHERE website_id = :websiteId',
      { websiteId }
    );
    const sortOrder = (maxOrder[0]?.max_order ?? -1) + 1;
    
    // Create empty builder structure
    const builderJson = {
      version: 1,
      root: {
        id: makeNodeId(),
        type: 'ROOT',
        children: [],
      },
    };
    
    const [result] = await conn.query(
      'INSERT INTO pages (website_id, name, path, sort_order, meta_json, builder_json) VALUES (:websiteId, :name, :path, :sortOrder, :metaJson, :builderJson)',
      {
        websiteId,
        name,
        path,
        sortOrder,
        metaJson: JSON.stringify({ title: name, description: '' }),
        builderJson: JSON.stringify(builderJson),
      }
    );
    
    return {
      id: result.insertId,
      name,
      path,
      sortOrder,
      meta: { title: name, description: '' },
      builder: builderJson,
    };
  },

  async deletePage({ userId, websiteId, pageId }) {
    const conn = pool;
    await assertWebsiteOwned({ conn, userId, websiteId });
    
    // Get all pages to check if this is the last one
    const [pages] = await conn.query(
      'SELECT id FROM pages WHERE website_id = :websiteId ORDER BY sort_order ASC, id ASC',
      { websiteId }
    );
    
    if (pages.length <= 1) {
      throw badRequest('Cannot delete the last page of a website');
    }
    
    // Delete the page
    const [result] = await conn.query(
      'DELETE FROM pages WHERE id = :pageId AND website_id = :websiteId',
      { pageId, websiteId }
    );
    
    if (result.affectedRows === 0) {
      throw notFound('Page not found');
    }
    
    // Update website updated_at
    await conn.query(
      'UPDATE websites SET updated_at = CURRENT_TIMESTAMP WHERE id = :websiteId',
      { websiteId }
    );
    
    // Clean up related data
    await conn.query('DELETE FROM website_versions WHERE website_id = :websiteId', { websiteId });
    
    return { success: true };
  },

  async updatePage({ userId, websiteId, pageId, name, path }) {
    const conn = pool;
    await assertWebsiteOwned({ conn, userId, websiteId });
    
    // Check if page exists
    const [pageRows] = await conn.query(
      'SELECT id FROM pages WHERE id = :pageId AND website_id = :websiteId',
      { pageId, websiteId }
    );
    
    if (!pageRows.length) {
      throw notFound('Page not found');
    }
    
    // Check if path is already used by another page
    const [existingPath] = await conn.query(
      'SELECT id FROM pages WHERE website_id = :websiteId AND path = :path AND id != :pageId',
      { websiteId, path, pageId }
    );
    
    if (existingPath.length > 0) {
      throw badRequest('A page with this path already exists');
    }
    
    // Update the page
    await conn.query(
      'UPDATE pages SET name = :name, path = :path, updated_at = NOW() WHERE id = :pageId AND website_id = :websiteId',
      { pageId, websiteId, name, path }
    );
    
    // Return updated page
    const [updatedRows] = await conn.query(
      'SELECT id, name, path, sort_order, meta_json FROM pages WHERE id = :pageId',
      { pageId }
    );
    
    const page = updatedRows[0];
    return {
      id: page.id,
      name: page.name,
      path: page.path,
      sortOrder: page.sort_order,
      meta: parseJsonMaybe(page.meta_json, {}),
    };
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
      const builderPages = Array.isArray(snapshot?.builderPages) ? snapshot.builderPages : null;

      if (builderPages?.length) {
        const currentBuilderPages = await listPagesWithBuilder({ conn, websiteId });
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
            builderPages: currentBuilderPages.map((p) => ({
              id: p.id,
              name: p.name,
              path: p.path,
              sortOrder: p.sortOrder,
              meta: p.meta,
              builder: p.builder,
            })),
          },
        });

        for (const p of builderPages) {
          if (!p?.id) continue;
          await conn.query(
            'UPDATE pages SET name = :name, path = :path, sort_order = :sortOrder, meta_json = :metaJson, builder_json = :builderJson WHERE id = :id AND website_id = :websiteId',
            {
              id: p.id,
              websiteId,
              name: p.name,
              path: p.path,
              sortOrder: p.sortOrder ?? p.sort_order ?? 0,
              metaJson: JSON.stringify(p.meta ?? p.meta_json ?? {}),
              builderJson: JSON.stringify(p.builder ?? p.builder_json ?? {}),
            }
          );
        }

        return this.getWebsiteBuilder({ userId, websiteId });
      }

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

  async getWebsiteAnalytics({ userId, websiteId }) {
    return withTransaction(async (conn) => {
      await assertWebsiteOwned({ conn, userId, websiteId });

      // Simple query to get website analytics
      const [websiteRows] = await conn.query(
        'SELECT w.id, w.name, w.slug, w.status, w.created_at, w.updated_at, w.published_at, w.view_count, w.last_viewed_at, COUNT(*) as page_count, COUNT(*) as version_count FROM websites w WHERE w.id = ?',
        [websiteId]
      );

      // Get page count
      const [pageCountResult] = await conn.query(
        'SELECT COUNT(*) FROM pages WHERE website_id = ?',
        [websiteId]
      );

      // Get version count
      const [versionCountResult] = await conn.query(
        'SELECT COUNT(*) FROM website_versions WHERE website_id = ?',
        [websiteId]
      );

      return {
        website: {
          id: website.id,
          name: website.name,
          slug: website.slug,
          status: website.status,
          createdAt: website.created_at,
          updatedAt: website.updated_at,
          publishedAt: website.published_at,
          viewCount: website.view_count ?? 0,
          lastViewedAt: website.last_viewed_at,
        },
        stats: {
          pageCount: pageCountResult[0]?.count || 0,
          versionCount: versionCountResult[0]?.count || 0,
          totalComponents: 0,
        },
        pages: [],
        recentVersions: []
      };
    });
  },

  async exportWebsite({ userId, websiteId }) {
    console.log(`=== EXPORT WEBSITE CALLED: userId=${userId}, websiteId=${websiteId} ===`);
    return withTransaction(async (conn) => {
      await assertWebsiteOwned({ conn, userId, websiteId });

      const [websiteRows] = await conn.query(
        'SELECT id, name, slug, settings_json, seo_json FROM websites WHERE id = :websiteId',
        { websiteId }
      );
      const website = websiteRows[0];
      if (!website) throw notFound('Website not found');

      // Step 1: Get page metadata without large builder_json (avoids MySQL sort memory issues)
      const [pagesMeta] = await conn.query(
        'SELECT id, name, path, sort_order FROM pages WHERE website_id = :websiteId ORDER BY sort_order ASC, id ASC',
        { websiteId }
      );

      // Step 2: Get builder_json separately (no sorting needed)
      let pagesData = [];
      if (pagesMeta.length > 0) {
        const pageIds = pagesMeta.map(p => p.id);
        const [builderRows] = await conn.query(
          `SELECT id, builder_json FROM pages WHERE id IN (${pageIds.map(() => '?').join(',')})`,
          pageIds
        );
        
        const builderMap = new Map();
        for (const row of builderRows) {
          builderMap.set(row.id, row.builder_json);
        }

        pagesData = pagesMeta.map(page => {
          const builder = parseJsonMaybe(builderMap.get(page.id), {});
          console.log(`Page ${page.name} (${page.path}) builder data:`, JSON.stringify(builder, null, 2).substring(0, 500));
          return { name: page.name, path: page.path, builder };
        });
      }

      const settings = parseJsonMaybe(website.settings_json, {});
      const seo = parseJsonMaybe(website.seo_json, {});
      const designSystem = settings?.designSystem ?? {};

      // Generate separate HTML files for each page
      console.log('=== CALLING generateExportFiles ===');
      const files = generateExportFiles({
        websiteName: website.name,
        seo,
        designSystem,
        pages: pagesData,
      });
      console.log('=== generateExportFiles RETURNED:', files.length, 'files');

      return { files, websiteName: website.name };
    });
  },

  async deleteWebsite({ userId, websiteId }) {
    return withTransaction(async (conn) => {
      await assertWebsiteOwned({ conn, userId, websiteId });

      // Delete components first (foreign key constraint)
      await conn.query(
        'DELETE c FROM components c JOIN pages p ON c.page_id = p.id WHERE p.website_id = :websiteId',
        { websiteId }
      );

      // Delete pages
      await conn.query('DELETE FROM pages WHERE website_id = :websiteId', { websiteId });

      // Delete website versions
      await conn.query('DELETE FROM website_versions WHERE website_id = :websiteId', { websiteId });

      // Delete the website
      const [result] = await conn.query('DELETE FROM websites WHERE id = :websiteId', { websiteId });

      return { success: result.affectedRows > 0 };
    });
  },
};

function generateExportFiles({ websiteName, seo, designSystem, pages }) {
  const primaryColor = designSystem?.colors?.primary ?? '#6366f1';
  const bgColor = designSystem?.colors?.background ?? '#0a0a12';
  const textColor = designSystem?.colors?.text ?? '#ffffff';
  const fontFamily = designSystem?.typography?.fontFamily ?? 'system-ui, -apple-system, sans-serif';

  // Generate navigation links for all pages
  const navLinks = pages.map(page => {
    const filename = page.path === '/' ? 'index.html' : `${page.path.replace(/^\//, '').replace(/\//g, '-')}.html`;
    return { name: page.name, href: filename, path: page.path };
  });

  // Generate separate HTML file for each page
  const files = pages.map(page => {
    const filename = page.path === '/' ? 'index.html' : `${page.path.replace(/^\//, '').replace(/\//g, '-')}.html`;
    const pageTitle = page.path === '/' ? (seo?.title ?? websiteName) : `${page.name} - ${websiteName}`;
    
    const sections = page.builder?.root?.children ?? [];
    
    // Render each section with its containers and columns
    const sectionsHtml = sections.map(section => {
      if (section.type !== 'SECTION') return '';
      
      const sectionStyle = section.style ?? {};
      const sectionBg = sectionStyle.backgroundColor || 'transparent';
      const sectionPadding = sectionStyle.padding || '48px 24px';
      
      const containers = section.children ?? [];
      const containersHtml = containers.map(container => {
        if (container.type !== 'CONTAINER') return '';
        
        const containerStyle = container.style ?? {};
        const maxWidth = containerStyle.maxWidth || '1200px';
        
        const columns = container.children ?? [];
        const columnCount = columns.length || 1;
        
        const columnsHtml = columns.map(column => {
          if (column.type !== 'COLUMN') return '';
          
          const columnStyle = column.style ?? {};
          const widgets = column.children ?? [];
          const widgetsHtml = widgets.map(widget => {
            if (widget.type !== 'WIDGET') return '';
            return renderWidgetToHtml(widget, primaryColor);
          }).join('');
          
          return `<div style="flex: 1; min-width: 0; padding: ${columnStyle.padding || '0'};">${widgetsHtml}</div>`;
        }).join('');
        
        const gridStyle = columnCount > 1 
          ? `display: grid; grid-template-columns: repeat(${columnCount}, 1fr); gap: 24px;`
          : '';
        
        return `<div style="max-width: ${maxWidth}; margin: 0 auto; ${gridStyle}">${columnsHtml}</div>`;
      }).join('');
      
      return `<section style="background: ${sectionBg}; padding: ${sectionPadding};">${containersHtml}</section>`;
    }).join('');

    // Generate navigation HTML
    const navHtml = navLinks.length > 1 ? `
    <nav style="position: sticky; top: 0; z-index: 100; background: ${bgColor}; border-bottom: 1px solid rgba(255,255,255,0.1); padding: 16px 24px;">
      <div style="max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between;">
        <a href="index.html" style="font-weight: 700; font-size: 18px; text-decoration: none;">${websiteName}</a>
        <div style="display: flex; gap: 24px;">
          ${navLinks.map(link => `<a href="${link.href}" style="color: ${link.path === page.path ? 'white' : 'rgba(255,255,255,0.7)'}; text-decoration: none; font-size: 14px;">${link.name}</a>`).join('')}
        </div>
      </div>
    </nav>` : '';

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${pageTitle}</title>
  <meta name="description" content="${seo?.description ?? ''}">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: ${fontFamily};
      background-color: ${bgColor};
      color: ${textColor};
      line-height: 1.6;
    }
    a { color: inherit; text-decoration: none; }
    a:hover { text-decoration: underline; }
    img { max-width: 100%; height: auto; }
    .container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
    @media (max-width: 768px) {
      [style*="grid-template-columns"] {
        grid-template-columns: 1fr !important;
      }
      [style*="display: grid"] {
        display: block !important;
      }
      [style*="display: grid"] > div {
        margin-bottom: 24px;
      }
      nav > div {
        flex-direction: column;
        gap: 16px;
      }
    }
  </style>
</head>
<body>
  ${navHtml}
  
  <main>
    ${sectionsHtml}
  </main>
  
  <footer style="padding: 32px 24px; text-align: center; border-top: 1px solid rgba(255,255,255,0.1);">
    <p style="color: rgba(255,255,255,0.6);">© ${new Date().getFullYear()} ${websiteName}. All rights reserved.</p>
    <p style="color: rgba(255,255,255,0.4); font-size: 12px; margin-top: 8px;">Exported from LaunchWeb</p>
  </footer>
</body>
</html>`;

  // Debug: Log first 500 chars of generated HTML
  console.log(`Generated HTML for ${filename} (first 500 chars):`, html.substring(0, 500));

    return { filename, content: html };
  });

  return files;
}

function renderWidgetToHtml(widget, primaryColor) {
  const type = widget.widgetType;
  const content = widget.content ?? widget.props ?? {};
  const style = widget.style ?? {};

  switch (type) {
    case 'HEADING': {
      const tag = content.tag ?? 'h2';
      const text = content.text ?? '';
      const fontSize = style.fontSize || (tag === 'h1' ? '48px' : tag === 'h2' ? '36px' : tag === 'h3' ? '28px' : '24px');
      const fontWeight = style.fontWeight || '600';
      const textAlign = style.textAlign || 'left';
      const color = style.color || 'inherit';
      return `<${tag} style="font-size: ${fontSize}; font-weight: ${fontWeight}; margin-bottom: 16px; text-align: ${textAlign}; color: ${color};">${text}</${tag}>`;
    }
    
    case 'TEXT':
      return `<p style="margin-bottom: 16px; color: ${style.color || 'rgba(255,255,255,0.8)'}; text-align: ${style.textAlign || 'left'}; font-size: ${style.fontSize || 'inherit'};">${content.text ?? ''}</p>`;
    
    case 'BUTTON': {
      const bgColor = style.backgroundColor || primaryColor;
      const textColor = style.color || '#ffffff';
      const padding = style.padding || '12px 24px';
      const borderRadius = style.borderRadius || '8px';
      return `<a href="${content.link ?? '#'}" style="display: inline-block; padding: ${padding}; background: ${bgColor}; color: ${textColor}; text-decoration: none; border-radius: ${borderRadius}; font-weight: 500; margin: 8px 0;">${content.text ?? 'Button'}</a>`;
    }
    
    case 'IMAGE':
      if (content.src) {
        const borderRadius = style.borderRadius || '12px';
        const width = style.width || '100%';
        return `<img src="${content.src}" alt="${content.alt ?? ''}" style="border-radius: ${borderRadius}; margin: 16px 0; width: ${width}; height: auto; object-fit: cover;">`;
      }
      return '';
    
    case 'DIVIDER':
      return `<hr style="border: none; border-top: ${style.borderWidth || '1px'} solid ${style.borderColor || 'rgba(255,255,255,0.1)'}; margin: 16px 0; width: ${style.width || '100%'};">`;
    
    case 'SPACER':
      return `<div style="height: ${style.height || '50px'};"></div>`;
    
    case 'ICON':
      return `<div style="text-align: ${style.textAlign || 'center'}; font-size: ${style.fontSize || '48px'}; color: ${style.color || primaryColor};">${content.icon || '★'}</div>`;
    
    case 'ICON_BOX':
      return `
        <div style="text-align: ${style.textAlign || 'center'}; padding: 24px;">
          <div style="font-size: ${style.iconSize || '48px'}; color: ${style.iconColor || primaryColor}; margin-bottom: 16px;">${content.icon || '★'}</div>
          <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">${content.title || ''}</h3>
          <p style="color: rgba(255,255,255,0.7);">${content.description || ''}</p>
        </div>
      `;
    
    case 'STAR_RATING': {
      const rating = content.rating || 4;
      const maxRating = content.maxRating || 5;
      const starColor = style.color || '#fbbf24';
      let stars = '';
      for (let i = 0; i < maxRating; i++) {
        stars += `<span style="color: ${i < rating ? starColor : 'rgba(255,255,255,0.2)'}; font-size: ${style.fontSize || '24px'};">★</span>`;
      }
      return `<div style="display: flex; gap: 4px; justify-content: center;">${stars}</div>`;
    }
    
    case 'COUNTER':
      return `
        <div style="text-align: center; padding: 24px;">
          <div style="font-size: ${style.numberSize || '48px'}; font-weight: 700; color: ${style.numberColor || primaryColor};">${content.prefix || ''}${content.endValue ?? 100}${content.suffix || ''}</div>
          <div style="color: rgba(255,255,255,0.6); margin-top: 8px;">${content.title || ''}</div>
        </div>
      `;
    
    case 'PROGRESS_BAR': {
      const percentage = content.percentage || 0;
      return `
        <div style="padding: 8px 0;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="font-size: 14px; font-weight: 500;">${content.title || 'Progress'}</span>
            <span style="font-size: 14px; color: rgba(255,255,255,0.6);">${percentage}%</span>
          </div>
          <div style="width: 100%; background: ${style.backgroundColor || 'rgba(255,255,255,0.1)'}; border-radius: 9999px; height: ${style.height || '8px'}; overflow: hidden;">
            <div style="width: ${percentage}%; height: 100%; background: ${style.barColor || primaryColor}; border-radius: 9999px;"></div>
          </div>
        </div>
      `;
    }
    
    case 'SOCIAL_ICONS': {
      const platformIcons = { facebook: 'f', twitter: '𝕏', instagram: '📷', linkedin: 'in', youtube: '▶' };
      const icons = (content.icons || []).map(icon => 
        `<a href="${icon.url || '#'}" style="width: 40px; height: 40px; border-radius: 50%; background: rgba(255,255,255,0.1); display: inline-flex; align-items: center; justify-content: center; text-decoration: none; color: inherit; font-size: ${style.iconSize || '16px'};">${platformIcons[icon.platform] || '●'}</a>`
      ).join('');
      return `<div style="display: flex; gap: 12px; justify-content: center;">${icons}</div>`;
    }
    
    case 'TESTIMONIAL':
      return `
        <div style="padding: 24px; border-radius: 16px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); text-align: ${style.textAlign || 'center'};">
          ${content.image ? `<img src="${content.image}" alt="${content.name || ''}" style="width: 64px; height: 64px; border-radius: 50%; object-fit: cover; margin: 0 auto 16px;">` : ''}
          <p style="color: rgba(255,255,255,0.8); font-style: italic; margin-bottom: 16px;">"${content.content || ''}"</p>
          <div style="font-weight: 600;">${content.name || ''}</div>
          <div style="font-size: 14px; color: rgba(255,255,255,0.6);">${content.title || ''}</div>
        </div>
      `;
    
    case 'ACCORDION': {
      const items = (content.items || []).map(item => `
        <details style="border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.05); margin-bottom: 8px;">
          <summary style="cursor: pointer; padding: 16px; font-weight: 500; list-style: none;">${item.title || ''}</summary>
          <div style="padding: 0 16px 16px; color: rgba(255,255,255,0.7);">${item.content || ''}</div>
        </details>
      `).join('');
      return `<div style="margin: 16px 0;">${items}</div>`;
    }
    
    case 'TABS': {
      const tabs = content.tabs || [];
      if (tabs.length === 0) return '';
      const tabButtons = tabs.map((tab, i) => 
        `<span style="padding: 8px 16px; font-size: 14px; font-weight: 500; ${i === 0 ? `color: ${primaryColor}; border-bottom: 2px solid ${primaryColor};` : 'color: rgba(255,255,255,0.6);'}">${tab.title}</span>`
      ).join('');
      return `
        <div style="padding: 16px 0;">
          <div style="display: flex; border-bottom: 1px solid rgba(255,255,255,0.1); margin-bottom: 16px;">${tabButtons}</div>
          <div style="padding: 16px; background: rgba(255,255,255,0.05); border-radius: 8px;">${tabs[0]?.content || ''}</div>
        </div>
      `;
    }
    
    case 'NAVBAR': {
      const logoImage = content.logo?.image || content.logoImageUrl;
      const logoText = content.logo?.text || content.logoText || 'Logo';
      const links = (content.links || []).map(link => 
        `<a href="${link.href || '#'}" style="color: rgba(255,255,255,0.7); text-decoration: none; padding: 8px 16px;">${link.label}</a>`
      ).join('');
      const cta = content.cta?.label ? 
        `<a href="${content.cta.href || '#'}" style="padding: 8px 16px; background: ${primaryColor}; color: white; text-decoration: none; border-radius: 8px; font-weight: 500;">${content.cta.label}</a>` : '';
      return `
        <nav style="display: flex; align-items: center; justify-content: space-between; padding: ${style.padding || '16px 0'}; background: ${style.backgroundColor || 'transparent'};">
          <div style="font-weight: 700; font-size: 18px;">
            ${logoImage ? `<img src="${logoImage}" alt="${logoText}" style="height: 40px; width: auto; object-fit: contain;">` : logoText}
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            ${links}
            ${cta}
          </div>
        </nav>
      `;
    }
    
    case 'HERO': {
      const headline = content.headline || content.title || 'Welcome';
      const subheadline = content.subheadline || content.subtitle || '';
      const primaryCta = content.primaryCta;
      const secondaryCta = content.secondaryCta;
      const image = content.image;
      return `
        <div style="padding: ${style.padding || '64px 0'};">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: center;">
            <div>
              <h1 style="font-size: 48px; font-weight: 700; margin-bottom: 16px; line-height: 1.1;">${headline}</h1>
              <p style="font-size: 18px; color: rgba(255,255,255,0.7); margin-bottom: 32px;">${subheadline}</p>
              <div style="display: flex; gap: 16px; flex-wrap: wrap;">
                ${primaryCta?.label ? `<a href="${primaryCta.href || '#'}" style="padding: 14px 28px; background: ${primaryColor}; color: white; text-decoration: none; border-radius: 8px; font-weight: 500;">${primaryCta.label}</a>` : ''}
                ${secondaryCta?.label ? `<a href="${secondaryCta.href || '#'}" style="padding: 14px 28px; border: 1px solid rgba(255,255,255,0.2); color: white; text-decoration: none; border-radius: 8px; font-weight: 500;">${secondaryCta.label}</a>` : ''}
              </div>
            </div>
            <div style="border-radius: 16px; overflow: hidden; min-height: 300px;">
              ${image ? `<img src="${image}" alt="" style="width: 100%; height: 100%; object-fit: cover;">` : `<div style="width: 100%; height: 300px; background: linear-gradient(135deg, ${primaryColor}33, transparent); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px;"></div>`}
            </div>
          </div>
        </div>
      `;
    }
    
    case 'FEATURES': {
      const headline = content.headline || '';
      const items = content.items || [];
      const itemsHtml = items.map(item => `
        <div style="padding: 24px; background: rgba(255,255,255,0.05); border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); text-align: center;">
          <div style="font-size: 32px; margin-bottom: 16px;">${item.icon || '★'}</div>
          <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">${item.title || ''}</h3>
          <p style="color: rgba(255,255,255,0.7); font-size: 14px;">${item.text || item.description || ''}</p>
        </div>
      `).join('');
      return `
        <div style="padding: 48px 0;">
          ${headline ? `<h2 style="font-size: 32px; font-weight: 700; text-align: center; margin-bottom: 40px;">${headline}</h2>` : ''}
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px;">${itemsHtml}</div>
        </div>
      `;
    }
    
    case 'PRICING': {
      const headline = content.headline || '';
      const plans = content.plans || [];
      const plansHtml = plans.map(plan => `
        <div style="padding: 24px; border-radius: 16px; border: 1px solid ${plan.featured ? primaryColor : 'rgba(255,255,255,0.1)'}; background: ${plan.featured ? `${primaryColor}1a` : 'rgba(255,255,255,0.05)'};">
          <h3 style="font-weight: 600; font-size: 18px;">${plan.name || ''}</h3>
          <div style="font-size: 32px; font-weight: 700; margin: 16px 0;">${plan.price || ''}<span style="font-size: 14px; font-weight: 400; color: rgba(255,255,255,0.6);">${plan.period || ''}</span></div>
          <ul style="list-style: none; margin-bottom: 24px;">
            ${(plan.features || []).map(f => `<li style="padding: 8px 0; color: rgba(255,255,255,0.7); font-size: 14px;">✓ ${f}</li>`).join('')}
          </ul>
          ${plan.cta ? `<a href="${plan.cta.href || '#'}" style="display: block; text-align: center; padding: 12px; background: ${plan.featured ? primaryColor : 'rgba(255,255,255,0.1)'}; color: white; text-decoration: none; border-radius: 8px; font-weight: 500;">${plan.cta.label}</a>` : ''}
        </div>
      `).join('');
      return `
        <div style="padding: 48px 0;">
          ${headline ? `<h2 style="font-size: 32px; font-weight: 700; text-align: center; margin-bottom: 40px;">${headline}</h2>` : ''}
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px;">${plansHtml}</div>
        </div>
      `;
    }
    
    case 'FAQ': {
      const headline = content.headline || '';
      const items = content.items || [];
      const faqsHtml = items.map(item => `
        <details style="padding: 16px; background: rgba(255,255,255,0.05); border-radius: 12px; margin-bottom: 8px; border: 1px solid rgba(255,255,255,0.1);">
          <summary style="cursor: pointer; font-weight: 500; list-style: none;">${item.q || item.question || item.title || ''}</summary>
          <p style="margin-top: 12px; color: rgba(255,255,255,0.7);">${item.a || item.answer || item.content || ''}</p>
        </details>
      `).join('');
      return `
        <div style="padding: 48px 0; max-width: 800px; margin: 0 auto;">
          ${headline ? `<h2 style="font-size: 32px; font-weight: 700; text-align: center; margin-bottom: 40px;">${headline}</h2>` : ''}
          ${faqsHtml}
        </div>
      `;
    }
    
    case 'TESTIMONIALS': {
      const headline = content.headline || '';
      const items = content.items || [];
      const testimonialsHtml = items.map(item => `
        <div style="padding: 24px; border-radius: 16px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);">
          <p style="color: rgba(255,255,255,0.8); font-style: italic; margin-bottom: 16px;">"${item.quote || ''}"</p>
          <div style="display: flex; align-items: center; gap: 12px;">
            ${item.image ? `<img src="${item.image}" alt="${item.name || ''}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;">` : ''}
            <div>
              <div style="font-weight: 600;">${item.name || ''}</div>
              <div style="font-size: 14px; color: rgba(255,255,255,0.6);">${item.role || ''}</div>
            </div>
          </div>
        </div>
      `).join('');
      return `
        <div style="padding: 48px 0;">
          ${headline ? `<h2 style="font-size: 32px; font-weight: 700; text-align: center; margin-bottom: 40px;">${headline}</h2>` : ''}
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px;">${testimonialsHtml}</div>
        </div>
      `;
    }
    
    case 'CONTACT_FORM': {
      const headline = content.headline || '';
      const fields = content.fields || [];
      const fieldsHtml = fields.map(field => `
        <div style="margin-bottom: 16px;">
          <label style="display: block; font-size: 14px; color: rgba(255,255,255,0.7); margin-bottom: 4px;">${field.label || ''}</label>
          ${field.type === 'textarea' 
            ? `<textarea placeholder="${field.placeholder || ''}" style="width: 100%; padding: 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: white; min-height: 100px;"></textarea>`
            : `<input type="${field.type || 'text'}" placeholder="${field.placeholder || ''}" style="width: 100%; padding: 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: white;">`
          }
        </div>
      `).join('');
      return `
        <div style="padding: 48px 0; max-width: 600px; margin: 0 auto;">
          ${headline ? `<h2 style="font-size: 24px; font-weight: 700; text-align: center; margin-bottom: 32px;">${headline}</h2>` : ''}
          <form>
            ${fieldsHtml}
            <button type="submit" style="width: 100%; padding: 14px; background: ${primaryColor}; color: white; border: none; border-radius: 8px; font-weight: 500; cursor: pointer;">${content.submitText || 'Submit'}</button>
          </form>
        </div>
      `;
    }
    
    case 'FOOTER': {
      const logoText = content.logo?.text || 'Logo';
      const columns = content.columns || [];
      const copyright = content.copyright || '';
      const socialLinks = content.socialLinks || [];
      const columnsHtml = columns.map(col => `
        <div>
          <h4 style="font-weight: 600; margin-bottom: 16px;">${col.title || ''}</h4>
          <ul style="list-style: none;">
            ${(col.links || []).map(link => `<li style="margin-bottom: 8px;"><a href="${link.href || '#'}" style="color: rgba(255,255,255,0.6); text-decoration: none;">${link.label}</a></li>`).join('')}
          </ul>
        </div>
      `).join('');
      const socialHtml = socialLinks.map(link => 
        `<a href="${link.url || '#'}" style="width: 32px; height: 32px; border-radius: 50%; background: rgba(255,255,255,0.1); display: inline-flex; align-items: center; justify-content: center; text-decoration: none; color: inherit;">${link.platform?.[0]?.toUpperCase() || '●'}</a>`
      ).join('');
      return `
        <footer style="padding: ${style.padding || '48px 0 24px'}; background: ${style.backgroundColor || 'rgba(0,0,0,0.3)'};">
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 32px; margin-bottom: 32px;">
            <div style="font-weight: 700; font-size: 18px;">${logoText}</div>
            ${columnsHtml}
          </div>
          <div style="padding-top: 32px; border-top: 1px solid rgba(255,255,255,0.1); display: flex; justify-content: space-between; align-items: center;">
            <div style="font-size: 14px; color: rgba(255,255,255,0.5);">${copyright}</div>
            <div style="display: flex; gap: 12px;">${socialHtml}</div>
          </div>
        </footer>
      `;
    }
    
    case 'VIDEO':
      if (!content.url) return '';
      return `
        <div style="aspect-ratio: ${style.aspectRatio || '16/9'}; border-radius: ${style.borderRadius || '12px'}; overflow: hidden;">
          <iframe src="${content.url}" style="width: 100%; height: 100%; border: none;" allowfullscreen></iframe>
        </div>
      `;
    
    case 'GALLERY': {
      const images = content.images || [];
      if (images.length === 0) return '';
      const columns = content.columns || 3;
      const gap = content.gap || '16px';
      const imagesHtml = images.map(img => `
        <div style="aspect-ratio: 1; border-radius: 8px; overflow: hidden;">
          <img src="${img.src || img}" alt="${img.alt || ''}" style="width: 100%; height: 100%; object-fit: cover;">
        </div>
      `).join('');
      return `<div style="display: grid; grid-template-columns: repeat(${columns}, 1fr); gap: ${gap};">${imagesHtml}</div>`;
    }
    
    case 'CAROUSEL': {
      const slides = content.slides || [];
      if (slides.length === 0) return '';
      const slidesHtml = slides.map((slide, i) => `
        <div style="flex: 0 0 100%; ${i > 0 ? 'display: none;' : ''}">
          <div style="aspect-ratio: 16/9; position: relative; border-radius: 12px; overflow: hidden;">
            ${slide.image ? `<img src="${slide.image}" alt="${slide.title || ''}" style="width: 100%; height: 100%; object-fit: cover;">` : `<div style="width: 100%; height: 100%; background: linear-gradient(135deg, ${primaryColor}33, transparent);"></div>`}
            <div style="position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.6), transparent);"></div>
            <div style="position: absolute; bottom: 0; left: 0; right: 0; padding: 24px;">
              <h3 style="font-size: 20px; font-weight: 700; margin-bottom: 8px;">${slide.title || ''}</h3>
              ${slide.description ? `<p style="color: rgba(255,255,255,0.7);">${slide.description}</p>` : ''}
            </div>
          </div>
        </div>
      `).join('');
      return `
        <div style="position: relative; border-radius: 12px; overflow: hidden;">
          <div style="display: flex;">${slidesHtml}</div>
          ${content.dots !== false && slides.length > 1 ? `<div style="position: absolute; bottom: 16px; left: 50%; transform: translateX(-50%); display: flex; gap: 8px;">${slides.map((_, i) => `<span style="width: 8px; height: 8px; border-radius: 50%; background: ${i === 0 ? 'white' : 'rgba(255,255,255,0.4)'};"></span>`).join('')}</div>` : ''}
        </div>
      `;
    }
    
    case 'LOGO_CLOUD': {
      const label = content.label || 'Trusted by';
      const logos = content.logos || [];
      const logosHtml = logos.map(logo => `
        <div style="height: 32px; padding: 0 16px; background: rgba(255,255,255,0.05); border-radius: 8px; display: inline-flex; align-items: center; justify-content: center;">
          ${logo.src ? `<img src="${logo.src}" alt="${logo.alt || ''}" style="height: 24px; object-fit: contain; opacity: 0.6;">` : `<span style="color: rgba(255,255,255,0.4); font-size: 14px;">${logo.alt || 'Logo'}</span>`}
        </div>
      `).join('');
      return `
        <div style="padding: 32px 0; text-align: center;">
          <div style="font-size: 14px; color: rgba(255,255,255,0.5); margin-bottom: 24px;">${label}</div>
          <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 32px; align-items: center;">${logosHtml}</div>
        </div>
      `;
    }
    
    case 'CARDS': {
      const cards = content.cards || [];
      const cardsHtml = cards.map(card => `
        <div style="border-radius: 16px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); overflow: hidden;">
          ${card.image ? `<div style="aspect-ratio: 16/9;"><img src="${card.image}" alt="${card.title || ''}" style="width: 100%; height: 100%; object-fit: cover;"></div>` : ''}
          <div style="padding: 24px;">
            <h3 style="font-weight: 600; margin-bottom: 8px;">${card.title || ''}</h3>
            <p style="font-size: 14px; color: rgba(255,255,255,0.7); margin-bottom: 16px;">${card.text || ''}</p>
            ${card.cta ? `<a href="${card.cta.href || '#'}" style="color: ${primaryColor}; font-size: 14px; font-weight: 500; text-decoration: none;">${card.cta.label} →</a>` : ''}
          </div>
        </div>
      `).join('');
      return `<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px;">${cardsHtml}</div>`;
    }
    
    case 'STATS': {
      const items = content.items || [];
      const statsHtml = items.map(item => `
        <div style="text-align: center; padding: 24px;">
          <div style="font-size: 40px; font-weight: 700; color: ${primaryColor}; margin-bottom: 8px;">${item.value || ''}</div>
          <div style="color: rgba(255,255,255,0.6);">${item.label || ''}</div>
        </div>
      `).join('');
      return `<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 24px;">${statsHtml}</div>`;
    }
    
    case 'CTA': {
      const headline = content.headline || '';
      const description = content.description || '';
      const primaryCta = content.primaryCta;
      const secondaryCta = content.secondaryCta;
      return `
        <div style="padding: ${style.padding || '48px'}; background: ${style.backgroundColor || `${primaryColor}1a`}; border-radius: ${style.borderRadius || '16px'}; text-align: center;">
          <h2 style="font-size: 32px; font-weight: 700; margin-bottom: 16px;">${headline}</h2>
          <p style="color: rgba(255,255,255,0.7); margin-bottom: 24px; max-width: 600px; margin-left: auto; margin-right: auto;">${description}</p>
          <div style="display: flex; gap: 16px; justify-content: center;">
            ${primaryCta?.label ? `<a href="${primaryCta.href || '#'}" style="padding: 14px 28px; background: ${primaryColor}; color: white; text-decoration: none; border-radius: 8px; font-weight: 500;">${primaryCta.label}</a>` : ''}
            ${secondaryCta?.label ? `<a href="${secondaryCta.href || '#'}" style="padding: 14px 28px; border: 1px solid rgba(255,255,255,0.2); color: white; text-decoration: none; border-radius: 8px; font-weight: 500;">${secondaryCta.label}</a>` : ''}
          </div>
        </div>
      `;
    }
    
    case 'TEAM': {
      const headline = content.headline || '';
      const members = content.members || [];
      const membersHtml = members.map(member => `
        <div style="text-align: center; padding: 24px; border-radius: 16px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);">
          ${member.image 
            ? `<img src="${member.image}" alt="${member.name || ''}" style="width: 96px; height: 96px; border-radius: 50%; object-fit: cover; margin: 0 auto 16px;">`
            : `<div style="width: 96px; height: 96px; border-radius: 50%; background: linear-gradient(135deg, ${primaryColor}, #a855f7); margin: 0 auto 16px; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 700;">${member.name?.charAt(0) || '?'}</div>`
          }
          <h3 style="font-weight: 600; font-size: 18px;">${member.name || ''}</h3>
          <div style="font-size: 14px; color: ${primaryColor}; margin-bottom: 8px;">${member.role || ''}</div>
          ${member.bio ? `<p style="font-size: 14px; color: rgba(255,255,255,0.6);">${member.bio}</p>` : ''}
        </div>
      `).join('');
      return `
        <div style="padding: 48px 0;">
          ${headline ? `<h2 style="font-size: 32px; font-weight: 700; text-align: center; margin-bottom: 40px;">${headline}</h2>` : ''}
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 24px;">${membersHtml}</div>
        </div>
      `;
    }
    
    case 'IMAGE_BOX':
      return `
        <div style="border-radius: 16px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); overflow: hidden; text-align: ${style.textAlign || 'center'};">
          ${content.src 
            ? `<div style="aspect-ratio: 16/9;"><img src="${content.src}" alt="${content.title || ''}" style="width: 100%; height: 100%; object-fit: cover;"></div>`
            : `<div style="aspect-ratio: 16/9; background: rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: center;"><span style="color: rgba(255,255,255,0.3); font-size: 32px;">🖼</span></div>`
          }
          <div style="padding: 24px;">
            <h3 style="font-weight: 600; font-size: 18px; margin-bottom: 8px;">${content.title || ''}</h3>
            <p style="font-size: 14px; color: rgba(255,255,255,0.7);">${content.description || ''}</p>
          </div>
        </div>
      `;
    
    case 'PRODUCT_GRID': {
      const headline = content.headline || '';
      const subheadline = content.subheadline || '';
      const products = content.products || [];
      const cta = content.cta;
      const productsHtml = products.map(product => `
        <div style="border-radius: 16px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); overflow: hidden;">
          <div style="aspect-ratio: 1; position: relative;">
            ${product.imageUrl || product.image 
              ? `<img src="${product.imageUrl || product.image}" alt="${product.name || ''}" style="width: 100%; height: 100%; object-fit: cover;">`
              : `<div style="width: 100%; height: 100%; background: rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: center;"><span style="color: rgba(255,255,255,0.3); font-size: 32px;">🛍</span></div>`
            }
            ${product.badge ? `<span style="position: absolute; top: 8px; left: 8px; padding: 4px 8px; font-size: 12px; border-radius: 4px; background: rgba(255,255,255,0.2); backdrop-filter: blur(4px);">${product.badge}</span>` : ''}
          </div>
          <div style="padding: 16px;">
            <h3 style="font-weight: 600; margin-bottom: 4px;">${product.name || 'Product'}</h3>
            ${product.description ? `<p style="font-size: 14px; color: rgba(255,255,255,0.6); margin-bottom: 8px;">${product.description}</p>` : ''}
            ${product.price ? `<div style="font-weight: 700; color: ${primaryColor};">${product.price}</div>` : ''}
            ${product.cta?.label ? `<a href="${product.cta.href || '#'}" style="display: inline-block; margin-top: 12px; padding: 8px 16px; background: ${primaryColor}; color: white; text-decoration: none; border-radius: 6px; font-size: 14px; font-weight: 500;">${product.cta.label}</a>` : ''}
          </div>
        </div>
      `).join('');
      return `
        <div style="padding: 48px 0;">
          ${headline ? `<h2 style="font-size: 32px; font-weight: 700; margin-bottom: 8px;">${headline}</h2>` : ''}
          ${subheadline ? `<p style="color: rgba(255,255,255,0.7); margin-bottom: 32px;">${subheadline}</p>` : ''}
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 24px;">${productsHtml}</div>
          ${cta?.label ? `<div style="text-align: center; margin-top: 32px;"><a href="${cta.href || '#'}" style="display: inline-block; padding: 14px 28px; background: ${primaryColor}; color: white; text-decoration: none; border-radius: 8px; font-weight: 500;">${cta.label}</a></div>` : ''}
        </div>
      `;
    }
    
    case 'FILTER_TABS': {
      const headline = content.headline || '';
      const subheadline = content.subheadline || '';
      const tabs = content.tabs || [];
      const products = content.products || [];
      const tabsHtml = tabs.map((tab, i) => 
        `<span style="padding: 8px 16px; font-size: 14px; font-weight: 500; border-radius: 8px; ${i === 0 ? `background: ${primaryColor}; color: white;` : 'background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.7);'}">${tab.label || tab}</span>`
      ).join('');
      const productsHtml = products.slice(0, 6).map(product => `
        <div style="border-radius: 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); overflow: hidden;">
          ${product.imageUrl || product.image ? `<img src="${product.imageUrl || product.image}" alt="${product.name || ''}" style="width: 100%; aspect-ratio: 16/9; object-fit: cover;">` : ''}
          <div style="padding: 16px;">
            <h3 style="font-weight: 600;">${product.name || ''}</h3>
            ${product.description ? `<p style="font-size: 14px; color: rgba(255,255,255,0.6); margin-top: 4px;">${product.description}</p>` : ''}
            ${product.price ? `<div style="font-weight: 700; color: ${primaryColor}; margin-top: 8px;">${product.price}</div>` : ''}
          </div>
        </div>
      `).join('');
      return `
        <div style="padding: 48px 0;">
          ${headline ? `<h2 style="font-size: 32px; font-weight: 700; text-align: center; margin-bottom: 8px;">${headline}</h2>` : ''}
          ${subheadline ? `<p style="color: rgba(255,255,255,0.7); text-align: center; margin-bottom: 32px;">${subheadline}</p>` : ''}
          ${tabs.length > 0 ? `<div style="display: flex; justify-content: center; gap: 8px; margin-bottom: 32px;">${tabsHtml}</div>` : ''}
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px;">${productsHtml}</div>
        </div>
      `;
    }
    
    case 'ADVANCED_NAVBAR': {
      const logoText = content.logo?.text || content.logoText || 'Logo';
      const logoImage = content.logo?.image || content.logoImageUrl;
      const links = (content.links || []).map(link => 
        `<a href="${link.href || '#'}" style="color: rgba(255,255,255,0.7); text-decoration: none; font-size: 14px;">${link.label}</a>`
      ).join('');
      const ctas = (content.ctas || []).map(cta => 
        `<a href="${cta.href || '#'}" style="padding: 8px 16px; ${cta.variant === 'primary' ? `background: ${primaryColor};` : 'background: rgba(255,255,255,0.1);'} color: white; text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 500;">${cta.label}</a>`
      ).join('');
      return `
        <nav style="display: flex; align-items: center; justify-content: space-between; padding: 16px 24px; background: rgba(255,255,255,0.05); border-radius: 12px;">
          <div style="display: flex; align-items: center; gap: 32px;">
            <div style="font-weight: 700; font-size: 18px;">${logoImage ? `<img src="${logoImage}" alt="${logoText}" style="height: 40px; width: auto;">` : logoText}</div>
            <div style="display: flex; align-items: center; gap: 24px;">${links}</div>
          </div>
          <div style="display: flex; align-items: center; gap: 12px;">
            ${content.showSearch ? `<div style="width: 32px; height: 32px; border-radius: 50%; background: rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center;">🔍</div>` : ''}
            ${ctas}
          </div>
        </nav>
      `;
    }
    
    case 'CONTENT': {
      const title = content.title || '';
      const text = content.paragraphs?.[0] || content.body || content.text || '';
      return `
        <div style="padding: 48px 0;">
          ${title ? `<h2 style="font-size: 28px; font-weight: 700; margin-bottom: 16px;">${title}</h2>` : ''}
          <div style="color: rgba(255,255,255,0.7); line-height: 1.8;">${text}</div>
        </div>
      `;
    }
    
    case 'FEATURE_CAROUSEL':
    case 'MULTI_ROW_CAROUSEL':
    case 'IMAGE_CAROUSEL': {
      const headline = content.headline || '';
      const items = content.items || content.rows?.[0]?.items || content.slides || [];
      const itemsHtml = items.slice(0, 4).map(item => `
        <div style="flex: 0 0 250px; border-radius: 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); overflow: hidden;">
          ${item.image || item.imageUrl || item.src ? `<img src="${item.image || item.imageUrl || item.src}" alt="${item.title || ''}" style="width: 100%; aspect-ratio: 16/9; object-fit: cover;">` : ''}
          <div style="padding: 16px;">
            <h3 style="font-weight: 600;">${item.title || ''}</h3>
            ${item.description || item.tagline ? `<p style="font-size: 14px; color: rgba(255,255,255,0.6); margin-top: 4px;">${item.description || item.tagline}</p>` : ''}
          </div>
        </div>
      `).join('');
      return `
        <div style="padding: 48px 0;">
          ${headline ? `<h2 style="font-size: 32px; font-weight: 700; text-align: center; margin-bottom: 32px;">${headline}</h2>` : ''}
          <div style="display: flex; gap: 16px; overflow-x: auto; padding-bottom: 16px;">${itemsHtml}</div>
        </div>
      `;
    }
    
    case 'FOOTER_LINKS': {
      const brand = content.brand || '';
      const description = content.description || '';
      const columns = content.columns || [];
      const copyright = content.copyright || '';
      const columnsHtml = columns.map(col => `
        <div>
          <h4 style="font-weight: 600; margin-bottom: 16px;">${col.title || ''}</h4>
          <ul style="list-style: none;">
            ${(col.links || []).map(link => `<li style="margin-bottom: 8px;"><a href="${link.href || '#'}" style="color: rgba(255,255,255,0.6); text-decoration: none; font-size: 14px;">${link.label}</a></li>`).join('')}
          </ul>
        </div>
      `).join('');
      return `
        <div style="padding: 32px 0;">
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 32px;">
            ${brand ? `<div><div style="font-weight: 700; font-size: 18px; margin-bottom: 8px;">${brand}</div>${description ? `<p style="font-size: 14px; color: rgba(255,255,255,0.6);">${description}</p>` : ''}</div>` : ''}
            ${columnsHtml}
          </div>
          ${copyright ? `<div style="margin-top: 32px; padding-top: 32px; border-top: 1px solid rgba(255,255,255,0.1); font-size: 14px; color: rgba(255,255,255,0.5);">${copyright}</div>` : ''}
        </div>
      `;
    }
    
    case 'ICON_LIST': {
      const items = content.items || [];
      const itemsHtml = items.map(item => `
        <li style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
          <span style="color: ${primaryColor};">${item.icon || '✓'}</span>
          <span>${item.text || item.label || ''}</span>
        </li>
      `).join('');
      return `<ul style="list-style: none;">${itemsHtml}</ul>`;
    }
    
    case 'MENU': {
      const items = content.items || content.links || [];
      const itemsHtml = items.map(item => 
        `<a href="${item.href || '#'}" style="color: rgba(255,255,255,0.7); text-decoration: none;">${item.label}</a>`
      ).join('');
      return `<nav style="display: flex; gap: 24px;">${itemsHtml}</nav>`;
    }
    
    case 'BREADCRUMBS': {
      const items = content.items || [{ label: 'Home' }, { label: 'Page' }];
      const separator = content.separator || '/';
      const itemsHtml = items.map((item, i) => `
        <span style="display: flex; align-items: center; gap: 8px;">
          <a href="${item.href || '#'}" style="color: ${i === items.length - 1 ? 'white' : 'rgba(255,255,255,0.6)'}; text-decoration: none;">${item.label}</a>
          ${i < items.length - 1 ? `<span style="color: rgba(255,255,255,0.4);">${separator}</span>` : ''}
        </span>
      `).join('');
      return `<nav style="display: flex; align-items: center; gap: 8px; font-size: 14px;">${itemsHtml}</nav>`;
    }
    
    case 'PAGE_HEADER': {
      const title = content.title || 'Page Title';
      const subtitle = content.subtitle || '';
      const bgImage = content.backgroundImage;
      return `
        <div style="padding: 48px 0; text-align: center; ${bgImage ? `background-image: url(${bgImage}); background-size: cover; background-position: center;` : ''}">
          <h1 style="font-size: 40px; font-weight: 700; margin-bottom: 16px;">${title}</h1>
          ${subtitle ? `<p style="font-size: 18px; color: rgba(255,255,255,0.7);">${subtitle}</p>` : ''}
        </div>
      `;
    }
    
    case 'CALL_TO_ACTION': {
      const headline = content.headline || 'Ready to get started?';
      const text = content.text || content.description || '';
      const primaryCta = content.primaryCta;
      const secondaryCta = content.secondaryCta;
      return `
        <div style="padding: 64px 32px; background: linear-gradient(135deg, ${primaryColor}33, transparent); border-radius: 16px; text-align: center;">
          <h2 style="font-size: 32px; font-weight: 700; margin-bottom: 16px;">${headline}</h2>
          ${text ? `<p style="color: rgba(255,255,255,0.7); margin-bottom: 32px; max-width: 600px; margin-left: auto; margin-right: auto;">${text}</p>` : ''}
          <div style="display: flex; gap: 16px; justify-content: center;">
            ${primaryCta?.label ? `<a href="${primaryCta.href || '#'}" style="padding: 14px 28px; background: ${primaryColor}; color: white; text-decoration: none; border-radius: 8px; font-weight: 500;">${primaryCta.label}</a>` : ''}
            ${secondaryCta?.label ? `<a href="${secondaryCta.href || '#'}" style="padding: 14px 28px; border: 1px solid rgba(255,255,255,0.2); color: white; text-decoration: none; border-radius: 8px; font-weight: 500;">${secondaryCta.label}</a>` : ''}
          </div>
        </div>
      `;
    }
    
    case 'STATS_CTA': {
      const headline = content.headline || '';
      const subheadline = content.subheadline || '';
      const stats = content.items || content.stats || [];
      const primaryCta = content.primaryCta;
      const statsHtml = stats.map(stat => `
        <div style="text-align: center;">
          <div style="font-size: 40px; font-weight: 700; color: ${primaryColor};">${stat.value}</div>
          <div style="color: rgba(255,255,255,0.6); margin-top: 4px;">${stat.label}</div>
        </div>
      `).join('');
      return `
        <div style="padding: 48px 0;">
          ${headline ? `<h2 style="font-size: 32px; font-weight: 700; text-align: center; margin-bottom: 8px;">${headline}</h2>` : ''}
          ${subheadline ? `<p style="color: rgba(255,255,255,0.7); text-align: center; margin-bottom: 32px;">${subheadline}</p>` : ''}
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 32px; margin-bottom: 32px;">${statsHtml}</div>
          ${primaryCta?.label ? `<div style="text-align: center;"><a href="${primaryCta.href || '#'}" style="display: inline-block; padding: 14px 28px; background: ${primaryColor}; color: white; text-decoration: none; border-radius: 8px; font-weight: 500;">${primaryCta.label}</a></div>` : ''}
        </div>
      `;
    }
    
    case 'ICON_CARDS': {
      const cards = content.cards || content.items || [];
      const cardsHtml = cards.map(card => `
        <div style="padding: 24px; border-radius: 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); text-align: center;">
          <div style="font-size: 32px; margin-bottom: 16px;">${card.icon || '★'}</div>
          <h3 style="font-weight: 600; margin-bottom: 8px;">${card.title || ''}</h3>
          <p style="font-size: 14px; color: rgba(255,255,255,0.7);">${card.description || card.text || ''}</p>
        </div>
      `).join('');
      return `<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 24px;">${cardsHtml}</div>`;
    }
    
    case 'ABOUT': {
      const headline = content.headline || 'About Us';
      const text = content.text || content.description || '';
      const image = content.image;
      const cta = content.cta;
      return `
        <div style="padding: 48px 0; display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: center;">
          <div>
            ${image 
              ? `<img src="${image}" alt="About" style="width: 100%; border-radius: 16px;">`
              : `<div style="aspect-ratio: 16/9; background: rgba(255,255,255,0.05); border-radius: 16px; display: flex; align-items: center; justify-content: center;"><span style="color: rgba(255,255,255,0.3); font-size: 32px;">🖼</span></div>`
            }
          </div>
          <div>
            <h2 style="font-size: 32px; font-weight: 700; margin-bottom: 16px;">${headline}</h2>
            <p style="color: rgba(255,255,255,0.7); margin-bottom: 24px; line-height: 1.8;">${text}</p>
            ${cta?.label ? `<a href="${cta.href || '#'}" style="display: inline-block; padding: 14px 28px; background: ${primaryColor}; color: white; text-decoration: none; border-radius: 8px; font-weight: 500;">${cta.label}</a>` : ''}
          </div>
        </div>
      `;
    }
    
    case 'REVIEWS': {
      const headline = content.headline || '';
      const reviews = content.reviews || content.items || [];
      const reviewsHtml = reviews.map(review => `
        <div style="padding: 24px; border-radius: 16px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);">
          <div style="display: flex; gap: 4px; margin-bottom: 12px;">
            ${Array.from({ length: review.rating || 5 }).map(() => `<span style="color: #fbbf24;">★</span>`).join('')}
          </div>
          <p style="color: rgba(255,255,255,0.8); margin-bottom: 16px;">"${review.text || review.content || ''}"</p>
          <div style="font-weight: 600;">${review.name || review.author || ''}</div>
        </div>
      `).join('');
      return `
        <div style="padding: 48px 0;">
          ${headline ? `<h2 style="font-size: 32px; font-weight: 700; text-align: center; margin-bottom: 40px;">${headline}</h2>` : ''}
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px;">${reviewsHtml}</div>
        </div>
      `;
    }
    
    case 'TOGGLE': {
      const items = content.items || [{ label: content.label || 'Toggle option' }];
      const itemsHtml = items.map(item => `
        <div style="padding: 16px; border-radius: 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
          <span style="font-weight: 500;">${item.title || item.label || ''}</span>
          <div style="width: 48px; height: 24px; border-radius: 12px; background: ${primaryColor}; position: relative;">
            <div style="position: absolute; right: 4px; top: 4px; width: 16px; height: 16px; border-radius: 50%; background: white;"></div>
          </div>
        </div>
      `).join('');
      return `<div>${itemsHtml}</div>`;
    }
    
    case 'TESTIMONIAL_SLIDER': {
      const testimonials = content.items || content.testimonials || [];
      if (testimonials.length === 0) return '';
      const first = testimonials[0];
      const dotsHtml = testimonials.length > 1 
        ? `<div style="display: flex; justify-content: center; gap: 8px; margin-top: 24px;">${testimonials.map((_, i) => `<span style="width: 8px; height: 8px; border-radius: 50%; background: ${i === 0 ? 'white' : 'rgba(255,255,255,0.4)'};"></span>`).join('')}</div>` 
        : '';
      return `
        <div style="padding: 48px 0; text-align: center;">
          <div style="max-width: 600px; margin: 0 auto;">
            <p style="font-size: 20px; font-style: italic; color: rgba(255,255,255,0.8); margin-bottom: 24px;">"${first.quote || first.content || ''}"</p>
            <div style="font-weight: 600;">${first.name || ''}</div>
            <div style="font-size: 14px; color: rgba(255,255,255,0.6);">${first.role || ''}</div>
          </div>
          ${dotsHtml}
        </div>
      `;
    }
    
    case 'NEWSLETTER': {
      const headline = content.headline || 'Subscribe to our newsletter';
      const description = content.description || '';
      const placeholder = content.placeholder || 'Enter your email';
      const buttonLabel = content.buttonLabel || content.buttonText || 'Subscribe';
      return `
        <div style="padding: 48px 0; text-align: center;">
          <h2 style="font-size: 28px; font-weight: 700; margin-bottom: 16px;">${headline}</h2>
          ${description ? `<p style="color: rgba(255,255,255,0.7); margin-bottom: 24px;">${description}</p>` : ''}
          <form style="display: flex; gap: 8px; max-width: 400px; margin: 0 auto;">
            <input type="email" placeholder="${placeholder}" style="flex: 1; padding: 12px 16px; border-radius: 8px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: white;">
            <button type="submit" style="padding: 12px 24px; background: ${primaryColor}; color: white; border: none; border-radius: 8px; font-weight: 500; cursor: pointer;">${buttonLabel}</button>
          </form>
        </div>
      `;
    }
    
    case 'SEARCH_BOX': {
      const placeholder = content.placeholder || 'Search...';
      return `
        <div style="position: relative;">
          <input type="text" placeholder="${placeholder}" style="width: 100%; padding: 12px 16px 12px 40px; border-radius: 8px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: white;">
          <span style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: rgba(255,255,255,0.4);">🔍</span>
        </div>
      `;
    }
    
    case 'COPYRIGHT': {
      const text = content.text || `© ${new Date().getFullYear()} Company. All rights reserved.`;
      return `<div style="padding: 16px 0; text-align: center; font-size: 14px; color: rgba(255,255,255,0.5);">${text}</div>`;
    }
    
    case 'PRICE_TABLE': {
      const headline = content.headline || '';
      const plans = content.plans || [];
      const features = content.features || [];
      if (plans.length === 0) return '';
      const headerHtml = `<tr style="border-bottom: 1px solid rgba(255,255,255,0.1);"><th style="padding: 16px; text-align: left;">Feature</th>${plans.map(plan => `<th style="padding: 16px; text-align: center;"><div>${plan.name || ''}</div><div style="font-size: 18px; font-weight: 700;">${plan.price || ''}</div></th>`).join('')}</tr>`;
      const featuresHtml = (features.length > 0 ? features : (plans[0]?.features || []).map(f => ({ name: f }))).map(feature => `
        <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
          <td style="padding: 16px;">${typeof feature === 'string' ? feature : feature.name || ''}</td>
          ${plans.map(() => `<td style="padding: 16px; text-align: center;">✓</td>`).join('')}
        </tr>
      `).join('');
      return `
        <div style="padding: 48px 0;">
          ${headline ? `<h2 style="font-size: 32px; font-weight: 700; text-align: center; margin-bottom: 40px;">${headline}</h2>` : ''}
          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse;">
              <thead>${headerHtml}</thead>
              <tbody>${featuresHtml}</tbody>
            </table>
          </div>
        </div>
      `;
    }
    
    default:
      return '';
  }
}
