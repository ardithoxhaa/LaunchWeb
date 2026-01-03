INSERT INTO roles (name)
 SELECT * FROM (
   SELECT 'USER' AS name
   UNION ALL
   SELECT 'ADMIN' AS name
 ) AS r
 WHERE NOT EXISTS (SELECT 1 FROM roles WHERE roles.name = r.name);

INSERT INTO templates (name, category, preview_image_url, structure_json)
VALUES
(
  'StrideWorks',
  'Sports',
  NULL,
  JSON_OBJECT(
    'designSystem', JSON_OBJECT(
      'colors', JSON_OBJECT('primary','#ffffff','secondary','#000000','background','#0a0a0a','surface','rgba(255,255,255,0.08)','text','rgba(255,255,255,0.92)','mutedText','rgba(255,255,255,0.72)'),
      'typography', JSON_OBJECT('fontFamily','"Helvetica Neue", Helvetica, Arial, sans-serif','baseFontSize',16,'lineHeight',1.45,'headingWeight',800,'bodyWeight',400),
      'spacing', JSON_OBJECT('sectionY',52,'containerX',18)
    ),
    'pages', JSON_ARRAY(
      JSON_OBJECT('name','Home','path','/','meta', JSON_OBJECT('title','StrideWorks','description','Adidas-like performance brand with clean black/white identity and drops.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','ADVANCED_NAVBAR','props', JSON_OBJECT('logoText','StrideWorks','showSearch',TRUE,'searchPlaceholder','Search gear…',
            'links', JSON_ARRAY(JSON_OBJECT('label','Collections','href','/collections'),JSON_OBJECT('label','Stories','href','/stories'),JSON_OBJECT('label','Plans','href','/plans'),JSON_OBJECT('label','FAQ','href','/faq')),
            'ctas', JSON_ARRAY(JSON_OBJECT('label','Shop','href','/collections','variant','primary'))), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','HERO','props', JSON_OBJECT('headline','Built for speed. Styled for life.','subheadline','A modern performance brand layout with editable sections and brand tokens.',
            'primaryCta', JSON_OBJECT('label','Explore collections','href','/collections')),'styles', JSON_OBJECT('layout','split')),
          JSON_OBJECT('type','PRODUCT_GRID','props', JSON_OBJECT('headline','New season','subheadline','Drop-ready product grid.','cta', JSON_OBJECT('label','Shop all','href','/collections'),
            'products', JSON_ARRAY(
              JSON_OBJECT('name','Sprint Trainer','description','Responsive cushioning','price','€109','badge','New','imageUrl','', 'cta', JSON_OBJECT('label','Buy','href','/contact')),
              JSON_OBJECT('name','Tech Track Top','description','Light + structured','price','€79','badge',NULL,'imageUrl','', 'cta', JSON_OBJECT('label','Buy','href','/contact')),
              JSON_OBJECT('name','Performance Shorts','description','Breathable liner','price','€45','badge','Best seller','imageUrl','', 'cta', JSON_OBJECT('label','Buy','href','/contact')),
              JSON_OBJECT('name','Everyday Cap','description','Clean logo hit','price','€25','badge',NULL,'imageUrl','', 'cta', JSON_OBJECT('label','Buy','href','/contact'))
            )
          ), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','STATS_CTA','props', JSON_OBJECT('headline','Performance you can measure','subheadline','Use stats + CTA to mimic big-brand landing structure.',
            'primaryCta', JSON_OBJECT('label','Join the club','href','/plans'),
            'items', JSON_ARRAY(JSON_OBJECT('value','24/7','label','support'),JSON_OBJECT('value','48h','label','shipping options'),JSON_OBJECT('value','30 days','label','returns'))
          ), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FOOTER_LINKS','props', JSON_OBJECT('brand','StrideWorks','description','A black/white performance brand template.','columns', JSON_ARRAY(
            JSON_OBJECT('title','Shop','links', JSON_ARRAY(JSON_OBJECT('label','Collections','href','/collections'))),
            JSON_OBJECT('title','Stories','links', JSON_ARRAY(JSON_OBJECT('label','Stories','href','/stories'))),
            JSON_OBJECT('title','Support','links', JSON_ARRAY(JSON_OBJECT('label','FAQ','href','/faq'),JSON_OBJECT('label','Contact','href','/contact')))
          )), 'styles', JSON_OBJECT())
        )
      ),
      JSON_OBJECT('name','Collections','path','/collections','meta', JSON_OBJECT('title','Collections - StrideWorks','description','Category filtering and catalog feel.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','ADVANCED_NAVBAR','props', JSON_OBJECT('logoText','StrideWorks','showSearch',TRUE,'links', JSON_ARRAY(JSON_OBJECT('label','Collections','href','/collections'),JSON_OBJECT('label','Stories','href','/stories'),JSON_OBJECT('label','Plans','href','/plans'),JSON_OBJECT('label','FAQ','href','/faq')),
            'ctas', JSON_ARRAY(JSON_OBJECT('label','Shop','href','/collections','variant','primary'))), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FILTER_TABS','props', JSON_OBJECT('headline','Collections','subheadline','Filter a catalog — realistic store browsing.','defaultTab','all',
            'tabs', JSON_ARRAY(JSON_OBJECT('label','All','value','all'),JSON_OBJECT('label','Shoes','value','shoes'),JSON_OBJECT('label','Apparel','value','apparel'),JSON_OBJECT('label','Accessories','value','accessories')),
            'products', JSON_ARRAY(
              JSON_OBJECT('name','Daily Runner','description','Neutral trainer','price','€99','badge',NULL,'imageUrl','', 'categories', JSON_ARRAY('shoes'), 'cta', JSON_OBJECT('label','View','href','/contact')),
              JSON_OBJECT('name','Warmup Hoodie','description','Heavyweight','price','€75','badge','New','imageUrl','', 'categories', JSON_ARRAY('apparel'), 'cta', JSON_OBJECT('label','View','href','/contact')),
              JSON_OBJECT('name','Crew Socks','description','3-pack','price','€12','badge',NULL,'imageUrl','', 'categories', JSON_ARRAY('accessories'), 'cta', JSON_OBJECT('label','View','href','/contact'))
            )
          ), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FOOTER_LINKS','props', JSON_OBJECT('brand','StrideWorks','description','Collections feel like a real shop page.','columns', JSON_ARRAY(
            JSON_OBJECT('title','Support','links', JSON_ARRAY(JSON_OBJECT('label','FAQ','href','/faq'))),
            JSON_OBJECT('title','Company','links', JSON_ARRAY(JSON_OBJECT('label','About','href','/about'))),
            JSON_OBJECT('title','Legal','links', JSON_ARRAY(JSON_OBJECT('label','Terms','href','/terms')))
          )), 'styles', JSON_OBJECT())
        )
      ),
      JSON_OBJECT('name','Stories','path','/stories','meta', JSON_OBJECT('title','Stories - StrideWorks','description','Campaigns, athletes, and releases.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','StrideWorks','links', JSON_ARRAY(JSON_OBJECT('label','Collections','href','/collections'),JSON_OBJECT('label','Stories','href','/stories'),JSON_OBJECT('label','Plans','href','/plans'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','CARDS','props', JSON_OBJECT('cards', JSON_ARRAY(
            JSON_OBJECT('title','Drop build','text','Behind the scenes: from concept to launch.','cta', JSON_OBJECT('label','Read','href','/contact')),
            JSON_OBJECT('title','Athlete notes','text','Training stories and routines.','cta', JSON_OBJECT('label','Read','href','/contact')),
            JSON_OBJECT('title','Community','text','Events and run clubs in your city.','cta', JSON_OBJECT('label','Read','href','/contact'))
          )), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FOOTER_LINKS','props', JSON_OBJECT('brand','StrideWorks','description','Stories add branded depth.','columns', JSON_ARRAY(
            JSON_OBJECT('title','Shop','links', JSON_ARRAY(JSON_OBJECT('label','Collections','href','/collections'))),
            JSON_OBJECT('title','Support','links', JSON_ARRAY(JSON_OBJECT('label','Contact','href','/contact'))),
            JSON_OBJECT('title','Legal','links', JSON_ARRAY(JSON_OBJECT('label','Privacy','href','/privacy')))
          )), 'styles', JSON_OBJECT())
        )
      ),
      JSON_OBJECT('name','Plans','path','/plans','meta', JSON_OBJECT('title','Plans - StrideWorks','description','Membership / perks page.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','StrideWorks','links', JSON_ARRAY(JSON_OBJECT('label','Plans','href','/plans'),JSON_OBJECT('label','FAQ','href','/faq'),JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','PRICING','props', JSON_OBJECT('plans', JSON_ARRAY(
            JSON_OBJECT('name','Member','price','€9','period','/mo','features', JSON_ARRAY('Early drops','Free returns','Member support')),
            JSON_OBJECT('name','Plus','price','€19','period','/mo','features', JSON_ARRAY('Exclusive products','Priority shipping','Discounts')),
            JSON_OBJECT('name','Elite','price','€39','period','/mo','features', JSON_ARRAY('Limited releases','VIP support','Invite-only events'))
          )), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© StrideWorks'),'styles', JSON_OBJECT('variant','dark'))
        )
      ),
      JSON_OBJECT('name','FAQ','path','/faq','meta', JSON_OBJECT('title','FAQ - StrideWorks','description','Shipping, returns, sizing.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','StrideWorks','links', JSON_ARRAY(JSON_OBJECT('label','Collections','href','/collections'),JSON_OBJECT('label','Plans','href','/plans'),JSON_OBJECT('label','FAQ','href','/faq'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','FAQ','props', JSON_OBJECT('headline','Support','subheadline','Answer common questions like a real brand.','items', JSON_ARRAY(
            JSON_OBJECT('q','How do returns work?','a','Returns within 30 days on unworn items.'),
            JSON_OBJECT('q','Do you ship internationally?','a','Yes. Options vary by region.'),
            JSON_OBJECT('q','How do I pick my size?','a','Use the size chart and compare to an item you own.')
          )), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© StrideWorks'),'styles', JSON_OBJECT('variant','dark'))
        )
      )
    )
  )
);
INSERT INTO templates (name, category, preview_image_url, structure_json)
VALUES
(
  'MonoTech',
  'Software',
  NULL,
  JSON_OBJECT(
    'designSystem', JSON_OBJECT(
      'colors', JSON_OBJECT('primary','#ffffff','secondary','#94a3b8','background','#0b0b0c','surface','rgba(255,255,255,0.05)','text','rgba(255,255,255,0.92)','mutedText','rgba(255,255,255,0.70)'),
      'typography', JSON_OBJECT('fontFamily','-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif','baseFontSize',16,'lineHeight',1.5,'headingWeight',700,'bodyWeight',400),
      'spacing', JSON_OBJECT('sectionY',60,'containerX',20)
    ),
    'pages', JSON_ARRAY(
      JSON_OBJECT('name','Home','path','/','meta', JSON_OBJECT('title','MonoTech','description','Apple-like minimal product marketing with clean spacing and typography.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','MonoTech','links', JSON_ARRAY(JSON_OBJECT('label','Products','href','/products'),JSON_OBJECT('label','Plans','href','/plans'),JSON_OBJECT('label','Support','href','/support'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','HERO','props', JSON_OBJECT('headline','Simple. Powerful. Built to last.','subheadline','A clean product marketing template with global design tokens.','primaryCta', JSON_OBJECT('label','Explore products','href','/products')),'styles', JSON_OBJECT('layout','split')),
          JSON_OBJECT('type','FEATURES','props', JSON_OBJECT('items', JSON_ARRAY(
            JSON_OBJECT('title','Design system','text','Global typography, colors, and spacing.'),
            JSON_OBJECT('title','Editable sections','text','Per-section padding, margin, background.'),
            JSON_OBJECT('title','Versioning','text','Restore previous snapshots safely.')
          )), 'styles', JSON_OBJECT('columns',3)),
          JSON_OBJECT('type','GALLERY','props', JSON_OBJECT('images', JSON_ARRAY(
            'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?auto=format&fit=crop&w=1200&q=60',
            'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=60',
            'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=60'
          )), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FOOTER_LINKS','props', JSON_OBJECT('brand','MonoTech','description','Minimal product brand template.','columns', JSON_ARRAY(
            JSON_OBJECT('title','Products','links', JSON_ARRAY(JSON_OBJECT('label','Products','href','/products'))),
            JSON_OBJECT('title','Support','links', JSON_ARRAY(JSON_OBJECT('label','Support','href','/support'),JSON_OBJECT('label','Contact','href','/contact'))),
            JSON_OBJECT('title','Legal','links', JSON_ARRAY(JSON_OBJECT('label','Privacy','href','/privacy'),JSON_OBJECT('label','Terms','href','/terms')))
          )), 'styles', JSON_OBJECT())
        )
      ),
      JSON_OBJECT('name','Products','path','/products','meta', JSON_OBJECT('title','Products - MonoTech','description','Product catalog / lineup.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','MonoTech','links', JSON_ARRAY(JSON_OBJECT('label','Products','href','/products'),JSON_OBJECT('label','Plans','href','/plans'),JSON_OBJECT('label','Support','href','/support'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','CARDS','props', JSON_OBJECT('cards', JSON_ARRAY(
            JSON_OBJECT('title','MonoBook','text','Lightweight laptop for creators.','cta', JSON_OBJECT('label','Learn more','href','/contact')),
            JSON_OBJECT('title','MonoPhone','text','Fast, secure, and simple.','cta', JSON_OBJECT('label','Learn more','href','/contact')),
            JSON_OBJECT('title','MonoPods','text','Immersive sound, clean design.','cta', JSON_OBJECT('label','Learn more','href','/contact'))
          )), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© MonoTech'),'styles', JSON_OBJECT('variant','dark'))
        )
      ),
      JSON_OBJECT('name','Plans','path','/plans','meta', JSON_OBJECT('title','Plans - MonoTech','description','AppleCare-like plans / subscriptions.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','MonoTech','links', JSON_ARRAY(JSON_OBJECT('label','Products','href','/products'),JSON_OBJECT('label','Plans','href','/plans'),JSON_OBJECT('label','Support','href','/support'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','PRICING','props', JSON_OBJECT('plans', JSON_ARRAY(
            JSON_OBJECT('name','Basic','price','€4.99','period','/mo','features', JSON_ARRAY('Email support','Updates','Standard coverage')),
            JSON_OBJECT('name','Plus','price','€9.99','period','/mo','features', JSON_ARRAY('Priority support','Extended coverage','Accidental damage')),
            JSON_OBJECT('name','Pro','price','€14.99','period','/mo','features', JSON_ARRAY('Express replacement','Phone support','Premium coverage'))
          )), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© MonoTech'),'styles', JSON_OBJECT('variant','dark'))
        )
      ),
      JSON_OBJECT('name','Support','path','/support','meta', JSON_OBJECT('title','Support - MonoTech','description','Help center.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','MonoTech','links', JSON_ARRAY(JSON_OBJECT('label','Support','href','/support'),JSON_OBJECT('label','Plans','href','/plans'),JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','FAQ','props', JSON_OBJECT('headline','Support','subheadline','Articles and FAQs you can customize.','items', JSON_ARRAY(
            JSON_OBJECT('q','How do I get started?','a','Edit this answer in the builder.'),
            JSON_OBJECT('q','Where do I manage my plan?','a','Link to /plans or your support flow.'),
            JSON_OBJECT('q','Can I change the design?','a','Yes — theme + per-section styling is editable.')
          )), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© MonoTech'),'styles', JSON_OBJECT('variant','dark'))
        )
      )
    )
  )
);
INSERT INTO templates (name, category, preview_image_url, structure_json)
VALUES
(
  'VoltDrive',
  'Automotive',
  NULL,
  JSON_OBJECT(
    'designSystem', JSON_OBJECT(
      'colors', JSON_OBJECT('primary','#ef4444','secondary','#ffffff','background','#0b0f17','surface','rgba(255,255,255,0.06)','text','rgba(255,255,255,0.92)','mutedText','rgba(255,255,255,0.70)'),
      'typography', JSON_OBJECT('fontFamily','Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif','baseFontSize',16,'lineHeight',1.5,'headingWeight',700,'bodyWeight',400),
      'spacing', JSON_OBJECT('sectionY',64,'containerX',18)
    ),
    'pages', JSON_ARRAY(
      JSON_OBJECT('name','Home','path','/','meta', JSON_OBJECT('title','VoltDrive','description','EV brand landing with specs, gallery, and plans.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','VoltDrive','links', JSON_ARRAY(JSON_OBJECT('label','Models','href','/models'),JSON_OBJECT('label','Plans','href','/plans'),JSON_OBJECT('label','FAQ','href','/faq'),JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','HERO','props', JSON_OBJECT('headline','Electric. Fast. Minimal.','subheadline','A premium EV landing with editable stats and pages.','primaryCta', JSON_OBJECT('label','View models','href','/models')),'styles', JSON_OBJECT('layout','split','buttonColor','#ef4444')),
          JSON_OBJECT('type','STATS_CTA','props', JSON_OBJECT('headline','Specs that sell','subheadline','Use stats blocks to mimic real product launch pages.','primaryCta', JSON_OBJECT('label','Configure','href','/contact'),
            'items', JSON_ARRAY(JSON_OBJECT('value','3.2s','label','0–100 km/h'),JSON_OBJECT('value','520km','label','range'),JSON_OBJECT('value','15min','label','fast charge'))
          ), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','GALLERY','props', JSON_OBJECT('images', JSON_ARRAY(
            'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1200&q=60',
            'https://images.unsplash.com/photo-1549921296-3b4a4f0fd2a2?auto=format&fit=crop&w=1200&q=60',
            'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=60'
          )), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FOOTER_LINKS','props', JSON_OBJECT('brand','VoltDrive','description','EV launch template with plans + FAQ.','columns', JSON_ARRAY(
            JSON_OBJECT('title','Explore','links', JSON_ARRAY(JSON_OBJECT('label','Models','href','/models'))),
            JSON_OBJECT('title','Ownership','links', JSON_ARRAY(JSON_OBJECT('label','Plans','href','/plans'),JSON_OBJECT('label','FAQ','href','/faq'))),
            JSON_OBJECT('title','Support','links', JSON_ARRAY(JSON_OBJECT('label','Contact','href','/contact')))
          )), 'styles', JSON_OBJECT())
        )
      ),
      JSON_OBJECT('name','Models','path','/models','meta', JSON_OBJECT('title','Models - VoltDrive','description','Product lineup page.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','VoltDrive','links', JSON_ARRAY(JSON_OBJECT('label','Models','href','/models'),JSON_OBJECT('label','Plans','href','/plans'),JSON_OBJECT('label','FAQ','href','/faq'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','CARDS','props', JSON_OBJECT('cards', JSON_ARRAY(
            JSON_OBJECT('title','Model S','text','Performance sedan with long range.','cta', JSON_OBJECT('label','Configure','href','/contact')),
            JSON_OBJECT('title','Model X','text','SUV with premium interior.','cta', JSON_OBJECT('label','Configure','href','/contact')),
            JSON_OBJECT('title','Model C','text','Everyday EV built for value.','cta', JSON_OBJECT('label','Configure','href','/contact'))
          )), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© VoltDrive'),'styles', JSON_OBJECT('variant','dark'))
        )
      ),
      JSON_OBJECT('name','Plans','path','/plans','meta', JSON_OBJECT('title','Plans - VoltDrive','description','Financing / subscription plans.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','VoltDrive','links', JSON_ARRAY(JSON_OBJECT('label','Models','href','/models'),JSON_OBJECT('label','Plans','href','/plans'),JSON_OBJECT('label','FAQ','href','/faq'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','PRICING','props', JSON_OBJECT('plans', JSON_ARRAY(
            JSON_OBJECT('name','Standard','price','€399','period','/mo','features', JSON_ARRAY('Warranty','Roadside assist','Basic charging')),
            JSON_OBJECT('name','Plus','price','€599','period','/mo','features', JSON_ARRAY('Extended warranty','Priority support','Fast charging')),
            JSON_OBJECT('name','Performance','price','€799','period','/mo','features', JSON_ARRAY('Premium support','Best charging','Upgrades'))
          )), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© VoltDrive'),'styles', JSON_OBJECT('variant','dark'))
        )
      ),
      JSON_OBJECT('name','FAQ','path','/faq','meta', JSON_OBJECT('title','FAQ - VoltDrive','description','Charging, warranty, and delivery.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','VoltDrive','links', JSON_ARRAY(JSON_OBJECT('label','Models','href','/models'),JSON_OBJECT('label','Plans','href','/plans'),JSON_OBJECT('label','FAQ','href','/faq'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','FAQ','props', JSON_OBJECT('headline','FAQ','subheadline','Ownership questions.','items', JSON_ARRAY(
            JSON_OBJECT('q','How does charging work?','a','Explain home + fast charging options here.'),
            JSON_OBJECT('q','What warranty is included?','a','Customize warranty info for your business.'),
            JSON_OBJECT('q','Can I edit the whole site?','a','Yes — global theme + per-section styles.')
          )), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© VoltDrive'),'styles', JSON_OBJECT('variant','dark'))
        )
      )
    )
  )
);
INSERT INTO templates (name, category, preview_image_url, structure_json)
VALUES
(
  'StayAtlas',
  'Travel',
  NULL,
  JSON_OBJECT(
    'designSystem', JSON_OBJECT(
      'colors', JSON_OBJECT('primary','#ff385c','secondary','#ffffff','background','#0b1220','surface','rgba(255,255,255,0.06)','text','rgba(255,255,255,0.92)','mutedText','rgba(255,255,255,0.70)'),
      'typography', JSON_OBJECT('fontFamily','Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif','baseFontSize',16,'lineHeight',1.55,'headingWeight',700,'bodyWeight',400),
      'spacing', JSON_OBJECT('sectionY',56,'containerX',18)
    ),
    'pages', JSON_ARRAY(
      JSON_OBJECT('name','Home','path','/','meta', JSON_OBJECT('title','StayAtlas','description','Airbnb-like travel: destinations, search feel, and trust patterns.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','ADVANCED_NAVBAR','props', JSON_OBJECT('logoText','StayAtlas','showSearch',TRUE,'searchPlaceholder','Search destinations…',
            'links', JSON_ARRAY(JSON_OBJECT('label','Destinations','href','/destinations'),JSON_OBJECT('label','Stories','href','/stories'),JSON_OBJECT('label','Pricing','href','/pricing'),JSON_OBJECT('label','FAQ','href','/faq')),
            'ctas', JSON_ARRAY(JSON_OBJECT('label','List your place','href','/contact','variant','primary'))), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','HERO','props', JSON_OBJECT('headline','Find a place that feels right.','subheadline','Travel landing with destinations, stories, and pricing pages.','primaryCta', JSON_OBJECT('label','Explore destinations','href','/destinations')),'styles', JSON_OBJECT('layout','split')),
          JSON_OBJECT('type','GALLERY','props', JSON_OBJECT('images', JSON_ARRAY(
            'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=60',
            'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=60',
            'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=60'
          )), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','CARDS','props', JSON_OBJECT('cards', JSON_ARRAY(
            JSON_OBJECT('title','City escapes','text','Boutique apartments + walkable neighborhoods.','cta', JSON_OBJECT('label','Browse','href','/destinations')),
            JSON_OBJECT('title','Cabin weekends','text','Cozy stays with views and quiet.','cta', JSON_OBJECT('label','Browse','href','/destinations')),
            JSON_OBJECT('title','Beach resets','text','Sun, water, and local food.','cta', JSON_OBJECT('label','Browse','href','/destinations'))
          )), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FOOTER_LINKS','props', JSON_OBJECT('brand','StayAtlas','description','Travel marketplace template.','columns', JSON_ARRAY(
            JSON_OBJECT('title','Explore','links', JSON_ARRAY(JSON_OBJECT('label','Destinations','href','/destinations'))),
            JSON_OBJECT('title','Company','links', JSON_ARRAY(JSON_OBJECT('label','Stories','href','/stories'),JSON_OBJECT('label','Contact','href','/contact'))),
            JSON_OBJECT('title','Support','links', JSON_ARRAY(JSON_OBJECT('label','FAQ','href','/faq')))
          )), 'styles', JSON_OBJECT())
        )
      ),
      JSON_OBJECT('name','Destinations','path','/destinations','meta', JSON_OBJECT('title','Destinations - StayAtlas','description','Browse stays and destinations.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','ADVANCED_NAVBAR','props', JSON_OBJECT('logoText','StayAtlas','showSearch',TRUE,'links', JSON_ARRAY(JSON_OBJECT('label','Destinations','href','/destinations'),JSON_OBJECT('label','Stories','href','/stories'),JSON_OBJECT('label','Pricing','href','/pricing'),JSON_OBJECT('label','FAQ','href','/faq')),
            'ctas', JSON_ARRAY(JSON_OBJECT('label','List your place','href','/contact','variant','primary'))), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','CARDS','props', JSON_OBJECT('cards', JSON_ARRAY(
            JSON_OBJECT('title','Lisbon','text','Sunny streets + ocean air.','cta', JSON_OBJECT('label','Get details','href','/contact')),
            JSON_OBJECT('title','Berlin','text','Culture, cafes, nightlife.','cta', JSON_OBJECT('label','Get details','href','/contact')),
            JSON_OBJECT('title','Oslo','text','Minimal design + fjords.','cta', JSON_OBJECT('label','Get details','href','/contact'))
          )), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© StayAtlas'),'styles', JSON_OBJECT('variant','dark'))
        )
      ),
      JSON_OBJECT('name','Pricing','path','/pricing','meta', JSON_OBJECT('title','Pricing - StayAtlas','description','Host plans / fees.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','StayAtlas','links', JSON_ARRAY(JSON_OBJECT('label','Destinations','href','/destinations'),JSON_OBJECT('label','Pricing','href','/pricing'),JSON_OBJECT('label','FAQ','href','/faq'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','PRICING','props', JSON_OBJECT('plans', JSON_ARRAY(
            JSON_OBJECT('name','Starter','price','€0','period','/listing','features', JSON_ARRAY('Basic listing','Email support','Standard visibility')),
            JSON_OBJECT('name','Plus','price','€19','period','/mo','features', JSON_ARRAY('Better placement','Priority support','Flexible rules')),
            JSON_OBJECT('name','Pro','price','€49','period','/mo','features', JSON_ARRAY('Top placement','Dedicated support','Advanced tools'))
          )), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© StayAtlas'),'styles', JSON_OBJECT('variant','dark'))
        )
      ),
      JSON_OBJECT('name','Stories','path','/stories','meta', JSON_OBJECT('title','Stories - StayAtlas','description','Travel stories & guides.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','StayAtlas','links', JSON_ARRAY(JSON_OBJECT('label','Stories','href','/stories'),JSON_OBJECT('label','Destinations','href','/destinations'),JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','CARDS','props', JSON_OBJECT('cards', JSON_ARRAY(
            JSON_OBJECT('title','Weekend guide','text','How to plan a 48h reset trip.','cta', JSON_OBJECT('label','Read','href','/contact')),
            JSON_OBJECT('title','Host story','text','How hosts create great stays.','cta', JSON_OBJECT('label','Read','href','/contact')),
            JSON_OBJECT('title','Neighborhood picks','text','Local favorites and hidden gems.','cta', JSON_OBJECT('label','Read','href','/contact'))
          )), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© StayAtlas'),'styles', JSON_OBJECT('variant','dark'))
        )
      ),
      JSON_OBJECT('name','FAQ','path','/faq','meta', JSON_OBJECT('title','FAQ - StayAtlas','description','Booking, hosts, refunds.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','StayAtlas','links', JSON_ARRAY(JSON_OBJECT('label','FAQ','href','/faq'),JSON_OBJECT('label','Pricing','href','/pricing'),JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','FAQ','props', JSON_OBJECT('headline','FAQ','subheadline','Common questions.','items', JSON_ARRAY(
            JSON_OBJECT('q','How do cancellations work?','a','Customize cancellation policy per business.'),
            JSON_OBJECT('q','How do hosts get paid?','a','Explain payout schedule and fees.'),
            JSON_OBJECT('q','Can I edit the templates?','a','Yes — theme + spacing + per-section background controls.')
          )), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© StayAtlas'),'styles', JSON_OBJECT('variant','dark'))
        )
      )
    )
  )
);
INSERT INTO templates (name, category, preview_image_url, structure_json)
VALUES
(
  'Blackline Studio',
  'Agency',
  NULL,
  JSON_OBJECT(
    'designSystem', JSON_OBJECT(
      'colors', JSON_OBJECT('primary','#a855f7','secondary','#ffffff','background','#070a12','surface','rgba(255,255,255,0.06)','text','rgba(255,255,255,0.92)','mutedText','rgba(255,255,255,0.70)'),
      'typography', JSON_OBJECT('fontFamily','Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif','baseFontSize',16,'lineHeight',1.55,'headingWeight',700,'bodyWeight',400),
      'spacing', JSON_OBJECT('sectionY',64,'containerX',18)
    ),
    'pages', JSON_ARRAY(
      JSON_OBJECT('name','Home','path','/','meta', JSON_OBJECT('title','Blackline Studio','description','Premium agency template with portfolio, services, careers, and contact.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','Blackline','links', JSON_ARRAY(JSON_OBJECT('label','Work','href','/work'),JSON_OBJECT('label','Services','href','/services'),JSON_OBJECT('label','Careers','href','/careers'),JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','HERO','props', JSON_OBJECT('headline','Design that ships.','subheadline','Senior craft, clear milestones, high conversion.','primaryCta', JSON_OBJECT('label','View work','href','/work')),'styles', JSON_OBJECT('layout','split')),
          JSON_OBJECT('type','GALLERY','props', JSON_OBJECT('images', JSON_ARRAY(
            'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1200&q=60',
            'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=60',
            'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1200&q=60'
          )), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','TESTIMONIALS','props', JSON_OBJECT('headline','Trusted by teams','subheadline','Real quotes that you can edit.','items', JSON_ARRAY(
            JSON_OBJECT('name','Iris','role','CEO','quote','Fast, sharp, and extremely organized.'),
            JSON_OBJECT('name','Ben','role','PM','quote','Clear milestones and excellent execution.'),
            JSON_OBJECT('name','Hana','role','Founder','quote','They nailed the brand direction.')
          )), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FOOTER_LINKS','props', JSON_OBJECT('brand','Blackline','description','Agency template with portfolio depth.','columns', JSON_ARRAY(
            JSON_OBJECT('title','Work','links', JSON_ARRAY(JSON_OBJECT('label','Case studies','href','/work'))),
            JSON_OBJECT('title','Services','links', JSON_ARRAY(JSON_OBJECT('label','Services','href','/services'))),
            JSON_OBJECT('title','Company','links', JSON_ARRAY(JSON_OBJECT('label','Careers','href','/careers'),JSON_OBJECT('label','Contact','href','/contact')))
          )), 'styles', JSON_OBJECT())
        )
      ),
      JSON_OBJECT('name','Work','path','/work','meta', JSON_OBJECT('title','Work - Blackline','description','Case studies gallery.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','Blackline','links', JSON_ARRAY(JSON_OBJECT('label','Work','href','/work'),JSON_OBJECT('label','Services','href','/services'),JSON_OBJECT('label','Careers','href','/careers'),JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','CARDS','props', JSON_OBJECT('cards', JSON_ARRAY(
            JSON_OBJECT('title','Case study: SaaS redesign','text','Conversion-focused landing + design system.','cta', JSON_OBJECT('label','Open','href','/contact')),
            JSON_OBJECT('title','Case study: eCom refresh','text','Merch UI patterns and brand tokens.','cta', JSON_OBJECT('label','Open','href','/contact')),
            JSON_OBJECT('title','Case study: platform UI','text','Component library and rollout.','cta', JSON_OBJECT('label','Open','href','/contact'))
          )), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© Blackline Studio'),'styles', JSON_OBJECT('variant','dark'))
        )
      ),
      JSON_OBJECT('name','Services','path','/services','meta', JSON_OBJECT('title','Services - Blackline','description','What we do.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','Blackline','links', JSON_ARRAY(JSON_OBJECT('label','Work','href','/work'),JSON_OBJECT('label','Services','href','/services'),JSON_OBJECT('label','Careers','href','/careers'),JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','FEATURES','props', JSON_OBJECT('items', JSON_ARRAY(
            JSON_OBJECT('title','Brand systems','text','Tokens, typography, and scalable components.'),
            JSON_OBJECT('title','Web experiences','text','Fast UI, clean layout, real conversion flows.'),
            JSON_OBJECT('title','Product design','text','Flows, UX, and delivery-ready UI kits.')
          )), 'styles', JSON_OBJECT('columns',3)),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© Blackline Studio'),'styles', JSON_OBJECT('variant','dark'))
        )
      ),
      JSON_OBJECT('name','Careers','path','/careers','meta', JSON_OBJECT('title','Careers - Blackline','description','Join the team.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','Blackline','links', JSON_ARRAY(JSON_OBJECT('label','Work','href','/work'),JSON_OBJECT('label','Careers','href','/careers'),JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','CARDS','props', JSON_OBJECT('cards', JSON_ARRAY(
            JSON_OBJECT('title','Product Designer','text','Systems thinking + high craft.','cta', JSON_OBJECT('label','Apply','href','/contact')),
            JSON_OBJECT('title','Frontend Engineer','text','React + performance mindset.','cta', JSON_OBJECT('label','Apply','href','/contact')),
            JSON_OBJECT('title','PM','text','Clear scopes + shipping culture.','cta', JSON_OBJECT('label','Apply','href','/contact'))
          )), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© Blackline Studio'),'styles', JSON_OBJECT('variant','dark'))
        )
      ),
      JSON_OBJECT('name','Contact','path','/contact','meta', JSON_OBJECT('title','Contact - Blackline','description','Start a project.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','Blackline','links', JSON_ARRAY(JSON_OBJECT('label','Work','href','/work'),JSON_OBJECT('label','Services','href','/services'),JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','CONTACT_FORM','props', JSON_OBJECT('headline','Start a project','fields', JSON_ARRAY('name','email','message')),'styles', JSON_OBJECT('layout','card')),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© Blackline Studio'),'styles', JSON_OBJECT('variant','dark'))
        )
      )
    )
  )
);
INSERT INTO templates (name, category, preview_image_url, structure_json)
VALUES
(
  'ArcBank',
  'Finance',
  NULL,
  JSON_OBJECT(
    'designSystem', JSON_OBJECT(
      'colors', JSON_OBJECT('primary','#0ea5e9','secondary','#22c55e','background','#07111f','surface','rgba(255,255,255,0.06)','text','rgba(255,255,255,0.92)','mutedText','rgba(255,255,255,0.70)'),
      'typography', JSON_OBJECT('fontFamily','"Segoe UI", system-ui, -apple-system, Roboto, Arial, sans-serif','baseFontSize',16,'lineHeight',1.55,'headingWeight',700,'bodyWeight',400),
      'spacing', JSON_OBJECT('sectionY',56,'containerX',18)
    ),
    'pages', JSON_ARRAY(
      JSON_OBJECT('name','Home','path','/','meta', JSON_OBJECT('title','ArcBank','description','Modern fintech banking marketing with pricing, help, and trust patterns.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','ArcBank','links', JSON_ARRAY(JSON_OBJECT('label','Plans','href','/plans'),JSON_OBJECT('label','Security','href','/security'),JSON_OBJECT('label','Help','href','/help'),JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','HERO','props', JSON_OBJECT('headline','Banking, simplified.','subheadline','Clear plans, transparent fees, and security-first design.','primaryCta', JSON_OBJECT('label','View plans','href','/plans')),'styles', JSON_OBJECT('layout','split')),
          JSON_OBJECT('type','STATS_CTA','props', JSON_OBJECT('headline','Built for trust','subheadline','Use editable stats to look enterprise.','primaryCta', JSON_OBJECT('label','Open an account','href','/contact'),
            'items', JSON_ARRAY(JSON_OBJECT('value','0€','label','hidden fees'),JSON_OBJECT('value','24/7','label','support'),JSON_OBJECT('value','2FA','label','security'))
          ), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','TESTIMONIALS','props', JSON_OBJECT('headline','Trusted by customers','subheadline','Edit the quotes for your brand.','items', JSON_ARRAY(
            JSON_OBJECT('name','Nina','role','Founder','quote','Onboarding was fast and clear.'),
            JSON_OBJECT('name','Omar','role','Freelancer','quote','Great experience and transparent pricing.'),
            JSON_OBJECT('name','Maya','role','Team lead','quote','Support is responsive and helpful.')
          )), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FOOTER_LINKS','props', JSON_OBJECT('brand','ArcBank','description','Fintech template with plans and support pages.','columns', JSON_ARRAY(
            JSON_OBJECT('title','Product','links', JSON_ARRAY(JSON_OBJECT('label','Plans','href','/plans'),JSON_OBJECT('label','Security','href','/security'))),
            JSON_OBJECT('title','Support','links', JSON_ARRAY(JSON_OBJECT('label','Help','href','/help'),JSON_OBJECT('label','Contact','href','/contact'))),
            JSON_OBJECT('title','Legal','links', JSON_ARRAY(JSON_OBJECT('label','Privacy','href','/privacy'),JSON_OBJECT('label','Terms','href','/terms')))
          )), 'styles', JSON_OBJECT())
        )
      ),
      JSON_OBJECT('name','Plans','path','/plans','meta', JSON_OBJECT('title','Plans - ArcBank','description','Account tiers and perks.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','ArcBank','links', JSON_ARRAY(JSON_OBJECT('label','Plans','href','/plans'),JSON_OBJECT('label','Help','href','/help'),JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','PRICING','props', JSON_OBJECT('plans', JSON_ARRAY(
            JSON_OBJECT('name','Basic','price','€0','period','/mo','features', JSON_ARRAY('Virtual card','Budgeting','Standard support')),
            JSON_OBJECT('name','Plus','price','€9','period','/mo','features', JSON_ARRAY('Cashback','Priority support','Extra cards')),
            JSON_OBJECT('name','Metal','price','€19','period','/mo','features', JSON_ARRAY('Travel perks','Premium support','Higher limits'))
          )), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© ArcBank'),'styles', JSON_OBJECT('variant','dark'))
        )
      ),
      JSON_OBJECT('name','Security','path','/security','meta', JSON_OBJECT('title','Security - ArcBank','description','Security info page.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','ArcBank','links', JSON_ARRAY(JSON_OBJECT('label','Security','href','/security'),JSON_OBJECT('label','Help','href','/help'),JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','CONTENT','props', JSON_OBJECT('title','Security-first','paragraphs', JSON_ARRAY(
            'Explain encryption, access controls, and account protection.',
            'Edit this page to match your compliance and policy requirements.'
          )), 'styles', JSON_OBJECT('width','md')),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© ArcBank'),'styles', JSON_OBJECT('variant','dark'))
        )
      ),
      JSON_OBJECT('name','Help','path','/help','meta', JSON_OBJECT('title','Help - ArcBank','description','Support center.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','ArcBank','links', JSON_ARRAY(JSON_OBJECT('label','Help','href','/help'),JSON_OBJECT('label','Plans','href','/plans'),JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','FAQ','props', JSON_OBJECT('headline','Help center','subheadline','Common questions.','items', JSON_ARRAY(
            JSON_OBJECT('q','How do fees work?','a','Explain pricing and fees here.'),
            JSON_OBJECT('q','How do I reset my password?','a','Describe recovery flow and security steps.'),
            JSON_OBJECT('q','Can I customize this?','a','Yes — theme tokens and per-section styles are editable.')
          )), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© ArcBank'),'styles', JSON_OBJECT('variant','dark'))
        )
      )
    )
  )
);
INSERT INTO templates (name, category, preview_image_url, structure_json)
VALUES
(
  'Cedar & Co.',
  'Restaurant',
  NULL,
  JSON_OBJECT(
    'designSystem', JSON_OBJECT(
      'colors', JSON_OBJECT('primary','#f59e0b','secondary','#ffffff','background','#0b0f17','surface','rgba(255,255,255,0.06)','text','rgba(255,255,255,0.92)','mutedText','rgba(255,255,255,0.70)'),
      'typography', JSON_OBJECT('fontFamily','"Georgia", "Times New Roman", serif','baseFontSize',16,'lineHeight',1.65,'headingWeight',700,'bodyWeight',400),
      'spacing', JSON_OBJECT('sectionY',64,'containerX',18)
    ),
    'pages', JSON_ARRAY(
      JSON_OBJECT('name','Home','path','/','meta', JSON_OBJECT('title','Cedar & Co.','description','Restaurant template with menu, locations, reservations, and FAQ.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','Cedar & Co.','links', JSON_ARRAY(JSON_OBJECT('label','Menu','href','/menu'),JSON_OBJECT('label','Locations','href','/locations'),JSON_OBJECT('label','Reservations','href','/contact'),JSON_OBJECT('label','FAQ','href','/faq'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','HERO','props', JSON_OBJECT('headline','Brunch that feels like a ritual.','subheadline','Seasonal plates, artisan coffee, and a warm space to slow down.','primaryCta', JSON_OBJECT('label','View menu','href','/menu')),'styles', JSON_OBJECT('layout','split')),
          JSON_OBJECT('type','CARDS','props', JSON_OBJECT('cards', JSON_ARRAY(
            JSON_OBJECT('title','Signature plates','text','Seasonal ingredients, simple execution.','cta', JSON_OBJECT('label','See menu','href','/menu')),
            JSON_OBJECT('title','Coffee & pastry','text','Small-batch roasts + daily bakes.','cta', JSON_OBJECT('label','See menu','href','/menu')),
            JSON_OBJECT('title','Catering','text','Events, trays, and custom orders.','cta', JSON_OBJECT('label','Request','href','/contact'))
          )), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','GALLERY','props', JSON_OBJECT('images', JSON_ARRAY(
            'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=1200&q=60',
            'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=1200&q=60',
            'https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=1200&q=60'
          )), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FOOTER_LINKS','props', JSON_OBJECT('brand','Cedar & Co.','description','Restaurant template with menu + locations.','columns', JSON_ARRAY(
            JSON_OBJECT('title','Visit','links', JSON_ARRAY(JSON_OBJECT('label','Locations','href','/locations'))),
            JSON_OBJECT('title','Menu','links', JSON_ARRAY(JSON_OBJECT('label','Menu','href','/menu'))),
            JSON_OBJECT('title','Support','links', JSON_ARRAY(JSON_OBJECT('label','FAQ','href','/faq'),JSON_OBJECT('label','Reservations','href','/contact')))
          )), 'styles', JSON_OBJECT())
        )
      ),
      JSON_OBJECT('name','Menu','path','/menu','meta', JSON_OBJECT('title','Menu - Cedar & Co.','description','Menu sections page.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','Cedar & Co.','links', JSON_ARRAY(JSON_OBJECT('label','Menu','href','/menu'),JSON_OBJECT('label','Locations','href','/locations'),JSON_OBJECT('label','Reservations','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','PRICING','props', JSON_OBJECT('plans', JSON_ARRAY(
            JSON_OBJECT('name','Brunch Set','price','€19','period','/person','features', JSON_ARRAY('Main + drink','Daily pastry','Seasonal sides')),
            JSON_OBJECT('name','Tasting','price','€39','period','/person','features', JSON_ARRAY('Chef selection','3 courses','Reservation')),
            JSON_OBJECT('name','Catering','price','€199','period','/event','features', JSON_ARRAY('Tray options','Setup','Custom menu'))
          )), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© Cedar & Co.'),'styles', JSON_OBJECT('variant','dark'))
        )
      ),
      JSON_OBJECT('name','Locations','path','/locations','meta', JSON_OBJECT('title','Locations - Cedar & Co.','description','Find a location.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','Cedar & Co.','links', JSON_ARRAY(JSON_OBJECT('label','Locations','href','/locations'),JSON_OBJECT('label','Menu','href','/menu'),JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','CARDS','props', JSON_OBJECT('cards', JSON_ARRAY(
            JSON_OBJECT('title','Downtown','text','Mon–Sun • 8:00–17:00','cta', JSON_OBJECT('label','Reserve','href','/contact')),
            JSON_OBJECT('title','Riverside','text','Mon–Sat • 9:00–18:00','cta', JSON_OBJECT('label','Reserve','href','/contact')),
            JSON_OBJECT('title','Old Town','text','Wed–Sun • 8:00–16:00','cta', JSON_OBJECT('label','Reserve','href','/contact'))
          )), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© Cedar & Co.'),'styles', JSON_OBJECT('variant','dark'))
        )
      ),
      JSON_OBJECT('name','FAQ','path','/faq','meta', JSON_OBJECT('title','FAQ - Cedar & Co.','description','Reservations and catering.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','Cedar & Co.','links', JSON_ARRAY(JSON_OBJECT('label','FAQ','href','/faq'),JSON_OBJECT('label','Menu','href','/menu'),JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','FAQ','props', JSON_OBJECT('headline','FAQ','subheadline','Common questions.','items', JSON_ARRAY(
            JSON_OBJECT('q','Do you take reservations?','a','Yes — use the contact form to request a time.'),
            JSON_OBJECT('q','Do you offer catering?','a','Yes — describe catering packages and lead times.'),
            JSON_OBJECT('q','Can I edit the menu?','a','Yes — edit pricing blocks and cards for menu sections.')
          )), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© Cedar & Co.'),'styles', JSON_OBJECT('variant','dark'))
        )
      )
    )
  )
);
INSERT INTO templates (name, category, preview_image_url, structure_json)
VALUES
(
  'Apex Athletics',
  'Sports',
  NULL,
  JSON_OBJECT(
    'designSystem', JSON_OBJECT(
      'colors', JSON_OBJECT('primary','#22c55e','secondary','#ffffff','background','#060a12','surface','rgba(255,255,255,0.06)','text','rgba(255,255,255,0.92)','mutedText','rgba(255,255,255,0.70)'),
      'typography', JSON_OBJECT('fontFamily','Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif','baseFontSize',16,'lineHeight',1.5,'headingWeight',700,'bodyWeight',400),
      'spacing', JSON_OBJECT('sectionY',56,'containerX',16)
    ),
    'pages', JSON_ARRAY(
      JSON_OBJECT('name','Home','path','/','meta', JSON_OBJECT('title','Apex Athletics','description','Nike-style sportswear brand with drops, stories, and collections.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','ADVANCED_NAVBAR','props', JSON_OBJECT('logoText','APEX','showSearch',TRUE,'searchPlaceholder','Search drops…','links', JSON_ARRAY(JSON_OBJECT('label','Collections','href','/collections'),JSON_OBJECT('label','Stories','href','/stories'),JSON_OBJECT('label','Plans','href','/plans'),JSON_OBJECT('label','FAQ','href','/faq')),
            'ctas', JSON_ARRAY(JSON_OBJECT('label','Shop','href','/collections','variant','primary'))), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','HERO','props', JSON_OBJECT('headline','Engineered for motion.','subheadline','Premium training essentials with campaign-style landing + merch sections.','primaryCta', JSON_OBJECT('label','Shop collections','href','/collections')),'styles', JSON_OBJECT('layout','split')),
          JSON_OBJECT('type','PRODUCT_GRID','props', JSON_OBJECT('headline','Featured drops','subheadline','Curated products with badges and pricing.','cta', JSON_OBJECT('label','View all','href','/collections'),
            'products', JSON_ARRAY(
              JSON_OBJECT('name','Runner Jacket','description','Lightweight, breathable','price','€129','badge','New','imageUrl','', 'cta', JSON_OBJECT('label','Buy','href','/contact')),
              JSON_OBJECT('name','Studio Tee','description','Soft-touch cotton','price','€39','badge',NULL,'imageUrl','', 'cta', JSON_OBJECT('label','Buy','href','/contact')),
              JSON_OBJECT('name','Interval Shorts','description','4-way stretch','price','€49','badge','Best seller','imageUrl','', 'cta', JSON_OBJECT('label','Buy','href','/contact')),
              JSON_OBJECT('name','Training Shoes','description','Daily trainer','price','€99','badge',NULL,'imageUrl','', 'cta', JSON_OBJECT('label','Buy','href','/contact'))
            )
          ), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','CARDS','props', JSON_OBJECT('cards', JSON_ARRAY(
            JSON_OBJECT('title','Core Training','text','Pieces that work across sessions.','cta', JSON_OBJECT('label','Explore','href','/collections')),
            JSON_OBJECT('title','Run Club','text','Distance-first silhouettes and layering.','cta', JSON_OBJECT('label','Explore','href','/collections')),
            JSON_OBJECT('title','Recovery','text','Soft-touch fits for warmups + rest days.','cta', JSON_OBJECT('label','Explore','href','/collections'))
          )), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FOOTER_LINKS','props', JSON_OBJECT('brand','APEX','description','Athlete-first brand template.','columns', JSON_ARRAY(
            JSON_OBJECT('title','Shop','links', JSON_ARRAY(JSON_OBJECT('label','Collections','href','/collections'))),
            JSON_OBJECT('title','Stories','links', JSON_ARRAY(JSON_OBJECT('label','Stories','href','/stories'))),
            JSON_OBJECT('title','Support','links', JSON_ARRAY(JSON_OBJECT('label','FAQ','href','/faq'),JSON_OBJECT('label','Contact','href','/contact')))
          )), 'styles', JSON_OBJECT())
        )
      ),
      JSON_OBJECT('name','Collections','path','/collections','meta', JSON_OBJECT('title','Collections - APEX','description','Drops and categories.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','ADVANCED_NAVBAR','props', JSON_OBJECT('logoText','APEX','showSearch',TRUE,'links', JSON_ARRAY(JSON_OBJECT('label','Collections','href','/collections'),JSON_OBJECT('label','Stories','href','/stories'),JSON_OBJECT('label','Plans','href','/plans'),JSON_OBJECT('label','FAQ','href','/faq')),
            'ctas', JSON_ARRAY(JSON_OBJECT('label','Shop','href','/collections','variant','primary'))), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FILTER_TABS','props', JSON_OBJECT('headline','Shop by category','subheadline','Filter a catalog with tabs.','defaultTab','all',
            'tabs', JSON_ARRAY(JSON_OBJECT('label','All','value','all'),JSON_OBJECT('label','Shoes','value','shoes'),JSON_OBJECT('label','Apparel','value','apparel'),JSON_OBJECT('label','Accessories','value','accessories')),
            'products', JSON_ARRAY(
              JSON_OBJECT('name','Daily Trainer','description','Comfort + speed','price','€99','badge','New','imageUrl','', 'categories', JSON_ARRAY('shoes'), 'cta', JSON_OBJECT('label','View','href','/contact')),
              JSON_OBJECT('name','Warmup Hoodie','description','Heavyweight fleece','price','€79','badge',NULL,'imageUrl','', 'categories', JSON_ARRAY('apparel'), 'cta', JSON_OBJECT('label','View','href','/contact')),
              JSON_OBJECT('name','Gym Bag','description','Durable carry','price','€59','badge',NULL,'imageUrl','', 'categories', JSON_ARRAY('accessories'), 'cta', JSON_OBJECT('label','View','href','/contact'))
            )
          ), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FOOTER_LINKS','props', JSON_OBJECT('brand','APEX','description','Collections page patterns.','columns', JSON_ARRAY(
            JSON_OBJECT('title','Support','links', JSON_ARRAY(JSON_OBJECT('label','FAQ','href','/faq'))),
            JSON_OBJECT('title','Company','links', JSON_ARRAY(JSON_OBJECT('label','Stories','href','/stories'))),
            JSON_OBJECT('title','Legal','links', JSON_ARRAY(JSON_OBJECT('label','Terms','href','/terms')))
          )), 'styles', JSON_OBJECT())
        )
      ),
      JSON_OBJECT('name','Stories','path','/stories','meta', JSON_OBJECT('title','Stories - APEX','description','Campaign and blog sections.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','APEX','links', JSON_ARRAY(JSON_OBJECT('label','Home','href','/'),JSON_OBJECT('label','Collections','href','/collections'),JSON_OBJECT('label','Plans','href','/plans'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','CARDS','props', JSON_OBJECT('cards', JSON_ARRAY(
            JSON_OBJECT('title','Studio day','text','From sketch to sample — the drop process.','cta', JSON_OBJECT('label','Read','href','/contact')),
            JSON_OBJECT('title','Run club','text','Community sessions built into the brand.','cta', JSON_OBJECT('label','Read','href','/contact')),
            JSON_OBJECT('title','Materials','text','A quick look at fabrics and construction.','cta', JSON_OBJECT('label','Read','href','/contact'))
          )), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FOOTER_LINKS','props', JSON_OBJECT('brand','APEX','description','Stories make the brand feel real.','columns', JSON_ARRAY(
            JSON_OBJECT('title','Shop','links', JSON_ARRAY(JSON_OBJECT('label','Collections','href','/collections'))),
            JSON_OBJECT('title','Support','links', JSON_ARRAY(JSON_OBJECT('label','FAQ','href','/faq'))),
            JSON_OBJECT('title','Company','links', JSON_ARRAY(JSON_OBJECT('label','About','href','/about')))
          )), 'styles', JSON_OBJECT())
        )
      ),
      JSON_OBJECT('name','Plans','path','/plans','meta', JSON_OBJECT('title','Plans - APEX','description','Membership and perks.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','APEX','links', JSON_ARRAY(JSON_OBJECT('label','Collections','href','/collections'),JSON_OBJECT('label','Stories','href','/stories'),JSON_OBJECT('label','Plans','href','/plans'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','PRICING','props', JSON_OBJECT('plans', JSON_ARRAY(
            JSON_OBJECT('name','Starter','price','€9','period','/mo','features', JSON_ARRAY('Early access drops','Member emails','Priority support')),
            JSON_OBJECT('name','Plus','price','€19','period','/mo','features', JSON_ARRAY('Exclusive colorways','Free returns','Invite-only events')),
            JSON_OBJECT('name','Elite','price','€39','period','/mo','features', JSON_ARRAY('Limited drops','Free shipping','VIP support'))
          )), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FOOTER_LINKS','props', JSON_OBJECT('brand','APEX','description','Plan pages make sites look enterprise.','columns', JSON_ARRAY(
            JSON_OBJECT('title','Shop','links', JSON_ARRAY(JSON_OBJECT('label','Collections','href','/collections'))),
            JSON_OBJECT('title','Support','links', JSON_ARRAY(JSON_OBJECT('label','Contact','href','/contact'))),
            JSON_OBJECT('title','Legal','links', JSON_ARRAY(JSON_OBJECT('label','Privacy','href','/privacy')))
          )), 'styles', JSON_OBJECT())
        )
      ),
      JSON_OBJECT('name','FAQ','path','/faq','meta', JSON_OBJECT('title','FAQ - APEX','description','Shipping, returns, and sizing.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','APEX','links', JSON_ARRAY(JSON_OBJECT('label','Collections','href','/collections'),JSON_OBJECT('label','Plans','href','/plans'),JSON_OBJECT('label','FAQ','href','/faq'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','FAQ','props', JSON_OBJECT('headline','Help center','subheadline','Common questions.','items', JSON_ARRAY(
            JSON_OBJECT('q','Do you ship internationally?','a','Yes. Shipping options appear at checkout.'),
            JSON_OBJECT('q','What is your return policy?','a','30-day returns on unworn items.'),
            JSON_OBJECT('q','How do I choose my size?','a','Use the size guide and compare to an item you own.')
          )), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FOOTER_LINKS','props', JSON_OBJECT('brand','APEX','description','FAQ pages boost realism.','columns', JSON_ARRAY(
            JSON_OBJECT('title','Shop','links', JSON_ARRAY(JSON_OBJECT('label','Collections','href','/collections'))),
            JSON_OBJECT('title','Company','links', JSON_ARRAY(JSON_OBJECT('label','Stories','href','/stories'))),
            JSON_OBJECT('title','Legal','links', JSON_ARRAY(JSON_OBJECT('label','Terms','href','/terms')))
          )), 'styles', JSON_OBJECT())
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
    'designSystem', JSON_OBJECT(
      'colors', JSON_OBJECT('primary','#6366f1','secondary','#22c55e','background','#070a12','surface','rgba(255,255,255,0.06)','text','rgba(255,255,255,0.92)','mutedText','rgba(255,255,255,0.70)'),
      'typography', JSON_OBJECT('fontFamily','Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif','baseFontSize',16,'lineHeight',1.5,'headingWeight',700,'bodyWeight',400),
      'spacing', JSON_OBJECT('sectionY',64,'containerX',16)
    ),
    'pages', JSON_ARRAY(
      JSON_OBJECT('name','Home','path','/','meta', JSON_OBJECT('title','Nimbus SaaS','description','Modern SaaS template with product, pricing, and growth sections.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','ADVANCED_NAVBAR','props', JSON_OBJECT('logoText','Nimbus','showSearch',FALSE,'links', JSON_ARRAY(JSON_OBJECT('label','Product','href','/#product'),JSON_OBJECT('label','Pricing','href','/pricing'),JSON_OBJECT('label','Stories','href','/stories'),JSON_OBJECT('label','Contact','href','/contact')),
            'ctas', JSON_ARRAY(JSON_OBJECT('label','Sign in','href','/login','variant','neutral'),JSON_OBJECT('label','Start free','href','/contact','variant','primary'))), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','HERO','props', JSON_OBJECT('headline','Ship a website that looks like a real product.','subheadline','SaaS-grade layout: hero, social proof, product rows, pricing, and FAQs — fully editable.','primaryCta', JSON_OBJECT('label','Start free','href','/contact')),'styles', JSON_OBJECT('layout','split')),
          JSON_OBJECT('type','LOGO_CLOUD','props', JSON_OBJECT('label','Trusted by teams','logos', JSON_ARRAY(
            JSON_OBJECT('src','', 'alt','Northwind'),
            JSON_OBJECT('src','', 'alt','Apex'),
            JSON_OBJECT('src','', 'alt','Harbor'),
            JSON_OBJECT('src','', 'alt','Cedar'),
            JSON_OBJECT('src','', 'alt','ArcBank'),
            JSON_OBJECT('src','', 'alt','StayAtlas')
          )), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FEATURES','props', JSON_OBJECT('items', JSON_ARRAY(
            JSON_OBJECT('title','Workspaces','text','Separate pages, components, and themes per website.'),
            JSON_OBJECT('title','Version history','text','Snapshots on each save — restore anytime.'),
            JSON_OBJECT('title','Publish control','text','Preview drafts, publish when ready, unpublish instantly.')
          )), 'styles', JSON_OBJECT('columns',3)),
          JSON_OBJECT('type','FEATURE_CAROUSEL','props', JSON_OBJECT('headline','Featured updates','subheadline','A Netflix-style row to showcase product updates.','cta', JSON_OBJECT('label','See all','href','/stories'),
            'items', JSON_ARRAY(
              JSON_OBJECT('title','Release notes','tagline','Weekly updates','imageUrl','', 'cta', JSON_OBJECT('label','Read','href','/stories')),
              JSON_OBJECT('title','Case studies','tagline','Real outcomes','imageUrl','', 'cta', JSON_OBJECT('label','Read','href','/stories')),
              JSON_OBJECT('title','Templates','tagline','New industries','imageUrl','', 'cta', JSON_OBJECT('label','Browse','href','/templates')),
              JSON_OBJECT('title','Security','tagline','JWT + RBAC','imageUrl','', 'cta', JSON_OBJECT('label','Learn','href','/about'))
            )
          ), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','PRICING','props', JSON_OBJECT('plans', JSON_ARRAY(
            JSON_OBJECT('name','Starter','price','€19','period','/mo','features', JSON_ARRAY('1 business','1 published website','Templates + editor','Preview mode')),
            JSON_OBJECT('name','Pro','price','€49','period','/mo','features', JSON_ARRAY('3 businesses','Unlimited drafts','Version history','Advanced builder')),
            JSON_OBJECT('name','Agency','price','€99','period','/mo','features', JSON_ARRAY('10 businesses','Asset library','Client handoff','Priority support'))
          )), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FAQ','props', JSON_OBJECT('headline','FAQ','subheadline','Quick answers before you commit.','items', JSON_ARRAY(
            JSON_OBJECT('q','Do templates share data?','a','No — templates are cloned per website.'),
            JSON_OBJECT('q','Can I restore changes?','a','Yes — version snapshots are stored per website.'),
            JSON_OBJECT('q','Can I go live later?','a','Yes — publish/unpublish controls public availability.')
          )), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FOOTER_LINKS','props', JSON_OBJECT('brand','Nimbus','description','A SaaS template designed to feel production-grade.','columns', JSON_ARRAY(
            JSON_OBJECT('title','Product','links', JSON_ARRAY(JSON_OBJECT('label','Templates','href','/templates'),JSON_OBJECT('label','Pricing','href','/pricing'))),
            JSON_OBJECT('title','Company','links', JSON_ARRAY(JSON_OBJECT('label','About','href','/about'),JSON_OBJECT('label','Stories','href','/stories'))),
            JSON_OBJECT('title','Support','links', JSON_ARRAY(JSON_OBJECT('label','Contact','href','/contact'),JSON_OBJECT('label','FAQ','href','/faq')))
          )), 'styles', JSON_OBJECT())
        )
      ),
      JSON_OBJECT('name','Pricing','path','/pricing','meta', JSON_OBJECT('title','Pricing - Nimbus','description','Plan tiers and feature matrix.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','Nimbus','links', JSON_ARRAY(JSON_OBJECT('label','Home','href','/'),JSON_OBJECT('label','Pricing','href','/pricing'),JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','PRICING','props', JSON_OBJECT('plans', JSON_ARRAY(
            JSON_OBJECT('name','Starter','price','€19','period','/mo','features', JSON_ARRAY('Templates','Basic editor','Draft preview')),
            JSON_OBJECT('name','Pro','price','€49','period','/mo','features', JSON_ARRAY('Advanced builder','SEO + theme','Version history')),
            JSON_OBJECT('name','Agency','price','€99','period','/mo','features', JSON_ARRAY('Multi-business','Asset library','Admin controls'))
          )), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© Nimbus SaaS'),'styles', JSON_OBJECT('variant','dark'))
        )
      ),
      JSON_OBJECT('name','Stories','path','/stories','meta', JSON_OBJECT('title','Stories - Nimbus','description','Blog/case-study style cards.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','Nimbus','links', JSON_ARRAY(JSON_OBJECT('label','Home','href','/'),JSON_OBJECT('label','Pricing','href','/pricing'),JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','CARDS','props', JSON_OBJECT('cards', JSON_ARRAY(
            JSON_OBJECT('title','From template to launch','text','How small teams ship fast with LaunchWeb-style workflows.','cta', JSON_OBJECT('label','Read','href','/contact')),
            JSON_OBJECT('title','Design tokens at scale','text','Theme + design system settings for consistent visuals.','cta', JSON_OBJECT('label','Read','href','/contact')),
            JSON_OBJECT('title','Safe iteration','text','Version history + restore for confident editing.','cta', JSON_OBJECT('label','Read','href','/contact'))
          )), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© Nimbus SaaS'),'styles', JSON_OBJECT('variant','dark'))
        )
      ),
      JSON_OBJECT('name','Contact','path','/contact','meta', JSON_OBJECT('title','Contact - Nimbus','description','Lead form page.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','Nimbus','links', JSON_ARRAY(JSON_OBJECT('label','Home','href','/'),JSON_OBJECT('label','Pricing','href','/pricing'),JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','CONTACT_FORM','props', JSON_OBJECT('headline','Talk to sales','fields', JSON_ARRAY('name','email','message')),'styles', JSON_OBJECT('layout','card')),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© Nimbus SaaS'),'styles', JSON_OBJECT('variant','dark'))
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
    'designSystem', JSON_OBJECT(
      'colors', JSON_OBJECT('primary','#22c55e','secondary','#0ea5e9','background','#070a12','surface','rgba(255,255,255,0.06)','text','rgba(255,255,255,0.92)','mutedText','rgba(255,255,255,0.70)'),
      'typography', JSON_OBJECT('fontFamily','ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif','baseFontSize',16,'lineHeight',1.5,'headingWeight',700,'bodyWeight',400),
      'spacing', JSON_OBJECT('sectionY',60,'containerX',16)
    ),
    'pages', JSON_ARRAY(
      JSON_OBJECT('name','Home','path','/','meta', JSON_OBJECT('title','Harbor Dental','description','Healthcare template with services, trust signals, and booking CTA.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','Harbor Dental','links', JSON_ARRAY(JSON_OBJECT('label','Services','href','/#services'),JSON_OBJECT('label','About','href','/about'),JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','HERO','props', JSON_OBJECT('headline','A modern clinic website your patients can trust.','subheadline','Professional layout with services, testimonials, FAQs, and a booking-focused contact page.','primaryCta', JSON_OBJECT('label','Book an appointment','href','/contact')),'styles', JSON_OBJECT('layout','split')),
          JSON_OBJECT('type','FEATURES','props', JSON_OBJECT('items', JSON_ARRAY(
            JSON_OBJECT('title','Preventive care','text','Cleanings, exams, and long-term oral health.'),
            JSON_OBJECT('title','Cosmetic dentistry','text','Whitening, veneers, and smile improvements.'),
            JSON_OBJECT('title','Emergency visits','text','Fast help when you need it most.')
          )), 'styles', JSON_OBJECT('columns',3)),
          JSON_OBJECT('type','TESTIMONIALS','props', JSON_OBJECT('headline','Patients love Harbor','subheadline','Social proof that feels real.','items', JSON_ARRAY(
            JSON_OBJECT('name','Elena','role','Patient','quote','Friendly team and a clean modern clinic. Booking was easy.'),
            JSON_OBJECT('name','Marco','role','Patient','quote','They explained everything clearly — super professional.'),
            JSON_OBJECT('name','Nina','role','Patient','quote','Great results and quick turnaround for an urgent visit.')
          )), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FAQ','props', JSON_OBJECT('headline','FAQ','subheadline','Questions patients ask before booking.','items', JSON_ARRAY(
            JSON_OBJECT('q','Do you accept insurance?','a','Add insurance providers or payment options here.'),
            JSON_OBJECT('q','Do you offer emergency appointments?','a','Yes — include hours and contact instructions.'),
            JSON_OBJECT('q','How can I book?','a','Use the contact form to request an appointment time.')
          )), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FOOTER_LINKS','props', JSON_OBJECT('brand','Harbor Dental','description','Healthcare template with trust-first layout.','columns', JSON_ARRAY(
            JSON_OBJECT('title','Clinic','links', JSON_ARRAY(JSON_OBJECT('label','About','href','/about'),JSON_OBJECT('label','Services','href','/#services'))),
            JSON_OBJECT('title','Patients','links', JSON_ARRAY(JSON_OBJECT('label','FAQ','href','/faq'),JSON_OBJECT('label','Contact','href','/contact'))),
            JSON_OBJECT('title','Legal','links', JSON_ARRAY(JSON_OBJECT('label','Privacy','href','/privacy'),JSON_OBJECT('label','Terms','href','/terms')))
          )), 'styles', JSON_OBJECT())
        )
      ),
      JSON_OBJECT('name','About','path','/about','meta', JSON_OBJECT('title','About - Harbor Dental','description','Clinic story, team, and values.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','Harbor Dental','links', JSON_ARRAY(JSON_OBJECT('label','Home','href','/'),JSON_OBJECT('label','About','href','/about'),JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','CONTENT','props', JSON_OBJECT('title','A clinic built on trust','paragraphs', JSON_ARRAY(
            'Use this page to describe your team, your approach, and what makes your clinic different.',
            'Add credentials, years of experience, and patient-first values to make it feel real.'
          )), 'styles', JSON_OBJECT('width','md')),
          JSON_OBJECT('type','CARDS','props', JSON_OBJECT('cards', JSON_ARRAY(
            JSON_OBJECT('title','Modern equipment','text','Describe tools and processes that build confidence.','cta', JSON_OBJECT('label','Book now','href','/contact')),
            JSON_OBJECT('title','Clear pricing','text','Explain consultation and treatment planning.','cta', JSON_OBJECT('label','Contact','href','/contact')),
            JSON_OBJECT('title','Comfort-first','text','Set expectations for patient experience.','cta', JSON_OBJECT('label','Learn more','href','/contact'))
          )), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© Harbor Dental'),'styles', JSON_OBJECT('variant','dark'))
        )
      ),
      JSON_OBJECT('name','FAQ','path','/faq','meta', JSON_OBJECT('title','FAQ - Harbor Dental','description','Operational FAQs.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','Harbor Dental','links', JSON_ARRAY(JSON_OBJECT('label','Home','href','/'),JSON_OBJECT('label','FAQ','href','/faq'),JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','FAQ','props', JSON_OBJECT('headline','FAQ','subheadline','Office hours, booking, and policies.','items', JSON_ARRAY(
            JSON_OBJECT('q','Where are you located?','a','Add address and nearby landmarks here.'),
            JSON_OBJECT('q','What are your hours?','a','List weekday/weekend hours and holiday policies.'),
            JSON_OBJECT('q','Do you offer cosmetic services?','a','Yes — list whitening, veneers, aligners, etc.')
          )), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© Harbor Dental'),'styles', JSON_OBJECT('variant','dark'))
        )
      ),
      JSON_OBJECT('name','Contact','path','/contact','meta', JSON_OBJECT('title','Contact - Harbor Dental','description','Appointment request form.'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','Harbor Dental','links', JSON_ARRAY(JSON_OBJECT('label','Home','href','/'),JSON_OBJECT('label','About','href','/about'),JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT('variant','solid')),
          JSON_OBJECT('type','CONTACT_FORM','props', JSON_OBJECT('headline','Request an appointment','fields', JSON_ARRAY('name','email','message')),'styles', JSON_OBJECT('layout','card')),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('text','© Harbor Dental'),'styles', JSON_OBJECT('variant','dark'))
        )
      )
    )
  )
);