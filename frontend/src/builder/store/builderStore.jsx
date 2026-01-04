/**
 * Builder State Management
 * Centralized state for the Elementor-style builder with undo/redo support
 */

import { createContext, useContext, useReducer, useCallback, useMemo } from 'react';

// Generate unique IDs
export function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Initial state
const initialState = {
  // Document structure
  document: {
    sections: [],
  },
  
  // Selection state
  selection: {
    type: null, // 'section' | 'column' | 'widget'
    id: null,
    sectionId: null,
    columnId: null,
  },
  
  // Viewport
  viewport: 'desktop', // 'desktop' | 'tablet' | 'mobile'
  
  // Drag state
  drag: {
    isDragging: false,
    dragType: null, // 'section' | 'column' | 'widget' | 'new-widget'
    dragId: null,
    dragData: null,
    dropTarget: null,
    dropPosition: null,
  },
  
  // History for undo/redo
  history: {
    past: [],
    future: [],
  },
  
  // UI state
  ui: {
    leftPanelTab: 'widgets', // 'widgets' | 'navigator' | 'settings'
    rightPanelTab: 'content', // 'content' | 'style' | 'advanced'
    showWelcome: false,
    zoom: 1,
  },
  
  // Saving state
  saving: {
    isSaving: false,
    hasUnsavedChanges: false,
    lastSaved: null,
  },
};

// Action types
const ActionTypes = {
  // Document actions
  SET_DOCUMENT: 'SET_DOCUMENT',
  ADD_SECTION: 'ADD_SECTION',
  UPDATE_SECTION: 'UPDATE_SECTION',
  DELETE_SECTION: 'DELETE_SECTION',
  MOVE_SECTION: 'MOVE_SECTION',
  DUPLICATE_SECTION: 'DUPLICATE_SECTION',
  
  ADD_COLUMN: 'ADD_COLUMN',
  UPDATE_COLUMN: 'UPDATE_COLUMN',
  DELETE_COLUMN: 'DELETE_COLUMN',
  
  ADD_WIDGET: 'ADD_WIDGET',
  UPDATE_WIDGET: 'UPDATE_WIDGET',
  DELETE_WIDGET: 'DELETE_WIDGET',
  MOVE_WIDGET: 'MOVE_WIDGET',
  DUPLICATE_WIDGET: 'DUPLICATE_WIDGET',
  
  // Selection actions
  SET_SELECTION: 'SET_SELECTION',
  CLEAR_SELECTION: 'CLEAR_SELECTION',
  
  // Viewport actions
  SET_VIEWPORT: 'SET_VIEWPORT',
  
  // Drag actions
  START_DRAG: 'START_DRAG',
  UPDATE_DRAG: 'UPDATE_DRAG',
  END_DRAG: 'END_DRAG',
  
  // History actions
  UNDO: 'UNDO',
  REDO: 'REDO',
  SAVE_HISTORY: 'SAVE_HISTORY',
  
  // UI actions
  SET_LEFT_PANEL_TAB: 'SET_LEFT_PANEL_TAB',
  SET_RIGHT_PANEL_TAB: 'SET_RIGHT_PANEL_TAB',
  SET_SHOW_WELCOME: 'SET_SHOW_WELCOME',
  SET_ZOOM: 'SET_ZOOM',
  
  // Saving actions
  SET_SAVING: 'SET_SAVING',
  SET_HAS_UNSAVED_CHANGES: 'SET_HAS_UNSAVED_CHANGES',
  MARK_SAVED: 'MARK_SAVED',
};

// Deep clone helper
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// Find section by ID
function findSection(sections, sectionId) {
  return sections.find(s => s.id === sectionId);
}

// Find column by ID within a section
function findColumn(section, columnId) {
  return section?.columns?.find(c => c.id === columnId);
}

// Find widget by ID within a column
function findWidget(column, widgetId) {
  return column?.widgets?.find(w => w.id === widgetId);
}

// Reducer
function builderReducer(state, action) {
  switch (action.type) {
    case ActionTypes.SET_DOCUMENT: {
      return {
        ...state,
        document: action.payload,
        saving: { ...state.saving, hasUnsavedChanges: false },
      };
    }
    
    case ActionTypes.ADD_SECTION: {
      const { section, index } = action.payload;
      const newSections = [...state.document.sections];
      const insertIndex = index ?? newSections.length;
      newSections.splice(insertIndex, 0, {
        id: section.id || generateId(),
        type: 'section',
        settings: section.settings || {},
        style: section.style || {},
        responsiveStyle: section.responsiveStyle || {},
        columns: section.columns || [
          {
            id: generateId(),
            type: 'column',
            width: 100,
            settings: {},
            style: {},
            responsiveStyle: {},
            widgets: [],
          },
        ],
      });
      return {
        ...state,
        document: { ...state.document, sections: newSections },
        saving: { ...state.saving, hasUnsavedChanges: true },
      };
    }
    
    case ActionTypes.UPDATE_SECTION: {
      const { sectionId, updates } = action.payload;
      const newSections = state.document.sections.map(section =>
        section.id === sectionId ? { ...section, ...updates } : section
      );
      return {
        ...state,
        document: { ...state.document, sections: newSections },
        saving: { ...state.saving, hasUnsavedChanges: true },
      };
    }
    
    case ActionTypes.DELETE_SECTION: {
      const { sectionId } = action.payload;
      const newSections = state.document.sections.filter(s => s.id !== sectionId);
      return {
        ...state,
        document: { ...state.document, sections: newSections },
        selection: state.selection.sectionId === sectionId ? initialState.selection : state.selection,
        saving: { ...state.saving, hasUnsavedChanges: true },
      };
    }
    
    case ActionTypes.MOVE_SECTION: {
      const { sectionId, newIndex } = action.payload;
      const sections = [...state.document.sections];
      const currentIndex = sections.findIndex(s => s.id === sectionId);
      if (currentIndex === -1) return state;
      const [section] = sections.splice(currentIndex, 1);
      sections.splice(newIndex, 0, section);
      return {
        ...state,
        document: { ...state.document, sections },
        saving: { ...state.saving, hasUnsavedChanges: true },
      };
    }
    
    case ActionTypes.DUPLICATE_SECTION: {
      const { sectionId } = action.payload;
      const sections = [...state.document.sections];
      const index = sections.findIndex(s => s.id === sectionId);
      if (index === -1) return state;
      const original = sections[index];
      const duplicate = deepClone(original);
      duplicate.id = generateId();
      duplicate.columns = duplicate.columns.map(col => ({
        ...col,
        id: generateId(),
        widgets: col.widgets.map(w => ({ ...w, id: generateId() })),
      }));
      sections.splice(index + 1, 0, duplicate);
      return {
        ...state,
        document: { ...state.document, sections },
        saving: { ...state.saving, hasUnsavedChanges: true },
      };
    }
    
    case ActionTypes.ADD_COLUMN: {
      const { sectionId, column, index } = action.payload;
      const newSections = state.document.sections.map(section => {
        if (section.id !== sectionId) return section;
        const columns = [...section.columns];
        const insertIndex = index ?? columns.length;
        columns.splice(insertIndex, 0, {
          id: column.id || generateId(),
          type: 'column',
          width: column.width || Math.floor(100 / (columns.length + 1)),
          settings: column.settings || {},
          style: column.style || {},
          responsiveStyle: column.responsiveStyle || {},
          widgets: column.widgets || [],
        });
        // Rebalance column widths
        const totalWidth = 100;
        const newWidth = Math.floor(totalWidth / columns.length);
        columns.forEach(col => { col.width = newWidth; });
        return { ...section, columns };
      });
      return {
        ...state,
        document: { ...state.document, sections: newSections },
        saving: { ...state.saving, hasUnsavedChanges: true },
      };
    }
    
    case ActionTypes.UPDATE_COLUMN: {
      const { sectionId, columnId, updates } = action.payload;
      const newSections = state.document.sections.map(section => {
        if (section.id !== sectionId) return section;
        const columns = section.columns.map(col =>
          col.id === columnId ? { ...col, ...updates } : col
        );
        return { ...section, columns };
      });
      return {
        ...state,
        document: { ...state.document, sections: newSections },
        saving: { ...state.saving, hasUnsavedChanges: true },
      };
    }
    
    case ActionTypes.DELETE_COLUMN: {
      const { sectionId, columnId } = action.payload;
      const newSections = state.document.sections.map(section => {
        if (section.id !== sectionId) return section;
        const columns = section.columns.filter(c => c.id !== columnId);
        if (columns.length === 0) {
          // Add a default column if all are deleted
          columns.push({
            id: generateId(),
            type: 'column',
            width: 100,
            settings: {},
            style: {},
            responsiveStyle: {},
            widgets: [],
          });
        }
        // Rebalance widths
        const newWidth = Math.floor(100 / columns.length);
        columns.forEach(col => { col.width = newWidth; });
        return { ...section, columns };
      });
      return {
        ...state,
        document: { ...state.document, sections: newSections },
        selection: state.selection.columnId === columnId ? { ...state.selection, columnId: null, type: 'section' } : state.selection,
        saving: { ...state.saving, hasUnsavedChanges: true },
      };
    }
    
    case ActionTypes.ADD_WIDGET: {
      const { sectionId, columnId, widget, index } = action.payload;
      const newSections = state.document.sections.map(section => {
        if (section.id !== sectionId) return section;
        const columns = section.columns.map(col => {
          if (col.id !== columnId) return col;
          const widgets = [...col.widgets];
          const insertIndex = index ?? widgets.length;
          widgets.splice(insertIndex, 0, {
            id: widget.id || generateId(),
            type: 'widget',
            widgetType: widget.widgetType,
            settings: widget.settings || {},
            content: widget.content || {},
            style: widget.style || {},
            responsiveStyle: widget.responsiveStyle || {},
          });
          return { ...col, widgets };
        });
        return { ...section, columns };
      });
      return {
        ...state,
        document: { ...state.document, sections: newSections },
        saving: { ...state.saving, hasUnsavedChanges: true },
      };
    }
    
    case ActionTypes.UPDATE_WIDGET: {
      const { sectionId, columnId, widgetId, updates } = action.payload;
      const newSections = state.document.sections.map(section => {
        if (section.id !== sectionId) return section;
        const columns = section.columns.map(col => {
          if (col.id !== columnId) return col;
          const widgets = col.widgets.map(w =>
            w.id === widgetId ? { ...w, ...updates } : w
          );
          return { ...col, widgets };
        });
        return { ...section, columns };
      });
      return {
        ...state,
        document: { ...state.document, sections: newSections },
        saving: { ...state.saving, hasUnsavedChanges: true },
      };
    }
    
    case ActionTypes.DELETE_WIDGET: {
      const { sectionId, columnId, widgetId } = action.payload;
      const newSections = state.document.sections.map(section => {
        if (section.id !== sectionId) return section;
        const columns = section.columns.map(col => {
          if (col.id !== columnId) return col;
          const widgets = col.widgets.filter(w => w.id !== widgetId);
          return { ...col, widgets };
        });
        return { ...section, columns };
      });
      return {
        ...state,
        document: { ...state.document, sections: newSections },
        selection: state.selection.id === widgetId ? { ...state.selection, id: null, type: 'column' } : state.selection,
        saving: { ...state.saving, hasUnsavedChanges: true },
      };
    }
    
    case ActionTypes.MOVE_WIDGET: {
      const { fromSectionId, fromColumnId, widgetId, toSectionId, toColumnId, toIndex } = action.payload;
      let movedWidget = null;
      
      // Remove widget from source
      let newSections = state.document.sections.map(section => {
        if (section.id !== fromSectionId) return section;
        const columns = section.columns.map(col => {
          if (col.id !== fromColumnId) return col;
          const widgetIndex = col.widgets.findIndex(w => w.id === widgetId);
          if (widgetIndex === -1) return col;
          movedWidget = col.widgets[widgetIndex];
          const widgets = col.widgets.filter(w => w.id !== widgetId);
          return { ...col, widgets };
        });
        return { ...section, columns };
      });
      
      if (!movedWidget) return state;
      
      // Add widget to destination
      newSections = newSections.map(section => {
        if (section.id !== toSectionId) return section;
        const columns = section.columns.map(col => {
          if (col.id !== toColumnId) return col;
          const widgets = [...col.widgets];
          widgets.splice(toIndex, 0, movedWidget);
          return { ...col, widgets };
        });
        return { ...section, columns };
      });
      
      return {
        ...state,
        document: { ...state.document, sections: newSections },
        selection: {
          ...state.selection,
          sectionId: toSectionId,
          columnId: toColumnId,
        },
        saving: { ...state.saving, hasUnsavedChanges: true },
      };
    }
    
    case ActionTypes.DUPLICATE_WIDGET: {
      const { sectionId, columnId, widgetId } = action.payload;
      const newSections = state.document.sections.map(section => {
        if (section.id !== sectionId) return section;
        const columns = section.columns.map(col => {
          if (col.id !== columnId) return col;
          const widgetIndex = col.widgets.findIndex(w => w.id === widgetId);
          if (widgetIndex === -1) return col;
          const original = col.widgets[widgetIndex];
          const duplicate = { ...deepClone(original), id: generateId() };
          const widgets = [...col.widgets];
          widgets.splice(widgetIndex + 1, 0, duplicate);
          return { ...col, widgets };
        });
        return { ...section, columns };
      });
      return {
        ...state,
        document: { ...state.document, sections: newSections },
        saving: { ...state.saving, hasUnsavedChanges: true },
      };
    }
    
    case ActionTypes.SET_SELECTION: {
      return {
        ...state,
        selection: action.payload,
      };
    }
    
    case ActionTypes.CLEAR_SELECTION: {
      return {
        ...state,
        selection: initialState.selection,
      };
    }
    
    case ActionTypes.SET_VIEWPORT: {
      return {
        ...state,
        viewport: action.payload,
      };
    }
    
    case ActionTypes.START_DRAG: {
      return {
        ...state,
        drag: {
          isDragging: true,
          ...action.payload,
        },
      };
    }
    
    case ActionTypes.UPDATE_DRAG: {
      return {
        ...state,
        drag: {
          ...state.drag,
          ...action.payload,
        },
      };
    }
    
    case ActionTypes.END_DRAG: {
      return {
        ...state,
        drag: initialState.drag,
      };
    }
    
    case ActionTypes.UNDO: {
      if (state.history.past.length === 0) return state;
      const previous = state.history.past[state.history.past.length - 1];
      const newPast = state.history.past.slice(0, -1);
      return {
        ...state,
        document: previous,
        history: {
          past: newPast,
          future: [state.document, ...state.history.future],
        },
        saving: { ...state.saving, hasUnsavedChanges: true },
      };
    }
    
    case ActionTypes.REDO: {
      if (state.history.future.length === 0) return state;
      const next = state.history.future[0];
      const newFuture = state.history.future.slice(1);
      return {
        ...state,
        document: next,
        history: {
          past: [...state.history.past, state.document],
          future: newFuture,
        },
        saving: { ...state.saving, hasUnsavedChanges: true },
      };
    }
    
    case ActionTypes.SAVE_HISTORY: {
      return {
        ...state,
        history: {
          past: [...state.history.past.slice(-49), state.document],
          future: [],
        },
      };
    }
    
    case ActionTypes.SET_LEFT_PANEL_TAB: {
      return {
        ...state,
        ui: { ...state.ui, leftPanelTab: action.payload },
      };
    }
    
    case ActionTypes.SET_RIGHT_PANEL_TAB: {
      return {
        ...state,
        ui: { ...state.ui, rightPanelTab: action.payload },
      };
    }
    
    case ActionTypes.SET_SHOW_WELCOME: {
      return {
        ...state,
        ui: { ...state.ui, showWelcome: action.payload },
      };
    }
    
    case ActionTypes.SET_ZOOM: {
      return {
        ...state,
        ui: { ...state.ui, zoom: action.payload },
      };
    }
    
    case ActionTypes.SET_SAVING: {
      return {
        ...state,
        saving: { ...state.saving, isSaving: action.payload },
      };
    }
    
    case ActionTypes.SET_HAS_UNSAVED_CHANGES: {
      return {
        ...state,
        saving: { ...state.saving, hasUnsavedChanges: action.payload },
      };
    }
    
    case ActionTypes.MARK_SAVED: {
      return {
        ...state,
        saving: {
          isSaving: false,
          hasUnsavedChanges: false,
          lastSaved: new Date().toISOString(),
        },
      };
    }
    
    default:
      return state;
  }
}

// Context
const BuilderContext = createContext(null);

// Provider component
export function BuilderProvider({ children, initialDocument }) {
  const [state, dispatch] = useReducer(builderReducer, {
    ...initialState,
    document: initialDocument || initialState.document,
  });
  
  // Action creators
  const actions = useMemo(() => ({
    // Document actions
    setDocument: (document) => dispatch({ type: ActionTypes.SET_DOCUMENT, payload: document }),
    
    addSection: (section, index) => {
      dispatch({ type: ActionTypes.SAVE_HISTORY });
      dispatch({ type: ActionTypes.ADD_SECTION, payload: { section, index } });
    },
    updateSection: (sectionId, updates) => dispatch({ type: ActionTypes.UPDATE_SECTION, payload: { sectionId, updates } }),
    deleteSection: (sectionId) => {
      dispatch({ type: ActionTypes.SAVE_HISTORY });
      dispatch({ type: ActionTypes.DELETE_SECTION, payload: { sectionId } });
    },
    moveSection: (sectionId, newIndex) => {
      dispatch({ type: ActionTypes.SAVE_HISTORY });
      dispatch({ type: ActionTypes.MOVE_SECTION, payload: { sectionId, newIndex } });
    },
    duplicateSection: (sectionId) => {
      dispatch({ type: ActionTypes.SAVE_HISTORY });
      dispatch({ type: ActionTypes.DUPLICATE_SECTION, payload: { sectionId } });
    },
    
    addColumn: (sectionId, column, index) => {
      dispatch({ type: ActionTypes.SAVE_HISTORY });
      dispatch({ type: ActionTypes.ADD_COLUMN, payload: { sectionId, column, index } });
    },
    updateColumn: (sectionId, columnId, updates) => dispatch({ type: ActionTypes.UPDATE_COLUMN, payload: { sectionId, columnId, updates } }),
    deleteColumn: (sectionId, columnId) => {
      dispatch({ type: ActionTypes.SAVE_HISTORY });
      dispatch({ type: ActionTypes.DELETE_COLUMN, payload: { sectionId, columnId } });
    },
    
    addWidget: (sectionId, columnId, widget, index) => {
      dispatch({ type: ActionTypes.SAVE_HISTORY });
      dispatch({ type: ActionTypes.ADD_WIDGET, payload: { sectionId, columnId, widget, index } });
    },
    updateWidget: (sectionId, columnId, widgetId, updates) => dispatch({ type: ActionTypes.UPDATE_WIDGET, payload: { sectionId, columnId, widgetId, updates } }),
    deleteWidget: (sectionId, columnId, widgetId) => {
      dispatch({ type: ActionTypes.SAVE_HISTORY });
      dispatch({ type: ActionTypes.DELETE_WIDGET, payload: { sectionId, columnId, widgetId } });
    },
    moveWidget: (fromSectionId, fromColumnId, widgetId, toSectionId, toColumnId, toIndex) => {
      dispatch({ type: ActionTypes.SAVE_HISTORY });
      dispatch({ type: ActionTypes.MOVE_WIDGET, payload: { fromSectionId, fromColumnId, widgetId, toSectionId, toColumnId, toIndex } });
    },
    duplicateWidget: (sectionId, columnId, widgetId) => {
      dispatch({ type: ActionTypes.SAVE_HISTORY });
      dispatch({ type: ActionTypes.DUPLICATE_WIDGET, payload: { sectionId, columnId, widgetId } });
    },
    
    // Selection actions
    selectSection: (sectionId) => dispatch({ type: ActionTypes.SET_SELECTION, payload: { type: 'section', id: sectionId, sectionId, columnId: null } }),
    selectColumn: (sectionId, columnId) => dispatch({ type: ActionTypes.SET_SELECTION, payload: { type: 'column', id: columnId, sectionId, columnId } }),
    selectWidget: (sectionId, columnId, widgetId) => dispatch({ type: ActionTypes.SET_SELECTION, payload: { type: 'widget', id: widgetId, sectionId, columnId } }),
    clearSelection: () => dispatch({ type: ActionTypes.CLEAR_SELECTION }),
    
    // Viewport actions
    setViewport: (viewport) => dispatch({ type: ActionTypes.SET_VIEWPORT, payload: viewport }),
    
    // Drag actions
    startDrag: (dragData) => dispatch({ type: ActionTypes.START_DRAG, payload: dragData }),
    updateDrag: (dragData) => dispatch({ type: ActionTypes.UPDATE_DRAG, payload: dragData }),
    endDrag: () => dispatch({ type: ActionTypes.END_DRAG }),
    
    // History actions
    undo: () => dispatch({ type: ActionTypes.UNDO }),
    redo: () => dispatch({ type: ActionTypes.REDO }),
    saveHistory: () => dispatch({ type: ActionTypes.SAVE_HISTORY }),
    
    // UI actions
    setLeftPanelTab: (tab) => dispatch({ type: ActionTypes.SET_LEFT_PANEL_TAB, payload: tab }),
    setRightPanelTab: (tab) => dispatch({ type: ActionTypes.SET_RIGHT_PANEL_TAB, payload: tab }),
    setShowWelcome: (show) => dispatch({ type: ActionTypes.SET_SHOW_WELCOME, payload: show }),
    setZoom: (zoom) => dispatch({ type: ActionTypes.SET_ZOOM, payload: zoom }),
    
    // Saving actions
    setSaving: (isSaving) => dispatch({ type: ActionTypes.SET_SAVING, payload: isSaving }),
    setHasUnsavedChanges: (hasChanges) => dispatch({ type: ActionTypes.SET_HAS_UNSAVED_CHANGES, payload: hasChanges }),
    markSaved: () => dispatch({ type: ActionTypes.MARK_SAVED }),
  }), []);
  
  const value = useMemo(() => ({ state, actions }), [state, actions]);
  
  return (
    <BuilderContext.Provider value={value}>
      {children}
    </BuilderContext.Provider>
  );
}

// Hook to use builder context
export function useBuilder() {
  const context = useContext(BuilderContext);
  if (!context) {
    throw new Error('useBuilder must be used within a BuilderProvider');
  }
  return context;
}

// Hook to get selected element
export function useSelectedElement() {
  const { state } = useBuilder();
  const { selection, document } = state;
  
  return useMemo(() => {
    if (!selection.type || !selection.id) return null;
    
    const section = document.sections.find(s => s.id === selection.sectionId);
    if (!section) return null;
    
    if (selection.type === 'section') {
      return { type: 'section', element: section };
    }
    
    const column = section.columns.find(c => c.id === selection.columnId);
    if (!column) return null;
    
    if (selection.type === 'column') {
      return { type: 'column', element: column, section };
    }
    
    const widget = column.widgets.find(w => w.id === selection.id);
    if (!widget) return null;
    
    return { type: 'widget', element: widget, column, section };
  }, [selection, document]);
}

export { ActionTypes };
