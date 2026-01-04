/**
 * Widget Renderer
 * Renders widget content based on widget type with inline editing support
 */

import { useCallback, useRef, useEffect, useState } from 'react';

export function WidgetRenderer({ widget, isEditing, onContentUpdate, onEditEnd, theme }) {
  const { widgetType, content, style } = widget;
  const primaryColor = theme?.primary || '#6366f1';

  // Click outside handler for editing mode
  useEffect(() => {
    if (!isEditing) return;

    const handleClickOutside = (e) => {
      if (!e.target.closest('[data-widget-editor]')) {
        onEditEnd();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isEditing, onEditEnd]);

  switch (widgetType) {
    case 'HEADING':
      return <HeadingWidget content={content} style={style} isEditing={isEditing} onUpdate={onContentUpdate} />;
    case 'TEXT':
      return <TextWidget content={content} style={style} isEditing={isEditing} onUpdate={onContentUpdate} />;
    case 'IMAGE':
      return <ImageWidget content={content} style={style} isEditing={isEditing} onUpdate={onContentUpdate} />;
    case 'BUTTON':
      return <ButtonWidget content={content} style={style} isEditing={isEditing} onUpdate={onContentUpdate} />;
    case 'DIVIDER':
      return <DividerWidget content={content} style={style} />;
    case 'SPACER':
      return <SpacerWidget content={content} style={style} />;
    case 'ICON':
      return <IconWidget content={content} style={style} isEditing={isEditing} onUpdate={onContentUpdate} />;
    case 'ICON_BOX':
      return <IconBoxWidget content={content} style={style} isEditing={isEditing} onUpdate={onContentUpdate} />;
    case 'STAR_RATING':
      return <StarRatingWidget content={content} style={style} />;
    case 'COUNTER':
      return <CounterWidget content={content} style={style} />;
    case 'SOCIAL_ICONS':
      return <SocialIconsWidget content={content} style={style} />;
    case 'TESTIMONIAL':
      return <TestimonialWidget content={content} style={style} isEditing={isEditing} onUpdate={onContentUpdate} />;
    case 'ACCORDION':
      return <AccordionWidget content={content} style={style} />;
    case 'HERO':
      return <HeroWidget content={content} style={style} isEditing={isEditing} onUpdate={onContentUpdate} theme={theme} />;
    case 'FEATURES':
      return <FeaturesWidget content={content} style={style} theme={theme} />;
    case 'PRICING':
      return <PricingWidget content={content} style={style} theme={theme} />;
    case 'FAQ':
      return <FAQWidget content={content} style={style} />;
    case 'TESTIMONIALS':
      return <TestimonialsWidget content={content} style={style} />;
    case 'CONTACT_FORM':
      return <ContactFormWidget content={content} style={style} theme={theme} />;
    case 'NAVBAR':
      return <NavbarWidget content={content} style={style} isEditing={isEditing} onUpdate={onContentUpdate} theme={theme} />;
    case 'FOOTER':
      return <FooterWidget content={content} style={style} />;
    case 'VIDEO':
      return <VideoWidget content={content} style={style} />;
    case 'GALLERY':
      return <GalleryWidget content={content} style={style} />;
    case 'CARDS':
      return <CardsWidget content={content} style={style} />;
    case 'STATS':
      return <StatsWidget content={content} style={style} theme={theme} />;
    case 'CTA':
      return <CTAWidget content={content} style={style} isEditing={isEditing} onUpdate={onContentUpdate} theme={theme} />;
    case 'LOGO_CLOUD':
      return <LogoCloudWidget content={content} style={style} />;
    case 'TEAM':
      return <TeamWidget content={content} style={style} />;
    case 'IMAGE_BOX':
      return <ImageBoxWidget content={content} style={style} isEditing={isEditing} onUpdate={onContentUpdate} />;
    case 'PROGRESS_BAR':
      return <ProgressBarWidget content={content} style={style} />;
    case 'TABS':
      return <TabsWidget content={content} style={style} />;
    case 'CAROUSEL':
      return <CarouselWidget content={content} style={style} />;
    default:
      return (
        <div className="p-4 border border-dashed border-white/20 rounded-lg text-center text-white/50">
          Unknown widget: {widgetType}
        </div>
      );
  }
}

// Inline editable text component
function EditableText({ value, onChange, tag: Tag = 'div', className, style, placeholder }) {
  const ref = useRef(null);

  const handleBlur = useCallback(() => {
    if (ref.current && onChange) {
      onChange(ref.current.textContent || '');
    }
  }, [onChange]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      ref.current?.blur();
    }
  }, []);

  return (
    <Tag
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className={`outline-none focus:ring-2 focus:ring-indigo-500/50 rounded ${className || ''}`}
      style={style}
      data-widget-editor
    >
      {value || placeholder}
    </Tag>
  );
}

// Widget Components
function HeadingWidget({ content, style, isEditing, onUpdate }) {
  const Tag = content.tag || 'h2';
  const headingStyle = {
    color: style.color || 'inherit',
    fontSize: style.fontSize || undefined,
    fontWeight: style.fontWeight || '600',
    textAlign: style.textAlign || 'left',
    lineHeight: style.lineHeight || '1.2',
    letterSpacing: style.letterSpacing || undefined,
  };

  if (isEditing) {
    return (
      <EditableText
        value={content.text}
        onChange={(text) => onUpdate({ text })}
        tag={Tag}
        style={headingStyle}
        placeholder="Add heading text..."
      />
    );
  }

  return <Tag style={headingStyle}>{content.text || 'Add Your Heading'}</Tag>;
}

function TextWidget({ content, style, isEditing, onUpdate }) {
  const textStyle = {
    color: style.color || 'rgba(255,255,255,0.75)',
    fontSize: style.fontSize || undefined,
    fontWeight: style.fontWeight || '400',
    textAlign: style.textAlign || 'left',
    lineHeight: style.lineHeight || '1.6',
  };

  if (isEditing) {
    return (
      <EditableText
        value={content.text}
        onChange={(text) => onUpdate({ text })}
        style={textStyle}
        placeholder="Add text here..."
      />
    );
  }

  return <div style={textStyle}>{content.text || 'Add your text here...'}</div>;
}

function ImageWidget({ content, style }) {
  const imageStyle = {
    width: style.width || '100%',
    height: style.height || 'auto',
    objectFit: style.objectFit || 'cover',
    borderRadius: style.borderRadius || '0',
  };

  if (!content.src) {
    return (
      <div className="aspect-video bg-white/5 border border-dashed border-white/20 rounded-lg flex items-center justify-center">
        <div className="text-center text-white/40">
          <div className="text-4xl mb-2">🖼</div>
          <div className="text-sm">Click to add image</div>
        </div>
      </div>
    );
  }

  return <img src={content.src} alt={content.alt || ''} style={imageStyle} />;
}

function ButtonWidget({ content, style, isEditing, onUpdate }) {
  const buttonStyle = {
    backgroundColor: style.backgroundColor || '#6366f1',
    color: style.color || '#ffffff',
    fontSize: style.fontSize || '14px',
    fontWeight: style.fontWeight || '500',
    padding: style.padding || '12px 24px',
    borderRadius: style.borderRadius || '8px',
    display: 'inline-block',
    textDecoration: 'none',
    cursor: 'pointer',
    border: 'none',
    textAlign: 'center',
  };

  if (isEditing) {
    return (
      <div style={{ textAlign: style.textAlign || 'left' }}>
        <span style={buttonStyle} data-widget-editor>
          <EditableText
            value={content.text}
            onChange={(text) => onUpdate({ text })}
            tag="span"
            placeholder="Button text"
          />
        </span>
      </div>
    );
  }

  return (
    <div style={{ textAlign: style.textAlign || 'left' }}>
      <a href={content.link || '#'} style={buttonStyle} onClick={(e) => e.preventDefault()}>
        {content.text || 'Click Here'}
      </a>
    </div>
  );
}

function DividerWidget({ style }) {
  return (
    <div style={{ padding: '16px 0' }}>
      <hr style={{
        border: 'none',
        borderTop: `${style.borderWidth || '1px'} ${style.borderStyle || 'solid'} ${style.borderColor || 'rgba(255,255,255,0.1)'}`,
        width: style.width || '100%',
        margin: '0 auto',
      }} />
    </div>
  );
}

function SpacerWidget({ style }) {
  return <div style={{ height: style.height || '50px' }} />;
}

function IconWidget({ content, style }) {
  return (
    <div style={{ textAlign: style.textAlign || 'center' }}>
      <span style={{
        fontSize: style.fontSize || '48px',
        color: style.color || '#6366f1',
      }}>
        {content.icon || '★'}
      </span>
    </div>
  );
}

function IconBoxWidget({ content, style, isEditing, onUpdate }) {
  return (
    <div style={{ textAlign: style.textAlign || 'center' }} className="p-6">
      <div style={{ fontSize: style.iconSize || '48px', color: style.iconColor || '#6366f1', marginBottom: '16px' }}>
        {content.icon || '★'}
      </div>
      {isEditing ? (
        <>
          <EditableText
            value={content.title}
            onChange={(title) => onUpdate({ title })}
            tag="h3"
            className="text-lg font-semibold mb-2"
            placeholder="Title"
          />
          <EditableText
            value={content.description}
            onChange={(description) => onUpdate({ description })}
            className="text-sm text-white/70"
            placeholder="Description"
          />
        </>
      ) : (
        <>
          <h3 className="text-lg font-semibold mb-2">{content.title || 'Title'}</h3>
          <p className="text-sm text-white/70">{content.description || 'Description'}</p>
        </>
      )}
    </div>
  );
}

function StarRatingWidget({ content, style }) {
  const rating = content.rating || 4;
  const maxRating = content.maxRating || 5;
  return (
    <div className="flex gap-1 justify-center">
      {Array.from({ length: maxRating }).map((_, i) => (
        <span key={i} style={{
          fontSize: style.fontSize || '24px',
          color: i < rating ? (style.color || '#fbbf24') : 'rgba(255,255,255,0.2)',
        }}>★</span>
      ))}
    </div>
  );
}

function CounterWidget({ content, style }) {
  return (
    <div className="text-center">
      <div style={{
        fontSize: style.numberSize || '48px',
        fontWeight: '700',
        color: style.numberColor || '#6366f1',
      }}>
        {content.prefix}{content.endValue || 100}{content.suffix}
      </div>
      <div className="text-white/60 mt-2">{content.title || 'Counter'}</div>
    </div>
  );
}

function SocialIconsWidget({ content, style }) {
  const platformIcons = {
    facebook: 'f',
    twitter: '𝕏',
    instagram: '📷',
    linkedin: 'in',
    youtube: '▶',
  };

  return (
    <div className="flex gap-3 justify-center">
      {(content.icons || []).map((icon, i) => (
        <a
          key={i}
          href={icon.url || '#'}
          className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
          style={{ fontSize: style.iconSize || '16px' }}
          onClick={(e) => e.preventDefault()}
        >
          {platformIcons[icon.platform] || '●'}
        </a>
      ))}
    </div>
  );
}

function TestimonialWidget({ content, style, isEditing, onUpdate }) {
  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/10" style={{ textAlign: style.textAlign || 'center' }}>
      {content.image && (
        <img src={content.image} alt={content.name} className="w-16 h-16 rounded-full mx-auto mb-4 object-cover" />
      )}
      {isEditing ? (
        <EditableText
          value={content.content}
          onChange={(text) => onUpdate({ content: text })}
          className="text-white/80 italic mb-4"
          placeholder="Testimonial text..."
        />
      ) : (
        <p className="text-white/80 italic mb-4">"{content.content || 'Testimonial text'}"</p>
      )}
      <div className="font-semibold">{content.name || 'Name'}</div>
      <div className="text-sm text-white/60">{content.title || 'Title'}</div>
    </div>
  );
}

function AccordionWidget({ content }) {
  return (
    <div className="space-y-2">
      {(content.items || []).map((item, i) => (
        <details key={i} className="group rounded-xl border border-white/10 bg-white/5">
          <summary className="cursor-pointer p-4 font-medium list-none flex justify-between items-center">
            {item.title}
            <span className="text-white/40 group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <div className="px-4 pb-4 text-white/70">{item.content}</div>
        </details>
      ))}
    </div>
  );
}

function HeroWidget({ content, style, isEditing, onUpdate, theme }) {
  const primaryColor = theme?.primary || '#6366f1';
  
  return (
    <div className="py-16" style={{ padding: style.padding }}>
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <div>
          {isEditing ? (
            <>
              <EditableText
                value={content.headline}
                onChange={(headline) => onUpdate({ headline })}
                tag="h1"
                className="text-4xl md:text-5xl font-bold mb-4"
                placeholder="Your Headline"
              />
              <EditableText
                value={content.subheadline}
                onChange={(subheadline) => onUpdate({ subheadline })}
                className="text-lg text-white/70 mb-8"
                placeholder="Your subheadline"
              />
            </>
          ) : (
            <>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{content.headline || 'Welcome'}</h1>
              <p className="text-lg text-white/70 mb-8">{content.subheadline || 'Subheadline'}</p>
            </>
          )}
          <div className="flex gap-4 flex-wrap">
            {content.primaryCta?.label && (
              <a 
                href={content.primaryCta.href || '#'} 
                className="px-6 py-3 rounded-lg font-medium transition-opacity hover:opacity-90" 
                style={{ backgroundColor: primaryColor }}
                onClick={(e) => e.preventDefault()}
              >
                {content.primaryCta.label}
              </a>
            )}
            {content.secondaryCta?.label && (
              <a href={content.secondaryCta.href || '#'} className="px-6 py-3 border border-white/20 rounded-lg font-medium hover:bg-white/10 transition-colors" onClick={(e) => e.preventDefault()}>
                {content.secondaryCta.label}
              </a>
            )}
          </div>
        </div>
        <div className="h-64 rounded-2xl overflow-hidden">
          {content.image ? (
            <img src={content.image} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full border border-white/10 rounded-2xl" style={{ background: `linear-gradient(135deg, ${primaryColor}33, transparent)` }} />
          )}
        </div>
      </div>
    </div>
  );
}

function FeaturesWidget({ content }) {
  return (
    <div className="py-12">
      {content.headline && <h2 className="text-3xl font-bold text-center mb-10">{content.headline}</h2>}
      <div className="grid md:grid-cols-3 gap-6">
        {(content.items || []).map((item, i) => (
          <div key={i} className="p-6 rounded-xl bg-white/5 border border-white/10 text-center">
            <div className="text-3xl mb-4">{item.icon || '★'}</div>
            <h3 className="font-semibold mb-2">{item.title}</h3>
            <p className="text-sm text-white/70">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function PricingWidget({ content }) {
  return (
    <div className="py-12">
      {content.headline && <h2 className="text-3xl font-bold text-center mb-10">{content.headline}</h2>}
      <div className="grid md:grid-cols-3 gap-6">
        {(content.plans || []).map((plan, i) => (
          <div key={i} className={`p-6 rounded-2xl border ${plan.featured ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/10 bg-white/5'}`}>
            <h3 className="font-semibold text-lg">{plan.name}</h3>
            <div className="text-3xl font-bold my-4">{plan.price}<span className="text-sm font-normal text-white/60">{plan.period}</span></div>
            <ul className="space-y-2 mb-6">
              {(plan.features || []).map((f, fi) => (
                <li key={fi} className="flex items-center gap-2 text-sm text-white/70">
                  <span className="text-green-400">✓</span> {f}
                </li>
              ))}
            </ul>
            {plan.cta && (
              <a href={plan.cta.href || '#'} className={`block text-center py-2 rounded-lg font-medium ${plan.featured ? 'bg-indigo-500 hover:bg-indigo-400' : 'bg-white/10 hover:bg-white/20'} transition-colors`} onClick={(e) => e.preventDefault()}>
                {plan.cta.label}
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function FAQWidget({ content }) {
  return (
    <div className="py-12 max-w-3xl mx-auto">
      {content.headline && <h2 className="text-3xl font-bold text-center mb-10">{content.headline}</h2>}
      <div className="space-y-3">
        {(content.items || []).map((item, i) => (
          <details key={i} className="group rounded-xl border border-white/10 bg-white/5">
            <summary className="cursor-pointer p-4 font-medium list-none">{item.q}</summary>
            <div className="px-4 pb-4 text-white/70">{item.a}</div>
          </details>
        ))}
      </div>
    </div>
  );
}

function TestimonialsWidget({ content }) {
  return (
    <div className="py-12">
      {content.headline && <h2 className="text-3xl font-bold text-center mb-10">{content.headline}</h2>}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(content.items || []).map((item, i) => (
          <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-white/80 italic mb-4">"{item.quote}"</p>
            <div className="flex items-center gap-3">
              {item.image && <img src={item.image} alt={item.name} className="w-10 h-10 rounded-full object-cover" />}
              <div>
                <div className="font-semibold">{item.name}</div>
                <div className="text-sm text-white/60">{item.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContactFormWidget({ content, theme }) {
  const primaryColor = theme?.primary || '#6366f1';
  return (
    <div className="py-12 max-w-xl mx-auto">
      {content.headline && <h2 className="text-2xl font-bold text-center mb-8">{content.headline}</h2>}
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        {(content.fields || []).map((field, i) => (
          <div key={i}>
            <label className="block text-sm text-white/70 mb-1">{field.label}</label>
            {field.type === 'textarea' ? (
              <textarea className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-indigo-500 outline-none" placeholder={field.placeholder} rows={4} />
            ) : (
              <input type={field.type} className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-indigo-500 outline-none" placeholder={field.placeholder} />
            )}
          </div>
        ))}
        <button type="submit" className="w-full py-3 rounded-lg font-medium transition-opacity hover:opacity-90" style={{ backgroundColor: primaryColor }}>
          {content.submitText || 'Submit'}
        </button>
      </form>
    </div>
  );
}

function NavbarWidget({ content, style, theme }) {
  // Support both logo.image/logo.text and logoImageUrl/logoText formats
  const logoImage = content.logo?.image || content.logoImageUrl;
  const logoText = content.logo?.text || content.logoText || 'Logo';
  const primaryColor = theme?.primary || '#6366f1';
  
  return (
    <nav className="flex items-center justify-between py-4" style={{ backgroundColor: style.backgroundColor, padding: style.padding }}>
      <div className="font-bold text-lg">
        {logoImage ? (
          <img src={logoImage} alt={logoText} className="h-10 w-auto object-contain" />
        ) : (
          logoText
        )}
      </div>
      <div className="flex items-center gap-6">
        {(content.links || []).map((link, i) => (
          <a key={i} href={link.href || '#'} className="text-white/70 hover:text-white transition-colors" onClick={(e) => e.preventDefault()}>
            {link.label}
          </a>
        ))}
        {content.cta?.label && (
          <a 
            href={content.cta.href || '#'} 
            className="px-4 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-90" 
            style={{ backgroundColor: primaryColor }}
            onClick={(e) => e.preventDefault()}
          >
            {content.cta.label}
          </a>
        )}
      </div>
    </nav>
  );
}

function FooterWidget({ content, style }) {
  return (
    <footer className="py-12" style={{ backgroundColor: style.backgroundColor, padding: style.padding }}>
      <div className="grid md:grid-cols-4 gap-8 mb-8">
        <div>
          <div className="font-bold text-lg mb-4">{content.logo?.text || 'Logo'}</div>
        </div>
        {(content.columns || []).map((col, i) => (
          <div key={i}>
            <h4 className="font-semibold mb-4">{col.title}</h4>
            <ul className="space-y-2">
              {(col.links || []).map((link, li) => (
                <li key={li}>
                  <a href={link.href || '#'} className="text-white/60 hover:text-white transition-colors" onClick={(e) => e.preventDefault()}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="pt-8 border-t border-white/10 flex items-center justify-between">
        <div className="text-sm text-white/50">{content.copyright}</div>
        <div className="flex gap-3">
          {(content.socialLinks || []).map((link, i) => (
            <a key={i} href={link.url || '#'} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors" onClick={(e) => e.preventDefault()}>
              {link.platform?.[0]?.toUpperCase() || '●'}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

function VideoWidget({ content, style }) {
  if (!content.url) {
    return (
      <div className="aspect-video bg-white/5 border border-dashed border-white/20 rounded-xl flex items-center justify-center" style={{ borderRadius: style.borderRadius }}>
        <div className="text-center text-white/40">
          <div className="text-4xl mb-2">▶</div>
          <div className="text-sm">Add video URL</div>
        </div>
      </div>
    );
  }

  return (
    <div className="aspect-video rounded-xl overflow-hidden" style={{ aspectRatio: style.aspectRatio, borderRadius: style.borderRadius }}>
      <iframe src={content.url} className="w-full h-full" frameBorder="0" allowFullScreen />
    </div>
  );
}

function GalleryWidget({ content }) {
  const columns = content.columns || 3;
  const gap = content.gap || '16px';

  if (!content.images?.length) {
    return (
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="aspect-square bg-white/5 border border-dashed border-white/20 rounded-lg flex items-center justify-center">
            <span className="text-white/30">+</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)`, gap }}>
      {content.images.map((img, i) => (
        <div key={i} className="aspect-square rounded-lg overflow-hidden">
          <img src={img.src || img} alt={img.alt || ''} className="w-full h-full object-cover" />
        </div>
      ))}
    </div>
  );
}

function CardsWidget({ content }) {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {(content.cards || []).map((card, i) => (
        <div key={i} className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
          {card.image && (
            <div className="aspect-video">
              <img src={card.image} alt={card.title} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="p-6">
            <h3 className="font-semibold mb-2">{card.title}</h3>
            <p className="text-sm text-white/70 mb-4">{card.text}</p>
            {card.cta && (
              <a href={card.cta.href || '#'} className="text-indigo-400 text-sm font-medium hover:text-indigo-300" onClick={(e) => e.preventDefault()}>
                {card.cta.label} →
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function StatsWidget({ content }) {
  return (
    <div className="grid md:grid-cols-3 gap-6 text-center">
      {(content.items || []).map((item, i) => (
        <div key={i} className="p-6">
          <div className="text-4xl font-bold text-indigo-400 mb-2">{item.value}</div>
          <div className="text-white/60">{item.label}</div>
        </div>
      ))}
    </div>
  );
}

function CTAWidget({ content, style, isEditing, onUpdate, theme }) {
  const primaryColor = theme?.primary || '#6366f1';
  return (
    <div className="rounded-2xl text-center" style={{
      backgroundColor: style.backgroundColor || `${primaryColor}1a`,
      padding: style.padding || '48px',
      borderRadius: style.borderRadius || '16px',
    }}>
      {isEditing ? (
        <>
          <EditableText
            value={content.headline}
            onChange={(headline) => onUpdate({ headline })}
            tag="h2"
            className="text-3xl font-bold mb-4"
            placeholder="Headline"
          />
          <EditableText
            value={content.description}
            onChange={(description) => onUpdate({ description })}
            className="text-white/70 mb-6 max-w-xl mx-auto"
            placeholder="Description"
          />
        </>
      ) : (
        <>
          <h2 className="text-3xl font-bold mb-4">{content.headline || 'Ready to Get Started?'}</h2>
          <p className="text-white/70 mb-6 max-w-xl mx-auto">{content.description || 'Description'}</p>
        </>
      )}
      <div className="flex gap-4 justify-center">
        {content.primaryCta && (
          <a href={content.primaryCta.href || '#'} className="px-6 py-3 rounded-lg font-medium transition-opacity hover:opacity-90" style={{ backgroundColor: primaryColor }} onClick={(e) => e.preventDefault()}>
            {content.primaryCta.label}
          </a>
        )}
        {content.secondaryCta && (
          <a href={content.secondaryCta.href || '#'} className="px-6 py-3 border border-white/20 rounded-lg font-medium hover:bg-white/10 transition-colors" onClick={(e) => e.preventDefault()}>
            {content.secondaryCta.label}
          </a>
        )}
      </div>
    </div>
  );
}

function LogoCloudWidget({ content }) {
  return (
    <div className="py-8">
      <div className="text-center text-sm text-white/50 mb-6">{content.label || 'Trusted by'}</div>
      <div className="flex flex-wrap justify-center gap-8 items-center">
        {(content.logos || []).map((logo, i) => (
          <div key={i} className="h-8 px-4 bg-white/5 rounded-lg flex items-center justify-center">
            {logo.src ? (
              <img src={logo.src} alt={logo.alt} className="h-6 object-contain opacity-60" />
            ) : (
              <span className="text-white/40 text-sm">{logo.alt || `Logo ${i + 1}`}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function TeamWidget({ content }) {
  return (
    <div className="py-12">
      {content.headline && <h2 className="text-3xl font-bold text-center mb-10">{content.headline}</h2>}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {(content.members || []).map((member, i) => (
          <div key={i} className="text-center p-6 rounded-2xl bg-white/5 border border-white/10">
            {member.image ? (
              <img src={member.image} alt={member.name} className="w-24 h-24 rounded-full mx-auto mb-4 object-cover" />
            ) : (
              <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-2xl font-bold">
                {member.name?.charAt(0) || '?'}
              </div>
            )}
            <h3 className="font-semibold text-lg">{member.name}</h3>
            <div className="text-sm text-indigo-400 mb-2">{member.role}</div>
            {member.bio && <p className="text-sm text-white/60">{member.bio}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

function ImageBoxWidget({ content, style, isEditing, onUpdate }) {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden" style={{ textAlign: style.textAlign || 'center' }}>
      {content.src ? (
        <div className="aspect-video">
          <img src={content.src} alt={content.title} className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="aspect-video bg-white/5 flex items-center justify-center">
          <span className="text-white/30 text-4xl">🖼</span>
        </div>
      )}
      <div className="p-6">
        {isEditing ? (
          <>
            <EditableText
              value={content.title}
              onChange={(title) => onUpdate({ title })}
              tag="h3"
              className="font-semibold text-lg mb-2"
              placeholder="Title"
            />
            <EditableText
              value={content.description}
              onChange={(description) => onUpdate({ description })}
              className="text-sm text-white/70"
              placeholder="Description"
            />
          </>
        ) : (
          <>
            <h3 className="font-semibold text-lg mb-2">{content.title || 'Image Box Title'}</h3>
            <p className="text-sm text-white/70">{content.description || 'Description text'}</p>
          </>
        )}
      </div>
    </div>
  );
}

function ProgressBarWidget({ content, style }) {
  const percentage = content.percentage || 0;
  return (
    <div className="py-2">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium">{content.title || 'Progress'}</span>
        <span className="text-sm text-white/60">{percentage}%</span>
      </div>
      <div 
        className="w-full rounded-full overflow-hidden"
        style={{ 
          backgroundColor: style.backgroundColor || 'rgba(255,255,255,0.1)',
          height: style.height || '8px',
        }}
      >
        <div 
          className="h-full rounded-full transition-all duration-500"
          style={{ 
            width: `${percentage}%`,
            backgroundColor: style.barColor || '#6366f1',
          }}
        />
      </div>
    </div>
  );
}

function TabsWidget({ content }) {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = content.tabs || [];

  return (
    <div className="py-4">
      <div className="flex border-b border-white/10 mb-4">
        {tabs.map((tab, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActiveTab(i)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === i 
                ? 'text-indigo-400 border-b-2 border-indigo-400' 
                : 'text-white/60 hover:text-white/80'
            }`}
          >
            {tab.title}
          </button>
        ))}
      </div>
      <div className="p-4 rounded-lg bg-white/5">
        {tabs[activeTab]?.content || 'Tab content'}
      </div>
    </div>
  );
}

function CarouselWidget({ content }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = content.slides || [];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  if (slides.length === 0) {
    return (
      <div className="aspect-video bg-white/5 border border-dashed border-white/20 rounded-xl flex items-center justify-center">
        <div className="text-center text-white/40">
          <div className="text-4xl mb-2">↔</div>
          <div className="text-sm">Add slides to carousel</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative rounded-xl overflow-hidden">
      <div className="aspect-video relative">
        {slides[currentSlide]?.image ? (
          <img 
            src={slides[currentSlide].image} 
            alt={slides[currentSlide].title} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
            <span className="text-white/30 text-4xl">🖼</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="text-xl font-bold mb-2">{slides[currentSlide]?.title}</h3>
          {slides[currentSlide]?.description && (
            <p className="text-white/70">{slides[currentSlide].description}</p>
          )}
        </div>
      </div>
      
      {content.arrows !== false && slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-colors"
          >
            ←
          </button>
          <button
            type="button"
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-colors"
          >
            →
          </button>
        </>
      )}
      
      {content.dots !== false && slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrentSlide(i)}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === currentSlide ? 'bg-white' : 'bg-white/40'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
