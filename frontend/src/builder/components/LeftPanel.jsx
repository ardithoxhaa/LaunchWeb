/**
 * Left Panel Component
 * Contains widgets library, navigator, and global settings
 */

import { useState, useCallback } from 'react';
import { useBuilder } from '../store/builderStore.jsx';
import { WIDGETS, WIDGET_CATEGORIES, getWidgetsByCategory } from '../widgets/widgetRegistry';
import { api } from '../../lib/api';

export function LeftPanel({ websiteId, pages, currentPageIndex, onPageChange, onPagesUpdate }) {
  const { state, actions } = useBuilder();
  const { ui, document, selection } = state;
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="w-[300px] bg-[#1e1e2d] border-r border-white/10 flex flex-col h-full">
      {/* Panel Tabs */}
      <div className="flex border-b border-white/10">
        <PanelTab
          active={ui.leftPanelTab === 'widgets'}
          onClick={() => actions.setLeftPanelTab('widgets')}
          icon="⊞"
          label="Widgets"
        />
        <PanelTab
          active={ui.leftPanelTab === 'pages'}
          onClick={() => actions.setLeftPanelTab('pages')}
          icon="📄"
          label="Pages"
        />
        <PanelTab
          active={ui.leftPanelTab === 'navigator'}
          onClick={() => actions.setLeftPanelTab('navigator')}
          icon="☰"
          label="Navigator"
        />
      </div>

      {/* Panel Content */}
      <div className="flex-1 overflow-auto">
        {ui.leftPanelTab === 'widgets' && (
          <WidgetsPanel searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        )}
        {ui.leftPanelTab === 'pages' && (
          <PagesPanel 
            websiteId={websiteId}
            pages={pages}
            currentPageIndex={currentPageIndex}
            onPageChange={onPageChange}
            onPagesUpdate={onPagesUpdate}
          />
        )}
        {ui.leftPanelTab === 'navigator' && (
          <NavigatorPanel />
        )}
      </div>
    </div>
  );
}

function PanelTab({ active, onClick, icon, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex-1 flex items-center justify-center gap-2 py-3 text-xs font-medium transition-colors
        ${active 
          ? 'bg-indigo-500/20 text-indigo-400 border-b-2 border-indigo-500' 
          : 'text-white/60 hover:text-white/80 hover:bg-white/5'
        }
      `}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  );
}

function WidgetsPanel({ searchQuery, onSearchChange }) {
  const { actions } = useBuilder();

  const handleDragStart = useCallback((e, widgetType) => {
    e.dataTransfer.effectAllowed = 'copy';
    actions.startDrag({
      dragType: 'new-widget',
      dragId: null,
      dragData: { widgetType },
    });
  }, [actions]);

  const filteredWidgets = Object.values(WIDGETS).filter(widget =>
    widget.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    widget.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = Object.values(WIDGET_CATEGORIES);

  return (
    <div className="p-4 space-y-4">
      {/* Search */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search widgets..."
          className="w-full px-4 py-2.5 pl-10 rounded-lg bg-white/5 border border-white/10 text-sm placeholder:text-white/40 focus:border-indigo-500 focus:outline-none"
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">🔍</span>
      </div>

      {/* Quick Add Section */}
      <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
        <div className="text-xs font-medium text-indigo-400 mb-2">Quick Add</div>
        <button
          type="button"
          onClick={() => actions.addSection({})}
          className="w-full py-2 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-sm font-medium transition-colors"
        >
          + Add Section
        </button>
      </div>

      {/* Widget Categories */}
      {searchQuery ? (
        <div className="space-y-2">
          <div className="text-xs font-medium text-white/50 uppercase tracking-wide">
            Search Results ({filteredWidgets.length})
          </div>
          <div className="grid grid-cols-3 gap-2">
            {filteredWidgets.map(widget => (
              <WidgetItem
                key={widget.type}
                widget={widget}
                onDragStart={handleDragStart}
              />
            ))}
          </div>
        </div>
      ) : (
        categories.map(category => {
          const widgets = getWidgetsByCategory(category);
          if (widgets.length === 0) return null;

          return (
            <WidgetCategory
              key={category}
              title={category}
              widgets={widgets}
              onDragStart={handleDragStart}
            />
          );
        })
      )}
    </div>
  );
}

function WidgetCategory({ title, widgets, onDragStart }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="rounded-xl border border-white/10 overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2.5 flex items-center justify-between bg-white/5 hover:bg-white/10 transition-colors"
      >
        <span className="text-xs font-semibold uppercase tracking-wide">{title}</span>
        <span className="text-white/40 text-xs">{isOpen ? '▾' : '▸'}</span>
      </button>
      {isOpen && (
        <div className="p-2 grid grid-cols-3 gap-2">
          {widgets.map(widget => (
            <WidgetItem
              key={widget.type}
              widget={widget}
              onDragStart={onDragStart}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function WidgetItem({ widget, onDragStart }) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, widget.type)}
      className="flex flex-col items-center gap-1.5 p-3 rounded-lg bg-white/5 hover:bg-white/10 cursor-grab active:cursor-grabbing transition-colors border border-transparent hover:border-white/10"
    >
      <span className="text-xl">{widget.icon}</span>
      <span className="text-[10px] text-white/70 text-center leading-tight">{widget.name}</span>
    </div>
  );
}

function PagesPanel({ websiteId, pages, currentPageIndex, onPageChange, onPagesUpdate }) {
  const [showAddPage, setShowAddPage] = useState(false);
  const [newPageName, setNewPageName] = useState('');
  const [newPagePath, setNewPagePath] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState(null);
  
  // Edit page state
  const [editingPageId, setEditingPageId] = useState(null);
  const [editPageName, setEditPageName] = useState('');
  const [editPagePath, setEditPagePath] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editError, setEditError] = useState(null);

  const handleEditPage = useCallback(async (pageId) => {
    if (!editPageName.trim() || !editPagePath.trim()) {
      setEditError('Name and path are required');
      return;
    }

    const path = editPagePath.startsWith('/') ? editPagePath : `/${editPagePath}`;

    try {
      setIsEditing(true);
      setEditError(null);
      const { data } = await api.put(`/websites/${websiteId}/pages/${pageId}`, {
        name: editPageName.trim(),
        path: path.toLowerCase(),
      });
      
      // Update page in pages array
      const updatedPages = pages.map(p => p.id === pageId ? { ...p, name: editPageName.trim(), path: path.toLowerCase() } : p);
      onPagesUpdate(updatedPages);
      setEditingPageId(null);
      setEditPageName('');
      setEditPagePath('');
    } catch (err) {
      setEditError(err?.response?.data?.error?.message || 'Failed to update page');
    } finally {
      setIsEditing(false);
    }
  }, [websiteId, editPageName, editPagePath, pages, onPagesUpdate]);

  const startEditingPage = useCallback((page) => {
    setEditingPageId(page.id);
    setEditPageName(page.name);
    setEditPagePath(page.path);
    setEditError(null);
  }, []);

  const cancelEditingPage = useCallback(() => {
    setEditingPageId(null);
    setEditPageName('');
    setEditPagePath('');
    setEditError(null);
  }, []);

  const handleAddPage = useCallback(async () => {
    if (!newPageName.trim() || !newPagePath.trim()) {
      setError('Name and path are required');
      return;
    }

    const path = newPagePath.startsWith('/') ? newPagePath : `/${newPagePath}`;

    try {
      setIsAdding(true);
      setError(null);
      const { data } = await api.post(`/websites/${websiteId}/pages`, {
        name: newPageName.trim(),
        path: path.toLowerCase(),
      });
      
      // Add new page to pages array
      onPagesUpdate([...pages, data.page]);
      setShowAddPage(false);
      setNewPageName('');
      setNewPagePath('');
    } catch (err) {
      setError(err?.response?.data?.error?.message || 'Failed to add page');
    } finally {
      setIsAdding(false);
    }
  }, [websiteId, newPageName, newPagePath, pages, onPagesUpdate]);

  const handleDeletePage = useCallback(async (pageId) => {
    if (pages.length <= 1) {
      alert('Cannot delete the last page');
      return;
    }

    if (!confirm('Are you sure you want to delete this page?')) {
      return;
    }

    try {
      await api.delete(`/websites/${websiteId}/pages/${pageId}`);
      const newPages = pages.filter(p => p.id !== pageId);
      onPagesUpdate(newPages);
      
      // If we deleted the current page, switch to the first page
      if (pages[currentPageIndex]?.id === pageId) {
        onPageChange(0);
      }
    } catch (err) {
      alert(err?.response?.data?.error?.message || 'Failed to delete page');
    }
  }, [websiteId, pages, currentPageIndex, onPageChange, onPagesUpdate]);

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs font-medium text-white/50 uppercase tracking-wide">
          Pages ({pages.length})
        </div>
        <button
          type="button"
          onClick={() => setShowAddPage(true)}
          className="text-xs px-2 py-1 rounded bg-indigo-500 hover:bg-indigo-400 transition-colors"
        >
          + Add
        </button>
      </div>

      {/* Add Page Form */}
      {showAddPage && (
        <div className="mb-4 p-3 rounded-xl border border-white/10 bg-white/5">
          <div className="text-xs font-medium mb-2">Add New Page</div>
          {error && (
            <div className="mb-2 text-xs text-red-400">{error}</div>
          )}
          <input
            type="text"
            value={newPageName}
            onChange={(e) => setNewPageName(e.target.value)}
            placeholder="Page name (e.g., About)"
            className="w-full mb-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm focus:border-indigo-500 focus:outline-none"
          />
          <input
            type="text"
            value={newPagePath}
            onChange={(e) => setNewPagePath(e.target.value)}
            placeholder="Path (e.g., /about)"
            className="w-full mb-3 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm focus:border-indigo-500 focus:outline-none"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleAddPage}
              disabled={isAdding}
              className="flex-1 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-sm font-medium transition-colors disabled:opacity-50"
            >
              {isAdding ? 'Adding...' : 'Add Page'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowAddPage(false);
                setNewPageName('');
                setNewPagePath('');
                setError(null);
              }}
              className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-sm transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Pages List */}
      <div className="space-y-1">
        {pages.map((page, index) => (
          <div key={page.id}>
            {editingPageId === page.id ? (
              /* Edit Page Form */
              <div className="p-3 rounded-xl border border-indigo-500/30 bg-indigo-500/10">
                <div className="text-xs font-medium mb-2">Edit Page</div>
                {editError && (
                  <div className="mb-2 text-xs text-red-400">{editError}</div>
                )}
                <input
                  type="text"
                  value={editPageName}
                  onChange={(e) => setEditPageName(e.target.value)}
                  placeholder="Page name"
                  className="w-full mb-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm focus:border-indigo-500 focus:outline-none"
                />
                <input
                  type="text"
                  value={editPagePath}
                  onChange={(e) => setEditPagePath(e.target.value)}
                  placeholder="Path (e.g., /about)"
                  className="w-full mb-3 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm focus:border-indigo-500 focus:outline-none"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleEditPage(page.id)}
                    disabled={isEditing}
                    className="flex-1 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    {isEditing ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    type="button"
                    onClick={cancelEditingPage}
                    className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-sm transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              /* Page Item */
              <div
                className={`
                  group flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer transition-colors
                  ${index === currentPageIndex 
                    ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' 
                    : 'hover:bg-white/5 border border-transparent'
                  }
                `}
                onClick={() => onPageChange(index)}
              >
                <span className="text-lg">📄</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{page.name}</div>
                  <div className="text-xs text-white/40 truncate">{page.path}</div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      startEditingPage(page);
                    }}
                    className="w-6 h-6 rounded flex items-center justify-center text-white/40 hover:text-indigo-400 hover:bg-indigo-500/20"
                    title="Edit page"
                  >
                    ✎
                  </button>
                  {pages.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePage(page.id);
                      }}
                      className="w-6 h-6 rounded flex items-center justify-center text-white/40 hover:text-red-400 hover:bg-red-500/20"
                      title="Delete page"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {pages.length === 0 && (
        <div className="text-center py-8 text-white/40 text-sm">
          <div className="text-2xl mb-2">📄</div>
          <div>No pages yet</div>
        </div>
      )}
    </div>
  );
}

function NavigatorPanel() {
  const { state, actions } = useBuilder();
  const { document, selection } = state;

  return (
    <div className="p-4">
      <div className="text-xs font-medium text-white/50 uppercase tracking-wide mb-3">
        Page Structure
      </div>

      {document.sections.length === 0 ? (
        <div className="text-center py-8 text-white/40 text-sm">
          <div className="text-2xl mb-2">📄</div>
          <div>No sections yet</div>
          <div className="text-xs mt-1">Add a section to get started</div>
        </div>
      ) : (
        <div className="space-y-1">
          {document.sections.map((section, sectionIndex) => (
            <NavigatorSection
              key={section.id}
              section={section}
              index={sectionIndex}
              isSelected={selection.sectionId === section.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function NavigatorSection({ section, index, isSelected }) {
  const { state, actions } = useBuilder();
  const { selection } = state;
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="rounded-lg overflow-hidden">
      {/* Section Row */}
      <div
        className={`
          flex items-center gap-2 px-2 py-1.5 cursor-pointer transition-colors
          ${isSelected && selection.type === 'section' 
            ? 'bg-indigo-500/20 text-indigo-400' 
            : 'hover:bg-white/5'
          }
        `}
        onClick={() => actions.selectSection(section.id)}
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          className="w-4 h-4 flex items-center justify-center text-white/40 hover:text-white/60"
        >
          {isExpanded ? '▾' : '▸'}
        </button>
        <span className="text-white/60">⊞</span>
        <span className="text-xs font-medium flex-1">Section {index + 1}</span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            actions.deleteSection(section.id);
          }}
          className="w-5 h-5 rounded flex items-center justify-center text-white/40 hover:text-red-400 hover:bg-red-500/20 opacity-0 group-hover:opacity-100"
        >
          ✕
        </button>
      </div>

      {/* Columns */}
      {isExpanded && (
        <div className="ml-4 border-l border-white/10">
          {section.columns.map((column, colIndex) => (
            <NavigatorColumn
              key={column.id}
              column={column}
              section={section}
              index={colIndex}
              isSelected={selection.columnId === column.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function NavigatorColumn({ column, section, index, isSelected }) {
  const { state, actions } = useBuilder();
  const { selection } = state;
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div>
      {/* Column Row */}
      <div
        className={`
          flex items-center gap-2 px-2 py-1.5 cursor-pointer transition-colors
          ${isSelected && selection.type === 'column' 
            ? 'bg-cyan-500/20 text-cyan-400' 
            : 'hover:bg-white/5'
          }
        `}
        onClick={() => actions.selectColumn(section.id, column.id)}
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          className="w-4 h-4 flex items-center justify-center text-white/40 hover:text-white/60"
        >
          {column.widgets.length > 0 ? (isExpanded ? '▾' : '▸') : '○'}
        </button>
        <span className="text-white/60">▢</span>
        <span className="text-xs flex-1">Column {index + 1}</span>
        <span className="text-[10px] text-white/40">{column.width}%</span>
      </div>

      {/* Widgets */}
      {isExpanded && column.widgets.length > 0 && (
        <div className="ml-4 border-l border-white/10">
          {column.widgets.map((widget, widgetIndex) => (
            <NavigatorWidget
              key={widget.id}
              widget={widget}
              section={section}
              column={column}
              index={widgetIndex}
              isSelected={selection.id === widget.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function NavigatorWidget({ widget, section, column, index, isSelected }) {
  const { actions } = useBuilder();
  const widgetDef = WIDGETS[widget.widgetType];

  return (
    <div
      className={`
        flex items-center gap-2 px-2 py-1.5 cursor-pointer transition-colors
        ${isSelected 
          ? 'bg-emerald-500/20 text-emerald-400' 
          : 'hover:bg-white/5'
        }
      `}
      onClick={() => actions.selectWidget(section.id, column.id, widget.id)}
    >
      <span className="w-4" />
      <span className="text-white/60">{widgetDef?.icon || '▢'}</span>
      <span className="text-xs flex-1">{widgetDef?.name || widget.widgetType}</span>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          actions.deleteWidget(section.id, column.id, widget.id);
        }}
        className="w-5 h-5 rounded flex items-center justify-center text-white/40 hover:text-red-400 hover:bg-red-500/20"
      >
        ✕
      </button>
    </div>
  );
}

