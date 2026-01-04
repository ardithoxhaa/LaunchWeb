-- Additional Templates for LaunchWeb
-- Run this after the main seed.sql to add more industry templates

-- Restaurant Template
INSERT INTO templates (name, category, preview_image_url, structure_json)
VALUES
(
  'Savory Kitchen',
  'Restaurant',
  '/uploads/template-previews/savory-kitchen.svg',
  JSON_OBJECT(
    'designSystem', JSON_OBJECT(
      'colors', JSON_OBJECT('primary','#d97706','secondary','#fbbf24','background','#0c0a09','surface','rgba(255,255,255,0.06)','text','rgba(255,255,255,0.92)','mutedText','rgba(255,255,255,0.70)'),
      'typography', JSON_OBJECT('fontFamily','Georgia, "Times New Roman", serif','baseFontSize',16,'lineHeight',1.6,'headingWeight',700,'bodyWeight',400),
      'spacing', JSON_OBJECT('sectionY',64,'containerX',20)
    ),
    'pages', JSON_ARRAY(
      JSON_OBJECT('name','Home','path','/','meta', JSON_OBJECT('title','Savory Kitchen','description','Modern restaurant template with menu, reservations, and ambiance.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','Savory Kitchen','links', JSON_ARRAY(JSON_OBJECT('label','Menu','href','/menu'),JSON_OBJECT('label','About','href','/about'),JSON_OBJECT('label','Reservations','href','/reservations'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','HERO','props', JSON_OBJECT('headline','Where every meal tells a story','subheadline','Experience culinary excellence in a warm, inviting atmosphere. Fresh ingredients, bold flavors, unforgettable moments.','primaryCta', JSON_OBJECT('label','Reserve a Table','href','/reservations'),'secondaryCta', JSON_OBJECT('label','View Menu','href','/menu')),'styles', JSON_OBJECT('layout','center')),
          JSON_OBJECT('type','FEATURES','props', JSON_OBJECT('headline','Why Savory Kitchen','items', JSON_ARRAY(
            JSON_OBJECT('icon','🍳','title','Fresh Daily','text','Locally sourced ingredients prepared fresh every morning.'),
            JSON_OBJECT('icon','👨‍🍳','title','Expert Chefs','text','Award-winning culinary team with decades of experience.'),
            JSON_OBJECT('icon','🍷','title','Fine Selection','text','Curated wine list to complement every dish.')
          )), 'styles', JSON_OBJECT('columns',3)),
          JSON_OBJECT('type','GALLERY','props', JSON_OBJECT('images', JSON_ARRAY(
            'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=60',
            'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=60',
            'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=60'
          )), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','TESTIMONIALS','props', JSON_OBJECT('headline','Guest Reviews','items', JSON_ARRAY(
            JSON_OBJECT('name','Sarah M.','role','Food Critic','quote','An exceptional dining experience. The attention to detail is remarkable.'),
            JSON_OBJECT('name','James L.','role','Regular Guest','quote','My go-to spot for special occasions. Never disappoints.')
          )), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','CTA','props', JSON_OBJECT('headline','Ready for an unforgettable meal?','description','Book your table today and discover why guests keep coming back.','primaryCta', JSON_OBJECT('label','Make a Reservation','href','/reservations')),'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FOOTER_LINKS','props', JSON_OBJECT('brand','Savory Kitchen','description','Fine dining in the heart of the city.','columns', JSON_ARRAY(
            JSON_OBJECT('title','Visit','links', JSON_ARRAY(JSON_OBJECT('label','Menu','href','/menu'),JSON_OBJECT('label','Hours','href','/about'))),
            JSON_OBJECT('title','Connect','links', JSON_ARRAY(JSON_OBJECT('label','Reservations','href','/reservations'),JSON_OBJECT('label','Contact','href','/contact')))
          )), 'styles', JSON_OBJECT())
        )
      ),
      JSON_OBJECT('name','Menu','path','/menu','meta', JSON_OBJECT('title','Menu - Savory Kitchen','description','Our seasonal menu.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','Savory Kitchen','links', JSON_ARRAY(JSON_OBJECT('label','Home','href','/'),JSON_OBJECT('label','Menu','href','/menu'),JSON_OBJECT('label','Reservations','href','/reservations'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','CONTENT','props', JSON_OBJECT('title','Our Menu','paragraphs', JSON_ARRAY('Seasonal dishes crafted with passion and the finest ingredients.')),'styles', JSON_OBJECT()),
          JSON_OBJECT('type','CARDS','props', JSON_OBJECT('cards', JSON_ARRAY(
            JSON_OBJECT('title','Starters','text','Fresh salads, soups, and appetizers to begin your journey.','cta', JSON_OBJECT('label','View','href','/contact')),
            JSON_OBJECT('title','Main Courses','text','Signature dishes featuring local meats and seafood.','cta', JSON_OBJECT('label','View','href','/contact')),
            JSON_OBJECT('title','Desserts','text','Sweet endings crafted by our pastry chef.','cta', JSON_OBJECT('label','View','href','/contact'))
          )), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© Savory Kitchen'),'styles', JSON_OBJECT('variant','dark'))
        )
      ),
      JSON_OBJECT('name','Reservations','path','/reservations','meta', JSON_OBJECT('title','Reservations - Savory Kitchen','description','Book your table.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','Savory Kitchen','links', JSON_ARRAY(JSON_OBJECT('label','Home','href','/'),JSON_OBJECT('label','Menu','href','/menu'),JSON_OBJECT('label','Reservations','href','/reservations'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','CONTACT_FORM','props', JSON_OBJECT('headline','Reserve Your Table','fields', JSON_ARRAY('name','email','message')),'styles', JSON_OBJECT('layout','card')),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© Savory Kitchen'),'styles', JSON_OBJECT('variant','dark'))
        )
      )
    )
  )
);

-- Fitness/Gym Template
INSERT INTO templates (name, category, preview_image_url, structure_json)
VALUES
(
  'Apex Fitness',
  'Fitness',
  '/uploads/template-previews/apex-fitness.svg',
  JSON_OBJECT(
    'designSystem', JSON_OBJECT(
      'colors', JSON_OBJECT('primary','#ef4444','secondary','#f97316','background','#09090b','surface','rgba(255,255,255,0.06)','text','rgba(255,255,255,0.95)','mutedText','rgba(255,255,255,0.70)'),
      'typography', JSON_OBJECT('fontFamily','"Inter", ui-sans-serif, system-ui, sans-serif','baseFontSize',16,'lineHeight',1.5,'headingWeight',800,'bodyWeight',400),
      'spacing', JSON_OBJECT('sectionY',72,'containerX',20)
    ),
    'pages', JSON_ARRAY(
      JSON_OBJECT('name','Home','path','/','meta', JSON_OBJECT('title','Apex Fitness','description','Premium fitness center with world-class equipment and trainers.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','APEX','links', JSON_ARRAY(JSON_OBJECT('label','Programs','href','/programs'),JSON_OBJECT('label','Trainers','href','/trainers'),JSON_OBJECT('label','Pricing','href','/pricing'),JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','HERO','props', JSON_OBJECT('headline','Transform Your Body. Elevate Your Life.','subheadline','State-of-the-art facilities, expert trainers, and a community that pushes you to be your best.','primaryCta', JSON_OBJECT('label','Start Free Trial','href','/contact'),'secondaryCta', JSON_OBJECT('label','View Programs','href','/programs')),'styles', JSON_OBJECT('layout','split')),
          JSON_OBJECT('type','STATS','props', JSON_OBJECT('items', JSON_ARRAY(
            JSON_OBJECT('value','5000+','label','Active Members'),
            JSON_OBJECT('value','50+','label','Expert Trainers'),
            JSON_OBJECT('value','24/7','label','Open Hours')
          )), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FEATURES','props', JSON_OBJECT('headline','Why Choose Apex','items', JSON_ARRAY(
            JSON_OBJECT('icon','💪','title','Premium Equipment','text','Latest machines and free weights from top brands.'),
            JSON_OBJECT('icon','🎯','title','Personal Training','text','One-on-one sessions tailored to your goals.'),
            JSON_OBJECT('icon','🧘','title','Group Classes','text','Yoga, HIIT, spinning, and more every day.')
          )), 'styles', JSON_OBJECT('columns',3)),
          JSON_OBJECT('type','TESTIMONIALS','props', JSON_OBJECT('headline','Success Stories','items', JSON_ARRAY(
            JSON_OBJECT('name','Mike R.','role','Lost 30kg','quote','Apex changed my life. The trainers are incredible and the community keeps me motivated.'),
            JSON_OBJECT('name','Lisa K.','role','Marathon Runner','quote','Best gym I have ever been to. The facilities are top-notch.')
          )), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','CTA','props', JSON_OBJECT('headline','Ready to Start Your Journey?','description','Join today and get your first month free.','primaryCta', JSON_OBJECT('label','Get Started','href','/contact')),'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FOOTER_LINKS','props', JSON_OBJECT('brand','Apex Fitness','description','Your journey to peak performance starts here.','columns', JSON_ARRAY(
            JSON_OBJECT('title','Gym','links', JSON_ARRAY(JSON_OBJECT('label','Programs','href','/programs'),JSON_OBJECT('label','Trainers','href','/trainers'))),
            JSON_OBJECT('title','Join','links', JSON_ARRAY(JSON_OBJECT('label','Pricing','href','/pricing'),JSON_OBJECT('label','Contact','href','/contact')))
          )), 'styles', JSON_OBJECT())
        )
      ),
      JSON_OBJECT('name','Programs','path','/programs','meta', JSON_OBJECT('title','Programs - Apex Fitness','description','Training programs for every goal.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','APEX','links', JSON_ARRAY(JSON_OBJECT('label','Home','href','/'),JSON_OBJECT('label','Programs','href','/programs'),JSON_OBJECT('label','Pricing','href','/pricing'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','CARDS','props', JSON_OBJECT('cards', JSON_ARRAY(
            JSON_OBJECT('title','Strength Training','text','Build muscle and increase power with our comprehensive strength program.','cta', JSON_OBJECT('label','Learn More','href','/contact')),
            JSON_OBJECT('title','Weight Loss','text','Science-backed approach to sustainable fat loss and body transformation.','cta', JSON_OBJECT('label','Learn More','href','/contact')),
            JSON_OBJECT('title','Athletic Performance','text','Sport-specific training to take your game to the next level.','cta', JSON_OBJECT('label','Learn More','href','/contact'))
          )), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© Apex Fitness'),'styles', JSON_OBJECT('variant','dark'))
        )
      ),
      JSON_OBJECT('name','Pricing','path','/pricing','meta', JSON_OBJECT('title','Pricing - Apex Fitness','description','Membership options.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','APEX','links', JSON_ARRAY(JSON_OBJECT('label','Home','href','/'),JSON_OBJECT('label','Programs','href','/programs'),JSON_OBJECT('label','Pricing','href','/pricing'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','PRICING','props', JSON_OBJECT('plans', JSON_ARRAY(
            JSON_OBJECT('name','Basic','price','€29','period','/mo','features', JSON_ARRAY('Gym access','Locker room','Basic equipment')),
            JSON_OBJECT('name','Pro','price','€59','period','/mo','features', JSON_ARRAY('24/7 access','All classes','Sauna & spa','1 PT session/mo'),'featured',TRUE),
            JSON_OBJECT('name','Elite','price','€99','period','/mo','features', JSON_ARRAY('Everything in Pro','4 PT sessions/mo','Nutrition plan','Priority booking'))
          )), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© Apex Fitness'),'styles', JSON_OBJECT('variant','dark'))
        )
      ),
      JSON_OBJECT('name','Contact','path','/contact','meta', JSON_OBJECT('title','Contact - Apex Fitness','description','Get in touch.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','APEX','links', JSON_ARRAY(JSON_OBJECT('label','Home','href','/'),JSON_OBJECT('label','Pricing','href','/pricing'),JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','CONTACT_FORM','props', JSON_OBJECT('headline','Start Your Free Trial','fields', JSON_ARRAY('name','email','message')),'styles', JSON_OBJECT('layout','card')),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© Apex Fitness'),'styles', JSON_OBJECT('variant','dark'))
        )
      )
    )
  )
);

-- Creative Agency Template
INSERT INTO templates (name, category, preview_image_url, structure_json)
VALUES
(
  'Northwind Studio',
  'Agency',
  '/uploads/template-previews/northwind-studio.svg',
  JSON_OBJECT(
    'designSystem', JSON_OBJECT(
      'colors', JSON_OBJECT('primary','#8b5cf6','secondary','#a78bfa','background','#0a0a0f','surface','rgba(255,255,255,0.05)','text','rgba(255,255,255,0.92)','mutedText','rgba(255,255,255,0.65)'),
      'typography', JSON_OBJECT('fontFamily','"DM Sans", ui-sans-serif, system-ui, sans-serif','baseFontSize',16,'lineHeight',1.6,'headingWeight',700,'bodyWeight',400),
      'spacing', JSON_OBJECT('sectionY',80,'containerX',24)
    ),
    'pages', JSON_ARRAY(
      JSON_OBJECT('name','Home','path','/','meta', JSON_OBJECT('title','Northwind Studio','description','Creative agency specializing in brand identity and digital experiences.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','Northwind','links', JSON_ARRAY(JSON_OBJECT('label','Work','href','/work'),JSON_OBJECT('label','Services','href','/services'),JSON_OBJECT('label','About','href','/about'),JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','HERO','props', JSON_OBJECT('headline','We craft brands that move people','subheadline','Strategy, design, and technology combined to create memorable digital experiences.','primaryCta', JSON_OBJECT('label','View Our Work','href','/work'),'secondaryCta', JSON_OBJECT('label','Get in Touch','href','/contact')),'styles', JSON_OBJECT('layout','center')),
          JSON_OBJECT('type','LOGO_CLOUD','props', JSON_OBJECT('label','Trusted by innovative brands','logos', JSON_ARRAY(
            JSON_OBJECT('src','','alt','Client 1'),
            JSON_OBJECT('src','','alt','Client 2'),
            JSON_OBJECT('src','','alt','Client 3'),
            JSON_OBJECT('src','','alt','Client 4')
          )), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FEATURES','props', JSON_OBJECT('headline','What We Do','items', JSON_ARRAY(
            JSON_OBJECT('icon','✨','title','Brand Strategy','text','Define your unique position and voice in the market.'),
            JSON_OBJECT('icon','🎨','title','Visual Identity','text','Logos, color systems, and design languages that stick.'),
            JSON_OBJECT('icon','💻','title','Digital Products','text','Websites and apps that deliver results.')
          )), 'styles', JSON_OBJECT('columns',3)),
          JSON_OBJECT('type','CARDS','props', JSON_OBJECT('cards', JSON_ARRAY(
            JSON_OBJECT('title','Brand Refresh','text','Complete visual overhaul for a fintech startup.','cta', JSON_OBJECT('label','View Case','href','/work')),
            JSON_OBJECT('title','E-commerce Platform','text','End-to-end design and development for a fashion brand.','cta', JSON_OBJECT('label','View Case','href','/work')),
            JSON_OBJECT('title','Mobile App','text','iOS and Android app for a health & wellness company.','cta', JSON_OBJECT('label','View Case','href','/work'))
          )), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','TESTIMONIALS','props', JSON_OBJECT('headline','Client Love','items', JSON_ARRAY(
            JSON_OBJECT('name','Anna Chen','role','CEO, TechStart','quote','Northwind transformed our brand. The results exceeded all expectations.'),
            JSON_OBJECT('name','David Park','role','Founder, GreenLeaf','quote','Professional, creative, and a joy to work with. Highly recommend.')
          )), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','CTA','props', JSON_OBJECT('headline','Have a project in mind?','description','Let us discuss how we can bring your vision to life.','primaryCta', JSON_OBJECT('label','Start a Project','href','/contact')),'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FOOTER_LINKS','props', JSON_OBJECT('brand','Northwind Studio','description','Creative agency based in Berlin.','columns', JSON_ARRAY(
            JSON_OBJECT('title','Studio','links', JSON_ARRAY(JSON_OBJECT('label','Work','href','/work'),JSON_OBJECT('label','Services','href','/services'))),
            JSON_OBJECT('title','Connect','links', JSON_ARRAY(JSON_OBJECT('label','About','href','/about'),JSON_OBJECT('label','Contact','href','/contact')))
          )), 'styles', JSON_OBJECT())
        )
      ),
      JSON_OBJECT('name','Work','path','/work','meta', JSON_OBJECT('title','Work - Northwind Studio','description','Selected projects.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','Northwind','links', JSON_ARRAY(JSON_OBJECT('label','Home','href','/'),JSON_OBJECT('label','Work','href','/work'),JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','CONTENT','props', JSON_OBJECT('title','Selected Work','paragraphs', JSON_ARRAY('A curated selection of projects we are proud of.')),'styles', JSON_OBJECT()),
          JSON_OBJECT('type','GALLERY','props', JSON_OBJECT('images', JSON_ARRAY(
            'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=60',
            'https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=800&q=60',
            'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?auto=format&fit=crop&w=800&q=60'
          )), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© Northwind Studio'),'styles', JSON_OBJECT('variant','dark'))
        )
      ),
      JSON_OBJECT('name','Services','path','/services','meta', JSON_OBJECT('title','Services - Northwind Studio','description','What we offer.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','Northwind','links', JSON_ARRAY(JSON_OBJECT('label','Home','href','/'),JSON_OBJECT('label','Services','href','/services'),JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','CARDS','props', JSON_OBJECT('cards', JSON_ARRAY(
            JSON_OBJECT('title','Branding','text','Strategy, naming, visual identity, and brand guidelines.','cta', JSON_OBJECT('label','Learn More','href','/contact')),
            JSON_OBJECT('title','Web Design','text','Custom websites that convert visitors into customers.','cta', JSON_OBJECT('label','Learn More','href','/contact')),
            JSON_OBJECT('title','Development','text','Full-stack development with modern technologies.','cta', JSON_OBJECT('label','Learn More','href','/contact'))
          )), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© Northwind Studio'),'styles', JSON_OBJECT('variant','dark'))
        )
      ),
      JSON_OBJECT('name','Contact','path','/contact','meta', JSON_OBJECT('title','Contact - Northwind Studio','description','Get in touch.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','Northwind','links', JSON_ARRAY(JSON_OBJECT('label','Home','href','/'),JSON_OBJECT('label','Work','href','/work'),JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','CONTACT_FORM','props', JSON_OBJECT('headline','Start a Conversation','fields', JSON_ARRAY('name','email','message')),'styles', JSON_OBJECT('layout','card')),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© Northwind Studio'),'styles', JSON_OBJECT('variant','dark'))
        )
      )
    )
  )
);

-- Portfolio Template
INSERT INTO templates (name, category, preview_image_url, structure_json)
VALUES
(
  'Alex Portfolio',
  'Portfolio',
  '/uploads/template-previews/alex-portfolio.svg',
  JSON_OBJECT(
    'designSystem', JSON_OBJECT(
      'colors', JSON_OBJECT('primary','#06b6d4','secondary','#22d3ee','background','#030712','surface','rgba(255,255,255,0.05)','text','rgba(255,255,255,0.92)','mutedText','rgba(255,255,255,0.60)'),
      'typography', JSON_OBJECT('fontFamily','"Space Grotesk", ui-sans-serif, system-ui, sans-serif','baseFontSize',16,'lineHeight',1.6,'headingWeight',600,'bodyWeight',400),
      'spacing', JSON_OBJECT('sectionY',72,'containerX',20)
    ),
    'pages', JSON_ARRAY(
      JSON_OBJECT('name','Home','path','/','meta', JSON_OBJECT('title','Alex Portfolio','description','Designer and developer portfolio showcasing creative work.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','Alex.','links', JSON_ARRAY(JSON_OBJECT('label','Work','href','/work'),JSON_OBJECT('label','About','href','/about'),JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','HERO','props', JSON_OBJECT('headline','Designer & Developer crafting digital experiences','subheadline','I help startups and businesses create beautiful, functional products that users love.','primaryCta', JSON_OBJECT('label','See My Work','href','/work'),'secondaryCta', JSON_OBJECT('label','Get in Touch','href','/contact')),'styles', JSON_OBJECT('layout','split')),
          JSON_OBJECT('type','STATS','props', JSON_OBJECT('items', JSON_ARRAY(
            JSON_OBJECT('value','8+','label','Years Experience'),
            JSON_OBJECT('value','50+','label','Projects Completed'),
            JSON_OBJECT('value','30+','label','Happy Clients')
          )), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FEATURES','props', JSON_OBJECT('headline','What I Do','items', JSON_ARRAY(
            JSON_OBJECT('icon','🎨','title','UI/UX Design','text','User-centered design that balances aesthetics with usability.'),
            JSON_OBJECT('icon','💻','title','Web Development','text','Clean, performant code using modern frameworks.'),
            JSON_OBJECT('icon','📱','title','Mobile Apps','text','Native and cross-platform mobile applications.')
          )), 'styles', JSON_OBJECT('columns',3)),
          JSON_OBJECT('type','CARDS','props', JSON_OBJECT('cards', JSON_ARRAY(
            JSON_OBJECT('title','SaaS Dashboard','text','Complete redesign of a B2B analytics platform.','cta', JSON_OBJECT('label','View Project','href','/work')),
            JSON_OBJECT('title','E-commerce App','text','Mobile shopping experience for a fashion brand.','cta', JSON_OBJECT('label','View Project','href','/work')),
            JSON_OBJECT('title','Brand Identity','text','Visual identity system for a tech startup.','cta', JSON_OBJECT('label','View Project','href','/work'))
          )), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','CTA','props', JSON_OBJECT('headline','Let us work together','description','I am currently available for freelance projects and full-time opportunities.','primaryCta', JSON_OBJECT('label','Contact Me','href','/contact')),'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© Alex Portfolio'),'styles', JSON_OBJECT('variant','dark'))
        )
      ),
      JSON_OBJECT('name','Work','path','/work','meta', JSON_OBJECT('title','Work - Alex Portfolio','description','Selected projects.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','Alex.','links', JSON_ARRAY(JSON_OBJECT('label','Home','href','/'),JSON_OBJECT('label','Work','href','/work'),JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','CONTENT','props', JSON_OBJECT('title','Selected Work','paragraphs', JSON_ARRAY('A collection of projects I have worked on over the years.')),'styles', JSON_OBJECT()),
          JSON_OBJECT('type','GALLERY','props', JSON_OBJECT('images', JSON_ARRAY(
            'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=60',
            'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=60',
            'https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=800&q=60'
          )), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© Alex Portfolio'),'styles', JSON_OBJECT('variant','dark'))
        )
      ),
      JSON_OBJECT('name','About','path','/about','meta', JSON_OBJECT('title','About - Alex Portfolio','description','About me.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','Alex.','links', JSON_ARRAY(JSON_OBJECT('label','Home','href','/'),JSON_OBJECT('label','About','href','/about'),JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','CONTENT','props', JSON_OBJECT('title','About Me','paragraphs', JSON_ARRAY(
            'I am a designer and developer with over 8 years of experience creating digital products.',
            'I believe in the power of good design to solve problems and create meaningful experiences.'
          )),'styles', JSON_OBJECT('width','md')),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© Alex Portfolio'),'styles', JSON_OBJECT('variant','dark'))
        )
      ),
      JSON_OBJECT('name','Contact','path','/contact','meta', JSON_OBJECT('title','Contact - Alex Portfolio','description','Get in touch.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','Alex.','links', JSON_ARRAY(JSON_OBJECT('label','Home','href','/'),JSON_OBJECT('label','Work','href','/work'),JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','CONTACT_FORM','props', JSON_OBJECT('headline','Get in Touch','fields', JSON_ARRAY('name','email','message')),'styles', JSON_OBJECT('layout','card')),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© Alex Portfolio'),'styles', JSON_OBJECT('variant','dark'))
        )
      )
    )
  )
);

-- Real Estate Template
INSERT INTO templates (name, category, preview_image_url, structure_json)
VALUES
(
  'Prime Properties',
  'Real Estate',
  '/uploads/template-previews/prime-properties.svg',
  JSON_OBJECT(
    'designSystem', JSON_OBJECT(
      'colors', JSON_OBJECT('primary','#0ea5e9','secondary','#38bdf8','background','#0c1222','surface','rgba(255,255,255,0.06)','text','rgba(255,255,255,0.92)','mutedText','rgba(255,255,255,0.70)'),
      'typography', JSON_OBJECT('fontFamily','"Outfit", ui-sans-serif, system-ui, sans-serif','baseFontSize',16,'lineHeight',1.5,'headingWeight',700,'bodyWeight',400),
      'spacing', JSON_OBJECT('sectionY',64,'containerX',20)
    ),
    'pages', JSON_ARRAY(
      JSON_OBJECT('name','Home','path','/','meta', JSON_OBJECT('title','Prime Properties','description','Luxury real estate agency helping you find your dream home.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','Prime Properties','links', JSON_ARRAY(JSON_OBJECT('label','Listings','href','/listings'),JSON_OBJECT('label','Services','href','/services'),JSON_OBJECT('label','About','href','/about'),JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','HERO','props', JSON_OBJECT('headline','Find Your Perfect Home','subheadline','Luxury properties in prime locations. Expert guidance from search to closing.','primaryCta', JSON_OBJECT('label','Browse Listings','href','/listings'),'secondaryCta', JSON_OBJECT('label','Schedule Consultation','href','/contact')),'styles', JSON_OBJECT('layout','split')),
          JSON_OBJECT('type','STATS','props', JSON_OBJECT('items', JSON_ARRAY(
            JSON_OBJECT('value','500+','label','Properties Sold'),
            JSON_OBJECT('value','€2B+','label','Total Value'),
            JSON_OBJECT('value','15+','label','Years Experience')
          )), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FEATURES','props', JSON_OBJECT('headline','Why Choose Us','items', JSON_ARRAY(
            JSON_OBJECT('icon','🏠','title','Premium Listings','text','Exclusive access to luxury properties before they hit the market.'),
            JSON_OBJECT('icon','🤝','title','Expert Agents','text','Dedicated professionals who understand your needs.'),
            JSON_OBJECT('icon','📋','title','Full Service','text','From search to closing, we handle everything.')
          )), 'styles', JSON_OBJECT('columns',3)),
          JSON_OBJECT('type','CARDS','props', JSON_OBJECT('cards', JSON_ARRAY(
            JSON_OBJECT('title','Modern Villa','text','5 bed, 4 bath - €1.2M - Stunning contemporary design with pool.','cta', JSON_OBJECT('label','View Details','href','/listings')),
            JSON_OBJECT('title','City Penthouse','text','3 bed, 2 bath - €890K - Panoramic views in the heart of downtown.','cta', JSON_OBJECT('label','View Details','href','/listings')),
            JSON_OBJECT('title','Coastal Estate','text','6 bed, 5 bath - €2.5M - Beachfront luxury with private access.','cta', JSON_OBJECT('label','View Details','href','/listings'))
          )), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','TESTIMONIALS','props', JSON_OBJECT('headline','Client Stories','items', JSON_ARRAY(
            JSON_OBJECT('name','The Johnsons','role','Homeowners','quote','Prime Properties made our dream home a reality. Professional service from start to finish.'),
            JSON_OBJECT('name','Maria S.','role','Investor','quote','Best real estate experience I have had. They truly understand the luxury market.')
          )), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','CTA','props', JSON_OBJECT('headline','Ready to Find Your Dream Home?','description','Schedule a consultation with one of our expert agents today.','primaryCta', JSON_OBJECT('label','Contact Us','href','/contact')),'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FOOTER_LINKS','props', JSON_OBJECT('brand','Prime Properties','description','Luxury real estate since 2008.','columns', JSON_ARRAY(
            JSON_OBJECT('title','Properties','links', JSON_ARRAY(JSON_OBJECT('label','Listings','href','/listings'),JSON_OBJECT('label','Services','href','/services'))),
            JSON_OBJECT('title','Company','links', JSON_ARRAY(JSON_OBJECT('label','About','href','/about'),JSON_OBJECT('label','Contact','href','/contact')))
          )), 'styles', JSON_OBJECT())
        )
      ),
      JSON_OBJECT('name','Listings','path','/listings','meta', JSON_OBJECT('title','Listings - Prime Properties','description','Browse our properties.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','Prime Properties','links', JSON_ARRAY(JSON_OBJECT('label','Home','href','/'),JSON_OBJECT('label','Listings','href','/listings'),JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','CONTENT','props', JSON_OBJECT('title','Featured Listings','paragraphs', JSON_ARRAY('Explore our curated selection of premium properties.')),'styles', JSON_OBJECT()),
          JSON_OBJECT('type','CARDS','props', JSON_OBJECT('cards', JSON_ARRAY(
            JSON_OBJECT('title','Lakeside Mansion','text','7 bed, 6 bath - €3.2M - Private dock and stunning lake views.','cta', JSON_OBJECT('label','Inquire','href','/contact')),
            JSON_OBJECT('title','Urban Loft','text','2 bed, 2 bath - €450K - Industrial chic in arts district.','cta', JSON_OBJECT('label','Inquire','href','/contact')),
            JSON_OBJECT('title','Mountain Retreat','text','4 bed, 3 bath - €980K - Ski-in/ski-out access.','cta', JSON_OBJECT('label','Inquire','href','/contact'))
          )), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© Prime Properties'),'styles', JSON_OBJECT('variant','dark'))
        )
      ),
      JSON_OBJECT('name','Contact','path','/contact','meta', JSON_OBJECT('title','Contact - Prime Properties','description','Get in touch.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','Prime Properties','links', JSON_ARRAY(JSON_OBJECT('label','Home','href','/'),JSON_OBJECT('label','Listings','href','/listings'),JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','CONTACT_FORM','props', JSON_OBJECT('headline','Schedule a Consultation','fields', JSON_ARRAY('name','email','message')),'styles', JSON_OBJECT('layout','card')),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© Prime Properties'),'styles', JSON_OBJECT('variant','dark'))
        )
      )
    )
  )
);

-- Education Template
INSERT INTO templates (name, category, preview_image_url, structure_json)
VALUES
(
  'Bright Academy',
  'Education',
  '/uploads/template-previews/bright-academy.svg',
  JSON_OBJECT(
    'designSystem', JSON_OBJECT(
      'colors', JSON_OBJECT('primary','#10b981','secondary','#34d399','background','#0f172a','surface','rgba(255,255,255,0.06)','text','rgba(255,255,255,0.92)','mutedText','rgba(255,255,255,0.70)'),
      'typography', JSON_OBJECT('fontFamily','"Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif','baseFontSize',16,'lineHeight',1.6,'headingWeight',700,'bodyWeight',400),
      'spacing', JSON_OBJECT('sectionY',64,'containerX',20)
    ),
    'pages', JSON_ARRAY(
      JSON_OBJECT('name','Home','path','/','meta', JSON_OBJECT('title','Bright Academy','description','Online learning platform for professional development.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','Bright Academy','links', JSON_ARRAY(JSON_OBJECT('label','Courses','href','/courses'),JSON_OBJECT('label','Instructors','href','/instructors'),JSON_OBJECT('label','Pricing','href','/pricing'),JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','HERO','props', JSON_OBJECT('headline','Learn Skills That Matter','subheadline','Expert-led courses designed to advance your career. Learn at your own pace, anywhere.','primaryCta', JSON_OBJECT('label','Browse Courses','href','/courses'),'secondaryCta', JSON_OBJECT('label','Start Free Trial','href','/contact')),'styles', JSON_OBJECT('layout','split')),
          JSON_OBJECT('type','STATS','props', JSON_OBJECT('items', JSON_ARRAY(
            JSON_OBJECT('value','50K+','label','Students'),
            JSON_OBJECT('value','200+','label','Courses'),
            JSON_OBJECT('value','95%','label','Satisfaction')
          )), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FEATURES','props', JSON_OBJECT('headline','Why Learn With Us','items', JSON_ARRAY(
            JSON_OBJECT('icon','🎓','title','Expert Instructors','text','Learn from industry professionals with real-world experience.'),
            JSON_OBJECT('icon','📚','title','Comprehensive Content','text','In-depth courses covering theory and practical application.'),
            JSON_OBJECT('icon','🏆','title','Certificates','text','Earn recognized certificates to boost your resume.')
          )), 'styles', JSON_OBJECT('columns',3)),
          JSON_OBJECT('type','CARDS','props', JSON_OBJECT('cards', JSON_ARRAY(
            JSON_OBJECT('title','Web Development','text','Master HTML, CSS, JavaScript, and modern frameworks.','cta', JSON_OBJECT('label','Enroll Now','href','/courses')),
            JSON_OBJECT('title','Data Science','text','Python, machine learning, and data visualization.','cta', JSON_OBJECT('label','Enroll Now','href','/courses')),
            JSON_OBJECT('title','Digital Marketing','text','SEO, social media, and growth strategies.','cta', JSON_OBJECT('label','Enroll Now','href','/courses'))
          )), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','TESTIMONIALS','props', JSON_OBJECT('headline','Student Success','items', JSON_ARRAY(
            JSON_OBJECT('name','Emma T.','role','Web Developer','quote','Bright Academy helped me transition into tech. The courses are practical and well-structured.'),
            JSON_OBJECT('name','Carlos M.','role','Data Analyst','quote','Best investment in my career. The instructors are amazing.')
          )), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','CTA','props', JSON_OBJECT('headline','Start Learning Today','description','Join thousands of students advancing their careers.','primaryCta', JSON_OBJECT('label','Get Started','href','/contact')),'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FOOTER_LINKS','props', JSON_OBJECT('brand','Bright Academy','description','Online learning for the modern professional.','columns', JSON_ARRAY(
            JSON_OBJECT('title','Learn','links', JSON_ARRAY(JSON_OBJECT('label','Courses','href','/courses'),JSON_OBJECT('label','Instructors','href','/instructors'))),
            JSON_OBJECT('title','Support','links', JSON_ARRAY(JSON_OBJECT('label','Pricing','href','/pricing'),JSON_OBJECT('label','Contact','href','/contact')))
          )), 'styles', JSON_OBJECT())
        )
      ),
      JSON_OBJECT('name','Courses','path','/courses','meta', JSON_OBJECT('title','Courses - Bright Academy','description','Browse our courses.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','Bright Academy','links', JSON_ARRAY(JSON_OBJECT('label','Home','href','/'),JSON_OBJECT('label','Courses','href','/courses'),JSON_OBJECT('label','Pricing','href','/pricing'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','CONTENT','props', JSON_OBJECT('title','All Courses','paragraphs', JSON_ARRAY('Explore our full catalog of professional courses.')),'styles', JSON_OBJECT()),
          JSON_OBJECT('type','CARDS','props', JSON_OBJECT('cards', JSON_ARRAY(
            JSON_OBJECT('title','UX Design Fundamentals','text','Learn user research, wireframing, and prototyping.','cta', JSON_OBJECT('label','View Course','href','/contact')),
            JSON_OBJECT('title','Business Analytics','text','Excel, SQL, and business intelligence tools.','cta', JSON_OBJECT('label','View Course','href','/contact')),
            JSON_OBJECT('title','Project Management','text','Agile, Scrum, and leadership skills.','cta', JSON_OBJECT('label','View Course','href','/contact'))
          )), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© Bright Academy'),'styles', JSON_OBJECT('variant','dark'))
        )
      ),
      JSON_OBJECT('name','Pricing','path','/pricing','meta', JSON_OBJECT('title','Pricing - Bright Academy','description','Subscription plans.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','Bright Academy','links', JSON_ARRAY(JSON_OBJECT('label','Home','href','/'),JSON_OBJECT('label','Courses','href','/courses'),JSON_OBJECT('label','Pricing','href','/pricing'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','PRICING','props', JSON_OBJECT('plans', JSON_ARRAY(
            JSON_OBJECT('name','Basic','price','€19','period','/mo','features', JSON_ARRAY('Access to 50 courses','Community forum','Mobile app')),
            JSON_OBJECT('name','Pro','price','€49','period','/mo','features', JSON_ARRAY('All courses','Certificates','1-on-1 mentoring','Priority support'),'featured',TRUE),
            JSON_OBJECT('name','Team','price','€99','period','/mo','features', JSON_ARRAY('Everything in Pro','Team analytics','Admin dashboard','Custom learning paths'))
          )), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© Bright Academy'),'styles', JSON_OBJECT('variant','dark'))
        )
      ),
      JSON_OBJECT('name','Contact','path','/contact','meta', JSON_OBJECT('title','Contact - Bright Academy','description','Get in touch.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','Bright Academy','links', JSON_ARRAY(JSON_OBJECT('label','Home','href','/'),JSON_OBJECT('label','Courses','href','/courses'),JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','CONTACT_FORM','props', JSON_OBJECT('headline','Contact Us','fields', JSON_ARRAY('name','email','message')),'styles', JSON_OBJECT('layout','card')),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© Bright Academy'),'styles', JSON_OBJECT('variant','dark'))
        )
      )
    )
  )
);
