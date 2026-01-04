/**
 * Main Builder Component
 * Elementor-style website builder with drag-and-drop, inline editing, and live preview
 */

import { useEffect, useCallback, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { BuilderProvider, useBuilder, generateId } from './store/builderStore.jsx';
import { BuilderHeader } from './components/BuilderHeader';
import { LeftPanel } from './components/LeftPanel';
import { RightPanel } from './components/RightPanel';
import { Canvas } from './components/Canvas';

// Main Builder wrapper with provider
export function Builder() {
  const { id } = useParams();
  const websiteId = Number(id);
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [website, setWebsite] = useState(null);
  const [initialDocument, setInitialDocument] = useState(null);

  // Load website data
  useEffect(() => {
    if (!Number.isFinite(websiteId)) {
      setError('Invalid website ID');
      setLoading(false);
      return;
    }

    async function loadWebsite() {
      try {
        setLoading(true);
        setError(null);
        
        const { data } = await api.get(`/websites/${websiteId}/builder`);
        
        // Store website with pages included
        setWebsite({ ...data.website, pages: data.pages });
        
        // Transform backend data to builder document format
        const document = transformBackendToDocument(data.pages);
        setInitialDocument(document);
        
      } catch (err) {
        console.error('Failed to load website:', err);
        setError(err?.response?.data?.error?.message || 'Failed to load website');
      } finally {
        setLoading(false);
      }
    }

    loadWebsite();
  }, [websiteId]);

  if (loading) {
    return (
      <div className="h-screen bg-[#0f0f1a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <div className="text-white/60">Loading builder...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen bg-[#0f0f1a] flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-4xl mb-4">⚠️</div>
          <div className="text-xl font-semibold mb-2">Failed to Load</div>
          <div className="text-white/60 mb-6">{error}</div>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-6 py-2 bg-indigo-500 hover:bg-indigo-400 rounded-lg font-medium transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <BuilderProvider initialDocument={initialDocument}>
      <BuilderContent 
        websiteId={websiteId} 
        website={website}
        setWebsite={setWebsite}
      />
    </BuilderProvider>
  );
}

// Inner builder content with access to builder context
function BuilderContent({ websiteId, website, setWebsite }) {
  const { state, actions } = useBuilder();
  const navigate = useNavigate();

  // Set theme from website settings when website loads
  useEffect(() => {
    if (website?.settings?.designSystem?.colors) {
      const colors = website.settings.designSystem.colors;
      actions.setTheme({
        primary: colors.primary || '#6366f1',
        secondary: colors.secondary || '#8b5cf6',
        background: colors.background || '#0a0a12',
        text: colors.text || '#ffffff',
        mutedText: colors.mutedText || 'rgba(255,255,255,0.7)',
      });
    } else if (website?.settings?.theme) {
      actions.setTheme({
        primary: website.settings.theme.primary || '#6366f1',
        background: website.settings.theme.background || '#0a0a12',
      });
    }
  }, [website?.settings, actions]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Undo: Ctrl+Z
      if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        actions.undo();
      }
      // Redo: Ctrl+Y or Ctrl+Shift+Z
      if ((e.ctrlKey && e.key === 'y') || (e.ctrlKey && e.shiftKey && e.key === 'z')) {
        e.preventDefault();
        actions.redo();
      }
      // Save: Ctrl+S
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
      // Delete: Delete or Backspace
      if ((e.key === 'Delete' || e.key === 'Backspace') && state.selection.id) {
        // Only delete if not editing text
        if (!document.activeElement?.isContentEditable && 
            document.activeElement?.tagName !== 'INPUT' && 
            document.activeElement?.tagName !== 'TEXTAREA') {
          e.preventDefault();
          handleDelete();
        }
      }
      // Escape: Clear selection
      if (e.key === 'Escape') {
        actions.clearSelection();
      }
      // Duplicate: Ctrl+D
      if (e.ctrlKey && e.key === 'd') {
        e.preventDefault();
        handleDuplicate();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.selection, actions]);

  // Unsaved changes warning
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (state.saving.hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [state.saving.hasUnsavedChanges]);

  // Handle drag end globally
  useEffect(() => {
    const handleDragEnd = () => {
      if (state.drag.isDragging) {
        actions.endDrag();
      }
    };

    window.addEventListener('dragend', handleDragEnd);
    return () => window.removeEventListener('dragend', handleDragEnd);
  }, [state.drag.isDragging, actions]);

  const handleSave = useCallback(async () => {
    if (state.saving.isSaving) return;

    actions.setSaving(true);

    try {
      // Transform document to backend format
      const pages = transformDocumentToBackend(state.document, website);

      const { data } = await api.put(`/websites/${websiteId}/builder`, { pages });
      
      // Update website with the response data (includes pages)
      if (data.website && data.pages) {
        setWebsite({ ...data.website, pages: data.pages });
      } else if (data.pages) {
        setWebsite(prev => ({ ...prev, pages: data.pages }));
      } else if (data.website) {
        setWebsite(prev => ({ ...prev, ...data.website }));
      }
      
      actions.markSaved();
      
    } catch (err) {
      console.error('Save failed:', err);
      alert(err?.response?.data?.error?.message || 'Failed to save');
    } finally {
      actions.setSaving(false);
    }
  }, [websiteId, state.document, state.saving.isSaving, website, actions, setWebsite]);

  const handlePreview = useCallback(async () => {
    // Save first if there are unsaved changes
    if (state.saving.hasUnsavedChanges) {
      actions.setSaving(true);
      try {
        const pages = transformDocumentToBackend(state.document, website);
        const { data } = await api.put(`/websites/${websiteId}/builder`, { pages });
        if (data.website) setWebsite(data.website);
        actions.markSaved();
      } catch (err) {
        console.error('Save before preview failed:', err);
      } finally {
        actions.setSaving(false);
      }
    }
    // Open preview in new tab
    window.open(`/draft-preview/${websiteId}`, '_blank');
  }, [websiteId, state.saving.hasUnsavedChanges, state.document, website, actions, setWebsite]);

  const handleDelete = useCallback(() => {
    const { selection } = state;
    if (!selection.id) return;

    if (selection.type === 'widget') {
      actions.deleteWidget(selection.sectionId, selection.columnId, selection.id);
    } else if (selection.type === 'column') {
      actions.deleteColumn(selection.sectionId, selection.columnId);
    } else if (selection.type === 'section') {
      actions.deleteSection(selection.sectionId);
    }
  }, [state.selection, actions]);

  const handleDuplicate = useCallback(() => {
    const { selection } = state;
    if (!selection.id) return;

    if (selection.type === 'widget') {
      actions.duplicateWidget(selection.sectionId, selection.columnId, selection.id);
    } else if (selection.type === 'section') {
      actions.duplicateSection(selection.sectionId);
    }
  }, [state.selection, actions]);

  return (
    <div className="h-screen bg-[#0f0f1a] flex flex-col overflow-hidden">
      {/* Header */}
      <BuilderHeader
        websiteId={websiteId}
        websiteName={website?.name}
        websiteSeo={website?.seo}
        onSave={handleSave}
        onPreview={handlePreview}
        onVersionRestore={() => window.location.reload()}
      />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Widgets & Navigator */}
        <LeftPanel />

        {/* Canvas */}
        <Canvas />

        {/* Right Panel - Inspector */}
        <RightPanel />
      </div>
    </div>
  );
}

/**
 * Transform backend pages data to builder document format
 */
function transformBackendToDocument(pages) {
  if (!pages || pages.length === 0) {
    return { sections: [] };
  }

  // Get the first page's builder data
  const page = pages[0];
  const builder = page?.builder;

  if (!builder?.root) {
    return { sections: [] };
  }

  // Extract sections from the builder tree
  const sections = [];
  
  function extractSections(node) {
    if (!node) return;

    if (node.type === 'SECTION') {
      const section = {
        id: node.id || generateId(),
        type: 'section',
        settings: node.settings || {},
        style: node.style || {},
        responsiveStyle: node.responsiveStyle || {},
        columns: [],
      };

      // Extract columns
      const children = Array.isArray(node.children) ? node.children : [];
      for (const child of children) {
        if (child.type === 'CONTAINER') {
          // Container has columns as children
          const containerChildren = Array.isArray(child.children) ? child.children : [];
          for (const colNode of containerChildren) {
            if (colNode.type === 'COLUMN') {
              const column = {
                id: colNode.id || generateId(),
                type: 'column',
                width: colNode.width || Math.floor(100 / containerChildren.length),
                settings: colNode.settings || {},
                style: colNode.style || {},
                responsiveStyle: colNode.responsiveStyle || {},
                widgets: [],
              };

              // Extract widgets
              const colChildren = Array.isArray(colNode.children) ? colNode.children : [];
              for (const widgetNode of colChildren) {
                if (widgetNode.type === 'WIDGET') {
                  column.widgets.push({
                    id: widgetNode.id || generateId(),
                    type: 'widget',
                    widgetType: widgetNode.widgetType,
                    content: widgetNode.props || {},
                    style: widgetNode.style || {},
                    responsiveStyle: widgetNode.responsiveStyle || {},
                    settings: widgetNode.settings || {},
                  });
                }
              }

              section.columns.push(column);
            }
          }
        } else if (child.type === 'COLUMN') {
          // Direct column child
          const column = {
            id: child.id || generateId(),
            type: 'column',
            width: child.width || 100,
            settings: child.settings || {},
            style: child.style || {},
            responsiveStyle: child.responsiveStyle || {},
            widgets: [],
          };

          const colChildren = Array.isArray(child.children) ? child.children : [];
          for (const widgetNode of colChildren) {
            if (widgetNode.type === 'WIDGET') {
              column.widgets.push({
                id: widgetNode.id || generateId(),
                type: 'widget',
                widgetType: widgetNode.widgetType,
                content: widgetNode.props || {},
                style: widgetNode.style || {},
                responsiveStyle: widgetNode.responsiveStyle || {},
                settings: widgetNode.settings || {},
              });
            }
          }

          section.columns.push(column);
        }
      }

      // Ensure at least one column
      if (section.columns.length === 0) {
        section.columns.push({
          id: generateId(),
          type: 'column',
          width: 100,
          settings: {},
          style: {},
          responsiveStyle: {},
          widgets: [],
        });
      }

      sections.push(section);
    }

    // Recurse into children
    const children = Array.isArray(node.children) ? node.children : [];
    for (const child of children) {
      extractSections(child);
    }
  }

  extractSections(builder.root);

  return { sections };
}

/**
 * Transform builder document to backend format
 */
function transformDocumentToBackend(document, website) {
  const sections = document?.sections || [];

  // Build the tree structure
  const root = {
    id: generateId(),
    type: 'ROOT',
    children: sections.map(section => ({
      id: section.id,
      type: 'SECTION',
      props: section.settings || {},
      style: section.style || {},
      responsive: section.responsiveStyle || {},
      children: [{
        id: generateId(),
        type: 'CONTAINER',
        props: { width: section.settings?.contentWidth || 'boxed' },
        style: {},
        responsive: {},
        children: (section.columns || []).map(column => ({
          id: column.id,
          type: 'COLUMN',
          props: { width: column.width || 12 },
          style: column.style || {},
          responsive: column.responsiveStyle || {},
          children: (column.widgets || []).map(widget => ({
            id: widget.id,
            type: 'WIDGET',
            widgetType: widget.widgetType,
            props: widget.content || {},
            style: widget.style || {},
            responsive: widget.responsiveStyle || {},
            children: [],
          })),
        })),
      }],
    })),
  };

  // Get the actual page from website data
  const existingPage = website?.pages?.[0];
  const pageId = existingPage?.id;
  
  if (!pageId) {
    console.warn('No page ID found in website data, save may fail');
  }

  // Return pages array with the builder structure
  return [{
    id: pageId,
    name: existingPage?.name || 'Home',
    path: existingPage?.path || '/',
    sortOrder: existingPage?.sortOrder ?? 0,
    meta: existingPage?.meta || {},
    builder: { version: 1, root },
  }];
}

export default Builder;
