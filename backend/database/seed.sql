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
