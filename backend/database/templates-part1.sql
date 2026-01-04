-- Professional Templates Part 1: Restaurant, Gym, Agency
-- Run this to add professional templates

-- ============================================================================
-- TEMPLATE 1: SAVEUR - Fine Dining Restaurant
-- Style: Dark, elegant, sophisticated with gold accents
-- ============================================================================
INSERT INTO templates (name, category, preview_image_url, structure_json)
VALUES
(
  'Saveur',
  'Restaurant',
  '/uploads/template-previews/saveur.svg',
  JSON_OBJECT(
    'designSystem', JSON_OBJECT(
      'colors', JSON_OBJECT(
        'primary', '#d4af37',
        'secondary', '#1a1a1a',
        'background', '#0d0d0d',
        'surface', 'rgba(212,175,55,0.08)',
        'text', '#ffffff',
        'mutedText', 'rgba(255,255,255,0.7)'
      ),
      'typography', JSON_OBJECT(
        'fontFamily', '"Playfair Display", Georgia, serif',
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
        'meta', JSON_OBJECT('title', 'Saveur | Fine Dining Experience', 'description', 'An unforgettable culinary journey'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type', 'NAVBAR', 'props', JSON_OBJECT(
            'logoText', 'SAVEUR',
            'links', JSON_ARRAY(
              JSON_OBJECT('label', 'Menu', 'href', '/menu'),
              JSON_OBJECT('label', 'Reservations', 'href', '/reservations'),
              JSON_OBJECT('label', 'Our Story', 'href', '/about')
            ),
            'cta', JSON_OBJECT('label', 'Book a Table', 'href', '/reservations')
          ), 'styles', JSON_OBJECT('backgroundColor', 'transparent')),
          JSON_OBJECT('type', 'HERO', 'props', JSON_OBJECT(
            'headline', 'Where Every Dish Tells a Story',
            'subheadline', 'Experience culinary artistry in an intimate setting. Our chef-driven menu celebrates seasonal ingredients with modern French techniques.',
            'primaryCta', JSON_OBJECT('label', 'Reserve Your Table', 'href', '/reservations'),
            'secondaryCta', JSON_OBJECT('label', 'View Menu', 'href', '/menu')
          ), 'styles', JSON_OBJECT('backgroundColor', '#0d0d0d', 'paddingTop', '120px', 'paddingBottom', '120px', 'textAlign', 'center')),
          JSON_OBJECT('type', 'FEATURES', 'props', JSON_OBJECT(
            'headline', 'The Saveur Experience',
            'items', JSON_ARRAY(
              JSON_OBJECT('icon', '🍷', 'title', 'Curated Wine Cellar', 'text', 'Over 300 selections from world-renowned vineyards.'),
              JSON_OBJECT('icon', '👨‍🍳', 'title', 'Chef''s Table', 'text', 'An exclusive 8-seat experience with personalized tasting menu.'),
              JSON_OBJECT('icon', '🌿', 'title', 'Farm to Table', 'text', 'Daily deliveries from local farms for the freshest ingredients.')
            )
          ), 'styles', JSON_OBJECT('backgroundColor', '#1a1a1a')),
          JSON_OBJECT('type', 'TESTIMONIALS', 'props', JSON_OBJECT(
            'headline', 'Guest Experiences',
            'items', JSON_ARRAY(
              JSON_OBJECT('quote', 'An extraordinary evening. Every course was a masterpiece.', 'name', 'James Mitchell', 'role', 'Food Critic'),
              JSON_OBJECT('quote', 'Saveur redefined what fine dining means to me.', 'name', 'Elena Vasquez', 'role', 'Michelin Guide')
            )
          ), 'styles', JSON_OBJECT('backgroundColor', '#0d0d0d')),
          JSON_OBJECT('type', 'CTA', 'props', JSON_OBJECT(
            'headline', 'Begin Your Culinary Journey',
            'description', 'Join us for exceptional cuisine and unforgettable moments.',
            'primaryCta', JSON_OBJECT('label', 'Make a Reservation', 'href', '/reservations')
          ), 'styles', JSON_OBJECT('backgroundColor', 'rgba(212,175,55,0.1)')),
          JSON_OBJECT('type', 'FOOTER', 'props', JSON_OBJECT(
            'copyright', '© 2024 SAVEUR | 123 Gourmet Avenue | Open Tue-Sun 6PM-11PM'
          ), 'styles', JSON_OBJECT('backgroundColor', '#0a0a0a'))
        )
      )
    )
  )
);

-- ============================================================================
-- TEMPLATE 2: IRONFORGE - Hardcore Gym & Fitness
-- Style: Bold, dark, aggressive with red accents
-- ============================================================================
INSERT INTO templates (name, category, preview_image_url, structure_json)
VALUES
(
  'IronForge',
  'Fitness',
  '/uploads/template-previews/ironforge.svg',
  JSON_OBJECT(
    'designSystem', JSON_OBJECT(
      'colors', JSON_OBJECT(
        'primary', '#ff4d4d',
        'secondary', '#ff8c00',
        'background', '#0a0a0a',
        'surface', 'rgba(255,77,77,0.1)',
        'text', '#ffffff',
        'mutedText', 'rgba(255,255,255,0.75)'
      ),
      'typography', JSON_OBJECT(
        'fontFamily', '"Oswald", Impact, sans-serif',
        'baseFontSize', 16,
        'lineHeight', 1.5,
        'headingWeight', 700,
        'bodyWeight', 400
      ),
      'spacing', JSON_OBJECT('sectionY', 60, 'containerX', 20)
    ),
    'pages', JSON_ARRAY(
      JSON_OBJECT(
        'name', 'Home',
        'path', '/',
        'meta', JSON_OBJECT('title', 'IRONFORGE | No Excuses. Just Results.', 'description', 'Elite training facility for serious athletes'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type', 'NAVBAR', 'props', JSON_OBJECT(
            'logoText', 'IRONFORGE',
            'links', JSON_ARRAY(
              JSON_OBJECT('label', 'PROGRAMS', 'href', '/programs'),
              JSON_OBJECT('label', 'TRAINERS', 'href', '/trainers'),
              JSON_OBJECT('label', 'PRICING', 'href', '/pricing')
            ),
            'cta', JSON_OBJECT('label', 'START FREE TRIAL', 'href', '/trial')
          ), 'styles', JSON_OBJECT('backgroundColor', '#0a0a0a')),
          JSON_OBJECT('type', 'HERO', 'props', JSON_OBJECT(
            'headline', 'FORGE YOUR LEGACY',
            'subheadline', 'This isn''t a gym. It''s a proving ground. Elite equipment. World-class coaches. Zero excuses.',
            'primaryCta', JSON_OBJECT('label', 'CLAIM YOUR FREE WEEK', 'href', '/trial'),
            'secondaryCta', JSON_OBJECT('label', 'VIEW PROGRAMS', 'href', '/programs')
          ), 'styles', JSON_OBJECT('backgroundColor', '#0a0a0a', 'paddingTop', '100px', 'paddingBottom', '100px')),
          JSON_OBJECT('type', 'STATS', 'props', JSON_OBJECT(
            'items', JSON_ARRAY(
              JSON_OBJECT('value', '50,000+', 'label', 'LBS LIFTED DAILY'),
              JSON_OBJECT('value', '24/7', 'label', 'ACCESS'),
              JSON_OBJECT('value', '15+', 'label', 'ELITE COACHES'),
              JSON_OBJECT('value', '98%', 'label', 'MEMBER RETENTION')
            )
          ), 'styles', JSON_OBJECT('backgroundColor', '#111111')),
          JSON_OBJECT('type', 'FEATURES', 'props', JSON_OBJECT(
            'headline', 'BUILT DIFFERENT',
            'items', JSON_ARRAY(
              JSON_OBJECT('icon', '🏋️', 'title', 'POWERLIFTING ZONE', 'text', 'Competition-grade platforms and calibrated plates.'),
              JSON_OBJECT('icon', '🥊', 'title', 'COMBAT ARENA', 'text', 'Full boxing ring, heavy bags, and MMA cage.'),
              JSON_OBJECT('icon', '🔥', 'title', 'HIIT STUDIO', 'text', 'High-intensity classes that push your limits.'),
              JSON_OBJECT('icon', '💪', 'title', 'RECOVERY LAB', 'text', 'Cryo chambers, saunas, and compression therapy.')
            )
          ), 'styles', JSON_OBJECT('backgroundColor', '#0a0a0a')),
          JSON_OBJECT('type', 'PRICING', 'props', JSON_OBJECT(
            'headline', 'CHOOSE YOUR PATH',
            'plans', JSON_ARRAY(
              JSON_OBJECT('name', 'WARRIOR', 'price', '$49', 'period', '/month', 'features', JSON_ARRAY('Full gym access', '24/7 entry', 'Locker room'), 'featured', false),
              JSON_OBJECT('name', 'GLADIATOR', 'price', '$99', 'period', '/month', 'features', JSON_ARRAY('Everything in Warrior', 'Unlimited classes', '2 PT sessions/month'), 'featured', true),
              JSON_OBJECT('name', 'LEGEND', 'price', '$199', 'period', '/month', 'features', JSON_ARRAY('Everything in Gladiator', 'Unlimited PT', 'Nutrition coaching'), 'featured', false)
            )
          ), 'styles', JSON_OBJECT('backgroundColor', '#111111')),
          JSON_OBJECT('type', 'CTA', 'props', JSON_OBJECT(
            'headline', 'YOUR TRANSFORMATION STARTS NOW',
            'description', 'Stop waiting. Stop making excuses. Your free week is waiting.',
            'primaryCta', JSON_OBJECT('label', 'START FREE TRIAL', 'href', '/trial')
          ), 'styles', JSON_OBJECT('backgroundColor', 'rgba(255,77,77,0.15)')),
          JSON_OBJECT('type', 'FOOTER', 'props', JSON_OBJECT(
            'copyright', '© 2024 IRONFORGE | 500 IRON STREET | ALL RIGHTS RESERVED'
          ), 'styles', JSON_OBJECT('backgroundColor', '#050505'))
        )
      )
    )
  )
);

-- ============================================================================
-- TEMPLATE 3: NOVA DIGITAL - Creative Agency
-- Style: Clean, minimal, lots of whitespace
-- ============================================================================
INSERT INTO templates (name, category, preview_image_url, structure_json)
VALUES
(
  'Nova Digital',
  'Agency',
  '/uploads/template-previews/nova.svg',
  JSON_OBJECT(
    'designSystem', JSON_OBJECT(
      'colors', JSON_OBJECT(
        'primary', '#6366f1',
        'secondary', '#ec4899',
        'background', '#fafafa',
        'surface', '#ffffff',
        'text', '#1a1a1a',
        'mutedText', '#6b7280'
      ),
      'typography', JSON_OBJECT(
        'fontFamily', '"Inter", -apple-system, sans-serif',
        'baseFontSize', 16,
        'lineHeight', 1.6,
        'headingWeight', 700,
        'bodyWeight', 400
      ),
      'spacing', JSON_OBJECT('sectionY', 100, 'containerX', 24)
    ),
    'pages', JSON_ARRAY(
      JSON_OBJECT(
        'name', 'Home',
        'path', '/',
        'meta', JSON_OBJECT('title', 'Nova Digital | We Build Brands That Matter', 'description', 'Award-winning creative agency'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type', 'NAVBAR', 'props', JSON_OBJECT(
            'logoText', 'nova.',
            'links', JSON_ARRAY(
              JSON_OBJECT('label', 'Work', 'href', '/work'),
              JSON_OBJECT('label', 'Services', 'href', '/services'),
              JSON_OBJECT('label', 'About', 'href', '/about')
            ),
            'cta', JSON_OBJECT('label', 'Start a Project', 'href', '/contact')
          ), 'styles', JSON_OBJECT('backgroundColor', '#fafafa')),
          JSON_OBJECT('type', 'HERO', 'props', JSON_OBJECT(
            'headline', 'We craft digital experiences that inspire action',
            'subheadline', 'Nova is a creative studio helping ambitious brands stand out through strategic design and cutting-edge technology.',
            'primaryCta', JSON_OBJECT('label', 'See Our Work', 'href', '/work'),
            'secondaryCta', JSON_OBJECT('label', 'Get in Touch', 'href', '/contact')
          ), 'styles', JSON_OBJECT('backgroundColor', '#fafafa', 'paddingTop', '140px', 'paddingBottom', '140px')),
          JSON_OBJECT('type', 'CARDS', 'props', JSON_OBJECT(
            'headline', 'Featured Projects',
            'cards', JSON_ARRAY(
              JSON_OBJECT('title', 'Lumina Rebrand', 'text', 'Complete brand identity redesign resulting in 340% increase in brand recognition.', 'cta', JSON_OBJECT('label', 'View Case Study', 'href', '/work/lumina')),
              JSON_OBJECT('title', 'Zenith App', 'text', 'End-to-end product design for a meditation app with 2M+ downloads.', 'cta', JSON_OBJECT('label', 'View Case Study', 'href', '/work/zenith')),
              JSON_OBJECT('title', 'Artisan E-commerce', 'text', 'Shopify Plus build achieving 200% increase in online sales.', 'cta', JSON_OBJECT('label', 'View Case Study', 'href', '/work/artisan'))
            )
          ), 'styles', JSON_OBJECT('backgroundColor', '#ffffff')),
          JSON_OBJECT('type', 'FEATURES', 'props', JSON_OBJECT(
            'headline', 'What We Do',
            'items', JSON_ARRAY(
              JSON_OBJECT('icon', '✨', 'title', 'Brand Strategy', 'text', 'We uncover what makes your brand unique.'),
              JSON_OBJECT('icon', '🎨', 'title', 'Visual Identity', 'text', 'Logos, colors, and guidelines that bring your brand to life.'),
              JSON_OBJECT('icon', '💻', 'title', 'Web Design', 'text', 'Beautiful websites that convert visitors into customers.'),
              JSON_OBJECT('icon', '📱', 'title', 'Digital Products', 'text', 'User-centered app design that delights users.')
            )
          ), 'styles', JSON_OBJECT('backgroundColor', '#fafafa')),
          JSON_OBJECT('type', 'TESTIMONIALS', 'props', JSON_OBJECT(
            'headline', 'Client Love',
            'items', JSON_ARRAY(
              JSON_OBJECT('quote', 'Nova transformed our digital presence. Our conversions doubled.', 'name', 'Sarah Chen', 'role', 'CEO, Lumina'),
              JSON_OBJECT('quote', 'Working with Nova felt like having an extension of our own team.', 'name', 'Michael Torres', 'role', 'Founder, Zenith')
            )
          ), 'styles', JSON_OBJECT('backgroundColor', '#ffffff')),
          JSON_OBJECT('type', 'CTA', 'props', JSON_OBJECT(
            'headline', 'Ready to stand out?',
            'description', 'Let''s create something extraordinary together.',
            'primaryCta', JSON_OBJECT('label', 'Start a Conversation', 'href', '/contact')
          ), 'styles', JSON_OBJECT('backgroundColor', '#6366f1')),
          JSON_OBJECT('type', 'FOOTER', 'props', JSON_OBJECT(
            'copyright', '© 2024 Nova Digital | San Francisco, CA'
          ), 'styles', JSON_OBJECT('backgroundColor', '#1a1a1a'))
        )
      )
    )
  )
);
