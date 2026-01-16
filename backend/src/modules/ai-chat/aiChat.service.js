/**
 * AI Chat Service for Website Generation
 * Supports OpenAI GPT-4 and Google Gemini with intelligent fallback
 * Features: Content Generation, Image Suggestions, Preview, Undo/History
 */

import crypto from 'node:crypto';

// In-memory conversation storage (in production, use Redis or database)
const conversations = new Map();

// Unsplash image collections by industry (free to use images)
const INDUSTRY_IMAGES = {
  restaurant: [
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200',
    'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1200',
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200',
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1200',
  ],
  portfolio: [
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200',
    'https://images.unsplash.com/photo-1522542550221-31fd8575f5a7?w=1200',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200',
  ],
  saas: [
    'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200',
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200',
    'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1200',
  ],
  ecommerce: [
    'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200',
    'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200',
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200',
    'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200',
  ],
  agency: [
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200',
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200',
    'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1200',
    'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1200',
  ],
  medical: [
    'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200',
    'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1200',
    'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=1200',
    'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=1200',
  ],
  fitness: [
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200',
    'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200',
    'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1200',
    'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=1200',
  ],
  realestate: [
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200',
  ],
  education: [
    'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200',
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200',
    'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1200',
    'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200',
  ],
  nonprofit: [
    'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1200',
    'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=1200',
    'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=1200',
    'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200',
  ],
  default: [
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200',
    'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1200',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200',
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200',
  ],
};

// Dynamic content templates with variations
const CONTENT_VARIATIONS = {
  headlines: {
    restaurant: [
      (name) => `Welcome to ${name}`,
      (name) => `Experience ${name}`,
      (name) => `Taste the Magic at ${name}`,
      (name) => `${name} - Where Flavor Meets Art`,
    ],
    portfolio: [
      (name) => `Hi, I'm ${name}`,
      (name) => `${name} - Creative Professional`,
      (name) => `Crafting Digital Excellence`,
      (name) => `${name}'s Portfolio`,
    ],
    saas: [
      (name) => `${name} - Work Smarter`,
      (name) => `Transform Your Business with ${name}`,
      (name) => `${name}: The Future of Productivity`,
      (name) => `Supercharge Your Workflow`,
    ],
    ecommerce: [
      (name) => `Shop ${name}`,
      (name) => `Discover ${name}`,
      (name) => `${name} - Quality You Can Trust`,
      (name) => `Welcome to ${name} Store`,
    ],
    agency: [
      (name) => `${name} - Digital Excellence`,
      (name) => `We Are ${name}`,
      (name) => `${name}: Crafting Digital Success`,
      (name) => `Elevate Your Brand with ${name}`,
    ],
    medical: [
      (name) => `${name} - Your Health Partner`,
      (name) => `Welcome to ${name}`,
      (name) => `${name} Healthcare`,
      (name) => `Caring for You at ${name}`,
    ],
    fitness: [
      (name) => `${name} - Transform Your Life`,
      (name) => `Get Fit with ${name}`,
      (name) => `${name} Fitness Center`,
      (name) => `Your Journey Starts at ${name}`,
    ],
    default: [
      (name) => `Welcome to ${name}`,
      (name) => `${name} - Excellence Delivered`,
      (name) => `Discover ${name}`,
      (name) => `${name} - Your Trusted Partner`,
    ],
  },
  subheadlines: {
    restaurant: [
      'Experience culinary excellence with dishes crafted from the finest ingredients.',
      'Where every meal becomes a memorable experience.',
      'Savor the flavors of tradition meets innovation.',
      'Fine dining redefined for the modern palate.',
    ],
    portfolio: [
      'Bringing creative visions to life through design and innovation.',
      'Crafting digital experiences that inspire and engage.',
      'Where creativity meets functionality.',
      'Transforming ideas into stunning visual realities.',
    ],
    saas: [
      'The all-in-one platform that streamlines your operations.',
      'Powerful tools designed for modern teams.',
      'Automate, optimize, and scale with confidence.',
      'Built for businesses that demand excellence.',
    ],
    ecommerce: [
      'Discover our curated collection of premium products.',
      'Quality products at prices you\'ll love.',
      'Shop with confidence, delivered with care.',
      'Your one-stop destination for quality and value.',
    ],
    agency: [
      'We craft digital experiences that drive results.',
      'Strategy, design, and technology united.',
      'Transforming brands through creative excellence.',
      'Your vision, our expertise, exceptional results.',
    ],
    medical: [
      'Compassionate care with cutting-edge medical expertise.',
      'Your health and well-being are our top priorities.',
      'Expert healthcare professionals dedicated to you.',
      'Where advanced medicine meets personal care.',
    ],
    fitness: [
      'Transform your body and mind with expert guidance.',
      'State-of-the-art facilities for your fitness journey.',
      'Achieve your goals with personalized training.',
      'Where dedication meets results.',
    ],
    default: [
      'Delivering excellence in everything we do.',
      'Your trusted partner for quality and innovation.',
      'Experience the difference of working with the best.',
      'Committed to exceeding your expectations.',
    ],
  },
};

// Available widget types from the builder
const WIDGET_TYPES = [
  'HEADING', 'TEXT', 'IMAGE', 'BUTTON', 'DIVIDER', 'SPACER',
  'ICON', 'ICON_BOX', 'IMAGE_BOX', 'STAR_RATING', 'COUNTER', 'PROGRESS_BAR',
  'TESTIMONIAL', 'ACCORDION', 'TABS', 'SOCIAL_ICONS',
  'NAVBAR', 'HERO', 'FEATURES', 'PRICING', 'FAQ', 'TESTIMONIALS',
  'CONTACT_FORM', 'FOOTER', 'VIDEO', 'GALLERY', 'CAROUSEL', 'LOGO_CLOUD',
  'CARDS', 'STATS', 'CTA', 'TEAM'
];

// Color palettes for different industries/moods
const COLOR_PALETTES = {
  professional: { primary: '#2563eb', secondary: '#3b82f6', background: '#0f172a', accent: '#60a5fa' },
  creative: { primary: '#8b5cf6', secondary: '#a78bfa', background: '#0c0a1d', accent: '#c4b5fd' },
  nature: { primary: '#10b981', secondary: '#34d399', background: '#022c22', accent: '#6ee7b7' },
  luxury: { primary: '#f59e0b', secondary: '#fbbf24', background: '#1c1917', accent: '#fcd34d' },
  modern: { primary: '#6366f1', secondary: '#818cf8', background: '#070a12', accent: '#a5b4fc' },
  healthcare: { primary: '#06b6d4', secondary: '#22d3ee', background: '#0c1929', accent: '#67e8f9' },
  corporate: { primary: '#0ea5e9', secondary: '#38bdf8', background: '#0f1729', accent: '#7dd3fc' },
  warm: { primary: '#f43f5e', secondary: '#fb7185', background: '#1a0a0e', accent: '#fda4af' },
  minimal: { primary: '#ffffff', secondary: '#e5e7eb', background: '#000000', accent: '#9ca3af' },
  tech: { primary: '#22c55e', secondary: '#4ade80', background: '#0a0f0a', accent: '#86efac' },
};

// Industry-specific section recommendations
const INDUSTRY_SECTIONS = {
  restaurant: ['NAVBAR', 'HERO', 'FEATURES', 'GALLERY', 'TESTIMONIALS', 'CONTACT_FORM', 'FOOTER'],
  portfolio: ['NAVBAR', 'HERO', 'GALLERY', 'STATS', 'TESTIMONIALS', 'CTA', 'CONTACT_FORM', 'FOOTER'],
  saas: ['NAVBAR', 'HERO', 'LOGO_CLOUD', 'FEATURES', 'PRICING', 'TESTIMONIALS', 'FAQ', 'CTA', 'FOOTER'],
  ecommerce: ['NAVBAR', 'HERO', 'CARDS', 'FEATURES', 'TESTIMONIALS', 'CTA', 'FOOTER'],
  agency: ['NAVBAR', 'HERO', 'LOGO_CLOUD', 'FEATURES', 'TEAM', 'TESTIMONIALS', 'CTA', 'CONTACT_FORM', 'FOOTER'],
  medical: ['NAVBAR', 'HERO', 'FEATURES', 'TEAM', 'TESTIMONIALS', 'FAQ', 'CONTACT_FORM', 'FOOTER'],
  fitness: ['NAVBAR', 'HERO', 'FEATURES', 'PRICING', 'TEAM', 'TESTIMONIALS', 'CTA', 'CONTACT_FORM', 'FOOTER'],
  realestate: ['NAVBAR', 'HERO', 'CARDS', 'FEATURES', 'TESTIMONIALS', 'TEAM', 'CONTACT_FORM', 'FOOTER'],
  education: ['NAVBAR', 'HERO', 'FEATURES', 'PRICING', 'TESTIMONIALS', 'FAQ', 'CTA', 'CONTACT_FORM', 'FOOTER'],
  nonprofit: ['NAVBAR', 'HERO', 'STATS', 'FEATURES', 'TEAM', 'TESTIMONIALS', 'CTA', 'CONTACT_FORM', 'FOOTER'],
  default: ['NAVBAR', 'HERO', 'FEATURES', 'TESTIMONIALS', 'CTA', 'CONTACT_FORM', 'FOOTER'],
};

function generateId() {
  return crypto.randomBytes(8).toString('hex');
}

// Helper to get random item from array
function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Generate dynamic content based on industry and business name
function generateDynamicContent(industry, businessName) {
  const headlines = CONTENT_VARIATIONS.headlines[industry] || CONTENT_VARIATIONS.headlines.default;
  const subheadlines = CONTENT_VARIATIONS.subheadlines[industry] || CONTENT_VARIATIONS.subheadlines.default;
  const images = INDUSTRY_IMAGES[industry] || INDUSTRY_IMAGES.default;
  
  const headlineFunc = getRandomItem(headlines);
  const headline = typeof headlineFunc === 'function' ? headlineFunc(businessName) : headlineFunc;
  const subheadline = getRandomItem(subheadlines);
  const heroImage = images[0];
  const galleryImages = images.slice(0, 4);
  
  return {
    headline,
    subheadline,
    heroImage,
    galleryImages,
    suggestedImages: images,
  };
}

// Get images for an industry (shuffled for variety)
function getIndustryImages(industry, shuffle = false) {
  const images = [...(INDUSTRY_IMAGES[industry] || INDUSTRY_IMAGES.default)];
  if (shuffle) {
    // Fisher-Yates shuffle
    for (let i = images.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [images[i], images[j]] = [images[j], images[i]];
    }
  }
  return images;
}

// Shuffle an array
function shuffleArray(arr) {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Get a random color palette (for regeneration)
function getRandomColorPalette(excludeKey = null) {
  const keys = Object.keys(COLOR_PALETTES).filter(k => k !== excludeKey);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  return { key: randomKey, palette: COLOR_PALETTES[randomKey] };
}

function getConversation(conversationId) {
  if (!conversations.has(conversationId)) {
    conversations.set(conversationId, {
      id: conversationId,
      messages: [],
      context: {},
      history: [], // For undo functionality - stores previous states
      createdAt: new Date(),
    });
  }
  return conversations.get(conversationId);
}

function addMessage(conversationId, role, content, metadata = {}) {
  const conversation = getConversation(conversationId);
  const message = {
    id: generateId(),
    role,
    content,
    metadata,
    timestamp: new Date(),
  };
  conversation.messages.push(message);
  return message;
}

// Parse user intent from message
function parseUserIntent(message) {
  const lowerMessage = message.toLowerCase().trim();
  
  const intent = {
    action: 'chat',
    websiteType: null,
    colorPreference: null,
    sections: [],
    features: [],
    businessName: null,
    industry: null,
    style: null,
    modifyType: null,
  };

  // Define color words that should NOT be treated as business names
  const colorWords = ['blue', 'red', 'green', 'purple', 'orange', 'pink', 'yellow', 'teal', 'cyan', 'warm', 'minimal', 'gold', 'luxury'];
  const isJustColorWord = colorWords.some(c => lowerMessage === c || lowerMessage === `💙 ${c}` || lowerMessage === `💜 ${c}` || lowerMessage === `💚 ${c}` || lowerMessage === `🔴 ${c}` || lowerMessage === `🩵 ${c}` || lowerMessage === `✨ ${c}` || lowerMessage.match(new RegExp(`^[🎨💙💜💚🔴🩵✨]?\\s*${c}$`, 'i')));

  // Detect if this is a pure color selection
  if (isJustColorWord) {
    intent.action = 'set_color';
    // Map the color word to a color preference
    const colorMap = {
      blue: 'modern',
      red: 'warm',
      green: 'nature',
      purple: 'creative',
      orange: 'warm',
      pink: 'creative',
      yellow: 'warm',
      teal: 'healthcare',
      cyan: 'healthcare',
      warm: 'warm',
      minimal: 'minimal',
      gold: 'luxury',
      luxury: 'luxury',
    };
    for (const [color, style] of Object.entries(colorMap)) {
      if (lowerMessage.includes(color)) {
        intent.colorPreference = style;
        intent.style = style;
        break;
      }
    }
    return intent;
  }

  // Detect modification commands FIRST (before anything else)
  const modifyPatterns = {
    change_colors: /^change\s*colors?$|^different\s*colors?$|^new\s*colors?$|change\s*the\s*colors?/i,
    add_sections: /^add\s*(more\s*)?sections?$|^more\s*sections?$|add\s*a\s*section/i,
    different_style: /^different\s*style$|^change\s*style$|^new\s*style$/i,
    add_pricing: /add\s*pricing|pricing\s*section|^💰\s*add\s*pricing/i,
    add_team: /add\s*team|team\s*section|^👥\s*add\s*team/i,
    add_faq: /add\s*faq|faq\s*section|^❓\s*add\s*faq/i,
    add_gallery: /add\s*gallery|gallery\s*section|^🖼️\s*add\s*gallery/i,
    add_stats: /add\s*stats|stats\s*section|^📊\s*add\s*stats/i,
    add_testimonials: /add\s*testimonials?|testimonials?\s*section/i,
    create_it: /^create\s*(it|the\s*website)?$|^generate\s*(it)?$|^build\s*(it)?$|^make\s*(it)?$|^yes\s*(please)?$|^do\s*it$/i,
    undo: /^undo$|^go\s*back$|^revert$|^undo\s*last/i,
    regenerate: /^regenerate$|^new\s*content$|^different\s*content$|^refresh\s*content/i,
    show_images: /^show\s*images?$|^suggest\s*images?$|^image\s*suggestions?/i,
  };

  for (const [modifyType, pattern] of Object.entries(modifyPatterns)) {
    if (pattern.test(lowerMessage)) {
      intent.action = 'modify';
      intent.modifyType = modifyType;
      return intent; // Return early - this is a modification command, not a name
    }
  }

  // Detect website creation intent
  const createPatterns = [
    /create|build|make|generate|design|i need|i want|give me/i,
    /website|site|page|landing page|homepage/i,
  ];
  
  if (createPatterns[0].test(lowerMessage) && createPatterns[1].test(lowerMessage)) {
    intent.action = 'create_website';
  }

  // Detect website type/industry - including button text patterns
  const industryPatterns = {
    restaurant: /restaurant|cafe|coffee|food|dining|bistro|eatery|bakery|pizzeria|🍽️\s*restaurant/i,
    portfolio: /portfolio|personal|freelancer|artist|photographer|designer|👤\s*portfolio/i,
    saas: /saas|software|app|startup|tech company|platform|💻\s*saas|saas\s*landing/i,
    ecommerce: /ecommerce|e-commerce|shop|store|sell|products|retail|online\s*store|🛍️/i,
    agency: /agency|marketing|digital|creative agency|design agency|business\/agency|💼\s*business|business\s*website/i,
    medical: /medical|doctor|clinic|healthcare|hospital|dental|therapy|🏥/i,
    fitness: /fitness|gym|workout|training|yoga|sports|athletic/i,
    realestate: /real estate|property|realtor|housing|apartments/i,
    education: /education|school|course|learning|training|academy|university/i,
    nonprofit: /nonprofit|charity|foundation|ngo|volunteer/i,
    law: /law|lawyer|attorney|legal|law firm/i,
    consulting: /consulting|consultant|advisory|business services/i,
  };

  for (const [industry, pattern] of Object.entries(industryPatterns)) {
    if (pattern.test(lowerMessage)) {
      intent.industry = industry;
      intent.websiteType = industry;
      break;
    }
  }

  // Detect color preferences
  const colorPatterns = {
    professional: /professional|corporate|business|formal/i,
    creative: /creative|artistic|colorful|vibrant|purple/i,
    nature: /nature|green|eco|organic|natural/i,
    luxury: /luxury|premium|gold|elegant|high-end/i,
    modern: /modern|sleek|contemporary|indigo/i,
    healthcare: /healthcare|medical|clean|cyan|teal/i,
    warm: /warm|red|passionate|energetic|bold/i,
    minimal: /minimal|minimalist|simple|black|white/i,
    tech: /tech|technology|digital|green|matrix/i,
  };

  for (const [style, pattern] of Object.entries(colorPatterns)) {
    if (pattern.test(lowerMessage)) {
      intent.colorPreference = style;
      intent.style = style;
      break;
    }
  }

  // Detect specific color mentions
  const colorMentions = {
    blue: { primary: '#3b82f6', secondary: '#60a5fa', background: '#0f172a', accent: '#93c5fd' },
    red: { primary: '#ef4444', secondary: '#f87171', background: '#1a0a0a', accent: '#fca5a5' },
    green: { primary: '#22c55e', secondary: '#4ade80', background: '#0a1a0a', accent: '#86efac' },
    purple: { primary: '#8b5cf6', secondary: '#a78bfa', background: '#0c0a1d', accent: '#c4b5fd' },
    orange: { primary: '#f97316', secondary: '#fb923c', background: '#1a0f0a', accent: '#fdba74' },
    pink: { primary: '#ec4899', secondary: '#f472b6', background: '#1a0a14', accent: '#f9a8d4' },
    yellow: { primary: '#eab308', secondary: '#facc15', background: '#1a1a0a', accent: '#fde047' },
    teal: { primary: '#14b8a6', secondary: '#2dd4bf', background: '#0a1a1a', accent: '#5eead4' },
    cyan: { primary: '#06b6d4', secondary: '#22d3ee', background: '#0a1a1f', accent: '#67e8f9' },
  };

  for (const [color, palette] of Object.entries(colorMentions)) {
    if (new RegExp(`\\b${color}\\b`, 'i').test(lowerMessage)) {
      intent.colorPreference = palette;
      break;
    }
  }

  // Detect section requests
  const sectionPatterns = {
    pricing: /pricing|plans|packages|cost/i,
    testimonials: /testimonial|review|feedback|what.*say/i,
    team: /team|staff|employees|about us|who we are/i,
    faq: /faq|questions|q&a/i,
    gallery: /gallery|photos|images|portfolio/i,
    contact: /contact|get in touch|reach|form/i,
    features: /features|services|what we do|offerings/i,
    stats: /stats|numbers|achievements|metrics/i,
  };

  for (const [section, pattern] of Object.entries(sectionPatterns)) {
    if (pattern.test(lowerMessage)) {
      intent.sections.push(section.toUpperCase());
    }
  }

  // Extract business name - multiple patterns
  let businessName = null;
  
  // Pattern 1: "called X", "named X", "for X", "name X", "it's X", "call it X"
  const namedMatch = message.match(/(?:called|named|name|for|it'?s|call\s+it)\s+["']?([A-Za-z0-9][A-Za-z0-9\s&'-]*?)["']?(?:\s*$|[,.]|\s+(?:with|and|in|using))/i);
  if (namedMatch) {
    businessName = namedMatch[1].trim();
  }
  
  // Pattern 2: Quoted text "My Business" or 'My Business'
  if (!businessName) {
    const quotedMatch = message.match(/["']([^"']+)["']/);
    if (quotedMatch) {
      businessName = quotedMatch[1].trim();
    }
  }
  
  // Pattern 3: If message is short (1-3 words) and looks like a name (no common words)
  // This handles when user just types "ardit" or "Bella Italia"
  if (!businessName) {
    const words = message.trim().split(/\s+/);
    const commonWords = ['yes', 'no', 'ok', 'okay', 'sure', 'thanks', 'thank', 'you', 'please', 'help', 'hi', 'hello', 'hey', 'the', 'a', 'an', 'is', 'it', 'i', 'my', 'me', 'we', 'create', 'make', 'build', 'want', 'need', 'website', 'site', 'page'];
    const isShortMessage = words.length <= 4;
    const startsWithCapital = /^[A-Z]/.test(message.trim());
    const noCommonWordsOnly = !words.every(w => commonWords.includes(w.toLowerCase()));
    const looksLikeName = words.some(w => /^[A-Z][a-z]+$/.test(w) || /^[A-Z]+$/.test(w));
    
    if (isShortMessage && noCommonWordsOnly && (startsWithCapital || looksLikeName || words.length === 1)) {
      // Check if it's not just an industry keyword
      const isIndustryKeyword = Object.values(industryPatterns).some(p => p.test(message));
      if (!isIndustryKeyword) {
        businessName = message.trim();
      }
    }
  }
  
  // Pattern 4: "name: X" or "name - X" format
  if (!businessName) {
    const colonMatch = message.match(/name\s*[:=-]\s*["']?([A-Za-z0-9][A-Za-z0-9\s&'-]+?)["']?\s*$/i);
    if (colonMatch) {
      businessName = colonMatch[1].trim();
    }
  }
  
  if (businessName) {
    // Clean up the name - capitalize first letter of each word
    intent.businessName = businessName
      .split(/\s+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  return intent;
}

// Generate website structure based on intent
function generateWebsiteStructure(intent, conversationContext = {}, regenerate = false) {
  const industry = intent.industry || conversationContext.industry || 'default';
  const sections = INDUSTRY_SECTIONS[industry] || INDUSTRY_SECTIONS.default;
  
  // Get color palette
  let colors;
  if (typeof intent.colorPreference === 'object') {
    colors = intent.colorPreference;
  } else if (intent.colorPreference && COLOR_PALETTES[intent.colorPreference]) {
    colors = COLOR_PALETTES[intent.colorPreference];
  } else if (intent.style && COLOR_PALETTES[intent.style]) {
    colors = COLOR_PALETTES[intent.style];
  } else {
    // Default based on industry
    const industryColorMap = {
      restaurant: 'warm',
      portfolio: 'creative',
      saas: 'modern',
      ecommerce: 'corporate',
      agency: 'creative',
      medical: 'healthcare',
      fitness: 'warm',
      realestate: 'professional',
      education: 'corporate',
      nonprofit: 'nature',
      law: 'professional',
      consulting: 'corporate',
      default: 'modern',
    };
    const colorKey = industryColorMap[industry] || 'modern';
    colors = COLOR_PALETTES[colorKey] || COLOR_PALETTES.modern;
  }

  // Ensure colors is never null
  if (!colors) {
    colors = COLOR_PALETTES.modern;
  }

  const businessName = intent.businessName || conversationContext.businessName || 'Your Business';
  
  // Generate content based on industry
  const content = generateIndustryContent(industry, businessName);

  // Add any additional sections from context
  let allSections = [...sections];
  const additionalSections = conversationContext.additionalSections || [];
  for (const section of additionalSections) {
    if (!allSections.includes(section)) {
      // Insert before FOOTER if it exists, otherwise at the end
      const footerIndex = allSections.indexOf('FOOTER');
      if (footerIndex > -1) {
        allSections.splice(footerIndex, 0, section);
      } else {
        allSections.push(section);
      }
    }
  }

  // Get suggested images for the industry (shuffle if regenerating)
  const suggestedImages = getIndustryImages(industry, regenerate);
  
  // Build the page structure with images
  const components = allSections.map((sectionType, index) => {
    return generateSectionComponent(sectionType, content, colors, index, suggestedImages);
  });

  return {
    name: businessName,
    industry,
    colors,
    suggestedImages,
    designSystem: {
      colors: {
        primary: colors.primary,
        secondary: colors.secondary,
        background: colors.background,
        surface: 'rgba(255,255,255,0.06)',
        text: 'rgba(255,255,255,0.92)',
        mutedText: 'rgba(255,255,255,0.70)',
      },
      typography: {
        fontFamily: 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial',
        baseFontSize: 16,
        lineHeight: 1.5,
        headingWeight: 600,
        bodyWeight: 400,
      },
      radius: { sm: 10, md: 16, lg: 24 },
      shadow: { card: '0 10px 30px rgba(0,0,0,0.35)' },
      buttons: { style: 'solid', radius: 12 },
      spacing: { sectionY: 64, containerX: 16 },
      brand: { name: businessName },
    },
    pages: [{
      name: 'Home',
      path: '/',
      sortOrder: 0,
      meta: {
        title: `${businessName} - ${getIndustryTagline(industry)}`,
        description: content.metaDescription,
      },
      components,
    }],
    seo: {
      title: `${businessName} - ${getIndustryTagline(industry)}`,
      description: content.metaDescription,
      keywords: content.keywords,
    },
  };
}

// Generate website structure from conversation context (used for modifications)
function generateWebsiteStructureWithExtras(conversationContext, regenerate = false) {
  const intent = {
    industry: conversationContext.industry,
    businessName: conversationContext.businessName,
    colorPreference: conversationContext.colorPreference,
    style: conversationContext.style,
  };
  return generateWebsiteStructure(intent, conversationContext, regenerate);
}

function getIndustryTagline(industry) {
  const taglines = {
    restaurant: 'Exceptional Dining Experience',
    portfolio: 'Creative Professional',
    saas: 'Innovative Software Solutions',
    ecommerce: 'Quality Products, Great Prices',
    agency: 'Creative Digital Solutions',
    medical: 'Your Health, Our Priority',
    fitness: 'Transform Your Life',
    realestate: 'Find Your Dream Home',
    education: 'Learn, Grow, Succeed',
    nonprofit: 'Making a Difference',
    law: 'Expert Legal Services',
    consulting: 'Strategic Business Solutions',
    default: 'Welcome to Our Website',
  };
  return taglines[industry] || taglines.default;
}

function generateIndustryContent(industry, businessName) {
  const contents = {
    restaurant: {
      headline: `Welcome to ${businessName}`,
      subheadline: 'Experience culinary excellence with our carefully crafted dishes made from the finest ingredients.',
      features: [
        { icon: '🍽️', title: 'Fine Dining', text: 'Exquisite dishes prepared by award-winning chefs.' },
        { icon: '🍷', title: 'Premium Selection', text: 'Curated wine list and craft cocktails.' },
        { icon: '⭐', title: 'Memorable Experience', text: 'Elegant ambiance for every occasion.' },
      ],
      cta: 'Reserve Your Table',
      metaDescription: `${businessName} offers an exceptional dining experience with fine cuisine, premium wines, and elegant atmosphere.`,
      keywords: 'restaurant, fine dining, cuisine, reservations',
    },
    portfolio: {
      headline: `Hi, I'm ${businessName}`,
      subheadline: 'Creative professional specializing in bringing ideas to life through design and innovation.',
      features: [
        { icon: '🎨', title: 'Creative Design', text: 'Unique visual solutions tailored to your brand.' },
        { icon: '💡', title: 'Innovation', text: 'Fresh perspectives and cutting-edge techniques.' },
        { icon: '🤝', title: 'Collaboration', text: 'Working closely with clients to achieve their vision.' },
      ],
      cta: 'View My Work',
      metaDescription: `${businessName} - Creative professional portfolio showcasing innovative design work and projects.`,
      keywords: 'portfolio, designer, creative, freelancer',
    },
    saas: {
      headline: `${businessName}`,
      subheadline: 'The all-in-one platform that helps you streamline operations and accelerate growth.',
      features: [
        { icon: '⚡', title: 'Lightning Fast', text: 'Optimized performance for seamless user experience.' },
        { icon: '🔒', title: 'Enterprise Security', text: 'Bank-level encryption and compliance.' },
        { icon: '📊', title: 'Powerful Analytics', text: 'Data-driven insights to grow your business.' },
      ],
      cta: 'Start Free Trial',
      metaDescription: `${businessName} - Powerful software platform for modern businesses. Streamline operations and accelerate growth.`,
      keywords: 'software, saas, platform, business tools',
    },
    ecommerce: {
      headline: `Shop ${businessName}`,
      subheadline: 'Discover our curated collection of premium products at unbeatable prices.',
      features: [
        { icon: '🚚', title: 'Free Shipping', text: 'On all orders over $50.' },
        { icon: '↩️', title: 'Easy Returns', text: '30-day hassle-free return policy.' },
        { icon: '💳', title: 'Secure Checkout', text: 'Protected payments with SSL encryption.' },
      ],
      cta: 'Shop Now',
      metaDescription: `${businessName} - Shop premium products with free shipping, easy returns, and secure checkout.`,
      keywords: 'shop, store, products, online shopping',
    },
    agency: {
      headline: `${businessName}`,
      subheadline: 'We craft digital experiences that drive results and elevate brands.',
      features: [
        { icon: '🎯', title: 'Strategy', text: 'Data-driven strategies for maximum impact.' },
        { icon: '✨', title: 'Design', text: 'Beautiful, functional designs that convert.' },
        { icon: '📈', title: 'Growth', text: 'Proven methods to scale your business.' },
      ],
      cta: 'Start Your Project',
      metaDescription: `${businessName} - Digital agency specializing in strategy, design, and growth for modern brands.`,
      keywords: 'agency, digital marketing, design, branding',
    },
    medical: {
      headline: `${businessName}`,
      subheadline: 'Compassionate healthcare with cutting-edge medical expertise.',
      features: [
        { icon: '👨‍⚕️', title: 'Expert Team', text: 'Board-certified physicians and specialists.' },
        { icon: '🏥', title: 'Modern Facilities', text: 'State-of-the-art medical equipment.' },
        { icon: '❤️', title: 'Patient Care', text: 'Personalized treatment plans for every patient.' },
      ],
      cta: 'Book Appointment',
      metaDescription: `${businessName} - Quality healthcare with expert physicians and modern facilities.`,
      keywords: 'healthcare, medical, doctor, clinic',
    },
    fitness: {
      headline: `${businessName}`,
      subheadline: 'Transform your body and mind with our expert-led fitness programs.',
      features: [
        { icon: '💪', title: 'Personal Training', text: 'One-on-one sessions with certified trainers.' },
        { icon: '🏋️', title: 'Modern Equipment', text: 'Top-of-the-line fitness machines.' },
        { icon: '🧘', title: 'Group Classes', text: 'Yoga, HIIT, spinning, and more.' },
      ],
      cta: 'Join Today',
      metaDescription: `${businessName} - Premier fitness center with personal training, modern equipment, and group classes.`,
      keywords: 'gym, fitness, training, workout',
    },
    realestate: {
      headline: `${businessName}`,
      subheadline: 'Find your perfect property with our expert real estate services.',
      features: [
        { icon: '🏠', title: 'Premium Listings', text: 'Exclusive properties in prime locations.' },
        { icon: '🔑', title: 'Expert Agents', text: 'Experienced professionals guiding your journey.' },
        { icon: '📋', title: 'Full Service', text: 'From search to closing, we handle it all.' },
      ],
      cta: 'Browse Properties',
      metaDescription: `${businessName} - Expert real estate services with premium listings and dedicated agents.`,
      keywords: 'real estate, property, homes, realtor',
    },
    education: {
      headline: `${businessName}`,
      subheadline: 'Unlock your potential with our comprehensive learning programs.',
      features: [
        { icon: '📚', title: 'Expert Instructors', text: 'Learn from industry professionals.' },
        { icon: '🎓', title: 'Certified Programs', text: 'Accredited courses and certifications.' },
        { icon: '💻', title: 'Flexible Learning', text: 'Study at your own pace, anywhere.' },
      ],
      cta: 'Explore Courses',
      metaDescription: `${businessName} - Quality education with expert instructors and flexible learning options.`,
      keywords: 'education, courses, learning, training',
    },
    nonprofit: {
      headline: `${businessName}`,
      subheadline: 'Together, we can make a lasting difference in our community.',
      features: [
        { icon: '🌍', title: 'Global Impact', text: 'Programs reaching communities worldwide.' },
        { icon: '🤲', title: 'Volunteer', text: 'Join our network of dedicated volunteers.' },
        { icon: '💝', title: 'Donate', text: 'Every contribution makes a difference.' },
      ],
      cta: 'Get Involved',
      metaDescription: `${businessName} - Nonprofit organization making a positive impact in communities worldwide.`,
      keywords: 'nonprofit, charity, donate, volunteer',
    },
    default: {
      headline: `Welcome to ${businessName}`,
      subheadline: 'We provide exceptional services tailored to your needs.',
      features: [
        { icon: '⭐', title: 'Quality Service', text: 'Committed to excellence in everything we do.' },
        { icon: '🤝', title: 'Customer Focus', text: 'Your satisfaction is our top priority.' },
        { icon: '💡', title: 'Innovation', text: 'Always improving to serve you better.' },
      ],
      cta: 'Get Started',
      metaDescription: `${businessName} - Quality services and solutions for your needs.`,
      keywords: 'business, services, solutions',
    },
  };

  return contents[industry] || contents.default;
}

function generateSectionComponent(sectionType, content, colors, index, images = []) {
  // Ensure colors is never null
  if (!colors) {
    colors = COLOR_PALETTES.modern;
  }

  // Get images for different sections
  const heroImage = images[0] || '';
  const galleryImages = images.slice(0, 4) || [];
  const cardImages = images.slice(0, 3) || [];

  const components = {
    NAVBAR: {
      type: 'NAVBAR',
      orderIndex: index,
      props: {
        logo: { text: content.headline?.split(' ').slice(-1)[0] || 'Logo', image: '' },
        links: [
          { label: 'Home', href: '/' },
          { label: 'About', href: '#about' },
          { label: 'Services', href: '#services' },
          { label: 'Contact', href: '#contact' },
        ],
        cta: { label: content.cta || 'Get Started', href: '#contact' },
      },
      styles: {
        backgroundColor: 'transparent',
        padding: '16px 0',
      },
    },
    HERO: {
      type: 'HERO',
      orderIndex: index,
      props: {
        headline: content.headline,
        subheadline: content.subheadline,
        primaryCta: { label: content.cta || 'Get Started', href: '#contact' },
        secondaryCta: { label: 'Learn More', href: '#about' },
        image: heroImage,
        backgroundImage: heroImage,
      },
      styles: {
        textAlign: 'center',
        padding: '100px 0',
        background: `linear-gradient(135deg, ${colors.background} 0%, ${colors.primary}15 100%)`,
      },
    },
    LOGO_CLOUD: {
      type: 'LOGO_CLOUD',
      orderIndex: index,
      props: {
        label: 'Trusted by leading companies',
        logos: [
          { src: '', alt: 'Company 1' },
          { src: '', alt: 'Company 2' },
          { src: '', alt: 'Company 3' },
          { src: '', alt: 'Company 4' },
          { src: '', alt: 'Company 5' },
        ],
      },
      styles: {},
    },
    FEATURES: {
      type: 'FEATURES',
      orderIndex: index,
      props: {
        headline: 'Why Choose Us',
        items: content.features || [
          { icon: '⭐', title: 'Feature 1', text: 'Description of feature 1.' },
          { icon: '🚀', title: 'Feature 2', text: 'Description of feature 2.' },
          { icon: '💡', title: 'Feature 3', text: 'Description of feature 3.' },
        ],
      },
      styles: {},
    },
    PRICING: {
      type: 'PRICING',
      orderIndex: index,
      props: {
        headline: 'Simple, Transparent Pricing',
        plans: [
          { name: 'Starter', price: '$29', period: '/month', features: ['Feature 1', 'Feature 2', 'Feature 3'], cta: { label: 'Get Started', href: '#' } },
          { name: 'Professional', price: '$79', period: '/month', features: ['Everything in Starter', 'Feature 4', 'Feature 5', 'Priority Support'], cta: { label: 'Get Started', href: '#' }, featured: true },
          { name: 'Enterprise', price: '$199', period: '/month', features: ['Everything in Pro', 'Feature 6', 'Feature 7', 'Dedicated Support'], cta: { label: 'Contact Us', href: '#' } },
        ],
      },
      styles: {},
    },
    TESTIMONIALS: {
      type: 'TESTIMONIALS',
      orderIndex: index,
      props: {
        headline: 'What Our Clients Say',
        items: [
          { quote: 'Absolutely amazing service! They exceeded all our expectations.', name: 'Sarah Johnson', role: 'CEO, TechCorp', image: '' },
          { quote: 'Professional, reliable, and truly dedicated to their clients.', name: 'Michael Chen', role: 'Founder, StartupXYZ', image: '' },
          { quote: 'The best decision we made for our business. Highly recommended!', name: 'Emily Davis', role: 'Director, InnovateCo', image: '' },
        ],
      },
      styles: {},
    },
    FAQ: {
      type: 'FAQ',
      orderIndex: index,
      props: {
        headline: 'Frequently Asked Questions',
        items: [
          { q: 'How do I get started?', a: 'Simply click the Get Started button and follow the easy setup process.' },
          { q: 'What payment methods do you accept?', a: 'We accept all major credit cards, PayPal, and bank transfers.' },
          { q: 'Can I cancel anytime?', a: 'Yes, you can cancel your subscription at any time with no hidden fees.' },
          { q: 'Do you offer support?', a: 'Yes, we offer 24/7 customer support via email, chat, and phone.' },
        ],
      },
      styles: {},
    },
    TEAM: {
      type: 'TEAM',
      orderIndex: index,
      props: {
        headline: 'Meet Our Team',
        members: [
          { name: 'John Smith', role: 'CEO & Founder', image: '', bio: 'Visionary leader with 15+ years of experience.' },
          { name: 'Sarah Johnson', role: 'Creative Director', image: '', bio: 'Award-winning designer passionate about innovation.' },
          { name: 'Mike Chen', role: 'Lead Developer', image: '', bio: 'Full-stack expert building scalable solutions.' },
        ],
      },
      styles: {},
    },
    STATS: {
      type: 'STATS',
      orderIndex: index,
      props: {
        items: [
          { value: '10K+', label: 'Happy Customers' },
          { value: '99%', label: 'Satisfaction Rate' },
          { value: '24/7', label: 'Support Available' },
          { value: '50+', label: 'Countries Served' },
        ],
      },
      styles: {},
    },
    GALLERY: {
      type: 'GALLERY',
      orderIndex: index,
      props: {
        images: galleryImages,
        columns: 3,
        gap: '16px',
      },
      styles: {},
    },
    CARDS: {
      type: 'CARDS',
      orderIndex: index,
      props: {
        cards: [
          { title: 'Service One', text: 'Description of your first service or product.', image: cardImages[0] || '', cta: { label: 'Learn More', href: '#' } },
          { title: 'Service Two', text: 'Description of your second service or product.', image: cardImages[1] || '', cta: { label: 'Learn More', href: '#' } },
          { title: 'Service Three', text: 'Description of your third service or product.', image: cardImages[2] || '', cta: { label: 'Learn More', href: '#' } },
        ],
      },
      styles: {},
    },
    CTA: {
      type: 'CTA',
      orderIndex: index,
      props: {
        headline: 'Ready to Get Started?',
        description: 'Join thousands of satisfied customers and take your business to the next level.',
        primaryCta: { label: content.cta || 'Get Started Now', href: '#contact' },
        secondaryCta: { label: 'Contact Sales', href: '#contact' },
      },
      styles: {
        backgroundColor: `${colors.primary}15`,
        padding: '64px',
        borderRadius: '24px',
        textAlign: 'center',
      },
    },
    CONTACT_FORM: {
      type: 'CONTACT_FORM',
      orderIndex: index,
      props: {
        headline: 'Get in Touch',
        fields: [
          { type: 'text', label: 'Name', placeholder: 'Your name', required: true },
          { type: 'email', label: 'Email', placeholder: 'your@email.com', required: true },
          { type: 'text', label: 'Subject', placeholder: 'How can we help?', required: false },
          { type: 'textarea', label: 'Message', placeholder: 'Your message...', required: true },
        ],
        submitText: 'Send Message',
      },
      styles: {},
    },
    FOOTER: {
      type: 'FOOTER',
      orderIndex: index,
      props: {
        logo: { text: content.headline?.split(' ').slice(-1)[0] || 'Logo', image: '' },
        columns: [
          { title: 'Company', links: [{ label: 'About', href: '#' }, { label: 'Careers', href: '#' }, { label: 'Press', href: '#' }] },
          { title: 'Support', links: [{ label: 'Help Center', href: '#' }, { label: 'Contact', href: '#' }, { label: 'FAQ', href: '#' }] },
          { title: 'Legal', links: [{ label: 'Privacy', href: '#' }, { label: 'Terms', href: '#' }] },
        ],
        copyright: `© ${new Date().getFullYear()} ${content.headline?.split(' ').slice(-1)[0] || 'Company'}. All rights reserved.`,
        socialLinks: [
          { platform: 'twitter', url: '#' },
          { platform: 'facebook', url: '#' },
          { platform: 'instagram', url: '#' },
          { platform: 'linkedin', url: '#' },
        ],
      },
      styles: {
        backgroundColor: 'rgba(0,0,0,0.3)',
        padding: '48px 0 24px',
      },
    },
  };

  return components[sectionType] || components.FEATURES;
}

// Generate AI response based on conversation
async function generateAIResponse(message, conversationId, userId) {
  const conversation = getConversation(conversationId);
  const intent = parseUserIntent(message);
  
  // Save current state to history before making changes (for undo functionality)
  if (intent.action !== 'modify' || intent.modifyType !== 'undo') {
    if (!conversation.history) conversation.history = [];
    conversation.history.push(JSON.parse(JSON.stringify(conversation.context)));
    // Keep only last 10 states to prevent memory bloat
    if (conversation.history.length > 10) conversation.history.shift();
  }
  
  // Update conversation context
  if (intent.industry) conversation.context.industry = intent.industry;
  if (intent.businessName) conversation.context.businessName = intent.businessName;
  if (intent.colorPreference) conversation.context.colorPreference = intent.colorPreference;
  
  // Add user message
  addMessage(conversationId, 'user', message, { intent });

  let responseText = '';
  let websiteStructure = null;
  let suggestedActions = [];

  // Handle color selection
  if (intent.action === 'set_color') {
    // Update the color in context
    conversation.context.colorPreference = intent.colorPreference;
    conversation.context.style = intent.style;
    
    const colorName = intent.style ? intent.style.charAt(0).toUpperCase() + intent.style.slice(1) : 'Custom';
    responseText = `✅ **Color updated to ${colorName}!**\n\n`;
    
    // If we have enough info, regenerate the website structure
    if (conversation.context.industry && conversation.context.businessName) {
      websiteStructure = generateWebsiteStructureWithExtras(conversation.context);
      
      responseText += `**Updated Website:**\n`;
      responseText += `- **Name:** ${websiteStructure.name}\n`;
      responseText += `- **Style:** ${colorName} theme\n`;
      responseText += `- **Primary Color:** ${websiteStructure.colors.primary}\n`;
      responseText += `- **Sections:** ${websiteStructure.pages[0].components.length} sections\n\n`;
      responseText += `Click **"Create Website"** to generate with the new colors!`;
      
      suggestedActions = [
        { type: 'create_website', label: 'Create Website', data: websiteStructure },
        { type: 'modify', label: 'Change Colors' },
        { type: 'modify', label: 'Add More Sections' },
      ];
    } else {
      responseText += `Great choice! Now tell me what type of website you need and your business name.`;
      suggestedActions = [
        { type: 'suggest', label: '🍽️ Restaurant' },
        { type: 'suggest', label: '💼 Business/Agency' },
        { type: 'suggest', label: '🛍️ E-commerce' },
      ];
    }
  }
  // Handle modification commands
  else if (intent.action === 'modify') {
    const modifyType = intent.modifyType;
    
    if (modifyType === 'change_colors') {
      responseText = `🎨 **Let's change the colors!**\n\nChoose a color scheme:\n\n`;
      responseText += `- **Blue** - Professional, trustworthy\n`;
      responseText += `- **Purple** - Creative, innovative\n`;
      responseText += `- **Green** - Natural, growth-focused\n`;
      responseText += `- **Red/Warm** - Bold, energetic\n`;
      responseText += `- **Teal/Cyan** - Modern, fresh\n`;
      responseText += `- **Gold/Luxury** - Premium, elegant\n`;
      responseText += `- **Minimal** - Black & white, clean\n\n`;
      responseText += `Just type the color you want (e.g., "blue", "purple", "warm")`;
      
      suggestedActions = [
        { type: 'suggest', label: '💙 Blue' },
        { type: 'suggest', label: '💜 Purple' },
        { type: 'suggest', label: '💚 Green' },
        { type: 'suggest', label: '🔴 Warm/Red' },
        { type: 'suggest', label: '🩵 Teal' },
        { type: 'suggest', label: '✨ Minimal' },
      ];
    } else if (modifyType === 'add_sections' || modifyType === 'different_style') {
      responseText = `📦 **What sections would you like to add?**\n\n`;
      responseText += `Available sections:\n`;
      responseText += `- **Pricing** - Show your plans and packages\n`;
      responseText += `- **Team** - Introduce your team members\n`;
      responseText += `- **FAQ** - Answer common questions\n`;
      responseText += `- **Gallery** - Showcase images/portfolio\n`;
      responseText += `- **Testimonials** - Customer reviews\n`;
      responseText += `- **Stats** - Key numbers and achievements\n\n`;
      responseText += `Just tell me which sections to add!`;
      
      suggestedActions = [
        { type: 'suggest', label: '💰 Add Pricing' },
        { type: 'suggest', label: '👥 Add Team' },
        { type: 'suggest', label: '❓ Add FAQ' },
        { type: 'suggest', label: '🖼️ Add Gallery' },
        { type: 'suggest', label: '📊 Add Stats' },
      ];
    } else if (modifyType === 'add_pricing') {
      // Add pricing to context and regenerate
      if (!conversation.context.additionalSections) conversation.context.additionalSections = [];
      if (!conversation.context.additionalSections.includes('PRICING')) {
        conversation.context.additionalSections.push('PRICING');
      }
      responseText = `✅ **Pricing section added!**\n\nI've added a pricing section to your website. `;
      
      // Regenerate with new section
      if (conversation.context.industry && conversation.context.businessName) {
        websiteStructure = generateWebsiteStructureWithExtras(conversation.context);
        responseText += `\n\n**Updated Sections:** ${websiteStructure.pages[0].components.length} sections\n`;
        websiteStructure.pages[0].components.forEach((comp, i) => {
          responseText += `${i + 1}. ${comp.type.replace(/_/g, ' ')}\n`;
        });
        responseText += `\nClick **"Create Website"** to generate!`;
        suggestedActions = [
          { type: 'create_website', label: 'Create Website', data: websiteStructure },
          { type: 'modify', label: 'Add More Sections' },
        ];
      } else {
        responseText += `Would you like to add more sections?`;
        suggestedActions = [
          { type: 'suggest', label: '👥 Add Team' },
          { type: 'suggest', label: '❓ Add FAQ' },
          { type: 'suggest', label: '🖼️ Add Gallery' },
        ];
      }
    } else if (modifyType === 'add_team') {
      if (!conversation.context.additionalSections) conversation.context.additionalSections = [];
      if (!conversation.context.additionalSections.includes('TEAM')) {
        conversation.context.additionalSections.push('TEAM');
      }
      responseText = `✅ **Team section added!** Your website will now showcase your team members.`;
      // Regenerate to update preview
      if (conversation.context.industry && conversation.context.businessName) {
        websiteStructure = generateWebsiteStructureWithExtras(conversation.context);
        suggestedActions = [
          { type: 'create_website', label: 'Create Website', data: websiteStructure },
          { type: 'modify', label: 'Add More Sections' },
        ];
      } else {
        suggestedActions = [
          { type: 'suggest', label: '💰 Add Pricing' },
          { type: 'suggest', label: '❓ Add FAQ' },
          { type: 'suggest', label: '✅ Create Website' },
        ];
      }
    } else if (modifyType === 'add_faq') {
      if (!conversation.context.additionalSections) conversation.context.additionalSections = [];
      if (!conversation.context.additionalSections.includes('FAQ')) {
        conversation.context.additionalSections.push('FAQ');
      }
      responseText = `✅ **FAQ section added!** Your website will include a frequently asked questions section.`;
      // Regenerate to update preview
      if (conversation.context.industry && conversation.context.businessName) {
        websiteStructure = generateWebsiteStructureWithExtras(conversation.context);
        suggestedActions = [
          { type: 'create_website', label: 'Create Website', data: websiteStructure },
          { type: 'modify', label: 'Add More Sections' },
        ];
      } else {
        suggestedActions = [
          { type: 'suggest', label: '💰 Add Pricing' },
          { type: 'suggest', label: '👥 Add Team' },
          { type: 'suggest', label: '✅ Create Website' },
        ];
      }
    } else if (modifyType === 'add_gallery') {
      if (!conversation.context.additionalSections) conversation.context.additionalSections = [];
      if (!conversation.context.additionalSections.includes('GALLERY')) {
        conversation.context.additionalSections.push('GALLERY');
      }
      responseText = `✅ **Gallery section added!** Your website will include an image gallery.`;
      // Regenerate to update preview
      if (conversation.context.industry && conversation.context.businessName) {
        websiteStructure = generateWebsiteStructureWithExtras(conversation.context);
        suggestedActions = [
          { type: 'create_website', label: 'Create Website', data: websiteStructure },
          { type: 'modify', label: 'Add More Sections' },
        ];
      } else {
        suggestedActions = [
          { type: 'suggest', label: '💰 Add Pricing' },
          { type: 'suggest', label: '👥 Add Team' },
          { type: 'suggest', label: '✅ Create Website' },
        ];
      }
    } else if (modifyType === 'add_stats') {
      if (!conversation.context.additionalSections) conversation.context.additionalSections = [];
      if (!conversation.context.additionalSections.includes('STATS')) {
        conversation.context.additionalSections.push('STATS');
      }
      responseText = `✅ **Stats section added!** Your website will include key metrics and achievements.`;
      // Regenerate to update preview
      if (conversation.context.industry && conversation.context.businessName) {
        websiteStructure = generateWebsiteStructureWithExtras(conversation.context);
        suggestedActions = [
          { type: 'create_website', label: 'Create Website', data: websiteStructure },
          { type: 'modify', label: 'Add More Sections' },
        ];
      } else {
        suggestedActions = [
          { type: 'suggest', label: '💰 Add Pricing' },
          { type: 'suggest', label: '👥 Add Team' },
          { type: 'suggest', label: '✅ Create Website' },
        ];
      }
    } else if (modifyType === 'create_it') {
      // User wants to create the website now
      if (conversation.context.industry && conversation.context.businessName) {
        websiteStructure = generateWebsiteStructureWithExtras(conversation.context);
        
        const industryName = conversation.context.industry;
        const businessName = conversation.context.businessName;
        
        responseText = `🚀 **Creating your ${industryName} website for ${businessName}!**\n\n`;
        responseText += `**Website Details:**\n`;
        responseText += `- **Name:** ${websiteStructure.name}\n`;
        responseText += `- **Primary Color:** ${websiteStructure.colors.primary}\n`;
        responseText += `- **Sections:** ${websiteStructure.pages[0].components.length} sections\n\n`;
        responseText += `Click **"Create Website"** below to generate it!`;
        
        suggestedActions = [
          { type: 'create_website', label: 'Create Website', data: websiteStructure },
        ];
      } else {
        responseText = `I need a bit more info first. What type of website do you need and what's the name?`;
        suggestedActions = [
          { type: 'suggest', label: '🍽️ Restaurant' },
          { type: 'suggest', label: '💼 Business/Agency' },
          { type: 'suggest', label: '🛍️ E-commerce' },
        ];
      }
    } else if (modifyType === 'undo') {
      // Undo last change
      if (conversation.history && conversation.history.length > 0) {
        const previousState = conversation.history.pop();
        conversation.context = { ...previousState };
        
        responseText = `⏪ **Undone!** I've reverted to your previous configuration.\n\n`;
        responseText += `**Current Settings:**\n`;
        responseText += `- **Industry:** ${conversation.context.industry || 'Not set'}\n`;
        responseText += `- **Name:** ${conversation.context.businessName || 'Not set'}\n`;
        responseText += `- **Style:** ${conversation.context.colorPreference || 'Default'}\n`;
        
        if (conversation.context.industry && conversation.context.businessName) {
          websiteStructure = generateWebsiteStructureWithExtras(conversation.context);
          suggestedActions = [
            { type: 'create_website', label: 'Create Website', data: websiteStructure },
            { type: 'modify', label: 'Change Colors' },
            { type: 'modify', label: 'Add Sections' },
          ];
        } else {
          suggestedActions = [
            { type: 'suggest', label: '🍽️ Restaurant' },
            { type: 'suggest', label: '💼 Business/Agency' },
          ];
        }
      } else {
        responseText = `⚠️ **Nothing to undo!** This is the beginning of our conversation.`;
        suggestedActions = [
          { type: 'suggest', label: '🍽️ Restaurant' },
          { type: 'suggest', label: '💼 Business/Agency' },
        ];
      }
    } else if (modifyType === 'regenerate') {
      // Regenerate content with new variations - shuffle images AND colors
      if (conversation.context.industry && conversation.context.businessName) {
        // Get a new random color palette (different from current)
        const currentColorKey = conversation.context.colorPreference || conversation.context.style;
        const newColor = getRandomColorPalette(currentColorKey);
        conversation.context.colorPreference = newColor.key;
        conversation.context.style = newColor.key;
        
        // Force new content generation with shuffled images
        websiteStructure = generateWebsiteStructureWithExtras(conversation.context, true);
        
        const heroComponent = websiteStructure.pages[0].components.find(c => c.type === 'HERO');
        
        responseText = `🔄 **Fresh content, colors & images generated!**\n\n`;
        responseText += `**New Website Preview:**\n`;
        responseText += `- **Headline:** ${heroComponent?.props?.headline || 'N/A'}\n`;
        responseText += `- **Color Theme:** ${newColor.key.charAt(0).toUpperCase() + newColor.key.slice(1)}\n`;
        responseText += `- **Hero Image:** New image selected\n`;
        responseText += `- **Sections:** ${websiteStructure.pages[0].components.length} sections\n\n`;
        responseText += `Click **"Create Website"** if you like this version, or **"Regenerate"** again for different content!`;
        
        suggestedActions = [
          { type: 'create_website', label: 'Create Website', data: websiteStructure },
          { type: 'suggest', label: '🔄 Regenerate' },
          { type: 'modify', label: 'Change Colors' },
        ];
      } else {
        responseText = `I need to know your website type and name first before I can generate content.`;
        suggestedActions = [
          { type: 'suggest', label: '🍽️ Restaurant' },
          { type: 'suggest', label: '💼 Business/Agency' },
        ];
      }
    } else if (modifyType === 'show_images') {
      // Show image suggestions for the industry
      const industry = conversation.context.industry || 'default';
      const images = getIndustryImages(industry);
      
      responseText = `🖼️ **Suggested Images for Your ${industry.charAt(0).toUpperCase() + industry.slice(1)} Website:**\n\n`;
      responseText += `I've selected these professional images that would work great for your website:\n\n`;
      images.forEach((img, i) => {
        responseText += `${i + 1}. [Image ${i + 1}](${img})\n`;
      });
      responseText += `\nThese images will be automatically included in your hero section and gallery when you create the website.`;
      
      suggestedActions = [
        { type: 'suggest', label: '✅ Create Website' },
        { type: 'modify', label: 'Change Colors' },
        { type: 'modify', label: 'Add Sections' },
      ];
    } else {
      responseText = `I can help you modify the website. What would you like to change?`;
      suggestedActions = [
        { type: 'modify', label: 'Change Colors' },
        { type: 'modify', label: 'Add More Sections' },
        { type: 'suggest', label: '🔄 Regenerate' },
        { type: 'suggest', label: '⏪ Undo' },
      ];
    }
  } else if (intent.action === 'create_website') {
    // Generate website structure
    websiteStructure = generateWebsiteStructure(intent, conversation.context);
    
    const industryName = intent.industry || 'business';
    const colorStyle = intent.style || intent.colorPreference || 'modern';
    
    responseText = `I'll create a professional ${industryName} website for you! 🎨\n\n`;
    responseText += `**Website Details:**\n`;
    responseText += `- **Name:** ${websiteStructure.name}\n`;
    responseText += `- **Style:** ${typeof colorStyle === 'string' ? colorStyle.charAt(0).toUpperCase() + colorStyle.slice(1) : 'Custom'} theme\n`;
    responseText += `- **Primary Color:** ${websiteStructure.colors.primary}\n`;
    responseText += `- **Sections:** ${websiteStructure.pages[0].components.length} sections\n\n`;
    responseText += `**Included Sections:**\n`;
    websiteStructure.pages[0].components.forEach((comp, i) => {
      responseText += `${i + 1}. ${comp.type.replace(/_/g, ' ')}\n`;
    });
    responseText += `\nClick **"Create Website"** below to generate this website, or tell me if you'd like any changes!`;

    suggestedActions = [
      { type: 'create_website', label: 'Create Website', data: websiteStructure },
      { type: 'modify', label: 'Change Colors' },
      { type: 'modify', label: 'Add More Sections' },
      { type: 'modify', label: 'Different Style' },
    ];
  } else {
    // Check if we have enough context to generate a website
    const hasIndustry = conversation.context.industry || intent.industry;
    const hasName = conversation.context.businessName || intent.businessName;
    
    // If we now have both industry and name, generate the website!
    if (hasIndustry && hasName) {
      // We have enough info - generate the website
      websiteStructure = generateWebsiteStructure(intent, conversation.context);
      
      const industryName = conversation.context.industry || intent.industry;
      const businessName = conversation.context.businessName || intent.businessName;
      const colorStyle = conversation.context.colorPreference || intent.style || intent.colorPreference || 'modern';
      
      responseText = `Perfect! I'll create a professional ${industryName} website for **${businessName}**! 🎨\n\n`;
      responseText += `**Website Details:**\n`;
      responseText += `- **Name:** ${websiteStructure.name}\n`;
      responseText += `- **Style:** ${typeof colorStyle === 'string' ? colorStyle.charAt(0).toUpperCase() + colorStyle.slice(1) : 'Custom'} theme\n`;
      responseText += `- **Primary Color:** ${websiteStructure.colors.primary}\n`;
      responseText += `- **Sections:** ${websiteStructure.pages[0].components.length} sections\n\n`;
      responseText += `**Included Sections:**\n`;
      websiteStructure.pages[0].components.forEach((comp, i) => {
        responseText += `${i + 1}. ${comp.type.replace(/_/g, ' ')}\n`;
      });
      responseText += `\nClick **"Create Website"** below to generate this website, or tell me if you'd like any changes!`;

      suggestedActions = [
        { type: 'create_website', label: 'Create Website', data: websiteStructure },
        { type: 'modify', label: 'Change Colors' },
        { type: 'modify', label: 'Add More Sections' },
        { type: 'modify', label: 'Different Style' },
      ];
    } else if (!hasIndustry) {
      // Need industry type
      responseText = `I'd love to help you create a website! To get started, could you tell me:\n\n`;
      responseText += `1. **What type of website** do you need? (e.g., restaurant, portfolio, SaaS, agency, etc.)\n`;
      responseText += `2. **Your business/project name**\n`;
      responseText += `3. **Any color or style preferences**\n\n`;
      responseText += `Or just describe what you're looking for, and I'll design something perfect for you! 🚀`;
      
      suggestedActions = [
        { type: 'suggest', label: '🍽️ Restaurant' },
        { type: 'suggest', label: '💼 Business/Agency' },
        { type: 'suggest', label: '🛍️ E-commerce' },
        { type: 'suggest', label: '👤 Portfolio' },
        { type: 'suggest', label: '💻 SaaS/Tech' },
        { type: 'suggest', label: '🏥 Medical/Healthcare' },
      ];
    } else {
      // Have industry but need name
      const industry = conversation.context.industry || intent.industry;
      responseText = `Great choice! I'll create a ${industry} website for you. 🎯\n\n`;
      responseText += `**What would you like to name your website/business?**\n\n`;
      responseText += `Just type the name (e.g., "Bella Italia", "TechStart", "John's Portfolio")`;
      
      suggestedActions = [];
    }
  }

  // Add assistant message
  const assistantMessage = addMessage(conversationId, 'assistant', responseText, {
    websiteStructure,
    suggestedActions,
  });

  return {
    message: assistantMessage,
    websiteStructure,
    suggestedActions,
    conversationContext: conversation.context,
  };
}

// Try to use OpenAI if available
async function tryOpenAI(message, conversationHistory) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are an AI website builder assistant. Help users create professional websites by understanding their needs and generating appropriate website structures. Available widget types: ${WIDGET_TYPES.join(', ')}. Always be helpful and suggest improvements.`,
          },
          ...conversationHistory.map(m => ({ role: m.role, content: m.content })),
          { role: 'user', content: message },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) return null;
    const data = await response.json();
    return data.choices?.[0]?.message?.content;
  } catch {
    return null;
  }
}

export const aiChatService = {
  generateId,
  getConversation,
  addMessage,
  parseUserIntent,
  generateWebsiteStructure,
  generateAIResponse,
  tryOpenAI,
  
  // Get or create conversation
  async startConversation(userId) {
    const conversationId = generateId();
    const conversation = getConversation(conversationId);
    conversation.userId = userId;
    
    // Add welcome message
    addMessage(conversationId, 'assistant', 
      `👋 Hi! I'm your AI website builder assistant.\n\nI can help you create a complete, professional website just by chatting with me. Tell me:\n\n- **What type of website** you need (restaurant, portfolio, SaaS, agency, etc.)\n- **Your business name** or project name\n- **Style preferences** (colors, mood, industry)\n\nOr just describe your vision, and I'll design something amazing for you! ✨`,
      {
        suggestedActions: [
          { type: 'suggest', label: '🍽️ Restaurant website' },
          { type: 'suggest', label: '💼 Business website' },
          { type: 'suggest', label: '🛍️ Online store' },
          { type: 'suggest', label: '👤 Portfolio site' },
          { type: 'suggest', label: '💻 SaaS landing page' },
        ],
      }
    );
    
    return conversation;
  },

  // Send message and get response
  async sendMessage(conversationId, message, userId) {
    return generateAIResponse(message, conversationId, userId);
  },

  // Get conversation history
  getHistory(conversationId) {
    const conversation = conversations.get(conversationId);
    return conversation?.messages || [];
  },

  // Clear conversation
  clearConversation(conversationId) {
    conversations.delete(conversationId);
  },
};

export default aiChatService;
