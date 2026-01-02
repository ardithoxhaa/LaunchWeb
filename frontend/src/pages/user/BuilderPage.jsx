import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../../lib/api.js';
import { SiteRenderer } from '../../components/website/SiteRenderer.jsx';

const COMPONENT_TYPES = [
  'NAVBAR',
  'ADVANCED_NAVBAR',
  'HERO',
  'FEATURES',
  'CONTENT',
  'CARDS',
  'GALLERY',
  'LOGO_CLOUD',
  'PRODUCT_GRID',
  'FILTER_TABS',
  'FEATURE_CAROUSEL',
  'MULTI_ROW_CAROUSEL',
  'PRICING',
  'TESTIMONIALS',
  'FAQ',
  'STATS_CTA',
  'CONTACT_FORM',
  'FOOTER',
  'FOOTER_LINKS',
];

function SmallButton({ children, onClick, variant = 'neutral', disabled }) {
  const cls =
    variant === 'primary'
      ? 'bg-indigo-500 hover:bg-indigo-400'
      : variant === 'danger'
        ? 'bg-red-500/20 hover:bg-red-500/30 text-red-200'
        : 'bg-white/10 hover:bg-white/15';

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`rounded-md px-3 py-1.5 text-xs font-medium transition disabled:opacity-50 ${cls}`}
    >
      {children}
    </button>
  );
}

function isHexColor(value) {
  return typeof value === 'string' && /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value.trim());
}

function ColorPickerField({ label, value, onChange, placeholder }) {
  const safeValue = isHexColor(value) ? value.trim() : '#000000';
  return (
    <label className="block">
      <div className="text-sm text-white/70">{label}</div>
      <div className="mt-1 flex items-center gap-2">
        <input
          type="color"
          value={safeValue}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-12 rounded-md border border-white/10 bg-black/30"
        />
        <input
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm"
          placeholder={placeholder}
        />
      </div>
    </label>
  );
}

function TextInput({ label, value, onChange, placeholder }) {
  return (
    <label className="block">
      <div className="text-sm text-white/70">{label}</div>
      <input
        value={value ?? ''}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm"
      />
    </label>
  );
}

function defaultPropsForType(type) {
  switch (type) {
    case 'NAVBAR':
      return { logoText: 'My Business', links: [{ label: 'Home', href: '/' }] };
    case 'ADVANCED_NAVBAR':
      return {
        logoText: 'My Business',
        links: [
          { label: 'Home', href: '/' },
          { label: 'Collections', href: '/collections' },
          { label: 'About', href: '/about' },
        ],
        showSearch: true,
        searchPlaceholder: 'Search products…',
        ctas: [
          { label: 'Sign in', href: '/login', variant: 'neutral' },
          { label: 'Get started', href: '/contact', variant: 'primary' },
        ],
      };
    case 'HERO':
      return { headline: 'Headline', subheadline: 'Short supporting copy', primaryCta: { label: 'Get started', href: '/contact' } };
    case 'FEATURES':
      return { items: [{ title: 'Feature', text: 'Describe value' }] };
    case 'CONTENT':
      return { title: 'Section title', paragraphs: ['Your paragraph here.'] };
    case 'LOGO_CLOUD':
      return {
        label: 'Trusted by',
        logos: [
          { src: '', alt: 'Brand One' },
          { src: '', alt: 'Brand Two' },
          { src: '', alt: 'Brand Three' },
          { src: '', alt: 'Brand Four' },
          { src: '', alt: 'Brand Five' },
          { src: '', alt: 'Brand Six' },
        ],
      };
    case 'MULTI_ROW_CAROUSEL':
      return {
        rows: [
          {
            title: 'Trending now',
            subtitle: 'Popular picks this week.',
            cta: { label: 'Browse', href: '/browse' },
            items: [
              { title: 'Show / Item', tagline: 'Short tagline', imageUrl: '', href: '/contact' },
              { title: 'Show / Item', tagline: 'Short tagline', imageUrl: '', href: '/contact' },
              { title: 'Show / Item', tagline: 'Short tagline', imageUrl: '', href: '/contact' },
              { title: 'Show / Item', tagline: 'Short tagline', imageUrl: '', href: '/contact' },
            ],
          },
          {
            title: 'New releases',
            subtitle: 'Fresh content added recently.',
            cta: { label: 'See all', href: '/browse' },
            items: [
              { title: 'Show / Item', tagline: 'Short tagline', imageUrl: '', href: '/contact' },
              { title: 'Show / Item', tagline: 'Short tagline', imageUrl: '', href: '/contact' },
              { title: 'Show / Item', tagline: 'Short tagline', imageUrl: '', href: '/contact' },
              { title: 'Show / Item', tagline: 'Short tagline', imageUrl: '', href: '/contact' },
            ],
          },
        ],
      };
    case 'PRODUCT_GRID':
      return {
        headline: 'Popular products',
        subheadline: 'Curated picks with transparent pricing.',
        cta: { label: 'View all', href: '/contact' },
        products: [
          {
            name: 'Product name',
            description: 'Short product description',
            price: '€49',
            badge: 'New',
            imageUrl: '',
            cta: { label: 'Buy', href: '/contact' },
          },
          {
            name: 'Product name',
            description: 'Short product description',
            price: '€79',
            badge: 'Best seller',
            imageUrl: '',
            cta: { label: 'Buy', href: '/contact' },
          },
          {
            name: 'Product name',
            description: 'Short product description',
            price: '€29',
            badge: null,
            imageUrl: '',
            cta: { label: 'Buy', href: '/contact' },
          },
          {
            name: 'Product name',
            description: 'Short product description',
            price: '€99',
            badge: null,
            imageUrl: '',
            cta: { label: 'Buy', href: '/contact' },
          },
        ],
      };
    case 'FILTER_TABS':
      return {
        headline: 'Shop by category',
        subheadline: 'Tap a category to browse items.',
        defaultTab: 'all',
        tabs: [
          { label: 'All', value: 'all' },
          { label: 'Shoes', value: 'shoes' },
          { label: 'Apparel', value: 'apparel' },
          { label: 'Accessories', value: 'accessories' },
        ],
        products: [
          {
            name: 'Product name',
            description: 'Short product description',
            price: '€49',
            badge: 'New',
            imageUrl: '',
            categories: ['shoes'],
            cta: { label: 'View', href: '/contact' },
          },
          {
            name: 'Product name',
            description: 'Short product description',
            price: '€79',
            badge: null,
            imageUrl: '',
            categories: ['apparel'],
            cta: { label: 'View', href: '/contact' },
          },
          {
            name: 'Product name',
            description: 'Short product description',
            price: '€29',
            badge: null,
            imageUrl: '',
            categories: ['accessories'],
            cta: { label: 'View', href: '/contact' },
          },
          {
            name: 'Product name',
            description: 'Short product description',
            price: '€99',
            badge: 'Best seller',
            imageUrl: '',
            categories: ['shoes', 'apparel'],
            cta: { label: 'View', href: '/contact' },
          },
        ],
      };
    case 'FEATURE_CAROUSEL':
      return {
        headline: 'Featured',
        subheadline: 'A horizontal carousel section (Netflix-style row).',
        cta: { label: 'See all', href: '/contact' },
        items: [
          { title: 'Feature item', tagline: 'Short tagline', imageUrl: '', cta: { label: 'Open', href: '/contact' } },
          { title: 'Feature item', tagline: 'Short tagline', imageUrl: '', cta: { label: 'Open', href: '/contact' } },
          { title: 'Feature item', tagline: 'Short tagline', imageUrl: '', cta: { label: 'Open', href: '/contact' } },
          { title: 'Feature item', tagline: 'Short tagline', imageUrl: '', cta: { label: 'Open', href: '/contact' } },
        ],
      };
    case 'CARDS':
      return {
        cards: [
          { title: 'Card title', text: 'Card description', cta: { label: 'Learn more', href: '/contact' } },
          { title: 'Card title', text: 'Card description', cta: { label: 'Learn more', href: '/contact' } },
          { title: 'Card title', text: 'Card description', cta: { label: 'Learn more', href: '/contact' } },
        ],
      };
    case 'GALLERY':
      return { images: ['https://example.com/image-1.jpg', 'https://example.com/image-2.jpg', 'https://example.com/image-3.jpg'] };
    case 'PRICING':
      return {
        plans: [
          { name: 'Starter', price: '€19', period: '/mo', features: ['Feature A', 'Feature B', 'Feature C'] },
          { name: 'Pro', price: '€49', period: '/mo', features: ['Feature A', 'Feature B', 'Feature C'] },
          { name: 'Agency', price: '€99', period: '/mo', features: ['Feature A', 'Feature B', 'Feature C'] },
        ],
      };
    case 'CONTACT_FORM':
      return { headline: 'Contact us', fields: ['name', 'email', 'message'] };
    case 'FOOTER':
      return { text: '© My Business' };
    case 'FOOTER_LINKS':
      return {
        brand: 'My Business',
        description: 'Build a real-looking site in minutes.',
        columns: [
          {
            title: 'Product',
            links: [
              { label: 'Features', href: '/#features' },
              { label: 'Templates', href: '/templates' },
              { label: 'Pricing', href: '/#pricing' },
            ],
          },
          {
            title: 'Company',
            links: [
              { label: 'About', href: '/about' },
              { label: 'Careers', href: '/careers' },
              { label: 'Contact', href: '/contact' },
            ],
          },
          {
            title: 'Resources',
            links: [
              { label: 'Help', href: '/help' },
              { label: 'Docs', href: '/docs' },
              { label: 'Privacy', href: '/privacy' },
            ],
          },
        ],
        copyright: `© ${new Date().getFullYear()} My Business`,
      };
    case 'TESTIMONIALS':
      return {
        headline: 'Loved by customers',
        subheadline: 'Real stories from real people.',
        items: [
          { name: 'Alex', role: 'Founder', quote: 'LaunchWeb helped us ship faster.' },
          { name: 'Mina', role: 'Owner', quote: 'The editor is super simple.' },
          { name: 'Sam', role: 'Manager', quote: 'Preview + publish feels professional.' },
        ],
      };
    case 'FAQ':
      return {
        headline: 'FAQ',
        subheadline: 'Quick answers to common questions.',
        items: [
          { q: 'Can I edit everything?', a: 'Yes — sections, text, colors, and layout.' },
          { q: 'Is my data private?', a: 'Yes — templates are cloned per website.' },
          { q: 'Can I unpublish?', a: 'Yes — anytime.' },
        ],
      };
    case 'STATS_CTA':
      return {
        headline: 'Ready to launch?',
        subheadline: 'Publish a site that looks like a real brand.',
        primaryCta: { label: 'Get started', href: '/contact' },
        items: [
          { value: '8–10', label: 'templates' },
          { value: 'Drag & drop', label: 'builder' },
          { value: 'Versioned', label: 'safe edits' },
        ],
      };
    default:
      return {};
  }
}

function defaultStylesForType(type) {
  switch (type) {
    case 'NAVBAR':
      return { variant: 'solid' };
    case 'HERO':
      return { layout: 'split', backgroundColor: null, buttonColor: null };
    case 'FEATURES':
      return { columns: 3 };
    case 'CONTENT':
      return { width: 'md' };
    case 'CONTACT_FORM':
      return { layout: 'card' };
    case 'FOOTER':
      return { variant: 'dark' };
    default:
      return {};
  }
}

export function BuilderPage() {
  const { id } = useParams();
  const websiteId = Number(id);

  const [website, setWebsite] = useState(null);
  const [pages, setPages] = useState(null);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(null);
  const [saving, setSaving] = useState(false);

  const [activePageIndex, setActivePageIndex] = useState(0);
  const [activeComponentIndex, setActiveComponentIndex] = useState(0);
  const [dragIndex, setDragIndex] = useState(null);
  const [dragNewType, setDragNewType] = useState(null);
  const [hoverIndex, setHoverIndex] = useState(null);

  const [previewMode, setPreviewMode] = useState('desktop');

  const [panelOpen, setPanelOpen] = useState(false);
  const [panelTab, setPanelTab] = useState('website');
  const [panelBusy, setPanelBusy] = useState(false);
  const [versions, setVersions] = useState([]);
  const [versionsLoading, setVersionsLoading] = useState(false);
  const [seoDraft, setSeoDraft] = useState(null);
  const [themeDraft, setThemeDraft] = useState(null);
  const [designSystemDraft, setDesignSystemDraft] = useState(null);

  const [assets, setAssets] = useState([]);
  const [assetsError, setAssetsError] = useState(null);
  const [uploadingAsset, setUploadingAsset] = useState(false);

  const [focusCanvas, setFocusCanvas] = useState(false);
  const [canvasZoom, setCanvasZoom] = useState(1);

  function updateActiveComponent(mutator) {
    setPages((prev) => {
      const next = (prev ?? []).map((p) => ({
        ...p,
        components: (p.components ?? []).map((c) => ({
          ...c,
          props: { ...(c.props ?? {}) },
          styles: { ...(c.styles ?? {}) },
        })),
      }));
      const page2 = next?.[activePageIndex];
      const comp = page2?.components?.[activeComponentIndex];
      if (!page2 || !comp) return prev;
      mutator(comp);
      return next;
    });
  }

  useEffect(() => {
    let canceled = false;

    async function load() {
      try {
        setError(null);
        const { data: payload } = await api.get(`/websites/${websiteId}/structure`);
        if (!canceled) {
          setWebsite(payload.website);
          setPages(payload.pages);
          setActivePageIndex(0);
          setActiveComponentIndex(0);
        }
      } catch (err) {
        if (!canceled) setError(err?.response?.data?.error?.message ?? 'Failed to load website');
      }
    }

    if (Number.isFinite(websiteId)) load();

    return () => {
      canceled = true;
    };
  }, [websiteId]);

  useEffect(() => {
    if (!website) return;
    setSeoDraft(website?.seo ?? { title: website?.name ?? '', description: '', ogImage: null });
    setThemeDraft(website?.settings?.theme ?? { primary: '#6366f1', background: '#070a12' });
    setDesignSystemDraft(
      website?.settings?.designSystem ?? {
        colors: {
          primary: '#6366f1',
          secondary: '#22c55e',
          background: '#070a12',
          surface: 'rgba(255,255,255,0.06)',
          text: 'rgba(255,255,255,0.92)',
          mutedText: 'rgba(255,255,255,0.70)',
        },
        typography: {
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji"',
          baseFontSize: 16,
          lineHeight: 1.5,
          headingWeight: 600,
          bodyWeight: 400,
        },
        radius: { sm: 10, md: 16, lg: 24 },
        shadow: { card: '0 10px 30px rgba(0,0,0,0.35)' },
        buttons: { style: 'solid', radius: 12 },
        links: { underline: false },
        spacing: { sectionY: 64, containerX: 16 },
        brand: { name: website?.name ?? 'Website' },
      }
    );
  }, [website]);

  useEffect(() => {
    let canceled = false;

    async function loadAssets() {
      if (!Number.isFinite(websiteId)) return;
      try {
        setAssetsError(null);
        const { data } = await api.get('/assets', { params: { websiteId } });
        if (!canceled) setAssets(data.assets ?? []);
      } catch (err) {
        if (!canceled) setAssetsError(err?.response?.data?.error?.message ?? 'Failed to load assets');
      }
    }

    loadAssets();

    return () => {
      canceled = true;
    };
  }, [websiteId]);

  function makeAbsoluteAssetUrl(url) {
    if (!url) return '';
    if (/^https?:\/\//i.test(url)) return url;
    return `http://localhost:5000${url}`;
  }

  async function saveStructure(nextPages) {
    setSaving(true);
    setStatus(null);
    try {
      const payloadPages = (nextPages ?? []).map((p, pidx) => ({
        name: p.name,
        path: p.path,
        sortOrder: p.sortOrder ?? p.sort_order ?? pidx,
        meta: p.meta ?? {},
        components: (p.components ?? []).map((c, idx) => ({
          type: c.type,
          orderIndex: idx,
          props: c.props ?? {},
          styles: c.styles ?? {},
        })),
      }));

      const { data: resp } = await api.put(`/websites/${websiteId}/structure`, { pages: payloadPages });
      setWebsite(resp.website);
      setPages(resp.pages);
      setStatus('Saved');
    } catch (err) {
      setError(err?.response?.data?.error?.message ?? 'Failed to save');
    } finally {
      setSaving(false);
      setTimeout(() => setStatus(null), 1500);
    }
  }

  async function loadVersions() {
    if (!Number.isFinite(websiteId)) return;
    try {
      setVersionsLoading(true);
      const { data } = await api.get(`/websites/${websiteId}/versions`);
      setVersions(data.versions ?? []);
    } catch (err) {
      setError(err?.response?.data?.error?.message ?? 'Failed to load versions');
    } finally {
      setVersionsLoading(false);
    }
  }

  async function publishToggle() {
    if (!Number.isFinite(websiteId)) return;
    try {
      setSaving(true);
      setError(null);
      const endpoint = website?.status === 'PUBLISHED' ? 'unpublish' : 'publish';
      const { data } = await api.post(`/websites/${websiteId}/${endpoint}`);
      setWebsite(data.website);
      setStatus(data.website?.status === 'PUBLISHED' ? 'Published' : 'Unpublished');
    } catch (err) {
      setError(err?.response?.data?.error?.message ?? 'Failed to change publish status');
    } finally {
      setSaving(false);
      setTimeout(() => setStatus(null), 1500);
    }
  }

  async function saveSeoDraft() {
    try {
      setPanelBusy(true);
      setError(null);
      const { data } = await api.put(`/websites/${websiteId}/seo`, { seo: seoDraft ?? {} });
      setWebsite(data.website);
      setStatus('Saved');
    } catch (err) {
      setError(err?.response?.data?.error?.message ?? 'Failed to save SEO');
    } finally {
      setPanelBusy(false);
      setTimeout(() => setStatus(null), 1500);
    }
  }

  async function saveThemeDraft() {
    try {
      setPanelBusy(true);
      setError(null);

      const nextDesignSystem = {
        ...(designSystemDraft ?? {}),
        colors: { ...(designSystemDraft?.colors ?? {}) },
        typography: { ...(designSystemDraft?.typography ?? {}) },
        spacing: { ...(designSystemDraft?.spacing ?? {}) },
      };

      const nextSettings = {
        ...(website?.settings ?? {}),
        designSystem: nextDesignSystem,
        theme: {
          primary: nextDesignSystem?.colors?.primary ?? themeDraft?.primary ?? '#6366f1',
          background: nextDesignSystem?.colors?.background ?? themeDraft?.background ?? '#070a12',
        },
      };
      const { data } = await api.put(`/websites/${websiteId}/settings`, { settings: nextSettings });
      setWebsite(data.website);
      setStatus('Saved');
    } catch (err) {
      setError(err?.response?.data?.error?.message ?? 'Failed to save settings');
    } finally {
      setPanelBusy(false);
      setTimeout(() => setStatus(null), 1500);
    }
  }

  function reorderComponents(fromIndex, toIndex) {
    if (fromIndex === null || toIndex === null) return;
    if (fromIndex === toIndex) return;

    setPages((prev) => {
      const next = (prev ?? []).map((p) => ({
        ...p,
        components: (p.components ?? []).map((c) => ({ ...c, props: { ...(c.props ?? {}) }, styles: { ...(c.styles ?? {}) } })),
      }));
      const page = next?.[activePageIndex];
      if (!page) return prev;
      const comps = [...(page.components ?? [])];
      if (fromIndex < 0 || fromIndex >= comps.length) return prev;
      if (toIndex < 0 || toIndex >= comps.length) return prev;
      const [moved] = comps.splice(fromIndex, 1);
      comps.splice(toIndex, 0, moved);
      page.components = comps;
      return next;
    });

    setActiveComponentIndex(toIndex);
  }

  function duplicateComponentAt(index) {
    setPages((prev) => {
      const next = (prev ?? []).map((p) => ({
        ...p,
        components: (p.components ?? []).map((c) => ({ ...c, props: { ...(c.props ?? {}) }, styles: { ...(c.styles ?? {}) } })),
      }));
      const page2 = next?.[activePageIndex];
      if (!page2) return prev;
      const comps2 = [...(page2.components ?? [])];
      const i = Number(index);
      const src = comps2?.[i];
      if (!src) return prev;

      const copy = {
        type: src.type,
        orderIndex: i + 1,
        props: JSON.parse(JSON.stringify(src.props ?? {})),
        styles: JSON.parse(JSON.stringify(src.styles ?? {})),
      };
      comps2.splice(i + 1, 0, copy);
      page2.components = comps2;
      return next;
    });
    setActiveComponentIndex((cur) => {
      const i = Number(index);
      if (!Number.isFinite(i)) return cur;
      return i + 1;
    });
  }

  function duplicateActiveComponent() {
    duplicateComponentAt(activeComponentIndex);
  }

  function insertComponentAt(index, type) {
    if (!type) return;
    setPages((prev) => {
      const next = (prev ?? []).map((p) => ({
        ...p,
        components: (p.components ?? []).map((c) => ({ ...c, props: { ...(c.props ?? {}) }, styles: { ...(c.styles ?? {}) } })),
      }));
      const page = next?.[activePageIndex];
      if (!page) return prev;
      const comps = [...(page.components ?? [])];
      const insertionIndex = Math.max(0, Math.min(Number(index), comps.length));
      comps.splice(insertionIndex, 0, {
        type,
        orderIndex: insertionIndex,
        props: defaultPropsForType(type),
        styles: defaultStylesForType(type),
      });
      page.components = comps;
      return next;
    });
    setActiveComponentIndex(Math.max(0, Number(index) || 0));
  }

  if (error) {
    return (
      <div className="space-y-3">
        <div className="text-2xl font-semibold">Builder</div>
        <div className="rounded-md bg-red-500/10 p-3 text-sm text-red-200">{error}</div>
      </div>
    );
  }

  if (!website || !pages) {
    return (
      <div className="space-y-3">
        <div className="text-2xl font-semibold">Builder</div>
        <div className="text-sm text-white/60">Loading…</div>
      </div>
    );
  }

  const page = pages?.[activePageIndex] ?? null;
  const comps = page?.components ?? [];
  const activeComponent = comps?.[activeComponentIndex] ?? null;

  const previewWidth = previewMode === 'mobile' ? 375 : previewMode === 'tablet' ? 768 : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-2xl font-semibold">Builder</div>
          <div className="text-sm text-white/60">{website?.name}</div>
        </div>
        <div className="flex items-center gap-3">
          {status ? <div className="text-sm text-white/60">{status}</div> : null}
          <div
            className={
              website?.status === 'PUBLISHED'
                ? 'hidden sm:inline-flex items-center rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200'
                : 'hidden sm:inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70'
            }
          >
            {website?.status ?? '—'}
          </div>
          <SmallButton variant="neutral" onClick={() => saveStructure(pages)} disabled={saving}>
            Save
          </SmallButton>
          <SmallButton variant="primary" onClick={publishToggle} disabled={saving}>
            {website?.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
          </SmallButton>
          {website?.status === 'PUBLISHED' ? (
            <SmallButton
              variant="neutral"
              onClick={async () => {
                const url = `${window.location.origin}/preview/${website?.slug}`;
                try {
                  await navigator.clipboard.writeText(url);
                  setStatus('Copied');
                } catch {
                  setStatus(url);
                }
                setTimeout(() => setStatus(null), 1500);
              }}
            >
              Copy public URL
            </SmallButton>
          ) : null}
          <SmallButton
            onClick={async () => {
              setPanelTab('website');
              setPanelOpen(true);
              await loadVersions();
            }}
          >
            Website
          </SmallButton>
          <SmallButton variant="neutral" onClick={() => setFocusCanvas((v) => !v)}>
            {focusCanvas ? 'Show panels' : 'Focus canvas'}
          </SmallButton>
          <div className="hidden sm:flex items-center gap-2 rounded-md border border-white/10 bg-black/20 px-2 py-1">
            <div className="text-xs text-white/60">Zoom</div>
            <select
              value={String(canvasZoom)}
              onChange={(e) => setCanvasZoom(Number(e.target.value))}
              className="rounded-md border border-white/10 bg-black/30 px-2 py-1 text-xs"
            >
              <option value="0.9">90%</option>
              <option value="1">100%</option>
              <option value="1.1">110%</option>
              <option value="1.25">125%</option>
            </select>
          </div>
          <Link className="rounded-md bg-white/10 px-3 py-2 text-sm font-medium hover:bg-white/15" to="/dashboard">
            Back to dashboard
          </Link>
          <Link
            className="rounded-md bg-white/10 px-3 py-2 text-sm font-medium hover:bg-white/15"
            to={`/draft-preview/${websiteId}`}
          >
            Draft preview
          </Link>
          {website?.status === 'PUBLISHED' ? (
            <Link
              className="rounded-md bg-white/10 px-3 py-2 text-sm font-medium hover:bg-white/15"
              to={`/preview/${website?.slug}`}
            >
              Public preview
            </Link>
          ) : (
            <button
              type="button"
              disabled
              className="rounded-md bg-white/5 px-3 py-2 text-sm font-medium text-white/40"
              title="Publish to enable public preview"
            >
              Public preview
            </button>
          )}
        </div>
      </div>

      {panelOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70" onClick={() => setPanelOpen(false)} />
          <div className="relative z-10 w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-black/90 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-black/60 px-4 py-3">
              <div>
                <div className="text-xs text-white/60">Website settings</div>
                <div className="text-lg font-semibold">{website?.name}</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 rounded-md border border-white/10 bg-black/20 p-1">
                  {['website', 'seo', 'theme', 'versions'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={async () => {
                        setPanelTab(t);
                        if (t === 'versions') await loadVersions();
                      }}
                      className={
                        panelTab === t
                          ? 'rounded-md bg-white/15 px-2 py-1 text-xs font-medium'
                          : 'rounded-md px-2 py-1 text-xs text-white/70 hover:bg-white/10 hover:text-white'
                      }
                    >
                      {t.toUpperCase()}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setPanelOpen(false)}
                  className="rounded-md bg-white/10 px-3 py-2 text-sm font-medium hover:bg-white/15"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="max-h-[80vh] overflow-auto p-4">
              {panelTab === 'website' ? (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="text-sm font-semibold">Status</div>
                    <div className="mt-1 text-sm text-white/70">{website?.status ?? '—'}</div>
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        disabled={saving}
                        onClick={publishToggle}
                        className={
                          website?.status === 'PUBLISHED'
                            ? 'rounded-md bg-white/10 px-3 py-2 text-sm font-medium hover:bg-white/15 disabled:opacity-50'
                            : 'rounded-md bg-indigo-500 px-3 py-2 text-sm font-medium hover:bg-indigo-400 disabled:opacity-50'
                        }
                      >
                        {website?.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
                      </button>
                      {website?.status === 'PUBLISHED' ? (
                        <button
                          type="button"
                          onClick={async () => {
                            const url = `${window.location.origin}/preview/${website?.slug}`;
                            try {
                              await navigator.clipboard.writeText(url);
                              setStatus('Copied');
                            } catch {
                              setStatus(url);
                            }
                            setTimeout(() => setStatus(null), 1500);
                          }}
                          className="rounded-md bg-white/10 px-3 py-2 text-sm font-medium hover:bg-white/15"
                        >
                          Copy public URL
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>
              ) : null}

              {panelTab === 'seo' ? (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3">
                    <div>
                      <div className="text-sm font-semibold">SEO</div>
                      <div className="mt-1 text-xs text-white/60">Title, description, and social preview image.</div>
                    </div>
                    <label className="block">
                      <div className="text-sm text-white/70">Title</div>
                      <input
                        value={seoDraft?.title ?? ''}
                        onChange={(e) => setSeoDraft((p) => ({ ...(p ?? {}), title: e.target.value }))}
                        className="mt-1 w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm"
                      />
                    </label>
                    <label className="block">
                      <div className="text-sm text-white/70">Description</div>
                      <textarea
                        value={seoDraft?.description ?? ''}
                        onChange={(e) => setSeoDraft((p) => ({ ...(p ?? {}), description: e.target.value }))}
                        className="mt-1 w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm"
                        rows={3}
                      />
                    </label>
                    <div className="space-y-2">
                      <div className="text-sm text-white/70">OG image</div>
                      {seoDraft?.ogImage ? (
                        <div className="overflow-hidden rounded-xl border border-white/10 bg-black/20">
                          <div className="aspect-[2/1] w-full bg-black/30">
                            <img src={seoDraft.ogImage} alt="OG preview" className="h-full w-full object-cover" />
                          </div>
                        </div>
                      ) : (
                        <div className="rounded-xl border border-white/10 bg-black/20 p-3 text-xs text-white/60">
                          No OG image selected.
                        </div>
                      )}
                      <label className="block">
                        <div className="text-xs text-white/50">URL</div>
                        <input
                          value={seoDraft?.ogImage ?? ''}
                          onChange={(e) => setSeoDraft((p) => ({ ...(p ?? {}), ogImage: e.target.value || null }))}
                          className="mt-1 w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm"
                          placeholder="https://..."
                        />
                      </label>

                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="text-xs text-white/50">Pick from your assets (or upload)</div>
                        <label className="rounded-md bg-white/10 px-3 py-2 text-xs font-medium hover:bg-white/15 cursor-pointer">
                          {uploadingAsset ? 'Uploading…' : 'Upload'}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={uploadingAsset}
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              e.target.value = '';
                              if (!file) return;

                              try {
                                setUploadingAsset(true);
                                setAssetsError(null);
                                const fd = new FormData();
                                fd.append('file', file);
                                fd.append('websiteId', String(websiteId));
                                const { data } = await api.post('/assets/upload', fd, {
                                  headers: { 'Content-Type': 'multipart/form-data' },
                                });
                                const created = data.asset;
                                setAssets((prev) => [created, ...(prev ?? [])]);
                                const fullUrl = makeAbsoluteAssetUrl(created.url);
                                setSeoDraft((p) => ({ ...(p ?? {}), ogImage: fullUrl }));
                              } catch (err) {
                                setAssetsError(err?.response?.data?.error?.message ?? 'Failed to upload');
                              } finally {
                                setUploadingAsset(false);
                              }
                            }}
                          />
                        </label>
                      </div>

                      {assetsError ? <div className="rounded-md bg-red-500/10 p-2 text-xs text-red-200">{assetsError}</div> : null}

                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                        {(assets ?? [])
                          .filter((a) => a?.type === 'IMAGE')
                          .slice(0, 6)
                          .map((a) => {
                            const fullUrl = makeAbsoluteAssetUrl(a.url);
                            const selected = seoDraft?.ogImage && fullUrl === seoDraft.ogImage;
                            return (
                              <button
                                key={a.id}
                                type="button"
                                onClick={() => setSeoDraft((p) => ({ ...(p ?? {}), ogImage: fullUrl }))}
                                className={
                                  selected
                                    ? 'overflow-hidden rounded-xl border border-indigo-400/60 bg-black/20 text-left'
                                    : 'overflow-hidden rounded-xl border border-white/10 bg-black/20 text-left hover:border-white/20'
                                }
                                title={a.meta?.originalName ?? 'Select image'}
                              >
                                <div className="aspect-[4/3] w-full bg-black/30">
                                  <img src={fullUrl} alt={a.meta?.originalName ?? `Asset ${a.id}`} className="h-full w-full object-cover" />
                                </div>
                                <div className="p-2">
                                  <div className="truncate text-[11px] text-white/70">{a.meta?.originalName ?? 'Image'}</div>
                                </div>
                              </button>
                            );
                          })}
                        {!assets?.length ? <div className="col-span-2 text-xs text-white/50 sm:col-span-3">No assets yet.</div> : null}
                      </div>
                    </div>
                    <button
                      type="button"
                      disabled={panelBusy}
                      onClick={saveSeoDraft}
                      className={
                        panelBusy
                          ? 'w-full rounded-xl bg-white/10 px-3 py-2 text-sm text-white/60'
                          : 'w-full rounded-xl bg-indigo-500 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-400'
                      }
                    >
                      {panelBusy ? 'Saving…' : 'Save SEO'}
                    </button>
                  </div>
                </div>
              ) : null}

              {panelTab === 'theme' ? (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3">
                    <div>
                      <div className="text-sm font-semibold">Theme</div>
                      <div className="mt-1 text-xs text-white/60">Global brand styles: colors, typography, and spacing.</div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <ColorPickerField
                        label="Primary"
                        value={designSystemDraft?.colors?.primary ?? ''}
                        onChange={(v) =>
                          setDesignSystemDraft((p) => ({
                            ...(p ?? {}),
                            colors: { ...(p?.colors ?? {}), primary: v },
                          }))
                        }
                        placeholder="#6366f1"
                      />
                      <ColorPickerField
                        label="Secondary"
                        value={designSystemDraft?.colors?.secondary ?? ''}
                        onChange={(v) =>
                          setDesignSystemDraft((p) => ({
                            ...(p ?? {}),
                            colors: { ...(p?.colors ?? {}), secondary: v },
                          }))
                        }
                        placeholder="#22c55e"
                      />
                      <ColorPickerField
                        label="Background"
                        value={designSystemDraft?.colors?.background ?? ''}
                        onChange={(v) =>
                          setDesignSystemDraft((p) => ({
                            ...(p ?? {}),
                            colors: { ...(p?.colors ?? {}), background: v },
                          }))
                        }
                        placeholder="#070a12"
                      />
                      <label className="block">
                        <div className="text-sm text-white/70">Surface</div>
                        <input
                          value={designSystemDraft?.colors?.surface ?? ''}
                          onChange={(e) =>
                            setDesignSystemDraft((p) => ({
                              ...(p ?? {}),
                              colors: { ...(p?.colors ?? {}), surface: e.target.value },
                            }))
                          }
                          className="mt-1 w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm"
                          placeholder="rgba(255,255,255,0.06)"
                        />
                      </label>
                      <label className="block">
                        <div className="text-sm text-white/70">Text</div>
                        <input
                          value={designSystemDraft?.colors?.text ?? ''}
                          onChange={(e) =>
                            setDesignSystemDraft((p) => ({
                              ...(p ?? {}),
                              colors: { ...(p?.colors ?? {}), text: e.target.value },
                            }))
                          }
                          className="mt-1 w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm"
                          placeholder="rgba(255,255,255,0.92)"
                        />
                      </label>
                    </div>

                    <label className="block">
                      <div className="text-sm text-white/70">Font</div>
                      <select
                        value={designSystemDraft?.typography?.fontFamily ?? ''}
                        onChange={(e) =>
                          setDesignSystemDraft((p) => ({
                            ...(p ?? {}),
                            typography: { ...(p?.typography ?? {}), fontFamily: e.target.value },
                          }))
                        }
                        className="mt-1 w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm"
                      >
                        <option value='ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji"'>
                          System Sans (default)
                        </option>
                        <option value='"Segoe UI", system-ui, -apple-system, Roboto, Arial, sans-serif'>
                          Segoe UI (Windows)
                        </option>
                        <option value='-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'>
                          Modern UI (Apple/Google)
                        </option>
                        <option value='Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif'>
                          Inter (if available)
                        </option>
                        <option value='"Helvetica Neue", Helvetica, Arial, sans-serif'>
                          Helvetica Neue
                        </option>
                        <option value='"Georgia", "Times New Roman", serif'>
                          Serif (Georgia)
                        </option>
                        <option value='"Courier New", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'>
                          Monospace
                        </option>
                      </select>
                      <div className="mt-2">
                        <div className="text-xs text-white/50">Advanced: custom font-family</div>
                        <input
                          value={designSystemDraft?.typography?.fontFamily ?? ''}
                          onChange={(e) =>
                            setDesignSystemDraft((p) => ({
                              ...(p ?? {}),
                              typography: { ...(p?.typography ?? {}), fontFamily: e.target.value },
                            }))
                          }
                          className="mt-1 w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm"
                          placeholder='Inter, ui-sans-serif, system-ui, ...'
                        />
                      </div>
                    </label>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <label className="block">
                        <div className="text-sm text-white/70">Base font size (px)</div>
                        <input
                          value={String(designSystemDraft?.typography?.baseFontSize ?? '')}
                          onChange={(e) =>
                            setDesignSystemDraft((p) => ({
                              ...(p ?? {}),
                              typography: {
                                ...(p?.typography ?? {}),
                                baseFontSize: Number(e.target.value) || 16,
                              },
                            }))
                          }
                          className="mt-1 w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm"
                          placeholder="16"
                        />
                      </label>
                      <label className="block">
                        <div className="text-sm text-white/70">Line height</div>
                        <input
                          value={String(designSystemDraft?.typography?.lineHeight ?? '')}
                          onChange={(e) =>
                            setDesignSystemDraft((p) => ({
                              ...(p ?? {}),
                              typography: {
                                ...(p?.typography ?? {}),
                                lineHeight: Number(e.target.value) || 1.5,
                              },
                            }))
                          }
                          className="mt-1 w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm"
                          placeholder="1.5"
                        />
                      </label>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <label className="block">
                        <div className="text-sm text-white/70">Section spacing (Y px)</div>
                        <input
                          value={String(designSystemDraft?.spacing?.sectionY ?? '')}
                          onChange={(e) =>
                            setDesignSystemDraft((p) => ({
                              ...(p ?? {}),
                              spacing: { ...(p?.spacing ?? {}), sectionY: Number(e.target.value) || 64 },
                            }))
                          }
                          className="mt-1 w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm"
                          placeholder="64"
                        />
                      </label>
                      <label className="block">
                        <div className="text-sm text-white/70">Container padding (X px)</div>
                        <input
                          value={String(designSystemDraft?.spacing?.containerX ?? '')}
                          onChange={(e) =>
                            setDesignSystemDraft((p) => ({
                              ...(p ?? {}),
                              spacing: { ...(p?.spacing ?? {}), containerX: Number(e.target.value) || 16 },
                            }))
                          }
                          className="mt-1 w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm"
                          placeholder="16"
                        />
                      </label>
                    </div>

                    <label className="block">
                      <div className="text-sm text-white/70">Primary color</div>
                      <input
                        value={themeDraft?.primary ?? ''}
                        onChange={(e) => setThemeDraft((p) => ({ ...(p ?? {}), primary: e.target.value }))}
                        className="mt-1 w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm"
                        placeholder="#6366f1"
                      />
                    </label>
                    <label className="block">
                      <div className="text-sm text-white/70">Background color</div>
                      <input
                        value={themeDraft?.background ?? ''}
                        onChange={(e) => setThemeDraft((p) => ({ ...(p ?? {}), background: e.target.value }))}
                        className="mt-1 w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm"
                        placeholder="#070a12"
                      />
                    </label>
                    <button
                      type="button"
                      disabled={panelBusy}
                      onClick={saveThemeDraft}
                      className={
                        panelBusy
                          ? 'w-full rounded-xl bg-white/10 px-3 py-2 text-sm text-white/60'
                          : 'w-full rounded-xl bg-indigo-500 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-400'
                      }
                    >
                      {panelBusy ? 'Saving…' : 'Save theme'}
                    </button>
                  </div>
                </div>
              ) : null}

              {panelTab === 'versions' ? (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold">Version history</div>
                        <div className="mt-1 text-xs text-white/60">Restore a previous saved snapshot.</div>
                      </div>
                      <button
                        type="button"
                        onClick={loadVersions}
                        className="rounded-md bg-white/10 px-3 py-2 text-sm font-medium hover:bg-white/15"
                      >
                        Refresh
                      </button>
                    </div>
                    {versionsLoading ? <div className="mt-3 text-sm text-white/60">Loading…</div> : null}
                    {!versionsLoading && !(versions?.length ?? 0) ? (
                      <div className="mt-3 text-sm text-white/60">No versions yet.</div>
                    ) : null}
                    <div className="mt-3 space-y-2">
                      {(versions ?? []).map((v) => (
                        <div key={v.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/20 p-3">
                          <div>
                            <div className="text-sm font-semibold">Version {v.version_number}</div>
                            <div className="mt-1 text-xs text-white/60">
                              {v.created_at ? new Date(v.created_at).toLocaleString() : '—'}
                            </div>
                          </div>
                          <button
                            type="button"
                            disabled={panelBusy}
                            onClick={async () => {
                              if (!window.confirm(`Restore version ${v.version_number}? Current work will be overwritten.`)) return;
                              try {
                                setPanelBusy(true);
                                setError(null);
                                const { data } = await api.post(`/websites/${websiteId}/versions/${v.id}/restore`);
                                setWebsite(data.website);
                                setPages(data.pages);
                                setActivePageIndex(0);
                                setActiveComponentIndex(0);
                                setStatus('Restored');
                                await loadVersions();
                              } catch (err) {
                                setError(err?.response?.data?.error?.message ?? 'Failed to restore version');
                              } finally {
                                setPanelBusy(false);
                                setTimeout(() => setStatus(null), 1500);
                              }
                            }}
                            className="rounded-md bg-white/10 px-3 py-2 text-sm font-medium hover:bg-white/15 disabled:opacity-50"
                          >
                            Restore
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      <div
        className={
          focusCanvas
            ? 'grid grid-cols-1 gap-4 lg:grid-cols-1 h-[calc(100vh-180px)] overflow-hidden'
            : 'grid grid-cols-1 gap-4 lg:grid-cols-[280px_minmax(0,1fr)_320px] xl:grid-cols-[300px_minmax(0,1fr)_340px] h-[calc(100vh-180px)] overflow-hidden'
        }
      >
        <div
          className={
            focusCanvas
              ? 'hidden'
              : 'rounded-2xl border border-white/10 bg-white/5 p-4 overflow-y-auto'
          }
        >
          <div className="text-sm font-semibold">Pages</div>
          <div className="mt-3 space-y-2">
            <select
              className="w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm"
              value={activePageIndex}
              onChange={(e) => {
                setActivePageIndex(Number(e.target.value));
                setActiveComponentIndex(0);
              }}
            >
              {(pages ?? []).map((p, idx) => (
                <option key={p.id ?? `${p.path}-${idx}`} value={idx}>
                  {p.name} ({p.path})
                </option>
              ))}
            </select>
          </div>

          <div className="mt-6">
            <div className="text-sm font-semibold">Component library</div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {COMPONENT_TYPES.map((t) => (
                <div
                  key={t}
                  draggable
                  onDragStart={() => {
                    setDragNewType(t);
                    setDragIndex(null);
                  }}
                  onDragEnd={() => setDragNewType(null)}
                  className="select-none rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-xs font-medium text-white/80"
                >
                  {t}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <div className="text-sm font-semibold">Canvas layers</div>
            <div className="mt-3 space-y-2">
              {comps.length ? (
                comps.map((c, idx) => (
                  <div
                    key={c.id ?? `${c.type}-${idx}`}
                    draggable
                    onDragStart={() => setDragIndex(idx)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => {
                      if (dragNewType) {
                        insertComponentAt(idx, dragNewType);
                        setDragNewType(null);
                        return;
                      }
                      if (dragIndex !== null) {
                        reorderComponents(dragIndex, idx);
                        setDragIndex(null);
                      }
                    }}
                    onClick={() => setActiveComponentIndex(idx)}
                    className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-sm transition cursor-pointer ${
                      idx === activeComponentIndex
                        ? 'border-indigo-400/40 bg-indigo-500/10'
                        : 'border-white/10 bg-black/20 hover:bg-black/30'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="select-none text-white/50">⋮⋮</span>
                      <span className="font-medium">{c.type}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-white/50">#{idx + 1}</span>
                      <button
                        type="button"
                        disabled={idx <= 0}
                        onClick={(e) => {
                          e.stopPropagation();
                          reorderComponents(idx, idx - 1);
                        }}
                        className="rounded-md bg-white/10 px-2 py-1 text-xs font-medium hover:bg-white/15 disabled:opacity-50"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        disabled={idx >= (comps?.length ?? 0) - 1}
                        onClick={(e) => {
                          e.stopPropagation();
                          reorderComponents(idx, idx + 1);
                        }}
                        className="rounded-md bg-white/10 px-2 py-1 text-xs font-medium hover:bg-white/15 disabled:opacity-50"
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          duplicateComponentAt(idx);
                        }}
                        className="rounded-md bg-white/10 px-2 py-1 text-xs font-medium hover:bg-white/15"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-white/60">Drag components from the library into the canvas.</div>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/10 overflow-hidden h-full">
          <div className="h-full overflow-auto">
            <div
              className="mx-auto"
              style={
                previewWidth
                  ? {
                      width: `${previewWidth}px`,
                      transform: `scale(${canvasZoom})`,
                      transformOrigin: 'top center',
                    }
                  : {
                      transform: `scale(${canvasZoom})`,
                      transformOrigin: 'top center',
                    }
              }
            >
              <SiteRenderer
                pages={pages}
                activePageIndex={activePageIndex}
                theme={website?.settings?.theme}
                designSystem={website?.settings?.designSystem}
                editor={{
                  selectedIndex: activeComponentIndex,
                  onSelect: setActiveComponentIndex,
                  dragIndex,
                  onSetDragIndex: setDragIndex,
                  dragNewType,
                  onSetDragNewType: setDragNewType,
                  hoverIndex,
                  onSetHoverIndex: setHoverIndex,
                  onMove: reorderComponents,
                  onInsert: insertComponentAt,
                  onUpdateProps: (componentIndex, patch) => {
                    setPages((prev) => {
                      const next = (prev ?? []).map((p) => ({
                        ...p,
                        components: (p.components ?? []).map((c) => ({
                          ...c,
                          props: { ...(c.props ?? {}) },
                          styles: { ...(c.styles ?? {}) },
                        })),
                      }));
                      const page2 = next?.[activePageIndex];
                      const comp = page2?.components?.[componentIndex];
                      if (!page2 || !comp) return prev;
                      comp.props = { ...(comp.props ?? {}), ...(patch ?? {}) };
                      return next;
                    });
                  },
                }}
              />
            </div>
          </div>
        </div>

        <div
          className={
            focusCanvas
              ? 'hidden'
              : 'rounded-2xl border border-white/10 bg-white/5 p-4 space-y-6 overflow-y-auto'
          }
        >
          <div className="space-y-3">
            <div className="text-sm font-semibold">Selected component</div>
            {!activeComponent ? (
              <div className="text-sm text-white/60">Select a component from the canvas or layers panel.</div>
            ) : (
              <>
                <div className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm">
                  <div className="text-white/60">Type</div>
                  <div className="font-medium">{activeComponent.type}</div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <SmallButton disabled={activeComponentIndex <= 0} onClick={() => reorderComponents(activeComponentIndex, activeComponentIndex - 1)}>
                    Move up
                  </SmallButton>
                  <SmallButton
                    disabled={activeComponentIndex >= (comps?.length ?? 0) - 1}
                    onClick={() => reorderComponents(activeComponentIndex, activeComponentIndex + 1)}
                  >
                    Move down
                  </SmallButton>
                  <SmallButton onClick={duplicateActiveComponent}>
                    Duplicate
                  </SmallButton>
                </div>

                <div className="flex items-center gap-1 rounded-md border border-white/10 bg-black/20 p-1">
                  <button
                    type="button"
                    onClick={() => setPreviewMode('desktop')}
                    className={
                      previewMode === 'desktop'
                        ? 'rounded-md bg-white/15 px-2 py-1 text-xs font-medium'
                        : 'rounded-md px-2 py-1 text-xs text-white/70 hover:bg-white/10 hover:text-white'
                    }
                  >
                    Desktop
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewMode('tablet')}
                    className={
                      previewMode === 'tablet'
                        ? 'rounded-md bg-white/15 px-2 py-1 text-xs font-medium'
                        : 'rounded-md px-2 py-1 text-xs text-white/70 hover:bg-white/10 hover:text-white'
                    }
                  >
                    Tablet
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewMode('mobile')}
                    className={
                      previewMode === 'mobile'
                        ? 'rounded-md bg-white/15 px-2 py-1 text-xs font-medium'
                        : 'rounded-md px-2 py-1 text-xs text-white/70 hover:bg-white/10 hover:text-white'
                    }
                  >
                    Mobile
                  </button>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-3 space-y-3">
                  <div className="text-sm font-semibold">Style</div>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="block">
                      <div className="text-xs text-white/60">Padding top</div>
                      <input
                        value={String(activeComponent.styles?.paddingTop ?? '')}
                        onChange={(e) =>
                          updateActiveComponent((c) =>
                            (c.styles = {
                              ...(c.styles ?? {}),
                              paddingTop: e.target.value === '' ? null : Number(e.target.value),
                            })
                          )
                        }
                        className="mt-1 w-full rounded-md border border-white/10 bg-black/30 px-2 py-1 text-sm"
                        placeholder=""
                      />
                    </label>
                    <label className="block">
                      <div className="text-xs text-white/60">Padding bottom</div>
                      <input
                        value={String(activeComponent.styles?.paddingBottom ?? '')}
                        onChange={(e) =>
                          updateActiveComponent((c) =>
                            (c.styles = {
                              ...(c.styles ?? {}),
                              paddingBottom: e.target.value === '' ? null : Number(e.target.value),
                            })
                          )
                        }
                        className="mt-1 w-full rounded-md border border-white/10 bg-black/30 px-2 py-1 text-sm"
                        placeholder=""
                      />
                    </label>
                    <label className="block">
                      <div className="text-xs text-white/60">Margin top</div>
                      <input
                        value={String(activeComponent.styles?.marginTop ?? '')}
                        onChange={(e) =>
                          updateActiveComponent((c) =>
                            (c.styles = {
                              ...(c.styles ?? {}),
                              marginTop: e.target.value === '' ? null : Number(e.target.value),
                            })
                          )
                        }
                        className="mt-1 w-full rounded-md border border-white/10 bg-black/30 px-2 py-1 text-sm"
                        placeholder=""
                      />
                    </label>
                    <label className="block">
                      <div className="text-xs text-white/60">Margin bottom</div>
                      <input
                        value={String(activeComponent.styles?.marginBottom ?? '')}
                        onChange={(e) =>
                          updateActiveComponent((c) =>
                            (c.styles = {
                              ...(c.styles ?? {}),
                              marginBottom: e.target.value === '' ? null : Number(e.target.value),
                            })
                          )
                        }
                        className="mt-1 w-full rounded-md border border-white/10 bg-black/30 px-2 py-1 text-sm"
                        placeholder=""
                      />
                    </label>
                  </div>
                  <label className="block">
                    <div className="text-xs text-white/60">Background override</div>
                    <input
                      value={String(activeComponent.styles?.backgroundColor ?? '')}
                      onChange={(e) =>
                        updateActiveComponent((c) =>
                          (c.styles = {
                            ...(c.styles ?? {}),
                            backgroundColor: e.target.value || null,
                          })
                        )
                      }
                      className="mt-1 w-full rounded-md border border-white/10 bg-black/30 px-2 py-1 text-sm"
                      placeholder="#000000 / rgba(...)"
                    />
                  </label>
                </div>

                {activeComponent.type === 'NAVBAR' ? (
                  <div className="space-y-3">
                    <TextInput
                      label="Logo text"
                      value={activeComponent.props?.logoText}
                      onChange={(v) => updateActiveComponent((c) => (c.props = { ...(c.props ?? {}), logoText: v }))}
                    />

                    <div className="space-y-2">
                      <div className="text-sm font-semibold">Logo image</div>
                      <div className="flex items-center gap-3">
                        {activeComponent.props?.logoImageUrl ? (
                          <img
                            src={activeComponent.props.logoImageUrl}
                            alt="Logo"
                            className="h-10 w-10 rounded border border-white/10 object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded border border-white/10 bg-black/20" />
                        )}
                        <div className="flex-1">
                          <select
                            className="w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm"
                            value={activeComponent.props?.logoImageUrl ?? ''}
                            onChange={(e) =>
                              updateActiveComponent((c) =>
                                (c.props = {
                                  ...(c.props ?? {}),
                                  logoImageUrl: e.target.value ? e.target.value : null,
                                })
                              )
                            }
                          >
                            <option value="">No logo image</option>
                            {(assets ?? []).map((a) => {
                              const fullUrl = makeAbsoluteAssetUrl(a.url);
                              return (
                                <option key={a.id} value={fullUrl}>
                                  {a.meta?.originalName ?? fullUrl}
                                </option>
                              );
                            })}
                          </select>
                          <div className="mt-1 text-xs text-white/50">Upload images in Assets page or in Gallery picker.</div>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            updateActiveComponent((c) =>
                              (c.props = {
                                ...(c.props ?? {}),
                                logoImageUrl: null,
                              })
                            )
                          }
                          className="rounded-md bg-white/10 px-2 py-2 text-xs font-medium text-white/80 hover:bg-white/15"
                        >
                          Clear
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm font-semibold">Links</div>
                      {(activeComponent.props?.links ?? []).map((l, idx) => (
                        <div key={idx} className="rounded-lg border border-white/10 bg-black/20 p-3 space-y-2">
                          <TextInput
                            label="Label"
                            value={l.label}
                            onChange={(v) =>
                              updateActiveComponent((c) => {
                                const links = [...(c.props?.links ?? [])];
                                links[idx] = { ...links[idx], label: v };
                                c.props = { ...(c.props ?? {}), links };
                              })
                            }
                          />
                          <TextInput
                            label="Href"
                            value={l.href}
                            onChange={(v) =>
                              updateActiveComponent((c) => {
                                const links = [...(c.props?.links ?? [])];
                                links[idx] = { ...links[idx], href: v };
                                c.props = { ...(c.props ?? {}), links };
                              })
                            }
                            placeholder="/about"
                          />
                          <SmallButton
                            variant="danger"
                            onClick={() =>
                              updateActiveComponent((c) => {
                                const links = [...(c.props?.links ?? [])];
                                links.splice(idx, 1);
                                c.props = { ...(c.props ?? {}), links };
                              })
                            }
                          >
                            Remove link
                          </SmallButton>
                        </div>
                      ))}
                      <SmallButton
                        onClick={() =>
                          updateActiveComponent((c) => {
                            const links = [...(c.props?.links ?? []), { label: 'Link', href: '/' }];
                            c.props = { ...(c.props ?? {}), links };
                          })
                        }
                      >
                        Add link
                      </SmallButton>
                    </div>
                  </div>
                ) : null}

                {activeComponent.type === 'FILTER_TABS' ? (
                  <div className="space-y-3">
                    <TextInput
                      label="Headline"
                      value={activeComponent.props?.headline}
                      onChange={(v) => updateActiveComponent((c) => (c.props = { ...(c.props ?? {}), headline: v }))}
                    />
                    <TextInput
                      label="Subheadline"
                      value={activeComponent.props?.subheadline}
                      onChange={(v) => updateActiveComponent((c) => (c.props = { ...(c.props ?? {}), subheadline: v }))}
                    />
                    <TextInput
                      label="Default tab value"
                      value={activeComponent.props?.defaultTab}
                      onChange={(v) => updateActiveComponent((c) => (c.props = { ...(c.props ?? {}), defaultTab: v }))}
                      placeholder="all"
                    />

                    <div className="space-y-2">
                      <div className="text-sm font-semibold">Tabs</div>
                      {(activeComponent.props?.tabs ?? []).map((t, idx) => (
                        <div key={idx} className="rounded-lg border border-white/10 bg-black/20 p-3 space-y-2">
                          <TextInput
                            label="Label"
                            value={t?.label}
                            onChange={(v) =>
                              updateActiveComponent((c) => {
                                const tabs = [...(c.props?.tabs ?? [])];
                                tabs[idx] = { ...(tabs[idx] ?? {}), label: v };
                                c.props = { ...(c.props ?? {}), tabs };
                              })
                            }
                          />
                          <TextInput
                            label="Value"
                            value={t?.value}
                            onChange={(v) =>
                              updateActiveComponent((c) => {
                                const tabs = [...(c.props?.tabs ?? [])];
                                tabs[idx] = { ...(tabs[idx] ?? {}), value: v };
                                c.props = { ...(c.props ?? {}), tabs };
                              })
                            }
                            placeholder="shoes"
                          />
                          <SmallButton
                            variant="danger"
                            onClick={() =>
                              updateActiveComponent((c) => {
                                const tabs = [...(c.props?.tabs ?? [])];
                                tabs.splice(idx, 1);
                                c.props = { ...(c.props ?? {}), tabs };
                              })
                            }
                          >
                            Remove tab
                          </SmallButton>
                        </div>
                      ))}
                      <SmallButton
                        onClick={() =>
                          updateActiveComponent((c) => {
                            const tabs = [...(c.props?.tabs ?? []), { label: 'Tab', value: 'tab' }];
                            c.props = { ...(c.props ?? {}), tabs };
                          })
                        }
                      >
                        Add tab
                      </SmallButton>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm font-semibold">Products</div>
                      {(activeComponent.props?.products ?? []).map((p, idx) => (
                        <div key={idx} className="rounded-lg border border-white/10 bg-black/20 p-3 space-y-2">
                          <TextInput
                            label="Name"
                            value={p?.name}
                            onChange={(v) =>
                              updateActiveComponent((c) => {
                                const products = [...(c.props?.products ?? [])];
                                products[idx] = { ...(products[idx] ?? {}), name: v };
                                c.props = { ...(c.props ?? {}), products };
                              })
                            }
                          />
                          <TextInput
                            label="Description"
                            value={p?.description}
                            onChange={(v) =>
                              updateActiveComponent((c) => {
                                const products = [...(c.props?.products ?? [])];
                                products[idx] = { ...(products[idx] ?? {}), description: v };
                                c.props = { ...(c.props ?? {}), products };
                              })
                            }
                          />
                          <TextInput
                            label="Price"
                            value={p?.price}
                            onChange={(v) =>
                              updateActiveComponent((c) => {
                                const products = [...(c.props?.products ?? [])];
                                products[idx] = { ...(products[idx] ?? {}), price: v };
                                c.props = { ...(c.props ?? {}), products };
                              })
                            }
                          />
                          <TextInput
                            label="Categories (comma-separated)"
                            value={Array.isArray(p?.categories) ? p.categories.join(', ') : ''}
                            onChange={(v) =>
                              updateActiveComponent((c) => {
                                const products = [...(c.props?.products ?? [])];
                                const cats = v
                                  .split(',')
                                  .map((x) => x.trim())
                                  .filter(Boolean);
                                products[idx] = { ...(products[idx] ?? {}), categories: cats };
                                c.props = { ...(c.props ?? {}), products };
                              })
                            }
                            placeholder="shoes, apparel"
                          />
                          <TextInput
                            label="Image URL"
                            value={p?.imageUrl}
                            onChange={(v) =>
                              updateActiveComponent((c) => {
                                const products = [...(c.props?.products ?? [])];
                                products[idx] = { ...(products[idx] ?? {}), imageUrl: v };
                                c.props = { ...(c.props ?? {}), products };
                              })
                            }
                            placeholder="https://..."
                          />
                          <TextInput
                            label="Button label"
                            value={p?.cta?.label}
                            onChange={(v) =>
                              updateActiveComponent((c) => {
                                const products = [...(c.props?.products ?? [])];
                                products[idx] = { ...(products[idx] ?? {}), cta: { ...(products[idx]?.cta ?? {}), label: v } };
                                c.props = { ...(c.props ?? {}), products };
                              })
                            }
                          />
                          <TextInput
                            label="Button href"
                            value={p?.cta?.href}
                            onChange={(v) =>
                              updateActiveComponent((c) => {
                                const products = [...(c.props?.products ?? [])];
                                products[idx] = { ...(products[idx] ?? {}), cta: { ...(products[idx]?.cta ?? {}), href: v } };
                                c.props = { ...(c.props ?? {}), products };
                              })
                            }
                            placeholder="/contact"
                          />
                          <SmallButton
                            variant="danger"
                            onClick={() =>
                              updateActiveComponent((c) => {
                                const products = [...(c.props?.products ?? [])];
                                products.splice(idx, 1);
                                c.props = { ...(c.props ?? {}), products };
                              })
                            }
                          >
                            Remove product
                          </SmallButton>
                        </div>
                      ))}
                      <SmallButton
                        onClick={() =>
                          updateActiveComponent((c) => {
                            const products = [
                              ...(c.props?.products ?? []),
                              {
                                name: 'Product name',
                                description: 'Short product description',
                                price: '€49',
                                badge: null,
                                imageUrl: '',
                                categories: ['all'],
                                cta: { label: 'View', href: '/contact' },
                              },
                            ];
                            c.props = { ...(c.props ?? {}), products };
                          })
                        }
                      >
                        Add product
                      </SmallButton>
                    </div>
                  </div>
                ) : null}

                {activeComponent.type === 'MULTI_ROW_CAROUSEL' ? (
                  <div className="space-y-2">
                    <div className="text-sm font-semibold">Rows</div>
                    {(activeComponent.props?.rows ?? []).map((row, ridx) => (
                      <div key={ridx} className="rounded-lg border border-white/10 bg-black/20 p-3 space-y-2">
                        <TextInput
                          label="Title"
                          value={row?.title}
                          onChange={(v) =>
                            updateActiveComponent((c) => {
                              const rows = [...(c.props?.rows ?? [])];
                              rows[ridx] = { ...(rows[ridx] ?? {}), title: v };
                              c.props = { ...(c.props ?? {}), rows };
                            })
                          }
                        />
                        <TextInput
                          label="Subtitle"
                          value={row?.subtitle}
                          onChange={(v) =>
                            updateActiveComponent((c) => {
                              const rows = [...(c.props?.rows ?? [])];
                              rows[ridx] = { ...(rows[ridx] ?? {}), subtitle: v };
                              c.props = { ...(c.props ?? {}), rows };
                            })
                          }
                        />
                        <div className="rounded-lg border border-white/10 bg-black/20 p-3 space-y-2">
                          <div className="text-sm font-semibold">Row CTA</div>
                          <TextInput
                            label="Label"
                            value={row?.cta?.label}
                            onChange={(v) =>
                              updateActiveComponent((c) => {
                                const rows = [...(c.props?.rows ?? [])];
                                rows[ridx] = { ...(rows[ridx] ?? {}), cta: { ...(rows[ridx]?.cta ?? {}), label: v } };
                                c.props = { ...(c.props ?? {}), rows };
                              })
                            }
                          />
                          <TextInput
                            label="Href"
                            value={row?.cta?.href}
                            onChange={(v) =>
                              updateActiveComponent((c) => {
                                const rows = [...(c.props?.rows ?? [])];
                                rows[ridx] = { ...(rows[ridx] ?? {}), cta: { ...(rows[ridx]?.cta ?? {}), href: v } };
                                c.props = { ...(c.props ?? {}), rows };
                              })
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="text-sm font-semibold">Items</div>
                          {(row?.items ?? []).map((it, iidx) => (
                            <div key={iidx} className="rounded-lg border border-white/10 bg-black/20 p-3 space-y-2">
                              <TextInput
                                label="Title"
                                value={it?.title}
                                onChange={(v) =>
                                  updateActiveComponent((c) => {
                                    const rows = [...(c.props?.rows ?? [])];
                                    const items = [...(rows[ridx]?.items ?? [])];
                                    items[iidx] = { ...(items[iidx] ?? {}), title: v };
                                    rows[ridx] = { ...(rows[ridx] ?? {}), items };
                                    c.props = { ...(c.props ?? {}), rows };
                                  })
                                }
                              />
                              <TextInput
                                label="Tagline"
                                value={it?.tagline}
                                onChange={(v) =>
                                  updateActiveComponent((c) => {
                                    const rows = [...(c.props?.rows ?? [])];
                                    const items = [...(rows[ridx]?.items ?? [])];
                                    items[iidx] = { ...(items[iidx] ?? {}), tagline: v };
                                    rows[ridx] = { ...(rows[ridx] ?? {}), items };
                                    c.props = { ...(c.props ?? {}), rows };
                                  })
                                }
                              />
                              <TextInput
                                label="Image URL"
                                value={it?.imageUrl}
                                onChange={(v) =>
                                  updateActiveComponent((c) => {
                                    const rows = [...(c.props?.rows ?? [])];
                                    const items = [...(rows[ridx]?.items ?? [])];
                                    items[iidx] = { ...(items[iidx] ?? {}), imageUrl: v };
                                    rows[ridx] = { ...(rows[ridx] ?? {}), items };
                                    c.props = { ...(c.props ?? {}), rows };
                                  })
                                }
                                placeholder="https://..."
                              />
                              <TextInput
                                label="Href"
                                value={it?.href}
                                onChange={(v) =>
                                  updateActiveComponent((c) => {
                                    const rows = [...(c.props?.rows ?? [])];
                                    const items = [...(rows[ridx]?.items ?? [])];
                                    items[iidx] = { ...(items[iidx] ?? {}), href: v };
                                    rows[ridx] = { ...(rows[ridx] ?? {}), items };
                                    c.props = { ...(c.props ?? {}), rows };
                                  })
                                }
                                placeholder="/browse"
                              />
                              <SmallButton
                                variant="danger"
                                onClick={() =>
                                  updateActiveComponent((c) => {
                                    const rows = [...(c.props?.rows ?? [])];
                                    const items = [...(rows[ridx]?.items ?? [])];
                                    items.splice(iidx, 1);
                                    rows[ridx] = { ...(rows[ridx] ?? {}), items };
                                    c.props = { ...(c.props ?? {}), rows };
                                  })
                                }
                              >
                                Remove item
                              </SmallButton>
                            </div>
                          ))}
                          <SmallButton
                            onClick={() =>
                              updateActiveComponent((c) => {
                                const rows = [...(c.props?.rows ?? [])];
                                const items = [...(rows[ridx]?.items ?? []), { title: 'Item', tagline: 'Tagline', imageUrl: '', href: '/contact' }];
                                rows[ridx] = { ...(rows[ridx] ?? {}), items };
                                c.props = { ...(c.props ?? {}), rows };
                              })
                            }
                          >
                            Add item
                          </SmallButton>
                        </div>

                        <SmallButton
                          variant="danger"
                          onClick={() =>
                            updateActiveComponent((c) => {
                              const rows = [...(c.props?.rows ?? [])];
                              rows.splice(ridx, 1);
                              c.props = { ...(c.props ?? {}), rows };
                            })
                          }
                        >
                          Remove row
                        </SmallButton>
                      </div>
                    ))}
                    <SmallButton
                      onClick={() =>
                        updateActiveComponent((c) => {
                          const rows = [
                            ...(c.props?.rows ?? []),
                            {
                              title: 'New row',
                              subtitle: '',
                              cta: { label: 'See all', href: '/browse' },
                              items: [{ title: 'Item', tagline: 'Tagline', imageUrl: '', href: '/contact' }],
                            },
                          ];
                          c.props = { ...(c.props ?? {}), rows };
                        })
                      }
                    >
                      Add row
                    </SmallButton>
                  </div>
                ) : null}

                {activeComponent.type === 'ADVANCED_NAVBAR' ? (
                  <div className="space-y-3">
                    <TextInput
                      label="Logo text"
                      value={activeComponent.props?.logoText}
                      onChange={(v) => updateActiveComponent((c) => (c.props = { ...(c.props ?? {}), logoText: v }))}
                    />

                    <div className="rounded-lg border border-white/10 bg-black/20 p-3 space-y-2">
                      <div className="text-sm font-semibold">Search</div>
                      <label className="flex items-center justify-between gap-3 text-sm text-white/70">
                        <span>Show search</span>
                        <input
                          type="checkbox"
                          checked={!!activeComponent.props?.showSearch}
                          onChange={(e) =>
                            updateActiveComponent((c) => (c.props = { ...(c.props ?? {}), showSearch: e.target.checked }))
                          }
                        />
                      </label>
                      <TextInput
                        label="Placeholder"
                        value={activeComponent.props?.searchPlaceholder}
                        onChange={(v) => updateActiveComponent((c) => (c.props = { ...(c.props ?? {}), searchPlaceholder: v }))}
                        placeholder="Search…"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm font-semibold">Links</div>
                      {(activeComponent.props?.links ?? []).map((l, idx) => (
                        <div key={idx} className="rounded-lg border border-white/10 bg-black/20 p-3 space-y-2">
                          <TextInput
                            label="Label"
                            value={l.label}
                            onChange={(v) =>
                              updateActiveComponent((c) => {
                                const links = [...(c.props?.links ?? [])];
                                links[idx] = { ...links[idx], label: v };
                                c.props = { ...(c.props ?? {}), links };
                              })
                            }
                          />
                          <TextInput
                            label="Href"
                            value={l.href}
                            onChange={(v) =>
                              updateActiveComponent((c) => {
                                const links = [...(c.props?.links ?? [])];
                                links[idx] = { ...links[idx], href: v };
                                c.props = { ...(c.props ?? {}), links };
                              })
                            }
                            placeholder="/collections"
                          />
                          <SmallButton
                            variant="danger"
                            onClick={() =>
                              updateActiveComponent((c) => {
                                const links = [...(c.props?.links ?? [])];
                                links.splice(idx, 1);
                                c.props = { ...(c.props ?? {}), links };
                              })
                            }
                          >
                            Remove link
                          </SmallButton>
                        </div>
                      ))}
                      <SmallButton
                        onClick={() =>
                          updateActiveComponent((c) => {
                            const links = [...(c.props?.links ?? []), { label: 'Link', href: '/' }];
                            c.props = { ...(c.props ?? {}), links };
                          })
                        }
                      >
                        Add link
                      </SmallButton>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm font-semibold">CTA buttons</div>
                      {(activeComponent.props?.ctas ?? []).map((cta, idx) => (
                        <div key={idx} className="rounded-lg border border-white/10 bg-black/20 p-3 space-y-2">
                          <TextInput
                            label="Label"
                            value={cta?.label}
                            onChange={(v) =>
                              updateActiveComponent((c) => {
                                const ctas = [...(c.props?.ctas ?? [])];
                                ctas[idx] = { ...(ctas[idx] ?? {}), label: v };
                                c.props = { ...(c.props ?? {}), ctas };
                              })
                            }
                          />
                          <TextInput
                            label="Href"
                            value={cta?.href}
                            onChange={(v) =>
                              updateActiveComponent((c) => {
                                const ctas = [...(c.props?.ctas ?? [])];
                                ctas[idx] = { ...(ctas[idx] ?? {}), href: v };
                                c.props = { ...(c.props ?? {}), ctas };
                              })
                            }
                            placeholder="/contact"
                          />
                          <label className="block">
                            <div className="text-sm text-white/70">Variant</div>
                            <select
                              value={cta?.variant ?? 'neutral'}
                              onChange={(e) =>
                                updateActiveComponent((c) => {
                                  const ctas = [...(c.props?.ctas ?? [])];
                                  ctas[idx] = { ...(ctas[idx] ?? {}), variant: e.target.value };
                                  c.props = { ...(c.props ?? {}), ctas };
                                })
                              }
                              className="mt-1 w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm"
                            >
                              <option value="neutral">Neutral</option>
                              <option value="primary">Primary</option>
                            </select>
                          </label>
                          <SmallButton
                            variant="danger"
                            onClick={() =>
                              updateActiveComponent((c) => {
                                const ctas = [...(c.props?.ctas ?? [])];
                                ctas.splice(idx, 1);
                                c.props = { ...(c.props ?? {}), ctas };
                              })
                            }
                          >
                            Remove CTA
                          </SmallButton>
                        </div>
                      ))}
                      <SmallButton
                        onClick={() =>
                          updateActiveComponent((c) => {
                            const ctas = [...(c.props?.ctas ?? []), { label: 'Button', href: '/contact', variant: 'primary' }];
                            c.props = { ...(c.props ?? {}), ctas };
                          })
                        }
                      >
                        Add CTA
                      </SmallButton>
                    </div>
                  </div>
                ) : null}

                {activeComponent.type === 'LOGO_CLOUD' ? (
                  <div className="space-y-3">
                    <TextInput
                      label="Label"
                      value={activeComponent.props?.label}
                      onChange={(v) => updateActiveComponent((c) => (c.props = { ...(c.props ?? {}), label: v }))}
                    />
                    <div className="space-y-2">
                      <div className="text-sm font-semibold">Logos</div>
                      {(activeComponent.props?.logos ?? []).map((l, idx) => (
                        <div key={idx} className="rounded-lg border border-white/10 bg-black/20 p-3 space-y-2">
                          <TextInput
                            label="Alt text"
                            value={l?.alt}
                            onChange={(v) =>
                              updateActiveComponent((c) => {
                                const logos = [...(c.props?.logos ?? [])];
                                logos[idx] = { ...(logos[idx] ?? {}), alt: v };
                                c.props = { ...(c.props ?? {}), logos };
                              })
                            }
                          />
                          <TextInput
                            label="Image URL"
                            value={l?.src}
                            onChange={(v) =>
                              updateActiveComponent((c) => {
                                const logos = [...(c.props?.logos ?? [])];
                                logos[idx] = { ...(logos[idx] ?? {}), src: v };
                                c.props = { ...(c.props ?? {}), logos };
                              })
                            }
                            placeholder="https://..."
                          />
                          <SmallButton
                            variant="danger"
                            onClick={() =>
                              updateActiveComponent((c) => {
                                const logos = [...(c.props?.logos ?? [])];
                                logos.splice(idx, 1);
                                c.props = { ...(c.props ?? {}), logos };
                              })
                            }
                          >
                            Remove logo
                          </SmallButton>
                        </div>
                      ))}
                      <SmallButton
                        onClick={() =>
                          updateActiveComponent((c) => {
                            const logos = [...(c.props?.logos ?? []), { src: '', alt: 'New logo' }];
                            c.props = { ...(c.props ?? {}), logos };
                          })
                        }
                      >
                        Add logo
                      </SmallButton>
                    </div>
                  </div>
                ) : null}

                {activeComponent.type === 'PRODUCT_GRID' ? (
                  <div className="space-y-3">
                    <TextInput
                      label="Headline"
                      value={activeComponent.props?.headline}
                      onChange={(v) => updateActiveComponent((c) => (c.props = { ...(c.props ?? {}), headline: v }))}
                    />
                    <TextInput
                      label="Subheadline"
                      value={activeComponent.props?.subheadline}
                      onChange={(v) => updateActiveComponent((c) => (c.props = { ...(c.props ?? {}), subheadline: v }))}
                    />
                    <div className="rounded-lg border border-white/10 bg-black/20 p-3 space-y-2">
                      <div className="text-sm font-semibold">CTA</div>
                      <TextInput
                        label="Label"
                        value={activeComponent.props?.cta?.label}
                        onChange={(v) =>
                          updateActiveComponent((c) => (c.props = { ...(c.props ?? {}), cta: { ...(c.props?.cta ?? {}), label: v } }))
                        }
                      />
                      <TextInput
                        label="Href"
                        value={activeComponent.props?.cta?.href}
                        onChange={(v) =>
                          updateActiveComponent((c) => (c.props = { ...(c.props ?? {}), cta: { ...(c.props?.cta ?? {}), href: v } }))
                        }
                        placeholder="/collections"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm font-semibold">Products</div>
                      {(activeComponent.props?.products ?? []).map((p, idx) => (
                        <div key={idx} className="rounded-lg border border-white/10 bg-black/20 p-3 space-y-2">
                          <TextInput
                            label="Name"
                            value={p?.name}
                            onChange={(v) =>
                              updateActiveComponent((c) => {
                                const products = [...(c.props?.products ?? [])];
                                products[idx] = { ...(products[idx] ?? {}), name: v };
                                c.props = { ...(c.props ?? {}), products };
                              })
                            }
                          />
                          <TextInput
                            label="Description"
                            value={p?.description}
                            onChange={(v) =>
                              updateActiveComponent((c) => {
                                const products = [...(c.props?.products ?? [])];
                                products[idx] = { ...(products[idx] ?? {}), description: v };
                                c.props = { ...(c.props ?? {}), products };
                              })
                            }
                          />
                          <TextInput
                            label="Price"
                            value={p?.price}
                            onChange={(v) =>
                              updateActiveComponent((c) => {
                                const products = [...(c.props?.products ?? [])];
                                products[idx] = { ...(products[idx] ?? {}), price: v };
                                c.props = { ...(c.props ?? {}), products };
                              })
                            }
                          />
                          <TextInput
                            label="Badge"
                            value={p?.badge}
                            onChange={(v) =>
                              updateActiveComponent((c) => {
                                const products = [...(c.props?.products ?? [])];
                                products[idx] = { ...(products[idx] ?? {}), badge: v };
                                c.props = { ...(c.props ?? {}), products };
                              })
                            }
                            placeholder="New"
                          />
                          <TextInput
                            label="Image URL"
                            value={p?.imageUrl}
                            onChange={(v) =>
                              updateActiveComponent((c) => {
                                const products = [...(c.props?.products ?? [])];
                                products[idx] = { ...(products[idx] ?? {}), imageUrl: v };
                                c.props = { ...(c.props ?? {}), products };
                              })
                            }
                            placeholder="https://..."
                          />
                          <TextInput
                            label="Button label"
                            value={p?.cta?.label}
                            onChange={(v) =>
                              updateActiveComponent((c) => {
                                const products = [...(c.props?.products ?? [])];
                                products[idx] = { ...(products[idx] ?? {}), cta: { ...(products[idx]?.cta ?? {}), label: v } };
                                c.props = { ...(c.props ?? {}), products };
                              })
                            }
                          />
                          <TextInput
                            label="Button href"
                            value={p?.cta?.href}
                            onChange={(v) =>
                              updateActiveComponent((c) => {
                                const products = [...(c.props?.products ?? [])];
                                products[idx] = { ...(products[idx] ?? {}), cta: { ...(products[idx]?.cta ?? {}), href: v } };
                                c.props = { ...(c.props ?? {}), products };
                              })
                            }
                            placeholder="/contact"
                          />
                          <SmallButton
                            variant="danger"
                            onClick={() =>
                              updateActiveComponent((c) => {
                                const products = [...(c.props?.products ?? [])];
                                products.splice(idx, 1);
                                c.props = { ...(c.props ?? {}), products };
                              })
                            }
                          >
                            Remove product
                          </SmallButton>
                        </div>
                      ))}
                      <SmallButton
                        onClick={() =>
                          updateActiveComponent((c) => {
                            const products = [
                              ...(c.props?.products ?? []),
                              {
                                name: 'Product name',
                                description: 'Short product description',
                                price: '€49',
                                badge: null,
                                imageUrl: '',
                                cta: { label: 'Buy', href: '/contact' },
                              },
                            ];
                            c.props = { ...(c.props ?? {}), products };
                          })
                        }
                      >
                        Add product
                      </SmallButton>
                    </div>
                  </div>
                ) : null}

                {activeComponent.type === 'FEATURE_CAROUSEL' ? (
                  <div className="space-y-3">
                    <TextInput
                      label="Headline"
                      value={activeComponent.props?.headline}
                      onChange={(v) => updateActiveComponent((c) => (c.props = { ...(c.props ?? {}), headline: v }))}
                    />
                    <TextInput
                      label="Subheadline"
                      value={activeComponent.props?.subheadline}
                      onChange={(v) => updateActiveComponent((c) => (c.props = { ...(c.props ?? {}), subheadline: v }))}
                    />
                    <div className="rounded-lg border border-white/10 bg-black/20 p-3 space-y-2">
                      <div className="text-sm font-semibold">CTA</div>
                      <TextInput
                        label="Label"
                        value={activeComponent.props?.cta?.label}
                        onChange={(v) =>
                          updateActiveComponent((c) => (c.props = { ...(c.props ?? {}), cta: { ...(c.props?.cta ?? {}), label: v } }))
                        }
                      />
                      <TextInput
                        label="Href"
                        value={activeComponent.props?.cta?.href}
                        onChange={(v) =>
                          updateActiveComponent((c) => (c.props = { ...(c.props ?? {}), cta: { ...(c.props?.cta ?? {}), href: v } }))
                        }
                        placeholder="/browse"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm font-semibold">Items</div>
                      {(activeComponent.props?.items ?? []).map((it, idx) => (
                        <div key={idx} className="rounded-lg border border-white/10 bg-black/20 p-3 space-y-2">
                          <TextInput
                            label="Title"
                            value={it?.title}
                            onChange={(v) =>
                              updateActiveComponent((c) => {
                                const items = [...(c.props?.items ?? [])];
                                items[idx] = { ...(items[idx] ?? {}), title: v };
                                c.props = { ...(c.props ?? {}), items };
                              })
                            }
                          />
                          <TextInput
                            label="Tagline"
                            value={it?.tagline}
                            onChange={(v) =>
                              updateActiveComponent((c) => {
                                const items = [...(c.props?.items ?? [])];
                                items[idx] = { ...(items[idx] ?? {}), tagline: v };
                                c.props = { ...(c.props ?? {}), items };
                              })
                            }
                          />
                          <TextInput
                            label="Image URL"
                            value={it?.imageUrl}
                            onChange={(v) =>
                              updateActiveComponent((c) => {
                                const items = [...(c.props?.items ?? [])];
                                items[idx] = { ...(items[idx] ?? {}), imageUrl: v };
                                c.props = { ...(c.props ?? {}), items };
                              })
                            }
                            placeholder="https://..."
                          />
                          <TextInput
                            label="Button label"
                            value={it?.cta?.label}
                            onChange={(v) =>
                              updateActiveComponent((c) => {
                                const items = [...(c.props?.items ?? [])];
                                items[idx] = { ...(items[idx] ?? {}), cta: { ...(items[idx]?.cta ?? {}), label: v } };
                                c.props = { ...(c.props ?? {}), items };
                              })
                            }
                          />
                          <TextInput
                            label="Button href"
                            value={it?.cta?.href}
                            onChange={(v) =>
                              updateActiveComponent((c) => {
                                const items = [...(c.props?.items ?? [])];
                                items[idx] = { ...(items[idx] ?? {}), cta: { ...(items[idx]?.cta ?? {}), href: v } };
                                c.props = { ...(c.props ?? {}), items };
                              })
                            }
                            placeholder="/contact"
                          />
                          <SmallButton
                            variant="danger"
                            onClick={() =>
                              updateActiveComponent((c) => {
                                const items = [...(c.props?.items ?? [])];
                                items.splice(idx, 1);
                                c.props = { ...(c.props ?? {}), items };
                              })
                            }
                          >
                            Remove item
                          </SmallButton>
                        </div>
                      ))}
                      <SmallButton
                        onClick={() =>
                          updateActiveComponent((c) => {
                            const items = [
                              ...(c.props?.items ?? []),
                              { title: 'Feature item', tagline: 'Short tagline', imageUrl: '', cta: { label: 'Open', href: '/contact' } },
                            ];
                            c.props = { ...(c.props ?? {}), items };
                          })
                        }
                      >
                        Add item
                      </SmallButton>
                    </div>
                  </div>
                ) : null}

                {activeComponent.type === 'HERO' ? (
                  <div className="space-y-3">
                    <TextInput
                      label="Headline"
                      value={activeComponent.props?.headline}
                      onChange={(v) => updateActiveComponent((c) => (c.props = { ...(c.props ?? {}), headline: v }))}
                    />
                    <TextInput
                      label="Subheadline"
                      value={activeComponent.props?.subheadline}
                      onChange={(v) => updateActiveComponent((c) => (c.props = { ...(c.props ?? {}), subheadline: v }))}
                    />
                    <div className="rounded-lg border border-white/10 bg-black/20 p-3 space-y-2">
                      <div className="text-sm font-semibold">Primary CTA</div>
                      <TextInput
                        label="Label"
                        value={activeComponent.props?.primaryCta?.label}
                        onChange={(v) =>
                          updateActiveComponent((c) =>
                            (c.props = {
                              ...(c.props ?? {}),
                              primaryCta: { ...(c.props?.primaryCta ?? {}), label: v },
                            })
                          )
                        }
                      />
                      <TextInput
                        label="Href"
                        value={activeComponent.props?.primaryCta?.href}
                        onChange={(v) =>
                          updateActiveComponent((c) =>
                            (c.props = {
                              ...(c.props ?? {}),
                              primaryCta: { ...(c.props?.primaryCta ?? {}), href: v },
                            })
                          )
                        }
                        placeholder="/contact"
                      />
                    </div>
                  </div>
                ) : null}

                {activeComponent.type === 'FEATURES' ? (
                  <div className="space-y-2">
                    <div className="text-sm font-semibold">Items</div>
                    {(activeComponent.props?.items ?? []).map((it, idx) => (
                      <div key={idx} className="rounded-lg border border-white/10 bg-black/20 p-3 space-y-2">
                        <TextInput
                          label="Title"
                          value={it.title}
                          onChange={(v) =>
                            updateActiveComponent((c) => {
                              const items = [...(c.props?.items ?? [])];
                              items[idx] = { ...items[idx], title: v };
                              c.props = { ...(c.props ?? {}), items };
                            })
                          }
                        />
                        <TextInput
                          label="Text"
                          value={it.text}
                          onChange={(v) =>
                            updateActiveComponent((c) => {
                              const items = [...(c.props?.items ?? [])];
                              items[idx] = { ...items[idx], text: v };
                              c.props = { ...(c.props ?? {}), items };
                            })
                          }
                        />
                        <SmallButton
                          variant="danger"
                          onClick={() =>
                            updateActiveComponent((c) => {
                              const items = [...(c.props?.items ?? [])];
                              items.splice(idx, 1);
                              c.props = { ...(c.props ?? {}), items };
                            })
                          }
                        >
                          Remove item
                        </SmallButton>
                      </div>
                    ))}
                    <SmallButton
                      onClick={() =>
                        updateActiveComponent((c) => {
                          const items = [...(c.props?.items ?? []), { title: 'Feature', text: 'Describe value' }];
                          c.props = { ...(c.props ?? {}), items };
                        })
                      }
                    >
                      Add item
                    </SmallButton>
                  </div>
                ) : null}

                {activeComponent.type === 'CONTENT' ? (
                  <div className="space-y-3">
                    <TextInput
                      label="Title"
                      value={activeComponent.props?.title}
                      onChange={(v) => updateActiveComponent((c) => (c.props = { ...(c.props ?? {}), title: v }))}
                    />
                    <div className="space-y-2">
                      <div className="text-sm font-semibold">Paragraphs</div>
                      {(activeComponent.props?.paragraphs ?? []).map((p, idx) => (
                        <div key={idx} className="rounded-lg border border-white/10 bg-black/20 p-3 space-y-2">
                          <label className="block">
                            <div className="text-sm text-white/70">Text</div>
                            <textarea
                              value={p}
                              onChange={(e) => {
                                const v = e.target.value;
                                updateActiveComponent((c) => {
                                  const paragraphs = [...(c.props?.paragraphs ?? [])];
                                  paragraphs[idx] = v;
                                  c.props = { ...(c.props ?? {}), paragraphs };
                                });
                              }}
                              className="mt-1 w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm"
                              rows={3}
                            />
                          </label>
                          <SmallButton
                            variant="danger"
                            onClick={() =>
                              updateActiveComponent((c) => {
                                const paragraphs = [...(c.props?.paragraphs ?? [])];
                                paragraphs.splice(idx, 1);
                                c.props = { ...(c.props ?? {}), paragraphs };
                              })
                            }
                          >
                            Remove
                          </SmallButton>
                        </div>
                      ))}
                      <SmallButton
                        onClick={() =>
                          updateActiveComponent((c) => {
                            const paragraphs = [...(c.props?.paragraphs ?? []), 'New paragraph'];
                            c.props = { ...(c.props ?? {}), paragraphs };
                          })
                        }
                      >
                        Add paragraph
                      </SmallButton>
                    </div>
                  </div>
                ) : null}

                {activeComponent.type === 'CARDS' ? (
                  <div className="space-y-2">
                    <div className="text-sm font-semibold">Cards</div>
                    {(activeComponent.props?.cards ?? []).map((card, idx) => (
                      <div key={idx} className="rounded-lg border border-white/10 bg-black/20 p-3 space-y-2">
                        <TextInput
                          label="Title"
                          value={card.title}
                          onChange={(v) =>
                            updateActiveComponent((c) => {
                              const cards = [...(c.props?.cards ?? [])];
                              cards[idx] = { ...(cards[idx] ?? {}), title: v };
                              c.props = { ...(c.props ?? {}), cards };
                            })
                          }
                        />
                        <TextInput
                          label="Text"
                          value={card.text}
                          onChange={(v) =>
                            updateActiveComponent((c) => {
                              const cards = [...(c.props?.cards ?? [])];
                              cards[idx] = { ...(cards[idx] ?? {}), text: v };
                              c.props = { ...(c.props ?? {}), cards };
                            })
                          }
                        />
                        <TextInput
                          label="CTA label"
                          value={card.cta?.label}
                          onChange={(v) =>
                            updateActiveComponent((c) => {
                              const cards = [...(c.props?.cards ?? [])];
                              cards[idx] = { ...(cards[idx] ?? {}), cta: { ...(cards[idx]?.cta ?? {}), label: v } };
                              c.props = { ...(c.props ?? {}), cards };
                            })
                          }
                        />
                        <TextInput
                          label="CTA href"
                          value={card.cta?.href}
                          onChange={(v) =>
                            updateActiveComponent((c) => {
                              const cards = [...(c.props?.cards ?? [])];
                              cards[idx] = { ...(cards[idx] ?? {}), cta: { ...(cards[idx]?.cta ?? {}), href: v } };
                              c.props = { ...(c.props ?? {}), cards };
                            })
                          }
                          placeholder="/contact"
                        />
                        <SmallButton
                          variant="danger"
                          onClick={() =>
                            updateActiveComponent((c) => {
                              const cards = [...(c.props?.cards ?? [])];
                              cards.splice(idx, 1);
                              c.props = { ...(c.props ?? {}), cards };
                            })
                          }
                        >
                          Remove card
                        </SmallButton>
                      </div>
                    ))}
                    <SmallButton
                      onClick={() =>
                        updateActiveComponent((c) => {
                          const cards = [
                            ...(c.props?.cards ?? []),
                            { title: 'Card title', text: 'Card description', cta: { label: 'Learn more', href: '/contact' } },
                          ];
                          c.props = { ...(c.props ?? {}), cards };
                        })
                      }
                    >
                      Add card
                    </SmallButton>
                  </div>
                ) : null}

                {activeComponent.type === 'GALLERY' ? (
                  <div className="space-y-2">
                    <div className="text-sm font-semibold">Images</div>
                    {(activeComponent.props?.images ?? []).map((url, idx) => (
                      <div key={idx} className="rounded-lg border border-white/10 bg-black/20 p-3 space-y-2">
                        <TextInput
                          label={`Image URL #${idx + 1}`}
                          value={url}
                          onChange={(v) =>
                            updateActiveComponent((c) => {
                              const images = [...(c.props?.images ?? [])];
                              images[idx] = v;
                              c.props = { ...(c.props ?? {}), images };
                            })
                          }
                        />
                        <SmallButton
                          variant="danger"
                          onClick={() =>
                            updateActiveComponent((c) => {
                              const images = [...(c.props?.images ?? [])];
                              images.splice(idx, 1);
                              c.props = { ...(c.props ?? {}), images };
                            })
                          }
                        >
                          Remove
                        </SmallButton>
                      </div>
                    ))}
                    <SmallButton
                      onClick={() =>
                        updateActiveComponent((c) => {
                          const images = [...(c.props?.images ?? []), 'https://example.com/new-image.jpg'];
                          c.props = { ...(c.props ?? {}), images };
                        })
                      }
                    >
                      Add image
                    </SmallButton>

                    <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-3 space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="text-sm font-semibold">Asset library</div>
                          <div className="mt-1 text-xs text-white/60">Upload once, reuse in your galleries.</div>
                        </div>
                        <label className="rounded-md bg-white/10 px-3 py-2 text-xs font-medium hover:bg-white/15 cursor-pointer">
                          {uploadingAsset ? 'Uploading…' : 'Upload'}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={uploadingAsset}
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              e.target.value = '';
                              if (!file) return;

                              try {
                                setUploadingAsset(true);
                                setAssetsError(null);
                                const fd = new FormData();
                                fd.append('file', file);
                                fd.append('websiteId', String(websiteId));
                                const { data } = await api.post('/assets/upload', fd, {
                                  headers: { 'Content-Type': 'multipart/form-data' },
                                });
                                const created = data.asset;
                                setAssets((prev) => [created, ...(prev ?? [])]);
                              } catch (err) {
                                setAssetsError(err?.response?.data?.error?.message ?? 'Failed to upload');
                              } finally {
                                setUploadingAsset(false);
                              }
                            }}
                          />
                        </label>
                      </div>

                      {assetsError ? <div className="rounded-md bg-red-500/10 p-2 text-xs text-red-200">{assetsError}</div> : null}

                      <div className="grid grid-cols-1 gap-2">
                        {(assets ?? []).slice(0, 8).map((a) => {
                          const fullUrl = makeAbsoluteAssetUrl(a.url);
                          return (
                            <div key={a.id} className="rounded-lg border border-white/10 bg-black/30 p-2">
                              <div className="flex items-center justify-between gap-2">
                                <div className="min-w-0">
                                  <div className="truncate text-xs text-white/70">{a.meta?.originalName ?? fullUrl}</div>
                                  <div className="truncate text-[11px] text-white/40">{fullUrl}</div>
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      navigator.clipboard?.writeText?.(fullUrl);
                                    }}
                                    className="rounded-md bg-white/10 px-2 py-1 text-[11px] font-medium text-white/80 hover:bg-white/15"
                                  >
                                    Copy
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      updateActiveComponent((c) => {
                                        const images = [...(c.props?.images ?? []), fullUrl];
                                        c.props = { ...(c.props ?? {}), images };
                                      })
                                    }
                                    className="rounded-md bg-indigo-500 px-2 py-1 text-[11px] font-medium text-white hover:bg-indigo-400"
                                  >
                                    Add
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        {!assets?.length ? <div className="text-xs text-white/50">No assets yet.</div> : null}
                      </div>
                    </div>
                  </div>
                ) : null}

                {activeComponent.type === 'PRICING' ? (
                  <div className="space-y-2">
                    <div className="text-sm font-semibold">Plans</div>
                    {(activeComponent.props?.plans ?? []).map((plan, pidx) => (
                      <div key={pidx} className="rounded-lg border border-white/10 bg-black/20 p-3 space-y-2">
                        <TextInput
                          label="Plan name"
                          value={plan.name}
                          onChange={(v) =>
                            updateActiveComponent((c) => {
                              const plans = [...(c.props?.plans ?? [])];
                              plans[pidx] = { ...(plans[pidx] ?? {}), name: v };
                              c.props = { ...(c.props ?? {}), plans };
                            })
                          }
                        />
                        <TextInput
                          label="Price"
                          value={plan.price}
                          onChange={(v) =>
                            updateActiveComponent((c) => {
                              const plans = [...(c.props?.plans ?? [])];
                              plans[pidx] = { ...(plans[pidx] ?? {}), price: v };
                              c.props = { ...(c.props ?? {}), plans };
                            })
                          }
                        />
                        <TextInput
                          label="Period"
                          value={plan.period}
                          onChange={(v) =>
                            updateActiveComponent((c) => {
                              const plans = [...(c.props?.plans ?? [])];
                              plans[pidx] = { ...(plans[pidx] ?? {}), period: v };
                              c.props = { ...(c.props ?? {}), plans };
                            })
                          }
                          placeholder="/mo"
                        />
                        <label className="block">
                          <div className="text-sm text-white/70">Features (one per line)</div>
                          <textarea
                            value={(plan.features ?? []).join('\n')}
                            onChange={(e) => {
                              const lines = e.target.value.split('\n').map((x) => x.trim()).filter(Boolean);
                              updateActiveComponent((c) => {
                                const plans = [...(c.props?.plans ?? [])];
                                plans[pidx] = { ...(plans[pidx] ?? {}), features: lines };
                                c.props = { ...(c.props ?? {}), plans };
                              });
                            }}
                            className="mt-1 w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm"
                            rows={4}
                          />
                        </label>
                        <SmallButton
                          variant="danger"
                          onClick={() =>
                            updateActiveComponent((c) => {
                              const plans = [...(c.props?.plans ?? [])];
                              plans.splice(pidx, 1);
                              c.props = { ...(c.props ?? {}), plans };
                            })
                          }
                        >
                          Remove plan
                        </SmallButton>
                      </div>
                    ))}
                    <SmallButton
                      onClick={() =>
                        updateActiveComponent((c) => {
                          const plans = [...(c.props?.plans ?? []), { name: 'New Plan', price: '€0', period: '/mo', features: [] }];
                          c.props = { ...(c.props ?? {}), plans };
                        })
                      }
                    >
                      Add plan
                    </SmallButton>
                  </div>
                ) : null}

                {activeComponent.type === 'CONTACT_FORM' ? (
                  <div className="space-y-3">
                    <TextInput
                      label="Headline"
                      value={activeComponent.props?.headline}
                      onChange={(v) => updateActiveComponent((c) => (c.props = { ...(c.props ?? {}), headline: v }))}
                    />
                  </div>
                ) : null}

                {activeComponent.type === 'FOOTER' ? (
                  <div className="space-y-3">
                    <TextInput
                      label="Text"
                      value={activeComponent.props?.text}
                      onChange={(v) => updateActiveComponent((c) => (c.props = { ...(c.props ?? {}), text: v }))}
                    />
                  </div>
                ) : null}

                {activeComponent.type === 'FOOTER_LINKS' ? (
                  <div className="space-y-3">
                    <TextInput
                      label="Brand"
                      value={activeComponent.props?.brand}
                      onChange={(v) => updateActiveComponent((c) => (c.props = { ...(c.props ?? {}), brand: v }))}
                    />
                    <label className="block">
                      <div className="text-sm text-white/70">Description</div>
                      <textarea
                        value={activeComponent.props?.description ?? ''}
                        onChange={(e) => {
                          const v = e.target.value;
                          updateActiveComponent((c) => (c.props = { ...(c.props ?? {}), description: v }));
                        }}
                        className="mt-1 w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm"
                        rows={2}
                      />
                    </label>
                    <TextInput
                      label="Copyright"
                      value={activeComponent.props?.copyright}
                      onChange={(v) => updateActiveComponent((c) => (c.props = { ...(c.props ?? {}), copyright: v }))}
                    />

                    <div className="space-y-2">
                      <div className="text-sm font-semibold">Columns</div>
                      {(activeComponent.props?.columns ?? []).map((col, cidx) => (
                        <div key={cidx} className="rounded-lg border border-white/10 bg-black/20 p-3 space-y-2">
                          <TextInput
                            label="Title"
                            value={col?.title}
                            onChange={(v) =>
                              updateActiveComponent((c) => {
                                const columns = [...(c.props?.columns ?? [])];
                                columns[cidx] = { ...(columns[cidx] ?? {}), title: v };
                                c.props = { ...(c.props ?? {}), columns };
                              })
                            }
                          />

                          <div className="space-y-2">
                            <div className="text-sm font-semibold">Links</div>
                            {(col?.links ?? []).map((l, lidx) => (
                              <div key={lidx} className="rounded-lg border border-white/10 bg-black/20 p-3 space-y-2">
                                <TextInput
                                  label="Label"
                                  value={l?.label}
                                  onChange={(v) =>
                                    updateActiveComponent((c) => {
                                      const columns = [...(c.props?.columns ?? [])];
                                      const links = [...(columns[cidx]?.links ?? [])];
                                      links[lidx] = { ...(links[lidx] ?? {}), label: v };
                                      columns[cidx] = { ...(columns[cidx] ?? {}), links };
                                      c.props = { ...(c.props ?? {}), columns };
                                    })
                                  }
                                />
                                <TextInput
                                  label="Href"
                                  value={l?.href}
                                  onChange={(v) =>
                                    updateActiveComponent((c) => {
                                      const columns = [...(c.props?.columns ?? [])];
                                      const links = [...(columns[cidx]?.links ?? [])];
                                      links[lidx] = { ...(links[lidx] ?? {}), href: v };
                                      columns[cidx] = { ...(columns[cidx] ?? {}), links };
                                      c.props = { ...(c.props ?? {}), columns };
                                    })
                                  }
                                  placeholder="/about"
                                />
                                <SmallButton
                                  variant="danger"
                                  onClick={() =>
                                    updateActiveComponent((c) => {
                                      const columns = [...(c.props?.columns ?? [])];
                                      const links = [...(columns[cidx]?.links ?? [])];
                                      links.splice(lidx, 1);
                                      columns[cidx] = { ...(columns[cidx] ?? {}), links };
                                      c.props = { ...(c.props ?? {}), columns };
                                    })
                                  }
                                >
                                  Remove link
                                </SmallButton>
                              </div>
                            ))}
                            <SmallButton
                              onClick={() =>
                                updateActiveComponent((c) => {
                                  const columns = [...(c.props?.columns ?? [])];
                                  const links = [...(columns[cidx]?.links ?? []), { label: 'Link', href: '/' }];
                                  columns[cidx] = { ...(columns[cidx] ?? {}), links };
                                  c.props = { ...(c.props ?? {}), columns };
                                })
                              }
                            >
                              Add link
                            </SmallButton>
                          </div>

                          <SmallButton
                            variant="danger"
                            onClick={() =>
                              updateActiveComponent((c) => {
                                const columns = [...(c.props?.columns ?? [])];
                                columns.splice(cidx, 1);
                                c.props = { ...(c.props ?? {}), columns };
                              })
                            }
                          >
                            Remove column
                          </SmallButton>
                        </div>
                      ))}

                      <SmallButton
                        onClick={() =>
                          updateActiveComponent((c) => {
                            const columns = [...(c.props?.columns ?? []), { title: 'Column', links: [{ label: 'Link', href: '/' }] }];
                            c.props = { ...(c.props ?? {}), columns };
                          })
                        }
                      >
                        Add column
                      </SmallButton>
                    </div>
                  </div>
                ) : null}

                {activeComponent.type === 'TESTIMONIALS' ? (
                  <div className="space-y-3">
                    <TextInput
                      label="Headline"
                      value={activeComponent.props?.headline}
                      onChange={(v) => updateActiveComponent((c) => (c.props = { ...(c.props ?? {}), headline: v }))}
                    />
                    <TextInput
                      label="Subheadline"
                      value={activeComponent.props?.subheadline}
                      onChange={(v) => updateActiveComponent((c) => (c.props = { ...(c.props ?? {}), subheadline: v }))}
                    />
                    <div className="space-y-2">
                      <div className="text-sm font-semibold">Items</div>
                      {(activeComponent.props?.items ?? []).map((t, idx) => (
                        <div key={idx} className="rounded-lg border border-white/10 bg-black/20 p-3 space-y-2">
                          <TextInput
                            label="Name"
                            value={t.name}
                            onChange={(v) =>
                              updateActiveComponent((c) => {
                                const items = [...(c.props?.items ?? [])];
                                items[idx] = { ...(items[idx] ?? {}), name: v };
                                c.props = { ...(c.props ?? {}), items };
                              })
                            }
                          />
                          <TextInput
                            label="Role"
                            value={t.role}
                            onChange={(v) =>
                              updateActiveComponent((c) => {
                                const items = [...(c.props?.items ?? [])];
                                items[idx] = { ...(items[idx] ?? {}), role: v };
                                c.props = { ...(c.props ?? {}), items };
                              })
                            }
                          />
                          <label className="block">
                            <div className="text-sm text-white/70">Quote</div>
                            <textarea
                              value={t.quote ?? ''}
                              onChange={(e) => {
                                const v = e.target.value;
                                updateActiveComponent((c) => {
                                  const items = [...(c.props?.items ?? [])];
                                  items[idx] = { ...(items[idx] ?? {}), quote: v };
                                  c.props = { ...(c.props ?? {}), items };
                                });
                              }}
                              className="mt-1 w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm"
                              rows={3}
                            />
                          </label>
                          <SmallButton
                            variant="danger"
                            onClick={() =>
                              updateActiveComponent((c) => {
                                const items = [...(c.props?.items ?? [])];
                                items.splice(idx, 1);
                                c.props = { ...(c.props ?? {}), items };
                              })
                            }
                          >
                            Remove
                          </SmallButton>
                        </div>
                      ))}
                      <SmallButton
                        onClick={() =>
                          updateActiveComponent((c) => {
                            const items = [...(c.props?.items ?? []), { name: 'Customer', role: 'Role', quote: 'Quote' }];
                            c.props = { ...(c.props ?? {}), items };
                          })
                        }
                      >
                        Add testimonial
                      </SmallButton>
                    </div>
                  </div>
                ) : null}

                {activeComponent.type === 'FAQ' ? (
                  <div className="space-y-3">
                    <TextInput
                      label="Headline"
                      value={activeComponent.props?.headline}
                      onChange={(v) => updateActiveComponent((c) => (c.props = { ...(c.props ?? {}), headline: v }))}
                    />
                    <TextInput
                      label="Subheadline"
                      value={activeComponent.props?.subheadline}
                      onChange={(v) => updateActiveComponent((c) => (c.props = { ...(c.props ?? {}), subheadline: v }))}
                    />
                    <div className="space-y-2">
                      <div className="text-sm font-semibold">Items</div>
                      {(activeComponent.props?.items ?? []).map((f, idx) => (
                        <div key={idx} className="rounded-lg border border-white/10 bg-black/20 p-3 space-y-2">
                          <TextInput
                            label="Question"
                            value={f.q}
                            onChange={(v) =>
                              updateActiveComponent((c) => {
                                const items = [...(c.props?.items ?? [])];
                                items[idx] = { ...(items[idx] ?? {}), q: v };
                                c.props = { ...(c.props ?? {}), items };
                              })
                            }
                          />
                          <label className="block">
                            <div className="text-sm text-white/70">Answer</div>
                            <textarea
                              value={f.a ?? ''}
                              onChange={(e) => {
                                const v = e.target.value;
                                updateActiveComponent((c) => {
                                  const items = [...(c.props?.items ?? [])];
                                  items[idx] = { ...(items[idx] ?? {}), a: v };
                                  c.props = { ...(c.props ?? {}), items };
                                });
                              }}
                              className="mt-1 w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm"
                              rows={3}
                            />
                          </label>
                          <SmallButton
                            variant="danger"
                            onClick={() =>
                              updateActiveComponent((c) => {
                                const items = [...(c.props?.items ?? [])];
                                items.splice(idx, 1);
                                c.props = { ...(c.props ?? {}), items };
                              })
                            }
                          >
                            Remove
                          </SmallButton>
                        </div>
                      ))}
                      <SmallButton
                        onClick={() =>
                          updateActiveComponent((c) => {
                            const items = [...(c.props?.items ?? []), { q: 'Question', a: 'Answer' }];
                            c.props = { ...(c.props ?? {}), items };
                          })
                        }
                      >
                        Add FAQ
                      </SmallButton>
                    </div>
                  </div>
                ) : null}

                {activeComponent.type === 'STATS_CTA' ? (
                  <div className="space-y-3">
                    <TextInput
                      label="Headline"
                      value={activeComponent.props?.headline}
                      onChange={(v) => updateActiveComponent((c) => (c.props = { ...(c.props ?? {}), headline: v }))}
                    />
                    <TextInput
                      label="Subheadline"
                      value={activeComponent.props?.subheadline}
                      onChange={(v) => updateActiveComponent((c) => (c.props = { ...(c.props ?? {}), subheadline: v }))}
                    />
                    <div className="rounded-lg border border-white/10 bg-black/20 p-3 space-y-2">
                      <div className="text-sm font-semibold">Primary CTA</div>
                      <TextInput
                        label="Label"
                        value={activeComponent.props?.primaryCta?.label}
                        onChange={(v) =>
                          updateActiveComponent((c) =>
                            (c.props = {
                              ...(c.props ?? {}),
                              primaryCta: { ...(c.props?.primaryCta ?? {}), label: v },
                            })
                          )
                        }
                      />
                      <TextInput
                        label="Href"
                        value={activeComponent.props?.primaryCta?.href}
                        onChange={(v) =>
                          updateActiveComponent((c) =>
                            (c.props = {
                              ...(c.props ?? {}),
                              primaryCta: { ...(c.props?.primaryCta ?? {}), href: v },
                            })
                          )
                        }
                        placeholder="/contact"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm font-semibold">Stats</div>
                      {(activeComponent.props?.items ?? []).map((it, idx) => (
                        <div key={idx} className="rounded-lg border border-white/10 bg-black/20 p-3 space-y-2">
                          <TextInput
                            label="Value"
                            value={it.value}
                            onChange={(v) =>
                              updateActiveComponent((c) => {
                                const items = [...(c.props?.items ?? [])];
                                items[idx] = { ...(items[idx] ?? {}), value: v };
                                c.props = { ...(c.props ?? {}), items };
                              })
                            }
                          />
                          <TextInput
                            label="Label"
                            value={it.label}
                            onChange={(v) =>
                              updateActiveComponent((c) => {
                                const items = [...(c.props?.items ?? [])];
                                items[idx] = { ...(items[idx] ?? {}), label: v };
                                c.props = { ...(c.props ?? {}), items };
                              })
                            }
                          />
                          <SmallButton
                            variant="danger"
                            onClick={() =>
                              updateActiveComponent((c) => {
                                const items = [...(c.props?.items ?? [])];
                                items.splice(idx, 1);
                                c.props = { ...(c.props ?? {}), items };
                              })
                            }
                          >
                            Remove
                          </SmallButton>
                        </div>
                      ))}
                      <SmallButton
                        onClick={() =>
                          updateActiveComponent((c) => {
                            const items = [...(c.props?.items ?? []), { value: '100+', label: 'Customers' }];
                            c.props = { ...(c.props ?? {}), items };
                          })
                        }
                      >
                        Add stat
                      </SmallButton>
                    </div>
                  </div>
                ) : null}

                <SmallButton
                  variant="danger"
                  onClick={() => {
                    setPages((prev) => {
                      const next = (prev ?? []).map((p) => ({
                        ...p,
                        components: (p.components ?? []).map((c) => ({ ...c, props: { ...(c.props ?? {}) }, styles: { ...(c.styles ?? {}) } })),
                      }));
                      const page2 = next?.[activePageIndex];
                      if (!page2) return prev;
                      const comps2 = [...(page2.components ?? [])];
                      comps2.splice(activeComponentIndex, 1);
                      page2.components = comps2;
                      return next;
                    });
                    setActiveComponentIndex(0);
                  }}
                >
                  Delete component
                </SmallButton>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
