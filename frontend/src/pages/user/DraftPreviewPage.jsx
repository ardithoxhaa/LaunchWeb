import { useEffect, useMemo, useState } from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import { api } from '../../lib/api.js';
import { SiteRenderer } from '../../components/website/SiteRenderer.jsx';

export function DraftPreviewPage() {
  const { id } = useParams();
  const websiteId = Number(id);
  const location = useLocation();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Calculate active path for multi-page support
  const activePath = useMemo(() => {
    const prefix = `/draft-preview/${id}`;
    const rest = id && location.pathname.startsWith(prefix) ? location.pathname.slice(prefix.length) : location.pathname;
    const p = rest && rest.length ? rest : '/';
    return p === '' ? '/' : p;
  }, [location.pathname, id]);

  // Find active page index based on path
  const activePageIndex = useMemo(() => {
    const pages = data?.pages ?? [];
    const idx = pages.findIndex((p) => String(p?.path) === String(activePath));
    return idx >= 0 ? idx : 0;
  }, [activePath, data?.pages]);

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
          <div className="text-white/60 mb-6">{error}</div>
          <Link
            to={`/builder/${websiteId}`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-500 hover:bg-indigo-400 rounded-lg font-medium transition-colors"
          >
            ← Back to Builder
          </Link>
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

  // If no pages exist
  if (!data.pages || data.pages.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a12] flex items-center justify-center text-white">
        <div className="text-center">
          <div className="text-4xl mb-4">📄</div>
          <div className="text-xl mb-2">No pages found</div>
          <div className="text-white/60 text-sm mb-6">This website has no pages yet.</div>
          <Link
            to={`/builder/${websiteId}`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-500 hover:bg-indigo-400 rounded-lg font-medium transition-colors"
          >
            ← Back to Builder
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <SiteRenderer
        pages={data.pages}
        activePageIndex={activePageIndex}
        theme={data.website?.settings?.theme}
        designSystem={data.website?.settings?.designSystem}
        linkBasePath={`/draft-preview/${id}`}
      />
    </div>
  );
}
