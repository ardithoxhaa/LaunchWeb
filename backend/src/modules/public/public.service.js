import { pool } from '../../config/db.js';
import { notFound } from '../../utils/httpError.js';

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

function collectWidgetNodesInRenderOrder(builder) {
  const root = builder?.root;
  if (!root) return [];

  const widgets = [];

  function walk(node) {
    if (!node) return;
    if (node.type === 'WIDGET') {
      widgets.push(node);
    }
    const children = Array.isArray(node.children) ? node.children : [];
    for (const ch of children) walk(ch);
  }

  walk(root);
  return widgets;
}

function widgetNodesToFlatComponents(widgetNodes) {
  return (widgetNodes ?? []).map((n, idx) => ({
    id: n.id,
    type: n.widgetType,
    orderIndex: idx,
    props: n.props ?? {},
    styles: n.style ?? {},
  }));
}

async function listPagesWithBuilder({ conn, websiteId }) {
  // Get page metadata first (without large builder_json to avoid MySQL sort memory issues)
  const [pagesMeta] = await conn.query(
    'SELECT id, website_id, name, path, sort_order, meta_json FROM pages WHERE website_id = :websiteId ORDER BY sort_order ASC, id ASC',
    { websiteId }
  );

  if (pagesMeta.length === 0) return [];

  // Fetch builder_json separately (no sorting needed)
  const pageIds = pagesMeta.map((p) => p.id);
  const [builderRows] = await conn.query(
    `SELECT id, builder_json FROM pages WHERE id IN (${pageIds.map(() => '?').join(',')})`,
    pageIds
  );
  
  const builderMap = new Map();
  for (const row of builderRows) {
    builderMap.set(row.id, row.builder_json);
  }
  
  const pages = pagesMeta.map(p => ({
    ...p,
    builder_json: builderMap.get(p.id) || null
  }));

  return pages.map((p) => {
    const builder = parseJsonMaybe(p.builder_json, null);
    let components = [];

    if (builder) {
      const widgets = collectWidgetNodesInRenderOrder(builder);
      components = widgetNodesToFlatComponents(widgets);
    }

    return {
      id: p.id,
      name: p.name,
      path: p.path,
      sortOrder: p.sort_order,
      meta: parseJsonMaybe(p.meta_json, {}),
      builder,
      components,
    };
  });
}

export const publicService = {
  async getPublishedWebsiteStructureBySlug({ slug, trackView = true }) {
    const [rows] = await pool.query(
      "SELECT id, business_id, template_id, name, slug, status, settings_json, seo_json FROM websites WHERE slug = :slug AND status = 'PUBLISHED'",
      { slug }
    );

    const website = rows?.[0];
    if (!website) throw notFound('Published website not found');

    // Track view count (fire and forget, don't block response)
    if (trackView) {
      pool.query(
        'UPDATE websites SET view_count = COALESCE(view_count, 0) + 1, last_viewed_at = NOW() WHERE id = :id',
        { id: website.id }
      ).catch(() => {});
    }

    const pages = await listPagesWithBuilder({ conn: pool, websiteId: website.id });

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
};
