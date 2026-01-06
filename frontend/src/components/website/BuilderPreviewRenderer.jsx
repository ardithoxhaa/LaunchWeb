/**
 * Builder Preview Renderer
 * Renders the builder tree structure (SECTION → CONTAINER → COLUMN → WIDGET) for preview
 */

import { useState } from 'react';

export function BuilderPreviewRenderer({ builder, designSystem }) {
  if (!builder?.root) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-white/40">
          <div className="text-4xl mb-4">📄</div>
          <div>No content to preview</div>
        </div>
      </div>
    );
  }

  const sections = extractSections(builder.root);

  return (
    <div className="min-h-screen" style={{ 
      fontFamily: designSystem?.typography?.fontFamily || 'system-ui, sans-serif',
      color: designSystem?.colors?.text || '#ffffff',
      backgroundColor: designSystem?.colors?.background || '#0a0a12',
    }}>
      {sections.map((section, idx) => (
        <SectionRenderer key={section.id || idx} section={section} designSystem={designSystem} />
      ))}
    </div>
  );
}

function extractSections(root) {
  const sections = [];
  
  function walk(node) {
    if (!node) return;
    if (node.type === 'SECTION') {
      sections.push(node);
    }
    const children = Array.isArray(node.children) ? node.children : [];
    for (const child of children) {
      walk(child);
    }
  }
  
  walk(root);
  return sections;
}

function SectionRenderer({ section, designSystem }) {
  const style = section.style || {};
  
  const sectionStyle = {
    backgroundColor: style.backgroundColor || 'transparent',
    backgroundImage: style.backgroundImage || undefined,
    backgroundSize: style.backgroundSize || 'cover',
    backgroundPosition: style.backgroundPosition || 'center',
    paddingTop: style.paddingTop || '60px',
    paddingBottom: style.paddingBottom || '60px',
    paddingLeft: style.paddingLeft || '0',
    paddingRight: style.paddingRight || '0',
    marginTop: style.marginTop || '0',
    marginBottom: style.marginBottom || '0',
    minHeight: style.minHeight || undefined,
  };

  const containers = (section.children || []).filter(n => n.type === 'CONTAINER');
  const effectiveContainers = containers.length ? containers : [{ children: section.children || [] }];

  return (
    <section style={sectionStyle}>
      {effectiveContainers.map((container, cidx) => (
        <ContainerRenderer 
          key={container.id || cidx} 
          container={container} 
          designSystem={designSystem}
          settings={section.settings}
        />
      ))}
    </section>
  );
}

function ContainerRenderer({ container, designSystem, settings }) {
  const columns = (container.children || []).filter(n => n.type === 'COLUMN');
  const effectiveColumns = columns.length ? columns : [{ children: container.children || [], width: 100 }];
  
  const contentWidth = settings?.contentWidth === 'full' ? '100%' : '1200px';
  const gap = settings?.columnsGap === 'none' ? '0' : 
              settings?.columnsGap === 'narrow' ? '16px' : 
              settings?.columnsGap === 'wide' ? '48px' : '24px';

  return (
    <div style={{ 
      maxWidth: contentWidth, 
      margin: '0 auto', 
      paddingLeft: '32px', 
      paddingRight: '32px',
    }}>
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap',
        gap: gap,
        alignItems: settings?.verticalAlign === 'top' ? 'flex-start' :
                    settings?.verticalAlign === 'middle' ? 'center' :
                    settings?.verticalAlign === 'bottom' ? 'flex-end' : 'stretch',
      }}>
        {effectiveColumns.map((column, idx) => (
          <ColumnRenderer 
            key={column.id || idx} 
            column={column} 
            designSystem={designSystem}
            totalColumns={effectiveColumns.length}
          />
        ))}
      </div>
    </div>
  );
}

function ColumnRenderer({ column, designSystem, totalColumns }) {
  const widgets = (column.children || []).filter(n => n.type === 'WIDGET');
  const width = column.width || Math.floor(100 / totalColumns);
  const style = column.style || {};

  const columnStyle = {
    flex: `0 0 calc(${width}% - 24px)`,
    minWidth: '0',
    backgroundColor: style.backgroundColor || undefined,
    padding: style.padding || undefined,
    borderRadius: style.borderRadius || undefined,
  };

  // On mobile, make columns full width
  if (typeof window !== 'undefined' && window.innerWidth < 768) {
    columnStyle.flex = '0 0 100%';
  }

  return (
    <div style={columnStyle}>
      {widgets.map((widget, idx) => (
        <WidgetRenderer key={widget.id || idx} widget={widget} designSystem={designSystem} />
      ))}
    </div>
  );
}

function WidgetRenderer({ widget, designSystem }) {
  const { widgetType, props, style } = widget;
  const content = props || {};

  const wrapperStyle = {
    color: style?.color || undefined,
    fontSize: style?.fontSize || undefined,
    fontWeight: style?.fontWeight || undefined,
    textAlign: style?.textAlign || undefined,
    lineHeight: style?.lineHeight || undefined,
    backgroundColor: style?.backgroundColor || undefined,
    backgroundImage: style?.backgroundImage || undefined,
    backgroundSize: style?.backgroundSize || 'cover',
    backgroundPosition: style?.backgroundPosition || 'center',
    paddingTop: style?.paddingTop || undefined,
    paddingRight: style?.paddingRight || undefined,
    paddingBottom: style?.paddingBottom || undefined,
    paddingLeft: style?.paddingLeft || undefined,
    marginTop: style?.marginTop || undefined,
    marginRight: style?.marginRight || undefined,
    marginBottom: style?.marginBottom || undefined,
    marginLeft: style?.marginLeft || undefined,
    borderWidth: style?.borderWidth || undefined,
    borderColor: style?.borderColor || undefined,
    borderStyle: style?.borderStyle || (style?.borderWidth ? 'solid' : undefined),
    borderRadius: style?.borderRadius || undefined,
    boxShadow: style?.boxShadow || undefined,
    opacity: style?.opacity || undefined,
    transform: style?.transform || undefined,
  };

  return (
    <div style={wrapperStyle}>
      {renderWidget(widgetType, content, style, designSystem)}
    </div>
  );
}

function renderWidget(type, content, style, designSystem) {
  switch (type) {
    case 'HEADING':
      const HeadingTag = content.tag || 'h2';
      return <HeadingTag style={{ margin: 0 }}>{content.text || 'Heading'}</HeadingTag>;

    case 'TEXT':
      return <p style={{ margin: 0 }}>{content.text || 'Text content'}</p>;

    case 'IMAGE':
      if (!content.src) {
        return (
          <div className="aspect-video bg-white/5 rounded-lg flex items-center justify-center">
            <span className="text-white/30">No image</span>
          </div>
        );
      }
      return (
        <img 
          src={content.src} 
          alt={content.alt || ''} 
          style={{ 
            width: style?.width || '100%', 
            height: style?.height || 'auto',
            objectFit: style?.objectFit || 'cover',
            borderRadius: style?.borderRadius || undefined,
          }} 
        />
      );

    case 'BUTTON':
      return (
        <a 
          href={content.link || '#'} 
          style={{
            display: 'inline-block',
            padding: style?.padding || '12px 24px',
            backgroundColor: style?.backgroundColor || '#6366f1',
            color: style?.color || '#ffffff',
            borderRadius: style?.borderRadius || '8px',
            textDecoration: 'none',
            fontWeight: style?.fontWeight || '500',
          }}
        >
          {content.text || 'Button'}
        </a>
      );

    case 'DIVIDER':
      return (
        <hr style={{
          border: 'none',
          borderTop: `${style?.borderWidth || '1px'} ${content.style || 'solid'} ${style?.borderColor || 'rgba(255,255,255,0.1)'}`,
          margin: '16px 0',
        }} />
      );

    case 'SPACER':
      return <div style={{ height: style?.height || '50px' }} />;

    case 'ICON':
      return (
        <div style={{ fontSize: style?.fontSize || '48px', color: style?.color || '#6366f1', textAlign: style?.textAlign || 'center' }}>
          {content.icon || '★'}
        </div>
      );

    case 'HERO':
      return (
        <div className="py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{content.headline || 'Welcome'}</h1>
          <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">{content.subheadline || ''}</p>
          <div className="flex gap-4 justify-center flex-wrap">
            {content.primaryCta && (
              <a href={content.primaryCta.href || '#'} className="px-6 py-3 bg-indigo-500 rounded-lg font-medium hover:bg-indigo-400 transition-colors">
                {content.primaryCta.label || 'Get Started'}
              </a>
            )}
            {content.secondaryCta && (
              <a href={content.secondaryCta.href || '#'} className="px-6 py-3 border border-white/20 rounded-lg font-medium hover:bg-white/10 transition-colors">
                {content.secondaryCta.label || 'Learn More'}
              </a>
            )}
          </div>
        </div>
      );

    case 'FEATURES':
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

    case 'TESTIMONIAL':
    case 'TESTIMONIALS':
      if (content.items) {
        return (
          <div className="py-12">
            {content.headline && <h2 className="text-3xl font-bold text-center mb-10">{content.headline}</h2>}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {content.items.map((item, i) => (
                <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <p className="text-white/80 italic mb-4">"{item.quote || item.content}"</p>
                  <div className="flex items-center gap-3">
                    {item.image && <img src={item.image} alt={item.name} className="w-10 h-10 rounded-full object-cover" />}
                    <div>
                      <div className="font-semibold">{item.name}</div>
                      <div className="text-sm text-white/60">{item.role || item.title}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      }
      return (
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
          <p className="text-white/80 italic mb-4">"{content.content || 'Testimonial'}"</p>
          <div className="font-semibold">{content.name || 'Name'}</div>
          <div className="text-sm text-white/60">{content.title || 'Title'}</div>
        </div>
      );

    case 'PRICING':
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
                  <a href={plan.cta.href || '#'} className={`block text-center py-2 rounded-lg font-medium ${plan.featured ? 'bg-indigo-500 hover:bg-indigo-400' : 'bg-white/10 hover:bg-white/20'} transition-colors`}>
                    {plan.cta.label}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      );

    case 'FAQ':
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

    case 'CONTACT_FORM':
      return (
        <div className="py-12 max-w-xl mx-auto">
          {content.headline && <h2 className="text-2xl font-bold text-center mb-8">{content.headline}</h2>}
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            {(content.fields || [{ type: 'text', label: 'Name', placeholder: 'Your name' }, { type: 'email', label: 'Email', placeholder: 'Your email' }, { type: 'textarea', label: 'Message', placeholder: 'Your message' }]).map((field, i) => (
              <div key={i}>
                <label className="block text-sm text-white/70 mb-1">{field.label}</label>
                {field.type === 'textarea' ? (
                  <textarea className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-indigo-500 outline-none text-white" placeholder={field.placeholder} rows={4} />
                ) : (
                  <input type={field.type} className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-indigo-500 outline-none text-white" placeholder={field.placeholder} />
                )}
              </div>
            ))}
            <button type="submit" className="w-full py-3 bg-indigo-500 hover:bg-indigo-400 rounded-lg font-medium transition-colors">
              {content.submitText || 'Submit'}
            </button>
          </form>
        </div>
      );

    case 'NAVBAR':
      return (
        <nav className="flex items-center justify-between py-4">
          <div className="font-bold text-lg">{content.logo?.text || 'Logo'}</div>
          <div className="flex items-center gap-6">
            {(content.links || []).map((link, i) => (
              <a key={i} href={link.href || '#'} className="text-white/70 hover:text-white transition-colors">
                {link.label}
              </a>
            ))}
            {content.cta && (
              <a href={content.cta.href || '#'} className="px-4 py-2 bg-indigo-500 rounded-lg text-sm font-medium hover:bg-indigo-400 transition-colors">
                {content.cta.label}
              </a>
            )}
          </div>
        </nav>
      );

    case 'FOOTER':
      return (
        <footer className="py-12">
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
                      <a href={link.href || '#'} className="text-white/60 hover:text-white transition-colors">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="pt-8 border-t border-white/10 text-center text-sm text-white/50">
            {content.copyright || '© 2024 Company. All rights reserved.'}
          </div>
        </footer>
      );

    case 'CTA':
      return (
        <div className="rounded-2xl text-center" style={{
          backgroundColor: style?.backgroundColor || 'rgba(99, 102, 241, 0.1)',
          padding: style?.padding || '48px',
          borderRadius: style?.borderRadius || '16px',
        }}>
          <h2 className="text-3xl font-bold mb-4">{content.headline || 'Ready to Get Started?'}</h2>
          <p className="text-white/70 mb-6 max-w-xl mx-auto">{content.description || ''}</p>
          <div className="flex gap-4 justify-center flex-wrap">
            {content.primaryCta && (
              <a href={content.primaryCta.href || '#'} className="px-6 py-3 bg-indigo-500 rounded-lg font-medium hover:bg-indigo-400 transition-colors">
                {content.primaryCta.label}
              </a>
            )}
            {content.secondaryCta && (
              <a href={content.secondaryCta.href || '#'} className="px-6 py-3 border border-white/20 rounded-lg font-medium hover:bg-white/10 transition-colors">
                {content.secondaryCta.label}
              </a>
            )}
          </div>
        </div>
      );

    case 'CARDS':
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
                  <a href={card.cta.href || '#'} className="text-indigo-400 text-sm font-medium hover:text-indigo-300">
                    {card.cta.label} →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      );

    case 'STATS':
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

    case 'TEAM':
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

    case 'IMAGE_BOX':
      return (
        <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden text-center">
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
            <h3 className="font-semibold text-lg mb-2">{content.title || 'Title'}</h3>
            <p className="text-sm text-white/70">{content.description || ''}</p>
          </div>
        </div>
      );

    case 'ICON_BOX':
      return (
        <div className="text-center p-6">
          <div className="text-4xl mb-4" style={{ color: style?.iconColor || '#6366f1' }}>{content.icon || '★'}</div>
          <h3 className="font-semibold text-lg mb-2">{content.title || 'Title'}</h3>
          <p className="text-sm text-white/70">{content.description || ''}</p>
        </div>
      );

    case 'PROGRESS_BAR':
      const percentage = content.percentage || 0;
      return (
        <div className="py-2">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">{content.title || 'Progress'}</span>
            <span className="text-sm text-white/60">{percentage}%</span>
          </div>
          <div className="w-full rounded-full overflow-hidden" style={{ backgroundColor: style?.backgroundColor || 'rgba(255,255,255,0.1)', height: style?.height || '8px' }}>
            <div className="h-full rounded-full" style={{ width: `${percentage}%`, backgroundColor: style?.barColor || '#6366f1' }} />
          </div>
        </div>
      );

    case 'TABS':
      return <TabsPreview content={content} />;

    case 'CAROUSEL':
      return <CarouselPreview content={content} />;

    case 'ACCORDION':
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

    case 'VIDEO':
      if (!content.url) {
        return (
          <div className="aspect-video bg-white/5 border border-dashed border-white/20 rounded-xl flex items-center justify-center">
            <div className="text-center text-white/40">
              <div className="text-4xl mb-2">▶</div>
              <div className="text-sm">No video URL</div>
            </div>
          </div>
        );
      }
      return (
        <div className="aspect-video rounded-xl overflow-hidden">
          <iframe src={content.url} className="w-full h-full" frameBorder="0" allowFullScreen />
        </div>
      );

    case 'GALLERY':
      const columns = content.columns || 3;
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
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {content.images.map((img, i) => (
            <div key={i} className="aspect-square rounded-lg overflow-hidden">
              <img src={img.src || img} alt={img.alt || ''} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      );

    case 'SOCIAL_ICONS':
      const platformIcons = { facebook: 'f', twitter: '𝕏', instagram: '📷', linkedin: 'in', youtube: '▶' };
      return (
        <div className="flex gap-3 justify-center">
          {(content.icons || []).map((icon, i) => (
            <a key={i} href={icon.url || '#'} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
              {platformIcons[icon.platform] || '●'}
            </a>
          ))}
        </div>
      );

    case 'STAR_RATING':
      const rating = content.rating || 0;
      const maxRating = content.maxRating || 5;
      return (
        <div className="flex gap-1 justify-center">
          {Array.from({ length: maxRating }).map((_, i) => (
            <span key={i} style={{ fontSize: style?.fontSize || '24px', color: i < rating ? (style?.color || '#fbbf24') : 'rgba(255,255,255,0.2)' }}>★</span>
          ))}
        </div>
      );

    case 'COUNTER':
      return (
        <div className="text-center">
          <div style={{ fontSize: style?.numberSize || '48px', fontWeight: '700', color: style?.numberColor || '#6366f1' }}>
            {content.prefix}{content.endValue || 100}{content.suffix}
          </div>
          <div className="text-white/60 mt-2">{content.title || 'Counter'}</div>
        </div>
      );

    case 'LOGO_CLOUD':
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

    case 'PRODUCT_GRID':
      return (
        <div className="py-12">
          {content.headline && <h2 className="text-3xl font-bold mb-2">{content.headline}</h2>}
          {content.subheadline && <p className="text-white/70 mb-8">{content.subheadline}</p>}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(content.products || []).map((product, i) => (
              <div key={i} className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
                {product.image ? (
                  <div className="aspect-square">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="aspect-square bg-white/5 flex items-center justify-center">
                    <span className="text-white/30 text-4xl">🛍</span>
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-semibold">{product.name || 'Product'}</h3>
                  {product.price && <div className="text-indigo-400 font-bold mt-1">{product.price}</div>}
                  {product.description && <p className="text-sm text-white/60 mt-2">{product.description}</p>}
                </div>
              </div>
            ))}
          </div>
          {content.cta && (
            <div className="mt-8 text-center">
              <a href={content.cta.href || '#'} className="px-6 py-3 bg-indigo-500 rounded-lg font-medium hover:bg-indigo-400 transition-colors">
                {content.cta.label || 'View All'}
              </a>
            </div>
          )}
        </div>
      );

    case 'FILTER_TABS':
      return (
        <div className="py-12">
          {content.headline && <h2 className="text-3xl font-bold text-center mb-8">{content.headline}</h2>}
          <div className="flex justify-center gap-2 mb-8">
            {(content.tabs || ['All', 'Category 1', 'Category 2']).map((tab, i) => (
              <button key={i} className={`px-4 py-2 rounded-lg text-sm font-medium ${i === 0 ? 'bg-indigo-500' : 'bg-white/10 hover:bg-white/20'} transition-colors`}>
                {typeof tab === 'string' ? tab : tab.label}
              </button>
            ))}
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {(content.items || []).slice(0, 6).map((item, i) => (
              <div key={i} className="rounded-xl bg-white/5 border border-white/10 overflow-hidden">
                {item.image && <img src={item.image} alt={item.title} className="w-full aspect-video object-cover" />}
                <div className="p-4">
                  <h3 className="font-semibold">{item.title || 'Item'}</h3>
                  {item.description && <p className="text-sm text-white/60 mt-1">{item.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case 'ADVANCED_NAVBAR':
      return (
        <nav className="flex items-center justify-between py-4 px-6 bg-white/5 rounded-xl">
          <div className="flex items-center gap-8">
            <div className="font-bold text-lg">{content.logo?.text || 'Logo'}</div>
            <div className="hidden md:flex items-center gap-6">
              {(content.links || []).map((link, i) => (
                <a key={i} href={link.href || '#'} className="text-white/70 hover:text-white transition-colors text-sm">
                  {link.label}
                </a>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            {content.search && <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">🔍</div>}
            {content.cta && (
              <a href={content.cta.href || '#'} className="px-4 py-2 bg-indigo-500 rounded-lg text-sm font-medium hover:bg-indigo-400 transition-colors">
                {content.cta.label}
              </a>
            )}
          </div>
        </nav>
      );

    case 'CONTENT':
      return (
        <div className="py-12">
          <div className="prose prose-invert max-w-none">
            {content.title && <h2 className="text-2xl font-bold mb-4">{content.title}</h2>}
            <div className="text-white/70">{content.body || content.text || 'Content block'}</div>
          </div>
        </div>
      );

    case 'FEATURE_CAROUSEL':
    case 'MULTI_ROW_CAROUSEL':
    case 'IMAGE_CAROUSEL':
      return (
        <div className="py-12">
          {content.headline && <h2 className="text-3xl font-bold text-center mb-8">{content.headline}</h2>}
          <div className="relative">
            <div className="flex gap-4 overflow-hidden">
              {(content.items || content.slides || []).slice(0, 4).map((item, i) => (
                <div key={i} className="flex-shrink-0 w-64 rounded-xl bg-white/5 border border-white/10 overflow-hidden">
                  {(item.image || item.src) && <img src={item.image || item.src} alt={item.title} className="w-full aspect-video object-cover" />}
                  <div className="p-4">
                    <h3 className="font-semibold">{item.title || 'Slide'}</h3>
                    {item.description && <p className="text-sm text-white/60 mt-1">{item.description}</p>}
                  </div>
                </div>
              ))}
            </div>
            <button className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center">←</button>
            <button className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center">→</button>
          </div>
        </div>
      );

    case 'FOOTER_LINKS':
      return (
        <div className="py-8">
          <div className="grid md:grid-cols-4 gap-8">
            {(content.columns || []).map((col, i) => (
              <div key={i}>
                <h4 className="font-semibold mb-4">{col.title}</h4>
                <ul className="space-y-2">
                  {(col.links || []).map((link, li) => (
                    <li key={li}>
                      <a href={link.href || '#'} className="text-white/60 hover:text-white transition-colors text-sm">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      );

    case 'ICON_LIST':
      return (
        <ul className="space-y-3">
          {(content.items || []).map((item, i) => (
            <li key={i} className="flex items-center gap-3">
              <span className="text-indigo-400">{item.icon || '✓'}</span>
              <span>{item.text || item.label}</span>
            </li>
          ))}
        </ul>
      );

    case 'MENU':
      return (
        <nav className="flex gap-6">
          {(content.items || content.links || []).map((item, i) => (
            <a key={i} href={item.href || '#'} className="text-white/70 hover:text-white transition-colors">
              {item.label}
            </a>
          ))}
        </nav>
      );

    case 'BREADCRUMBS':
      return (
        <nav className="flex items-center gap-2 text-sm">
          {(content.items || [{ label: 'Home' }, { label: 'Page' }]).map((item, i, arr) => (
            <span key={i} className="flex items-center gap-2">
              <a href={item.href || '#'} className={i === arr.length - 1 ? 'text-white' : 'text-white/60 hover:text-white'}>
                {item.label}
              </a>
              {i < arr.length - 1 && <span className="text-white/40">/</span>}
            </span>
          ))}
        </nav>
      );

    case 'PAGE_HEADER':
      return (
        <div className="py-12 text-center">
          <h1 className="text-4xl font-bold mb-4">{content.title || 'Page Title'}</h1>
          {content.subtitle && <p className="text-white/70 text-lg">{content.subtitle}</p>}
        </div>
      );

    case 'CALL_TO_ACTION':
      return (
        <div className="py-16 px-8 rounded-2xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-center">
          <h2 className="text-3xl font-bold mb-4">{content.headline || 'Ready to get started?'}</h2>
          <p className="text-white/70 mb-8 max-w-xl mx-auto">{content.description || ''}</p>
          <div className="flex gap-4 justify-center">
            {content.primaryCta && (
              <a href={content.primaryCta.href || '#'} className="px-6 py-3 bg-indigo-500 rounded-lg font-medium hover:bg-indigo-400 transition-colors">
                {content.primaryCta.label}
              </a>
            )}
            {content.secondaryCta && (
              <a href={content.secondaryCta.href || '#'} className="px-6 py-3 border border-white/20 rounded-lg font-medium hover:bg-white/10 transition-colors">
                {content.secondaryCta.label}
              </a>
            )}
          </div>
        </div>
      );

    case 'STATS_CTA':
      return (
        <div className="py-12">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {(content.stats || []).map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl font-bold text-indigo-400">{stat.value}</div>
                <div className="text-white/60 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
          {content.cta && (
            <div className="text-center">
              <a href={content.cta.href || '#'} className="px-6 py-3 bg-indigo-500 rounded-lg font-medium hover:bg-indigo-400 transition-colors">
                {content.cta.label}
              </a>
            </div>
          )}
        </div>
      );

    case 'ICON_CARDS':
      return (
        <div className="grid md:grid-cols-3 gap-6">
          {(content.cards || content.items || []).map((card, i) => (
            <div key={i} className="p-6 rounded-xl bg-white/5 border border-white/10 text-center">
              <div className="text-3xl mb-4">{card.icon || '★'}</div>
              <h3 className="font-semibold mb-2">{card.title}</h3>
              <p className="text-sm text-white/70">{card.description || card.text}</p>
            </div>
          ))}
        </div>
      );

    case 'ABOUT':
      return (
        <div className="py-12 grid md:grid-cols-2 gap-12 items-center">
          <div>
            {content.image ? (
              <img src={content.image} alt="About" className="rounded-2xl w-full" />
            ) : (
              <div className="aspect-video bg-white/5 rounded-2xl flex items-center justify-center">
                <span className="text-white/30 text-4xl">🖼</span>
              </div>
            )}
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-4">{content.headline || 'About Us'}</h2>
            <p className="text-white/70 mb-6">{content.description || content.text || ''}</p>
            {content.cta && (
              <a href={content.cta.href || '#'} className="px-6 py-3 bg-indigo-500 rounded-lg font-medium hover:bg-indigo-400 transition-colors">
                {content.cta.label}
              </a>
            )}
          </div>
        </div>
      );

    case 'REVIEWS':
      return (
        <div className="py-12">
          {content.headline && <h2 className="text-3xl font-bold text-center mb-10">{content.headline}</h2>}
          <div className="grid md:grid-cols-3 gap-6">
            {(content.reviews || content.items || []).map((review, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: review.rating || 5 }).map((_, si) => (
                    <span key={si} className="text-yellow-400">★</span>
                  ))}
                </div>
                <p className="text-white/80 mb-4">"{review.text || review.content}"</p>
                <div className="font-semibold">{review.name || review.author}</div>
              </div>
            ))}
          </div>
        </div>
      );

    case 'TOGGLE':
      return (
        <div className="space-y-2">
          {(content.items || []).map((item, i) => (
            <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center justify-between">
                <span className="font-medium">{item.title || item.label}</span>
                <div className="w-12 h-6 rounded-full bg-indigo-500 relative">
                  <div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white" />
                </div>
              </div>
            </div>
          ))}
        </div>
      );

    case 'TESTIMONIAL_SLIDER':
      return (
        <div className="py-12 text-center">
          <div className="max-w-2xl mx-auto">
            <p className="text-xl italic text-white/80 mb-6">"{content.testimonials?.[0]?.quote || 'Great product!'}"</p>
            <div className="font-semibold">{content.testimonials?.[0]?.name || 'Customer'}</div>
            <div className="text-sm text-white/60">{content.testimonials?.[0]?.role || ''}</div>
          </div>
          <div className="flex justify-center gap-2 mt-6">
            {(content.testimonials || [1, 2, 3]).map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-white' : 'bg-white/40'}`} />
            ))}
          </div>
        </div>
      );

    case 'NEWSLETTER':
      return (
        <div className="py-12 text-center">
          <h2 className="text-2xl font-bold mb-4">{content.headline || 'Subscribe to our newsletter'}</h2>
          <p className="text-white/70 mb-6">{content.description || 'Stay updated with our latest news'}</p>
          <form className="flex gap-2 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder={content.placeholder || 'Enter your email'} className="flex-1 px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-indigo-500 outline-none" />
            <button type="submit" className="px-6 py-3 bg-indigo-500 rounded-lg font-medium hover:bg-indigo-400 transition-colors">
              {content.buttonText || 'Subscribe'}
            </button>
          </form>
        </div>
      );

    case 'SEARCH_BOX':
      return (
        <div className="relative">
          <input type="text" placeholder={content.placeholder || 'Search...'} className="w-full px-4 py-3 pl-10 rounded-lg bg-white/5 border border-white/10 focus:border-indigo-500 outline-none" />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">🔍</span>
        </div>
      );

    case 'COPYRIGHT':
      return (
        <div className="py-4 text-center text-sm text-white/50">
          {content.text || `© ${new Date().getFullYear()} Company. All rights reserved.`}
        </div>
      );

    case 'PRICE_TABLE':
      return (
        <div className="py-12">
          {content.headline && <h2 className="text-3xl font-bold text-center mb-10">{content.headline}</h2>}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="p-4 text-left">Feature</th>
                  {(content.plans || []).map((plan, i) => (
                    <th key={i} className="p-4 text-center">{plan.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(content.features || []).map((feature, fi) => (
                  <tr key={fi} className="border-b border-white/10">
                    <td className="p-4">{feature.name}</td>
                    {(content.plans || []).map((plan, pi) => (
                      <td key={pi} className="p-4 text-center">
                        {feature.values?.[pi] ? '✓' : '—'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );

    default:
      return (
        <div className="p-4 border border-dashed border-white/20 rounded-lg text-center text-white/50">
          Unknown widget: {type}
        </div>
      );
  }
}

function TabsPreview({ content }) {
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
            className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === i ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-white/60 hover:text-white/80'}`}
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

function CarouselPreview({ content }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = content.slides || [];

  if (slides.length === 0) {
    return (
      <div className="aspect-video bg-white/5 border border-dashed border-white/20 rounded-xl flex items-center justify-center">
        <div className="text-center text-white/40">
          <div className="text-4xl mb-2">↔</div>
          <div className="text-sm">No slides</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative rounded-xl overflow-hidden">
      <div className="aspect-video relative">
        {slides[currentSlide]?.image ? (
          <img src={slides[currentSlide].image} alt={slides[currentSlide].title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
            <span className="text-white/30 text-4xl">🖼</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="text-xl font-bold mb-2">{slides[currentSlide]?.title}</h3>
          {slides[currentSlide]?.description && <p className="text-white/70">{slides[currentSlide].description}</p>}
        </div>
      </div>
      {content.arrows !== false && slides.length > 1 && (
        <>
          <button type="button" onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-colors">←</button>
          <button type="button" onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-colors">→</button>
        </>
      )}
      {content.dots !== false && slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, i) => (
            <button key={i} type="button" onClick={() => setCurrentSlide(i)} className={`w-2 h-2 rounded-full transition-colors ${i === currentSlide ? 'bg-white' : 'bg-white/40'}`} />
          ))}
        </div>
      )}
    </div>
  );
}
