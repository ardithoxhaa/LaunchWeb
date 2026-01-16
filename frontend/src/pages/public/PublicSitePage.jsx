/**
 * Public Site Page
 * Renders a published website at /site/:slug
 */

import { useEffect, useMemo, useState } from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import { api } from '../../lib/api.js';
import { SiteRenderer } from '../../components/website/SiteRenderer.jsx';
import { WebsiteAnalytics } from '../../lib/analytics.js';

export function PublicSitePage() {
  const { slug } = useParams();
  const location = useLocation();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [websiteId, setWebsiteId] = useState(null);

  const activePath = useMemo(() => {
    const prefix = `/site/${slug}`;
    const rest = slug && location.pathname.startsWith(prefix) ? location.pathname.slice(prefix.length) : location.pathname;
    const p = rest && rest.length ? rest : '/';
    return p === '' ? '/' : p;
  }, [location.pathname, slug]);

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
        const { data: payload } = await api.get(`/public/websites/${slug}/structure`);
        if (!canceled) setData(payload);
      } catch (err) {
        if (!canceled) {
          const status = err?.response?.status;
          if (status === 404) {
            setError({ type: 'not_found', message: 'Website not found or not published' });
          } else {
            setError({ type: 'error', message: err?.response?.data?.error?.message ?? 'Failed to load website' });
          }
        }
      } finally {
        if (!canceled) setLoading(false);
      }
    }

    if (slug) load();

    return () => {
      canceled = true;
    };
  }, [slug]);

    // Track page view analytics
  useEffect(() => {
    if (data?.website?.id && activePath) {
      const analytics = new WebsiteAnalytics(data.website.id);
      analytics.trackPageView(activePath);
    }
  }, [data?.website?.id, activePath]);

  // Update document title based on SEO
  useEffect(() => {
    if (data?.website?.seo?.title) {
      document.title = data.website.seo.title;
    } else if (data?.website?.name) {
      document.title = data.website.name;
    }
    
    // Update meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (data?.website?.seo?.description) {
      if (metaDesc) {
        metaDesc.setAttribute('content', data.website.seo.description);
      } else {
        const meta = document.createElement('meta');
        meta.name = 'description';
        meta.content = data.website.seo.description;
        document.head.appendChild(meta);
      }
    }

    return () => {
      document.title = 'LaunchWeb';
    };
  }, [data?.website]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a12] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <div className="text-white/60">Loading website...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a12] flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          {error.type === 'not_found' ? (
            <>
              <div className="text-6xl mb-4">🔍</div>
              <h1 className="text-2xl font-semibold mb-2">Website Not Found</h1>
              <p className="text-white/60 mb-6">
                This website doesn't exist or hasn't been published yet.
              </p>
            </>
          ) : (
            <>
              <div className="text-6xl mb-4">⚠️</div>
              <h1 className="text-2xl font-semibold mb-2">Something Went Wrong</h1>
              <p className="text-white/60 mb-6">{error.message}</p>
            </>
          )}
          <Link
            to="/home"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-500 hover:bg-indigo-400 rounded-lg font-medium text-white transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <SiteRenderer
        pages={data.pages}
        activePageIndex={activePageIndex}
        theme={data.website?.settings?.theme}
        designSystem={data.website?.settings?.designSystem}
        linkBasePath={`/site/${slug}`}
        isPublic={true}
        websiteId={data.website?.id}
      />
    </div>
  );
}
