-- New Professional Templates for LaunchWeb
-- Run this after seed.sql to add more templates

-- E-Commerce Store Template
INSERT INTO templates (name, category, preview_image_url, structure_json)
VALUES (
  'ShopNova',
  'E-commerce',
  NULL,
  JSON_OBJECT(
    'designSystem', JSON_OBJECT(
      'colors', JSON_OBJECT('primary','#8b5cf6','secondary','#ec4899','background','#0f0f1a','surface','rgba(255,255,255,0.05)','text','#ffffff','mutedText','rgba(255,255,255,0.7)'),
      'typography', JSON_OBJECT('fontFamily','"Inter", system-ui, sans-serif','baseFontSize',16,'lineHeight',1.5,'headingWeight',700,'bodyWeight',400),
      'spacing', JSON_OBJECT('sectionY',64,'containerX',24)
    ),
    'pages', JSON_ARRAY(
      JSON_OBJECT('name','Home','path','/','meta', JSON_OBJECT('title','ShopNova - Modern E-commerce','description','Premium online shopping experience'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','ShopNova','links', JSON_ARRAY(
            JSON_OBJECT('label','Shop','href','/shop'),
            JSON_OBJECT('label','Categories','href','/categories'),
            JSON_OBJECT('label','About','href','/about'),
            JSON_OBJECT('label','Contact','href','/contact')
          ),'cta', JSON_OBJECT('label','Cart (0)','href','/cart')), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','HERO','props', JSON_OBJECT('headline','Discover Your Style','subheadline','Premium products curated for the modern lifestyle. Free shipping on orders over $50.',
            'primaryCta', JSON_OBJECT('label','Shop Now','href','/shop'),
            'secondaryCta', JSON_OBJECT('label','View Collections','href','/categories')), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','LOGO_CLOUD','props', JSON_OBJECT('label','Trusted by leading brands','logos', JSON_ARRAY(
            JSON_OBJECT('alt','Brand 1'),JSON_OBJECT('alt','Brand 2'),JSON_OBJECT('alt','Brand 3'),JSON_OBJECT('alt','Brand 4')
          )), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','PRODUCT_GRID','props', JSON_OBJECT('headline','Featured Products','subheadline','Handpicked favorites from our collection',
            'products', JSON_ARRAY(
              JSON_OBJECT('name','Wireless Headphones','description','Premium sound quality','price','$199','badge','New','imageUrl',''),
              JSON_OBJECT('name','Smart Watch Pro','description','Track your fitness','price','$349','badge','Best Seller','imageUrl',''),
              JSON_OBJECT('name','Leather Backpack','description','Handcrafted quality','price','$129','badge',NULL,'imageUrl',''),
              JSON_OBJECT('name','Minimalist Wallet','description','Slim & functional','price','$49','badge',NULL,'imageUrl','')
            ),
            'cta', JSON_OBJECT('label','View All Products','href','/shop')), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FEATURES','props', JSON_OBJECT('headline','Why Choose Us','items', JSON_ARRAY(
            JSON_OBJECT('icon','🚚','title','Free Shipping','text','On all orders over $50'),
            JSON_OBJECT('icon','🔒','title','Secure Payment','text','100% secure checkout'),
            JSON_OBJECT('icon','↩️','title','Easy Returns','text','30-day return policy'),
            JSON_OBJECT('icon','💬','title','24/7 Support','text','Always here to help')
          )), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','TESTIMONIALS','props', JSON_OBJECT('headline','What Customers Say','items', JSON_ARRAY(
            JSON_OBJECT('quote','Amazing quality and fast shipping! Will definitely order again.','name','Sarah M.','role','Verified Buyer'),
            JSON_OBJECT('quote','Best online shopping experience I have had. Highly recommend!','name','James K.','role','Verified Buyer'),
            JSON_OBJECT('quote','Love the products and the customer service is exceptional.','name','Emily R.','role','Verified Buyer')
          )), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','CTA','props', JSON_OBJECT('headline','Join Our Newsletter','description','Get 10% off your first order and stay updated on new arrivals.',
            'primaryCta', JSON_OBJECT('label','Subscribe','href','/contact')), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('logo', JSON_OBJECT('text','ShopNova'),
            'columns', JSON_ARRAY(
              JSON_OBJECT('title','Shop','links', JSON_ARRAY(JSON_OBJECT('label','All Products','href','/shop'),JSON_OBJECT('label','Categories','href','/categories'),JSON_OBJECT('label','New Arrivals','href','/shop'))),
              JSON_OBJECT('title','Support','links', JSON_ARRAY(JSON_OBJECT('label','Contact Us','href','/contact'),JSON_OBJECT('label','FAQ','href','/faq'),JSON_OBJECT('label','Shipping','href','/shipping'))),
              JSON_OBJECT('title','Company','links', JSON_ARRAY(JSON_OBJECT('label','About Us','href','/about'),JSON_OBJECT('label','Careers','href','/careers'),JSON_OBJECT('label','Press','href','/press')))
            ),
            'copyright','© 2024 ShopNova. All rights reserved.'), 'styles', JSON_OBJECT())
        )
      ),
      JSON_OBJECT('name','Shop','path','/shop','meta', JSON_OBJECT('title','Shop - ShopNova','description','Browse our collection'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','ShopNova','links', JSON_ARRAY(JSON_OBJECT('label','Shop','href','/shop'),JSON_OBJECT('label','About','href','/about'),JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','HERO','props', JSON_OBJECT('headline','All Products','subheadline','Explore our complete collection of premium products.'), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','PRODUCT_GRID','props', JSON_OBJECT('products', JSON_ARRAY(
            JSON_OBJECT('name','Premium Headphones','description','Noise cancelling','price','$299','badge','New','imageUrl',''),
            JSON_OBJECT('name','Fitness Tracker','description','Heart rate monitor','price','$149','badge',NULL,'imageUrl',''),
            JSON_OBJECT('name','Laptop Stand','description','Ergonomic design','price','$79','badge',NULL,'imageUrl',''),
            JSON_OBJECT('name','USB-C Hub','description','7-in-1 connectivity','price','$59','badge','Popular','imageUrl',''),
            JSON_OBJECT('name','Desk Organizer','description','Bamboo finish','price','$45','badge',NULL,'imageUrl',''),
            JSON_OBJECT('name','Wireless Charger','description','Fast charging','price','$39','badge',NULL,'imageUrl','')
          )), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('logo', JSON_OBJECT('text','ShopNova'),'copyright','© 2024 ShopNova'), 'styles', JSON_OBJECT())
        )
      ),
      JSON_OBJECT('name','About','path','/about','meta', JSON_OBJECT('title','About - ShopNova','description','Our story'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','ShopNova','links', JSON_ARRAY(JSON_OBJECT('label','Shop','href','/shop'),JSON_OBJECT('label','About','href','/about'),JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','HERO','props', JSON_OBJECT('headline','Our Story','subheadline','Founded in 2020, ShopNova started with a simple mission: to bring premium products to everyone at fair prices.'), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','STATS','props', JSON_OBJECT('items', JSON_ARRAY(
            JSON_OBJECT('value','50K+','label','Happy Customers'),
            JSON_OBJECT('value','1000+','label','Products'),
            JSON_OBJECT('value','50+','label','Countries'),
            JSON_OBJECT('value','4.9','label','Average Rating')
          )), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','TEAM','props', JSON_OBJECT('headline','Meet Our Team','members', JSON_ARRAY(
            JSON_OBJECT('name','Alex Chen','role','Founder & CEO','image',''),
            JSON_OBJECT('name','Maria Garcia','role','Head of Design','image',''),
            JSON_OBJECT('name','David Kim','role','Operations Lead','image','')
          )), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('logo', JSON_OBJECT('text','ShopNova'),'copyright','© 2024 ShopNova'), 'styles', JSON_OBJECT())
        )
      ),
      JSON_OBJECT('name','Contact','path','/contact','meta', JSON_OBJECT('title','Contact - ShopNova','description','Get in touch'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','ShopNova','links', JSON_ARRAY(JSON_OBJECT('label','Shop','href','/shop'),JSON_OBJECT('label','About','href','/about'),JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','HERO','props', JSON_OBJECT('headline','Contact Us','subheadline','Have questions? We would love to hear from you.'), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','CONTACT_FORM','props', JSON_OBJECT('headline','Send us a message','submitText','Send Message'), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('logo', JSON_OBJECT('text','ShopNova'),'copyright','© 2024 ShopNova'), 'styles', JSON_OBJECT())
        )
      )
    )
  )
);

-- Creative Agency Template
INSERT INTO templates (name, category, preview_image_url, structure_json)
VALUES (
  'Pixel Studio',
  'Agency',
  NULL,
  JSON_OBJECT(
    'designSystem', JSON_OBJECT(
      'colors', JSON_OBJECT('primary','#f97316','secondary','#06b6d4','background','#0a0a0a','surface','rgba(255,255,255,0.05)','text','#ffffff','mutedText','rgba(255,255,255,0.7)'),
      'typography', JSON_OBJECT('fontFamily','"Space Grotesk", system-ui, sans-serif','baseFontSize',16,'lineHeight',1.6,'headingWeight',700,'bodyWeight',400),
      'spacing', JSON_OBJECT('sectionY',80,'containerX',24)
    ),
    'pages', JSON_ARRAY(
      JSON_OBJECT('name','Home','path','/','meta', JSON_OBJECT('title','Pixel Studio - Creative Agency','description','We craft digital experiences that matter'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','Pixel Studio','links', JSON_ARRAY(
            JSON_OBJECT('label','Work','href','/work'),
            JSON_OBJECT('label','Services','href','/services'),
            JSON_OBJECT('label','About','href','/about'),
            JSON_OBJECT('label','Contact','href','/contact')
          ),'cta', JSON_OBJECT('label','Start a Project','href','/contact')), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','HERO','props', JSON_OBJECT('headline','We Create Digital Experiences That Matter','subheadline','Award-winning creative agency specializing in brand identity, web design, and digital marketing.',
            'primaryCta', JSON_OBJECT('label','View Our Work','href','/work'),
            'secondaryCta', JSON_OBJECT('label','Get in Touch','href','/contact')), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','STATS','props', JSON_OBJECT('items', JSON_ARRAY(
            JSON_OBJECT('value','150+','label','Projects Delivered'),
            JSON_OBJECT('value','50+','label','Happy Clients'),
            JSON_OBJECT('value','12','label','Awards Won'),
            JSON_OBJECT('value','8+','label','Years Experience')
          )), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','CARDS','props', JSON_OBJECT('headline','Featured Work','cards', JSON_ARRAY(
            JSON_OBJECT('title','TechFlow Rebrand','text','Complete brand identity redesign for a leading SaaS company','image','','cta', JSON_OBJECT('label','View Case Study','href','/work')),
            JSON_OBJECT('title','Artisan Coffee','text','E-commerce website and packaging design','image','','cta', JSON_OBJECT('label','View Case Study','href','/work')),
            JSON_OBJECT('title','FitLife App','text','Mobile app UI/UX design and development','image','','cta', JSON_OBJECT('label','View Case Study','href','/work'))
          )), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FEATURES','props', JSON_OBJECT('headline','Our Services','items', JSON_ARRAY(
            JSON_OBJECT('icon','🎨','title','Brand Identity','text','Logo design, brand guidelines, and visual systems'),
            JSON_OBJECT('icon','💻','title','Web Design','text','Custom websites that convert visitors into customers'),
            JSON_OBJECT('icon','📱','title','App Design','text','Intuitive mobile experiences for iOS and Android'),
            JSON_OBJECT('icon','📈','title','Digital Marketing','text','SEO, social media, and growth strategies')
          )), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','TESTIMONIALS','props', JSON_OBJECT('headline','Client Love','items', JSON_ARRAY(
            JSON_OBJECT('quote','Pixel Studio transformed our brand completely. The results exceeded all expectations.','name','Michael Torres','role','CEO, TechFlow'),
            JSON_OBJECT('quote','Professional, creative, and incredibly easy to work with. Highly recommended!','name','Lisa Wang','role','Founder, Artisan Coffee')
          )), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','CTA','props', JSON_OBJECT('headline','Ready to Start Your Project?','description','Let us help you create something amazing. Get in touch for a free consultation.',
            'primaryCta', JSON_OBJECT('label','Start a Project','href','/contact'),
            'secondaryCta', JSON_OBJECT('label','View Pricing','href','/services')), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('logo', JSON_OBJECT('text','Pixel Studio'),
            'columns', JSON_ARRAY(
              JSON_OBJECT('title','Work','links', JSON_ARRAY(JSON_OBJECT('label','Portfolio','href','/work'),JSON_OBJECT('label','Case Studies','href','/work'))),
              JSON_OBJECT('title','Services','links', JSON_ARRAY(JSON_OBJECT('label','Branding','href','/services'),JSON_OBJECT('label','Web Design','href','/services'),JSON_OBJECT('label','Marketing','href','/services'))),
              JSON_OBJECT('title','Company','links', JSON_ARRAY(JSON_OBJECT('label','About','href','/about'),JSON_OBJECT('label','Careers','href','/careers'),JSON_OBJECT('label','Contact','href','/contact')))
            ),
            'copyright','© 2024 Pixel Studio. All rights reserved.'), 'styles', JSON_OBJECT())
        )
      ),
      JSON_OBJECT('name','Work','path','/work','meta', JSON_OBJECT('title','Our Work - Pixel Studio','description','Portfolio of our best projects'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','Pixel Studio','links', JSON_ARRAY(JSON_OBJECT('label','Work','href','/work'),JSON_OBJECT('label','Services','href','/services'),JSON_OBJECT('label','About','href','/about'),JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','HERO','props', JSON_OBJECT('headline','Our Work','subheadline','A selection of projects we are proud of.'), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','GALLERY','props', JSON_OBJECT('images', JSON_ARRAY(),'columns',3), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','CARDS','props', JSON_OBJECT('cards', JSON_ARRAY(
            JSON_OBJECT('title','E-commerce Platform','text','Full redesign and development','image',''),
            JSON_OBJECT('title','Mobile Banking App','text','UX research and UI design','image',''),
            JSON_OBJECT('title','Restaurant Chain','text','Brand identity and website','image',''),
            JSON_OBJECT('title','Fitness Startup','text','Complete digital presence','image',''),
            JSON_OBJECT('title','Real Estate Portal','text','Web application development','image',''),
            JSON_OBJECT('title','Fashion Brand','text','E-commerce and social strategy','image','')
          )), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','CTA','props', JSON_OBJECT('headline','Like What You See?','description','Let us create something amazing for you too.',
            'primaryCta', JSON_OBJECT('label','Start Your Project','href','/contact')), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('logo', JSON_OBJECT('text','Pixel Studio'),'copyright','© 2024 Pixel Studio'), 'styles', JSON_OBJECT())
        )
      ),
      JSON_OBJECT('name','Services','path','/services','meta', JSON_OBJECT('title','Services - Pixel Studio','description','What we offer'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','Pixel Studio','links', JSON_ARRAY(JSON_OBJECT('label','Work','href','/work'),JSON_OBJECT('label','Services','href','/services'),JSON_OBJECT('label','About','href','/about'),JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','HERO','props', JSON_OBJECT('headline','Our Services','subheadline','End-to-end creative solutions for ambitious brands.'), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','PRICING','props', JSON_OBJECT('headline','Packages','plans', JSON_ARRAY(
            JSON_OBJECT('name','Starter','price','$2,500','period','project','features', JSON_ARRAY('Logo Design','Brand Guidelines','Social Media Kit','2 Revisions'),'cta', JSON_OBJECT('label','Get Started','href','/contact')),
            JSON_OBJECT('name','Professional','price','$7,500','period','project','features', JSON_ARRAY('Full Brand Identity','Website Design','Marketing Materials','Unlimited Revisions'),'featured',TRUE,'cta', JSON_OBJECT('label','Get Started','href','/contact')),
            JSON_OBJECT('name','Enterprise','price','Custom','period','','features', JSON_ARRAY('Complete Digital Presence','Ongoing Support','Priority Access','Dedicated Team'),'cta', JSON_OBJECT('label','Contact Us','href','/contact'))
          )), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FAQ','props', JSON_OBJECT('headline','Common Questions','items', JSON_ARRAY(
            JSON_OBJECT('q','How long does a typical project take?','a','Most projects take 4-8 weeks depending on scope and complexity.'),
            JSON_OBJECT('q','Do you work with startups?','a','Absolutely! We love working with startups and offer flexible packages.'),
            JSON_OBJECT('q','What is your design process?','a','We follow a collaborative process: Discovery, Design, Development, and Launch.')
          )), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('logo', JSON_OBJECT('text','Pixel Studio'),'copyright','© 2024 Pixel Studio'), 'styles', JSON_OBJECT())
        )
      ),
      JSON_OBJECT('name','About','path','/about','meta', JSON_OBJECT('title','About - Pixel Studio','description','Meet our team'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','Pixel Studio','links', JSON_ARRAY(JSON_OBJECT('label','Work','href','/work'),JSON_OBJECT('label','Services','href','/services'),JSON_OBJECT('label','About','href','/about'),JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','HERO','props', JSON_OBJECT('headline','About Us','subheadline','We are a team of passionate designers and developers creating digital experiences since 2016.'), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','TEAM','props', JSON_OBJECT('headline','Meet the Team','members', JSON_ARRAY(
            JSON_OBJECT('name','Jordan Blake','role','Creative Director','image',''),
            JSON_OBJECT('name','Sam Rivera','role','Lead Designer','image',''),
            JSON_OBJECT('name','Alex Morgan','role','Developer','image',''),
            JSON_OBJECT('name','Casey Lee','role','Project Manager','image','')
          )), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('logo', JSON_OBJECT('text','Pixel Studio'),'copyright','© 2024 Pixel Studio'), 'styles', JSON_OBJECT())
        )
      ),
      JSON_OBJECT('name','Contact','path','/contact','meta', JSON_OBJECT('title','Contact - Pixel Studio','description','Start your project'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','Pixel Studio','links', JSON_ARRAY(JSON_OBJECT('label','Work','href','/work'),JSON_OBJECT('label','Services','href','/services'),JSON_OBJECT('label','About','href','/about'),JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','HERO','props', JSON_OBJECT('headline','Let us Talk','subheadline','Ready to start your project? We would love to hear from you.'), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','CONTACT_FORM','props', JSON_OBJECT('headline','Get in Touch','submitText','Send Message'), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('logo', JSON_OBJECT('text','Pixel Studio'),'copyright','© 2024 Pixel Studio'), 'styles', JSON_OBJECT())
        )
      )
    )
  )
);

-- Modern Portfolio Template
INSERT INTO templates (name, category, preview_image_url, structure_json)
VALUES (
  'DevFolio',
  'Portfolio',
  NULL,
  JSON_OBJECT(
    'designSystem', JSON_OBJECT(
      'colors', JSON_OBJECT('primary','#10b981','secondary','#3b82f6','background','#0f172a','surface','rgba(255,255,255,0.05)','text','#f1f5f9','mutedText','rgba(255,255,255,0.6)'),
      'typography', JSON_OBJECT('fontFamily','"JetBrains Mono", monospace','baseFontSize',16,'lineHeight',1.6,'headingWeight',700,'bodyWeight',400),
      'spacing', JSON_OBJECT('sectionY',72,'containerX',24)
    ),
    'pages', JSON_ARRAY(
      JSON_OBJECT('name','Home','path','/','meta', JSON_OBJECT('title','DevFolio - Developer Portfolio','description','Full-stack developer portfolio'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','<DevFolio />','links', JSON_ARRAY(
            JSON_OBJECT('label','About','href','/about'),
            JSON_OBJECT('label','Projects','href','/projects'),
            JSON_OBJECT('label','Blog','href','/blog'),
            JSON_OBJECT('label','Contact','href','/contact')
          ),'cta', JSON_OBJECT('label','Hire Me','href','/contact')), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','HERO','props', JSON_OBJECT('headline','Hi, I am a Full-Stack Developer','subheadline','I build modern web applications with React, Node.js, and cloud technologies. Currently available for freelance projects.',
            'primaryCta', JSON_OBJECT('label','View My Work','href','/projects'),
            'secondaryCta', JSON_OBJECT('label','Download CV','href','/contact')), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','STATS','props', JSON_OBJECT('items', JSON_ARRAY(
            JSON_OBJECT('value','5+','label','Years Experience'),
            JSON_OBJECT('value','50+','label','Projects Completed'),
            JSON_OBJECT('value','30+','label','Happy Clients'),
            JSON_OBJECT('value','99%','label','Client Satisfaction')
          )), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FEATURES','props', JSON_OBJECT('headline','Tech Stack','items', JSON_ARRAY(
            JSON_OBJECT('icon','⚛️','title','Frontend','text','React, Next.js, TypeScript, Tailwind CSS'),
            JSON_OBJECT('icon','🔧','title','Backend','text','Node.js, Express, Python, PostgreSQL'),
            JSON_OBJECT('icon','☁️','title','Cloud','text','AWS, Vercel, Docker, CI/CD'),
            JSON_OBJECT('icon','📱','title','Mobile','text','React Native, Flutter')
          )), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','CARDS','props', JSON_OBJECT('headline','Featured Projects','cards', JSON_ARRAY(
            JSON_OBJECT('title','E-commerce Platform','text','Full-stack Next.js app with Stripe integration','image','','cta', JSON_OBJECT('label','View Project','href','/projects')),
            JSON_OBJECT('title','Task Management App','text','Real-time collaboration tool with WebSockets','image','','cta', JSON_OBJECT('label','View Project','href','/projects')),
            JSON_OBJECT('title','AI Content Generator','text','OpenAI-powered writing assistant','image','','cta', JSON_OBJECT('label','View Project','href','/projects'))
          )), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','TESTIMONIALS','props', JSON_OBJECT('headline','What Clients Say','items', JSON_ARRAY(
            JSON_OBJECT('quote','Exceptional developer! Delivered our project ahead of schedule with outstanding quality.','name','Tech Startup CEO','role','San Francisco'),
            JSON_OBJECT('quote','Great communication and technical skills. Would definitely work with again.','name','Agency Director','role','New York')
          )), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','CTA','props', JSON_OBJECT('headline','Let us Work Together','description','Have a project in mind? I am currently available for freelance work.',
            'primaryCta', JSON_OBJECT('label','Get in Touch','href','/contact'),
            'secondaryCta', JSON_OBJECT('label','View Resume','href','/about')), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('logo', JSON_OBJECT('text','<DevFolio />'),'copyright','© 2024 DevFolio. Built with React.'), 'styles', JSON_OBJECT())
        )
      ),
      JSON_OBJECT('name','About','path','/about','meta', JSON_OBJECT('title','About - DevFolio','description','Learn more about me'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','<DevFolio />','links', JSON_ARRAY(JSON_OBJECT('label','About','href','/about'),JSON_OBJECT('label','Projects','href','/projects'),JSON_OBJECT('label','Blog','href','/blog'),JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','HERO','props', JSON_OBJECT('headline','About Me','subheadline','I am a passionate developer with 5+ years of experience building web applications. I love solving complex problems and creating intuitive user experiences.'), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FEATURES','props', JSON_OBJECT('headline','Skills & Expertise','items', JSON_ARRAY(
            JSON_OBJECT('icon','💻','title','Web Development','text','Building responsive, performant web applications'),
            JSON_OBJECT('icon','🎨','title','UI/UX Design','text','Creating beautiful and intuitive interfaces'),
            JSON_OBJECT('icon','🔌','title','API Development','text','RESTful and GraphQL API design'),
            JSON_OBJECT('icon','🚀','title','DevOps','text','CI/CD, containerization, and cloud deployment')
          )), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('logo', JSON_OBJECT('text','<DevFolio />'),'copyright','© 2024 DevFolio'), 'styles', JSON_OBJECT())
        )
      ),
      JSON_OBJECT('name','Projects','path','/projects','meta', JSON_OBJECT('title','Projects - DevFolio','description','My portfolio'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','<DevFolio />','links', JSON_ARRAY(JSON_OBJECT('label','About','href','/about'),JSON_OBJECT('label','Projects','href','/projects'),JSON_OBJECT('label','Blog','href','/blog'),JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','HERO','props', JSON_OBJECT('headline','My Projects','subheadline','A collection of projects I have worked on.'), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','CARDS','props', JSON_OBJECT('cards', JSON_ARRAY(
            JSON_OBJECT('title','SaaS Dashboard','text','Analytics dashboard with real-time data visualization','image',''),
            JSON_OBJECT('title','Social Media App','text','Full-stack social platform with React Native','image',''),
            JSON_OBJECT('title','Booking System','text','Appointment scheduling with calendar integration','image',''),
            JSON_OBJECT('title','CMS Platform','text','Headless CMS with custom admin panel','image',''),
            JSON_OBJECT('title','Payment Gateway','text','Secure payment processing integration','image',''),
            JSON_OBJECT('title','Chat Application','text','Real-time messaging with WebSocket','image','')
          )), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('logo', JSON_OBJECT('text','<DevFolio />'),'copyright','© 2024 DevFolio'), 'styles', JSON_OBJECT())
        )
      ),
      JSON_OBJECT('name','Blog','path','/blog','meta', JSON_OBJECT('title','Blog - DevFolio','description','Technical articles'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','<DevFolio />','links', JSON_ARRAY(JSON_OBJECT('label','About','href','/about'),JSON_OBJECT('label','Projects','href','/projects'),JSON_OBJECT('label','Blog','href','/blog'),JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','HERO','props', JSON_OBJECT('headline','Blog','subheadline','Thoughts on development, design, and technology.'), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','CARDS','props', JSON_OBJECT('cards', JSON_ARRAY(
            JSON_OBJECT('title','Building Scalable APIs','text','Best practices for API design and architecture','image',''),
            JSON_OBJECT('title','React Performance Tips','text','Optimizing your React applications','image',''),
            JSON_OBJECT('title','Getting Started with TypeScript','text','A beginner-friendly introduction','image','')
          )), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('logo', JSON_OBJECT('text','<DevFolio />'),'copyright','© 2024 DevFolio'), 'styles', JSON_OBJECT())
        )
      ),
      JSON_OBJECT('name','Contact','path','/contact','meta', JSON_OBJECT('title','Contact - DevFolio','description','Get in touch'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','<DevFolio />','links', JSON_ARRAY(JSON_OBJECT('label','About','href','/about'),JSON_OBJECT('label','Projects','href','/projects'),JSON_OBJECT('label','Blog','href','/blog'),JSON_OBJECT('label','Contact','href','/contact'))), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','HERO','props', JSON_OBJECT('headline','Get in Touch','subheadline','Have a project in mind? Let us talk about how I can help.'), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','CONTACT_FORM','props', JSON_OBJECT('headline','Send a Message','submitText','Send'), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('logo', JSON_OBJECT('text','<DevFolio />'),'copyright','© 2024 DevFolio'), 'styles', JSON_OBJECT())
        )
      )
    )
  )
);

-- Restaurant Template
INSERT INTO templates (name, category, preview_image_url, structure_json)
VALUES (
  'Bella Cucina',
  'Restaurant',
  NULL,
  JSON_OBJECT(
    'designSystem', JSON_OBJECT(
      'colors', JSON_OBJECT('primary','#d97706','secondary','#dc2626','background','#1c1917','surface','rgba(255,255,255,0.05)','text','#fafaf9','mutedText','rgba(255,255,255,0.7)'),
      'typography', JSON_OBJECT('fontFamily','"Playfair Display", Georgia, serif','baseFontSize',16,'lineHeight',1.6,'headingWeight',600,'bodyWeight',400),
      'spacing', JSON_OBJECT('sectionY',64,'containerX',24)
    ),
    'pages', JSON_ARRAY(
      JSON_OBJECT('name','Home','path','/','meta', JSON_OBJECT('title','Bella Cucina - Italian Restaurant','description','Authentic Italian cuisine'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','Bella Cucina','links', JSON_ARRAY(
            JSON_OBJECT('label','Menu','href','/menu'),
            JSON_OBJECT('label','About','href','/about'),
            JSON_OBJECT('label','Reservations','href','/reservations'),
            JSON_OBJECT('label','Contact','href','/contact')
          ),'cta', JSON_OBJECT('label','Book a Table','href','/reservations')), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','HERO','props', JSON_OBJECT('headline','Authentic Italian Cuisine','subheadline','Experience the taste of Italy in every bite. Fresh ingredients, traditional recipes, and warm hospitality.',
            'primaryCta', JSON_OBJECT('label','View Menu','href','/menu'),
            'secondaryCta', JSON_OBJECT('label','Make Reservation','href','/reservations')), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FEATURES','props', JSON_OBJECT('headline','Why Choose Us','items', JSON_ARRAY(
            JSON_OBJECT('icon','🍝','title','Fresh Pasta','text','Handmade daily using traditional techniques'),
            JSON_OBJECT('icon','🍷','title','Fine Wines','text','Curated selection from Italian vineyards'),
            JSON_OBJECT('icon','👨‍🍳','title','Expert Chefs','text','Trained in authentic Italian cooking'),
            JSON_OBJECT('icon','🌿','title','Local Ingredients','text','Farm-to-table freshness')
          )), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','CARDS','props', JSON_OBJECT('headline','Signature Dishes','cards', JSON_ARRAY(
            JSON_OBJECT('title','Truffle Risotto','text','Arborio rice with black truffle and parmesan','image',''),
            JSON_OBJECT('title','Osso Buco','text','Braised veal shanks with gremolata','image',''),
            JSON_OBJECT('title','Tiramisu','text','Classic Italian dessert with mascarpone','image','')
          )), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','TESTIMONIALS','props', JSON_OBJECT('headline','Guest Reviews','items', JSON_ARRAY(
            JSON_OBJECT('quote','The best Italian food outside of Italy! Absolutely divine.','name','Food Critic','role','Local Magazine'),
            JSON_OBJECT('quote','Perfect for special occasions. The ambiance and food are exceptional.','name','Regular Guest','role','')
          )), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','CTA','props', JSON_OBJECT('headline','Reserve Your Table','description','Join us for an unforgettable dining experience. Book your table today.',
            'primaryCta', JSON_OBJECT('label','Make Reservation','href','/reservations')), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('logo', JSON_OBJECT('text','Bella Cucina'),
            'columns', JSON_ARRAY(
              JSON_OBJECT('title','Hours','links', JSON_ARRAY(JSON_OBJECT('label','Mon-Thu: 5pm-10pm','href','#'),JSON_OBJECT('label','Fri-Sat: 5pm-11pm','href','#'),JSON_OBJECT('label','Sun: 4pm-9pm','href','#'))),
              JSON_OBJECT('title','Contact','links', JSON_ARRAY(JSON_OBJECT('label','(555) 123-4567','href','tel:5551234567'),JSON_OBJECT('label','info@bellacucina.com','href','mailto:info@bellacucina.com')))
            ),
            'copyright','© 2024 Bella Cucina. All rights reserved.'), 'styles', JSON_OBJECT())
        )
      ),
      JSON_OBJECT('name','Menu','path','/menu','meta', JSON_OBJECT('title','Menu - Bella Cucina','description','Our dishes'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','Bella Cucina','links', JSON_ARRAY(JSON_OBJECT('label','Menu','href','/menu'),JSON_OBJECT('label','About','href','/about'),JSON_OBJECT('label','Reservations','href','/reservations'))), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','HERO','props', JSON_OBJECT('headline','Our Menu','subheadline','Crafted with passion, served with love.'), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','PRICING','props', JSON_OBJECT('headline','Appetizers','plans', JSON_ARRAY(
            JSON_OBJECT('name','Bruschetta','price','$12','period','','features', JSON_ARRAY('Toasted bread','Fresh tomatoes','Basil','Olive oil')),
            JSON_OBJECT('name','Carpaccio','price','$18','period','','features', JSON_ARRAY('Beef tenderloin','Arugula','Parmesan','Truffle oil')),
            JSON_OBJECT('name','Calamari','price','$16','period','','features', JSON_ARRAY('Fried squid','Marinara sauce','Lemon'))
          )), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('logo', JSON_OBJECT('text','Bella Cucina'),'copyright','© 2024 Bella Cucina'), 'styles', JSON_OBJECT())
        )
      ),
      JSON_OBJECT('name','About','path','/about','meta', JSON_OBJECT('title','About - Bella Cucina','description','Our story'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','Bella Cucina','links', JSON_ARRAY(JSON_OBJECT('label','Menu','href','/menu'),JSON_OBJECT('label','About','href','/about'),JSON_OBJECT('label','Reservations','href','/reservations'))), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','HERO','props', JSON_OBJECT('headline','Our Story','subheadline','Founded in 2010, Bella Cucina brings the authentic flavors of Italy to your table. Our family recipes have been passed down through generations.'), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','TEAM','props', JSON_OBJECT('headline','Meet Our Chefs','members', JSON_ARRAY(
            JSON_OBJECT('name','Marco Rossi','role','Executive Chef','image',''),
            JSON_OBJECT('name','Sofia Bianchi','role','Pastry Chef','image','')
          )), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('logo', JSON_OBJECT('text','Bella Cucina'),'copyright','© 2024 Bella Cucina'), 'styles', JSON_OBJECT())
        )
      ),
      JSON_OBJECT('name','Reservations','path','/reservations','meta', JSON_OBJECT('title','Reservations - Bella Cucina','description','Book a table'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','Bella Cucina','links', JSON_ARRAY(JSON_OBJECT('label','Menu','href','/menu'),JSON_OBJECT('label','About','href','/about'),JSON_OBJECT('label','Reservations','href','/reservations'))), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','HERO','props', JSON_OBJECT('headline','Make a Reservation','subheadline','Book your table for an unforgettable dining experience.'), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','CONTACT_FORM','props', JSON_OBJECT('headline','Reserve Your Table','submitText','Book Now'), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('logo', JSON_OBJECT('text','Bella Cucina'),'copyright','© 2024 Bella Cucina'), 'styles', JSON_OBJECT())
        )
      ),
      JSON_OBJECT('name','Contact','path','/contact','meta', JSON_OBJECT('title','Contact - Bella Cucina','description','Get in touch'),
        'components', JSON_ARRAY(
          JSON_OBJECT('type','NAVBAR','props', JSON_OBJECT('logoText','Bella Cucina','links', JSON_ARRAY(JSON_OBJECT('label','Menu','href','/menu'),JSON_OBJECT('label','About','href','/about'),JSON_OBJECT('label','Reservations','href','/reservations'))), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','HERO','props', JSON_OBJECT('headline','Contact Us','subheadline','We would love to hear from you.'), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','CONTACT_FORM','props', JSON_OBJECT('headline','Send a Message','submitText','Send'), 'styles', JSON_OBJECT()),
          JSON_OBJECT('type','FOOTER','props', JSON_OBJECT('logo', JSON_OBJECT('text','Bella Cucina'),'copyright','© 2024 Bella Cucina'), 'styles', JSON_OBJECT())
        )
      )
    )
  )
);
