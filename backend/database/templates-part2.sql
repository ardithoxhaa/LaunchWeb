-- Professional Templates Part 2: SaaS, Portfolio, Real Estate

-- ============================================================================
-- TEMPLATE 4: CLOUDPULSE - SaaS / Tech Startup
-- Style: Modern, gradient backgrounds, tech-focused
-- ============================================================================
INSERT INTO templates (name, category, preview_image_url, structure_json)
VALUES
(
  'CloudPulse',
  'SaaS',
  '/uploads/template-previews/cloudpulse.svg',
  JSON_OBJECT(
    'designSystem', JSON_OBJECT(
      'colors', JSON_OBJECT(
        'primary', '#3b82f6',
        'secondary', '#8b5cf6',
        'background', '#0f172a',
        'surface', 'rgba(59,130,246,0.1)',
        'text', '#f8fafc',
        'mutedText', '#94a3b8'
      ),
      'typography', JSON_OBJECT(
        'fontFamily', '"Plus Jakarta Sans", -apple-system, sans-serif',
        'baseFontSize', 16,
        'lineHeight', 1.6,
        'headingWeight', 700,
        'bodyWeight', 400
      ),
      'spacing', JSON_OBJECT('sectionY', 80, 'containerX', 24)
    ),
    'pages', JSON_ARRAY(
      JSON_OBJECT(
        'name', 'Home',
        'path', '/',
        'meta', JSON_OBJECT('title', 'CloudPulse | Infrastructure Monitoring Made Simple', 'description', 'Real-time monitoring for modern engineering teams'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type', 'NAVBAR', 'props', JSON_OBJECT(
            'logoText', 'CloudPulse',
            'links', JSON_ARRAY(
              JSON_OBJECT('label', 'Product', 'href', '/product'),
              JSON_OBJECT('label', 'Pricing', 'href', '/pricing'),
              JSON_OBJECT('label', 'Docs', 'href', '/docs')
            ),
            'cta', JSON_OBJECT('label', 'Start Free Trial', 'href', '/signup')
          ), 'styles', JSON_OBJECT('backgroundColor', 'transparent')),
          JSON_OBJECT('type', 'HERO', 'props', JSON_OBJECT(
            'headline', 'Monitor everything. Miss nothing.',
            'subheadline', 'CloudPulse gives engineering teams real-time visibility into their entire stack. Catch issues before your users do.',
            'primaryCta', JSON_OBJECT('label', 'Start Free Trial', 'href', '/signup'),
            'secondaryCta', JSON_OBJECT('label', 'Watch Demo', 'href', '/demo')
          ), 'styles', JSON_OBJECT('backgroundColor', '#0f172a', 'paddingTop', '120px', 'paddingBottom', '80px')),
          JSON_OBJECT('type', 'STATS', 'props', JSON_OBJECT(
            'items', JSON_ARRAY(
              JSON_OBJECT('value', '99.99%', 'label', 'Uptime SLA'),
              JSON_OBJECT('value', '<100ms', 'label', 'Alert Latency'),
              JSON_OBJECT('value', '10B+', 'label', 'Events/Day'),
              JSON_OBJECT('value', '150+', 'label', 'Countries')
            )
          ), 'styles', JSON_OBJECT('backgroundColor', '#1e293b')),
          JSON_OBJECT('type', 'FEATURES', 'props', JSON_OBJECT(
            'headline', 'Everything you need to stay ahead',
            'items', JSON_ARRAY(
              JSON_OBJECT('icon', '📊', 'title', 'Real-time Dashboards', 'text', 'Customizable dashboards with live metrics.'),
              JSON_OBJECT('icon', '🔔', 'title', 'Smart Alerts', 'text', 'AI-powered anomaly detection that reduces alert fatigue.'),
              JSON_OBJECT('icon', '🔍', 'title', 'Deep Tracing', 'text', 'Distributed tracing across services.'),
              JSON_OBJECT('icon', '🔗', 'title', '200+ Integrations', 'text', 'AWS, GCP, Kubernetes, and more.')
            )
          ), 'styles', JSON_OBJECT('backgroundColor', '#0f172a')),
          JSON_OBJECT('type', 'PRICING', 'props', JSON_OBJECT(
            'headline', 'Simple, transparent pricing',
            'plans', JSON_ARRAY(
              JSON_OBJECT('name', 'Starter', 'price', '$0', 'period', '/month', 'features', JSON_ARRAY('5 hosts', '1 day retention', 'Community support'), 'featured', false),
              JSON_OBJECT('name', 'Pro', 'price', '$49', 'period', '/host/mo', 'features', JSON_ARRAY('Unlimited hosts', '30 day retention', 'Priority support', 'Smart alerts'), 'featured', true),
              JSON_OBJECT('name', 'Enterprise', 'price', 'Custom', 'period', '', 'features', JSON_ARRAY('Unlimited everything', '1 year retention', 'Dedicated support', 'SSO & RBAC'), 'featured', false)
            )
          ), 'styles', JSON_OBJECT('backgroundColor', '#1e293b')),
          JSON_OBJECT('type', 'FAQ', 'props', JSON_OBJECT(
            'headline', 'Frequently asked questions',
            'items', JSON_ARRAY(
              JSON_OBJECT('q', 'How long does setup take?', 'a', 'Most teams are up and running in under 5 minutes.'),
              JSON_OBJECT('q', 'Do you offer a free trial?', 'a', 'Yes! Start free, no credit card required.'),
              JSON_OBJECT('q', 'What about data privacy?', 'a', 'SOC 2 Type II certified and GDPR compliant.')
            )
          ), 'styles', JSON_OBJECT('backgroundColor', '#0f172a')),
          JSON_OBJECT('type', 'CTA', 'props', JSON_OBJECT(
            'headline', 'Ready to see everything?',
            'description', 'Join 10,000+ teams who trust CloudPulse.',
            'primaryCta', JSON_OBJECT('label', 'Start Free Trial', 'href', '/signup')
          ), 'styles', JSON_OBJECT('backgroundColor', '#3b82f6')),
          JSON_OBJECT('type', 'FOOTER', 'props', JSON_OBJECT(
            'copyright', '© 2024 CloudPulse Inc. | San Francisco, CA'
          ), 'styles', JSON_OBJECT('backgroundColor', '#020617'))
        )
      )
    )
  )
);

-- ============================================================================
-- TEMPLATE 5: ARIA CHEN - Personal Portfolio
-- Style: Artistic, warm colors, bold typography
-- ============================================================================
INSERT INTO templates (name, category, preview_image_url, structure_json)
VALUES
(
  'Aria Portfolio',
  'Portfolio',
  '/uploads/template-previews/aria.svg',
  JSON_OBJECT(
    'designSystem', JSON_OBJECT(
      'colors', JSON_OBJECT(
        'primary', '#f43f5e',
        'secondary', '#fbbf24',
        'background', '#fffbeb',
        'surface', '#ffffff',
        'text', '#1c1917',
        'mutedText', '#78716c'
      ),
      'typography', JSON_OBJECT(
        'fontFamily', '"Space Grotesk", -apple-system, sans-serif',
        'baseFontSize', 18,
        'lineHeight', 1.5,
        'headingWeight', 700,
        'bodyWeight', 400
      ),
      'spacing', JSON_OBJECT('sectionY', 100, 'containerX', 32)
    ),
    'pages', JSON_ARRAY(
      JSON_OBJECT(
        'name', 'Home',
        'path', '/',
        'meta', JSON_OBJECT('title', 'Aria Chen | Product Designer', 'description', 'Award-winning designer crafting digital experiences'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type', 'NAVBAR', 'props', JSON_OBJECT(
            'logoText', 'Aria Chen',
            'links', JSON_ARRAY(
              JSON_OBJECT('label', 'Work', 'href', '/work'),
              JSON_OBJECT('label', 'About', 'href', '/about'),
              JSON_OBJECT('label', 'Writing', 'href', '/blog')
            ),
            'cta', JSON_OBJECT('label', 'Let''s Talk', 'href', '/contact')
          ), 'styles', JSON_OBJECT('backgroundColor', '#fffbeb')),
          JSON_OBJECT('type', 'HERO', 'props', JSON_OBJECT(
            'headline', 'I design products people actually want to use.',
            'subheadline', 'Product designer with 10+ years crafting digital experiences. Currently Design Director at Figma. Previously Apple, Airbnb.',
            'primaryCta', JSON_OBJECT('label', 'View Selected Work', 'href', '/work'),
            'secondaryCta', JSON_OBJECT('label', 'Download Resume', 'href', '/resume.pdf')
          ), 'styles', JSON_OBJECT('backgroundColor', '#fffbeb', 'paddingTop', '160px', 'paddingBottom', '100px')),
          JSON_OBJECT('type', 'CARDS', 'props', JSON_OBJECT(
            'headline', 'Selected Work',
            'cards', JSON_ARRAY(
              JSON_OBJECT('title', 'Figma Variables', 'text', 'Led the design of Figma''s variable system for scalable design systems.', 'cta', JSON_OBJECT('label', 'Read Case Study', 'href', '/work/figma')),
              JSON_OBJECT('title', 'Airbnb Experiences', 'text', 'Redesigned booking flow, increasing conversion by 34%.', 'cta', JSON_OBJECT('label', 'Read Case Study', 'href', '/work/airbnb')),
              JSON_OBJECT('title', 'Apple Health', 'text', 'Contributed to iOS 15 Health redesign, focusing on mental wellness.', 'cta', JSON_OBJECT('label', 'Read Case Study', 'href', '/work/apple'))
            )
          ), 'styles', JSON_OBJECT('backgroundColor', '#ffffff')),
          JSON_OBJECT('type', 'FEATURES', 'props', JSON_OBJECT(
            'headline', 'What I Do',
            'items', JSON_ARRAY(
              JSON_OBJECT('icon', '🎯', 'title', 'Product Strategy', 'text', 'Turning business goals into user-centered roadmaps.'),
              JSON_OBJECT('icon', '✏️', 'title', 'UX/UI Design', 'text', 'Crafting intuitive interfaces that users love.'),
              JSON_OBJECT('icon', '🔬', 'title', 'User Research', 'text', 'Data-driven insights for every design decision.'),
              JSON_OBJECT('icon', '📐', 'title', 'Design Systems', 'text', 'Scalable component libraries that accelerate teams.')
            )
          ), 'styles', JSON_OBJECT('backgroundColor', '#fffbeb')),
          JSON_OBJECT('type', 'TESTIMONIALS', 'props', JSON_OBJECT(
            'headline', 'Kind Words',
            'items', JSON_ARRAY(
              JSON_OBJECT('quote', 'Aria has an incredible ability to simplify complex problems.', 'name', 'Dylan Field', 'role', 'CEO, Figma'),
              JSON_OBJECT('quote', 'One of the most talented designers I''ve ever worked with.', 'name', 'Brian Chesky', 'role', 'CEO, Airbnb')
            )
          ), 'styles', JSON_OBJECT('backgroundColor', '#ffffff')),
          JSON_OBJECT('type', 'CTA', 'props', JSON_OBJECT(
            'headline', 'Let''s create something great together',
            'description', 'Currently accepting select freelance projects.',
            'primaryCta', JSON_OBJECT('label', 'Get in Touch', 'href', '/contact')
          ), 'styles', JSON_OBJECT('backgroundColor', '#f43f5e')),
          JSON_OBJECT('type', 'FOOTER', 'props', JSON_OBJECT(
            'copyright', '© 2024 Aria Chen | Made with ☕ in San Francisco'
          ), 'styles', JSON_OBJECT('backgroundColor', '#1c1917'))
        )
      )
    )
  )
);

-- ============================================================================
-- TEMPLATE 6: PRESTIGE ESTATES - Luxury Real Estate
-- Style: Sophisticated, image-heavy, serif typography
-- ============================================================================
INSERT INTO templates (name, category, preview_image_url, structure_json)
VALUES
(
  'Prestige Estates',
  'Real Estate',
  '/uploads/template-previews/prestige.svg',
  JSON_OBJECT(
    'designSystem', JSON_OBJECT(
      'colors', JSON_OBJECT(
        'primary', '#1e3a5f',
        'secondary', '#c9a962',
        'background', '#fdfcfa',
        'surface', '#ffffff',
        'text', '#1a1a1a',
        'mutedText', '#6b7280'
      ),
      'typography', JSON_OBJECT(
        'fontFamily', '"Cormorant Garamond", Georgia, serif',
        'baseFontSize', 18,
        'lineHeight', 1.7,
        'headingWeight', 600,
        'bodyWeight', 400
      ),
      'spacing', JSON_OBJECT('sectionY', 80, 'containerX', 24)
    ),
    'pages', JSON_ARRAY(
      JSON_OBJECT(
        'name', 'Home',
        'path', '/',
        'meta', JSON_OBJECT('title', 'Prestige Estates | Luxury Properties Worldwide', 'description', 'Exceptional homes for discerning buyers'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type', 'NAVBAR', 'props', JSON_OBJECT(
            'logoText', 'PRESTIGE ESTATES',
            'links', JSON_ARRAY(
              JSON_OBJECT('label', 'Properties', 'href', '/properties'),
              JSON_OBJECT('label', 'Services', 'href', '/services'),
              JSON_OBJECT('label', 'About', 'href', '/about')
            ),
            'cta', JSON_OBJECT('label', 'Schedule Viewing', 'href', '/contact')
          ), 'styles', JSON_OBJECT('backgroundColor', '#fdfcfa')),
          JSON_OBJECT('type', 'HERO', 'props', JSON_OBJECT(
            'headline', 'Where Extraordinary Finds Home',
            'subheadline', 'For over 40 years, Prestige Estates has connected discerning buyers with the world''s most exceptional properties.',
            'primaryCta', JSON_OBJECT('label', 'Explore Properties', 'href', '/properties'),
            'secondaryCta', JSON_OBJECT('label', 'Sell With Us', 'href', '/sell')
          ), 'styles', JSON_OBJECT('backgroundColor', '#fdfcfa', 'paddingTop', '120px', 'paddingBottom', '120px')),
          JSON_OBJECT('type', 'CARDS', 'props', JSON_OBJECT(
            'headline', 'Featured Listings',
            'cards', JSON_ARRAY(
              JSON_OBJECT('title', 'Central Park Penthouse', 'text', '$28,500,000 • 5 BD • 6 BA • 8,200 SF', 'cta', JSON_OBJECT('label', 'View Property', 'href', '/properties/1')),
              JSON_OBJECT('title', 'Malibu Oceanfront', 'text', '$45,000,000 • 7 BD • 9 BA • 12,000 SF', 'cta', JSON_OBJECT('label', 'View Property', 'href', '/properties/2')),
              JSON_OBJECT('title', 'Tuscan Villa Estate', 'text', '€18,000,000 • 8 BD • 10 BA • 15,000 SF', 'cta', JSON_OBJECT('label', 'View Property', 'href', '/properties/3'))
            )
          ), 'styles', JSON_OBJECT('backgroundColor', '#ffffff')),
          JSON_OBJECT('type', 'STATS', 'props', JSON_OBJECT(
            'items', JSON_ARRAY(
              JSON_OBJECT('value', '$12B+', 'label', 'In Sales'),
              JSON_OBJECT('value', '40+', 'label', 'Years Experience'),
              JSON_OBJECT('value', '25', 'label', 'Global Offices'),
              JSON_OBJECT('value', '98%', 'label', 'Client Satisfaction')
            )
          ), 'styles', JSON_OBJECT('backgroundColor', '#1e3a5f')),
          JSON_OBJECT('type', 'FEATURES', 'props', JSON_OBJECT(
            'headline', 'The Prestige Difference',
            'items', JSON_ARRAY(
              JSON_OBJECT('icon', '🏛️', 'title', 'Exclusive Access', 'text', 'Off-market properties not available anywhere else.'),
              JSON_OBJECT('icon', '🌍', 'title', 'Global Network', 'text', '25 offices worldwide with local expertise.'),
              JSON_OBJECT('icon', '🤝', 'title', 'White Glove Service', 'text', 'Dedicated advisors for every detail.'),
              JSON_OBJECT('icon', '🔒', 'title', 'Complete Discretion', 'text', 'Privacy-first approach for high-profile clients.')
            )
          ), 'styles', JSON_OBJECT('backgroundColor', '#fdfcfa')),
          JSON_OBJECT('type', 'CTA', 'props', JSON_OBJECT(
            'headline', 'Begin Your Search',
            'description', 'Our advisors are ready to guide you.',
            'primaryCta', JSON_OBJECT('label', 'Contact an Advisor', 'href', '/contact')
          ), 'styles', JSON_OBJECT('backgroundColor', '#c9a962')),
          JSON_OBJECT('type', 'FOOTER', 'props', JSON_OBJECT(
            'copyright', '© 2024 Prestige Estates | Luxury Real Estate Since 1984'
          ), 'styles', JSON_OBJECT('backgroundColor', '#1e3a5f'))
        )
      )
    )
  )
);
