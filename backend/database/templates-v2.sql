-- Professional Templates v2 - Better colors, multiple pages
-- Run: node backend/database/run-templates.js after updating

-- Clear existing templates first
DELETE FROM templates;

-- ============================================================================
-- TEMPLATE 1: SAVEUR - Fine Dining Restaurant
-- Style: Dark elegant, gold accents, serif typography
-- ============================================================================
INSERT INTO templates (name, category, preview_image_url, structure_json)
VALUES (
  'Saveur',
  'Restaurant',
  '/uploads/template-previews/saveur.svg',
  JSON_OBJECT(
    'designSystem', JSON_OBJECT(
      'colors', JSON_OBJECT(
        'primary', '#c9a962',
        'secondary', '#8b7355',
        'background', '#1a1a1a',
        'surface', '#242424',
        'text', '#ffffff',
        'mutedText', 'rgba(255,255,255,0.7)'
      ),
      'typography', JSON_OBJECT(
        'fontFamily', '"Playfair Display", Georgia, serif',
        'baseFontSize', 16,
        'lineHeight', 1.7
      )
    ),
    'pages', JSON_ARRAY(
      JSON_OBJECT(
        'name', 'Home',
        'path', '/',
        'components', JSON_ARRAY(
          JSON_OBJECT('type', 'NAVBAR', 'props', JSON_OBJECT(
            'logoText', 'SAVEUR',
            'links', JSON_ARRAY(
              JSON_OBJECT('label', 'Menu', 'href', '/menu'),
              JSON_OBJECT('label', 'Reservations', 'href', '/reservations'),
              JSON_OBJECT('label', 'About', 'href', '/about'),
              JSON_OBJECT('label', 'Contact', 'href', '/contact')
            ),
            'cta', JSON_OBJECT('label', 'Book a Table', 'href', '/reservations')
          ), 'styles', JSON_OBJECT('backgroundColor', '#1a1a1a')),
          JSON_OBJECT('type', 'HERO', 'props', JSON_OBJECT(
            'headline', 'Where Every Dish Tells a Story',
            'subheadline', 'Experience culinary artistry in an intimate setting. Our chef-driven menu celebrates seasonal ingredients with French-inspired techniques.',
            'primaryCta', JSON_OBJECT('label', 'Reserve Your Table', 'href', '/reservations'),
            'secondaryCta', JSON_OBJECT('label', 'View Menu', 'href', '/menu')
          ), 'styles', JSON_OBJECT('backgroundColor', '#1a1a1a', 'paddingTop', '100px', 'paddingBottom', '100px')),
          JSON_OBJECT('type', 'FEATURES', 'props', JSON_OBJECT(
            'headline', 'The Saveur Experience',
            'items', JSON_ARRAY(
              JSON_OBJECT('icon', '🍷', 'title', 'Curated Wine Selection', 'text', 'Over 200 labels from renowned vineyards worldwide.'),
              JSON_OBJECT('icon', '👨‍🍳', 'title', 'Award-Winning Chef', 'text', 'Michelin-starred cuisine by Chef Antoine Dubois.'),
              JSON_OBJECT('icon', '🌿', 'title', 'Farm to Table', 'text', 'Locally sourced ingredients from partner farms.'),
              JSON_OBJECT('icon', '✨', 'title', 'Private Dining', 'text', 'Exclusive spaces for special occasions.')
            )
          ), 'styles', JSON_OBJECT('backgroundColor', '#242424')),
          JSON_OBJECT('type', 'CTA', 'props', JSON_OBJECT(
            'headline', 'Join Us for an Unforgettable Evening',
            'description', 'Open Tuesday - Sunday, 5:30 PM - 10:00 PM',
            'primaryCta', JSON_OBJECT('label', 'Make a Reservation', 'href', '/reservations')
          ), 'styles', JSON_OBJECT('backgroundColor', '#c9a962')),
          JSON_OBJECT('type', 'FOOTER', 'props', JSON_OBJECT(
            'copyright', '© 2024 Saveur | 123 Gourmet Lane, New York'
          ), 'styles', JSON_OBJECT('backgroundColor', '#0f0f0f'))
        )
      ),
      JSON_OBJECT(
        'name', 'Menu',
        'path', '/menu',
        'components', JSON_ARRAY(
          JSON_OBJECT('type', 'NAVBAR', 'props', JSON_OBJECT(
            'logoText', 'SAVEUR',
            'links', JSON_ARRAY(
              JSON_OBJECT('label', 'Menu', 'href', '/menu'),
              JSON_OBJECT('label', 'Reservations', 'href', '/reservations'),
              JSON_OBJECT('label', 'About', 'href', '/about'),
              JSON_OBJECT('label', 'Contact', 'href', '/contact')
            ),
            'cta', JSON_OBJECT('label', 'Book a Table', 'href', '/reservations')
          ), 'styles', JSON_OBJECT('backgroundColor', '#1a1a1a')),
          JSON_OBJECT('type', 'HERO', 'props', JSON_OBJECT(
            'headline', 'Our Menu',
            'subheadline', 'A seasonal journey through French-inspired cuisine'
          ), 'styles', JSON_OBJECT('backgroundColor', '#1a1a1a', 'paddingTop', '80px', 'paddingBottom', '60px')),
          JSON_OBJECT('type', 'CARDS', 'props', JSON_OBJECT(
            'headline', 'Starters',
            'cards', JSON_ARRAY(
              JSON_OBJECT('title', 'Foie Gras Terrine', 'text', 'With brioche and fig compote - $28'),
              JSON_OBJECT('title', 'Oysters Rockefeller', 'text', 'Half dozen with spinach and Pernod - $24'),
              JSON_OBJECT('title', 'Burrata Salad', 'text', 'Heirloom tomatoes, basil oil - $18')
            )
          ), 'styles', JSON_OBJECT('backgroundColor', '#242424')),
          JSON_OBJECT('type', 'CARDS', 'props', JSON_OBJECT(
            'headline', 'Main Courses',
            'cards', JSON_ARRAY(
              JSON_OBJECT('title', 'Beef Wellington', 'text', 'Truffle duxelles, red wine jus - $65'),
              JSON_OBJECT('title', 'Dover Sole Meunière', 'text', 'Brown butter, capers, lemon - $58'),
              JSON_OBJECT('title', 'Duck Confit', 'text', 'Cherry gastrique, roasted vegetables - $48')
            )
          ), 'styles', JSON_OBJECT('backgroundColor', '#1a1a1a')),
          JSON_OBJECT('type', 'FOOTER', 'props', JSON_OBJECT(
            'copyright', '© 2024 Saveur | 123 Gourmet Lane, New York'
          ), 'styles', JSON_OBJECT('backgroundColor', '#0f0f0f'))
        )
      ),
      JSON_OBJECT(
        'name', 'About',
        'path', '/about',
        'components', JSON_ARRAY(
          JSON_OBJECT('type', 'NAVBAR', 'props', JSON_OBJECT(
            'logoText', 'SAVEUR',
            'links', JSON_ARRAY(
              JSON_OBJECT('label', 'Menu', 'href', '/menu'),
              JSON_OBJECT('label', 'Reservations', 'href', '/reservations'),
              JSON_OBJECT('label', 'About', 'href', '/about'),
              JSON_OBJECT('label', 'Contact', 'href', '/contact')
            ),
            'cta', JSON_OBJECT('label', 'Book a Table', 'href', '/reservations')
          ), 'styles', JSON_OBJECT('backgroundColor', '#1a1a1a')),
          JSON_OBJECT('type', 'HERO', 'props', JSON_OBJECT(
            'headline', 'Our Story',
            'subheadline', 'Founded in 2010, Saveur has been a destination for food lovers seeking an extraordinary dining experience.'
          ), 'styles', JSON_OBJECT('backgroundColor', '#1a1a1a', 'paddingTop', '80px', 'paddingBottom', '60px')),
          JSON_OBJECT('type', 'FEATURES', 'props', JSON_OBJECT(
            'headline', 'Meet Our Team',
            'items', JSON_ARRAY(
              JSON_OBJECT('icon', '👨‍🍳', 'title', 'Chef Antoine Dubois', 'text', 'Executive Chef with 20 years of experience'),
              JSON_OBJECT('icon', '🍷', 'title', 'Marie Laurent', 'text', 'Head Sommelier, certified by Court of Master Sommeliers'),
              JSON_OBJECT('icon', '🎯', 'title', 'James Chen', 'text', 'General Manager ensuring every visit is perfect')
            )
          ), 'styles', JSON_OBJECT('backgroundColor', '#242424')),
          JSON_OBJECT('type', 'FOOTER', 'props', JSON_OBJECT(
            'copyright', '© 2024 Saveur | 123 Gourmet Lane, New York'
          ), 'styles', JSON_OBJECT('backgroundColor', '#0f0f0f'))
        )
      ),
      JSON_OBJECT(
        'name', 'Contact',
        'path', '/contact',
        'components', JSON_ARRAY(
          JSON_OBJECT('type', 'NAVBAR', 'props', JSON_OBJECT(
            'logoText', 'SAVEUR',
            'links', JSON_ARRAY(
              JSON_OBJECT('label', 'Menu', 'href', '/menu'),
              JSON_OBJECT('label', 'Reservations', 'href', '/reservations'),
              JSON_OBJECT('label', 'About', 'href', '/about'),
              JSON_OBJECT('label', 'Contact', 'href', '/contact')
            ),
            'cta', JSON_OBJECT('label', 'Book a Table', 'href', '/reservations')
          ), 'styles', JSON_OBJECT('backgroundColor', '#1a1a1a')),
          JSON_OBJECT('type', 'HERO', 'props', JSON_OBJECT(
            'headline', 'Contact Us',
            'subheadline', 'We would love to hear from you'
          ), 'styles', JSON_OBJECT('backgroundColor', '#1a1a1a', 'paddingTop', '80px', 'paddingBottom', '60px')),
          JSON_OBJECT('type', 'FEATURES', 'props', JSON_OBJECT(
            'items', JSON_ARRAY(
              JSON_OBJECT('icon', '📍', 'title', 'Location', 'text', '123 Gourmet Lane, New York, NY 10001'),
              JSON_OBJECT('icon', '📞', 'title', 'Phone', 'text', '(212) 555-0123'),
              JSON_OBJECT('icon', '✉️', 'title', 'Email', 'text', 'reservations@saveur.com'),
              JSON_OBJECT('icon', '🕐', 'title', 'Hours', 'text', 'Tue-Sun: 5:30 PM - 10:00 PM')
            )
          ), 'styles', JSON_OBJECT('backgroundColor', '#242424')),
          JSON_OBJECT('type', 'CONTACT_FORM', 'props', JSON_OBJECT(
            'headline', 'Send us a Message'
          ), 'styles', JSON_OBJECT('backgroundColor', '#1a1a1a')),
          JSON_OBJECT('type', 'FOOTER', 'props', JSON_OBJECT(
            'copyright', '© 2024 Saveur | 123 Gourmet Lane, New York'
          ), 'styles', JSON_OBJECT('backgroundColor', '#0f0f0f'))
        )
      )
    )
  )
);

-- ============================================================================
-- TEMPLATE 2: IRONFORGE - Fitness & Gym
-- Style: Bold, energetic, red/black theme
-- ============================================================================
INSERT INTO templates (name, category, preview_image_url, structure_json)
VALUES (
  'IronForge',
  'Fitness',
  '/uploads/template-previews/ironforge.svg',
  JSON_OBJECT(
    'designSystem', JSON_OBJECT(
      'colors', JSON_OBJECT(
        'primary', '#ef4444',
        'secondary', '#f97316',
        'background', '#0a0a0a',
        'surface', '#171717',
        'text', '#ffffff',
        'mutedText', 'rgba(255,255,255,0.7)'
      ),
      'typography', JSON_OBJECT(
        'fontFamily', '"Oswald", "Impact", sans-serif',
        'baseFontSize', 16,
        'lineHeight', 1.5
      )
    ),
    'pages', JSON_ARRAY(
      JSON_OBJECT(
        'name', 'Home',
        'path', '/',
        'components', JSON_ARRAY(
          JSON_OBJECT('type', 'NAVBAR', 'props', JSON_OBJECT(
            'logoText', 'IRONFORGE',
            'links', JSON_ARRAY(
              JSON_OBJECT('label', 'Programs', 'href', '/programs'),
              JSON_OBJECT('label', 'Trainers', 'href', '/trainers'),
              JSON_OBJECT('label', 'Pricing', 'href', '/pricing'),
              JSON_OBJECT('label', 'Contact', 'href', '/contact')
            ),
            'cta', JSON_OBJECT('label', 'Join Now', 'href', '/pricing')
          ), 'styles', JSON_OBJECT('backgroundColor', '#0a0a0a')),
          JSON_OBJECT('type', 'HERO', 'props', JSON_OBJECT(
            'headline', 'FORGE YOUR LEGACY',
            'subheadline', 'Transform your body. Elevate your mind. Join the most intense training facility in the city.',
            'primaryCta', JSON_OBJECT('label', 'START FREE TRIAL', 'href', '/pricing'),
            'secondaryCta', JSON_OBJECT('label', 'VIEW PROGRAMS', 'href', '/programs')
          ), 'styles', JSON_OBJECT('backgroundColor', '#0a0a0a', 'paddingTop', '120px', 'paddingBottom', '120px')),
          JSON_OBJECT('type', 'STATS', 'props', JSON_OBJECT(
            'items', JSON_ARRAY(
              JSON_OBJECT('value', '10,000+', 'label', 'Members Strong'),
              JSON_OBJECT('value', '50+', 'label', 'Expert Trainers'),
              JSON_OBJECT('value', '24/7', 'label', 'Always Open'),
              JSON_OBJECT('value', '15', 'label', 'Years Experience')
            )
          ), 'styles', JSON_OBJECT('backgroundColor', '#171717')),
          JSON_OBJECT('type', 'FEATURES', 'props', JSON_OBJECT(
            'headline', 'TRAINING PROGRAMS',
            'items', JSON_ARRAY(
              JSON_OBJECT('icon', '💪', 'title', 'Strength Training', 'text', 'Build muscle with our Olympic-grade equipment.'),
              JSON_OBJECT('icon', '🔥', 'title', 'HIIT Classes', 'text', 'Burn fat with high-intensity interval training.'),
              JSON_OBJECT('icon', '🥊', 'title', 'Combat Sports', 'text', 'Boxing, MMA, and kickboxing programs.'),
              JSON_OBJECT('icon', '🧘', 'title', 'Recovery', 'text', 'Yoga, stretching, and recovery sessions.')
            )
          ), 'styles', JSON_OBJECT('backgroundColor', '#0a0a0a')),
          JSON_OBJECT('type', 'CTA', 'props', JSON_OBJECT(
            'headline', 'YOUR FIRST WEEK IS FREE',
            'description', 'No commitment. No credit card required. Just results.',
            'primaryCta', JSON_OBJECT('label', 'CLAIM FREE WEEK', 'href', '/pricing')
          ), 'styles', JSON_OBJECT('backgroundColor', '#ef4444')),
          JSON_OBJECT('type', 'FOOTER', 'props', JSON_OBJECT(
            'copyright', '© 2024 IronForge Fitness | Open 24/7'
          ), 'styles', JSON_OBJECT('backgroundColor', '#000000'))
        )
      ),
      JSON_OBJECT(
        'name', 'Programs',
        'path', '/programs',
        'components', JSON_ARRAY(
          JSON_OBJECT('type', 'NAVBAR', 'props', JSON_OBJECT(
            'logoText', 'IRONFORGE',
            'links', JSON_ARRAY(
              JSON_OBJECT('label', 'Programs', 'href', '/programs'),
              JSON_OBJECT('label', 'Trainers', 'href', '/trainers'),
              JSON_OBJECT('label', 'Pricing', 'href', '/pricing'),
              JSON_OBJECT('label', 'Contact', 'href', '/contact')
            ),
            'cta', JSON_OBJECT('label', 'Join Now', 'href', '/pricing')
          ), 'styles', JSON_OBJECT('backgroundColor', '#0a0a0a')),
          JSON_OBJECT('type', 'HERO', 'props', JSON_OBJECT(
            'headline', 'OUR PROGRAMS',
            'subheadline', 'Find the perfect training program for your goals'
          ), 'styles', JSON_OBJECT('backgroundColor', '#0a0a0a', 'paddingTop', '80px', 'paddingBottom', '60px')),
          JSON_OBJECT('type', 'CARDS', 'props', JSON_OBJECT(
            'cards', JSON_ARRAY(
              JSON_OBJECT('title', 'POWERLIFTING', 'text', 'Master the squat, bench, and deadlift with expert coaching.'),
              JSON_OBJECT('title', 'BODYBUILDING', 'text', 'Sculpt your physique with hypertrophy-focused training.'),
              JSON_OBJECT('title', 'CROSSFIT', 'text', 'Functional fitness for all-around athletic performance.'),
              JSON_OBJECT('title', 'BOXING', 'text', 'Learn technique, build cardio, and relieve stress.'),
              JSON_OBJECT('title', 'YOGA', 'text', 'Improve flexibility, balance, and mental clarity.'),
              JSON_OBJECT('title', 'PERSONAL TRAINING', 'text', '1-on-1 coaching tailored to your specific goals.')
            )
          ), 'styles', JSON_OBJECT('backgroundColor', '#171717')),
          JSON_OBJECT('type', 'FOOTER', 'props', JSON_OBJECT(
            'copyright', '© 2024 IronForge Fitness | Open 24/7'
          ), 'styles', JSON_OBJECT('backgroundColor', '#000000'))
        )
      ),
      JSON_OBJECT(
        'name', 'Pricing',
        'path', '/pricing',
        'components', JSON_ARRAY(
          JSON_OBJECT('type', 'NAVBAR', 'props', JSON_OBJECT(
            'logoText', 'IRONFORGE',
            'links', JSON_ARRAY(
              JSON_OBJECT('label', 'Programs', 'href', '/programs'),
              JSON_OBJECT('label', 'Trainers', 'href', '/trainers'),
              JSON_OBJECT('label', 'Pricing', 'href', '/pricing'),
              JSON_OBJECT('label', 'Contact', 'href', '/contact')
            ),
            'cta', JSON_OBJECT('label', 'Join Now', 'href', '/pricing')
          ), 'styles', JSON_OBJECT('backgroundColor', '#0a0a0a')),
          JSON_OBJECT('type', 'HERO', 'props', JSON_OBJECT(
            'headline', 'MEMBERSHIP PLANS',
            'subheadline', 'Invest in yourself. Choose your path.'
          ), 'styles', JSON_OBJECT('backgroundColor', '#0a0a0a', 'paddingTop', '80px', 'paddingBottom', '60px')),
          JSON_OBJECT('type', 'PRICING', 'props', JSON_OBJECT(
            'plans', JSON_ARRAY(
              JSON_OBJECT('name', 'BASIC', 'price', '$29', 'period', '/month', 'features', JSON_ARRAY('Gym access', 'Locker room', 'Free WiFi'), 'featured', false),
              JSON_OBJECT('name', 'PRO', 'price', '$59', 'period', '/month', 'features', JSON_ARRAY('Everything in Basic', 'All group classes', 'Sauna access', 'Guest passes'), 'featured', true),
              JSON_OBJECT('name', 'ELITE', 'price', '$99', 'period', '/month', 'features', JSON_ARRAY('Everything in Pro', '4 PT sessions/month', 'Nutrition coaching', 'Priority booking'), 'featured', false)
            )
          ), 'styles', JSON_OBJECT('backgroundColor', '#171717')),
          JSON_OBJECT('type', 'FOOTER', 'props', JSON_OBJECT(
            'copyright', '© 2024 IronForge Fitness | Open 24/7'
          ), 'styles', JSON_OBJECT('backgroundColor', '#000000'))
        )
      ),
      JSON_OBJECT(
        'name', 'Contact',
        'path', '/contact',
        'components', JSON_ARRAY(
          JSON_OBJECT('type', 'NAVBAR', 'props', JSON_OBJECT(
            'logoText', 'IRONFORGE',
            'links', JSON_ARRAY(
              JSON_OBJECT('label', 'Programs', 'href', '/programs'),
              JSON_OBJECT('label', 'Trainers', 'href', '/trainers'),
              JSON_OBJECT('label', 'Pricing', 'href', '/pricing'),
              JSON_OBJECT('label', 'Contact', 'href', '/contact')
            ),
            'cta', JSON_OBJECT('label', 'Join Now', 'href', '/pricing')
          ), 'styles', JSON_OBJECT('backgroundColor', '#0a0a0a')),
          JSON_OBJECT('type', 'HERO', 'props', JSON_OBJECT(
            'headline', 'GET IN TOUCH',
            'subheadline', 'Ready to start your transformation?'
          ), 'styles', JSON_OBJECT('backgroundColor', '#0a0a0a', 'paddingTop', '80px', 'paddingBottom', '60px')),
          JSON_OBJECT('type', 'FEATURES', 'props', JSON_OBJECT(
            'items', JSON_ARRAY(
              JSON_OBJECT('icon', '📍', 'title', 'Location', 'text', '456 Fitness Ave, Los Angeles, CA'),
              JSON_OBJECT('icon', '📞', 'title', 'Phone', 'text', '(310) 555-IRON'),
              JSON_OBJECT('icon', '✉️', 'title', 'Email', 'text', 'info@ironforge.fit'),
              JSON_OBJECT('icon', '🕐', 'title', 'Hours', 'text', 'Open 24/7, 365 days')
            )
          ), 'styles', JSON_OBJECT('backgroundColor', '#171717')),
          JSON_OBJECT('type', 'CONTACT_FORM', 'props', JSON_OBJECT(
            'headline', 'Send us a Message'
          ), 'styles', JSON_OBJECT('backgroundColor', '#0a0a0a')),
          JSON_OBJECT('type', 'FOOTER', 'props', JSON_OBJECT(
            'copyright', '© 2024 IronForge Fitness | Open 24/7'
          ), 'styles', JSON_OBJECT('backgroundColor', '#000000'))
        )
      )
    )
  )
);

-- ============================================================================
-- TEMPLATE 3: NOVA DIGITAL - Creative Agency
-- Style: Clean, minimal, purple accents
-- ============================================================================
INSERT INTO templates (name, category, preview_image_url, structure_json)
VALUES (
  'Nova Digital',
  'Agency',
  '/uploads/template-previews/nova.svg',
  JSON_OBJECT(
    'designSystem', JSON_OBJECT(
      'colors', JSON_OBJECT(
        'primary', '#8b5cf6',
        'secondary', '#06b6d4',
        'background', '#0f0f1a',
        'surface', '#1a1a2e',
        'text', '#ffffff',
        'mutedText', 'rgba(255,255,255,0.7)'
      ),
      'typography', JSON_OBJECT(
        'fontFamily', '"Inter", -apple-system, sans-serif',
        'baseFontSize', 16,
        'lineHeight', 1.6
      )
    ),
    'pages', JSON_ARRAY(
      JSON_OBJECT(
        'name', 'Home',
        'path', '/',
        'components', JSON_ARRAY(
          JSON_OBJECT('type', 'NAVBAR', 'props', JSON_OBJECT(
            'logoText', 'nova.',
            'links', JSON_ARRAY(
              JSON_OBJECT('label', 'Work', 'href', '/work'),
              JSON_OBJECT('label', 'Services', 'href', '/services'),
              JSON_OBJECT('label', 'About', 'href', '/about'),
              JSON_OBJECT('label', 'Contact', 'href', '/contact')
            ),
            'cta', JSON_OBJECT('label', 'Start a Project', 'href', '/contact')
          ), 'styles', JSON_OBJECT('backgroundColor', '#0f0f1a')),
          JSON_OBJECT('type', 'HERO', 'props', JSON_OBJECT(
            'headline', 'We craft digital experiences that inspire action',
            'subheadline', 'Nova Digital is a full-service creative agency helping brands stand out in the digital landscape through strategy, design, and technology.',
            'primaryCta', JSON_OBJECT('label', 'See Our Work', 'href', '/work'),
            'secondaryCta', JSON_OBJECT('label', 'Get in Touch', 'href', '/contact')
          ), 'styles', JSON_OBJECT('backgroundColor', '#0f0f1a', 'paddingTop', '120px', 'paddingBottom', '100px')),
          JSON_OBJECT('type', 'CARDS', 'props', JSON_OBJECT(
            'headline', 'Featured Projects',
            'cards', JSON_ARRAY(
              JSON_OBJECT('title', 'Lumina Rebrand', 'text', 'Complete brand identity for a fintech startup', 'cta', JSON_OBJECT('label', 'View Case Study', 'href', '/work/lumina')),
              JSON_OBJECT('title', 'Zenith App', 'text', 'Mobile app design for a meditation platform', 'cta', JSON_OBJECT('label', 'View Case Study', 'href', '/work/zenith')),
              JSON_OBJECT('title', 'Artisan E-commerce', 'text', 'Shopify store for handcrafted goods', 'cta', JSON_OBJECT('label', 'View Case Study', 'href', '/work/artisan'))
            )
          ), 'styles', JSON_OBJECT('backgroundColor', '#1a1a2e')),
          JSON_OBJECT('type', 'FEATURES', 'props', JSON_OBJECT(
            'headline', 'Our Services',
            'items', JSON_ARRAY(
              JSON_OBJECT('icon', '🎨', 'title', 'Brand Strategy', 'text', 'Define your brand voice, positioning, and visual identity.'),
              JSON_OBJECT('icon', '✏️', 'title', 'UI/UX Design', 'text', 'User-centered design for web and mobile applications.'),
              JSON_OBJECT('icon', '💻', 'title', 'Web Development', 'text', 'Custom websites built with modern technologies.'),
              JSON_OBJECT('icon', '📱', 'title', 'Digital Marketing', 'text', 'SEO, social media, and performance marketing.')
            )
          ), 'styles', JSON_OBJECT('backgroundColor', '#0f0f1a')),
          JSON_OBJECT('type', 'TESTIMONIALS', 'props', JSON_OBJECT(
            'headline', 'What Clients Say',
            'items', JSON_ARRAY(
              JSON_OBJECT('quote', 'Nova transformed our brand and helped us stand out in a crowded market.', 'name', 'Sarah Chen', 'role', 'CEO, Lumina'),
              JSON_OBJECT('quote', 'Professional, creative, and a pleasure to work with. Highly recommended.', 'name', 'Marcus Johnson', 'role', 'Founder, Zenith')
            )
          ), 'styles', JSON_OBJECT('backgroundColor', '#1a1a2e')),
          JSON_OBJECT('type', 'CTA', 'props', JSON_OBJECT(
            'headline', 'Ready to start your project?',
            'description', 'Let''s create something amazing together.',
            'primaryCta', JSON_OBJECT('label', 'Get in Touch', 'href', '/contact')
          ), 'styles', JSON_OBJECT('backgroundColor', '#8b5cf6')),
          JSON_OBJECT('type', 'FOOTER', 'props', JSON_OBJECT(
            'copyright', '© 2024 Nova Digital | hello@novadigital.co'
          ), 'styles', JSON_OBJECT('backgroundColor', '#0a0a12'))
        )
      ),
      JSON_OBJECT(
        'name', 'Work',
        'path', '/work',
        'components', JSON_ARRAY(
          JSON_OBJECT('type', 'NAVBAR', 'props', JSON_OBJECT(
            'logoText', 'nova.',
            'links', JSON_ARRAY(
              JSON_OBJECT('label', 'Work', 'href', '/work'),
              JSON_OBJECT('label', 'Services', 'href', '/services'),
              JSON_OBJECT('label', 'About', 'href', '/about'),
              JSON_OBJECT('label', 'Contact', 'href', '/contact')
            ),
            'cta', JSON_OBJECT('label', 'Start a Project', 'href', '/contact')
          ), 'styles', JSON_OBJECT('backgroundColor', '#0f0f1a')),
          JSON_OBJECT('type', 'HERO', 'props', JSON_OBJECT(
            'headline', 'Our Work',
            'subheadline', 'A selection of projects we''re proud of'
          ), 'styles', JSON_OBJECT('backgroundColor', '#0f0f1a', 'paddingTop', '80px', 'paddingBottom', '60px')),
          JSON_OBJECT('type', 'CARDS', 'props', JSON_OBJECT(
            'cards', JSON_ARRAY(
              JSON_OBJECT('title', 'Lumina Rebrand', 'text', 'Brand Identity • Fintech'),
              JSON_OBJECT('title', 'Zenith App', 'text', 'Mobile App • Wellness'),
              JSON_OBJECT('title', 'Artisan E-commerce', 'text', 'E-commerce • Retail'),
              JSON_OBJECT('title', 'Pulse Dashboard', 'text', 'Web App • Analytics'),
              JSON_OBJECT('title', 'Verde Campaign', 'text', 'Marketing • Sustainability'),
              JSON_OBJECT('title', 'Atlas Website', 'text', 'Website • Travel')
            )
          ), 'styles', JSON_OBJECT('backgroundColor', '#1a1a2e')),
          JSON_OBJECT('type', 'FOOTER', 'props', JSON_OBJECT(
            'copyright', '© 2024 Nova Digital | hello@novadigital.co'
          ), 'styles', JSON_OBJECT('backgroundColor', '#0a0a12'))
        )
      ),
      JSON_OBJECT(
        'name', 'Services',
        'path', '/services',
        'components', JSON_ARRAY(
          JSON_OBJECT('type', 'NAVBAR', 'props', JSON_OBJECT(
            'logoText', 'nova.',
            'links', JSON_ARRAY(
              JSON_OBJECT('label', 'Work', 'href', '/work'),
              JSON_OBJECT('label', 'Services', 'href', '/services'),
              JSON_OBJECT('label', 'About', 'href', '/about'),
              JSON_OBJECT('label', 'Contact', 'href', '/contact')
            ),
            'cta', JSON_OBJECT('label', 'Start a Project', 'href', '/contact')
          ), 'styles', JSON_OBJECT('backgroundColor', '#0f0f1a')),
          JSON_OBJECT('type', 'HERO', 'props', JSON_OBJECT(
            'headline', 'Our Services',
            'subheadline', 'End-to-end digital solutions for modern brands'
          ), 'styles', JSON_OBJECT('backgroundColor', '#0f0f1a', 'paddingTop', '80px', 'paddingBottom', '60px')),
          JSON_OBJECT('type', 'FEATURES', 'props', JSON_OBJECT(
            'items', JSON_ARRAY(
              JSON_OBJECT('icon', '🎯', 'title', 'Brand Strategy', 'text', 'Market research, positioning, brand architecture, and messaging frameworks.'),
              JSON_OBJECT('icon', '🎨', 'title', 'Visual Identity', 'text', 'Logo design, color systems, typography, and brand guidelines.'),
              JSON_OBJECT('icon', '✏️', 'title', 'UI/UX Design', 'text', 'User research, wireframing, prototyping, and interface design.'),
              JSON_OBJECT('icon', '💻', 'title', 'Web Development', 'text', 'Custom websites, web applications, and CMS implementations.'),
              JSON_OBJECT('icon', '📱', 'title', 'Mobile Apps', 'text', 'Native and cross-platform mobile application development.'),
              JSON_OBJECT('icon', '📈', 'title', 'Digital Marketing', 'text', 'SEO, content strategy, social media, and paid advertising.')
            )
          ), 'styles', JSON_OBJECT('backgroundColor', '#1a1a2e')),
          JSON_OBJECT('type', 'CTA', 'props', JSON_OBJECT(
            'headline', 'Let''s discuss your project',
            'primaryCta', JSON_OBJECT('label', 'Get in Touch', 'href', '/contact')
          ), 'styles', JSON_OBJECT('backgroundColor', '#8b5cf6')),
          JSON_OBJECT('type', 'FOOTER', 'props', JSON_OBJECT(
            'copyright', '© 2024 Nova Digital | hello@novadigital.co'
          ), 'styles', JSON_OBJECT('backgroundColor', '#0a0a12'))
        )
      ),
      JSON_OBJECT(
        'name', 'Contact',
        'path', '/contact',
        'components', JSON_ARRAY(
          JSON_OBJECT('type', 'NAVBAR', 'props', JSON_OBJECT(
            'logoText', 'nova.',
            'links', JSON_ARRAY(
              JSON_OBJECT('label', 'Work', 'href', '/work'),
              JSON_OBJECT('label', 'Services', 'href', '/services'),
              JSON_OBJECT('label', 'About', 'href', '/about'),
              JSON_OBJECT('label', 'Contact', 'href', '/contact')
            ),
            'cta', JSON_OBJECT('label', 'Start a Project', 'href', '/contact')
          ), 'styles', JSON_OBJECT('backgroundColor', '#0f0f1a')),
          JSON_OBJECT('type', 'HERO', 'props', JSON_OBJECT(
            'headline', 'Let''s Talk',
            'subheadline', 'Have a project in mind? We''d love to hear about it.'
          ), 'styles', JSON_OBJECT('backgroundColor', '#0f0f1a', 'paddingTop', '80px', 'paddingBottom', '60px')),
          JSON_OBJECT('type', 'FEATURES', 'props', JSON_OBJECT(
            'items', JSON_ARRAY(
              JSON_OBJECT('icon', '✉️', 'title', 'Email', 'text', 'hello@novadigital.co'),
              JSON_OBJECT('icon', '📞', 'title', 'Phone', 'text', '+1 (555) 123-4567'),
              JSON_OBJECT('icon', '📍', 'title', 'Office', 'text', '123 Creative St, San Francisco, CA')
            )
          ), 'styles', JSON_OBJECT('backgroundColor', '#1a1a2e')),
          JSON_OBJECT('type', 'CONTACT_FORM', 'props', JSON_OBJECT(
            'headline', 'Send us a message'
          ), 'styles', JSON_OBJECT('backgroundColor', '#0f0f1a')),
          JSON_OBJECT('type', 'FOOTER', 'props', JSON_OBJECT(
            'copyright', '© 2024 Nova Digital | hello@novadigital.co'
          ), 'styles', JSON_OBJECT('backgroundColor', '#0a0a12'))
        )
      )
    )
  )
);

-- ============================================================================
-- TEMPLATE 4: CLOUDPULSE - SaaS Platform
-- Style: Modern, blue gradients, tech-focused
-- ============================================================================
INSERT INTO templates (name, category, preview_image_url, structure_json)
VALUES (
  'CloudPulse',
  'SaaS',
  '/uploads/template-previews/cloudpulse.svg',
  JSON_OBJECT(
    'designSystem', JSON_OBJECT(
      'colors', JSON_OBJECT(
        'primary', '#3b82f6',
        'secondary', '#8b5cf6',
        'background', '#0f172a',
        'surface', '#1e293b',
        'text', '#f8fafc',
        'mutedText', '#94a3b8'
      ),
      'typography', JSON_OBJECT(
        'fontFamily', '"Plus Jakarta Sans", -apple-system, sans-serif',
        'baseFontSize', 16,
        'lineHeight', 1.6
      )
    ),
    'pages', JSON_ARRAY(
      JSON_OBJECT(
        'name', 'Home',
        'path', '/',
        'components', JSON_ARRAY(
          JSON_OBJECT('type', 'NAVBAR', 'props', JSON_OBJECT(
            'logoText', 'CloudPulse',
            'links', JSON_ARRAY(
              JSON_OBJECT('label', 'Product', 'href', '/product'),
              JSON_OBJECT('label', 'Pricing', 'href', '/pricing'),
              JSON_OBJECT('label', 'Docs', 'href', '/docs'),
              JSON_OBJECT('label', 'Blog', 'href', '/blog')
            ),
            'cta', JSON_OBJECT('label', 'Start Free Trial', 'href', '/signup')
          ), 'styles', JSON_OBJECT('backgroundColor', '#0f172a')),
          JSON_OBJECT('type', 'HERO', 'props', JSON_OBJECT(
            'headline', 'Monitor everything. Miss nothing.',
            'subheadline', 'CloudPulse gives engineering teams real-time visibility into their entire stack. Catch issues before your users do.',
            'primaryCta', JSON_OBJECT('label', 'Start Free Trial', 'href', '/signup'),
            'secondaryCta', JSON_OBJECT('label', 'Watch Demo', 'href', '/demo')
          ), 'styles', JSON_OBJECT('backgroundColor', '#0f172a', 'paddingTop', '120px', 'paddingBottom', '100px')),
          JSON_OBJECT('type', 'STATS', 'props', JSON_OBJECT(
            'items', JSON_ARRAY(
              JSON_OBJECT('value', '99.99%', 'label', 'Uptime SLA'),
              JSON_OBJECT('value', '<100ms', 'label', 'Alert Latency'),
              JSON_OBJECT('value', '10B+', 'label', 'Events/Day'),
              JSON_OBJECT('value', '5,000+', 'label', 'Companies')
            )
          ), 'styles', JSON_OBJECT('backgroundColor', '#1e293b')),
          JSON_OBJECT('type', 'FEATURES', 'props', JSON_OBJECT(
            'headline', 'Everything you need to stay ahead',
            'items', JSON_ARRAY(
              JSON_OBJECT('icon', '📊', 'title', 'Real-time Dashboards', 'text', 'Customizable dashboards with live metrics and alerts.'),
              JSON_OBJECT('icon', '🔔', 'title', 'Smart Alerts', 'text', 'AI-powered anomaly detection that reduces alert fatigue.'),
              JSON_OBJECT('icon', '🔍', 'title', 'Deep Tracing', 'text', 'Distributed tracing across all your services.'),
              JSON_OBJECT('icon', '🔗', 'title', '200+ Integrations', 'text', 'AWS, GCP, Kubernetes, and more out of the box.')
            )
          ), 'styles', JSON_OBJECT('backgroundColor', '#0f172a')),
          JSON_OBJECT('type', 'TESTIMONIALS', 'props', JSON_OBJECT(
            'headline', 'Trusted by engineering teams',
            'items', JSON_ARRAY(
              JSON_OBJECT('quote', 'CloudPulse cut our incident response time by 60%.', 'name', 'Alex Rivera', 'role', 'CTO, TechCorp'),
              JSON_OBJECT('quote', 'The best monitoring tool we''ve ever used. Period.', 'name', 'Jordan Lee', 'role', 'VP Engineering, StartupXYZ')
            )
          ), 'styles', JSON_OBJECT('backgroundColor', '#1e293b')),
          JSON_OBJECT('type', 'CTA', 'props', JSON_OBJECT(
            'headline', 'Ready to see everything?',
            'description', 'Start your free 14-day trial. No credit card required.',
            'primaryCta', JSON_OBJECT('label', 'Start Free Trial', 'href', '/signup')
          ), 'styles', JSON_OBJECT('backgroundColor', '#3b82f6')),
          JSON_OBJECT('type', 'FOOTER', 'props', JSON_OBJECT(
            'copyright', '© 2024 CloudPulse Inc. | San Francisco, CA'
          ), 'styles', JSON_OBJECT('backgroundColor', '#020617'))
        )
      ),
      JSON_OBJECT(
        'name', 'Pricing',
        'path', '/pricing',
        'components', JSON_ARRAY(
          JSON_OBJECT('type', 'NAVBAR', 'props', JSON_OBJECT(
            'logoText', 'CloudPulse',
            'links', JSON_ARRAY(
              JSON_OBJECT('label', 'Product', 'href', '/product'),
              JSON_OBJECT('label', 'Pricing', 'href', '/pricing'),
              JSON_OBJECT('label', 'Docs', 'href', '/docs'),
              JSON_OBJECT('label', 'Blog', 'href', '/blog')
            ),
            'cta', JSON_OBJECT('label', 'Start Free Trial', 'href', '/signup')
          ), 'styles', JSON_OBJECT('backgroundColor', '#0f172a')),
          JSON_OBJECT('type', 'HERO', 'props', JSON_OBJECT(
            'headline', 'Simple, transparent pricing',
            'subheadline', 'Start free, scale as you grow'
          ), 'styles', JSON_OBJECT('backgroundColor', '#0f172a', 'paddingTop', '80px', 'paddingBottom', '60px')),
          JSON_OBJECT('type', 'PRICING', 'props', JSON_OBJECT(
            'plans', JSON_ARRAY(
              JSON_OBJECT('name', 'Starter', 'price', '$0', 'period', '/month', 'features', JSON_ARRAY('5 hosts', '1 day retention', 'Community support', 'Basic dashboards'), 'featured', false),
              JSON_OBJECT('name', 'Pro', 'price', '$49', 'period', '/host/mo', 'features', JSON_ARRAY('Unlimited hosts', '30 day retention', 'Priority support', 'Smart alerts', 'Custom dashboards'), 'featured', true),
              JSON_OBJECT('name', 'Enterprise', 'price', 'Custom', 'period', '', 'features', JSON_ARRAY('Unlimited everything', '1 year retention', 'Dedicated support', 'SSO & RBAC', 'SLA guarantee'), 'featured', false)
            )
          ), 'styles', JSON_OBJECT('backgroundColor', '#1e293b')),
          JSON_OBJECT('type', 'FAQ', 'props', JSON_OBJECT(
            'headline', 'Frequently asked questions',
            'items', JSON_ARRAY(
              JSON_OBJECT('q', 'How long does setup take?', 'a', 'Most teams are up and running in under 5 minutes with our guided setup.'),
              JSON_OBJECT('q', 'Can I change plans later?', 'a', 'Yes, you can upgrade or downgrade at any time.'),
              JSON_OBJECT('q', 'What about data privacy?', 'a', 'We are SOC 2 Type II certified and GDPR compliant.')
            )
          ), 'styles', JSON_OBJECT('backgroundColor', '#0f172a')),
          JSON_OBJECT('type', 'FOOTER', 'props', JSON_OBJECT(
            'copyright', '© 2024 CloudPulse Inc. | San Francisco, CA'
          ), 'styles', JSON_OBJECT('backgroundColor', '#020617'))
        )
      )
    )
  )
);

-- ============================================================================
-- TEMPLATE 5: PRESTIGE ESTATES - Luxury Real Estate
-- Style: Sophisticated, navy/gold, serif typography
-- ============================================================================
INSERT INTO templates (name, category, preview_image_url, structure_json)
VALUES (
  'Prestige Estates',
  'Real Estate',
  '/uploads/template-previews/prestige.svg',
  JSON_OBJECT(
    'designSystem', JSON_OBJECT(
      'colors', JSON_OBJECT(
        'primary', '#1e3a5f',
        'secondary', '#c9a962',
        'background', '#0d1b2a',
        'surface', '#1b263b',
        'text', '#ffffff',
        'mutedText', 'rgba(255,255,255,0.7)'
      ),
      'typography', JSON_OBJECT(
        'fontFamily', '"Cormorant Garamond", Georgia, serif',
        'baseFontSize', 18,
        'lineHeight', 1.7
      )
    ),
    'pages', JSON_ARRAY(
      JSON_OBJECT(
        'name', 'Home',
        'path', '/',
        'components', JSON_ARRAY(
          JSON_OBJECT('type', 'NAVBAR', 'props', JSON_OBJECT(
            'logoText', 'PRESTIGE ESTATES',
            'links', JSON_ARRAY(
              JSON_OBJECT('label', 'Properties', 'href', '/properties'),
              JSON_OBJECT('label', 'Services', 'href', '/services'),
              JSON_OBJECT('label', 'About', 'href', '/about'),
              JSON_OBJECT('label', 'Contact', 'href', '/contact')
            ),
            'cta', JSON_OBJECT('label', 'Schedule Viewing', 'href', '/contact')
          ), 'styles', JSON_OBJECT('backgroundColor', '#0d1b2a')),
          JSON_OBJECT('type', 'HERO', 'props', JSON_OBJECT(
            'headline', 'Where Extraordinary Finds Home',
            'subheadline', 'For over 40 years, Prestige Estates has connected discerning buyers with the world''s most exceptional properties.',
            'primaryCta', JSON_OBJECT('label', 'Explore Properties', 'href', '/properties'),
            'secondaryCta', JSON_OBJECT('label', 'Sell With Us', 'href', '/services')
          ), 'styles', JSON_OBJECT('backgroundColor', '#0d1b2a', 'paddingTop', '120px', 'paddingBottom', '120px')),
          JSON_OBJECT('type', 'CARDS', 'props', JSON_OBJECT(
            'headline', 'Featured Listings',
            'cards', JSON_ARRAY(
              JSON_OBJECT('title', 'Central Park Penthouse', 'text', '$28,500,000 • 5 BD • 6 BA • 8,200 SF'),
              JSON_OBJECT('title', 'Malibu Oceanfront', 'text', '$45,000,000 • 7 BD • 9 BA • 12,000 SF'),
              JSON_OBJECT('title', 'Tuscan Villa Estate', 'text', '€18,000,000 • 8 BD • 10 BA • 15,000 SF')
            )
          ), 'styles', JSON_OBJECT('backgroundColor', '#1b263b')),
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
          ), 'styles', JSON_OBJECT('backgroundColor', '#0d1b2a')),
          JSON_OBJECT('type', 'CTA', 'props', JSON_OBJECT(
            'headline', 'Begin Your Search',
            'description', 'Our advisors are ready to guide you to your perfect property.',
            'primaryCta', JSON_OBJECT('label', 'Contact an Advisor', 'href', '/contact')
          ), 'styles', JSON_OBJECT('backgroundColor', '#c9a962')),
          JSON_OBJECT('type', 'FOOTER', 'props', JSON_OBJECT(
            'copyright', '© 2024 Prestige Estates | Luxury Real Estate Since 1984'
          ), 'styles', JSON_OBJECT('backgroundColor', '#0a1628'))
        )
      ),
      JSON_OBJECT(
        'name', 'Properties',
        'path', '/properties',
        'components', JSON_ARRAY(
          JSON_OBJECT('type', 'NAVBAR', 'props', JSON_OBJECT(
            'logoText', 'PRESTIGE ESTATES',
            'links', JSON_ARRAY(
              JSON_OBJECT('label', 'Properties', 'href', '/properties'),
              JSON_OBJECT('label', 'Services', 'href', '/services'),
              JSON_OBJECT('label', 'About', 'href', '/about'),
              JSON_OBJECT('label', 'Contact', 'href', '/contact')
            ),
            'cta', JSON_OBJECT('label', 'Schedule Viewing', 'href', '/contact')
          ), 'styles', JSON_OBJECT('backgroundColor', '#0d1b2a')),
          JSON_OBJECT('type', 'HERO', 'props', JSON_OBJECT(
            'headline', 'Our Properties',
            'subheadline', 'Exceptional homes for discerning buyers'
          ), 'styles', JSON_OBJECT('backgroundColor', '#0d1b2a', 'paddingTop', '80px', 'paddingBottom', '60px')),
          JSON_OBJECT('type', 'CARDS', 'props', JSON_OBJECT(
            'cards', JSON_ARRAY(
              JSON_OBJECT('title', 'Central Park Penthouse', 'text', 'New York • $28,500,000'),
              JSON_OBJECT('title', 'Malibu Oceanfront', 'text', 'California • $45,000,000'),
              JSON_OBJECT('title', 'Tuscan Villa Estate', 'text', 'Italy • €18,000,000'),
              JSON_OBJECT('title', 'London Townhouse', 'text', 'UK • £15,000,000'),
              JSON_OBJECT('title', 'Miami Beach Mansion', 'text', 'Florida • $32,000,000'),
              JSON_OBJECT('title', 'Aspen Mountain Retreat', 'text', 'Colorado • $22,000,000')
            )
          ), 'styles', JSON_OBJECT('backgroundColor', '#1b263b')),
          JSON_OBJECT('type', 'FOOTER', 'props', JSON_OBJECT(
            'copyright', '© 2024 Prestige Estates | Luxury Real Estate Since 1984'
          ), 'styles', JSON_OBJECT('backgroundColor', '#0a1628'))
        )
      ),
      JSON_OBJECT(
        'name', 'Contact',
        'path', '/contact',
        'components', JSON_ARRAY(
          JSON_OBJECT('type', 'NAVBAR', 'props', JSON_OBJECT(
            'logoText', 'PRESTIGE ESTATES',
            'links', JSON_ARRAY(
              JSON_OBJECT('label', 'Properties', 'href', '/properties'),
              JSON_OBJECT('label', 'Services', 'href', '/services'),
              JSON_OBJECT('label', 'About', 'href', '/about'),
              JSON_OBJECT('label', 'Contact', 'href', '/contact')
            ),
            'cta', JSON_OBJECT('label', 'Schedule Viewing', 'href', '/contact')
          ), 'styles', JSON_OBJECT('backgroundColor', '#0d1b2a')),
          JSON_OBJECT('type', 'HERO', 'props', JSON_OBJECT(
            'headline', 'Contact Us',
            'subheadline', 'Our team is ready to assist you'
          ), 'styles', JSON_OBJECT('backgroundColor', '#0d1b2a', 'paddingTop', '80px', 'paddingBottom', '60px')),
          JSON_OBJECT('type', 'FEATURES', 'props', JSON_OBJECT(
            'items', JSON_ARRAY(
              JSON_OBJECT('icon', '📍', 'title', 'New York Office', 'text', '432 Park Avenue, New York, NY'),
              JSON_OBJECT('icon', '📞', 'title', 'Phone', 'text', '+1 (212) 555-0100'),
              JSON_OBJECT('icon', '✉️', 'title', 'Email', 'text', 'inquiries@prestigeestates.com')
            )
          ), 'styles', JSON_OBJECT('backgroundColor', '#1b263b')),
          JSON_OBJECT('type', 'CONTACT_FORM', 'props', JSON_OBJECT(
            'headline', 'Schedule a Consultation'
          ), 'styles', JSON_OBJECT('backgroundColor', '#0d1b2a')),
          JSON_OBJECT('type', 'FOOTER', 'props', JSON_OBJECT(
            'copyright', '© 2024 Prestige Estates | Luxury Real Estate Since 1984'
          ), 'styles', JSON_OBJECT('backgroundColor', '#0a1628'))
        )
      )
    )
  )
);
