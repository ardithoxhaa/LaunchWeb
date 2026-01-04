/**
 * Left Panel Component
 * Contains widgets library, navigator, and global settings
 */

import { useState, useCallback } from 'react';
import { useBuilder } from '../store/builderStore.jsx';
import { WIDGETS, WIDGET_CATEGORIES, getWidgetsByCategory } from '../widgets/widgetRegistry';

export function LeftPanel() {
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
          active={ui.leftPanelTab === 'navigator'}
          onClick={() => actions.setLeftPanelTab('navigator')}
          icon="☰"
          label="Navigator"
        />
        <PanelTab
          active={ui.leftPanelTab === 'settings'}
          onClick={() => actions.setLeftPanelTab('settings')}
          icon="⚙"
          label="Settings"
        />
      </div>

      {/* Panel Content */}
      <div className="flex-1 overflow-auto">
        {ui.leftPanelTab === 'widgets' && (
          <WidgetsPanel searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        )}
        {ui.leftPanelTab === 'navigator' && (
          <NavigatorPanel />
        )}
        {ui.leftPanelTab === 'settings' && (
          <SettingsPanel />
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

function SettingsPanel() {
  return (
    <div className="p-4 space-y-4">
      <div className="text-xs font-medium text-white/50 uppercase tracking-wide mb-3">
        Global Settings
      </div>

      <div className="space-y-4">
        <SettingsSection title="Colors">
          <ColorSetting label="Primary" defaultValue="#6366f1" />
          <ColorSetting label="Secondary" defaultValue="#22c55e" />
          <ColorSetting label="Background" defaultValue="#0f0f1a" />
          <ColorSetting label="Text" defaultValue="#ffffff" />
        </SettingsSection>

        <SettingsSection title="Typography">
          <SelectSetting
            label="Font Family"
            options={['Inter', 'Roboto', 'Open Sans', 'Poppins', 'Montserrat']}
            defaultValue="Inter"
          />
          <RangeSetting label="Base Size" min={12} max={20} defaultValue={16} unit="px" />
        </SettingsSection>

        <SettingsSection title="Layout">
          <RangeSetting label="Content Width" min={800} max={1400} defaultValue={1200} unit="px" />
          <RangeSetting label="Section Padding" min={20} max={120} defaultValue={60} unit="px" />
        </SettingsSection>
      </div>
    </div>
  );
}

function SettingsSection({ title, children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="rounded-xl border border-white/10 overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2.5 flex items-center justify-between bg-white/5 hover:bg-white/10 transition-colors"
      >
        <span className="text-xs font-semibold">{title}</span>
        <span className="text-white/40 text-xs">{isOpen ? '▾' : '▸'}</span>
      </button>
      {isOpen && <div className="p-3 space-y-3">{children}</div>}
    </div>
  );
}

function ColorSetting({ label, defaultValue }) {
  const [value, setValue] = useState(defaultValue);

  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-white/70">{label}</span>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-6 h-6 rounded cursor-pointer"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-20 px-2 py-1 rounded bg-white/5 border border-white/10 text-xs"
        />
      </div>
    </div>
  );
}

function SelectSetting({ label, options, defaultValue }) {
  const [value, setValue] = useState(defaultValue);

  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-white/70">{label}</span>
      <select
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="px-2 py-1 rounded bg-white/5 border border-white/10 text-xs"
      >
        {options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}

function RangeSetting({ label, min, max, defaultValue, unit }) {
  const [value, setValue] = useState(defaultValue);

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-xs text-white/70">{label}</span>
        <span className="text-xs text-white/50">{value}{unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="w-full"
      />
    </div>
  );
}
