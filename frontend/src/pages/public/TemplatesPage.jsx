import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api.js';
import { useAuth } from '../../auth/AuthContext.jsx';
import { SiteRenderer } from '../../components/website/SiteRenderer.jsx';

const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:5000/api';
const ASSET_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, '');

const FEATURED_TEMPLATE_PREVIEW_IMAGES = [
  '/template-previews/pixel-studio.png',
  '/template-previews/shopnova.png',
  '/template-previews/devfolio.png',
  '/template-previews/bella-cucina.png',
  '/template-previews/saveur.png',
  '/template-previews/ironforge.png',
  '/template-previews/nova.png',
  '/template-previews/cloudpulse.png',
  '/template-previews/prestige-estates.png',
];

export function TemplatesPage() {
  const nav = useNavigate();
  const { accessToken } = useAuth();
  const [templates, setTemplates] = useState([]);
  const [error, setError] = useState(null);

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('ALL');

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState(null);
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [previewPages, setPreviewPages] = useState(null);
  const [previewPageIndex, setPreviewPageIndex] = useState(0);

  function parseJsonMaybe(value, fallback) {
    if (value === null || value === undefined) return fallback;
    if (typeof value === 'object') return value;
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return fallback;
      }
    }
    return fallback;
  }

  useEffect(() => {
    let canceled = false;

    async function load() {
      try {
        setError(null);
        const { data } = await api.get('/templates');
        if (!canceled) setTemplates(data.templates ?? []);
      } catch (err) {
        if (!canceled) setError(err?.response?.data?.error?.message ?? 'Failed to load templates');
      }
    }

    load();

    return () => {
      canceled = true;
    };
  }, []);

  const templatesWithFeaturedPreviews = useMemo(() => {
    const list = templates ?? [];
    const featuredCount = Math.min(FEATURED_TEMPLATE_PREVIEW_IMAGES.length, list.length);

    const featured = list.slice(0, featuredCount).map((t, idx) => {
      return {
        ...t,
        __featured_preview_src: FEATURED_TEMPLATE_PREVIEW_IMAGES[idx],
      };
    });

    const rest = list.slice(featuredCount);
    return [...featured, ...rest];
  }, [templates]);

  async function openPreview(templateId) {
    setPreviewOpen(true);
    setPreviewLoading(true);
    setPreviewError(null);
    setPreviewTemplate(null);
    setPreviewPages(null);
    setPreviewPageIndex(0);
    try {
      const { data } = await api.get(`/templates/${templateId}/preview`);
      setPreviewTemplate(data.template);
      setPreviewPages(data.pages ?? []);
      // Store design system from template for proper theming
      if (data.template?.designSystem) {
        setPreviewTemplate(prev => ({ ...prev, designSystem: data.template.designSystem }));
      }
    } catch (err) {
      setPreviewError(err?.response?.data?.error?.message ?? 'Failed to load template preview');
    } finally {
      setPreviewLoading(false);
    }
  }

  const categories = ['ALL', ...Array.from(new Set((templatesWithFeaturedPreviews ?? []).map((t) => t.category).filter(Boolean))).sort((a, b) => a.localeCompare(b))];
  const q = query.trim().toLowerCase();
  const filtered = (templatesWithFeaturedPreviews ?? []).filter((t) => {
    if (category !== 'ALL' && t.category !== category) return false;
    if (!q) return true;
    return `${t.name ?? ''} ${t.category ?? ''}`.toLowerCase().includes(q);
  });

  return (
    <div>
      <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-500/15 via-white/5 to-transparent p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Templates</h2>
            <p className="mt-1 text-white/70">Search, preview, and choose a template. Customize everything after.</p>
          </div>
          <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row md:items-center">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search templates…"
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2 text-sm text-white/90 placeholder:text-white/40 md:w-72"
            />
            <select
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2 text-sm text-white/90 md:w-56"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === 'ALL' ? 'All categories' : c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {previewOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => {
              setPreviewOpen(false);
            }}
          />
          <div className="relative z-10 w-full max-w-6xl overflow-hidden rounded-2xl border border-white/10 bg-black/90 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-black/60 px-4 py-3">
              <div>
                <div className="text-sm text-white/60">Template preview</div>
                <div className="text-lg font-semibold">{previewTemplate?.name ?? 'Loading…'}</div>
              </div>
              <div className="flex items-center gap-2">
                {previewPages?.length ? (
                  <select
                    className="rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm"
                    value={previewPageIndex}
                    onChange={(e) => setPreviewPageIndex(Number(e.target.value))}
                  >
                    {(previewPages ?? []).map((p, idx) => (
                      <option key={p?.path ?? idx} value={idx}>
                        {p?.name ?? 'Page'} ({p?.path ?? '/'})
                      </option>
                    ))}
                  </select>
                ) : null}
                <button
                  type="button"
                  onClick={() => setPreviewOpen(false)}
                  className="rounded-md bg-white/10 px-3 py-2 text-sm font-medium text-white/80 hover:bg-white/15"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="max-h-[80vh] overflow-auto">
              {previewError ? <div className="p-4 text-sm text-red-200">{previewError}</div> : null}
              {previewLoading ? <div className="p-4 text-sm text-white/60">Loading preview…</div> : null}
              {!previewLoading && previewPages ? (
                <div className="bg-black">
                  <SiteRenderer
                    pages={previewPages}
                    activePageIndex={previewPageIndex}
                    theme={{
                      background: previewTemplate?.designSystem?.colors?.background || '#070a12',
                      primary: previewTemplate?.designSystem?.colors?.primary || '#6366f1',
                      secondary: previewTemplate?.designSystem?.colors?.secondary,
                      text: previewTemplate?.designSystem?.colors?.text || '#ffffff',
                      mutedText: previewTemplate?.designSystem?.colors?.mutedText || 'rgba(255,255,255,0.7)',
                    }}
                    designSystem={previewTemplate?.designSystem}
                  />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        {error ? (
          <div className="md:col-span-3 rounded-md bg-red-500/10 p-3 text-sm text-red-200">{error}</div>
        ) : null}
        {!error && !filtered.length ? (
          <div className="md:col-span-3 rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-white/70">
            No templates match your filters.
          </div>
        ) : null}
        {filtered.map((t) => (
          <div key={t.id} className="rounded-xl border border-white/10 bg-white/5 p-5">
            <div className="text-sm text-white/60">{t.category}</div>
            <div className="mt-2 text-lg font-semibold">{t.name}</div>
            <div className="mt-4 h-24 overflow-hidden rounded-lg bg-gradient-to-br from-white/10 to-transparent">
              {t.__featured_preview_src || t.preview_image_url ? (
                <img
                  src={t.__featured_preview_src ? t.__featured_preview_src : `${ASSET_BASE_URL}${t.preview_image_url}`}
                  alt={`${t.name} preview`}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => openPreview(t.id)}
              className="mt-4 w-full rounded-md bg-white/10 px-3 py-2 text-sm font-medium hover:bg-white/15"
            >
              Preview
            </button>
            <button
              type="button"
              onClick={() => {
                if (!accessToken) {
                  nav('/login');
                  return;
                }
                nav(`/dashboard?templateId=${t.id}`);
              }}
              className="mt-5 w-full rounded-md bg-indigo-500 px-3 py-2 text-sm font-medium hover:bg-indigo-400"
            >
              Use template
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
