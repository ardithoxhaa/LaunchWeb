/**
 * SEO Editor Component
 * Edit SEO settings for the website
 */

import { useState, useEffect, useCallback } from 'react';
import { api } from '../../lib/api';

export function SeoEditor({ websiteId, initialSeo, onSave, onClose, onSeoUpdate }) {
  const [seo, setSeo] = useState({
    title: '',
    description: '',
    keywords: '',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    twitterCard: 'summary_large_image',
    canonicalUrl: '',
    robots: 'index, follow',
    ...initialSeo,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('basic');

  const handleChange = useCallback((key, value) => {
    setSeo(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleSave = useCallback(async () => {
    try {
      setSaving(true);
      setError(null);
      const { data } = await api.put(`/websites/${websiteId}/seo`, { seo });
      // Update parent with new SEO data
      if (data?.website?.seo) {
        onSeoUpdate?.(data.website.seo);
      } else {
        onSeoUpdate?.(seo);
      }
      onSave?.(seo);
      onClose?.();
    } catch (err) {
      setError(err?.response?.data?.error?.message || 'Failed to save SEO settings');
    } finally {
      setSaving(false);
    }
  }, [websiteId, seo, onSave, onClose, onSeoUpdate]);

  const titleLength = (seo.title || '').length;
  const descLength = (seo.description || '').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-[#1e1e2d] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold">SEO Settings</h2>
            <p className="text-sm text-white/60">Optimize your website for search engines</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10">
          <TabButton active={activeTab === 'basic'} onClick={() => setActiveTab('basic')}>
            Basic SEO
          </TabButton>
          <TabButton active={activeTab === 'social'} onClick={() => setActiveTab('social')}>
            Social Media
          </TabButton>
          <TabButton active={activeTab === 'advanced'} onClick={() => setActiveTab('advanced')}>
            Advanced
          </TabButton>
        </div>

        {/* Content */}
        <div className="max-h-[60vh] overflow-auto p-6">
          {error && (
            <div className="mb-4 rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {activeTab === 'basic' && (
            <div className="space-y-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">Page Title</label>
                  <span className={`text-xs ${titleLength > 60 ? 'text-amber-400' : 'text-white/40'}`}>
                    {titleLength}/60
                  </span>
                </div>
                <input
                  type="text"
                  value={seo.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="Your page title"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none"
                />
                <p className="mt-1.5 text-xs text-white/40">
                  Appears in browser tabs and search results. Keep under 60 characters.
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">Meta Description</label>
                  <span className={`text-xs ${descLength > 160 ? 'text-amber-400' : 'text-white/40'}`}>
                    {descLength}/160
                  </span>
                </div>
                <textarea
                  value={seo.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Brief description of your page"
                  rows={3}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none resize-none"
                />
                <p className="mt-1.5 text-xs text-white/40">
                  Shown in search results. Keep under 160 characters for best display.
                </p>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Keywords</label>
                <input
                  type="text"
                  value={seo.keywords}
                  onChange={(e) => handleChange('keywords', e.target.value)}
                  placeholder="keyword1, keyword2, keyword3"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none"
                />
                <p className="mt-1.5 text-xs text-white/40">
                  Comma-separated keywords. Less important for modern SEO but still used by some engines.
                </p>
              </div>

              {/* Preview */}
              <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                <div className="text-xs text-white/40 mb-3">Search Preview</div>
                <div className="space-y-1">
                  <div className="text-indigo-400 text-base truncate">
                    {seo.title || 'Page Title'}
                  </div>
                  <div className="text-green-400 text-xs">
                    https://yoursite.com/page
                  </div>
                  <div className="text-white/60 text-sm line-clamp-2">
                    {seo.description || 'Your meta description will appear here...'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'social' && (
            <div className="space-y-5">
              <div className="rounded-xl border border-white/10 bg-indigo-500/10 p-4">
                <div className="text-sm font-medium text-indigo-400">Open Graph & Twitter Cards</div>
                <p className="mt-1 text-xs text-white/60">
                  Control how your page appears when shared on social media platforms.
                </p>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">OG Title</label>
                <input
                  type="text"
                  value={seo.ogTitle}
                  onChange={(e) => handleChange('ogTitle', e.target.value)}
                  placeholder="Title for social sharing (defaults to page title)"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">OG Description</label>
                <textarea
                  value={seo.ogDescription}
                  onChange={(e) => handleChange('ogDescription', e.target.value)}
                  placeholder="Description for social sharing"
                  rows={2}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">OG Image URL</label>
                <input
                  type="text"
                  value={seo.ogImage}
                  onChange={(e) => handleChange('ogImage', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none"
                />
                <p className="mt-1.5 text-xs text-white/40">
                  Recommended size: 1200x630 pixels for best display on all platforms.
                </p>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Twitter Card Type</label>
                <select
                  value={seo.twitterCard}
                  onChange={(e) => handleChange('twitterCard', e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none"
                >
                  <option value="summary">Summary</option>
                  <option value="summary_large_image">Summary with Large Image</option>
                  <option value="app">App</option>
                  <option value="player">Player</option>
                </select>
              </div>

              {/* Social Preview */}
              <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                <div className="text-xs text-white/40 mb-3">Social Media Preview</div>
                <div className="rounded-lg border border-white/10 overflow-hidden">
                  <div className="aspect-video bg-white/5 flex items-center justify-center">
                    {seo.ogImage ? (
                      <img src={seo.ogImage} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white/20 text-sm">No image set</span>
                    )}
                  </div>
                  <div className="p-3 bg-white/5">
                    <div className="text-sm font-medium truncate">
                      {seo.ogTitle || seo.title || 'Page Title'}
                    </div>
                    <div className="text-xs text-white/60 mt-1 line-clamp-2">
                      {seo.ogDescription || seo.description || 'Description...'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'advanced' && (
            <div className="space-y-5">
              <div>
                <label className="text-sm font-medium mb-2 block">Canonical URL</label>
                <input
                  type="text"
                  value={seo.canonicalUrl}
                  onChange={(e) => handleChange('canonicalUrl', e.target.value)}
                  placeholder="https://example.com/preferred-url"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none"
                />
                <p className="mt-1.5 text-xs text-white/40">
                  The preferred URL for this page. Helps prevent duplicate content issues.
                </p>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Robots Meta Tag</label>
                <select
                  value={seo.robots}
                  onChange={(e) => handleChange('robots', e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none"
                >
                  <option value="index, follow">Index, Follow (Default)</option>
                  <option value="index, nofollow">Index, No Follow</option>
                  <option value="noindex, follow">No Index, Follow</option>
                  <option value="noindex, nofollow">No Index, No Follow</option>
                </select>
                <p className="mt-1.5 text-xs text-white/40">
                  Controls how search engines crawl and index this page.
                </p>
              </div>

              <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4">
                <div className="flex items-start gap-3">
                  <span className="text-amber-400">⚠️</span>
                  <div>
                    <div className="text-sm font-medium text-amber-400">Advanced Settings</div>
                    <p className="mt-1 text-xs text-white/60">
                      Only change these settings if you understand their impact on search engine visibility.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 px-6 py-4">
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-white/10 px-4 py-2 text-sm font-medium hover:bg-white/15 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={handleSave}
              className={`
                rounded-lg px-4 py-2 text-sm font-medium transition-colors
                ${saving
                  ? 'bg-indigo-500/50 cursor-wait'
                  : 'bg-indigo-500 hover:bg-indigo-400'
                }
              `}
            >
              {saving ? 'Saving...' : 'Save SEO Settings'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex-1 py-3 text-sm font-medium transition-colors
        ${active
          ? 'bg-white/5 text-white border-b-2 border-indigo-500'
          : 'text-white/60 hover:text-white/80 hover:bg-white/5'
        }
      `}
    >
      {children}
    </button>
  );
}
