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

export const templatesService = {
  async listTemplates() {
    const [rows] = await pool.query(
      'SELECT id, name, category, preview_image_url, created_at, updated_at FROM templates ORDER BY created_at DESC'
    );
    return rows;
  },

  async getTemplateById(id) {
    const [rows] = await pool.query(
      'SELECT id, name, category, preview_image_url, structure_json, created_at, updated_at FROM templates WHERE id = :id',
      { id }
    );
    const tpl = rows?.[0];
    if (!tpl) throw notFound('Template not found');
    return tpl;
  },

  async getTemplatePreviewById(id) {
    const tpl = await this.getTemplateById(id);
    const structure = parseJsonMaybe(tpl.structure_json, {});
    const enhanced = enhanceTemplateStructure({
      structure,
      templateName: tpl.name,
      category: tpl.category,
    });

    return {
      template: {
        id: tpl.id,
        name: tpl.name,
        category: tpl.category,
        preview_image_url: tpl.preview_image_url,
      },
      pages: enhanced?.pages ?? [],
    };
  },
};
