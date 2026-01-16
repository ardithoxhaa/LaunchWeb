/**
 * Widget Registry
 * Defines all available widgets with their default content, styles, and settings
 */

export const WIDGET_CATEGORIES = {
  BASIC: 'Basic',
  GENERAL: 'General',
  SITE: 'Site',
  PRO: 'Pro',
};

export const WIDGETS = {
  // Basic Widgets
  HEADING: {
    type: 'HEADING',
    name: 'Heading',
    icon: 'H',
    category: WIDGET_CATEGORIES.BASIC,
    defaultContent: {
      text: 'Add Your Heading Text Here',
      tag: 'h2',
      link: null,
    },
    defaultStyle: {
      color: '',
      fontSize: '',
      fontWeight: '600',
      textAlign: 'left',
      lineHeight: '1.2',
      letterSpacing: '',
    },
  },
  
  TEXT: {
    type: 'TEXT',
    name: 'Text Editor',
    icon: 'T',
    category: WIDGET_CATEGORIES.BASIC,
    defaultContent: {
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.',
    },
    defaultStyle: {
      color: '',
      fontSize: '',
      fontWeight: '400',
      textAlign: 'left',
      lineHeight: '1.6',
    },
  },
  
  IMAGE: {
    type: 'IMAGE',
    name: 'Image',
    icon: '🖼',
    category: WIDGET_CATEGORIES.BASIC,
    defaultContent: {
      src: '',
      alt: '',
      caption: '',
      link: null,
    },
    defaultStyle: {
      width: '100%',
      height: 'auto',
      objectFit: 'cover',
      borderRadius: '',
    },
  },
  
  BUTTON: {
    type: 'BUTTON',
    name: 'Button',
    icon: '▢',
    category: WIDGET_CATEGORIES.BASIC,
    defaultContent: {
      text: 'Click Here',
      link: '#',
      target: '_self',
    },
    defaultStyle: {
      backgroundColor: '#6366f1',
      color: '#ffffff',
      fontSize: '14px',
      fontWeight: '500',
      padding: '12px 24px',
      borderRadius: '8px',
      textAlign: 'center',
    },
  },
  
  DIVIDER: {
    type: 'DIVIDER',
    name: 'Divider',
    icon: '—',
    category: WIDGET_CATEGORIES.BASIC,
    defaultContent: {
      style: 'solid',
    },
    defaultStyle: {
      borderColor: 'rgba(255,255,255,0.1)',
      borderWidth: '1px',
      width: '100%',
    },
  },
  
  SPACER: {
    type: 'SPACER',
    name: 'Spacer',
    icon: '↕',
    category: WIDGET_CATEGORIES.BASIC,
    defaultContent: {},
    defaultStyle: {
      height: '50px',
    },
  },
  
  // General Widgets
  ICON: {
    type: 'ICON',
    name: 'Icon',
    icon: '★',
    category: WIDGET_CATEGORIES.GENERAL,
    defaultContent: {
      icon: '★',
      link: null,
    },
    defaultStyle: {
      fontSize: '48px',
      color: '#6366f1',
      textAlign: 'center',
    },
  },
  
  ICON_BOX: {
    type: 'ICON_BOX',
    name: 'Icon Box',
    icon: '◉',
    category: WIDGET_CATEGORIES.GENERAL,
    defaultContent: {
      icon: '★',
      title: 'This is the heading',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    defaultStyle: {
      textAlign: 'center',
      iconColor: '#6366f1',
      iconSize: '48px',
    },
  },
  
  IMAGE_BOX: {
    type: 'IMAGE_BOX',
    name: 'Image Box',
    icon: '🖼',
    category: WIDGET_CATEGORIES.GENERAL,
    defaultContent: {
      src: '',
      title: 'This is the heading',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    defaultStyle: {
      textAlign: 'center',
    },
  },
  
  STAR_RATING: {
    type: 'STAR_RATING',
    name: 'Star Rating',
    icon: '⭐',
    category: WIDGET_CATEGORIES.GENERAL,
    defaultContent: {
      rating: 4,
      maxRating: 5,
    },
    defaultStyle: {
      fontSize: '24px',
      color: '#fbbf24',
    },
  },
  
  COUNTER: {
    type: 'COUNTER',
    name: 'Counter',
    icon: '123',
    category: WIDGET_CATEGORIES.GENERAL,
    defaultContent: {
      startValue: 0,
      endValue: 100,
      prefix: '',
      suffix: '+',
      title: 'Happy Customers',
    },
    defaultStyle: {
      numberColor: '#6366f1',
      numberSize: '48px',
    },
  },
  
  PROGRESS_BAR: {
    type: 'PROGRESS_BAR',
    name: 'Progress Bar',
    icon: '▰',
    category: WIDGET_CATEGORIES.GENERAL,
    defaultContent: {
      title: 'Web Development',
      percentage: 75,
    },
    defaultStyle: {
      barColor: '#6366f1',
      backgroundColor: 'rgba(255,255,255,0.1)',
      height: '8px',
    },
  },
  
  TESTIMONIAL: {
    type: 'TESTIMONIAL',
    name: 'Testimonial',
    icon: '💬',
    category: WIDGET_CATEGORIES.GENERAL,
    defaultContent: {
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.',
      name: 'John Doe',
      title: 'CEO, Company',
      image: '',
    },
    defaultStyle: {
      textAlign: 'center',
    },
  },
  
  ACCORDION: {
    type: 'ACCORDION',
    name: 'Accordion',
    icon: '≡',
    category: WIDGET_CATEGORIES.GENERAL,
    defaultContent: {
      items: [
        { title: 'Accordion Title 1', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
        { title: 'Accordion Title 2', content: 'Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.' },
      ],
    },
    defaultStyle: {},
  },
  
  TABS: {
    type: 'TABS',
    name: 'Tabs',
    icon: '⊞',
    category: WIDGET_CATEGORIES.GENERAL,
    defaultContent: {
      tabs: [
        { title: 'Tab 1', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
        { title: 'Tab 2', content: 'Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.' },
      ],
    },
    defaultStyle: {},
  },
  
  SOCIAL_ICONS: {
    type: 'SOCIAL_ICONS',
    name: 'Social Icons',
    icon: '🔗',
    category: WIDGET_CATEGORIES.GENERAL,
    defaultContent: {
      icons: [
        { platform: 'facebook', url: '#' },
        { platform: 'twitter', url: '#' },
        { platform: 'instagram', url: '#' },
        { platform: 'linkedin', url: '#' },
      ],
    },
    defaultStyle: {
      iconSize: '24px',
      gap: '12px',
    },
  },
  
  // Site Widgets
  NAVBAR: {
    type: 'NAVBAR',
    name: 'Navigation',
    icon: '☰',
    category: WIDGET_CATEGORIES.SITE,
    defaultContent: {
      logo: { text: 'Logo', image: '' },
      links: [
        { label: 'Home', href: '/home' },
        { label: 'About', href: '/about' },
        { label: 'Services', href: '/services' },
        { label: 'Contact', href: '/contact' },
      ],
      cta: { label: 'Get Started', href: '#' },
    },
    defaultStyle: {
      backgroundColor: 'transparent',
      padding: '16px 0',
    },
  },
  
  HERO: {
    type: 'HERO',
    name: 'Hero Section',
    icon: '🏠',
    category: WIDGET_CATEGORIES.SITE,
    defaultContent: {
      headline: 'Welcome to Our Website',
      subheadline: 'We create amazing digital experiences for your business.',
      primaryCta: { label: 'Get Started', href: '#' },
      secondaryCta: { label: 'Learn More', href: '#' },
      image: '',
    },
    defaultStyle: {
      textAlign: 'center',
      padding: '80px 0',
    },
  },
  
  FEATURES: {
    type: 'FEATURES',
    name: 'Features',
    icon: '✨',
    category: WIDGET_CATEGORIES.SITE,
    defaultContent: {
      headline: 'Our Features',
      items: [
        { icon: '⚡', title: 'Fast Performance', text: 'Lightning fast loading times.' },
        { icon: '🔒', title: 'Secure', text: 'Enterprise-grade security.' },
        { icon: '📱', title: 'Responsive', text: 'Works on all devices.' },
      ],
    },
    defaultStyle: {},
  },
  
  PRICING: {
    type: 'PRICING',
    name: 'Pricing Table',
    icon: '💰',
    category: WIDGET_CATEGORIES.SITE,
    defaultContent: {
      headline: 'Choose Your Plan',
      plans: [
        { name: 'Basic', price: '$9', period: '/month', features: ['Feature 1', 'Feature 2'], cta: { label: 'Get Started', href: '#' } },
        { name: 'Pro', price: '$29', period: '/month', features: ['Feature 1', 'Feature 2', 'Feature 3'], cta: { label: 'Get Started', href: '#' }, featured: true },
        { name: 'Enterprise', price: '$99', period: '/month', features: ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4'], cta: { label: 'Contact Us', href: '#' } },
      ],
    },
    defaultStyle: {},
  },
  
  FAQ: {
    type: 'FAQ',
    name: 'FAQ',
    icon: '❓',
    category: WIDGET_CATEGORIES.SITE,
    defaultContent: {
      headline: 'Frequently Asked Questions',
      items: [
        { q: 'What is your return policy?', a: 'We offer a 30-day money-back guarantee.' },
        { q: 'How do I contact support?', a: 'You can reach us at support@example.com.' },
      ],
    },
    defaultStyle: {},
  },
  
  TESTIMONIALS: {
    type: 'TESTIMONIALS',
    name: 'Testimonials',
    icon: '💬',
    category: WIDGET_CATEGORIES.SITE,
    defaultContent: {
      headline: 'What Our Customers Say',
      items: [
        { quote: 'Amazing service!', name: 'John Doe', role: 'CEO', image: '' },
        { quote: 'Highly recommended!', name: 'Jane Smith', role: 'Designer', image: '' },
      ],
    },
    defaultStyle: {},
  },
  
  CONTACT_FORM: {
    type: 'CONTACT_FORM',
    name: 'Contact Form',
    icon: '✉',
    category: WIDGET_CATEGORIES.SITE,
    defaultContent: {
      headline: 'Get in Touch',
      fields: [
        { type: 'text', label: 'Name', placeholder: 'Your name', required: true },
        { type: 'email', label: 'Email', placeholder: 'Your email', required: true },
        { type: 'textarea', label: 'Message', placeholder: 'Your message', required: true },
      ],
      submitText: 'Send Message',
    },
    defaultStyle: {},
  },
  
  FOOTER: {
    type: 'FOOTER',
    name: 'Footer',
    icon: '▬',
    category: WIDGET_CATEGORIES.SITE,
    defaultContent: {
      logo: { text: 'Logo', image: '' },
      columns: [
        { title: 'Company', links: [{ label: 'About', href: '#' }, { label: 'Careers', href: '#' }] },
        { title: 'Support', links: [{ label: 'Help', href: '#' }, { label: 'Contact', href: '#' }] },
      ],
      copyright: '© 2024 Company. All rights reserved.',
      socialLinks: [
        { platform: 'facebook', url: '#' },
        { platform: 'twitter', url: '#' },
      ],
    },
    defaultStyle: {
      backgroundColor: 'rgba(0,0,0,0.3)',
      padding: '48px 0 24px',
    },
  },
  
  // Pro Widgets
  VIDEO: {
    type: 'VIDEO',
    name: 'Video',
    icon: '▶',
    category: WIDGET_CATEGORIES.PRO,
    defaultContent: {
      url: '',
      autoplay: false,
      loop: false,
      muted: false,
    },
    defaultStyle: {
      aspectRatio: '16/9',
      borderRadius: '12px',
    },
  },
  
  GALLERY: {
    type: 'GALLERY',
    name: 'Gallery',
    icon: '🖼',
    category: WIDGET_CATEGORIES.PRO,
    defaultContent: {
      images: [],
      columns: 3,
      gap: '16px',
    },
    defaultStyle: {},
  },
  
  CAROUSEL: {
    type: 'CAROUSEL',
    name: 'Carousel',
    icon: '↔',
    category: WIDGET_CATEGORIES.PRO,
    defaultContent: {
      slides: [
        { image: '', title: 'Slide 1', description: '' },
        { image: '', title: 'Slide 2', description: '' },
      ],
      autoplay: true,
      dots: true,
      arrows: true,
    },
    defaultStyle: {},
  },
  
  LOGO_CLOUD: {
    type: 'LOGO_CLOUD',
    name: 'Logo Cloud',
    icon: '◎',
    category: WIDGET_CATEGORIES.PRO,
    defaultContent: {
      label: 'Trusted by',
      logos: [
        { src: '', alt: 'Company 1' },
        { src: '', alt: 'Company 2' },
        { src: '', alt: 'Company 3' },
      ],
    },
    defaultStyle: {},
  },
  
  CARDS: {
    type: 'CARDS',
    name: 'Cards',
    icon: '▢',
    category: WIDGET_CATEGORIES.PRO,
    defaultContent: {
      cards: [
        { title: 'Card 1', text: 'Description text', image: '', cta: { label: 'Learn More', href: '#' } },
        { title: 'Card 2', text: 'Description text', image: '', cta: { label: 'Learn More', href: '#' } },
        { title: 'Card 3', text: 'Description text', image: '', cta: { label: 'Learn More', href: '#' } },
      ],
    },
    defaultStyle: {},
  },
  
  STATS: {
    type: 'STATS',
    name: 'Stats',
    icon: '📊',
    category: WIDGET_CATEGORIES.PRO,
    defaultContent: {
      items: [
        { value: '10K+', label: 'Customers' },
        { value: '99%', label: 'Satisfaction' },
        { value: '24/7', label: 'Support' },
      ],
    },
    defaultStyle: {},
  },
  
  CTA: {
    type: 'CTA',
    name: 'Call to Action',
    icon: '📢',
    category: WIDGET_CATEGORIES.PRO,
    defaultContent: {
      headline: 'Ready to Get Started?',
      description: 'Join thousands of satisfied customers today.',
      primaryCta: { label: 'Get Started', href: '#' },
      secondaryCta: { label: 'Learn More', href: '#' },
    },
    defaultStyle: {
      backgroundColor: 'rgba(99, 102, 241, 0.1)',
      padding: '48px',
      borderRadius: '16px',
      textAlign: 'center',
    },
  },
  
  TEAM: {
    type: 'TEAM',
    name: 'Team',
    icon: '👥',
    category: WIDGET_CATEGORIES.PRO,
    defaultContent: {
      headline: 'Meet Our Team',
      members: [
        { name: 'John Doe', role: 'CEO', image: '', bio: '' },
        { name: 'Jane Smith', role: 'CTO', image: '', bio: '' },
      ],
    },
    defaultStyle: {},
  },
};

// Get widget by type
export function getWidget(type) {
  return WIDGETS[type] || null;
}

// Get widgets by category
export function getWidgetsByCategory(category) {
  return Object.values(WIDGETS).filter(w => w.category === category);
}

// Get all widget types
export function getAllWidgetTypes() {
  return Object.keys(WIDGETS);
}

// Create new widget instance with default values
export function createWidgetInstance(type) {
  const widget = getWidget(type);
  if (!widget) return null;
  
  return {
    widgetType: type,
    content: { ...widget.defaultContent },
    style: { ...widget.defaultStyle },
    responsiveStyle: {
      tablet: {},
      mobile: {},
    },
    settings: {},
  };
}
