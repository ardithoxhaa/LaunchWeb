import { pool } from '../../config/db.js';
import { notFound } from '../../utils/httpError.js';

async function listPagesWithComponents({ conn, websiteId }) {
  const [pages] = await conn.query(
    'SELECT id, website_id, name, path, sort_order, meta_json FROM pages WHERE website_id = :websiteId ORDER BY sort_order ASC, id ASC',
    { websiteId }
  );

  if (pages.length === 0) return [];

  const pageIds = pages.map((p) => p.id);
  const [components] = await conn.query(
    `SELECT id, page_id, type, order_index, props_json, style_json
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
    meta: p.meta_json,
    components: (byPage.get(p.id) ?? []).map((c) => ({
      id: c.id,
      type: c.type,
      orderIndex: c.order_index,
      props: c.props_json,
      styles: c.style_json,
    })),
  }));
}

export const publicService = {
  async getPublishedWebsiteStructureBySlug({ slug }) {
    const [rows] = await pool.query(
      "SELECT id, business_id, template_id, name, slug, status, settings_json, seo_json FROM websites WHERE slug = :slug AND status = 'PUBLISHED'",
      { slug }
    );

    const website = rows?.[0];
    if (!website) throw notFound('Published website not found');

    const pages = await listPagesWithComponents({ conn: pool, websiteId: website.id });

    return {
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
      pages,
    };
  },
};
