USE launchweb;

INSERT IGNORE INTO roles (name) VALUES ('ADMIN'), ('USER');

INSERT INTO templates (name, category, preview_image_url, structure_json)
VALUES
(
  'Apex Fitness',
  'Fitness',
  NULL,
  JSON_OBJECT(
    'pages', JSON_ARRAY(
      JSON_OBJECT(
        'name', 'Home',
        'path', '/',
        'meta', JSON_OBJECT('title','Apex Fitness','description','Premium fitness studio'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','Apex Fitness','links', JSON_ARRAY(JSON_OBJECT('label','Home','href','/'), JSON_OBJECT('label','About','href','/about'), JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','HERO','props', JSON_OBJECT('headline','Train Smarter. Get Stronger.','subheadline','Coaching, classes, and community built for results.','primaryCta', JSON_OBJECT('label','Book a Trial','href','/contact')),'styles', JSON_OBJECT('layout','split')),
          JSON_OBJECT('type','FEATURES','props', JSON_OBJECT('items', JSON_ARRAY(
            JSON_OBJECT('title','Personal Training','text','1:1 coaching tailored to your goals'),
            JSON_OBJECT('title','Group Classes','text','High-energy sessions that keep you consistent'),
            JSON_OBJECT('title','Nutrition','text','Simple plans that actually fit your life')
          )),'styles', JSON_OBJECT('columns',3)),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© Apex Fitness'),'styles', JSON_OBJECT('variant','dark'))
        )
      ),
      JSON_OBJECT(
        'name', 'About',
        'path', '/about',
        'meta', JSON_OBJECT('title','About - Apex Fitness','description','Our story and team'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','Apex Fitness','links', JSON_ARRAY(JSON_OBJECT('label','Home','href','/'), JSON_OBJECT('label','About','href','/about'), JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','CONTENT','props', JSON_OBJECT('title','Built on results','paragraphs', JSON_ARRAY('We believe in evidence-based training.','Our coaches support you every step.')),'styles', JSON_OBJECT('width','md')),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© Apex Fitness'),'styles', JSON_OBJECT('variant','dark'))
        )
      ),
      JSON_OBJECT(
        'name', 'Contact',
        'path', '/contact',
        'meta', JSON_OBJECT('title','Contact - Apex Fitness','description','Get in touch'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','Apex Fitness','links', JSON_ARRAY(JSON_OBJECT('label','Home','href','/'), JSON_OBJECT('label','About','href','/about'), JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','CONTACT_FORM','props', JSON_OBJECT('headline','Let’s talk','fields', JSON_ARRAY('name','email','message')),'styles', JSON_OBJECT('layout','card')),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© Apex Fitness'),'styles', JSON_OBJECT('variant','dark'))
        )
      )
    )
  )
);

INSERT INTO templates (name, category, preview_image_url, structure_json)
VALUES
(
  'Summit Travel Co.',
  'Travel',
  NULL,
  JSON_OBJECT(
    'pages', JSON_ARRAY(
      JSON_OBJECT(
        'name', 'Home',
        'path', '/',
        'meta', JSON_OBJECT('title','Summit Travel','description','Curated trips, premium stays, and seamless planning.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','Summit Travel','links', JSON_ARRAY(JSON_OBJECT('label','Destinations','href','/destinations'), JSON_OBJECT('label','About','href','/about'), JSON_OBJECT('label','Pricing','href','/pricing'), JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','HERO','props', JSON_OBJECT('headline','Trips that feel effortless.','subheadline','Handpicked destinations, transparent pricing, and support from start to landing.','primaryCta', JSON_OBJECT('label','Explore destinations','href','/destinations')),'styles', JSON_OBJECT('layout','split','buttonColor','#06b6d4')),
          JSON_OBJECT('type','GALLERY','props', JSON_OBJECT('images', JSON_ARRAY(
            'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=60',
            'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=60',
            'https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?auto=format&fit=crop&w=1200&q=60'
          )),'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FEATURES','props', JSON_OBJECT('items', JSON_ARRAY(
            JSON_OBJECT('title','Concierge planning','text','We plan routes, stays, and transfers'),
            JSON_OBJECT('title','Flexible dates','text','Options that fit your schedule'),
            JSON_OBJECT('title','Verified experiences','text','Trusted partners and real reviews')
          )),'styles', JSON_OBJECT('columns',3)),
          JSON_OBJECT('type','STATS_CTA','props', JSON_OBJECT(
            'headline','Ready to plan your next escape?',
            'subheadline','Customize this template with your packages, galleries, and copy.',
            'primaryCta', JSON_OBJECT('label','Request itinerary','href','/contact'),
            'items', JSON_ARRAY(
              JSON_OBJECT('value','48h','label','first draft itinerary'),
              JSON_OBJECT('value','24/7','label','trip support'),
              JSON_OBJECT('value','0','label','hidden fees')
            )
          ),'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© Summit Travel Co.'),'styles', JSON_OBJECT('variant','dark'))
        )
      ),
      JSON_OBJECT(
        'name', 'Destinations',
        'path', '/destinations',
        'meta', JSON_OBJECT('title','Destinations - Summit','description','Browse curated trips.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','Summit Travel','links', JSON_ARRAY(JSON_OBJECT('label','Destinations','href','/destinations'), JSON_OBJECT('label','About','href','/about'), JSON_OBJECT('label','Pricing','href','/pricing'), JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','CONTENT','props', JSON_OBJECT('title','Curated destinations','paragraphs', JSON_ARRAY(
            'Create destination landing pages with galleries, packages, and CTAs.',
            'Swap images and update text to match your travel brand.'
          )),'styles', JSON_OBJECT('width','md')),
          JSON_OBJECT('type','CARDS','props', JSON_OBJECT('cards', JSON_ARRAY(
            JSON_OBJECT('title','Alpine weekender','text','Cabins, spa, and mountain views.','cta', JSON_OBJECT('label','Get details','href','/contact')),
            JSON_OBJECT('title','Coastal reset','text','Beach stays and local food tours.','cta', JSON_OBJECT('label','Get details','href','/contact')),
            JSON_OBJECT('title','City sprint','text','Museums, boutique hotels, and nightlife.','cta', JSON_OBJECT('label','Get details','href','/contact'))
          )),'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© Summit Travel Co.'),'styles', JSON_OBJECT('variant','dark'))
        )
      ),
      JSON_OBJECT(
        'name', 'Pricing',
        'path', '/pricing',
        'meta', JSON_OBJECT('title','Pricing - Summit','description','Simple pricing for planning and packages.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','Summit Travel','links', JSON_ARRAY(JSON_OBJECT('label','Destinations','href','/destinations'), JSON_OBJECT('label','About','href','/about'), JSON_OBJECT('label','Pricing','href','/pricing'), JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','PRICING','props', JSON_OBJECT('plans', JSON_ARRAY(
            JSON_OBJECT('name','Starter','price','€49','period','/trip','features', JSON_ARRAY('1 itinerary draft','Email support','Partner discounts')),
            JSON_OBJECT('name','Plus','price','€149','period','/trip','features', JSON_ARRAY('2 revisions','Transfers planning','Priority support')),
            JSON_OBJECT('name','Concierge','price','€399','period','/trip','features', JSON_ARRAY('End-to-end planning','24/7 support','VIP partners'))
          )),'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© Summit Travel Co.'),'styles', JSON_OBJECT('variant','dark'))
        )
      ),
      JSON_OBJECT(
        'name', 'About',
        'path', '/about',
        'meta', JSON_OBJECT('title','About - Summit','description','Our approach to travel.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','Summit Travel','links', JSON_ARRAY(JSON_OBJECT('label','Destinations','href','/destinations'), JSON_OBJECT('label','About','href','/about'), JSON_OBJECT('label','Pricing','href','/pricing'), JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','CONTENT','props', JSON_OBJECT('title','Travel, simplified','paragraphs', JSON_ARRAY(
            'We combine local partners with clear planning workflows so trips feel effortless.',
            'Customize this page to highlight your team, values, and process.'
          )),'styles', JSON_OBJECT('width','md')),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© Summit Travel Co.'),'styles', JSON_OBJECT('variant','dark'))
        )
      ),
      JSON_OBJECT(
        'name', 'Contact',
        'path', '/contact',
        'meta', JSON_OBJECT('title','Contact - Summit','description','Request an itinerary.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','Summit Travel','links', JSON_ARRAY(JSON_OBJECT('label','Destinations','href','/destinations'), JSON_OBJECT('label','About','href','/about'), JSON_OBJECT('label','Pricing','href','/pricing'), JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','CONTACT_FORM','props', JSON_OBJECT('headline','Request an itinerary','fields', JSON_ARRAY('name','email','message')),'styles', JSON_OBJECT('layout','card')),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© Summit Travel Co.'),'styles', JSON_OBJECT('variant','dark'))
        )
      )
    )
  )
);

INSERT INTO templates (name, category, preview_image_url, structure_json)
VALUES
(
  'Aurora Capital',
  'Finance',
  NULL,
  JSON_OBJECT(
    'pages', JSON_ARRAY(
      JSON_OBJECT(
        'name', 'Home',
        'path', '/',
        'meta', JSON_OBJECT('title','Aurora Capital','description','Modern wealth management for founders and families.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','Aurora Capital','links', JSON_ARRAY(JSON_OBJECT('label','Services','href','/services'), JSON_OBJECT('label','About','href','/about'), JSON_OBJECT('label','FAQ','href','/faq'), JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','HERO','props', JSON_OBJECT('headline','Clarity for every financial decision.','subheadline','A modern advisory experience built on transparency, planning, and discipline.','primaryCta', JSON_OBJECT('label','Book a consultation','href','/contact')),'styles', JSON_OBJECT('layout','split','buttonColor','#0ea5e9')),
          JSON_OBJECT('type','FEATURES','props', JSON_OBJECT('items', JSON_ARRAY(
            JSON_OBJECT('title','Planning','text','Goals, cashflow, and a clear roadmap'),
            JSON_OBJECT('title','Investing','text','Diversified strategies matched to risk'),
            JSON_OBJECT('title','Reporting','text','Simple dashboards and quarterly reviews')
          )),'styles', JSON_OBJECT('columns',3)),
          JSON_OBJECT('type','TESTIMONIALS','props', JSON_OBJECT(
            'headline','Trusted by clients who value clarity',
            'subheadline','Customize testimonials, copy, and sections in the builder.',
            'items', JSON_ARRAY(
              JSON_OBJECT('name','Lena','role','Founder','quote','The plan is clear, and the communication is excellent.'),
              JSON_OBJECT('name','Omar','role','Executive','quote','We finally have a strategy we understand and can follow.'),
              JSON_OBJECT('name','Maya','role','Family office','quote','Professional reporting and great long-term thinking.')
            )
          ),'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© Aurora Capital'),'styles', JSON_OBJECT('variant','dark'))
        )
      ),
      JSON_OBJECT(
        'name', 'Services',
        'path', '/services',
        'meta', JSON_OBJECT('title','Services - Aurora Capital','description','Financial planning and advisory services.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','Aurora Capital','links', JSON_ARRAY(JSON_OBJECT('label','Services','href','/services'), JSON_OBJECT('label','About','href','/about'), JSON_OBJECT('label','FAQ','href','/faq'), JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','CARDS','props', JSON_OBJECT('cards', JSON_ARRAY(
            JSON_OBJECT('title','Wealth planning','text','Structure goals, budgets, and milestones.','cta', JSON_OBJECT('label','Learn more','href','/contact')),
            JSON_OBJECT('title','Portfolio strategy','text','Build diversified allocations with discipline.','cta', JSON_OBJECT('label','Learn more','href','/contact')),
            JSON_OBJECT('title','Tax-aware review','text','Coordinate planning with your local advisor.','cta', JSON_OBJECT('label','Learn more','href','/contact'))
          )),'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© Aurora Capital'),'styles', JSON_OBJECT('variant','dark'))
        )
      ),
      JSON_OBJECT(
        'name', 'FAQ',
        'path', '/faq',
        'meta', JSON_OBJECT('title','FAQ - Aurora Capital','description','Frequently asked questions.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','Aurora Capital','links', JSON_ARRAY(JSON_OBJECT('label','Services','href','/services'), JSON_OBJECT('label','About','href','/about'), JSON_OBJECT('label','FAQ','href','/faq'), JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','FAQ','props', JSON_OBJECT(
            'headline','Frequently asked questions',
            'subheadline','Clear answers for new clients.',
            'items', JSON_ARRAY(
              JSON_OBJECT('q','Do you work with startups?','a','Yes — we work with founders on planning and long-term strategy.'),
              JSON_OBJECT('q','How do you charge?','a','We offer simple packages. Customize pricing on the Pricing page if needed.'),
              JSON_OBJECT('q','Is my data secure?','a','We follow best practices and keep access restricted to your account.')
            )
          ),'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© Aurora Capital'),'styles', JSON_OBJECT('variant','dark'))
        )
      ),
      JSON_OBJECT(
        'name', 'About',
        'path', '/about',
        'meta', JSON_OBJECT('title','About - Aurora Capital','description','Meet the team.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','Aurora Capital','links', JSON_ARRAY(JSON_OBJECT('label','Services','href','/services'), JSON_OBJECT('label','About','href','/about'), JSON_OBJECT('label','FAQ','href','/faq'), JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','CONTENT','props', JSON_OBJECT('title','A modern advisory team','paragraphs', JSON_ARRAY(
            'We focus on clear plans, ongoing reviews, and high-signal reporting.',
            'Edit this content to tell your story and describe your methodology.'
          )),'styles', JSON_OBJECT('width','md')),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© Aurora Capital'),'styles', JSON_OBJECT('variant','dark'))
        )
      ),
      JSON_OBJECT(
        'name', 'Contact',
        'path', '/contact',
        'meta', JSON_OBJECT('title','Contact - Aurora Capital','description','Book a consultation.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','Aurora Capital','links', JSON_ARRAY(JSON_OBJECT('label','Services','href','/services'), JSON_OBJECT('label','About','href','/about'), JSON_OBJECT('label','FAQ','href','/faq'), JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','CONTACT_FORM','props', JSON_OBJECT('headline','Book a consultation','fields', JSON_ARRAY('name','email','message')),'styles', JSON_OBJECT('layout','card')),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© Aurora Capital'),'styles', JSON_OBJECT('variant','dark'))
        )
      )
    )
  )
);

INSERT INTO templates (name, category, preview_image_url, structure_json)
VALUES
(
  'Bloom Beauty Studio',
  'Beauty',
  NULL,
  JSON_OBJECT(
    'pages', JSON_ARRAY(
      JSON_OBJECT(
        'name', 'Home',
        'path', '/',
        'meta', JSON_OBJECT('title','Bloom Beauty','description','Premium skin & beauty studio with modern treatments.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','Bloom','links', JSON_ARRAY(JSON_OBJECT('label','Services','href','/services'), JSON_OBJECT('label','Gallery','href','/gallery'), JSON_OBJECT('label','About','href','/about'), JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','HERO','props', JSON_OBJECT('headline','Skin-first treatments, tailored to you.','subheadline','A calm studio experience with modern methods and consistent results.','primaryCta', JSON_OBJECT('label','Book an appointment','href','/contact')),'styles', JSON_OBJECT('layout','split','buttonColor','#ec4899')),
          JSON_OBJECT('type','FEATURES','props', JSON_OBJECT('items', JSON_ARRAY(
            JSON_OBJECT('title','Personalized consults','text','Plans built around your skin and schedule'),
            JSON_OBJECT('title','Modern products','text','Professional-grade care and clean ingredients'),
            JSON_OBJECT('title','Calm experience','text','A studio designed for comfort and privacy')
          )),'styles', JSON_OBJECT('columns',3)),
          JSON_OBJECT('type','TESTIMONIALS','props', JSON_OBJECT(
            'headline','Clients love the results',
            'subheadline','Update these testimonials to match your business.',
            'items', JSON_ARRAY(
              JSON_OBJECT('name','Nadia','role','Facials','quote','Best facial I’ve had — my skin looked brighter immediately.'),
              JSON_OBJECT('name','Tara','role','Client','quote','Super clean studio and a really relaxing appointment.'),
              JSON_OBJECT('name','Eli','role','Skincare routine','quote','The aftercare plan made a big difference.')
            )
          ),'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© Bloom Beauty Studio'),'styles', JSON_OBJECT('variant','dark'))
        )
      ),
      JSON_OBJECT(
        'name', 'Services',
        'path', '/services',
        'meta', JSON_OBJECT('title','Services - Bloom','description','Treatments and packages.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','Bloom','links', JSON_ARRAY(JSON_OBJECT('label','Services','href','/services'), JSON_OBJECT('label','Gallery','href','/gallery'), JSON_OBJECT('label','About','href','/about'), JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','PRICING','props', JSON_OBJECT('plans', JSON_ARRAY(
            JSON_OBJECT('name','Glow Facial','price','€79','period','/session','features', JSON_ARRAY('Skin analysis','Deep cleanse','Hydration mask')),
            JSON_OBJECT('name','Clear Reset','price','€119','period','/session','features', JSON_ARRAY('Targeted treatment','Calming routine','Aftercare plan')),
            JSON_OBJECT('name','Membership','price','€59','period','/mo','features', JSON_ARRAY('Monthly session','Member perks','Priority booking'))
          )),'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© Bloom Beauty Studio'),'styles', JSON_OBJECT('variant','dark'))
        )
      ),
      JSON_OBJECT(
        'name', 'Gallery',
        'path', '/gallery',
        'meta', JSON_OBJECT('title','Gallery - Bloom','description','Studio and results.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','Bloom','links', JSON_ARRAY(JSON_OBJECT('label','Services','href','/services'), JSON_OBJECT('label','Gallery','href','/gallery'), JSON_OBJECT('label','About','href','/about'), JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','GALLERY','props', JSON_OBJECT('images', JSON_ARRAY(
            'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=60',
            'https://images.unsplash.com/photo-1526045478516-99145907023c?auto=format&fit=crop&w=1200&q=60',
            'https://images.unsplash.com/photo-1500835556837-99ac94a94552?auto=format&fit=crop&w=1200&q=60'
          )),'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© Bloom Beauty Studio'),'styles', JSON_OBJECT('variant','dark'))
        )
      ),
      JSON_OBJECT(
        'name', 'About',
        'path', '/about',
        'meta', JSON_OBJECT('title','About - Bloom','description','Our studio and team.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','Bloom','links', JSON_ARRAY(JSON_OBJECT('label','Services','href','/services'), JSON_OBJECT('label','Gallery','href','/gallery'), JSON_OBJECT('label','About','href','/about'), JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','CONTENT','props', JSON_OBJECT('title','A calm studio approach','paragraphs', JSON_ARRAY(
            'We focus on consistency, gentle techniques, and results you can maintain.',
            'Customize this page to introduce your team and philosophy.'
          )),'styles', JSON_OBJECT('width','md')),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© Bloom Beauty Studio'),'styles', JSON_OBJECT('variant','dark'))
        )
      ),
      JSON_OBJECT(
        'name', 'Contact',
        'path', '/contact',
        'meta', JSON_OBJECT('title','Contact - Bloom','description','Book your appointment.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','Bloom','links', JSON_ARRAY(JSON_OBJECT('label','Services','href','/services'), JSON_OBJECT('label','Gallery','href','/gallery'), JSON_OBJECT('label','About','href','/about'), JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','CONTACT_FORM','props', JSON_OBJECT('headline','Book an appointment','fields', JSON_ARRAY('name','email','message')),'styles', JSON_OBJECT('layout','card')),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© Bloom Beauty Studio'),'styles', JSON_OBJECT('variant','dark'))
        )
      )
    )
  )
);

INSERT INTO templates (name, category, preview_image_url, structure_json)
VALUES
(
  'Forge Creative Agency',
  'Agency',
  NULL,
  JSON_OBJECT(
    'pages', JSON_ARRAY(
      JSON_OBJECT(
        'name', 'Home',
        'path', '/',
        'meta', JSON_OBJECT('title','Forge Creative','description','Brand, web, and product design for teams that ship.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','Forge','links', JSON_ARRAY(JSON_OBJECT('label','Work','href','/work'), JSON_OBJECT('label','Services','href','/services'), JSON_OBJECT('label','About','href','/about'), JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','HERO','props', JSON_OBJECT('headline','Design that ships.','subheadline','We build high-performing brand and web experiences with a clean process.','primaryCta', JSON_OBJECT('label','View work','href','/work')),'styles', JSON_OBJECT('layout','split','buttonColor','#a855f7')),
          JSON_OBJECT('type','CARDS','props', JSON_OBJECT('cards', JSON_ARRAY(
            JSON_OBJECT('title','Brand systems','text','Naming, identity, and design systems that scale.','cta', JSON_OBJECT('label','See services','href','/services')),
            JSON_OBJECT('title','Web experiences','text','Fast sites with strong UX and conversion.','cta', JSON_OBJECT('label','See services','href','/services')),
            JSON_OBJECT('title','Product design','text','Flows, UI kits, and prototypes for teams.','cta', JSON_OBJECT('label','See services','href','/services'))
          )),'styles', JSON_OBJECT()),
          JSON_OBJECT('type','TESTIMONIALS','props', JSON_OBJECT(
            'headline','Teams trust our process',
            'subheadline','Edit testimonials, cards, and CTAs to match your agency.',
            'items', JSON_ARRAY(
              JSON_OBJECT('name','Iris','role','Startup CEO','quote','Fast, sharp, and very organized. The site converted immediately.'),
              JSON_OBJECT('name','Ben','role','PM','quote','Clear milestones and excellent design quality.'),
              JSON_OBJECT('name','Hana','role','Founder','quote','They nailed the brand direction and the launch timeline.')
            )
          ),'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© Forge Creative Agency'),'styles', JSON_OBJECT('variant','dark'))
        )
      ),
      JSON_OBJECT(
        'name', 'Work',
        'path', '/work',
        'meta', JSON_OBJECT('title','Work - Forge','description','Selected projects.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','Forge','links', JSON_ARRAY(JSON_OBJECT('label','Work','href','/work'), JSON_OBJECT('label','Services','href','/services'), JSON_OBJECT('label','About','href','/about'), JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','GALLERY','props', JSON_OBJECT('images', JSON_ARRAY(
            'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=60',
            'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1200&q=60',
            'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1200&q=60'
          )),'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© Forge Creative Agency'),'styles', JSON_OBJECT('variant','dark'))
        )
      ),
      JSON_OBJECT(
        'name', 'Services',
        'path', '/services',
        'meta', JSON_OBJECT('title','Services - Forge','description','How we help teams launch.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','Forge','links', JSON_ARRAY(JSON_OBJECT('label','Work','href','/work'), JSON_OBJECT('label','Services','href','/services'), JSON_OBJECT('label','About','href','/about'), JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','FEATURES','props', JSON_OBJECT('items', JSON_ARRAY(
            JSON_OBJECT('title','Discovery','text','Goals, audience, and positioning'),
            JSON_OBJECT('title','Design','text','UI, components, and brand systems'),
            JSON_OBJECT('title','Launch support','text','Polish, QA, and iteration')
          )),'styles', JSON_OBJECT('columns',3)),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© Forge Creative Agency'),'styles', JSON_OBJECT('variant','dark'))
        )
      ),
      JSON_OBJECT(
        'name', 'About',
        'path', '/about',
        'meta', JSON_OBJECT('title','About - Forge','description','Our team and approach.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','Forge','links', JSON_ARRAY(JSON_OBJECT('label','Work','href','/work'), JSON_OBJECT('label','Services','href','/services'), JSON_OBJECT('label','About','href','/about'), JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','CONTENT','props', JSON_OBJECT('title','A small team with senior craft','paragraphs', JSON_ARRAY(
            'We keep teams lean and outcomes focused — no fluff, no mystery.',
            'Customize this about page with your story, values, and team intro.'
          )),'styles', JSON_OBJECT('width','md')),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© Forge Creative Agency'),'styles', JSON_OBJECT('variant','dark'))
        )
      ),
      JSON_OBJECT(
        'name', 'Contact',
        'path', '/contact',
        'meta', JSON_OBJECT('title','Contact - Forge','description','Start a project.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','Forge','links', JSON_ARRAY(JSON_OBJECT('label','Work','href','/work'), JSON_OBJECT('label','Services','href','/services'), JSON_OBJECT('label','About','href','/about'), JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','CONTACT_FORM','props', JSON_OBJECT('headline','Start a project','fields', JSON_ARRAY('name','email','message')),'styles', JSON_OBJECT('layout','card')),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© Forge Creative Agency'),'styles', JSON_OBJECT('variant','dark'))
        )
      )
    )
  )
);

INSERT INTO templates (name, category, preview_image_url, structure_json)
VALUES
(
  'Velocity Athletics',
  'Sports',
  NULL,
  JSON_OBJECT(
    'pages', JSON_ARRAY(
      JSON_OBJECT(
        'name', 'Home',
        'path', '/',
        'meta', JSON_OBJECT('title','Velocity Athletics','description','Performance apparel & gear built for everyday athletes.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','Velocity','links', JSON_ARRAY(JSON_OBJECT('label','Home','href','/'), JSON_OBJECT('label','Collections','href','/collections'), JSON_OBJECT('label','Stories','href','/stories'), JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','HERO','props', JSON_OBJECT('headline','Move like it matters.','subheadline','Premium training essentials engineered for comfort, durability, and momentum.','primaryCta', JSON_OBJECT('label','Explore collections','href','/collections')),'styles', JSON_OBJECT('layout','split','buttonColor','#22c55e')),
          JSON_OBJECT('type','STATS_CTA','props', JSON_OBJECT(
            'headline','Built for reps. Built for miles.',
            'subheadline','Materials tested under real training, not just in a lab.',
            'primaryCta', JSON_OBJECT('label','Shop bestsellers','href','/collections'),
            'items', JSON_ARRAY(
              JSON_OBJECT('value','4-way','label','stretch fabrics'),
              JSON_OBJECT('value','Moisture','label','wicking tech'),
              JSON_OBJECT('value','30 days','label','easy returns')
            )
          ),'styles', JSON_OBJECT()),
          JSON_OBJECT('type','GALLERY','props', JSON_OBJECT('images', JSON_ARRAY(
            'https://images.unsplash.com/photo-1526401485004-2fda9f6f3c9b?auto=format&fit=crop&w=1200&q=60',
            'https://images.unsplash.com/photo-1517832207067-4db24a2ae47c?auto=format&fit=crop&w=1200&q=60',
            'https://images.unsplash.com/photo-1526403226-34c8027f9f41?auto=format&fit=crop&w=1200&q=60'
          )),'styles', JSON_OBJECT()),
          JSON_OBJECT('type','CARDS','props', JSON_OBJECT('cards', JSON_ARRAY(
            JSON_OBJECT('title','Core Training','text','Minimal pieces that layer cleanly. Built for daily sessions.','cta', JSON_OBJECT('label','Shop Core','href','/collections')),
            JSON_OBJECT('title','Run Club','text','Lightweight tops and shorts designed for comfort over distance.','cta', JSON_OBJECT('label','Shop Run','href','/collections')),
            JSON_OBJECT('title','Recovery','text','Soft-touch fabrics for warmups, cooldowns, and rest days.','cta', JSON_OBJECT('label','Shop Recovery','href','/collections'))
          )),'styles', JSON_OBJECT()),
          JSON_OBJECT('type','TESTIMONIALS','props', JSON_OBJECT(
            'headline','Trusted by teams and solo athletes',
            'subheadline','Real feedback from real training blocks.',
            'items', JSON_ARRAY(
              JSON_OBJECT('name','Jordan','role','Marathon runner','quote','The fit stays locked in on long runs. No distractions.'),
              JSON_OBJECT('name','Casey','role','Strength coach','quote','Great durability. Clients wear it hard and it holds up.'),
              JSON_OBJECT('name','Amira','role','Cross-training','quote','Breathable and premium — feels like top-tier gear.')
            )
          ),'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FAQ','props', JSON_OBJECT(
            'headline','Shipping & fit',
            'subheadline','Quick answers before you checkout.',
            'items', JSON_ARRAY(
              JSON_OBJECT('q','Do you ship internationally?','a','Yes. Shipping options appear at checkout based on your country.'),
              JSON_OBJECT('q','What’s the return policy?','a','30-day returns on unworn items with original tags.'),
              JSON_OBJECT('q','How do I find my size?','a','Use the size chart on product pages and compare to a favorite item you own.')
            )
          ),'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© Velocity Athletics'),'styles', JSON_OBJECT('variant','dark'))
        )
      ),
      JSON_OBJECT(
        'name', 'Collections',
        'path', '/collections',
        'meta', JSON_OBJECT('title','Collections - Velocity','description','Explore training, running, and recovery essentials.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','Velocity','links', JSON_ARRAY(JSON_OBJECT('label','Home','href','/'), JSON_OBJECT('label','Collections','href','/collections'), JSON_OBJECT('label','Stories','href','/stories'), JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','CONTENT','props', JSON_OBJECT('title','Featured drops','paragraphs', JSON_ARRAY(
            'Curated sets that look clean, feel premium, and perform under pressure.',
            'Edit every title, card, link, and image in the builder.'
          )),'styles', JSON_OBJECT('width','md')),
          JSON_OBJECT('type','CARDS','props', JSON_OBJECT('cards', JSON_ARRAY(
            JSON_OBJECT('title','Velocity Set','text','Top + short designed for high-output intervals.','cta', JSON_OBJECT('label','View set','href','/contact')),
            JSON_OBJECT('title','Endurance Layer','text','Long-sleeve breathable layer built for cool mornings.','cta', JSON_OBJECT('label','View layer','href','/contact')),
            JSON_OBJECT('title','Studio Essentials','text','Soft-touch fits made for flexibility and form.','cta', JSON_OBJECT('label','View essentials','href','/contact'))
          )),'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© Velocity Athletics'),'styles', JSON_OBJECT('variant','dark'))
        )
      ),
      JSON_OBJECT(
        'name', 'Stories',
        'path', '/stories',
        'meta', JSON_OBJECT('title','Stories - Velocity','description','Campaigns, athletes, and community.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','Velocity','links', JSON_ARRAY(JSON_OBJECT('label','Home','href','/'), JSON_OBJECT('label','Collections','href','/collections'), JSON_OBJECT('label','Stories','href','/stories'), JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','CONTENT','props', JSON_OBJECT('title','Athlete-first storytelling','paragraphs', JSON_ARRAY(
            'Tell your brand story with campaign pages, photos, and testimonials.',
            'Swap images in Gallery and update copy in Content/Hero.'
          )),'styles', JSON_OBJECT('width','md')),
          JSON_OBJECT('type','GALLERY','props', JSON_OBJECT('images', JSON_ARRAY(
            'https://images.unsplash.com/photo-1518611012118-f0c5d4145c12?auto=format&fit=crop&w=1200&q=60',
            'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=60',
            'https://images.unsplash.com/photo-1554298128-c916518a4f5b?auto=format&fit=crop&w=1200&q=60'
          )),'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© Velocity Athletics'),'styles', JSON_OBJECT('variant','dark'))
        )
      ),
      JSON_OBJECT(
        'name', 'Contact',
        'path', '/contact',
        'meta', JSON_OBJECT('title','Contact - Velocity','description','Support, partnerships, and wholesale.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','Velocity','links', JSON_ARRAY(JSON_OBJECT('label','Home','href','/'), JSON_OBJECT('label','Collections','href','/collections'), JSON_OBJECT('label','Stories','href','/stories'), JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','CONTACT_FORM','props', JSON_OBJECT('headline','Contact Velocity','fields', JSON_ARRAY('name','email','message')),'styles', JSON_OBJECT('layout','card')),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© Velocity Athletics'),'styles', JSON_OBJECT('variant','dark'))
        )
      )
    )
  )
);

INSERT INTO templates (name, category, preview_image_url, structure_json)
VALUES
(
  'Orbit Originals',
  'Apparel',
  NULL,
  JSON_OBJECT(
    'pages', JSON_ARRAY(
      JSON_OBJECT(
        'name', 'Home',
        'path', '/',
        'meta', JSON_OBJECT('title','Orbit Originals','description','Streetwear with technical details and clean silhouettes.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','Orbit','links', JSON_ARRAY(JSON_OBJECT('label','Home','href','/'), JSON_OBJECT('label','Lookbook','href','/lookbook'), JSON_OBJECT('label','Pricing','href','/pricing'), JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','HERO','props', JSON_OBJECT('headline','Originals, refined.','subheadline','Minimal streetwear with technical fabrics and bold contrast.','primaryCta', JSON_OBJECT('label','View lookbook','href','/lookbook')),'styles', JSON_OBJECT('layout','split','buttonColor','#f97316')),
          JSON_OBJECT('type','FEATURES','props', JSON_OBJECT('items', JSON_ARRAY(
            JSON_OBJECT('title','Technical fabrics','text','Soft-touch, breathable, and built to last'),
            JSON_OBJECT('title','Limited drops','text','Seasonal capsules with tight curation'),
            JSON_OBJECT('title','Customizable','text','Edit colors, copy, links, and layout in the builder')
          )),'styles', JSON_OBJECT('columns',3)),
          JSON_OBJECT('type','GALLERY','props', JSON_OBJECT('images', JSON_ARRAY(
            'https://images.unsplash.com/photo-1520975958225-7f61b74c7d6d?auto=format&fit=crop&w=1200&q=60',
            'https://images.unsplash.com/photo-1520974722530-cfbd7e58f9bb?auto=format&fit=crop&w=1200&q=60',
            'https://images.unsplash.com/photo-1520974735194-6bf0bd62c66b?auto=format&fit=crop&w=1200&q=60'
          )),'styles', JSON_OBJECT()),
          JSON_OBJECT('type','CARDS','props', JSON_OBJECT('cards', JSON_ARRAY(
            JSON_OBJECT('title','The Orbit Hoodie','text','Heavyweight fleece, precise fit, clean branding.','cta', JSON_OBJECT('label','See details','href','/pricing')),
            JSON_OBJECT('title','Contrast Track Set','text','Technical weave with high mobility and structure.','cta', JSON_OBJECT('label','See details','href','/pricing')),
            JSON_OBJECT('title','Everyday Sneaker','text','Minimal silhouette, durable outsole, comfort-focused.','cta', JSON_OBJECT('label','See details','href','/pricing'))
          )),'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© Orbit Originals'),'styles', JSON_OBJECT('variant','dark'))
        )
      ),
      JSON_OBJECT(
        'name', 'Lookbook',
        'path', '/lookbook',
        'meta', JSON_OBJECT('title','Lookbook - Orbit','description','Campaign visuals and seasonal drops.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','Orbit','links', JSON_ARRAY(JSON_OBJECT('label','Home','href','/'), JSON_OBJECT('label','Lookbook','href','/lookbook'), JSON_OBJECT('label','Pricing','href','/pricing'), JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','CONTENT','props', JSON_OBJECT('title','Seasonal capsule','paragraphs', JSON_ARRAY(
            'Use the gallery to showcase a campaign, product shots, or a portfolio.',
            'Swap images to match your brand aesthetic and update sections in minutes.'
          )),'styles', JSON_OBJECT('width','md')),
          JSON_OBJECT('type','GALLERY','props', JSON_OBJECT('images', JSON_ARRAY(
            'https://images.unsplash.com/photo-1520975682076-79c9a7c2adf8?auto=format&fit=crop&w=1200&q=60',
            'https://images.unsplash.com/photo-1520975692298-3e1f7a2cb21a?auto=format&fit=crop&w=1200&q=60',
            'https://images.unsplash.com/photo-1520975686580-2c0c8f2d52d3?auto=format&fit=crop&w=1200&q=60'
          )),'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© Orbit Originals'),'styles', JSON_OBJECT('variant','dark'))
        )
      ),
      JSON_OBJECT(
        'name', 'Pricing',
        'path', '/pricing',
        'meta', JSON_OBJECT('title','Pricing - Orbit','description','Drop pricing & membership perks.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','Orbit','links', JSON_ARRAY(JSON_OBJECT('label','Home','href','/'), JSON_OBJECT('label','Lookbook','href','/lookbook'), JSON_OBJECT('label','Pricing','href','/pricing'), JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','PRICING','props', JSON_OBJECT('plans', JSON_ARRAY(
            JSON_OBJECT('name','Standard','price','€69','period','/item','features', JSON_ARRAY('Fast shipping','Easy returns','Email support')),
            JSON_OBJECT('name','Member','price','€12','period','/mo','features', JSON_ARRAY('Early access drops','Member-only discounts','Priority support')),
            JSON_OBJECT('name','Partner','price','€99','period','/mo','features', JSON_ARRAY('Bulk orders','Custom branding','Dedicated contact'))
          )),'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© Orbit Originals'),'styles', JSON_OBJECT('variant','dark'))
        )
      ),
      JSON_OBJECT(
        'name', 'Contact',
        'path', '/contact',
        'meta', JSON_OBJECT('title','Contact - Orbit','description','Wholesale, collaborations, and support.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','Orbit','links', JSON_ARRAY(JSON_OBJECT('label','Home','href','/'), JSON_OBJECT('label','Lookbook','href','/lookbook'), JSON_OBJECT('label','Pricing','href','/pricing'), JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','CONTACT_FORM','props', JSON_OBJECT('headline','Start a collaboration','fields', JSON_ARRAY('name','email','message')),'styles', JSON_OBJECT('layout','card')),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© Orbit Originals'),'styles', JSON_OBJECT('variant','dark'))
        )
      )
    )
  )
);

INSERT INTO templates (name, category, preview_image_url, structure_json)
VALUES
(
  'CineWave Streaming',
  'Entertainment',
  NULL,
  JSON_OBJECT(
    'pages', JSON_ARRAY(
      JSON_OBJECT(
        'name', 'Home',
        'path', '/',
        'meta', JSON_OBJECT('title','CineWave','description','Stream premium series and films across every device.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','CineWave','links', JSON_ARRAY(JSON_OBJECT('label','Home','href','/'), JSON_OBJECT('label','Plans','href','/plans'), JSON_OBJECT('label','FAQ','href','/faq'), JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','HERO','props', JSON_OBJECT('headline','Big stories. Zero friction.','subheadline','Stream new originals, award-winning films, and live events — anytime.','primaryCta', JSON_OBJECT('label','View plans','href','/plans')),'styles', JSON_OBJECT('layout','split','buttonColor','#ef4444')),
          JSON_OBJECT('type','FEATURES','props', JSON_OBJECT('items', JSON_ARRAY(
            JSON_OBJECT('title','Every device','text','Phone, tablet, desktop, and smart TV ready'),
            JSON_OBJECT('title','Personalized','text','Profiles, recommendations, and watchlists'),
            JSON_OBJECT('title','Ultra HD','text','Crisp playback with adaptive streaming')
          )),'styles', JSON_OBJECT('columns',3)),
          JSON_OBJECT('type','GALLERY','props', JSON_OBJECT('images', JSON_ARRAY(
            'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=1200&q=60',
            'https://images.unsplash.com/photo-1517602302552-471fe67acf66?auto=format&fit=crop&w=1200&q=60',
            'https://images.unsplash.com/photo-1522120692535-2024b19c2f15?auto=format&fit=crop&w=1200&q=60'
          )),'styles', JSON_OBJECT()),
          JSON_OBJECT('type','TESTIMONIALS','props', JSON_OBJECT(
            'headline','Loved by viewers',
            'subheadline','Built for comfort and binge-worthy nights.',
            'items', JSON_ARRAY(
              JSON_OBJECT('name','Lea','role','Subscriber','quote','The UI is clean and the recommendations are actually good.'),
              JSON_OBJECT('name','Noah','role','Film fan','quote','Great catalog and the stream quality is excellent.'),
              JSON_OBJECT('name','Ari','role','Family plan','quote','Profiles make it easy for everyone to have their own space.')
            )
          ),'styles', JSON_OBJECT()),
          JSON_OBJECT('type','STATS_CTA','props', JSON_OBJECT(
            'headline','Start watching in minutes',
            'subheadline','No contracts. Cancel anytime.',
            'primaryCta', JSON_OBJECT('label','Join now','href','/plans'),
            'items', JSON_ARRAY(
              JSON_OBJECT('value','4K','label','Ultra HD'),
              JSON_OBJECT('value','5','label','profiles'),
              JSON_OBJECT('value','∞','label','watchlist')
            )
          ),'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© CineWave Streaming'),'styles', JSON_OBJECT('variant','dark'))
        )
      ),
      JSON_OBJECT(
        'name', 'Plans',
        'path', '/plans',
        'meta', JSON_OBJECT('title','Plans - CineWave','description','Pick a plan that fits your household.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','CineWave','links', JSON_ARRAY(JSON_OBJECT('label','Home','href','/'), JSON_OBJECT('label','Plans','href','/plans'), JSON_OBJECT('label','FAQ','href','/faq'), JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','PRICING','props', JSON_OBJECT('plans', JSON_ARRAY(
            JSON_OBJECT('name','Basic','price','€7.99','period','/mo','features', JSON_ARRAY('HD streaming','1 screen','Limited downloads')),
            JSON_OBJECT('name','Standard','price','€12.99','period','/mo','features', JSON_ARRAY('Full HD','2 screens','Offline downloads')),
            JSON_OBJECT('name','Premium','price','€17.99','period','/mo','features', JSON_ARRAY('Ultra HD','4 screens','Best audio'))
          )),'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© CineWave Streaming'),'styles', JSON_OBJECT('variant','dark'))
        )
      ),
      JSON_OBJECT(
        'name', 'FAQ',
        'path', '/faq',
        'meta', JSON_OBJECT('title','FAQ - CineWave','description','Help and support.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','CineWave','links', JSON_ARRAY(JSON_OBJECT('label','Home','href','/'), JSON_OBJECT('label','Plans','href','/plans'), JSON_OBJECT('label','FAQ','href','/faq'), JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','FAQ','props', JSON_OBJECT(
            'headline','Frequently asked questions',
            'subheadline','Everything you need to know before subscribing.',
            'items', JSON_ARRAY(
              JSON_OBJECT('q','Can I cancel anytime?','a','Yes. You can cancel whenever you want from Settings.'),
              JSON_OBJECT('q','Do you support offline downloads?','a','Yes on Standard and Premium plans.'),
              JSON_OBJECT('q','How many devices can I use?','a','You can sign in on multiple devices; streaming screens depend on your plan.')
            )
          ),'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© CineWave Streaming'),'styles', JSON_OBJECT('variant','dark'))
        )
      ),
      JSON_OBJECT(
        'name', 'Contact',
        'path', '/contact',
        'meta', JSON_OBJECT('title','Contact - CineWave','description','Talk to support.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','CineWave','links', JSON_ARRAY(JSON_OBJECT('label','Home','href','/'), JSON_OBJECT('label','Plans','href','/plans'), JSON_OBJECT('label','FAQ','href','/faq'), JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','CONTACT_FORM','props', JSON_OBJECT('headline','Contact support','fields', JSON_ARRAY('name','email','message')),'styles', JSON_OBJECT('layout','card')),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© CineWave Streaming'),'styles', JSON_OBJECT('variant','dark'))
        )
      )
    )
  )
);

INSERT INTO templates (name, category, preview_image_url, structure_json)
VALUES
(
  'NovaMart Commerce',
  'Marketplace',
  NULL,
  JSON_OBJECT(
    'pages', JSON_ARRAY(
      JSON_OBJECT(
        'name', 'Home',
        'path', '/',
        'meta', JSON_OBJECT('title','NovaMart','description','Everything you need, delivered fast with transparent pricing.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','NovaMart','links', JSON_ARRAY(JSON_OBJECT('label','Home','href','/'), JSON_OBJECT('label','Categories','href','/categories'), JSON_OBJECT('label','Deals','href','/deals'), JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','HERO','props', JSON_OBJECT('headline','Shop smart. Ship fast.','subheadline','A modern marketplace experience — clear categories, quick delivery, and easy returns.','primaryCta', JSON_OBJECT('label','Browse deals','href','/deals')),'styles', JSON_OBJECT('layout','split','buttonColor','#6366f1')),
          JSON_OBJECT('type','FEATURES','props', JSON_OBJECT('items', JSON_ARRAY(
            JSON_OBJECT('title','Fast delivery','text','Reliable shipping with tracking updates'),
            JSON_OBJECT('title','Secure checkout','text','Modern payments and fraud protection'),
            JSON_OBJECT('title','Easy returns','text','Simple returns and support')
          )),'styles', JSON_OBJECT('columns',3)),
          JSON_OBJECT('type','CARDS','props', JSON_OBJECT('cards', JSON_ARRAY(
            JSON_OBJECT('title','Electronics','text','Headphones, laptops, accessories, smart home.','cta', JSON_OBJECT('label','Shop electronics','href','/categories')),
            JSON_OBJECT('title','Home & kitchen','text','Tools, appliances, decor, essentials.','cta', JSON_OBJECT('label','Shop home','href','/categories')),
            JSON_OBJECT('title','Fitness','text','Training gear, recovery, wearables.','cta', JSON_OBJECT('label','Shop fitness','href','/categories'))
          )),'styles', JSON_OBJECT()),
          JSON_OBJECT('type','TESTIMONIALS','props', JSON_OBJECT(
            'headline','Customers come back for the experience',
            'subheadline','Fast shipping and clarity at every step.',
            'items', JSON_ARRAY(
              JSON_OBJECT('name','Emil','role','Subscriber','quote','Delivery was faster than expected and returns were painless.'),
              JSON_OBJECT('name','Sofia','role','Buyer','quote','Good prices and the site feels trustworthy.'),
              JSON_OBJECT('name','Rami','role','Small business','quote','The product cards made it easy to showcase our catalog.')
            )
          ),'styles', JSON_OBJECT()),
          JSON_OBJECT('type','STATS_CTA','props', JSON_OBJECT(
            'headline','Save on bundles & seasonal deals',
            'subheadline','Customize categories, copy, and cards for your own store.',
            'primaryCta', JSON_OBJECT('label','View today’s deals','href','/deals'),
            'items', JSON_ARRAY(
              JSON_OBJECT('value','24–48h','label','dispatch time'),
              JSON_OBJECT('value','1000+','label','products'),
              JSON_OBJECT('value','30 days','label','returns')
            )
          ),'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© NovaMart Commerce'),'styles', JSON_OBJECT('variant','dark'))
        )
      ),
      JSON_OBJECT(
        'name', 'Categories',
        'path', '/categories',
        'meta', JSON_OBJECT('title','Categories - NovaMart','description','Browse by category.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','NovaMart','links', JSON_ARRAY(JSON_OBJECT('label','Home','href','/'), JSON_OBJECT('label','Categories','href','/categories'), JSON_OBJECT('label','Deals','href','/deals'), JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','CONTENT','props', JSON_OBJECT('title','Browse categories','paragraphs', JSON_ARRAY(
            'Use this page to create category landing pages, curated collections, or seasonal campaigns.',
            'Everything here is editable: titles, descriptions, links, cards, and images.'
          )),'styles', JSON_OBJECT('width','md')),
          JSON_OBJECT('type','CARDS','props', JSON_OBJECT('cards', JSON_ARRAY(
            JSON_OBJECT('title','Best sellers','text','Products customers love and reorder.','cta', JSON_OBJECT('label','View best sellers','href','/deals')),
            JSON_OBJECT('title','New arrivals','text','Fresh additions and trending items.','cta', JSON_OBJECT('label','View new','href','/deals')),
            JSON_OBJECT('title','Gifts','text','Curated bundles for every budget.','cta', JSON_OBJECT('label','View gifts','href','/deals'))
          )),'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© NovaMart Commerce'),'styles', JSON_OBJECT('variant','dark'))
        )
      ),
      JSON_OBJECT(
        'name', 'Deals',
        'path', '/deals',
        'meta', JSON_OBJECT('title','Deals - NovaMart','description','Limited-time offers and bundles.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','NovaMart','links', JSON_ARRAY(JSON_OBJECT('label','Home','href','/'), JSON_OBJECT('label','Categories','href','/categories'), JSON_OBJECT('label','Deals','href','/deals'), JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','PRICING','props', JSON_OBJECT('plans', JSON_ARRAY(
            JSON_OBJECT('name','Bundle A','price','€39','period','/bundle','features', JSON_ARRAY('2 items','Free shipping','Limited stock')),
            JSON_OBJECT('name','Bundle B','price','€79','period','/bundle','features', JSON_ARRAY('5 items','Priority shipping','Best value')),
            JSON_OBJECT('name','Bundle C','price','€149','period','/bundle','features', JSON_ARRAY('10 items','Premium support','Gift packaging'))
          )),'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© NovaMart Commerce'),'styles', JSON_OBJECT('variant','dark'))
        )
      ),
      JSON_OBJECT(
        'name', 'Contact',
        'path', '/contact',
        'meta', JSON_OBJECT('title','Contact - NovaMart','description','Customer support and partnerships.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','NovaMart','links', JSON_ARRAY(JSON_OBJECT('label','Home','href','/'), JSON_OBJECT('label','Categories','href','/categories'), JSON_OBJECT('label','Deals','href','/deals'), JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','CONTACT_FORM','props', JSON_OBJECT('headline','Contact NovaMart','fields', JSON_ARRAY('name','email','message')),'styles', JSON_OBJECT('layout','card')),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© NovaMart Commerce'),'styles', JSON_OBJECT('variant','dark'))
        )
      )
    )
  )
);

INSERT INTO templates (name, category, preview_image_url, structure_json)
VALUES
(
  'Cedar Cafe',
  'Restaurant',
  NULL,
  JSON_OBJECT(
    'pages', JSON_ARRAY(
      JSON_OBJECT(
        'name', 'Home',
        'path', '/',
        'meta', JSON_OBJECT('title','Cedar Cafe','description','Coffee, brunch, and pastries.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','Cedar Cafe','links', JSON_ARRAY(JSON_OBJECT('label','Menu','href','/'), JSON_OBJECT('label','About','href','/about'), JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','HERO','props', JSON_OBJECT('headline','Brunch that feels like a ritual.','subheadline','Seasonal plates, artisan coffee, and a warm space to slow down.','primaryCta', JSON_OBJECT('label','See Menu','href','/')),'styles', JSON_OBJECT('layout','split')),
          JSON_OBJECT('type','FEATURES','props', JSON_OBJECT('items', JSON_ARRAY(
            JSON_OBJECT('title','Fresh daily','text','Baked every morning, locally sourced ingredients'),
            JSON_OBJECT('title','Fast pickup','text','Order ahead and skip the line'),
            JSON_OBJECT('title','Cozy seating','text','A space to work, meet, and unwind')
          )),'styles', JSON_OBJECT('columns',3)),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© Cedar Cafe'),'styles', JSON_OBJECT('variant','dark'))
        )
      ),
      JSON_OBJECT(
        'name', 'About',
        'path', '/about',
        'meta', JSON_OBJECT('title','About - Cedar Cafe','description','Our story and sourcing'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','Cedar Cafe','links', JSON_ARRAY(JSON_OBJECT('label','Menu','href','/'), JSON_OBJECT('label','About','href','/about'), JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','CONTENT','props', JSON_OBJECT('title','Neighborhood-first','paragraphs', JSON_ARRAY('We partner with local roasters and farms.','Our menu changes with the season.')),'styles', JSON_OBJECT('width','md')),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© Cedar Cafe'),'styles', JSON_OBJECT('variant','dark'))
        )
      ),
      JSON_OBJECT(
        'name', 'Contact',
        'path', '/contact',
        'meta', JSON_OBJECT('title','Contact - Cedar Cafe','description','Find us'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','Cedar Cafe','links', JSON_ARRAY(JSON_OBJECT('label','Menu','href','/'), JSON_OBJECT('label','About','href','/about'), JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','CONTACT_FORM','props', JSON_OBJECT('headline','Catering & reservations','fields', JSON_ARRAY('name','email','message')),'styles', JSON_OBJECT('layout','card')),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© Cedar Cafe'),'styles', JSON_OBJECT('variant','dark'))
        )
      )
    )
  )
);

INSERT INTO templates (name, category, preview_image_url, structure_json)
VALUES
(
  'Nimbus SaaS',
  'Software',
  NULL,
  JSON_OBJECT(
    'pages', JSON_ARRAY(
      JSON_OBJECT(
        'name', 'Home',
        'path', '/',
        'meta', JSON_OBJECT('title','Nimbus','description','Ship faster with automated workflows.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','Nimbus','links', JSON_ARRAY(JSON_OBJECT('label','Product','href','/'), JSON_OBJECT('label','About','href','/about'), JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','HERO','props', JSON_OBJECT('headline','Workflows that scale with your team.','subheadline','Automate tasks, track progress, and ship faster — without the complexity.','primaryCta', JSON_OBJECT('label','Start free','href','/contact')),'styles', JSON_OBJECT('layout','split')),
          JSON_OBJECT('type','FEATURES','props', JSON_OBJECT('items', JSON_ARRAY(
            JSON_OBJECT('title','Automations','text','Trigger actions from events and schedules'),
            JSON_OBJECT('title','Analytics','text','Measure throughput and identify bottlenecks'),
            JSON_OBJECT('title','Integrations','text','Connect tools your team already uses')
          )),'styles', JSON_OBJECT('columns',3)),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© Nimbus'),'styles', JSON_OBJECT('variant','dark'))
        )
      ),
      JSON_OBJECT(
        'name', 'About',
        'path', '/about',
        'meta', JSON_OBJECT('title','About - Nimbus','description','Why Nimbus exists'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','Nimbus','links', JSON_ARRAY(JSON_OBJECT('label','Product','href','/'), JSON_OBJECT('label','About','href','/about'), JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','CONTENT','props', JSON_OBJECT('title','Built for speed','paragraphs', JSON_ARRAY('Nimbus reduces busywork with automation.','Teams move faster with clear visibility.')),'styles', JSON_OBJECT('width','md')),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© Nimbus'),'styles', JSON_OBJECT('variant','dark'))
        )
      ),
      JSON_OBJECT(
        'name', 'Contact',
        'path', '/contact',
        'meta', JSON_OBJECT('title','Contact - Nimbus','description','Talk to sales'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','Nimbus','links', JSON_ARRAY(JSON_OBJECT('label','Product','href','/'), JSON_OBJECT('label','About','href','/about'), JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','CONTACT_FORM','props', JSON_OBJECT('headline','Request a demo','fields', JSON_ARRAY('name','email','message')),'styles', JSON_OBJECT('layout','card')),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© Nimbus'),'styles', JSON_OBJECT('variant','dark'))
        )
      )
    )
  )
);

INSERT INTO templates (name, category, preview_image_url, structure_json)
VALUES
(
  'Harbor Dental',
  'Healthcare',
  NULL,
  JSON_OBJECT(
    'pages', JSON_ARRAY(
      JSON_OBJECT(
        'name', 'Home',
        'path', '/',
        'meta', JSON_OBJECT('title','Harbor Dental','description','Modern dentistry with a calm experience.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','Harbor Dental','links', JSON_ARRAY(JSON_OBJECT('label','Services','href','/'), JSON_OBJECT('label','About','href','/about'), JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','HERO','props', JSON_OBJECT('headline','Comfort-first care.','subheadline','A modern clinic focused on clear plans and gentle treatment.','primaryCta', JSON_OBJECT('label','Book appointment','href','/contact')),'styles', JSON_OBJECT('layout','split')),
          JSON_OBJECT('type','FEATURES','props', JSON_OBJECT('items', JSON_ARRAY(
            JSON_OBJECT('title','Clear pricing','text','Transparent plans and insurance support'),
            JSON_OBJECT('title','Modern equipment','text','Better diagnostics, better outcomes'),
            JSON_OBJECT('title','Family friendly','text','Care for kids and adults')
          )),'styles', JSON_OBJECT('columns',3)),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© Harbor Dental'),'styles', JSON_OBJECT('variant','dark'))
        )
      ),
      JSON_OBJECT(
        'name', 'About',
        'path', '/about',
        'meta', JSON_OBJECT('title','About - Harbor Dental','description','Meet the team'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','Harbor Dental','links', JSON_ARRAY(JSON_OBJECT('label','Services','href','/'), JSON_OBJECT('label','About','href','/about'), JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','CONTENT','props', JSON_OBJECT('title','A clinic built on trust','paragraphs', JSON_ARRAY('We focus on preventative care and clear communication.','Our team is trained for anxious patients.')),'styles', JSON_OBJECT('width','md')),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© Harbor Dental'),'styles', JSON_OBJECT('variant','dark'))
        )
      ),
      JSON_OBJECT(
        'name', 'Contact',
        'path', '/contact',
        'meta', JSON_OBJECT('title','Contact - Harbor Dental','description','Schedule a visit'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','Harbor Dental','links', JSON_ARRAY(JSON_OBJECT('label','Services','href','/'), JSON_OBJECT('label','About','href','/about'), JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','CONTACT_FORM','props', JSON_OBJECT('headline','Get in touch','fields', JSON_ARRAY('name','email','message')),'styles', JSON_OBJECT('layout','card')),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© Harbor Dental'),'styles', JSON_OBJECT('variant','dark'))
        )
      )
    )
  )
);

INSERT INTO templates (name, category, preview_image_url, structure_json)
VALUES
(
  'Aurora Boutique',
  'Ecommerce',
  NULL,
  JSON_OBJECT(
    'pages', JSON_ARRAY(
      JSON_OBJECT(
        'name', 'Home',
        'path', '/',
        'meta', JSON_OBJECT('title','Aurora Boutique','description','Curated essentials for modern living.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','Aurora','links', JSON_ARRAY(JSON_OBJECT('label','Shop','href','/'), JSON_OBJECT('label','About','href','/about'), JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','HERO','props', JSON_OBJECT('headline','Curated essentials.','subheadline','Small-batch pieces designed to last.','primaryCta', JSON_OBJECT('label','Shop now','href','/')),'styles', JSON_OBJECT('layout','split')),
          JSON_OBJECT('type','FEATURES','props', JSON_OBJECT('items', JSON_ARRAY(
            JSON_OBJECT('title','Free returns','text','30 days hassle-free returns'),
            JSON_OBJECT('title','Fast shipping','text','Dispatch in 24 hours'),
            JSON_OBJECT('title','Sustainable','text','Responsible materials and suppliers')
          )),'styles', JSON_OBJECT('columns',3)),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© Aurora Boutique'),'styles', JSON_OBJECT('variant','dark'))
        )
      ),
      JSON_OBJECT(
        'name', 'About',
        'path', '/about',
        'meta', JSON_OBJECT('title','About - Aurora','description','Our philosophy'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','Aurora','links', JSON_ARRAY(JSON_OBJECT('label','Shop','href','/'), JSON_OBJECT('label','About','href','/about'), JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','CONTENT','props', JSON_OBJECT('title','Designed with intention','paragraphs', JSON_ARRAY('We believe fewer, better things win.','Every product is curated for longevity.')),'styles', JSON_OBJECT('width','md')),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© Aurora Boutique'),'styles', JSON_OBJECT('variant','dark'))
        )
      ),
      JSON_OBJECT(
        'name', 'Contact',
        'path', '/contact',
        'meta', JSON_OBJECT('title','Contact - Aurora','description','Support'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','Aurora','links', JSON_ARRAY(JSON_OBJECT('label','Shop','href','/'), JSON_OBJECT('label','About','href','/about'), JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','CONTACT_FORM','props', JSON_OBJECT('headline','Customer support','fields', JSON_ARRAY('name','email','message')),'styles', JSON_OBJECT('layout','card')),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© Aurora Boutique'),'styles', JSON_OBJECT('variant','dark'))
        )
      )
    )
  )
);

INSERT INTO templates (name, category, preview_image_url, structure_json)
VALUES
(
  'Northwind Consulting',
  'Consulting',
  NULL,
  JSON_OBJECT(
    'pages', JSON_ARRAY(
      JSON_OBJECT(
        'name', 'Home',
        'path', '/',
        'meta', JSON_OBJECT('title','Northwind Consulting','description','Strategy and execution for growth.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','Northwind','links', JSON_ARRAY(JSON_OBJECT('label','Services','href','/'), JSON_OBJECT('label','About','href','/about'), JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','HERO','props', JSON_OBJECT('headline','Clarity, then momentum.','subheadline','We help teams align strategy with execution and deliver measurable outcomes.','primaryCta', JSON_OBJECT('label','Book a call','href','/contact')),'styles', JSON_OBJECT('layout','split')),
          JSON_OBJECT('type','FEATURES','props', JSON_OBJECT('items', JSON_ARRAY(
            JSON_OBJECT('title','Strategy','text','Positioning, narrative, and planning'),
            JSON_OBJECT('title','Operations','text','Process design and delivery systems'),
            JSON_OBJECT('title','Analytics','text','KPIs, dashboards, and decision-making')
          )),'styles', JSON_OBJECT('columns',3)),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© Northwind Consulting'),'styles', JSON_OBJECT('variant','dark'))
        )
      ),
      JSON_OBJECT(
        'name', 'About',
        'path', '/about',
        'meta', JSON_OBJECT('title','About - Northwind','description','Our team'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','Northwind','links', JSON_ARRAY(JSON_OBJECT('label','Services','href','/'), JSON_OBJECT('label','About','href','/about'), JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','CONTENT','props', JSON_OBJECT('title','Operators, not theorists','paragraphs', JSON_ARRAY('We have shipped products and built teams.','Our playbooks are practical and measurable.')),'styles', JSON_OBJECT('width','md')),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© Northwind Consulting'),'styles', JSON_OBJECT('variant','dark'))
        )
      ),
      JSON_OBJECT(
        'name', 'Contact',
        'path', '/contact',
        'meta', JSON_OBJECT('title','Contact - Northwind','description','Get a proposal'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','Northwind','links', JSON_ARRAY(JSON_OBJECT('label','Services','href','/'), JSON_OBJECT('label','About','href','/about'), JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','CONTACT_FORM','props', JSON_OBJECT('headline','Tell us about your goals','fields', JSON_ARRAY('name','email','message')),'styles', JSON_OBJECT('layout','card')),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© Northwind Consulting'),'styles', JSON_OBJECT('variant','dark'))
        )
      )
    )
  )
);

INSERT INTO templates (name, category, preview_image_url, structure_json)
VALUES
(
  'Luma Photography',
  'Photography',
  NULL,
  JSON_OBJECT(
    'pages', JSON_ARRAY(
      JSON_OBJECT(
        'name', 'Home',
        'path', '/',
        'meta', JSON_OBJECT('title','Luma Photography','description','Editorial photography for brands.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','Luma','links', JSON_ARRAY(JSON_OBJECT('label','Work','href','/'), JSON_OBJECT('label','About','href','/about'), JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','HERO','props', JSON_OBJECT('headline','Images that tell a story.','subheadline','Editorial style, commercial consistency, fast delivery.','primaryCta', JSON_OBJECT('label','View portfolio','href','/')),'styles', JSON_OBJECT('layout','split')),
          JSON_OBJECT('type','FEATURES','props', JSON_OBJECT('items', JSON_ARRAY(
            JSON_OBJECT('title','Brand shoots','text','Consistent visuals across channels'),
            JSON_OBJECT('title','Events','text','Candid coverage that feels premium'),
            JSON_OBJECT('title','Retouching','text','Natural edits and fast turnaround')
          )),'styles', JSON_OBJECT('columns',3)),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© Luma Photography'),'styles', JSON_OBJECT('variant','dark'))
        )
      ),
      JSON_OBJECT(
        'name', 'About',
        'path', '/about',
        'meta', JSON_OBJECT('title','About - Luma','description','Approach and gear'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','Luma','links', JSON_ARRAY(JSON_OBJECT('label','Work','href','/'), JSON_OBJECT('label','About','href','/about'), JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','CONTENT','props', JSON_OBJECT('title','A calm process','paragraphs', JSON_ARRAY('We plan, shoot, and deliver with clear milestones.','You get consistent edits that match your brand.')),'styles', JSON_OBJECT('width','md')),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© Luma Photography'),'styles', JSON_OBJECT('variant','dark'))
        )
      ),
      JSON_OBJECT(
        'name', 'Contact',
        'path', '/contact',
        'meta', JSON_OBJECT('title','Contact - Luma','description','Start a project'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','Luma','links', JSON_ARRAY(JSON_OBJECT('label','Work','href','/'), JSON_OBJECT('label','About','href','/about'), JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','CONTACT_FORM','props', JSON_OBJECT('headline','Let’s shoot','fields', JSON_ARRAY('name','email','message')),'styles', JSON_OBJECT('layout','card')),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© Luma Photography'),'styles', JSON_OBJECT('variant','dark'))
        )
      )
    )
  )
);

INSERT INTO templates (name, category, preview_image_url, structure_json)
VALUES
(
  'Skyline Realty',
  'Real Estate',
  NULL,
  JSON_OBJECT(
    'pages', JSON_ARRAY(
      JSON_OBJECT(
        'name', 'Home',
        'path', '/',
        'meta', JSON_OBJECT('title','Skyline Realty','description','Find your next home with confidence.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','Skyline Realty','links', JSON_ARRAY(JSON_OBJECT('label','Listings','href','/'), JSON_OBJECT('label','About','href','/about'), JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','HERO','props', JSON_OBJECT('headline','Homes, matched to your life.','subheadline','Local expertise, data-driven pricing, and a smooth process.','primaryCta', JSON_OBJECT('label','Get listings','href','/contact')),'styles', JSON_OBJECT('layout','split')),
          JSON_OBJECT('type','FEATURES','props', JSON_OBJECT('items', JSON_ARRAY(
            JSON_OBJECT('title','Buyer support','text','Search, tours, and negotiation'),
            JSON_OBJECT('title','Seller strategy','text','Pricing, staging, and marketing'),
            JSON_OBJECT('title','Local expertise','text','Neighborhood-by-neighborhood insight')
          )),'styles', JSON_OBJECT('columns',3)),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© Skyline Realty'),'styles', JSON_OBJECT('variant','dark'))
        )
      ),
      JSON_OBJECT(
        'name', 'About',
        'path', '/about',
        'meta', JSON_OBJECT('title','About - Skyline','description','Meet your agent'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','Skyline Realty','links', JSON_ARRAY(JSON_OBJECT('label','Listings','href','/'), JSON_OBJECT('label','About','href','/about'), JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','CONTENT','props', JSON_OBJECT('title','A modern approach','paragraphs', JSON_ARRAY('We combine local knowledge with pricing analytics.','Communication and transparency come standard.')),'styles', JSON_OBJECT('width','md')),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© Skyline Realty'),'styles', JSON_OBJECT('variant','dark'))
        )
      ),
      JSON_OBJECT(
        'name', 'Contact',
        'path', '/contact',
        'meta', JSON_OBJECT('title','Contact - Skyline','description','Get in touch'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','Skyline Realty','links', JSON_ARRAY(JSON_OBJECT('label','Listings','href','/'), JSON_OBJECT('label','About','href','/about'), JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','CONTACT_FORM','props', JSON_OBJECT('headline','Let’s find your place','fields', JSON_ARRAY('name','email','message')),'styles', JSON_OBJECT('layout','card')),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© Skyline Realty'),'styles', JSON_OBJECT('variant','dark'))
        )
      )
    )
  )
);

INSERT INTO templates (name, category, preview_image_url, structure_json)
VALUES
(
  'Atlas Logistics',
  'Logistics',
  NULL,
  JSON_OBJECT(
    'pages', JSON_ARRAY(
      JSON_OBJECT(
        'name', 'Home',
        'path', '/',
        'meta', JSON_OBJECT('title','Atlas Logistics','description','Reliable shipping and fulfillment.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','Atlas Logistics','links', JSON_ARRAY(JSON_OBJECT('label','Services','href','/'), JSON_OBJECT('label','About','href','/about'), JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','HERO','props', JSON_OBJECT('headline','Deliver faster, with fewer surprises.','subheadline','Freight, warehousing, and last-mile logistics with clear tracking.','primaryCta', JSON_OBJECT('label','Request a quote','href','/contact')),'styles', JSON_OBJECT('layout','split')),
          JSON_OBJECT('type','FEATURES','props', JSON_OBJECT('items', JSON_ARRAY(
            JSON_OBJECT('title','Freight','text','Road, air, and ocean options'),
            JSON_OBJECT('title','Warehousing','text','Secure storage and fulfillment'),
            JSON_OBJECT('title','Tracking','text','Clear updates across every step')
          )),'styles', JSON_OBJECT('columns',3)),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© Atlas Logistics'),'styles', JSON_OBJECT('variant','dark'))
        )
      ),
      JSON_OBJECT(
        'name', 'About',
        'path', '/about',
        'meta', JSON_OBJECT('title','About - Atlas','description','Our network'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','Atlas Logistics','links', JSON_ARRAY(JSON_OBJECT('label','Services','href','/'), JSON_OBJECT('label','About','href','/about'), JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','CONTENT','props', JSON_OBJECT('title','A dependable network','paragraphs', JSON_ARRAY('We partner with vetted carriers.','We optimize routes for speed and cost.')),'styles', JSON_OBJECT('width','md')),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© Atlas Logistics'),'styles', JSON_OBJECT('variant','dark'))
        )
      ),
      JSON_OBJECT(
        'name', 'Contact',
        'path', '/contact',
        'meta', JSON_OBJECT('title','Contact - Atlas','description','Get a quote'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','Atlas Logistics','links', JSON_ARRAY(JSON_OBJECT('label','Services','href','/'), JSON_OBJECT('label','About','href','/about'), JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','CONTACT_FORM','props', JSON_OBJECT('headline','Request a quote','fields', JSON_ARRAY('name','email','message')),'styles', JSON_OBJECT('layout','card')),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© Atlas Logistics'),'styles', JSON_OBJECT('variant','dark'))
        )
      )
    )
  )
);
