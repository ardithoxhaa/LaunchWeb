/**
 * Right Panel Component
 * Inspector panel with Content, Style, and Advanced tabs for editing selected elements
 */

import { useState, useCallback, useMemo, useRef } from 'react';
import { useBuilder, useSelectedElement } from '../store/builderStore.jsx';
import { getWidget } from '../widgets/widgetRegistry';

export function RightPanel() {
  const { state, actions } = useBuilder();
  const { ui, selection, viewport } = state;
  const selectedElement = useSelectedElement();

  if (!selectedElement) {
    return (
      <div className="w-[320px] bg-[#1e1e2d] border-l border-white/10 flex flex-col h-full">
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center text-white/40">
            <div className="text-4xl mb-3">👆</div>
            <div className="text-sm font-medium mb-1">No Element Selected</div>
            <div className="text-xs">Click on a section, column, or widget to edit it</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-[320px] bg-[#1e1e2d] border-l border-white/10 flex flex-col h-full">
      {/* Element Header */}
      <ElementHeader element={selectedElement} />

      {/* Panel Tabs */}
      <div className="flex border-b border-white/10">
        <InspectorTab
          active={ui.rightPanelTab === 'content'}
          onClick={() => actions.setRightPanelTab('content')}
          label="Content"
        />
        <InspectorTab
          active={ui.rightPanelTab === 'style'}
          onClick={() => actions.setRightPanelTab('style')}
          label="Style"
        />
        <InspectorTab
          active={ui.rightPanelTab === 'advanced'}
          onClick={() => actions.setRightPanelTab('advanced')}
          label="Advanced"
        />
      </div>

      {/* Responsive Toggle */}
      <div className="px-4 py-2 border-b border-white/10 flex items-center justify-between">
        <span className="text-xs text-white/50">Editing for:</span>
        <div className="flex gap-1">
          <ViewportButton viewport="desktop" current={viewport} onClick={() => actions.setViewport('desktop')} icon="🖥" />
          <ViewportButton viewport="tablet" current={viewport} onClick={() => actions.setViewport('tablet')} icon="📱" />
          <ViewportButton viewport="mobile" current={viewport} onClick={() => actions.setViewport('mobile')} icon="📲" />
        </div>
      </div>

      {/* Panel Content */}
      <div className="flex-1 overflow-auto">
        {ui.rightPanelTab === 'content' && <ContentPanel element={selectedElement} />}
        {ui.rightPanelTab === 'style' && <StylePanel element={selectedElement} />}
        {ui.rightPanelTab === 'advanced' && <AdvancedPanel element={selectedElement} />}
      </div>
    </div>
  );
}

function ElementHeader({ element }) {
  const { type, element: el } = element;
  const widgetDef = type === 'widget' ? getWidget(el.widgetType) : null;

  const typeColors = {
    section: 'bg-indigo-500',
    column: 'bg-cyan-500',
    widget: 'bg-emerald-500',
  };

  const typeIcons = {
    section: '⊞',
    column: '▢',
    widget: widgetDef?.icon || '▢',
  };

  const typeLabels = {
    section: 'Section',
    column: 'Column',
    widget: widgetDef?.name || el.widgetType,
  };

  return (
    <div className="px-4 py-3 border-b border-white/10 flex items-center gap-3">
      <div className={`w-8 h-8 rounded-lg ${typeColors[type]} flex items-center justify-center text-white`}>
        {typeIcons[type]}
      </div>
      <div>
        <div className="text-sm font-semibold">{typeLabels[type]}</div>
        <div className="text-xs text-white/50 capitalize">{type}</div>
      </div>
    </div>
  );
}

function InspectorTab({ active, onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex-1 py-3 text-xs font-medium transition-colors
        ${active 
          ? 'bg-white/5 text-white border-b-2 border-indigo-500' 
          : 'text-white/60 hover:text-white/80 hover:bg-white/5'
        }
      `}
    >
      {label}
    </button>
  );
}

function ViewportButton({ viewport, current, onClick, icon }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        w-8 h-8 rounded flex items-center justify-center text-sm transition-colors
        ${viewport === current 
          ? 'bg-indigo-500/30 text-indigo-400' 
          : 'text-white/40 hover:text-white/60 hover:bg-white/10'
        }
      `}
      title={viewport.charAt(0).toUpperCase() + viewport.slice(1)}
    >
      {icon}
    </button>
  );
}

function ContentPanel({ element }) {
  const { type, element: el, section, column } = element;
  const { actions } = useBuilder();

  const handleUpdate = useCallback((updates) => {
    if (type === 'section') {
      actions.updateSection(el.id, updates);
    } else if (type === 'column') {
      actions.updateColumn(section.id, el.id, updates);
    } else if (type === 'widget') {
      actions.updateWidget(section.id, column.id, el.id, updates);
    }
  }, [type, el, section, column, actions]);

  if (type === 'section') {
    return <SectionContentPanel section={el} onUpdate={handleUpdate} />;
  }

  if (type === 'column') {
    return <ColumnContentPanel column={el} onUpdate={handleUpdate} />;
  }

  if (type === 'widget') {
    return <WidgetContentPanel widget={el} onUpdate={handleUpdate} />;
  }

  return null;
}

function SectionContentPanel({ section, onUpdate }) {
  const { actions } = useBuilder();
  
  const handleColumnCountChange = (count) => {
    const currentColumns = section.columns || [];
    const currentCount = currentColumns.length;
    
    if (count === currentCount) return;
    
    if (count > currentCount) {
      // Add columns
      const newColumns = [...currentColumns];
      for (let i = currentCount; i < count; i++) {
        newColumns.push({
          id: `col-${Date.now()}-${i}`,
          widgets: [],
          style: {},
          settings: {},
        });
      }
      actions.updateSection(section.id, { columns: newColumns });
    } else {
      // Remove columns (keep first N)
      const newColumns = currentColumns.slice(0, count);
      actions.updateSection(section.id, { columns: newColumns });
    }
  };

  return (
    <div className="p-4 space-y-4">
      <InspectorSection title="Layout">
        <SelectField
          label="Content Width"
          value={section.settings?.contentWidth || 'boxed'}
          onChange={(v) => onUpdate({ settings: { ...section.settings, contentWidth: v } })}
          options={[
            { value: 'boxed', label: 'Boxed' },
            { value: 'full', label: 'Full Width' },
          ]}
        />
        <SelectField
          label="Columns Gap"
          value={section.settings?.columnsGap || 'default'}
          onChange={(v) => onUpdate({ settings: { ...section.settings, columnsGap: v } })}
          options={[
            { value: 'none', label: 'No Gap' },
            { value: 'narrow', label: 'Narrow' },
            { value: 'default', label: 'Default' },
            { value: 'wide', label: 'Wide' },
          ]}
        />
        <SelectField
          label="Vertical Align"
          value={section.settings?.verticalAlign || 'stretch'}
          onChange={(v) => onUpdate({ settings: { ...section.settings, verticalAlign: v } })}
          options={[
            { value: 'stretch', label: 'Stretch' },
            { value: 'top', label: 'Top' },
            { value: 'middle', label: 'Middle' },
            { value: 'bottom', label: 'Bottom' },
          ]}
        />
        <TextField
          label="Min Height"
          value={section.style?.minHeight || ''}
          onChange={(v) => onUpdate({ style: { ...section.style, minHeight: v } })}
          placeholder="e.g., 400px or 100vh"
        />
      </InspectorSection>

      <InspectorSection title="Structure">
        <div className="text-xs text-white/50 mb-2">
          {section.columns?.length || 0} column(s)
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map(n => (
            <button
              key={n}
              type="button"
              onClick={() => handleColumnCountChange(n)}
              className={`
                p-2 rounded border transition-colors
                ${section.columns?.length === n 
                  ? 'border-indigo-500 bg-indigo-500/20' 
                  : 'border-white/10 hover:border-white/20'
                }
              `}
            >
              <div className="flex gap-0.5 justify-center">
                {Array(n).fill(0).map((_, i) => (
                  <div key={i} className="w-2 h-4 bg-white/40 rounded-sm" />
                ))}
              </div>
            </button>
          ))}
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleColumnCountChange(2)}
            className="p-2 rounded border border-white/10 hover:border-white/20 transition-colors"
            title="50% / 50%"
          >
            <div className="flex gap-0.5 justify-center">
              <div className="w-4 h-4 bg-white/40 rounded-sm" />
              <div className="w-4 h-4 bg-white/40 rounded-sm" />
            </div>
          </button>
          <button
            type="button"
            onClick={() => {
              handleColumnCountChange(2);
              // Set 33/66 ratio after columns are created
              setTimeout(() => {
                const cols = section.columns || [];
                if (cols.length >= 2) {
                  actions.updateColumn(section.id, cols[0].id, { width: 33 });
                  actions.updateColumn(section.id, cols[1].id, { width: 66 });
                }
              }, 50);
            }}
            className="p-2 rounded border border-white/10 hover:border-white/20 transition-colors"
            title="33% / 66%"
          >
            <div className="flex gap-0.5 justify-center">
              <div className="w-2 h-4 bg-white/40 rounded-sm" />
              <div className="w-5 h-4 bg-white/40 rounded-sm" />
            </div>
          </button>
          <button
            type="button"
            onClick={() => {
              handleColumnCountChange(2);
              setTimeout(() => {
                const cols = section.columns || [];
                if (cols.length >= 2) {
                  actions.updateColumn(section.id, cols[0].id, { width: 66 });
                  actions.updateColumn(section.id, cols[1].id, { width: 33 });
                }
              }, 50);
            }}
            className="p-2 rounded border border-white/10 hover:border-white/20 transition-colors"
            title="66% / 33%"
          >
            <div className="flex gap-0.5 justify-center">
              <div className="w-5 h-4 bg-white/40 rounded-sm" />
              <div className="w-2 h-4 bg-white/40 rounded-sm" />
            </div>
          </button>
        </div>
      </InspectorSection>
    </div>
  );
}

function ColumnContentPanel({ column, onUpdate }) {
  return (
    <div className="p-4 space-y-4">
      <InspectorSection title="Column Width">
        <RangeField
          label="Width"
          value={column.width || 100}
          onChange={(v) => onUpdate({ width: v })}
          min={10}
          max={100}
          unit="%"
        />
      </InspectorSection>

      <InspectorSection title="Vertical Align">
        <SelectField
          label="Align"
          value={column.settings?.verticalAlign || 'stretch'}
          onChange={(v) => onUpdate({ settings: { ...column.settings, verticalAlign: v } })}
          options={[
            { value: 'stretch', label: 'Stretch' },
            { value: 'top', label: 'Top' },
            { value: 'middle', label: 'Middle' },
            { value: 'bottom', label: 'Bottom' },
          ]}
        />
      </InspectorSection>

      <InspectorSection title="Widgets">
        <div className="text-xs text-white/50">
          {column.widgets?.length || 0} widget(s) in this column
        </div>
      </InspectorSection>
    </div>
  );
}

function WidgetContentPanel({ widget, onUpdate }) {
  const widgetDef = getWidget(widget.widgetType);
  const content = widget.content || {};

  const handleContentUpdate = useCallback((key, value) => {
    onUpdate({ content: { ...content, [key]: value } });
  }, [content, onUpdate]);

  // Render different content fields based on widget type
  switch (widget.widgetType) {
    case 'HEADING':
      return (
        <div className="p-4 space-y-4">
          <InspectorSection title="Content">
            <TextareaField
              label="Text"
              value={content.text || ''}
              onChange={(v) => handleContentUpdate('text', v)}
              placeholder="Enter heading text..."
            />
            <SelectField
              label="HTML Tag"
              value={content.tag || 'h2'}
              onChange={(v) => handleContentUpdate('tag', v)}
              options={[
                { value: 'h1', label: 'H1' },
                { value: 'h2', label: 'H2' },
                { value: 'h3', label: 'H3' },
                { value: 'h4', label: 'H4' },
                { value: 'h5', label: 'H5' },
                { value: 'h6', label: 'H6' },
              ]}
            />
          </InspectorSection>
          <InspectorSection title="Link">
            <TextField
              label="URL"
              value={content.link || ''}
              onChange={(v) => handleContentUpdate('link', v)}
              placeholder="https://..."
            />
          </InspectorSection>
        </div>
      );

    case 'TEXT':
      return (
        <div className="p-4 space-y-4">
          <InspectorSection title="Content">
            <TextareaField
              label="Text"
              value={content.text || ''}
              onChange={(v) => handleContentUpdate('text', v)}
              placeholder="Enter your text..."
              rows={6}
            />
          </InspectorSection>
        </div>
      );

    case 'IMAGE':
      return (
        <div className="p-4 space-y-4">
          <InspectorSection title="Image">
            <ImageUploadField
              label="Image"
              value={content.src || ''}
              onChange={(v) => handleContentUpdate('src', v)}
            />
            <TextField
              label="Alt Text"
              value={content.alt || ''}
              onChange={(v) => handleContentUpdate('alt', v)}
              placeholder="Describe the image..."
            />
            <TextField
              label="Caption"
              value={content.caption || ''}
              onChange={(v) => handleContentUpdate('caption', v)}
              placeholder="Optional caption..."
            />
          </InspectorSection>
          <InspectorSection title="Link">
            <TextField
              label="URL"
              value={content.link || ''}
              onChange={(v) => handleContentUpdate('link', v)}
              placeholder="https://..."
            />
          </InspectorSection>
        </div>
      );

    case 'BUTTON':
      return (
        <div className="p-4 space-y-4">
          <InspectorSection title="Button">
            <TextField
              label="Text"
              value={content.text || ''}
              onChange={(v) => handleContentUpdate('text', v)}
              placeholder="Button text..."
            />
            <TextField
              label="Link"
              value={content.link || ''}
              onChange={(v) => handleContentUpdate('link', v)}
              placeholder="https://..."
            />
            <SelectField
              label="Target"
              value={content.target || '_self'}
              onChange={(v) => handleContentUpdate('target', v)}
              options={[
                { value: '_self', label: 'Same Window' },
                { value: '_blank', label: 'New Window' },
              ]}
            />
          </InspectorSection>
        </div>
      );

    case 'ICON':
      return (
        <div className="p-4 space-y-4">
          <InspectorSection title="Icon">
            <TextField
              label="Icon"
              value={content.icon || ''}
              onChange={(v) => handleContentUpdate('icon', v)}
              placeholder="★"
            />
          </InspectorSection>
          <InspectorSection title="Link">
            <TextField
              label="URL"
              value={content.link || ''}
              onChange={(v) => handleContentUpdate('link', v)}
              placeholder="https://..."
            />
          </InspectorSection>
        </div>
      );

    case 'SPACER':
      return (
        <div className="p-4 space-y-4">
          <InspectorSection title="Spacer">
            <RangeField
              label="Height"
              value={parseInt(widget.style?.height) || 50}
              onChange={(v) => onUpdate({ style: { ...widget.style, height: `${v}px` } })}
              min={10}
              max={300}
              unit="px"
            />
          </InspectorSection>
        </div>
      );

    case 'DIVIDER':
      return (
        <div className="p-4 space-y-4">
          <InspectorSection title="Divider">
            <SelectField
              label="Style"
              value={content.style || 'solid'}
              onChange={(v) => handleContentUpdate('style', v)}
              options={[
                { value: 'solid', label: 'Solid' },
                { value: 'dashed', label: 'Dashed' },
                { value: 'dotted', label: 'Dotted' },
                { value: 'double', label: 'Double' },
              ]}
            />
          </InspectorSection>
        </div>
      );

    case 'HERO':
      return (
        <div className="p-4 space-y-4">
          <InspectorSection title="Content">
            <TextField
              label="Headline"
              value={content.headline || ''}
              onChange={(v) => handleContentUpdate('headline', v)}
              placeholder="Your main headline..."
            />
            <TextareaField
              label="Subheadline"
              value={content.subheadline || ''}
              onChange={(v) => handleContentUpdate('subheadline', v)}
              placeholder="Supporting text..."
              rows={3}
            />
          </InspectorSection>
          <InspectorSection title="Hero Image">
            <ImageUploadField
              label="Image"
              value={content.image || ''}
              onChange={(v) => handleContentUpdate('image', v)}
            />
          </InspectorSection>
          <InspectorSection title="Primary Button">
            <TextField
              label="Label"
              value={content.primaryCta?.label || ''}
              onChange={(v) => handleContentUpdate('primaryCta', { ...content.primaryCta, label: v })}
              placeholder="Get Started"
            />
            <TextField
              label="Link"
              value={content.primaryCta?.href || ''}
              onChange={(v) => handleContentUpdate('primaryCta', { ...content.primaryCta, href: v })}
              placeholder="https://..."
            />
          </InspectorSection>
          <InspectorSection title="Secondary Button">
            <TextField
              label="Label"
              value={content.secondaryCta?.label || ''}
              onChange={(v) => handleContentUpdate('secondaryCta', { ...content.secondaryCta, label: v })}
              placeholder="Learn More"
            />
            <TextField
              label="Link"
              value={content.secondaryCta?.href || ''}
              onChange={(v) => handleContentUpdate('secondaryCta', { ...content.secondaryCta, href: v })}
              placeholder="https://..."
            />
          </InspectorSection>
        </div>
      );

    case 'FEATURES':
      return (
        <div className="p-4 space-y-4">
          <InspectorSection title="Content">
            <TextField
              label="Headline"
              value={content.headline || ''}
              onChange={(v) => handleContentUpdate('headline', v)}
              placeholder="Our Features"
            />
          </InspectorSection>
          <InspectorSection title="Feature Items">
            {(content.items || []).map((item, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-white/5 border border-white/10 space-y-2 mb-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium">Feature {idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const newItems = [...(content.items || [])];
                      newItems.splice(idx, 1);
                      handleContentUpdate('items', newItems);
                    }}
                    className="text-xs text-red-400 hover:text-red-300"
                  >
                    Remove
                  </button>
                </div>
                <TextField
                  label="Icon"
                  value={item.icon || ''}
                  onChange={(v) => {
                    const newItems = [...(content.items || [])];
                    newItems[idx] = { ...newItems[idx], icon: v };
                    handleContentUpdate('items', newItems);
                  }}
                  placeholder="⚡"
                />
                <TextField
                  label="Title"
                  value={item.title || ''}
                  onChange={(v) => {
                    const newItems = [...(content.items || [])];
                    newItems[idx] = { ...newItems[idx], title: v };
                    handleContentUpdate('items', newItems);
                  }}
                  placeholder="Feature title"
                />
                <TextField
                  label="Description"
                  value={item.text || ''}
                  onChange={(v) => {
                    const newItems = [...(content.items || [])];
                    newItems[idx] = { ...newItems[idx], text: v };
                    handleContentUpdate('items', newItems);
                  }}
                  placeholder="Feature description"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                const newItems = [...(content.items || []), { icon: '✨', title: 'New Feature', text: 'Description' }];
                handleContentUpdate('items', newItems);
              }}
              className="w-full py-2 rounded-lg bg-indigo-500/20 text-indigo-400 text-xs font-medium hover:bg-indigo-500/30"
            >
              + Add Feature
            </button>
          </InspectorSection>
        </div>
      );

    case 'TESTIMONIAL':
    case 'TESTIMONIALS':
      return (
        <div className="p-4 space-y-4">
          <InspectorSection title="Content">
            <TextField
              label="Headline"
              value={content.headline || ''}
              onChange={(v) => handleContentUpdate('headline', v)}
              placeholder="What Our Customers Say"
            />
          </InspectorSection>
          <InspectorSection title="Testimonials">
            {(content.items || []).map((item, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-white/5 border border-white/10 space-y-2 mb-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium">Testimonial {idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const newItems = [...(content.items || [])];
                      newItems.splice(idx, 1);
                      handleContentUpdate('items', newItems);
                    }}
                    className="text-xs text-red-400 hover:text-red-300"
                  >
                    Remove
                  </button>
                </div>
                <TextareaField
                  label="Quote"
                  value={item.quote || item.content || ''}
                  onChange={(v) => {
                    const newItems = [...(content.items || [])];
                    newItems[idx] = { ...newItems[idx], quote: v };
                    handleContentUpdate('items', newItems);
                  }}
                  placeholder="Customer quote..."
                  rows={2}
                />
                <TextField
                  label="Name"
                  value={item.name || ''}
                  onChange={(v) => {
                    const newItems = [...(content.items || [])];
                    newItems[idx] = { ...newItems[idx], name: v };
                    handleContentUpdate('items', newItems);
                  }}
                  placeholder="John Doe"
                />
                <TextField
                  label="Role/Title"
                  value={item.role || item.title || ''}
                  onChange={(v) => {
                    const newItems = [...(content.items || [])];
                    newItems[idx] = { ...newItems[idx], role: v };
                    handleContentUpdate('items', newItems);
                  }}
                  placeholder="CEO, Company"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                const newItems = [...(content.items || []), { quote: 'Great service!', name: 'Customer', role: 'Title' }];
                handleContentUpdate('items', newItems);
              }}
              className="w-full py-2 rounded-lg bg-indigo-500/20 text-indigo-400 text-xs font-medium hover:bg-indigo-500/30"
            >
              + Add Testimonial
            </button>
          </InspectorSection>
        </div>
      );

    case 'PRICING':
      return (
        <div className="p-4 space-y-4">
          <InspectorSection title="Content">
            <TextField
              label="Headline"
              value={content.headline || ''}
              onChange={(v) => handleContentUpdate('headline', v)}
              placeholder="Choose Your Plan"
            />
          </InspectorSection>
          <InspectorSection title="Plans">
            {(content.plans || []).map((plan, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-white/5 border border-white/10 space-y-2 mb-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium">Plan {idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const newPlans = [...(content.plans || [])];
                      newPlans.splice(idx, 1);
                      handleContentUpdate('plans', newPlans);
                    }}
                    className="text-xs text-red-400 hover:text-red-300"
                  >
                    Remove
                  </button>
                </div>
                <TextField
                  label="Name"
                  value={plan.name || ''}
                  onChange={(v) => {
                    const newPlans = [...(content.plans || [])];
                    newPlans[idx] = { ...newPlans[idx], name: v };
                    handleContentUpdate('plans', newPlans);
                  }}
                  placeholder="Pro"
                />
                <TextField
                  label="Price"
                  value={plan.price || ''}
                  onChange={(v) => {
                    const newPlans = [...(content.plans || [])];
                    newPlans[idx] = { ...newPlans[idx], price: v };
                    handleContentUpdate('plans', newPlans);
                  }}
                  placeholder="$29"
                />
                <TextField
                  label="Period"
                  value={plan.period || ''}
                  onChange={(v) => {
                    const newPlans = [...(content.plans || [])];
                    newPlans[idx] = { ...newPlans[idx], period: v };
                    handleContentUpdate('plans', newPlans);
                  }}
                  placeholder="/month"
                />
                <TextareaField
                  label="Features (one per line)"
                  value={(plan.features || []).join('\n')}
                  onChange={(v) => {
                    const newPlans = [...(content.plans || [])];
                    newPlans[idx] = { ...newPlans[idx], features: v.split('\n').filter(f => f.trim()) };
                    handleContentUpdate('plans', newPlans);
                  }}
                  placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                  rows={4}
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                const newPlans = [...(content.plans || []), { name: 'New Plan', price: '$0', period: '/mo', features: ['Feature 1'] }];
                handleContentUpdate('plans', newPlans);
              }}
              className="w-full py-2 rounded-lg bg-indigo-500/20 text-indigo-400 text-xs font-medium hover:bg-indigo-500/30"
            >
              + Add Plan
            </button>
          </InspectorSection>
        </div>
      );

    case 'FAQ':
      return (
        <div className="p-4 space-y-4">
          <InspectorSection title="Content">
            <TextField
              label="Headline"
              value={content.headline || ''}
              onChange={(v) => handleContentUpdate('headline', v)}
              placeholder="Frequently Asked Questions"
            />
            <TextField
              label="Subheadline"
              value={content.subheadline || ''}
              onChange={(v) => handleContentUpdate('subheadline', v)}
              placeholder="Quick answers..."
            />
          </InspectorSection>
          <InspectorSection title="Questions">
            {(content.items || []).map((item, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-white/5 border border-white/10 space-y-2 mb-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium">Q{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const newItems = [...(content.items || [])];
                      newItems.splice(idx, 1);
                      handleContentUpdate('items', newItems);
                    }}
                    className="text-xs text-red-400 hover:text-red-300"
                  >
                    Remove
                  </button>
                </div>
                <TextField
                  label="Question"
                  value={item.q || ''}
                  onChange={(v) => {
                    const newItems = [...(content.items || [])];
                    newItems[idx] = { ...newItems[idx], q: v };
                    handleContentUpdate('items', newItems);
                  }}
                  placeholder="How does it work?"
                />
                <TextareaField
                  label="Answer"
                  value={item.a || ''}
                  onChange={(v) => {
                    const newItems = [...(content.items || [])];
                    newItems[idx] = { ...newItems[idx], a: v };
                    handleContentUpdate('items', newItems);
                  }}
                  placeholder="Answer here..."
                  rows={2}
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                const newItems = [...(content.items || []), { q: 'New question?', a: 'Answer here.' }];
                handleContentUpdate('items', newItems);
              }}
              className="w-full py-2 rounded-lg bg-indigo-500/20 text-indigo-400 text-xs font-medium hover:bg-indigo-500/30"
            >
              + Add Question
            </button>
          </InspectorSection>
        </div>
      );

    case 'CONTACT_FORM':
      return (
        <div className="p-4 space-y-4">
          <InspectorSection title="Content">
            <TextField
              label="Headline"
              value={content.headline || ''}
              onChange={(v) => handleContentUpdate('headline', v)}
              placeholder="Get in Touch"
            />
            <TextField
              label="Submit Button Text"
              value={content.submitText || ''}
              onChange={(v) => handleContentUpdate('submitText', v)}
              placeholder="Send Message"
            />
          </InspectorSection>
        </div>
      );

    case 'NAVBAR':
      // Support both logo.image/logo.text and logoImageUrl/logoText formats
      const navLogoImage = content.logo?.image || content.logoImageUrl || '';
      const navLogoText = content.logo?.text || content.logoText || '';
      return (
        <div className="p-4 space-y-4">
          <InspectorSection title="Logo">
            <ImageUploadField
              label="Logo Image"
              value={navLogoImage}
              onChange={(v) => handleContentUpdate('logo', { ...content.logo, image: v })}
            />
            <TextField
              label="Logo Text (fallback)"
              value={navLogoText}
              onChange={(v) => {
                // Update both formats for compatibility
                onUpdate({ 
                  content: { 
                    ...content, 
                    logo: { ...content.logo, text: v },
                    logoText: v 
                  } 
                });
              }}
              placeholder="Your Brand"
            />
          </InspectorSection>
          <InspectorSection title="Navigation Links">
            {(content.links || []).map((link, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={link.label || ''}
                  onChange={(e) => {
                    const newLinks = [...(content.links || [])];
                    newLinks[idx] = { ...newLinks[idx], label: e.target.value };
                    handleContentUpdate('links', newLinks);
                  }}
                  placeholder="Label"
                  className="flex-1 px-2 py-1.5 rounded bg-white/5 border border-white/10 text-xs"
                />
                <input
                  type="text"
                  value={link.href || ''}
                  onChange={(e) => {
                    const newLinks = [...(content.links || [])];
                    newLinks[idx] = { ...newLinks[idx], href: e.target.value };
                    handleContentUpdate('links', newLinks);
                  }}
                  placeholder="/page"
                  className="flex-1 px-2 py-1.5 rounded bg-white/5 border border-white/10 text-xs"
                />
                <button
                  type="button"
                  onClick={() => {
                    const newLinks = [...(content.links || [])];
                    newLinks.splice(idx, 1);
                    handleContentUpdate('links', newLinks);
                  }}
                  className="px-2 text-red-400 hover:text-red-300"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                const newLinks = [...(content.links || []), { label: 'Link', href: '/' }];
                handleContentUpdate('links', newLinks);
              }}
              className="w-full py-2 rounded-lg bg-indigo-500/20 text-indigo-400 text-xs font-medium hover:bg-indigo-500/30"
            >
              + Add Link
            </button>
          </InspectorSection>
          <InspectorSection title="CTA Button">
            <TextField
              label="Label"
              value={content.cta?.label || ''}
              onChange={(v) => handleContentUpdate('cta', { ...content.cta, label: v })}
              placeholder="Get Started"
            />
            <TextField
              label="Link"
              value={content.cta?.href || ''}
              onChange={(v) => handleContentUpdate('cta', { ...content.cta, href: v })}
              placeholder="https://..."
            />
          </InspectorSection>
        </div>
      );

    case 'FOOTER':
      return (
        <div className="p-4 space-y-4">
          <InspectorSection title="Content">
            <TextField
              label="Logo Text"
              value={content.logo?.text || ''}
              onChange={(v) => handleContentUpdate('logo', { ...content.logo, text: v })}
              placeholder="Your Brand"
            />
            <TextField
              label="Copyright"
              value={content.copyright || ''}
              onChange={(v) => handleContentUpdate('copyright', v)}
              placeholder="© 2024 Company"
            />
          </InspectorSection>
        </div>
      );

    case 'CTA':
      return (
        <div className="p-4 space-y-4">
          <InspectorSection title="Content">
            <TextField
              label="Headline"
              value={content.headline || ''}
              onChange={(v) => handleContentUpdate('headline', v)}
              placeholder="Ready to Get Started?"
            />
            <TextareaField
              label="Description"
              value={content.description || ''}
              onChange={(v) => handleContentUpdate('description', v)}
              placeholder="Supporting text..."
              rows={2}
            />
          </InspectorSection>
          <InspectorSection title="Primary Button">
            <TextField
              label="Label"
              value={content.primaryCta?.label || ''}
              onChange={(v) => handleContentUpdate('primaryCta', { ...content.primaryCta, label: v })}
              placeholder="Get Started"
            />
            <TextField
              label="Link"
              value={content.primaryCta?.href || ''}
              onChange={(v) => handleContentUpdate('primaryCta', { ...content.primaryCta, href: v })}
              placeholder="https://..."
            />
          </InspectorSection>
        </div>
      );

    case 'CARDS':
      return (
        <div className="p-4 space-y-4">
          <InspectorSection title="Cards">
            {(content.cards || []).map((card, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-white/5 border border-white/10 space-y-2 mb-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium">Card {idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const newCards = [...(content.cards || [])];
                      newCards.splice(idx, 1);
                      handleContentUpdate('cards', newCards);
                    }}
                    className="text-xs text-red-400 hover:text-red-300"
                  >
                    Remove
                  </button>
                </div>
                <TextField
                  label="Title"
                  value={card.title || ''}
                  onChange={(v) => {
                    const newCards = [...(content.cards || [])];
                    newCards[idx] = { ...newCards[idx], title: v };
                    handleContentUpdate('cards', newCards);
                  }}
                  placeholder="Card title"
                />
                <TextareaField
                  label="Description"
                  value={card.text || ''}
                  onChange={(v) => {
                    const newCards = [...(content.cards || [])];
                    newCards[idx] = { ...newCards[idx], text: v };
                    handleContentUpdate('cards', newCards);
                  }}
                  placeholder="Card description"
                  rows={2}
                />
                <ImageUploadField
                  label="Image"
                  value={card.image || ''}
                  onChange={(v) => {
                    const newCards = [...(content.cards || [])];
                    newCards[idx] = { ...newCards[idx], image: v };
                    handleContentUpdate('cards', newCards);
                  }}
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                const newCards = [...(content.cards || []), { title: 'New Card', text: 'Description' }];
                handleContentUpdate('cards', newCards);
              }}
              className="w-full py-2 rounded-lg bg-indigo-500/20 text-indigo-400 text-xs font-medium hover:bg-indigo-500/30"
            >
              + Add Card
            </button>
          </InspectorSection>
        </div>
      );

    case 'STATS':
      return (
        <div className="p-4 space-y-4">
          <InspectorSection title="Stats">
            {(content.items || []).map((item, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={item.value || ''}
                  onChange={(e) => {
                    const newItems = [...(content.items || [])];
                    newItems[idx] = { ...newItems[idx], value: e.target.value };
                    handleContentUpdate('items', newItems);
                  }}
                  placeholder="100+"
                  className="w-20 px-2 py-1.5 rounded bg-white/5 border border-white/10 text-xs"
                />
                <input
                  type="text"
                  value={item.label || ''}
                  onChange={(e) => {
                    const newItems = [...(content.items || [])];
                    newItems[idx] = { ...newItems[idx], label: e.target.value };
                    handleContentUpdate('items', newItems);
                  }}
                  placeholder="Customers"
                  className="flex-1 px-2 py-1.5 rounded bg-white/5 border border-white/10 text-xs"
                />
                <button
                  type="button"
                  onClick={() => {
                    const newItems = [...(content.items || [])];
                    newItems.splice(idx, 1);
                    handleContentUpdate('items', newItems);
                  }}
                  className="px-2 text-red-400 hover:text-red-300"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                const newItems = [...(content.items || []), { value: '0', label: 'Label' }];
                handleContentUpdate('items', newItems);
              }}
              className="w-full py-2 rounded-lg bg-indigo-500/20 text-indigo-400 text-xs font-medium hover:bg-indigo-500/30"
            >
              + Add Stat
            </button>
          </InspectorSection>
        </div>
      );

    case 'VIDEO':
      return (
        <div className="p-4 space-y-4">
          <InspectorSection title="Video">
            <TextField
              label="Video URL"
              value={content.url || ''}
              onChange={(v) => handleContentUpdate('url', v)}
              placeholder="https://youtube.com/embed/..."
            />
            <ToggleField
              label="Autoplay"
              value={content.autoplay || false}
              onChange={(v) => handleContentUpdate('autoplay', v)}
            />
            <ToggleField
              label="Loop"
              value={content.loop || false}
              onChange={(v) => handleContentUpdate('loop', v)}
            />
          </InspectorSection>
        </div>
      );

    case 'GALLERY':
      return (
        <div className="p-4 space-y-4">
          <InspectorSection title="Gallery Settings">
            <SelectField
              label="Columns"
              value={String(content.columns || 3)}
              onChange={(v) => handleContentUpdate('columns', parseInt(v))}
              options={[
                { value: '2', label: '2 Columns' },
                { value: '3', label: '3 Columns' },
                { value: '4', label: '4 Columns' },
              ]}
            />
          </InspectorSection>
          <InspectorSection title="Images">
            {(content.images || []).map((img, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-white/5 border border-white/10 mb-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium">Image {idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const newImages = [...(content.images || [])];
                      newImages.splice(idx, 1);
                      handleContentUpdate('images', newImages);
                    }}
                    className="text-xs text-red-400 hover:text-red-300"
                  >
                    Remove
                  </button>
                </div>
                <ImageUploadField
                  label=""
                  value={typeof img === 'string' ? img : img.src || ''}
                  onChange={(v) => {
                    const newImages = [...(content.images || [])];
                    newImages[idx] = v;
                    handleContentUpdate('images', newImages);
                  }}
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                const newImages = [...(content.images || []), ''];
                handleContentUpdate('images', newImages);
              }}
              className="w-full py-2 rounded-lg bg-indigo-500/20 text-indigo-400 text-xs font-medium hover:bg-indigo-500/30"
            >
              + Add Image
            </button>
          </InspectorSection>
        </div>
      );

    case 'ICON_BOX':
      return (
        <div className="p-4 space-y-4">
          <InspectorSection title="Content">
            <TextField
              label="Icon"
              value={content.icon || ''}
              onChange={(v) => handleContentUpdate('icon', v)}
              placeholder="★"
            />
            <TextField
              label="Title"
              value={content.title || ''}
              onChange={(v) => handleContentUpdate('title', v)}
              placeholder="Title"
            />
            <TextareaField
              label="Description"
              value={content.description || ''}
              onChange={(v) => handleContentUpdate('description', v)}
              placeholder="Description..."
              rows={2}
            />
          </InspectorSection>
        </div>
      );

    case 'COUNTER':
      return (
        <div className="p-4 space-y-4">
          <InspectorSection title="Content">
            <TextField
              label="End Value"
              value={String(content.endValue || 100)}
              onChange={(v) => handleContentUpdate('endValue', parseInt(v) || 0)}
              placeholder="100"
            />
            <TextField
              label="Prefix"
              value={content.prefix || ''}
              onChange={(v) => handleContentUpdate('prefix', v)}
              placeholder="$"
            />
            <TextField
              label="Suffix"
              value={content.suffix || ''}
              onChange={(v) => handleContentUpdate('suffix', v)}
              placeholder="+"
            />
            <TextField
              label="Title"
              value={content.title || ''}
              onChange={(v) => handleContentUpdate('title', v)}
              placeholder="Happy Customers"
            />
          </InspectorSection>
        </div>
      );

    case 'SOCIAL_ICONS':
      return (
        <div className="p-4 space-y-4">
          <InspectorSection title="Social Links">
            {(content.icons || []).map((icon, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <select
                  value={icon.platform || ''}
                  onChange={(e) => {
                    const newIcons = [...(content.icons || [])];
                    newIcons[idx] = { ...newIcons[idx], platform: e.target.value };
                    handleContentUpdate('icons', newIcons);
                  }}
                  className="w-28 px-2 py-1.5 rounded bg-white/5 border border-white/10 text-xs"
                >
                  <option value="facebook">Facebook</option>
                  <option value="twitter">Twitter</option>
                  <option value="instagram">Instagram</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="youtube">YouTube</option>
                </select>
                <input
                  type="text"
                  value={icon.url || ''}
                  onChange={(e) => {
                    const newIcons = [...(content.icons || [])];
                    newIcons[idx] = { ...newIcons[idx], url: e.target.value };
                    handleContentUpdate('icons', newIcons);
                  }}
                  placeholder="https://..."
                  className="flex-1 px-2 py-1.5 rounded bg-white/5 border border-white/10 text-xs"
                />
                <button
                  type="button"
                  onClick={() => {
                    const newIcons = [...(content.icons || [])];
                    newIcons.splice(idx, 1);
                    handleContentUpdate('icons', newIcons);
                  }}
                  className="px-2 text-red-400 hover:text-red-300"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                const newIcons = [...(content.icons || []), { platform: 'facebook', url: '#' }];
                handleContentUpdate('icons', newIcons);
              }}
              className="w-full py-2 rounded-lg bg-indigo-500/20 text-indigo-400 text-xs font-medium hover:bg-indigo-500/30"
            >
              + Add Social Link
            </button>
          </InspectorSection>
        </div>
      );

    case 'ACCORDION':
      return (
        <div className="p-4 space-y-4">
          <InspectorSection title="Accordion Items">
            {(content.items || []).map((item, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-white/5 border border-white/10 space-y-2 mb-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium">Item {idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const newItems = [...(content.items || [])];
                      newItems.splice(idx, 1);
                      handleContentUpdate('items', newItems);
                    }}
                    className="text-xs text-red-400 hover:text-red-300"
                  >
                    Remove
                  </button>
                </div>
                <TextField
                  label="Title"
                  value={item.title || ''}
                  onChange={(v) => {
                    const newItems = [...(content.items || [])];
                    newItems[idx] = { ...newItems[idx], title: v };
                    handleContentUpdate('items', newItems);
                  }}
                  placeholder="Accordion title"
                />
                <TextareaField
                  label="Content"
                  value={item.content || ''}
                  onChange={(v) => {
                    const newItems = [...(content.items || [])];
                    newItems[idx] = { ...newItems[idx], content: v };
                    handleContentUpdate('items', newItems);
                  }}
                  placeholder="Content..."
                  rows={2}
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                const newItems = [...(content.items || []), { title: 'New Item', content: 'Content here' }];
                handleContentUpdate('items', newItems);
              }}
              className="w-full py-2 rounded-lg bg-indigo-500/20 text-indigo-400 text-xs font-medium hover:bg-indigo-500/30"
            >
              + Add Item
            </button>
          </InspectorSection>
        </div>
      );

    case 'LOGO_CLOUD':
      return (
        <div className="p-4 space-y-4">
          <InspectorSection title="Content">
            <TextField
              label="Label"
              value={content.label || ''}
              onChange={(v) => handleContentUpdate('label', v)}
              placeholder="Trusted by"
            />
          </InspectorSection>
          <InspectorSection title="Logos">
            {(content.logos || []).map((logo, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={logo.alt || ''}
                  onChange={(e) => {
                    const newLogos = [...(content.logos || [])];
                    newLogos[idx] = { ...newLogos[idx], alt: e.target.value };
                    handleContentUpdate('logos', newLogos);
                  }}
                  placeholder="Company name"
                  className="flex-1 px-2 py-1.5 rounded bg-white/5 border border-white/10 text-xs"
                />
                <button
                  type="button"
                  onClick={() => {
                    const newLogos = [...(content.logos || [])];
                    newLogos.splice(idx, 1);
                    handleContentUpdate('logos', newLogos);
                  }}
                  className="px-2 text-red-400 hover:text-red-300"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                const newLogos = [...(content.logos || []), { src: '', alt: 'Company' }];
                handleContentUpdate('logos', newLogos);
              }}
              className="w-full py-2 rounded-lg bg-indigo-500/20 text-indigo-400 text-xs font-medium hover:bg-indigo-500/30"
            >
              + Add Logo
            </button>
          </InspectorSection>
        </div>
      );

    case 'TEAM':
      return (
        <div className="p-4 space-y-4">
          <InspectorSection title="Content">
            <TextField
              label="Headline"
              value={content.headline || ''}
              onChange={(v) => handleContentUpdate('headline', v)}
              placeholder="Meet Our Team"
            />
          </InspectorSection>
          <InspectorSection title="Team Members">
            {(content.members || []).map((member, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-white/5 border border-white/10 space-y-2 mb-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium">Member {idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const newMembers = [...(content.members || [])];
                      newMembers.splice(idx, 1);
                      handleContentUpdate('members', newMembers);
                    }}
                    className="text-xs text-red-400 hover:text-red-300"
                  >
                    Remove
                  </button>
                </div>
                <TextField
                  label="Name"
                  value={member.name || ''}
                  onChange={(v) => {
                    const newMembers = [...(content.members || [])];
                    newMembers[idx] = { ...newMembers[idx], name: v };
                    handleContentUpdate('members', newMembers);
                  }}
                  placeholder="John Doe"
                />
                <TextField
                  label="Role"
                  value={member.role || ''}
                  onChange={(v) => {
                    const newMembers = [...(content.members || [])];
                    newMembers[idx] = { ...newMembers[idx], role: v };
                    handleContentUpdate('members', newMembers);
                  }}
                  placeholder="CEO"
                />
                <ImageUploadField
                  label="Photo"
                  value={member.image || ''}
                  onChange={(v) => {
                    const newMembers = [...(content.members || [])];
                    newMembers[idx] = { ...newMembers[idx], image: v };
                    handleContentUpdate('members', newMembers);
                  }}
                />
                <TextareaField
                  label="Bio"
                  value={member.bio || ''}
                  onChange={(v) => {
                    const newMembers = [...(content.members || [])];
                    newMembers[idx] = { ...newMembers[idx], bio: v };
                    handleContentUpdate('members', newMembers);
                  }}
                  placeholder="Short bio..."
                  rows={2}
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                const newMembers = [...(content.members || []), { name: 'New Member', role: 'Role', image: '', bio: '' }];
                handleContentUpdate('members', newMembers);
              }}
              className="w-full py-2 rounded-lg bg-indigo-500/20 text-indigo-400 text-xs font-medium hover:bg-indigo-500/30"
            >
              + Add Member
            </button>
          </InspectorSection>
        </div>
      );

    case 'IMAGE_BOX':
      return (
        <div className="p-4 space-y-4">
          <InspectorSection title="Image">
            <ImageUploadField
              label="Image"
              value={content.src || ''}
              onChange={(v) => handleContentUpdate('src', v)}
            />
          </InspectorSection>
          <InspectorSection title="Content">
            <TextField
              label="Title"
              value={content.title || ''}
              onChange={(v) => handleContentUpdate('title', v)}
              placeholder="Title"
            />
            <TextareaField
              label="Description"
              value={content.description || ''}
              onChange={(v) => handleContentUpdate('description', v)}
              placeholder="Description..."
              rows={3}
            />
          </InspectorSection>
        </div>
      );

    case 'PROGRESS_BAR':
      return (
        <div className="p-4 space-y-4">
          <InspectorSection title="Content">
            <TextField
              label="Title"
              value={content.title || ''}
              onChange={(v) => handleContentUpdate('title', v)}
              placeholder="Web Development"
            />
            <RangeField
              label="Percentage"
              value={content.percentage || 0}
              onChange={(v) => handleContentUpdate('percentage', v)}
              min={0}
              max={100}
              unit="%"
            />
          </InspectorSection>
        </div>
      );

    case 'TABS':
      return (
        <div className="p-4 space-y-4">
          <InspectorSection title="Tabs">
            {(content.tabs || []).map((tab, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-white/5 border border-white/10 space-y-2 mb-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium">Tab {idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const newTabs = [...(content.tabs || [])];
                      newTabs.splice(idx, 1);
                      handleContentUpdate('tabs', newTabs);
                    }}
                    className="text-xs text-red-400 hover:text-red-300"
                  >
                    Remove
                  </button>
                </div>
                <TextField
                  label="Title"
                  value={tab.title || ''}
                  onChange={(v) => {
                    const newTabs = [...(content.tabs || [])];
                    newTabs[idx] = { ...newTabs[idx], title: v };
                    handleContentUpdate('tabs', newTabs);
                  }}
                  placeholder="Tab title"
                />
                <TextareaField
                  label="Content"
                  value={tab.content || ''}
                  onChange={(v) => {
                    const newTabs = [...(content.tabs || [])];
                    newTabs[idx] = { ...newTabs[idx], content: v };
                    handleContentUpdate('tabs', newTabs);
                  }}
                  placeholder="Tab content..."
                  rows={3}
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                const newTabs = [...(content.tabs || []), { title: 'New Tab', content: 'Tab content' }];
                handleContentUpdate('tabs', newTabs);
              }}
              className="w-full py-2 rounded-lg bg-indigo-500/20 text-indigo-400 text-xs font-medium hover:bg-indigo-500/30"
            >
              + Add Tab
            </button>
          </InspectorSection>
        </div>
      );

    case 'CAROUSEL':
      return (
        <div className="p-4 space-y-4">
          <InspectorSection title="Settings">
            <ToggleField
              label="Autoplay"
              value={content.autoplay || false}
              onChange={(v) => handleContentUpdate('autoplay', v)}
            />
            <ToggleField
              label="Show Dots"
              value={content.dots !== false}
              onChange={(v) => handleContentUpdate('dots', v)}
            />
            <ToggleField
              label="Show Arrows"
              value={content.arrows !== false}
              onChange={(v) => handleContentUpdate('arrows', v)}
            />
          </InspectorSection>
          <InspectorSection title="Slides">
            {(content.slides || []).map((slide, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-white/5 border border-white/10 space-y-2 mb-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium">Slide {idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const newSlides = [...(content.slides || [])];
                      newSlides.splice(idx, 1);
                      handleContentUpdate('slides', newSlides);
                    }}
                    className="text-xs text-red-400 hover:text-red-300"
                  >
                    Remove
                  </button>
                </div>
                <ImageUploadField
                  label="Image"
                  value={slide.image || ''}
                  onChange={(v) => {
                    const newSlides = [...(content.slides || [])];
                    newSlides[idx] = { ...newSlides[idx], image: v };
                    handleContentUpdate('slides', newSlides);
                  }}
                />
                <TextField
                  label="Title"
                  value={slide.title || ''}
                  onChange={(v) => {
                    const newSlides = [...(content.slides || [])];
                    newSlides[idx] = { ...newSlides[idx], title: v };
                    handleContentUpdate('slides', newSlides);
                  }}
                  placeholder="Slide title"
                />
                <TextField
                  label="Description"
                  value={slide.description || ''}
                  onChange={(v) => {
                    const newSlides = [...(content.slides || [])];
                    newSlides[idx] = { ...newSlides[idx], description: v };
                    handleContentUpdate('slides', newSlides);
                  }}
                  placeholder="Slide description"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                const newSlides = [...(content.slides || []), { image: '', title: 'New Slide', description: '' }];
                handleContentUpdate('slides', newSlides);
              }}
              className="w-full py-2 rounded-lg bg-indigo-500/20 text-indigo-400 text-xs font-medium hover:bg-indigo-500/30"
            >
              + Add Slide
            </button>
          </InspectorSection>
        </div>
      );

    default:
      return (
        <div className="p-4">
          <InspectorSection title="Content">
            <div className="text-xs text-white/50 mb-2">
              {widgetDef?.name || widget.widgetType} widget
            </div>
            <div className="text-xs text-white/40">
              Select this widget on the canvas to edit it inline, or customize its style in the Style tab.
            </div>
          </InspectorSection>
        </div>
      );
  }
}

function StylePanel({ element }) {
  const { type, element: el, section, column } = element;
  const { state, actions } = useBuilder();
  const { viewport } = state;

  const handleStyleUpdate = useCallback((updates) => {
    const styleKey = viewport === 'desktop' ? 'style' : 'responsiveStyle';
    
    if (type === 'section') {
      if (viewport === 'desktop') {
        actions.updateSection(el.id, { style: { ...el.style, ...updates } });
      } else {
        actions.updateSection(el.id, { 
          responsiveStyle: { 
            ...el.responsiveStyle, 
            [viewport]: { ...el.responsiveStyle?.[viewport], ...updates } 
          } 
        });
      }
    } else if (type === 'column') {
      if (viewport === 'desktop') {
        actions.updateColumn(section.id, el.id, { style: { ...el.style, ...updates } });
      } else {
        actions.updateColumn(section.id, el.id, { 
          responsiveStyle: { 
            ...el.responsiveStyle, 
            [viewport]: { ...el.responsiveStyle?.[viewport], ...updates } 
          } 
        });
      }
    } else if (type === 'widget') {
      if (viewport === 'desktop') {
        actions.updateWidget(section.id, column.id, el.id, { style: { ...el.style, ...updates } });
      } else {
        actions.updateWidget(section.id, column.id, el.id, { 
          responsiveStyle: { 
            ...el.responsiveStyle, 
            [viewport]: { ...el.responsiveStyle?.[viewport], ...updates } 
          } 
        });
      }
    }
  }, [type, el, section, column, viewport, actions]);

  const currentStyle = viewport === 'desktop' 
    ? el.style || {} 
    : { ...el.style, ...el.responsiveStyle?.[viewport] };

  return (
    <div className="p-4 space-y-4">
      {/* Layout Section - Elementor-like */}
      <InspectorSection title="Layout">
        <TextField
          label="Width"
          value={currentStyle.width || ''}
          onChange={(v) => handleStyleUpdate({ width: v })}
          placeholder="100% or 500px"
        />
        <TextField
          label="Max Width"
          value={currentStyle.maxWidth || ''}
          onChange={(v) => handleStyleUpdate({ maxWidth: v })}
          placeholder="1200px"
        />
        <TextField
          label="Min Height"
          value={currentStyle.minHeight || ''}
          onChange={(v) => handleStyleUpdate({ minHeight: v })}
          placeholder="400px"
        />
        <SelectField
          label="Overflow"
          value={currentStyle.overflow || ''}
          onChange={(v) => handleStyleUpdate({ overflow: v })}
          options={[
            { value: '', label: 'Default' },
            { value: 'visible', label: 'Visible' },
            { value: 'hidden', label: 'Hidden' },
            { value: 'auto', label: 'Auto' },
          ]}
        />
      </InspectorSection>

      <InspectorSection title="Typography">
        <ColorField
          label="Color"
          value={currentStyle.color || ''}
          onChange={(v) => handleStyleUpdate({ color: v })}
        />
        <TextField
          label="Font Size"
          value={currentStyle.fontSize || ''}
          onChange={(v) => handleStyleUpdate({ fontSize: v })}
          placeholder="16px"
        />
        <SelectField
          label="Font Weight"
          value={currentStyle.fontWeight || ''}
          onChange={(v) => handleStyleUpdate({ fontWeight: v })}
          options={[
            { value: '', label: 'Default' },
            { value: '300', label: 'Light' },
            { value: '400', label: 'Normal' },
            { value: '500', label: 'Medium' },
            { value: '600', label: 'Semi Bold' },
            { value: '700', label: 'Bold' },
          ]}
        />
        <SelectField
          label="Text Align"
          value={currentStyle.textAlign || ''}
          onChange={(v) => handleStyleUpdate({ textAlign: v })}
          options={[
            { value: '', label: 'Default' },
            { value: 'left', label: 'Left' },
            { value: 'center', label: 'Center' },
            { value: 'right', label: 'Right' },
            { value: 'justify', label: 'Justify' },
          ]}
        />
        <TextField
          label="Line Height"
          value={currentStyle.lineHeight || ''}
          onChange={(v) => handleStyleUpdate({ lineHeight: v })}
          placeholder="1.5"
        />
        <TextField
          label="Letter Spacing"
          value={currentStyle.letterSpacing || ''}
          onChange={(v) => handleStyleUpdate({ letterSpacing: v })}
          placeholder="0.5px"
        />
      </InspectorSection>

      <InspectorSection title="Background">
        <ColorField
          label="Color"
          value={currentStyle.backgroundColor || ''}
          onChange={(v) => handleStyleUpdate({ backgroundColor: v })}
        />
        <ImageUploadField
          label="Image"
          value={currentStyle.backgroundImage?.replace(/url\(['"]?|['"]?\)/g, '') || ''}
          onChange={(v) => handleStyleUpdate({ backgroundImage: v ? `url(${v})` : '' })}
        />
        <SelectField
          label="Size"
          value={currentStyle.backgroundSize || ''}
          onChange={(v) => handleStyleUpdate({ backgroundSize: v })}
          options={[
            { value: '', label: 'Default' },
            { value: 'cover', label: 'Cover' },
            { value: 'contain', label: 'Contain' },
            { value: 'auto', label: 'Auto' },
          ]}
        />
        <SelectField
          label="Position"
          value={currentStyle.backgroundPosition || ''}
          onChange={(v) => handleStyleUpdate({ backgroundPosition: v })}
          options={[
            { value: '', label: 'Default' },
            { value: 'center', label: 'Center' },
            { value: 'top', label: 'Top' },
            { value: 'bottom', label: 'Bottom' },
            { value: 'left', label: 'Left' },
            { value: 'right', label: 'Right' },
          ]}
        />
      </InspectorSection>

      <InspectorSection title="Spacing">
        <SpacingField
          label="Padding"
          value={{
            top: currentStyle.paddingTop || '',
            right: currentStyle.paddingRight || '',
            bottom: currentStyle.paddingBottom || '',
            left: currentStyle.paddingLeft || '',
          }}
          onChange={(v) => handleStyleUpdate({
            paddingTop: v.top,
            paddingRight: v.right,
            paddingBottom: v.bottom,
            paddingLeft: v.left,
          })}
        />
        <SpacingField
          label="Margin"
          value={{
            top: currentStyle.marginTop || '',
            right: currentStyle.marginRight || '',
            bottom: currentStyle.marginBottom || '',
            left: currentStyle.marginLeft || '',
          }}
          onChange={(v) => handleStyleUpdate({
            marginTop: v.top,
            marginRight: v.right,
            marginBottom: v.bottom,
            marginLeft: v.left,
          })}
        />
      </InspectorSection>

      <InspectorSection title="Border">
        <SelectField
          label="Style"
          value={currentStyle.borderStyle || ''}
          onChange={(v) => handleStyleUpdate({ borderStyle: v })}
          options={[
            { value: '', label: 'None' },
            { value: 'solid', label: 'Solid' },
            { value: 'dashed', label: 'Dashed' },
            { value: 'dotted', label: 'Dotted' },
            { value: 'double', label: 'Double' },
          ]}
        />
        <ColorField
          label="Color"
          value={currentStyle.borderColor || ''}
          onChange={(v) => handleStyleUpdate({ borderColor: v })}
        />
        <TextField
          label="Width"
          value={currentStyle.borderWidth || ''}
          onChange={(v) => handleStyleUpdate({ borderWidth: v })}
          placeholder="1px"
        />
        <TextField
          label="Radius"
          value={currentStyle.borderRadius || ''}
          onChange={(v) => handleStyleUpdate({ borderRadius: v })}
          placeholder="8px"
        />
      </InspectorSection>

      <InspectorSection title="Effects">
        <TextField
          label="Box Shadow"
          value={currentStyle.boxShadow || ''}
          onChange={(v) => handleStyleUpdate({ boxShadow: v })}
          placeholder="0 4px 6px rgba(0,0,0,0.1)"
        />
        <TextField
          label="Opacity"
          value={currentStyle.opacity || ''}
          onChange={(v) => handleStyleUpdate({ opacity: v })}
          placeholder="1"
        />
        <TextField
          label="Transform"
          value={currentStyle.transform || ''}
          onChange={(v) => handleStyleUpdate({ transform: v })}
          placeholder="rotate(5deg)"
        />
      </InspectorSection>
    </div>
  );
}

function AdvancedPanel({ element }) {
  const { type, element: el, section, column } = element;
  const { state, actions } = useBuilder();
  const { viewport } = state;

  const handleSettingsUpdate = useCallback((updates) => {
    if (type === 'section') {
      actions.updateSection(el.id, { settings: { ...el.settings, ...updates } });
    } else if (type === 'column') {
      actions.updateColumn(section.id, el.id, { settings: { ...el.settings, ...updates } });
    } else if (type === 'widget') {
      actions.updateWidget(section.id, column.id, el.id, { settings: { ...el.settings, ...updates } });
    }
  }, [type, el, section, column, actions]);

  const settings = el.settings || {};

  return (
    <div className="p-4 space-y-4">
      <InspectorSection title="Responsive Visibility">
        <ToggleField
          label="Hide on Desktop"
          value={settings.hideOnDesktop || false}
          onChange={(v) => handleSettingsUpdate({ hideOnDesktop: v })}
        />
        <ToggleField
          label="Hide on Tablet"
          value={settings.hideOnTablet || false}
          onChange={(v) => handleSettingsUpdate({ hideOnTablet: v })}
        />
        <ToggleField
          label="Hide on Mobile"
          value={settings.hideOnMobile || false}
          onChange={(v) => handleSettingsUpdate({ hideOnMobile: v })}
        />
      </InspectorSection>

      <InspectorSection title="Custom CSS">
        <TextareaField
          label="CSS"
          value={settings.customCSS || ''}
          onChange={(v) => handleSettingsUpdate({ customCSS: v })}
          placeholder=".selector { property: value; }"
          rows={6}
          mono
        />
      </InspectorSection>

      <InspectorSection title="Custom ID & Classes">
        <TextField
          label="CSS ID"
          value={settings.cssId || ''}
          onChange={(v) => handleSettingsUpdate({ cssId: v })}
          placeholder="my-element"
        />
        <TextField
          label="CSS Classes"
          value={settings.cssClasses || ''}
          onChange={(v) => handleSettingsUpdate({ cssClasses: v })}
          placeholder="class1 class2"
        />
      </InspectorSection>

      <InspectorSection title="Z-Index">
        <TextField
          label="Z-Index"
          value={settings.zIndex || ''}
          onChange={(v) => handleSettingsUpdate({ zIndex: v })}
          placeholder="auto"
        />
      </InspectorSection>
    </div>
  );
}

// Field Components
function InspectorSection({ title, children }) {
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

function TextField({ label, value, onChange, placeholder, mono }) {
  return (
    <div>
      <label className="block text-xs text-white/60 mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm focus:border-indigo-500 focus:outline-none ${mono ? 'font-mono' : ''}`}
      />
    </div>
  );
}

function TextareaField({ label, value, onChange, placeholder, rows = 3, mono }) {
  return (
    <div>
      <label className="block text-xs text-white/60 mb-1">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={`w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm focus:border-indigo-500 focus:outline-none resize-none ${mono ? 'font-mono text-xs' : ''}`}
      />
    </div>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <div>
      <label className="block text-xs text-white/60 mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm focus:border-indigo-500 focus:outline-none"
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

function ColorField({ label, value, onChange }) {
  return (
    <div>
      <label className="block text-xs text-white/60 mb-1">{label}</label>
      <div className="flex gap-2">
        <input
          type="color"
          value={value || '#ffffff'}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-10 rounded cursor-pointer bg-transparent"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm focus:border-indigo-500 focus:outline-none"
        />
      </div>
    </div>
  );
}

function RangeField({ label, value, onChange, min, max, unit }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="text-xs text-white/60">{label}</label>
        <span className="text-xs text-white/50">{value}{unit}</span>
      </div>
      <input
        type="range"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        className="w-full"
      />
    </div>
  );
}

function ToggleField({ label, value, onChange }) {
  return (
    <div className="flex items-center justify-between">
      <label className="text-xs text-white/60">{label}</label>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`w-10 h-6 rounded-full transition-colors ${value ? 'bg-indigo-500' : 'bg-white/20'}`}
      >
        <div className={`w-4 h-4 rounded-full bg-white transition-transform ${value ? 'translate-x-5' : 'translate-x-1'}`} />
      </button>
    </div>
  );
}

function SpacingField({ label, value, onChange }) {
  const [linked, setLinked] = useState(true);

  const handleChange = (side, val) => {
    if (linked) {
      onChange({ top: val, right: val, bottom: val, left: val });
    } else {
      onChange({ ...value, [side]: val });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs text-white/60">{label}</label>
        <button
          type="button"
          onClick={() => setLinked(!linked)}
          className={`text-xs px-2 py-0.5 rounded ${linked ? 'bg-indigo-500/30 text-indigo-400' : 'bg-white/10 text-white/50'}`}
        >
          {linked ? '🔗' : '⛓️‍💥'}
        </button>
      </div>
      <div className="grid grid-cols-4 gap-1">
        <input
          type="text"
          value={value.top}
          onChange={(e) => handleChange('top', e.target.value)}
          placeholder="T"
          className="px-2 py-1.5 rounded bg-white/5 border border-white/10 text-xs text-center focus:border-indigo-500 focus:outline-none"
        />
        <input
          type="text"
          value={value.right}
          onChange={(e) => handleChange('right', e.target.value)}
          placeholder="R"
          className="px-2 py-1.5 rounded bg-white/5 border border-white/10 text-xs text-center focus:border-indigo-500 focus:outline-none"
        />
        <input
          type="text"
          value={value.bottom}
          onChange={(e) => handleChange('bottom', e.target.value)}
          placeholder="B"
          className="px-2 py-1.5 rounded bg-white/5 border border-white/10 text-xs text-center focus:border-indigo-500 focus:outline-none"
        />
        <input
          type="text"
          value={value.left}
          onChange={(e) => handleChange('left', e.target.value)}
          placeholder="L"
          className="px-2 py-1.5 rounded bg-white/5 border border-white/10 text-xs text-center focus:border-indigo-500 focus:outline-none"
        />
      </div>
    </div>
  );
}

function ImageUploadField({ label, value, onChange, websiteId }) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // For now, convert to base64 data URL (works without backend upload)
    // In production, this would upload to the server
    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        onChange(event.target.result);
        setUploading(false);
      };
      reader.onerror = () => {
        setUploading(false);
        alert('Failed to read file');
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setUploading(false);
      console.error('Upload error:', err);
    }
  };

  return (
    <div>
      <label className="block text-xs text-white/60 mb-1">{label}</label>
      <div className="space-y-2">
        {value && (
          <div className="relative rounded-lg overflow-hidden bg-white/5 border border-white/10">
            <img src={value} alt="Preview" className="w-full h-20 object-cover" />
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/50 flex items-center justify-center text-xs hover:bg-black/70"
            >
              ×
            </button>
          </div>
        )}
        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex-1 py-2 rounded-lg bg-white/5 border border-white/10 text-xs hover:bg-white/10 transition-colors disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : '📁 Upload Image'}
          </button>
        </div>
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Or paste image URL..."
          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs focus:border-indigo-500 focus:outline-none"
        />
      </div>
    </div>
  );
}
