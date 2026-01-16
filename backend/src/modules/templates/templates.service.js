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

// Import industry images from AI chat service
const INDUSTRY_IMAGES = {
  restaurant: [
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200',
    'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1200',
    'https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=1200',
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200',
    'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=1200',
  ],
  portfolio: [
    'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200',
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200',
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200',
    'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200',
    'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200',
    'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200',
  ],
  saas: [
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200',
    'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200',
    'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200',
    'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200',
  ],
  ecommerce: [
    'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200',
    'https://images.unsplash.com/photo-1472851294608-61862f281c3d?w=1200',
    'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200',
    'https://images.unsplash.com/photo-1448630360428-65456885c650?w=1200',
    'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200',
    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200',
  ],
  agency: [
    'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200',
    'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200',
    'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200',
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200',
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200',
    'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200',
  ],
  medical: [
    'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200',
    'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200',
    'https://images.unsplash.com/photo-1551190822-a933d811c8e1?w=1200',
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200',
    'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=1200',
    'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=1200',
  ],
  fitness: [
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200',
    'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200',
    'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1200',
    'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1200',
    'https://images.unsplash.com/photo-1550345332-09e3ac987658?w=1200',
    'https://images.unsplash.com/photo-1517851905240-472988babdf9?w=1200',
  ],
  realestate: [
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200',
    'https://images.unsplash.com/photo-1564013799919-600e31696d0c?w=1200',
    'https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=1200',
    'https://images.unsplash.com/photo-1448630360428-65456885c650?w=1200',
    'https://images.unsplash.com/photo-1512917770080-f791ba4474f6?w=1200',
    'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1200',
  ],
  education: [
    'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200',
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200',
    'https://images.unsplash.com/photo-1581078426770-6b3f38f94d8e?w=1200',
    'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200',
    'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200',
    'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200',
  ],
  default: [
    'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200',
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200',
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200',
    'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200',
    'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200',
    'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200',
  ],
};

function getCategoryImages(category) {
  const categoryMap = {
    'Restaurant': 'restaurant',
    'Ecommerce': 'ecommerce',
    'Marketplace': 'ecommerce',
    'Sports': 'fitness',
    'Apparel': 'ecommerce',
    'Portfolio': 'portfolio',
    'Agency': 'agency',
    'Software': 'saas',
    'Entertainment': 'saas',
    'Medical': 'medical',
    'Education': 'education',
    'Real Estate': 'realestate',
    'Fitness': 'fitness',
  };
  
  const industry = categoryMap[category] || 'default';
  return INDUSTRY_IMAGES[industry] || INDUSTRY_IMAGES.default;
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
  
  // Get category-specific images
  const categoryImages = getCategoryImages(category);

  // Add HERO section if it doesn't exist
  const heroIndex = inserted.findIndex((c) => c.type === 'HERO');
  if (heroIndex < 0 && categoryImages.length > 0) {
    // Add a HERO section at the beginning
    inserted.unshift({
      type: 'HERO',
      orderIndex: 0,
      props: {
        headline: templateName || 'Welcome',
        subheadline: 'Discover our amazing products and services',
        primaryCta: { label: 'Get Started', href: '#contact' },
        secondaryCta: { label: 'Learn More', href: '#about' },
        image: categoryImages[0],
        backgroundImage: categoryImages[0],
      },
      styles: {
        textAlign: 'center',
        padding: '100px 0',
        background: `linear-gradient(135deg, #070a12 0%, #6366f115 100%)`,
      },
    });
  } else if (heroIndex >= 0 && categoryImages.length > 0) {
    // Enhance existing HERO component with image
    const hero = inserted[heroIndex];
    if (!hero.props.image && !hero.props.backgroundImage) {
      hero.props.image = categoryImages[0];
      hero.props.backgroundImage = categoryImages[0];
    }
  }

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
              imageUrl: categoryImages[0] || '',
              cta: { label: 'Buy', href: '/contact' },
            },
            {
              name: 'Product name',
              description: 'Short product description',
              price: '€79',
              badge: 'Best seller',
              imageUrl: categoryImages[1] || '',
              cta: { label: 'Buy', href: '/contact' },
            },
            {
              name: 'Product name',
              description: 'Short product description',
              price: '€29',
              badge: null,
              imageUrl: categoryImages[2] || '',
              cta: { label: 'Buy', href: '/contact' },
            },
            {
              name: 'Product name',
              description: 'Short product description',
              price: '€99',
              badge: null,
              imageUrl: categoryImages[3] || '',
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
            { title: 'Feature item', tagline: 'Short tagline', imageUrl: categoryImages[0] || '', cta: { label: 'Open', href: '/contact' } },
            { title: 'Feature item', tagline: 'Short tagline', imageUrl: categoryImages[1] || '', cta: { label: 'Open', href: '/contact' } },
            { title: 'Feature item', tagline: 'Short tagline', imageUrl: categoryImages[2] || '', cta: { label: 'Open', href: '/contact' } },
            { title: 'Feature item', tagline: 'Short tagline', imageUrl: categoryImages[3] || '', cta: { label: 'Open', href: '/contact' } },
          ],
        },
        styles: {},
      });
    } else if (categoryImages.length > 0) {
      // Add a GALLERY section for all other templates to ensure they have images
      inserted.push({
        type: 'GALLERY',
        props: {
          images: categoryImages.slice(0, 6), // Use first 6 images
          columns: 3,
          gap: '16px',
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
        designSystem: structure?.designSystem ?? null,
      },
      pages: enhanced?.pages ?? [],
    };
  },
};
