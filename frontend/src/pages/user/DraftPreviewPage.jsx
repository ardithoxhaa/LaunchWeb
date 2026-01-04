import { useEffect, useMemo, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { api } from '../../lib/api.js';

export function DraftPreviewPage() {
  const { id } = useParams();
  const websiteId = Number(id);
  const location = useLocation();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let canceled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const { data: payload } = await api.get(`/websites/${websiteId}/builder`);
        if (!canceled) {
          setData(payload);
        }
      } catch (err) {
        console.error('DraftPreview error:', err);
        if (!canceled) setError(err?.response?.data?.error?.message ?? 'Preview not available');
      } finally {
        if (!canceled) setLoading(false);
      }
    }

    if (Number.isFinite(websiteId)) load();

    return () => {
      canceled = true;
    };
  }, [websiteId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a12] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <div className="text-white/60">Loading preview...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a12] flex items-center justify-center">
        <div className="text-center max-w-md p-8">
          <div className="text-4xl mb-4">⚠️</div>
          <div className="text-xl font-semibold text-white mb-2">Preview Error</div>
          <div className="text-white/60">{error}</div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-[#0a0a12] flex items-center justify-center">
        <div className="text-white/60">No data available</div>
      </div>
    );
  }

  // Get the first page's builder data
  const page = data.pages?.[0];
  const builder = page?.builder;

  // If no pages exist
  if (!data.pages || data.pages.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a12] flex items-center justify-center text-white">
        <div className="text-center">
          <div className="text-4xl mb-4">📄</div>
          <div className="text-xl mb-2">No pages found</div>
          <div className="text-white/60 text-sm">This website has no pages yet.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a12] text-white">
      <BuilderPreview 
        builder={builder}
        designSystem={data.website?.settings?.designSystem}
      />
    </div>
  );
}

// Inline Builder Preview Component
function BuilderPreview({ builder, designSystem }) {
  if (!builder?.root) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-4xl mb-4">📄</div>
          <div className="text-xl mb-2">No content to preview</div>
          <div className="text-white/60 text-sm">Save your changes in the builder first.</div>
        </div>
      </div>
    );
  }

  // Extract sections from root
  const sections = [];
  function extractSections(node) {
    if (!node) return;
    if (node.type === 'SECTION') sections.push(node);
    const children = Array.isArray(node.children) ? node.children : [];
    for (const child of children) extractSections(child);
  }
  extractSections(builder.root);

  if (sections.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-4xl mb-4">📄</div>
          <div className="text-xl mb-2">No sections found</div>
          <div className="text-white/60 text-sm">Add sections in the builder and save to preview.</div>
        </div>
      </div>
    );
  }

  const theme = designSystem?.colors || {};

  return (
    <div className="min-h-screen" style={{ 
      fontFamily: designSystem?.typography?.fontFamily || 'system-ui, sans-serif',
      color: '#ffffff',
      backgroundColor: '#0a0a12',
    }}>
      {sections.map((section, idx) => (
        <SectionPreview key={section.id || idx} section={section} theme={theme} />
      ))}
    </div>
  );
}

function SectionPreview({ section, theme }) {
  const style = section.style || {};
  
  const sectionStyle = {
    backgroundColor: style.backgroundColor || 'transparent',
    backgroundImage: style.backgroundImage || undefined,
    backgroundSize: style.backgroundSize || 'cover',
    backgroundPosition: style.backgroundPosition || 'center',
    paddingTop: style.paddingTop || '60px',
    paddingBottom: style.paddingBottom || '60px',
    minHeight: style.minHeight || undefined,
  };

  const containers = (section.children || []).filter(n => n?.type === 'CONTAINER');
  const effectiveContainers = containers.length ? containers : [{ children: section.children || [] }];

  return (
    <section style={sectionStyle}>
      {effectiveContainers.map((container, cidx) => (
        <ContainerPreview key={container?.id || cidx} container={container} settings={section.settings} theme={theme} />
      ))}
    </section>
  );
}

function ContainerPreview({ container, settings, theme }) {
  const columns = (container?.children || []).filter(n => n?.type === 'COLUMN');
  const effectiveColumns = columns.length ? columns : [{ children: container?.children || [], width: 100 }];
  
  const isFullWidth = settings?.contentWidth === 'full';
  const gap = settings?.columnsGap === 'none' ? '0' : settings?.columnsGap === 'wide' ? '48px' : '24px';

  return (
    <div style={{ 
      width: '100%',
      maxWidth: isFullWidth ? '100%' : '1200px', 
      margin: '0 auto', 
      paddingLeft: isFullWidth ? '0' : '32px', 
      paddingRight: isFullWidth ? '0' : '32px' 
    }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap }}>
        {effectiveColumns.map((column, idx) => (
          <ColumnPreview key={column?.id || idx} column={column} totalColumns={effectiveColumns.length} theme={theme} />
        ))}
      </div>
    </div>
  );
}

function ColumnPreview({ column, totalColumns, theme }) {
  const widgets = (column?.children || []).filter(n => n?.type === 'WIDGET');
  const width = column?.width || Math.floor(100 / totalColumns);

  return (
    <div style={{ flex: `0 0 calc(${width}% - 24px)`, minWidth: 0 }}>
      {widgets.map((widget, idx) => (
        <WidgetPreview key={widget?.id || idx} widget={widget} theme={theme} />
      ))}
    </div>
  );
}

function WidgetPreview({ widget, theme }) {
  const { widgetType, props, style } = widget;
  const content = props || {};

  const wrapperStyle = {
    color: style?.color || undefined,
    fontSize: style?.fontSize || undefined,
    fontWeight: style?.fontWeight || undefined,
    textAlign: style?.textAlign || undefined,
    backgroundColor: style?.backgroundColor || undefined,
    padding: style?.padding || undefined,
    paddingTop: style?.paddingTop || undefined,
    paddingRight: style?.paddingRight || undefined,
    paddingBottom: style?.paddingBottom || undefined,
    paddingLeft: style?.paddingLeft || undefined,
    marginTop: style?.marginTop || undefined,
    marginBottom: style?.marginBottom || undefined,
    borderRadius: style?.borderRadius || undefined,
    borderWidth: style?.borderWidth || undefined,
    borderColor: style?.borderColor || undefined,
    borderStyle: style?.borderWidth ? 'solid' : undefined,
  };

  return (
    <div style={wrapperStyle}>
      <RenderWidgetContent type={widgetType} content={content} style={style} theme={theme} />
    </div>
  );
}

function RenderWidgetContent({ type, content, style, theme }) {
  const primaryColor = theme?.primary || '#6366f1';
  switch (type) {
    case 'HEADING':
      const Tag = content.tag || 'h2';
      return <Tag style={{ margin: 0 }}>{content.text || 'Heading'}</Tag>;

    case 'TEXT':
      return <p style={{ margin: 0, lineHeight: 1.6 }}>{content.text || 'Text content'}</p>;

    case 'IMAGE':
      if (!content.src) return <div className="aspect-video bg-white/5 rounded-lg flex items-center justify-center"><span className="text-white/30">No image</span></div>;
      return <img src={content.src} alt={content.alt || ''} style={{ width: '100%', height: 'auto', borderRadius: style?.borderRadius }} />;

    case 'BUTTON':
      return (
        <a href={content.link || '#'} style={{ display: 'inline-block', padding: '12px 24px', backgroundColor: style?.backgroundColor || '#6366f1', color: style?.color || '#fff', borderRadius: style?.borderRadius || '8px', textDecoration: 'none', fontWeight: 500 }}>
          {content.text || 'Button'}
        </a>
      );

    case 'DIVIDER':
      return <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)', margin: '16px 0' }} />;

    case 'SPACER':
      return <div style={{ height: style?.height || '50px' }} />;

    case 'HERO':
      return (
        <div className="py-16">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{content.headline || 'Welcome'}</h1>
              <p className="text-lg text-white/70 mb-8">{content.subheadline || ''}</p>
              <div className="flex gap-4 flex-wrap">
                {content.primaryCta?.label && <a href={content.primaryCta.href || '#'} className="px-6 py-3 rounded-lg font-medium" style={{ backgroundColor: primaryColor }}>{content.primaryCta.label}</a>}
                {content.secondaryCta?.label && <a href={content.secondaryCta.href || '#'} className="px-6 py-3 border border-white/20 rounded-lg font-medium">{content.secondaryCta.label}</a>}
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
            <div className="grid md:grid-cols-3 gap-6">
              {content.items.map((item, i) => (
                <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <p className="text-white/80 italic mb-4">"{item.quote || item.content}"</p>
                  <div className="font-semibold">{item.name}</div>
                  <div className="text-sm text-white/60">{item.role}</div>
                </div>
              ))}
            </div>
          </div>
        );
      }
      return (
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
          <p className="text-white/80 italic mb-4">"{content.content}"</p>
          <div className="font-semibold">{content.name}</div>
          <div className="text-sm text-white/60">{content.title}</div>
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
                  {(plan.features || []).map((f, fi) => <li key={fi} className="text-sm text-white/70">✓ {f}</li>)}
                </ul>
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
              <details key={i} className="rounded-xl border border-white/10 bg-white/5">
                <summary className="cursor-pointer p-4 font-medium">{item.q}</summary>
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
          <form className="space-y-4">
            <input type="text" placeholder="Name" className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white" />
            <input type="email" placeholder="Email" className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white" />
            <textarea placeholder="Message" rows={4} className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white" />
            <button type="button" className="w-full py-3 bg-indigo-500 rounded-lg font-medium">{content.submitText || 'Submit'}</button>
          </form>
        </div>
      );

    case 'NAVBAR':
      // Support both logo.image/logo.text and logoImageUrl/logoText formats
      const navLogoImage = content.logo?.image || content.logoImageUrl;
      const navLogoText = content.logo?.text || content.logoText || 'Logo';
      return (
        <nav className="flex items-center justify-between py-4">
          <div className="font-bold text-lg">
            {navLogoImage ? (
              <img src={navLogoImage} alt={navLogoText} className="h-10 w-auto object-contain" />
            ) : (
              navLogoText
            )}
          </div>
          <div className="flex items-center gap-6">
            {(content.links || []).map((link, i) => <a key={i} href={link.href || '#'} className="text-white/70 hover:text-white">{link.label}</a>)}
            {content.cta?.label && <a href={content.cta.href || '#'} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ backgroundColor: primaryColor }}>{content.cta.label}</a>}
          </div>
        </nav>
      );

    case 'FOOTER':
      return (
        <footer className="py-12">
          <div className="text-center text-sm text-white/50">{content.copyright || '© 2024 Company'}</div>
        </footer>
      );

    case 'CTA':
      return (
        <div className="rounded-2xl text-center p-12" style={{ backgroundColor: `${primaryColor}1a` }}>
          <h2 className="text-3xl font-bold mb-4">{content.headline || 'Ready to Get Started?'}</h2>
          <p className="text-white/70 mb-6">{content.description}</p>
          <div className="flex gap-4 justify-center">
            {content.primaryCta && <a href={content.primaryCta.href || '#'} className="px-6 py-3 rounded-lg font-medium" style={{ backgroundColor: primaryColor }}>{content.primaryCta.label}</a>}
          </div>
        </div>
      );

    case 'CARDS':
      return (
        <div className="grid md:grid-cols-3 gap-6">
          {(content.cards || []).map((card, i) => (
            <div key={i} className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
              {card.image && <img src={card.image} alt={card.title} className="w-full aspect-video object-cover" />}
              <div className="p-6">
                <h3 className="font-semibold mb-2">{card.title}</h3>
                <p className="text-sm text-white/70">{card.text}</p>
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
          <div className="grid md:grid-cols-4 gap-6">
            {(content.members || []).map((member, i) => (
              <div key={i} className="text-center p-6 rounded-2xl bg-white/5 border border-white/10">
                {member.image ? <img src={member.image} alt={member.name} className="w-24 h-24 rounded-full mx-auto mb-4 object-cover" /> : <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-indigo-500 flex items-center justify-center text-2xl font-bold">{member.name?.charAt(0)}</div>}
                <h3 className="font-semibold">{member.name}</h3>
                <div className="text-sm text-indigo-400">{member.role}</div>
              </div>
            ))}
          </div>
        </div>
      );

    case 'ICON_BOX':
    case 'IMAGE_BOX':
      return (
        <div className="text-center p-6 rounded-2xl bg-white/5 border border-white/10">
          {content.icon && <div className="text-4xl mb-4 text-indigo-400">{content.icon}</div>}
          {content.src && <img src={content.src} alt={content.title} className="w-full aspect-video object-cover rounded-lg mb-4" />}
          <h3 className="font-semibold mb-2">{content.title}</h3>
          <p className="text-sm text-white/70">{content.description}</p>
        </div>
      );

    case 'PROGRESS_BAR':
      return (
        <div className="py-2">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">{content.title}</span>
            <span className="text-sm text-white/60">{content.percentage}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-white/10">
            <div className="h-full rounded-full bg-indigo-500" style={{ width: `${content.percentage}%` }} />
          </div>
        </div>
      );

    case 'TABS':
      return <TabsPreviewWidget content={content} />;

    case 'CAROUSEL':
      return <CarouselPreviewWidget content={content} />;

    case 'ACCORDION':
      return (
        <div className="space-y-2">
          {(content.items || []).map((item, i) => (
            <details key={i} className="rounded-xl border border-white/10 bg-white/5">
              <summary className="cursor-pointer p-4 font-medium">{item.title}</summary>
              <div className="px-4 pb-4 text-white/70">{item.content}</div>
            </details>
          ))}
        </div>
      );

    case 'VIDEO':
      if (!content.url) return <div className="aspect-video bg-white/5 rounded-xl flex items-center justify-center"><span className="text-white/30">No video</span></div>;
      return <iframe src={content.url} className="w-full aspect-video rounded-xl" frameBorder="0" allowFullScreen />;

    case 'GALLERY':
      return (
        <div className="grid grid-cols-3 gap-4">
          {(content.images || []).map((img, i) => (
            <div key={i} className="aspect-square rounded-lg overflow-hidden">
              <img src={typeof img === 'string' ? img : img.src} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      );

    case 'SOCIAL_ICONS':
      return (
        <div className="flex gap-3 justify-center">
          {(content.icons || []).map((icon, i) => (
            <a key={i} href={icon.url || '#'} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              {icon.platform?.charAt(0).toUpperCase()}
            </a>
          ))}
        </div>
      );

    case 'LOGO_CLOUD':
      return (
        <div className="py-8 text-center">
          <div className="text-sm text-white/50 mb-6">{content.label || 'Trusted by'}</div>
          <div className="flex flex-wrap justify-center gap-8">
            {(content.logos || []).map((logo, i) => (
              <div key={i} className="h-8 px-4 bg-white/5 rounded-lg flex items-center justify-center">
                <span className="text-white/40 text-sm">{logo.alt || `Logo ${i + 1}`}</span>
              </div>
            ))}
          </div>
        </div>
      );

    default:
      return <div className="p-4 border border-dashed border-white/20 rounded-lg text-center text-white/50">{type || 'Unknown'}</div>;
  }
}

function TabsPreviewWidget({ content }) {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = content.tabs || [];
  return (
    <div className="py-4">
      <div className="flex border-b border-white/10 mb-4">
        {tabs.map((tab, i) => (
          <button key={i} type="button" onClick={() => setActiveTab(i)} className={`px-4 py-2 text-sm font-medium ${activeTab === i ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-white/60'}`}>{tab.title}</button>
        ))}
      </div>
      <div className="p-4 rounded-lg bg-white/5">{tabs[activeTab]?.content || 'Tab content'}</div>
    </div>
  );
}

function CarouselPreviewWidget({ content }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = content.slides || [];
  if (!slides.length) return <div className="aspect-video bg-white/5 rounded-xl flex items-center justify-center"><span className="text-white/30">No slides</span></div>;
  return (
    <div className="relative rounded-xl overflow-hidden">
      <div className="aspect-video relative">
        {slides[currentSlide]?.image ? <img src={slides[currentSlide].image} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-indigo-500/20" />}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="text-xl font-bold">{slides[currentSlide]?.title}</h3>
          {slides[currentSlide]?.description && <p className="text-white/70">{slides[currentSlide].description}</p>}
        </div>
      </div>
      {slides.length > 1 && (
        <>
          <button type="button" onClick={() => setCurrentSlide((p) => (p - 1 + slides.length) % slides.length)} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center">←</button>
          <button type="button" onClick={() => setCurrentSlide((p) => (p + 1) % slides.length)} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center">→</button>
        </>
      )}
    </div>
  );
}
