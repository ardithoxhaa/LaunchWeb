-- Professional Templates Part 3: Education, Healthcare, E-commerce, Law

-- ============================================================================
-- TEMPLATE 7: BRIGHT MINDS - Online Learning Platform
-- Style: Friendly, colorful, accessible
-- ============================================================================
INSERT INTO templates (name, category, preview_image_url, structure_json)
VALUES
(
  'Bright Minds Academy',
  'Education',
  '/uploads/template-previews/brightminds.svg',
  JSON_OBJECT(
    'designSystem', JSON_OBJECT(
      'colors', JSON_OBJECT(
        'primary', '#7c3aed',
        'secondary', '#06b6d4',
        'background', '#f8fafc',
        'surface', '#ffffff',
        'text', '#1e293b',
        'mutedText', '#64748b'
      ),
      'typography', JSON_OBJECT(
        'fontFamily', '"Nunito", -apple-system, sans-serif',
        'baseFontSize', 16,
        'lineHeight', 1.7,
        'headingWeight', 800,
        'bodyWeight', 400
      ),
      'spacing', JSON_OBJECT('sectionY', 80, 'containerX', 24)
    ),
    'pages', JSON_ARRAY(
      JSON_OBJECT(
        'name', 'Home',
        'path', '/',
        'meta', JSON_OBJECT('title', 'Bright Minds Academy | Learn Without Limits', 'description', 'Online courses from world-class instructors'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type', 'NAVBAR', 'props', JSON_OBJECT(
            'logoText', '🎓 Bright Minds',
            'links', JSON_ARRAY(
              JSON_OBJECT('label', 'Courses', 'href', '/courses'),
              JSON_OBJECT('label', 'For Business', 'href', '/business'),
              JSON_OBJECT('label', 'Pricing', 'href', '/pricing')
            ),
            'cta', JSON_OBJECT('label', 'Start Learning Free', 'href', '/signup')
          ), 'styles', JSON_OBJECT('backgroundColor', '#ffffff')),
          JSON_OBJECT('type', 'HERO', 'props', JSON_OBJECT(
            'headline', 'Learn anything, anytime, anywhere',
            'subheadline', 'Join 5 million+ learners mastering new skills with courses from Harvard, MIT, Google, and industry experts.',
            'primaryCta', JSON_OBJECT('label', 'Explore Courses', 'href', '/courses'),
            'secondaryCta', JSON_OBJECT('label', 'Try for Free', 'href', '/signup')
          ), 'styles', JSON_OBJECT('backgroundColor', '#f8fafc', 'paddingTop', '100px', 'paddingBottom', '100px')),
          JSON_OBJECT('type', 'STATS', 'props', JSON_OBJECT(
            'items', JSON_ARRAY(
              JSON_OBJECT('value', '5M+', 'label', 'Active Learners'),
              JSON_OBJECT('value', '10,000+', 'label', 'Courses'),
              JSON_OBJECT('value', '500+', 'label', 'Expert Instructors'),
              JSON_OBJECT('value', '4.8★', 'label', 'Average Rating')
            )
          ), 'styles', JSON_OBJECT('backgroundColor', '#7c3aed')),
          JSON_OBJECT('type', 'CARDS', 'props', JSON_OBJECT(
            'headline', 'Popular Courses',
            'cards', JSON_ARRAY(
              JSON_OBJECT('title', 'Complete Web Development', 'text', 'From HTML to React. Build real projects.\n⭐ 4.9 • 120,000 students', 'cta', JSON_OBJECT('label', 'Enroll Now', 'href', '/courses/web-dev')),
              JSON_OBJECT('title', 'Data Science Bootcamp', 'text', 'Python, SQL, ML, and AI. Job-ready in 12 weeks.\n⭐ 4.8 • 85,000 students', 'cta', JSON_OBJECT('label', 'Enroll Now', 'href', '/courses/data-science')),
              JSON_OBJECT('title', 'UX Design Masterclass', 'text', 'Design thinking, Figma, and portfolio building.\n⭐ 4.9 • 45,000 students', 'cta', JSON_OBJECT('label', 'Enroll Now', 'href', '/courses/ux-design'))
            )
          ), 'styles', JSON_OBJECT('backgroundColor', '#ffffff')),
          JSON_OBJECT('type', 'FEATURES', 'props', JSON_OBJECT(
            'headline', 'Why Learn With Us',
            'items', JSON_ARRAY(
              JSON_OBJECT('icon', '🎯', 'title', 'Learn by Doing', 'text', 'Hands-on projects, not just videos.'),
              JSON_OBJECT('icon', '📱', 'title', 'Learn Anywhere', 'text', 'Mobile apps with offline downloads.'),
              JSON_OBJECT('icon', '🏆', 'title', 'Earn Certificates', 'text', 'Industry-recognized credentials.'),
              JSON_OBJECT('icon', '👥', 'title', 'Community Support', 'text', 'Connect with peers and mentors.')
            )
          ), 'styles', JSON_OBJECT('backgroundColor', '#f8fafc')),
          JSON_OBJECT('type', 'PRICING', 'props', JSON_OBJECT(
            'headline', 'Simple Pricing',
            'plans', JSON_ARRAY(
              JSON_OBJECT('name', 'Free', 'price', '$0', 'period', '/forever', 'features', JSON_ARRAY('1,000+ free courses', 'Basic certificates', 'Community forums'), 'featured', false),
              JSON_OBJECT('name', 'Pro', 'price', '$19', 'period', '/month', 'features', JSON_ARRAY('Unlimited courses', 'Verified certificates', 'Offline downloads'), 'featured', true),
              JSON_OBJECT('name', 'Teams', 'price', '$49', 'period', '/user/mo', 'features', JSON_ARRAY('Everything in Pro', 'Team analytics', 'Admin dashboard'), 'featured', false)
            )
          ), 'styles', JSON_OBJECT('backgroundColor', '#ffffff')),
          JSON_OBJECT('type', 'TESTIMONIALS', 'props', JSON_OBJECT(
            'headline', 'Success Stories',
            'items', JSON_ARRAY(
              JSON_OBJECT('quote', 'I went from barista to software engineer in 8 months.', 'name', 'Marcus Johnson', 'role', 'Now at Google'),
              JSON_OBJECT('quote', 'The data science course helped me transition careers at 40.', 'name', 'Linda Chen', 'role', 'Data Analyst')
            )
          ), 'styles', JSON_OBJECT('backgroundColor', '#f8fafc')),
          JSON_OBJECT('type', 'CTA', 'props', JSON_OBJECT(
            'headline', 'Start your learning journey today',
            'description', 'Join millions of learners building skills for the career they want.',
            'primaryCta', JSON_OBJECT('label', 'Get Started Free', 'href', '/signup')
          ), 'styles', JSON_OBJECT('backgroundColor', '#06b6d4')),
          JSON_OBJECT('type', 'FOOTER', 'props', JSON_OBJECT(
            'copyright', '© 2024 Bright Minds Academy | Learn Without Limits'
          ), 'styles', JSON_OBJECT('backgroundColor', '#1e293b'))
        )
      )
    )
  )
);

-- ============================================================================
-- TEMPLATE 8: SERENITY MEDICAL - Healthcare Practice
-- Style: Clean, trustworthy, calming blues
-- ============================================================================
INSERT INTO templates (name, category, preview_image_url, structure_json)
VALUES
(
  'Serenity Medical',
  'Healthcare',
  '/uploads/template-previews/serenity.svg',
  JSON_OBJECT(
    'designSystem', JSON_OBJECT(
      'colors', JSON_OBJECT(
        'primary', '#0891b2',
        'secondary', '#10b981',
        'background', '#f0fdfa',
        'surface', '#ffffff',
        'text', '#134e4a',
        'mutedText', '#5eead4'
      ),
      'typography', JSON_OBJECT(
        'fontFamily', '"Source Sans Pro", -apple-system, sans-serif',
        'baseFontSize', 16,
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
        'meta', JSON_OBJECT('title', 'Serenity Medical | Compassionate Care', 'description', 'Comprehensive medical care for the whole family'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type', 'NAVBAR', 'props', JSON_OBJECT(
            'logoText', '🏥 Serenity Medical',
            'links', JSON_ARRAY(
              JSON_OBJECT('label', 'Services', 'href', '/services'),
              JSON_OBJECT('label', 'Our Team', 'href', '/team'),
              JSON_OBJECT('label', 'Patient Portal', 'href', '/portal')
            ),
            'cta', JSON_OBJECT('label', 'Book Appointment', 'href', '/book')
          ), 'styles', JSON_OBJECT('backgroundColor', '#ffffff')),
          JSON_OBJECT('type', 'HERO', 'props', JSON_OBJECT(
            'headline', 'Your Health, Our Priority',
            'subheadline', 'Comprehensive, compassionate healthcare for you and your family. Same-day appointments available.',
            'primaryCta', JSON_OBJECT('label', 'Book an Appointment', 'href', '/book'),
            'secondaryCta', JSON_OBJECT('label', 'Our Services', 'href', '/services')
          ), 'styles', JSON_OBJECT('backgroundColor', '#f0fdfa', 'paddingTop', '100px', 'paddingBottom', '100px')),
          JSON_OBJECT('type', 'FEATURES', 'props', JSON_OBJECT(
            'headline', 'Our Services',
            'items', JSON_ARRAY(
              JSON_OBJECT('icon', '👨‍⚕️', 'title', 'Primary Care', 'text', 'Comprehensive health management for all ages.'),
              JSON_OBJECT('icon', '🩺', 'title', 'Preventive Care', 'text', 'Annual checkups, screenings, and vaccinations.'),
              JSON_OBJECT('icon', '💊', 'title', 'Chronic Care', 'text', 'Ongoing management of diabetes, hypertension, and more.'),
              JSON_OBJECT('icon', '🧠', 'title', 'Mental Health', 'text', 'Counseling and psychiatric services.')
            )
          ), 'styles', JSON_OBJECT('backgroundColor', '#ffffff')),
          JSON_OBJECT('type', 'STATS', 'props', JSON_OBJECT(
            'items', JSON_ARRAY(
              JSON_OBJECT('value', '25+', 'label', 'Years of Service'),
              JSON_OBJECT('value', '50,000+', 'label', 'Patients Served'),
              JSON_OBJECT('value', '15', 'label', 'Specialist Doctors'),
              JSON_OBJECT('value', '4.9★', 'label', 'Patient Rating')
            )
          ), 'styles', JSON_OBJECT('backgroundColor', '#0891b2')),
          JSON_OBJECT('type', 'TEAM', 'props', JSON_OBJECT(
            'headline', 'Meet Our Doctors',
            'members', JSON_ARRAY(
              JSON_OBJECT('name', 'Dr. Sarah Mitchell', 'role', 'Family Medicine', 'image', ''),
              JSON_OBJECT('name', 'Dr. James Chen', 'role', 'Internal Medicine', 'image', ''),
              JSON_OBJECT('name', 'Dr. Emily Rodriguez', 'role', 'Pediatrics', 'image', ''),
              JSON_OBJECT('name', 'Dr. Michael Park', 'role', 'Cardiology', 'image', '')
            )
          ), 'styles', JSON_OBJECT('backgroundColor', '#f0fdfa')),
          JSON_OBJECT('type', 'TESTIMONIALS', 'props', JSON_OBJECT(
            'headline', 'Patient Stories',
            'items', JSON_ARRAY(
              JSON_OBJECT('quote', 'The staff made me feel comfortable from the moment I walked in.', 'name', 'Jennifer L.', 'role', 'Patient since 2019'),
              JSON_OBJECT('quote', 'Dr. Mitchell took the time to really listen to my concerns.', 'name', 'Robert M.', 'role', 'Patient since 2021')
            )
          ), 'styles', JSON_OBJECT('backgroundColor', '#ffffff')),
          JSON_OBJECT('type', 'FAQ', 'props', JSON_OBJECT(
            'headline', 'Common Questions',
            'items', JSON_ARRAY(
              JSON_OBJECT('q', 'Do you accept my insurance?', 'a', 'We accept most major insurance plans. Contact us to verify.'),
              JSON_OBJECT('q', 'How do I access the patient portal?', 'a', 'Visit our portal page and register with your email.'),
              JSON_OBJECT('q', 'Do you offer telehealth visits?', 'a', 'Yes! Virtual appointments are available for many services.')
            )
          ), 'styles', JSON_OBJECT('backgroundColor', '#f0fdfa')),
          JSON_OBJECT('type', 'CTA', 'props', JSON_OBJECT(
            'headline', 'Ready to prioritize your health?',
            'description', 'Schedule your appointment today. New patients welcome.',
            'primaryCta', JSON_OBJECT('label', 'Book Appointment', 'href', '/book')
          ), 'styles', JSON_OBJECT('backgroundColor', '#10b981')),
          JSON_OBJECT('type', 'FOOTER', 'props', JSON_OBJECT(
            'copyright', '© 2024 Serenity Medical | 123 Health Ave | Mon-Fri 8AM-6PM'
          ), 'styles', JSON_OBJECT('backgroundColor', '#134e4a'))
        )
      )
    )
  )
);

-- ============================================================================
-- TEMPLATE 9: LUXE BOUTIQUE - E-commerce / Fashion
-- Style: Elegant, minimal, product-focused
-- ============================================================================
INSERT INTO templates (name, category, preview_image_url, structure_json)
VALUES
(
  'Luxe Boutique',
  'E-commerce',
  '/uploads/template-previews/luxe.svg',
  JSON_OBJECT(
    'designSystem', JSON_OBJECT(
      'colors', JSON_OBJECT(
        'primary', '#000000',
        'secondary', '#b8860b',
        'background', '#ffffff',
        'surface', '#f9f9f9',
        'text', '#1a1a1a',
        'mutedText', '#666666'
      ),
      'typography', JSON_OBJECT(
        'fontFamily', '"Didot", "Playfair Display", Georgia, serif',
        'baseFontSize', 16,
        'lineHeight', 1.6,
        'headingWeight', 400,
        'bodyWeight', 300
      ),
      'spacing', JSON_OBJECT('sectionY', 80, 'containerX', 24)
    ),
    'pages', JSON_ARRAY(
      JSON_OBJECT(
        'name', 'Home',
        'path', '/',
        'meta', JSON_OBJECT('title', 'LUXE | Curated Fashion & Lifestyle', 'description', 'Discover curated luxury fashion and lifestyle pieces'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type', 'NAVBAR', 'props', JSON_OBJECT(
            'logoText', 'LUXE',
            'links', JSON_ARRAY(
              JSON_OBJECT('label', 'New Arrivals', 'href', '/new'),
              JSON_OBJECT('label', 'Collections', 'href', '/collections'),
              JSON_OBJECT('label', 'Sale', 'href', '/sale')
            ),
            'cta', JSON_OBJECT('label', 'Shop Now', 'href', '/shop')
          ), 'styles', JSON_OBJECT('backgroundColor', '#ffffff')),
          JSON_OBJECT('type', 'HERO', 'props', JSON_OBJECT(
            'headline', 'Timeless Elegance',
            'subheadline', 'Discover our curated collection of luxury fashion pieces. Handpicked for the discerning individual.',
            'primaryCta', JSON_OBJECT('label', 'Shop the Collection', 'href', '/collections'),
            'secondaryCta', JSON_OBJECT('label', 'New Arrivals', 'href', '/new')
          ), 'styles', JSON_OBJECT('backgroundColor', '#ffffff', 'paddingTop', '120px', 'paddingBottom', '120px')),
          JSON_OBJECT('type', 'CARDS', 'props', JSON_OBJECT(
            'headline', 'Featured Collections',
            'cards', JSON_ARRAY(
              JSON_OBJECT('title', 'Spring/Summer 2024', 'text', 'Light fabrics, bold colors, effortless style.', 'cta', JSON_OBJECT('label', 'Explore', 'href', '/collections/ss24')),
              JSON_OBJECT('title', 'The Essentials', 'text', 'Timeless pieces that form the foundation of any wardrobe.', 'cta', JSON_OBJECT('label', 'Explore', 'href', '/collections/essentials')),
              JSON_OBJECT('title', 'Limited Editions', 'text', 'Exclusive pieces in limited quantities.', 'cta', JSON_OBJECT('label', 'Explore', 'href', '/collections/limited'))
            )
          ), 'styles', JSON_OBJECT('backgroundColor', '#f9f9f9')),
          JSON_OBJECT('type', 'FEATURES', 'props', JSON_OBJECT(
            'headline', 'The LUXE Promise',
            'items', JSON_ARRAY(
              JSON_OBJECT('icon', '✨', 'title', 'Curated Selection', 'text', 'Every piece handpicked by our style experts.'),
              JSON_OBJECT('icon', '🌍', 'title', 'Free Worldwide Shipping', 'text', 'Complimentary shipping on orders over $200.'),
              JSON_OBJECT('icon', '↩️', 'title', 'Easy Returns', 'text', '30-day hassle-free returns on all items.'),
              JSON_OBJECT('icon', '💎', 'title', 'Authenticity Guaranteed', 'text', 'Every item verified for authenticity.')
            )
          ), 'styles', JSON_OBJECT('backgroundColor', '#ffffff')),
          JSON_OBJECT('type', 'TESTIMONIALS', 'props', JSON_OBJECT(
            'headline', 'What Our Clients Say',
            'items', JSON_ARRAY(
              JSON_OBJECT('quote', 'The quality and curation at LUXE is unmatched. My go-to for special pieces.', 'name', 'Victoria S.', 'role', 'Fashion Editor'),
              JSON_OBJECT('quote', 'Impeccable service and stunning pieces. Worth every penny.', 'name', 'Alexandra M.', 'role', 'Loyal Customer')
            )
          ), 'styles', JSON_OBJECT('backgroundColor', '#f9f9f9')),
          JSON_OBJECT('type', 'CTA', 'props', JSON_OBJECT(
            'headline', 'Join the LUXE Circle',
            'description', 'Subscribe for exclusive access to new arrivals and private sales.',
            'primaryCta', JSON_OBJECT('label', 'Subscribe', 'href', '/subscribe')
          ), 'styles', JSON_OBJECT('backgroundColor', '#000000')),
          JSON_OBJECT('type', 'FOOTER', 'props', JSON_OBJECT(
            'copyright', '© 2024 LUXE | Free shipping on orders over $200'
          ), 'styles', JSON_OBJECT('backgroundColor', '#1a1a1a'))
        )
      )
    )
  )
);

-- ============================================================================
-- TEMPLATE 10: STERLING LAW - Law Firm / Professional Services
-- Style: Authoritative, elegant, navy and gold
-- ============================================================================
INSERT INTO templates (name, category, preview_image_url, structure_json)
VALUES
(
  'Sterling Law Group',
  'Professional Services',
  '/uploads/template-previews/sterling.svg',
  JSON_OBJECT(
    'designSystem', JSON_OBJECT(
      'colors', JSON_OBJECT(
        'primary', '#1e3a5f',
        'secondary', '#b8860b',
        'background', '#f8f9fa',
        'surface', '#ffffff',
        'text', '#1a1a1a',
        'mutedText', '#6c757d'
      ),
      'typography', JSON_OBJECT(
        'fontFamily', '"Libre Baskerville", Georgia, serif',
        'baseFontSize', 17,
        'lineHeight', 1.7,
        'headingWeight', 700,
        'bodyWeight', 400
      ),
      'spacing', JSON_OBJECT('sectionY', 80, 'containerX', 24)
    ),
    'pages', JSON_ARRAY(
      JSON_OBJECT(
        'name', 'Home',
        'path', '/',
        'meta', JSON_OBJECT('title', 'Sterling Law Group | Excellence in Legal Services', 'description', 'Trusted legal counsel for businesses and individuals'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type', 'NAVBAR', 'props', JSON_OBJECT(
            'logoText', 'STERLING LAW',
            'links', JSON_ARRAY(
              JSON_OBJECT('label', 'Practice Areas', 'href', '/practice-areas'),
              JSON_OBJECT('label', 'Our Team', 'href', '/team'),
              JSON_OBJECT('label', 'About', 'href', '/about')
            ),
            'cta', JSON_OBJECT('label', 'Free Consultation', 'href', '/contact')
          ), 'styles', JSON_OBJECT('backgroundColor', '#ffffff')),
          JSON_OBJECT('type', 'HERO', 'props', JSON_OBJECT(
            'headline', 'Trusted Counsel. Proven Results.',
            'subheadline', 'For over 50 years, Sterling Law Group has provided exceptional legal representation to businesses and individuals. We fight for your rights.',
            'primaryCta', JSON_OBJECT('label', 'Schedule Consultation', 'href', '/contact'),
            'secondaryCta', JSON_OBJECT('label', 'Our Practice Areas', 'href', '/practice-areas')
          ), 'styles', JSON_OBJECT('backgroundColor', '#1e3a5f', 'paddingTop', '120px', 'paddingBottom', '120px')),
          JSON_OBJECT('type', 'STATS', 'props', JSON_OBJECT(
            'items', JSON_ARRAY(
              JSON_OBJECT('value', '50+', 'label', 'Years of Excellence'),
              JSON_OBJECT('value', '$2B+', 'label', 'Recovered for Clients'),
              JSON_OBJECT('value', '98%', 'label', 'Success Rate'),
              JSON_OBJECT('value', '5,000+', 'label', 'Cases Won')
            )
          ), 'styles', JSON_OBJECT('backgroundColor', '#ffffff')),
          JSON_OBJECT('type', 'FEATURES', 'props', JSON_OBJECT(
            'headline', 'Practice Areas',
            'items', JSON_ARRAY(
              JSON_OBJECT('icon', '⚖️', 'title', 'Corporate Law', 'text', 'M&A, contracts, corporate governance, and compliance.'),
              JSON_OBJECT('icon', '🏛️', 'title', 'Litigation', 'text', 'Complex commercial disputes and trial advocacy.'),
              JSON_OBJECT('icon', '💼', 'title', 'Employment Law', 'text', 'Workplace disputes, discrimination, and wrongful termination.'),
              JSON_OBJECT('icon', '🏠', 'title', 'Real Estate', 'text', 'Commercial and residential transactions and disputes.')
            )
          ), 'styles', JSON_OBJECT('backgroundColor', '#f8f9fa')),
          JSON_OBJECT('type', 'TEAM', 'props', JSON_OBJECT(
            'headline', 'Our Partners',
            'members', JSON_ARRAY(
              JSON_OBJECT('name', 'Robert Sterling', 'role', 'Founding Partner', 'image', ''),
              JSON_OBJECT('name', 'Elizabeth Chen', 'role', 'Managing Partner', 'image', ''),
              JSON_OBJECT('name', 'James Morrison', 'role', 'Senior Partner', 'image', ''),
              JSON_OBJECT('name', 'Sarah Williams', 'role', 'Partner', 'image', '')
            )
          ), 'styles', JSON_OBJECT('backgroundColor', '#ffffff')),
          JSON_OBJECT('type', 'TESTIMONIALS', 'props', JSON_OBJECT(
            'headline', 'Client Testimonials',
            'items', JSON_ARRAY(
              JSON_OBJECT('quote', 'Sterling Law secured a $50M settlement for our company. Their expertise is unmatched.', 'name', 'Fortune 500 CEO', 'role', 'Corporate Client'),
              JSON_OBJECT('quote', 'They fought for me when no one else would. I got the justice I deserved.', 'name', 'Anonymous', 'role', 'Personal Injury Client')
            )
          ), 'styles', JSON_OBJECT('backgroundColor', '#f8f9fa')),
          JSON_OBJECT('type', 'CTA', 'props', JSON_OBJECT(
            'headline', 'Get the Representation You Deserve',
            'description', 'Schedule a free, confidential consultation with our experienced attorneys.',
            'primaryCta', JSON_OBJECT('label', 'Free Consultation', 'href', '/contact')
          ), 'styles', JSON_OBJECT('backgroundColor', '#b8860b')),
          JSON_OBJECT('type', 'FOOTER', 'props', JSON_OBJECT(
            'copyright', '© 2024 Sterling Law Group LLP | Attorney Advertising'
          ), 'styles', JSON_OBJECT('backgroundColor', '#1e3a5f'))
        )
      )
    )
  )
);
