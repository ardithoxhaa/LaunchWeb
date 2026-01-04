import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../../lib/api.js';
import { SiteRenderer } from '../../components/website/SiteRenderer.jsx';
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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

function CollapsibleSection({ title, icon, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full px-3 py-2.5 flex items-center justify-between hover:bg-white/5 transition"
      >
        <div className="flex items-center gap-2">
          {icon ? <span className="text-white/60">{icon}</span> : null}
          <span className="text-xs font-semibold uppercase tracking-wide">{title}</span>
        </div>
        <span className="text-white/40 text-xs">{open ? '▾' : '▸'}</span>
      </button>
      {open ? <div className="px-3 pb-3 space-y-3">{children}</div> : null}
    </div>
  );
}

function ResponsiveTabs({ value, onChange }) {
  const tabs = [
    { id: 'desktop', icon: '🖥', label: 'Desktop' },
    { id: 'tablet', icon: '📱', label: 'Tablet' },
    { id: 'mobile', icon: '📲', label: 'Mobile' },
  ];
  return (
    <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-black/30 p-1">
      {tabs.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => onChange(t.id)}
          title={t.label}
          className={`flex-1 rounded-md px-2 py-1.5 text-center text-sm transition ${
            value === t.id ? 'bg-indigo-500/30 text-white' : 'text-white/60 hover:bg-white/10 hover:text-white'
          }`}
        >
          {t.icon}
        </button>
      ))}
    </div>
  );
}

function ColorPickerField({ label, value, onChange, placeholder }) {
  const safeValue = isHexColor(value) ? value.trim() : '#000000';
  return (
    <label className="block">
      <div className="text-[11px] font-medium text-white/60 uppercase tracking-wide mb-1">{label}</div>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={safeValue}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 w-10 rounded border border-white/10 bg-black/30 cursor-pointer"
        />
        <input
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 rounded-md border border-white/10 bg-black/30 px-2 py-1.5 text-xs"
          placeholder={placeholder}
        />
      </div>
    </label>
  );
}

function NumberSliderField({ label, value, onChange, min = 0, max = 200, step = 1, unit = 'px' }) {
  const vNum = value === null || value === undefined || value === '' ? null : Number(value);
  const sliderValue = Number.isFinite(vNum) ? vNum : min;

  return (
    <label className="block">
      <div className="text-[11px] font-medium text-white/60 uppercase tracking-wide mb-1">{label}</div>
      <div className="flex items-center gap-2">
        <input
          type="range"
          min={String(min)}
          max={String(max)}
          step={String(step)}
          value={String(sliderValue)}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 accent-indigo-500"
        />
        <div className="flex items-center gap-1">
          <input
            value={vNum == null ? '' : String(vNum)}
            onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))}
            className="w-14 rounded border border-white/10 bg-black/30 px-2 py-1 text-xs text-center"
          />
          <span className="text-[10px] text-white/40">{unit}</span>
        </div>
      </div>
    </label>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <label className="block">
      <div className="text-[11px] font-medium text-white/60 uppercase tracking-wide mb-1">{label}</div>
      <select
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-white/10 bg-black/30 px-2 py-1.5 text-xs"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function BoxSpacingControl({ label, values, onChange }) {
  const v = values ?? {};
  return (
    <div className="space-y-2">
      <div className="text-[11px] font-medium text-white/60 uppercase tracking-wide">{label}</div>
      <div className="grid grid-cols-4 gap-1">
        <div className="col-span-4 flex justify-center">
          <input
            type="number"
            value={v.top ?? ''}
            onChange={(e) => onChange({ ...v, top: e.target.value === '' ? null : Number(e.target.value) })}
            placeholder="T"
            className="w-14 rounded border border-white/10 bg-black/30 px-2 py-1 text-xs text-center"
          />
        </div>
        <div className="col-span-2 flex justify-end pr-2">
          <input
            type="number"
            value={v.left ?? ''}
            onChange={(e) => onChange({ ...v, left: e.target.value === '' ? null : Number(e.target.value) })}
            placeholder="L"
            className="w-14 rounded border border-white/10 bg-black/30 px-2 py-1 text-xs text-center"
          />
        </div>
        <div className="col-span-2 flex justify-start pl-2">
          <input
            type="number"
            value={v.right ?? ''}
            onChange={(e) => onChange({ ...v, right: e.target.value === '' ? null : Number(e.target.value) })}
            placeholder="R"
            className="w-14 rounded border border-white/10 bg-black/30 px-2 py-1 text-xs text-center"
          />
        </div>
        <div className="col-span-4 flex justify-center">
          <input
            type="number"
            value={v.bottom ?? ''}
            onChange={(e) => onChange({ ...v, bottom: e.target.value === '' ? null : Number(e.target.value) })}
            placeholder="B"
            className="w-14 rounded border border-white/10 bg-black/30 px-2 py-1 text-xs text-center"
          />
        </div>
      </div>
    </div>
  );
}

function LinkedBoxControl({ label, top, right, bottom, left, onChangeTop, onChangeRight, onChangeBottom, onChangeLeft }) {
  const [linked, setLinked] = useState(false);
  const handleChange = (setter, val) => {
    setter(val);
    if (linked) {
      onChangeTop(val);
      onChangeRight(val);
      onChangeBottom(val);
      onChangeLeft(val);
    }
  };
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="text-[11px] font-medium text-white/60 uppercase tracking-wide">{label}</div>
        <button
          type="button"
          onClick={() => setLinked(!linked)}
          className={`text-[10px] px-2 py-0.5 rounded ${linked ? 'bg-indigo-500/30 text-indigo-300' : 'bg-white/10 text-white/50'}`}
        >
          {linked ? '🔗 Linked' : '⛓ Link'}
        </button>
      </div>
      <div className="grid grid-cols-4 gap-1.5">
        <input
          type="number"
          value={top ?? ''}
          onChange={(e) => handleChange(onChangeTop, e.target.value === '' ? null : Number(e.target.value))}
          placeholder="↑"
          className="rounded border border-white/10 bg-black/30 px-2 py-1.5 text-xs text-center"
        />
        <input
          type="number"
          value={right ?? ''}
          onChange={(e) => handleChange(onChangeRight, e.target.value === '' ? null : Number(e.target.value))}
          placeholder="→"
          className="rounded border border-white/10 bg-black/30 px-2 py-1.5 text-xs text-center"
        />
        <input
          type="number"
          value={bottom ?? ''}
          onChange={(e) => handleChange(onChangeBottom, e.target.value === '' ? null : Number(e.target.value))}
          placeholder="↓"
          className="rounded border border-white/10 bg-black/30 px-2 py-1.5 text-xs text-center"
        />
        <input
          type="number"
          value={left ?? ''}
          onChange={(e) => handleChange(onChangeLeft, e.target.value === '' ? null : Number(e.target.value))}
          placeholder="←"
          className="rounded border border-white/10 bg-black/30 px-2 py-1.5 text-xs text-center"
        />
      </div>
    </div>
  );
}

function BorderControl({ border, onChange }) {
  const b = border ?? {};
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <SelectField
          label="Style"
          value={b.style ?? 'none'}
          onChange={(v) => onChange({ ...b, style: v })}
          options={[
            { value: 'none', label: 'None' },
            { value: 'solid', label: 'Solid' },
            { value: 'dashed', label: 'Dashed' },
            { value: 'dotted', label: 'Dotted' },
            { value: 'double', label: 'Double' },
          ]}
        />
        <NumberSliderField
          label="Width"
          value={b.width}
          onChange={(v) => onChange({ ...b, width: v })}
          min={0}
          max={20}
        />
      </div>
      <ColorPickerField
        label="Color"
        value={b.color ?? ''}
        onChange={(v) => onChange({ ...b, color: v })}
        placeholder="#ffffff"
      />
      <NumberSliderField
        label="Radius"
        value={b.radius}
        onChange={(v) => onChange({ ...b, radius: v })}
        min={0}
        max={100}
      />
    </div>
  );
}

function ShadowControl({ shadow, onChange }) {
  const s = shadow ?? {};
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <NumberSliderField label="X" value={s.x} onChange={(v) => onChange({ ...s, x: v })} min={-50} max={50} />
        <NumberSliderField label="Y" value={s.y} onChange={(v) => onChange({ ...s, y: v })} min={-50} max={50} />
        <NumberSliderField label="Blur" value={s.blur} onChange={(v) => onChange({ ...s, blur: v })} min={0} max={100} />
        <NumberSliderField label="Spread" value={s.spread} onChange={(v) => onChange({ ...s, spread: v })} min={-50} max={50} />
      </div>
      <ColorPickerField
        label="Color"
        value={s.color ?? ''}
        onChange={(v) => onChange({ ...s, color: v })}
        placeholder="rgba(0,0,0,0.25)"
      />
    </div>
  );
}

function TypographyControl({ styles, onChange }) {
  const s = styles ?? {};
  return (
    <div className="space-y-3">
      <SelectField
        label="Font Family"
        value={s.fontFamily ?? ''}
        onChange={(v) => onChange({ ...s, fontFamily: v || null })}
        options={[
          { value: '', label: 'Default' },
          { value: 'Inter, sans-serif', label: 'Inter' },
          { value: 'system-ui, sans-serif', label: 'System UI' },
          { value: 'Georgia, serif', label: 'Georgia' },
          { value: 'Menlo, monospace', label: 'Monospace' },
          { value: "'Playfair Display', serif", label: 'Playfair Display' },
          { value: "'Roboto', sans-serif", label: 'Roboto' },
          { value: "'Open Sans', sans-serif", label: 'Open Sans' },
        ]}
      />
      <div className="grid grid-cols-2 gap-2">
        <NumberSliderField
          label="Size"
          value={s.fontSize}
          onChange={(v) => onChange({ ...s, fontSize: v })}
          min={8}
          max={120}
        />
        <NumberSliderField
          label="Weight"
          value={s.fontWeight}
          onChange={(v) => onChange({ ...s, fontWeight: v })}
          min={100}
          max={900}
          step={100}
          unit=""
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <NumberSliderField
          label="Line Height"
          value={s.lineHeight}
          onChange={(v) => onChange({ ...s, lineHeight: v })}
          min={0.5}
          max={3}
          step={0.1}
          unit="em"
        />
        <NumberSliderField
          label="Letter Spacing"
          value={s.letterSpacing}
          onChange={(v) => onChange({ ...s, letterSpacing: v })}
          min={-5}
          max={20}
          step={0.5}
        />
      </div>
      <div className="grid grid-cols-3 gap-2">
        <SelectField
          label="Align"
          value={s.textAlign ?? 'left'}
          onChange={(v) => onChange({ ...s, textAlign: v })}
          options={[
            { value: 'left', label: '◀ Left' },
            { value: 'center', label: '◆ Center' },
            { value: 'right', label: '▶ Right' },
            { value: 'justify', label: '▣ Justify' },
          ]}
        />
        <SelectField
          label="Transform"
          value={s.textTransform ?? ''}
          onChange={(v) => onChange({ ...s, textTransform: v || null })}
          options={[
            { value: '', label: 'None' },
            { value: 'uppercase', label: 'UPPER' },
            { value: 'lowercase', label: 'lower' },
            { value: 'capitalize', label: 'Title' },
          ]}
        />
        <SelectField
          label="Decoration"
          value={s.textDecoration ?? ''}
          onChange={(v) => onChange({ ...s, textDecoration: v || null })}
          options={[
            { value: '', label: 'None' },
            { value: 'underline', label: 'Underline' },
            { value: 'line-through', label: 'Strike' },
            { value: 'overline', label: 'Overline' },
          ]}
        />
      </div>
      <ColorPickerField
        label="Color"
        value={s.color ?? ''}
        onChange={(v) => onChange({ ...s, color: v || null })}
        placeholder="#ffffff"
      />
    </div>
  );
}

function LayoutControl({ styles, onChange }) {
  const s = styles ?? {};
  return (
    <div className="space-y-3">
      <SelectField
        label="Display"
        value={s.display ?? ''}
        onChange={(v) => onChange({ ...s, display: v || null })}
        options={[
          { value: '', label: 'Default' },
          { value: 'block', label: 'Block' },
          { value: 'flex', label: 'Flex' },
          { value: 'grid', label: 'Grid' },
          { value: 'inline-block', label: 'Inline Block' },
          { value: 'inline-flex', label: 'Inline Flex' },
          { value: 'none', label: 'None (Hidden)' },
        ]}
      />
      {(s.display === 'flex' || s.display === 'inline-flex') && (
        <>
          <div className="grid grid-cols-2 gap-2">
            <SelectField
              label="Direction"
              value={s.flexDirection ?? 'row'}
              onChange={(v) => onChange({ ...s, flexDirection: v })}
              options={[
                { value: 'row', label: '→ Row' },
                { value: 'row-reverse', label: '← Row Reverse' },
                { value: 'column', label: '↓ Column' },
                { value: 'column-reverse', label: '↑ Column Reverse' },
              ]}
            />
            <SelectField
              label="Wrap"
              value={s.flexWrap ?? 'nowrap'}
              onChange={(v) => onChange({ ...s, flexWrap: v })}
              options={[
                { value: 'nowrap', label: 'No Wrap' },
                { value: 'wrap', label: 'Wrap' },
                { value: 'wrap-reverse', label: 'Wrap Reverse' },
              ]}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <SelectField
              label="Justify"
              value={s.justifyContent ?? 'flex-start'}
              onChange={(v) => onChange({ ...s, justifyContent: v })}
              options={[
                { value: 'flex-start', label: 'Start' },
                { value: 'center', label: 'Center' },
                { value: 'flex-end', label: 'End' },
                { value: 'space-between', label: 'Space Between' },
                { value: 'space-around', label: 'Space Around' },
                { value: 'space-evenly', label: 'Space Evenly' },
              ]}
            />
            <SelectField
              label="Align Items"
              value={s.alignItems ?? 'stretch'}
              onChange={(v) => onChange({ ...s, alignItems: v })}
              options={[
                { value: 'stretch', label: 'Stretch' },
                { value: 'flex-start', label: 'Start' },
                { value: 'center', label: 'Center' },
                { value: 'flex-end', label: 'End' },
                { value: 'baseline', label: 'Baseline' },
              ]}
            />
          </div>
          <NumberSliderField
            label="Gap"
            value={s.gap}
            onChange={(v) => onChange({ ...s, gap: v })}
            min={0}
            max={100}
          />
        </>
      )}
      {s.display === 'grid' && (
        <>
          <div className="grid grid-cols-2 gap-2">
            <NumberSliderField
              label="Columns"
              value={s.gridColumns}
              onChange={(v) => onChange({ ...s, gridColumns: v })}
              min={1}
              max={12}
              unit=""
            />
            <NumberSliderField
              label="Rows"
              value={s.gridRows}
              onChange={(v) => onChange({ ...s, gridRows: v })}
              min={1}
              max={12}
              unit=""
            />
          </div>
          <NumberSliderField
            label="Gap"
            value={s.gap}
            onChange={(v) => onChange({ ...s, gap: v })}
            min={0}
            max={100}
          />
        </>
      )}
    </div>
  );
}

function PositionControl({ styles, onChange }) {
  const s = styles ?? {};
  return (
    <div className="space-y-3">
      <SelectField
        label="Position"
        value={s.position ?? ''}
        onChange={(v) => onChange({ ...s, position: v || null })}
        options={[
          { value: '', label: 'Default (Static)' },
          { value: 'relative', label: 'Relative' },
          { value: 'absolute', label: 'Absolute' },
          { value: 'fixed', label: 'Fixed' },
          { value: 'sticky', label: 'Sticky' },
        ]}
      />
      {s.position && s.position !== 'static' && (
        <div className="grid grid-cols-2 gap-2">
          <NumberSliderField label="Top" value={s.top} onChange={(v) => onChange({ ...s, top: v })} min={-500} max={500} />
          <NumberSliderField label="Right" value={s.right} onChange={(v) => onChange({ ...s, right: v })} min={-500} max={500} />
          <NumberSliderField label="Bottom" value={s.bottom} onChange={(v) => onChange({ ...s, bottom: v })} min={-500} max={500} />
          <NumberSliderField label="Left" value={s.left} onChange={(v) => onChange({ ...s, left: v })} min={-500} max={500} />
        </div>
      )}
      <NumberSliderField
        label="Z-Index"
        value={s.zIndex}
        onChange={(v) => onChange({ ...s, zIndex: v })}
        min={-10}
        max={9999}
        unit=""
      />
    </div>
  );
}

function SizeControl({ styles, onChange }) {
  const s = styles ?? {};
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <NumberSliderField label="Width" value={s.width} onChange={(v) => onChange({ ...s, width: v })} min={0} max={1200} />
        <NumberSliderField label="Height" value={s.height} onChange={(v) => onChange({ ...s, height: v })} min={0} max={1200} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <NumberSliderField label="Min Width" value={s.minWidth} onChange={(v) => onChange({ ...s, minWidth: v })} min={0} max={1200} />
        <NumberSliderField label="Min Height" value={s.minHeight} onChange={(v) => onChange({ ...s, minHeight: v })} min={0} max={1200} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <NumberSliderField label="Max Width" value={s.maxWidth} onChange={(v) => onChange({ ...s, maxWidth: v })} min={0} max={2000} />
        <NumberSliderField label="Max Height" value={s.maxHeight} onChange={(v) => onChange({ ...s, maxHeight: v })} min={0} max={2000} />
      </div>
      <SelectField
        label="Overflow"
        value={s.overflow ?? ''}
        onChange={(v) => onChange({ ...s, overflow: v || null })}
        options={[
          { value: '', label: 'Visible' },
          { value: 'hidden', label: 'Hidden' },
          { value: 'scroll', label: 'Scroll' },
          { value: 'auto', label: 'Auto' },
        ]}
      />
    </div>
  );
}

function BackgroundControl({ styles, onChange }) {
  const s = styles ?? {};
  return (
    <div className="space-y-3">
      <SelectField
        label="Type"
        value={s.backgroundType ?? 'color'}
        onChange={(v) => onChange({ ...s, backgroundType: v })}
        options={[
          { value: 'color', label: 'Solid Color' },
          { value: 'gradient', label: 'Gradient' },
          { value: 'image', label: 'Image' },
        ]}
      />
      {(s.backgroundType ?? 'color') === 'color' && (
        <ColorPickerField
          label="Background Color"
          value={s.backgroundColor ?? ''}
          onChange={(v) => onChange({ ...s, backgroundColor: v || null })}
          placeholder="#000000"
        />
      )}
      {s.backgroundType === 'gradient' && (
        <>
          <SelectField
            label="Gradient Type"
            value={s.gradientType ?? 'linear'}
            onChange={(v) => onChange({ ...s, gradientType: v })}
            options={[
              { value: 'linear', label: 'Linear' },
              { value: 'radial', label: 'Radial' },
            ]}
          />
          <NumberSliderField
            label="Angle"
            value={s.gradientAngle}
            onChange={(v) => onChange({ ...s, gradientAngle: v })}
            min={0}
            max={360}
            unit="°"
          />
          <ColorPickerField
            label="Start Color"
            value={s.gradientStart ?? ''}
            onChange={(v) => onChange({ ...s, gradientStart: v })}
            placeholder="#000000"
          />
          <ColorPickerField
            label="End Color"
            value={s.gradientEnd ?? ''}
            onChange={(v) => onChange({ ...s, gradientEnd: v })}
            placeholder="#ffffff"
          />
        </>
      )}
      {s.backgroundType === 'image' && (
        <>
          <label className="block">
            <div className="text-[11px] font-medium text-white/60 uppercase tracking-wide mb-1">Image URL</div>
            <input
              value={s.backgroundImage ?? ''}
              onChange={(e) => onChange({ ...s, backgroundImage: e.target.value || null })}
              className="w-full rounded-md border border-white/10 bg-black/30 px-2 py-1.5 text-xs"
              placeholder="https://..."
            />
          </label>
          <div className="grid grid-cols-2 gap-2">
            <SelectField
              label="Size"
              value={s.backgroundSize ?? 'cover'}
              onChange={(v) => onChange({ ...s, backgroundSize: v })}
              options={[
                { value: 'cover', label: 'Cover' },
                { value: 'contain', label: 'Contain' },
                { value: 'auto', label: 'Auto' },
              ]}
            />
            <SelectField
              label="Position"
              value={s.backgroundPosition ?? 'center'}
              onChange={(v) => onChange({ ...s, backgroundPosition: v })}
              options={[
                { value: 'center', label: 'Center' },
                { value: 'top', label: 'Top' },
                { value: 'bottom', label: 'Bottom' },
                { value: 'left', label: 'Left' },
                { value: 'right', label: 'Right' },
              ]}
            />
          </div>
          <SelectField
            label="Repeat"
            value={s.backgroundRepeat ?? 'no-repeat'}
            onChange={(v) => onChange({ ...s, backgroundRepeat: v })}
            options={[
              { value: 'no-repeat', label: 'No Repeat' },
              { value: 'repeat', label: 'Repeat' },
              { value: 'repeat-x', label: 'Repeat X' },
              { value: 'repeat-y', label: 'Repeat Y' },
            ]}
          />
        </>
      )}
    </div>
  );
}

function TransformControl({ styles, onChange }) {
  const s = styles ?? {};
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <NumberSliderField label="Rotate" value={s.rotate} onChange={(v) => onChange({ ...s, rotate: v })} min={-360} max={360} unit="°" />
        <NumberSliderField label="Scale" value={s.scale} onChange={(v) => onChange({ ...s, scale: v })} min={0} max={3} step={0.1} unit="x" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <NumberSliderField label="Translate X" value={s.translateX} onChange={(v) => onChange({ ...s, translateX: v })} min={-500} max={500} />
        <NumberSliderField label="Translate Y" value={s.translateY} onChange={(v) => onChange({ ...s, translateY: v })} min={-500} max={500} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <NumberSliderField label="Skew X" value={s.skewX} onChange={(v) => onChange({ ...s, skewX: v })} min={-45} max={45} unit="°" />
        <NumberSliderField label="Skew Y" value={s.skewY} onChange={(v) => onChange({ ...s, skewY: v })} min={-45} max={45} unit="°" />
      </div>
      <NumberSliderField
        label="Opacity"
        value={s.opacity != null ? s.opacity * 100 : 100}
        onChange={(v) => onChange({ ...s, opacity: v / 100 })}
        min={0}
        max={100}
        unit="%"
      />
    </div>
  );
}

function EffectsControl({ styles, onChange }) {
  const s = styles ?? {};
  return (
    <div className="space-y-3">
      <SelectField
        label="Cursor"
        value={s.cursor ?? ''}
        onChange={(v) => onChange({ ...s, cursor: v || null })}
        options={[
          { value: '', label: 'Default' },
          { value: 'pointer', label: 'Pointer' },
          { value: 'grab', label: 'Grab' },
          { value: 'crosshair', label: 'Crosshair' },
          { value: 'not-allowed', label: 'Not Allowed' },
          { value: 'zoom-in', label: 'Zoom In' },
        ]}
      />
      <SelectField
        label="Mix Blend Mode"
        value={s.mixBlendMode ?? ''}
        onChange={(v) => onChange({ ...s, mixBlendMode: v || null })}
        options={[
          { value: '', label: 'Normal' },
          { value: 'multiply', label: 'Multiply' },
          { value: 'screen', label: 'Screen' },
          { value: 'overlay', label: 'Overlay' },
          { value: 'darken', label: 'Darken' },
          { value: 'lighten', label: 'Lighten' },
          { value: 'color-dodge', label: 'Color Dodge' },
          { value: 'difference', label: 'Difference' },
        ]}
      />
      <NumberSliderField
        label="Blur Filter"
        value={s.filterBlur}
        onChange={(v) => onChange({ ...s, filterBlur: v })}
        min={0}
        max={50}
      />
      <NumberSliderField
        label="Brightness"
        value={s.filterBrightness != null ? s.filterBrightness * 100 : 100}
        onChange={(v) => onChange({ ...s, filterBrightness: v / 100 })}
        min={0}
        max={200}
        unit="%"
      />
      <NumberSliderField
        label="Contrast"
        value={s.filterContrast != null ? s.filterContrast * 100 : 100}
        onChange={(v) => onChange({ ...s, filterContrast: v / 100 })}
        min={0}
        max={200}
        unit="%"
      />
      <NumberSliderField
        label="Saturate"
        value={s.filterSaturate != null ? s.filterSaturate * 100 : 100}
        onChange={(v) => onChange({ ...s, filterSaturate: v / 100 })}
        min={0}
        max={200}
        unit="%"
      />
    </div>
  );
}

function TextInput({ label, value, onChange, placeholder }) {
  return (
    <label className="block">
      <div className="text-[11px] font-medium text-white/60 uppercase tracking-wide mb-1">{label}</div>
      <input
        value={value ?? ''}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm"
      />
    </label>
  );
}

function randomId() {
  if (typeof globalThis !== 'undefined' && globalThis.crypto && typeof globalThis.crypto.randomUUID === 'function') {
    return globalThis.crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function deepClone(value) {
  return value == null ? value : JSON.parse(JSON.stringify(value));
}

function collectWidgetNodes(builder) {
  const out = [];
  const root = builder?.root;
  if (!root) return out;

  function walk(node) {
    if (!node) return;
    if (node.type === 'WIDGET') out.push(node);
    const children = Array.isArray(node.children) ? node.children : [];
    for (const ch of children) walk(ch);
  }

  walk(root);
  return out;
}

function collectWidgetNodesInRenderOrder(builder) {
  const b = ensureBuilderHasColumn(builder);
  const root = b?.root;
  if (!root) return [];

  const out = [];
  const sections = (root.children ?? []).filter((n) => n?.type === 'SECTION');

  if (!sections.length) {
    return collectWidgetNodes(b);
  }

  for (const section of sections) {
    const sectionChildren = section?.children ?? [];
    const containers = sectionChildren.filter((n) => n?.type === 'CONTAINER');
    const effectiveContainers = containers.length ? containers : [null];

    for (const container of effectiveContainers) {
      const containerChildren = container ? container.children ?? [] : sectionChildren;
      const columns = containerChildren.filter((n) => n?.type === 'COLUMN');

      if (!columns.length) {
        for (const n of containerChildren) {
          if (n?.type === 'WIDGET') out.push(n);
        }
        continue;
      }

      for (const col of columns) {
        const widgets = (col?.children ?? []).filter((n) => n?.type === 'WIDGET');
        for (const w of widgets) out.push(w);
      }
    }
  }

  return out;
}

function findFirstColumnNode(builder) {
  const root = builder?.root;
  if (!root) return null;

  let found = null;
  function walk(node) {
    if (!node || found) return;
    if (node.type === 'COLUMN') {
      found = node;
      return;
    }
    const children = Array.isArray(node.children) ? node.children : [];
    for (const ch of children) walk(ch);
  }
  walk(root);
  return found;
}

function findNodePathById(builder, nodeId) {
  const b = ensureBuilderHasColumn(builder);
  const root = b?.root;
  if (!root || !nodeId) return [];

  let out = [];
  function walk(node, stack) {
    if (!node || out.length) return;
    const nextStack = [...(stack ?? []), node];
    if (node.id === nodeId) {
      out = nextStack;
      return;
    }
    const children = Array.isArray(node.children) ? node.children : [];
    for (const ch of children) walk(ch, nextStack);
  }
  walk(root, []);
  return out;
}

function deriveHierarchyFromWidgetId(builder, widgetId) {
  const path = findNodePathById(builder, widgetId);
  if (!path.length) return { section: null, container: null, column: null, columnIndex: 0 };

  const section = [...path].reverse().find((n) => n?.type === 'SECTION') ?? null;
  const container = [...path].reverse().find((n) => n?.type === 'CONTAINER') ?? null;
  const column = [...path].reverse().find((n) => n?.type === 'COLUMN') ?? null;

  const columns = container ? (container.children ?? []).filter((c) => c?.type === 'COLUMN') : [];
  const columnIndex = column ? Math.max(0, columns.findIndex((c) => c?.id === column.id)) : 0;

  return { section, container, column, columnIndex };
}

function removeWidgetById(builder, widgetId) {
  const b = ensureBuilderHasColumn(builder);
  const path = findNodePathById(b, widgetId);
  if (!path.length) return b;
  const parent = path.length >= 2 ? path[path.length - 2] : null;
  if (!parent || parent.type !== 'COLUMN') return b;
  const children = Array.isArray(parent.children) ? [...parent.children] : [];
  const idx = children.findIndex((n) => n?.type === 'WIDGET' && n?.id === widgetId);
  if (idx < 0) return b;
  children.splice(idx, 1);
  parent.children = children;
  return b;
}

function insertSectionAt(builder, index) {
  const b = ensureBuilderHasColumn(builder);
  const root = b?.root;
  if (!root) return b;

  const nextSection = {
    id: randomId(),
    type: 'SECTION',
    props: {},
    style: {},
    responsive: {},
    children: [
      {
        id: randomId(),
        type: 'CONTAINER',
        props: { width: 'boxed' },
        style: {},
        responsive: {},
        children: [
          {
            id: randomId(),
            type: 'COLUMN',
            props: { width: 12 },
            style: {},
            responsive: {},
            children: [],
          },
        ],
      },
    ],
  };

  const children = Array.isArray(root.children) ? [...root.children] : [];
  const insertionIndex = Math.max(0, Math.min(Number(index) || 0, children.length));
  children.splice(insertionIndex, 0, nextSection);
  root.children = children;
  return { builder: b, sectionId: nextSection.id };
}

function insertContainerIntoSection(builder, sectionId) {
  const b = ensureBuilderHasColumn(builder);
  const section = sectionId ? findAnyNodeById(b, sectionId) : findFirstSectionNode(b);
  if (!section || section.type !== 'SECTION') return { builder: b, containerId: null };

  const nextContainer = {
    id: randomId(),
    type: 'CONTAINER',
    props: { width: 'boxed' },
    style: {},
    responsive: {},
    children: [
      {
        id: randomId(),
        type: 'COLUMN',
        props: { width: 12 },
        style: {},
        responsive: {},
        children: [],
      },
    ],
  };

  const children = Array.isArray(section.children) ? [...section.children] : [];
  children.push(nextContainer);
  section.children = children;
  return { builder: b, containerId: nextContainer.id };
}

function applyTwoColumnsToContainer(builder, containerId, preset = '50-50') {
  const b = ensureBuilderHasColumn(builder);
  const container = containerId ? findAnyNodeById(b, containerId) : findFirstContainerNode(b);
  if (!container || container.type !== 'CONTAINER') return b;

  const widths =
    preset === '66-33'
      ? [8, 4]
      : preset === '33-66'
        ? [4, 8]
        : preset === '75-25'
          ? [9, 3]
          : preset === '25-75'
            ? [3, 9]
            : [6, 6];

  const existingCols = (container.children ?? []).filter((c) => c?.type === 'COLUMN');
  if (existingCols.length >= 2) {
    existingCols[0].props = { ...(existingCols[0].props ?? {}), width: widths[0] };
    existingCols[1].props = { ...(existingCols[1].props ?? {}), width: widths[1] };
    return b;
  }

  const first = existingCols[0] ?? {
    id: randomId(),
    type: 'COLUMN',
    props: { width: widths[0] },
    style: {},
    responsive: {},
    children: [],
  };
  first.props = { ...(first.props ?? {}), width: widths[0] };

  const second = {
    id: randomId(),
    type: 'COLUMN',
    props: { width: widths[1] },
    style: {},
    responsive: {},
    children: [],
  };

  container.children = [first, second];
  return b;
}

function duplicateWidgetById(builder, widgetId) {
  const b = ensureBuilderHasColumn(builder);
  const src = findAnyNodeById(b, widgetId);
  if (!src || src.type !== 'WIDGET') return b;
  const path = findNodePathById(b, widgetId);
  if (!path.length) return b;
  const parent = path.length >= 2 ? path[path.length - 2] : null;
  if (!parent || parent.type !== 'COLUMN') return b;
  const children = Array.isArray(parent.children) ? [...parent.children] : [];
  const idx = children.findIndex((n) => n?.type === 'WIDGET' && n?.id === widgetId);
  if (idx < 0) return b;
  children.splice(idx + 1, 0, {
    id: randomId(),
    type: 'WIDGET',
    widgetType: src.widgetType,
    props: deepClone(src.props ?? {}),
    style: deepClone(src.style ?? {}),
    responsive: {},
    children: [],
  });
  parent.children = children;
  return b;
}

function findFirstSectionNode(builder) {
  const root = builder?.root;
  if (!root) return null;

  let found = null;
  function walk(node) {
    if (!node || found) return;
    if (node.type === 'SECTION') {
      found = node;
      return;
    }
    const children = Array.isArray(node.children) ? node.children : [];
    for (const ch of children) walk(ch);
  }
  walk(root);
  return found;
}

function getSectionContainerColumns(builder) {
  const b = ensureBuilderHasColumn(builder);
  const section = findFirstSectionNode(b);
  const container = findFirstContainerNode(b);
  const cols = container ? (container.children ?? []).filter((c) => c?.type === 'COLUMN') : [];
  return { builder: b, section, container, columns: cols };
}

function findFirstContainerNode(builder) {
  const root = builder?.root;
  if (!root) return null;

  let found = null;
  function walk(node) {
    if (!node || found) return;
    if (node.type === 'CONTAINER') {
      found = node;
      return;
    }
    const children = Array.isArray(node.children) ? node.children : [];
    for (const ch of children) walk(ch);
  }
  walk(root);
  return found;
}

function getColumns(builder) {
  const b = ensureBuilderHasColumn(builder);
  const container = findFirstContainerNode(b);
  if (!container) return { builder: b, columns: [] };
  const cols = (container.children ?? []).filter((c) => c?.type === 'COLUMN');
  return { builder: b, columns: cols };
}

function ensureTwoColumns(builder, preset = '50-50') {
  const b = ensureBuilderHasColumn(builder);
  const container = findFirstContainerNode(b);
  if (!container) return b;

  const existingCols = (container.children ?? []).filter((c) => c?.type === 'COLUMN');
  if (existingCols.length >= 2) {
    const [a, c] = existingCols;
    const widths = preset === '66-33' ? [8, 4] : preset === '33-66' ? [4, 8] : preset === '75-25' ? [9, 3] : preset === '25-75' ? [3, 9] : [6, 6];
    a.props = { ...(a.props ?? {}), width: widths[0] };
    c.props = { ...(c.props ?? {}), width: widths[1] };
    return b;
  }

  const col = existingCols[0] ?? findFirstColumnNode(b);
  if (!col) return b;

  const widths = preset === '66-33' ? [8, 4] : preset === '33-66' ? [4, 8] : preset === '75-25' ? [9, 3] : preset === '25-75' ? [3, 9] : [6, 6];
  col.props = { ...(col.props ?? {}), width: widths[0] };

  const second = {
    id: randomId(),
    type: 'COLUMN',
    props: { width: widths[1] },
    style: {},
    responsive: {},
    children: [],
  };

  const children = Array.isArray(container.children) ? [...container.children] : [];
  const idx = children.findIndex((c) => c?.id === col.id);
  if (idx >= 0) {
    children.splice(idx + 1, 0, second);
  } else {
    children.push(second);
  }
  container.children = children;
  return b;
}

function collectWidgetNodesForColumn(builder, columnIndex) {
  const { builder: b, columns } = getColumns(builder);
  const col = columns?.[columnIndex] ?? null;
  const widgets = (col?.children ?? []).filter((n) => n?.type === 'WIDGET');
  return { builder: b, widgets };
}

function insertWidgetIntoColumn(builder, columnIndex, index, widgetType, props, style) {
  const b = ensureBuilderHasColumn(builder);
  const container = findFirstContainerNode(b);
  if (!container) return b;
  const cols = (container.children ?? []).filter((c) => c?.type === 'COLUMN');
  const col = cols?.[columnIndex] ?? cols?.[0] ?? null;
  if (!col) return b;

  const children = Array.isArray(col.children) ? [...col.children] : [];
  const insertionIndex = Math.max(0, Math.min(Number(index), children.length));
  children.splice(insertionIndex, 0, {
    id: randomId(),
    type: 'WIDGET',
    widgetType,
    props: props ?? {},
    style: style ?? {},
    responsive: {},
    children: [],
  });
  col.children = children;
  return b;
}

function removeWidgetFromColumn(builder, columnIndex, index) {
  const b = ensureBuilderHasColumn(builder);
  const container = findFirstContainerNode(b);
  if (!container) return b;
  const cols = (container.children ?? []).filter((c) => c?.type === 'COLUMN');
  const col = cols?.[columnIndex] ?? cols?.[0] ?? null;
  if (!col) return b;

  const children = Array.isArray(col.children) ? [...col.children] : [];
  const i = Number(index);
  if (!Number.isFinite(i) || i < 0 || i >= children.length) return b;
  children.splice(i, 1);
  col.children = children;
  return b;
}

function moveWidgetBetweenColumns(builder, widgetId, toColumnIndex, toIndex) {
  const b = ensureBuilderHasColumn(builder);
  const container = findFirstContainerNode(b);
  if (!container) return b;
  const cols = (container.children ?? []).filter((c) => c?.type === 'COLUMN');
  if (!cols.length) return b;

  let fromColIndex = -1;
  let fromIdx = -1;
  for (let ci = 0; ci < cols.length; ci++) {
    const ch = Array.isArray(cols[ci].children) ? cols[ci].children : [];
    const idx = ch.findIndex((n) => n?.id === widgetId);
    if (idx >= 0) {
      fromColIndex = ci;
      fromIdx = idx;
      break;
    }
  }
  if (fromColIndex < 0) return b;

  const targetCol = cols[toColumnIndex] ?? cols[0];
  const sourceCol = cols[fromColIndex];
  const srcChildren = Array.isArray(sourceCol.children) ? [...sourceCol.children] : [];
  const [moved] = srcChildren.splice(fromIdx, 1);
  sourceCol.children = srcChildren;

  const dstChildren = Array.isArray(targetCol.children) ? [...targetCol.children] : [];
  let insertAt = Math.max(0, Math.min(Number(toIndex), dstChildren.length));
  if (fromColIndex === toColumnIndex && fromIdx < insertAt) {
    insertAt = Math.max(0, insertAt - 1);
  }
  dstChildren.splice(insertAt, 0, moved);
  targetCol.children = dstChildren;
  return b;
}

function reorderWidgetsInColumn(builder, columnIndex, fromIndex, toIndex) {
  const b = ensureBuilderHasColumn(builder);
  const container = findFirstContainerNode(b);
  if (!container) return b;
  const cols = (container.children ?? []).filter((c) => c?.type === 'COLUMN');
  const col = cols?.[columnIndex] ?? cols?.[0] ?? null;
  if (!col) return b;
  const children = Array.isArray(col.children) ? [...col.children] : [];
  if (fromIndex < 0 || fromIndex >= children.length) return b;
  if (toIndex < 0 || toIndex >= children.length) return b;
  const [moved] = children.splice(fromIndex, 1);
  children.splice(toIndex, 0, moved);
  col.children = children;
  return b;
}

function ensureBuilderHasColumn(builder) {
  const b = deepClone(builder ?? null);
  if (b?.root) {
    const existing = findFirstColumnNode(b);
    if (existing) return b;
  }

  const makeId = () => randomId();
  const sectionId = makeId();
  const containerId = makeId();
  const columnId = makeId();

  return {
    version: 1,
    root: {
      id: makeId(),
      type: 'ROOT',
      children: [
        {
          id: sectionId,
          type: 'SECTION',
          props: {},
          style: {},
          responsive: {},
          children: [
            {
              id: containerId,
              type: 'CONTAINER',
              props: { width: 'boxed' },
              style: {},
              responsive: {},
              children: [
                {
                  id: columnId,
                  type: 'COLUMN',
                  props: { width: 12 },
                  style: {},
                  responsive: {},
                  children: [],
                },
              ],
            },
          ],
        },
      ],
    },
  };
}

function widgetNodesToFlatComponents(widgetNodes) {
  return (widgetNodes ?? []).map((n, idx) => ({
    id: n.id,
    type: n.widgetType,
    orderIndex: idx,
    props: n.props ?? {},
    styles: n.style ?? {},
    __cid: n.id,
  }));
}

function ElementsGroup({ title, icon, count, open, onToggle, children }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/10">
      <button
        type="button"
        onClick={onToggle}
        className="w-full px-3 py-2 flex items-center justify-between hover:bg-white/5"
      >
        <div className="flex items-center gap-2 min-w-0">
          <div className="h-7 w-7 grid place-items-center rounded-lg border border-white/10 bg-black/20 text-sm">{icon}</div>
          <div className="min-w-0">
            <div className="text-xs font-semibold truncate">{title}</div>
            <div className="text-[11px] text-white/50">{count} items</div>
          </div>
        </div>
        <div className="text-white/60 text-xs">{open ? '▾' : '▸'}</div>
      </button>
      {open ? <div className="p-3 pt-2">{children}</div> : null}
    </div>
  );
}

function NavigatorRow({ depth = 0, icon, title, subtitle, active, onClick, actions, hasChildren, expanded, onToggle, onContextMenu }) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onContextMenu={onContextMenu}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onClick?.(e);
      }}
      className={
        `group flex items-center justify-between gap-1 rounded-lg px-2 py-1.5 text-xs transition-all ${
          active ? 'bg-indigo-500/20 ring-1 ring-indigo-500/30 text-indigo-200' : 'hover:bg-white/10'
        }`
      }
      style={{ paddingLeft: 8 + depth * 16 }}
    >
      <div className="flex items-center gap-1.5 min-w-0">
        {hasChildren ? (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onToggle?.(); }}
            className="h-4 w-4 grid place-items-center text-white/40 hover:text-white/70 transition"
          >
            {expanded ? '▾' : '▸'}
          </button>
        ) : (
          <div className="w-4" />
        )}
        <div className={`h-6 w-6 grid place-items-center rounded-md border text-[11px] transition ${
          active ? 'border-indigo-500/40 bg-indigo-500/20' : 'border-white/10 bg-black/20'
        }`}>
          {icon}
        </div>
        <div className="min-w-0">
          <div className="truncate font-medium text-[11px]">{title}</div>
        </div>
      </div>
      <div className="opacity-0 group-hover:opacity-100 transition flex items-center gap-0.5">{actions}</div>
    </div>
  );
}

function NavigatorActionButton({ icon, title, onClick, variant = 'default' }) {
  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onClick?.(); }}
      title={title}
      className={`h-5 w-5 grid place-items-center rounded text-[10px] transition ${
        variant === 'danger' 
          ? 'hover:bg-red-500/30 hover:text-red-300' 
          : 'hover:bg-white/20'
      }`}
    >
      {icon}
    </button>
  );
}

function updateWidgetNodeById(builder, widgetId, mutator) {
  const b = ensureBuilderHasColumn(builder);
  function walk(node) {
    if (!node) return;
    if (node.type === 'WIDGET' && node.id === widgetId) {
      mutator(node);
      return true;
    }
    const children = Array.isArray(node.children) ? node.children : [];
    for (const ch of children) {
      if (walk(ch)) return true;
    }
    return false;
  }
  walk(b.root);
  return b;
}

function findAnyNodeById(builder, nodeId) {
  const b = ensureBuilderHasColumn(builder);
  let found = null;
  function walk(node) {
    if (!node || found) return;
    if (node.id === nodeId) {
      found = node;
      return;
    }
    const children = Array.isArray(node.children) ? node.children : [];
    for (const ch of children) walk(ch);
  }
  walk(b.root);
  return found;
}

function updateAnyNodeById(builder, nodeId, mutator) {
  const b = ensureBuilderHasColumn(builder);
  function walk(node) {
    if (!node) return false;
    if (node.id === nodeId) {
      mutator(node);
      return true;
    }
    const children = Array.isArray(node.children) ? node.children : [];
    for (const ch of children) {
      if (walk(ch)) return true;
    }
    return false;
  }
  walk(b.root);
  return b;
}

function updateWidgetPropsAtIndex(builder, componentIndex, patch) {
  const b = ensureBuilderHasColumn(builder);
  const widgets = collectWidgetNodesInRenderOrder(b);
  const widget = widgets?.[Number(componentIndex)];
  if (!widget) return b;
  return updateWidgetNodeById(b, widget.id, (node) => {
    node.props = { ...(node.props ?? {}), ...(patch ?? {}) };
  });
}

function reorderWidgetsInFirstColumn(builder, fromIndex, toIndex) {
  const b = ensureBuilderHasColumn(builder);
  const col = findFirstColumnNode(b);
  if (!col) return b;
  const children = Array.isArray(col.children) ? [...col.children] : [];
  if (fromIndex < 0 || fromIndex >= children.length) return b;
  if (toIndex < 0 || toIndex >= children.length) return b;
  const [moved] = children.splice(fromIndex, 1);
  children.splice(toIndex, 0, moved);
  col.children = children;
  return b;
}

function insertWidgetIntoFirstColumn(builder, index, widgetType, props, style) {
  const b = ensureBuilderHasColumn(builder);
  const col = findFirstColumnNode(b);
  if (!col) return b;
  const children = Array.isArray(col.children) ? [...col.children] : [];
  const insertionIndex = Math.max(0, Math.min(Number(index), children.length));
  children.splice(insertionIndex, 0, {
    id: randomId(),
    type: 'WIDGET',
    widgetType,
    props: props ?? {},
    style: style ?? {},
    responsive: {},
    children: [],
  });
  col.children = children;
  return b;
}

function removeWidgetFromFirstColumn(builder, index) {
  const b = ensureBuilderHasColumn(builder);
  const col = findFirstColumnNode(b);
  if (!col) return b;
  const children = Array.isArray(col.children) ? [...col.children] : [];
  const i = Number(index);
  if (!Number.isFinite(i) || i < 0 || i >= children.length) return b;
  children.splice(i, 1);
  col.children = children;
  return b;
}

function ensureClientIds(nextPages) {
  return (nextPages ?? []).map((p) => ({
    ...p,
    components: (p.components ?? []).map((c) => ({
      ...c,
      __cid: c.__cid ?? randomId(),
      props: { ...(c.props ?? {}) },
      styles: { ...(c.styles ?? {}) },
    })),
  }));
}

function SortableLayerItem({ id, active, indexLabel, title, onSelect, onDuplicate, onMoveUp, onMoveDown, disableUp, disableDown }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onSelect}
      className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-sm transition cursor-pointer ${
        active ? 'border-indigo-400/40 bg-indigo-500/10' : 'border-white/10 bg-black/20 hover:bg-black/30'
      } ${isDragging ? 'opacity-60' : ''}`}
    >
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={(e) => e.stopPropagation()}
          className="select-none text-white/50"
          {...attributes}
          {...listeners}
          aria-label="Drag to reorder"
          title="Drag to reorder"
        >
          ⋮⋮
        </button>
        <span className="font-medium">{title}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-white/50">{indexLabel}</span>
        <button
          type="button"
          disabled={disableUp}
          onClick={onMoveUp}
          className="rounded-md bg-white/10 px-2 py-1 text-xs font-medium hover:bg-white/15 disabled:opacity-50"
        >
          ↑
        </button>
        <button
          type="button"
          disabled={disableDown}
          onClick={onMoveDown}
          className="rounded-md bg-white/10 px-2 py-1 text-xs font-medium hover:bg-white/15 disabled:opacity-50"
        >
          ↓
        </button>
        <button
          type="button"
          onClick={onDuplicate}
          className="rounded-md bg-white/10 px-2 py-1 text-xs font-medium hover:bg-white/15"
        >
          +
        </button>
      </div>
    </div>
  );
}

function PaletteDraggable({ type, label, icon, desc, onClick }) {
  const id = `new:${type}`;
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id });

  return (
    <div
      ref={setNodeRef}
      onClick={onClick}
      className={`group select-none rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-xs font-medium text-white/85 hover:bg-indigo-500/10 hover:border-indigo-500/30 transition-all cursor-grab active:cursor-grabbing ${
        isDragging ? 'opacity-60 scale-95' : ''
      }`}
      {...attributes}
      {...listeners}
    >
      <div className="flex items-center gap-2.5">
        <div className="h-9 w-9 rounded-lg border border-white/10 bg-gradient-to-br from-white/5 to-black/20 grid place-items-center text-base group-hover:border-indigo-500/30 group-hover:from-indigo-500/10 transition-all">
          {icon ?? '▦'}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-xs font-semibold group-hover:text-indigo-200 transition-colors">{label ?? type}</div>
          <div className="truncate text-[10px] text-white/40">{desc ?? type}</div>
        </div>
      </div>
    </div>
  );
}

function typeMeta(type) {
  const map = {
    // Structure
    SECTION: { label: 'Section', icon: '▭', desc: 'Full-width container' },
    CONTAINER: { label: 'Container', icon: '▢', desc: 'Content wrapper' },
    COLUMNS: { label: 'Columns', icon: '▦', desc: 'Multi-column layout' },
    // Basic Elements
    HEADING: { label: 'Heading', icon: 'T', desc: 'Title text' },
    TEXT: { label: 'Text', icon: '≡', desc: 'Paragraph text' },
    BUTTON: { label: 'Button', icon: '⏺', desc: 'Call to action' },
    DIVIDER: { label: 'Divider', icon: '—', desc: 'Horizontal line' },
    SPACER: { label: 'Spacer', icon: '↕', desc: 'Vertical space' },
    ICON: { label: 'Icon', icon: '◆', desc: 'Single icon' },
    ICON_BOX: { label: 'Icon Box', icon: '◈', desc: 'Icon with text' },
    STAR_RATING: { label: 'Star Rating', icon: '★', desc: 'Rating stars' },
    // Media
    IMAGE: { label: 'Image', icon: '▣', desc: 'Single image' },
    GALLERY: { label: 'Gallery', icon: '▥', desc: 'Image gallery' },
    VIDEO: { label: 'Video', icon: '▶', desc: 'Video embed' },
    ICON_LIST: { label: 'Icon List', icon: '☰', desc: 'List with icons' },
    IMAGE_BOX: { label: 'Image Box', icon: '▤', desc: 'Image with overlay' },
    // Navigation
    NAVBAR: { label: 'Navbar', icon: '≣', desc: 'Navigation bar' },
    ADVANCED_NAVBAR: { label: 'Navbar Pro', icon: '≣', desc: 'Advanced navbar' },
    MENU: { label: 'Menu', icon: '☰', desc: 'Navigation menu' },
    BREADCRUMBS: { label: 'Breadcrumbs', icon: '›', desc: 'Page path' },
    // Hero & Headers
    HERO: { label: 'Hero', icon: '★', desc: 'Hero section' },
    PAGE_HEADER: { label: 'Page Header', icon: '▔', desc: 'Page title area' },
    CALL_TO_ACTION: { label: 'CTA', icon: '◉', desc: 'Call to action' },
    // Content Blocks
    FEATURES: { label: 'Features', icon: '✓', desc: 'Feature list' },
    CONTENT: { label: 'Content', icon: '▤', desc: 'Content block' },
    CARDS: { label: 'Cards', icon: '▦', desc: 'Card grid' },
    ICON_CARDS: { label: 'Icon Cards', icon: '◈', desc: 'Cards with icons' },
    TEAM: { label: 'Team', icon: '👥', desc: 'Team members' },
    ABOUT: { label: 'About', icon: 'ℹ', desc: 'About section' },
    // Social Proof
    TESTIMONIALS: { label: 'Testimonials', icon: '💬', desc: 'Customer quotes' },
    LOGO_CLOUD: { label: 'Logo Cloud', icon: '☁', desc: 'Partner logos' },
    REVIEWS: { label: 'Reviews', icon: '★', desc: 'Customer reviews' },
    COUNTER: { label: 'Counter', icon: '#', desc: 'Animated number' },
    STATS_CTA: { label: 'Stats CTA', icon: '📊', desc: 'Stats with CTA' },
    // Products & Commerce
    PRODUCT_GRID: { label: 'Products', icon: '▦', desc: 'Product grid' },
    FILTER_TABS: { label: 'Filter Tabs', icon: '⊟', desc: 'Filterable grid' },
    PRICING: { label: 'Pricing', icon: '$', desc: 'Pricing table' },
    PRICE_TABLE: { label: 'Price Table', icon: '💰', desc: 'Price comparison' },
    // Interactive
    FAQ: { label: 'FAQ', icon: '?', desc: 'FAQ accordion' },
    ACCORDION: { label: 'Accordion', icon: '▼', desc: 'Collapsible content' },
    TABS: { label: 'Tabs', icon: '⊡', desc: 'Tabbed content' },
    TOGGLE: { label: 'Toggle', icon: '◐', desc: 'Toggle switch' },
    // Carousels
    FEATURE_CAROUSEL: { label: 'Feature Slider', icon: '⇆', desc: 'Feature carousel' },
    MULTI_ROW_CAROUSEL: { label: 'Carousel', icon: '⇆', desc: 'Multi-row slider' },
    TESTIMONIAL_SLIDER: { label: 'Testimonial Slider', icon: '⇄', desc: 'Quote carousel' },
    IMAGE_CAROUSEL: { label: 'Image Slider', icon: '⇌', desc: 'Image carousel' },
    // Forms
    CONTACT_FORM: { label: 'Contact Form', icon: '✉', desc: 'Contact form' },
    NEWSLETTER: { label: 'Newsletter', icon: '📧', desc: 'Email signup' },
    SEARCH_BOX: { label: 'Search', icon: '🔍', desc: 'Search input' },
    // Footer
    FOOTER: { label: 'Footer', icon: '▁', desc: 'Page footer' },
    FOOTER_LINKS: { label: 'Footer Links', icon: '▁', desc: 'Footer navigation' },
    SOCIAL_ICONS: { label: 'Social Icons', icon: '◎', desc: 'Social media links' },
    COPYRIGHT: { label: 'Copyright', icon: '©', desc: 'Copyright text' },
  };
  return map[type] ?? { label: type, icon: '▦', desc: 'Widget' };
}

function buildHierarchyTree(builder) {
  const b = ensureBuilderHasColumn(builder);
  const root = b?.root;
  if (!root) return [];

  const sections = (root.children ?? []).filter((n) => n?.type === 'SECTION');
  if (!sections.length) return [];

  return sections.map((s) => ({
    id: s.id,
    type: 'SECTION',
    children: (s.children ?? []).filter((n) => n?.type === 'CONTAINER').map((c) => ({
      id: c.id,
      type: 'CONTAINER',
      children: (c.children ?? []).filter((n) => n?.type === 'COLUMN').map((col) => ({
        id: col.id,
        type: 'COLUMN',
        children: (col.children ?? []).filter((n) => n?.type === 'WIDGET').map((w) => ({
          id: w.id,
          type: 'WIDGET',
          widgetType: w.widgetType,
          children: [],
        })),
      })),
    })),
  }));
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
    case 'HEADING':
      return { text: 'Heading', level: 2, align: 'left' };
    case 'TEXT':
      return { text: 'Text', align: 'left' };
    case 'BUTTON':
      return { label: 'Button', href: '#', align: 'left' };
    case 'DIVIDER':
      return { thickness: 1 };
    case 'SPACER':
      return { height: 24 };
    case 'IMAGE':
      return { src: '', alt: 'Image', fit: 'cover' };
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
    // New component types
    case 'ICON':
      return { icon: '★', size: 48 };
    case 'ICON_BOX':
      return { icon: '★', title: 'Icon Box Title', text: 'Description text goes here', align: 'center' };
    case 'STAR_RATING':
      return { rating: 4, maxRating: 5, size: 24 };
    case 'VIDEO':
      return { url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', aspectRatio: '16:9' };
    case 'ICON_LIST':
      return { items: [{ icon: '✓', text: 'List item one' }, { icon: '✓', text: 'List item two' }, { icon: '✓', text: 'List item three' }] };
    case 'IMAGE_BOX':
      return { src: '', title: 'Image Title', text: 'Image description', overlay: true };
    case 'MENU':
      return { items: [{ label: 'Home', href: '/' }, { label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' }] };
    case 'BREADCRUMBS':
      return { items: [{ label: 'Home', href: '/' }, { label: 'Page', href: '#' }], separator: '/' };
    case 'PAGE_HEADER':
      return { title: 'Page Title', subtitle: 'Page subtitle or description', backgroundImage: '' };
    case 'CALL_TO_ACTION':
      return { headline: 'Ready to get started?', text: 'Join thousands of satisfied customers today.', primaryCta: { label: 'Get Started', href: '/contact' }, secondaryCta: { label: 'Learn More', href: '/about' } };
    case 'ICON_CARDS':
      return { cards: [{ icon: '★', title: 'Card One', text: 'Description' }, { icon: '◆', title: 'Card Two', text: 'Description' }, { icon: '●', title: 'Card Three', text: 'Description' }] };
    case 'TEAM':
      return { headline: 'Meet our team', members: [{ name: 'John Doe', role: 'CEO', image: '', bio: 'Short bio' }, { name: 'Jane Smith', role: 'CTO', image: '', bio: 'Short bio' }] };
    case 'ABOUT':
      return { headline: 'About Us', text: 'We are a company dedicated to excellence.', image: '' };
    case 'REVIEWS':
      return { headline: 'Customer Reviews', items: [{ name: 'Customer', rating: 5, text: 'Great product!' }] };
    case 'COUNTER':
      return { value: 1000, suffix: '+', label: 'Happy Customers', duration: 2 };
    case 'PRICE_TABLE':
      return { plans: [{ name: 'Basic', price: '$9', features: ['Feature 1', 'Feature 2'] }, { name: 'Pro', price: '$29', features: ['Feature 1', 'Feature 2', 'Feature 3'] }] };
    case 'ACCORDION':
      return { items: [{ title: 'Section 1', content: 'Content for section 1' }, { title: 'Section 2', content: 'Content for section 2' }] };
    case 'TABS':
      return { tabs: [{ label: 'Tab 1', content: 'Content for tab 1' }, { label: 'Tab 2', content: 'Content for tab 2' }] };
    case 'TOGGLE':
      return { label: 'Toggle option', defaultChecked: false };
    case 'TESTIMONIAL_SLIDER':
      return { items: [{ name: 'Customer', quote: 'Amazing service!', role: 'CEO' }] };
    case 'IMAGE_CAROUSEL':
      return { images: [{ src: '', alt: 'Image 1' }, { src: '', alt: 'Image 2' }] };
    case 'NEWSLETTER':
      return { headline: 'Subscribe to our newsletter', placeholder: 'Enter your email', buttonLabel: 'Subscribe' };
    case 'SEARCH_BOX':
      return { placeholder: 'Search...', buttonLabel: 'Search' };
    case 'SOCIAL_ICONS':
      return { icons: [{ platform: 'twitter', url: '#' }, { platform: 'facebook', url: '#' }, { platform: 'instagram', url: '#' }] };
    case 'COPYRIGHT':
      return { text: `© ${new Date().getFullYear()} My Business. All rights reserved.` };
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
    case 'HEADING':
      return { textAlign: 'left', fontSize: 32, fontWeight: 700, color: null };
    case 'TEXT':
      return { textAlign: 'left', fontSize: 16, color: null };
    case 'BUTTON':
      return { backgroundColor: null, color: null, borderRadius: 10 };
    case 'DIVIDER':
      return { color: 'rgba(255,255,255,0.12)' };
    case 'IMAGE':
      return { borderRadius: 16 };
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
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  const [activePageIndex, setActivePageIndex] = useState(0);
  const [activeComponentIndex, setActiveComponentIndex] = useState(0);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [selectedNodeType, setSelectedNodeType] = useState('WIDGET');
  const [selectedColumnIndex, setSelectedColumnIndex] = useState(0);
  const [inspectorTab, setInspectorTab] = useState('content');
  const [dragIndex, setDragIndex] = useState(null);
  const [dragNewType, setDragNewType] = useState(null);
  const [hoverIndex, setHoverIndex] = useState(null);
  const [activeDragId, setActiveDragId] = useState(null);

  const [paletteQuery, setPaletteQuery] = useState('');
  const [paletteOpen, setPaletteOpen] = useState({});

  const [leftTab, setLeftTab] = useState('elements');
  const [navigatorExpanded, setNavigatorExpanded] = useState({});

  const [canvasPointer, setCanvasPointer] = useState(null);
  const [dropIndicator, setDropIndicator] = useState(null);

  const [previewMode, setPreviewMode] = useState('desktop');
  const [responsiveBreakpoint, setResponsiveBreakpoint] = useState('desktop');

  const [widgetClipboard, setWidgetClipboard] = useState(null);
  const [styleClipboard, setStyleClipboard] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);

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

  const paletteGroups = useMemo(
    () => ({
      'Structure': ['SECTION', 'CONTAINER', 'COLUMNS'],
      'Basic Elements': ['HEADING', 'TEXT', 'BUTTON', 'DIVIDER', 'SPACER', 'ICON', 'ICON_BOX', 'STAR_RATING'],
      'Media': ['IMAGE', 'GALLERY', 'VIDEO', 'ICON_LIST', 'IMAGE_BOX'],
      'Navigation': ['NAVBAR', 'ADVANCED_NAVBAR', 'MENU', 'BREADCRUMBS'],
      'Hero & Headers': ['HERO', 'PAGE_HEADER', 'CALL_TO_ACTION'],
      'Content Blocks': ['FEATURES', 'CONTENT', 'CARDS', 'ICON_CARDS', 'TEAM', 'ABOUT'],
      'Social Proof': ['TESTIMONIALS', 'LOGO_CLOUD', 'REVIEWS', 'COUNTER', 'STATS_CTA'],
      'Products & Commerce': ['PRODUCT_GRID', 'FILTER_TABS', 'PRICING', 'PRICE_TABLE'],
      'Interactive': ['FAQ', 'ACCORDION', 'TABS', 'TOGGLE'],
      'Carousels': ['FEATURE_CAROUSEL', 'MULTI_ROW_CAROUSEL', 'TESTIMONIAL_SLIDER', 'IMAGE_CAROUSEL'],
      'Forms': ['CONTACT_FORM', 'NEWSLETTER', 'SEARCH_BOX'],
      'Footer': ['FOOTER', 'FOOTER_LINKS', 'SOCIAL_ICONS', 'COPYRIGHT'],
    }),
    []
  );

  const paletteFiltered = useMemo(() => {
    const q = paletteQuery.trim().toLowerCase();
    if (!q) return paletteGroups;
    const next = {};
    for (const [group, items] of Object.entries(paletteGroups)) {
      const filtered = (items ?? []).filter((t) => String(t).toLowerCase().includes(q));
      if (filtered.length) next[group] = filtered;
    }
    return next;
  }, [paletteGroups, paletteQuery]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const { setNodeRef: setCanvasDropRef, isOver: isOverCanvas } = useDroppable({
    id: 'canvas-drop',
  });

  function computeDropIndicatorY({ columnIndex, insertIndex }) {
    if (!canvasPointer?.root) return null;
    const root = canvasPointer.root;
    const rootRect = root.getBoundingClientRect();
    const selector = columnIndex == null ? '[data-builder-comp-idx]' : `[data-builder-col="${columnIndex}"][data-builder-comp-idx]`;
    const nodes = Array.from(root.querySelectorAll(selector));
    if (!nodes.length) return 16;

    const idx = Math.max(0, Number(insertIndex) || 0);
    if (idx >= nodes.length) {
      const last = nodes[nodes.length - 1].getBoundingClientRect();
      return Math.max(0, last.bottom - rootRect.top);
    }
    const rect = nodes[idx].getBoundingClientRect();
    return Math.max(0, rect.top - rootRect.top);
  }

  function computeCanvasInsertIndexFromPointer() {
    if (!canvasPointer) return null;
    const root = canvasPointer.root;
    if (!root) return null;
    const nodes = root.querySelectorAll('[data-builder-comp-idx]');
    if (!nodes?.length) return 0;

    const y = canvasPointer.y;
    let bestIdx = null;
    let bestDist = Infinity;
    for (const el of nodes) {
      const idxStr = el.getAttribute('data-builder-comp-idx');
      const idx = Number(idxStr);
      if (!Number.isFinite(idx)) continue;
      const rect = el.getBoundingClientRect();
      const mid = rect.top + rect.height / 2;
      const d = Math.abs(y - mid);
      if (d < bestDist) {
        bestDist = d;
        bestIdx = idx;
      }
    }
    if (bestIdx === null) return 0;
    const bestEl = root.querySelector(`[data-builder-comp-idx="${bestIdx}"]`);
    if (!bestEl) return bestIdx;
    const r = bestEl.getBoundingClientRect();
    const mid = r.top + r.height / 2;
    return y < mid ? bestIdx : bestIdx + 1;
  }

  function computeCanvasInsertIndexForColumnFromPointer(columnIndex) {
    if (!canvasPointer) return null;
    const root = canvasPointer.root;
    if (!root) return null;
    const nodes = root.querySelectorAll(`[data-builder-comp-idx][data-builder-col="${columnIndex}"]`);
    if (!nodes?.length) return 0;
    const y = canvasPointer.y;
    let bestIdx = null;
    let bestDist = Infinity;
    for (const el of nodes) {
      const idxStr = el.getAttribute('data-builder-comp-idx');
      const idx = Number(idxStr);
      if (!Number.isFinite(idx)) continue;
      const rect = el.getBoundingClientRect();
      const mid = rect.top + rect.height / 2;
      const d = Math.abs(y - mid);
      if (d < bestDist) {
        bestDist = d;
        bestIdx = idx;
      }
    }
    if (bestIdx === null) return 0;
    const bestEl = root.querySelector(`[data-builder-col="${columnIndex}"][data-builder-comp-idx="${bestIdx}"]`);
    if (!bestEl) return bestIdx;
    const r = bestEl.getBoundingClientRect();
    const mid = r.top + r.height / 2;
    return y < mid ? bestIdx : bestIdx + 1;
  }

  function computeColumnTargetFromPointer() {
    if (!canvasPointer) return 0;
    const root = canvasPointer.root;
    if (!root) return 0;
    const rect = root.getBoundingClientRect();
    const midX = rect.left + rect.width / 2;
    return canvasPointer.x < midX ? 0 : 1;
  }

  useEffect(() => {
    if (!pages?.length) return;
    const p = pages?.[activePageIndex];
    const builder = ensureBuilderHasColumn(p?.builder);
    const widgets = collectWidgetNodesInRenderOrder(builder);
    const nextId = widgets?.[activeComponentIndex]?.id ?? null;
    if (!nextId) return;
    const { columnIndex } = deriveHierarchyFromWidgetId(builder, nextId);
    setSelectedNodeId(nextId);
    setSelectedNodeType('WIDGET');
    setSelectedColumnIndex(columnIndex);
  }, [pages, activePageIndex, activeComponentIndex]);

  // Unsaved changes warning
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        return e.returnValue;
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Check if page is empty to show welcome
  useEffect(() => {
    if (!pages?.length) return;
    const p = pages?.[activePageIndex];
    const builder = p?.builder;
    const widgets = collectWidgetNodesInRenderOrder(ensureBuilderHasColumn(builder));
    if (widgets.length === 0 && !showWelcome) {
      setShowWelcome(true);
    }
  }, [pages, activePageIndex]);

  // Helper to update pages and mark as unsaved
  function updatePagesWithChange(updater) {
    setPages(updater);
    setHasUnsavedChanges(true);
  }

  function selectWidget({ widgetId, columnIndex = 0, componentIndex = 0 }) {
    const p = pages?.[activePageIndex];
    const b = ensureBuilderHasColumn(p?.builder);
    const derived = widgetId ? deriveHierarchyFromWidgetId(b, widgetId) : null;
    const nextColumnIndex = derived?.columnIndex ?? columnIndex;
    setSelectedNodeId(widgetId ?? null);
    setSelectedNodeType('WIDGET');
    setSelectedColumnIndex(nextColumnIndex);
    setActiveComponentIndex(componentIndex);
    setInspectorTab('content');
  }

  function selectColumn({ columnIndex }) {
    setSelectedNodeType('COLUMN');
    setSelectedColumnIndex(columnIndex);
    const { columns } = getColumns(pages?.[activePageIndex]?.builder);
    const colId = columns?.[columnIndex]?.id ?? null;
    setSelectedNodeId(colId);
    setInspectorTab('style');
  }

  function selectContainer() {
    const p = pages?.[activePageIndex];
    const b = ensureBuilderHasColumn(p?.builder);
    const derived = selectedNodeType === 'WIDGET' && selectedNodeId ? deriveHierarchyFromWidgetId(b, selectedNodeId) : null;
    const { container } = derived?.container ? { container: derived.container } : getSectionContainerColumns(b);
    setSelectedNodeType('CONTAINER');
    setSelectedNodeId(container?.id ?? null);
    setInspectorTab('style');
  }

  function selectSection() {
    const p = pages?.[activePageIndex];
    const b = ensureBuilderHasColumn(p?.builder);
    const derived = selectedNodeType === 'WIDGET' && selectedNodeId ? deriveHierarchyFromWidgetId(b, selectedNodeId) : null;
    const { section } = derived?.section ? { section: derived.section } : getSectionContainerColumns(b);
    setSelectedNodeType('SECTION');
    setSelectedNodeId(section?.id ?? null);
    setInspectorTab('style');
  }

  function updateSelectedNodeStyle(patch) {
    setPages((prev) => {
      const next = deepClone(prev ?? []);
      const p = next?.[activePageIndex];
      if (!p) return prev;
      if (!selectedNodeId) return prev;
      p.builder = updateAnyNodeById(p.builder, selectedNodeId, (node) => {
        node.style = { ...(node.style ?? {}), ...(patch ?? {}) };
      });
      return next;
    });
    setHasUnsavedChanges(true);
  }

  function updateSelectedColumn(mutator) {
    setPages((prev) => {
      const next = deepClone(prev ?? []);
      const p = next?.[activePageIndex];
      if (!p) return prev;
      const { builder: b, columns } = getColumns(p.builder);
      const col = columns?.[selectedColumnIndex] ?? null;
      if (!col) return prev;
      mutator(col);
      p.builder = b;
      return next;
    });
    setHasUnsavedChanges(true);
  }

  async function reloadBuilder() {
    const { data: payload } = await api.get(`/websites/${websiteId}/builder`);
    setWebsite(payload.website);
    setPages(payload.pages ?? []);
    setActivePageIndex(0);
    setActiveComponentIndex(0);
  }

  function updateActiveComponent(mutator) {
    setPages((prev) => {
      const next = deepClone(prev ?? []);
      const page2 = next?.[activePageIndex];
      if (!page2) return prev;
      setHasUnsavedChanges(true);

      const widgets = collectWidgetNodesInRenderOrder(ensureBuilderHasColumn(page2.builder));
      const widget = widgets?.[activeComponentIndex];
      if (!widget) return prev;

      page2.builder = updateWidgetNodeById(page2.builder, widget.id, (node) => {
        const proxy = {
          type: node.widgetType,
          props: node.props ?? {},
          styles: node.style ?? {},
        };
        mutator(proxy);
        node.props = proxy.props ?? {};
        node.style = proxy.styles ?? {};
      });

      return next;
    });
  }

  useEffect(() => {
    let canceled = false;

    async function load() {
      try {
        setError(null);
        const { data: payload } = await api.get(`/websites/${websiteId}/builder`);
        if (!canceled) {
          setWebsite(payload.website);
          setPages(payload.pages ?? []);
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
    if (!Number.isFinite(websiteId)) {
      setError('Invalid website ID');
      return;
    }
    
    setSaving(true);
    setStatus('Saving...');
    setError(null);
    
    try {
      const payloadPages = (nextPages ?? []).map((p, pidx) => ({
        id: p.id,
        name: p.name,
        path: p.path,
        sortOrder: p.sortOrder ?? p.sort_order ?? pidx,
        meta: p.meta ?? {},
        builder: p.builder ?? {},
      }));

      console.log('Saving builder data:', { websiteId, pages: payloadPages });
      
      const { data: resp } = await api.put(`/websites/${websiteId}/builder`, { pages: payloadPages });
      
      console.log('Save response:', resp);
      
      if (resp?.website) setWebsite(resp.website);
      if (resp?.pages) setPages(resp.pages);
      setHasUnsavedChanges(false);
      setStatus('Saved ✓');
    } catch (err) {
      console.error('Save error:', err);
      const errorMsg = err?.response?.data?.error?.message || err?.response?.data?.message || err?.message || 'Failed to save';
      setError(errorMsg);
      setStatus('Save failed');
    } finally {
      setSaving(false);
      setTimeout(() => setStatus(null), 2500);
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
      const next = deepClone(prev ?? []);
      const page = next?.[activePageIndex];
      if (!page) return prev;

      page.builder = reorderWidgetsInFirstColumn(page.builder, fromIndex, toIndex);
      return next;
    });
    setHasUnsavedChanges(true);
    setActiveComponentIndex(toIndex);
  }

  function duplicateComponentAt(index) {
    setPages((prev) => {
      const next = deepClone(prev ?? []);
      const page2 = next?.[activePageIndex];
      if (!page2) return prev;

      const widgets = collectWidgetNodesInRenderOrder(ensureBuilderHasColumn(page2.builder));
      const i = Number(index);
      const src = widgets?.[i];
      if (!src?.id) return prev;
      page2.builder = duplicateWidgetById(page2.builder, src.id);
      return next;
    });
    setHasUnsavedChanges(true);
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
      const next = deepClone(prev ?? []);
      const page = next?.[activePageIndex];
      if (!page) return prev;

      const insertionIndex = Math.max(0, Number(index) || 0);
      page.builder = insertWidgetIntoFirstColumn(
        page.builder,
        insertionIndex,
        type,
        defaultPropsForType(type),
        defaultStylesForType(type)
      );
      return next;
    });
    setHasUnsavedChanges(true);
    setActiveComponentIndex(Math.max(0, Number(index) || 0));
  }

  function insertLayout(type, indexHint) {
    if (!type) return;
    if (!pages?.length) return;
    const p0 = pages?.[activePageIndex];
    if (!p0) return;

    const currentBuilder = ensureBuilderHasColumn(p0.builder);
    const derived =
      selectedNodeType === 'WIDGET' && selectedNodeId
        ? deriveHierarchyFromWidgetId(currentBuilder, selectedNodeId)
        : { section: findFirstSectionNode(currentBuilder), container: findFirstContainerNode(currentBuilder), column: null, columnIndex: 0 };

    setPages((prev) => {
      const next = deepClone(prev ?? []);
      const page = next?.[activePageIndex];
      if (!page) return prev;

      const b = ensureBuilderHasColumn(page.builder);

      if (type === 'SECTION') {
        const root = b?.root;
        const sections = (root?.children ?? []).filter((n) => n?.type === 'SECTION');
        const baseIdx = sections.findIndex((s) => s?.id === derived?.section?.id);
        const insertAt = Number.isFinite(Number(indexHint)) ? Number(indexHint) : baseIdx >= 0 ? baseIdx + 1 : (root?.children ?? []).length;
        const result = insertSectionAt(b, insertAt);
        page.builder = result.builder;
        setSelectedNodeType('SECTION');
        setSelectedNodeId(result.sectionId);
        setInspectorTab('style');
        return next;
      }

      if (type === 'CONTAINER') {
        const sectionId = derived?.section?.id ?? null;
        const result = insertContainerIntoSection(b, sectionId);
        page.builder = result.builder;
        if (result.containerId) {
          setSelectedNodeType('CONTAINER');
          setSelectedNodeId(result.containerId);
          setInspectorTab('style');
        }
        return next;
      }

      if (type === 'COLUMNS') {
        const containerId = derived?.container?.id ?? null;
        page.builder = applyTwoColumnsToContainer(b, containerId, '50-50');
        if (containerId) {
          setSelectedNodeType('CONTAINER');
          setSelectedNodeId(containerId);
        }
        setInspectorTab('style');
        return next;
      }

      return prev;
    });
    setHasUnsavedChanges(true);
  }

  const twoColEnabledForShortcuts = (() => {
    const p = pages?.[activePageIndex];
    if (!p) return false;
    const { columns } = getColumns(p.builder);
    return (columns?.length ?? 0) >= 2;
  })();

  useEffect(() => {
    function isTypingTarget(target) {
      const el = target;
      if (!el) return false;
      const tag = String(el.tagName ?? '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return true;
      if (el.isContentEditable) return true;
      return false;
    }

    function onKeyDown(e) {
      if (isTypingTarget(e.target)) return;

      const key = String(e.key ?? '').toLowerCase();
      const meta = !!(e.metaKey || e.ctrlKey);

      if (key === 'escape') {
        if (contextMenu) {
          e.preventDefault();
          closeContextMenu();
        }
        return;
      }

      if (key === 'delete' || key === 'backspace') {
        if (selectedNodeType === 'WIDGET') {
          e.preventDefault();
          closeContextMenu();
          deleteSelectedWidget();
        }
        return;
      }

      if (meta && key === 'd') {
        if (selectedNodeType === 'WIDGET') {
          e.preventDefault();
          closeContextMenu();
          duplicateSelectedWidget();
        }
        return;
      }

      if (meta && key === 'c') {
        if (selectedNodeType === 'WIDGET') {
          e.preventDefault();
          copySelectedWidget();
        } else if (selectedNodeType === 'SECTION' || selectedNodeType === 'CONTAINER' || selectedNodeType === 'COLUMN') {
          e.preventDefault();
          copySelectedStyle();
        }
        return;
      }

      if (meta && key === 'v') {
        if (selectedNodeType === 'WIDGET') {
          e.preventDefault();
          closeContextMenu();
          pasteAfterSelectedWidget();
        } else if (selectedNodeType === 'SECTION' || selectedNodeType === 'CONTAINER' || selectedNodeType === 'COLUMN') {
          e.preventDefault();
          closeContextMenu();
          pasteSelectedStyle();
        }
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    pages,
    activePageIndex,
    activeComponentIndex,
    selectedNodeId,
    selectedNodeType,
    selectedColumnIndex,
    widgetClipboard,
    styleClipboard,
    twoColEnabledForShortcuts,
    contextMenu,
  ]);

  const navigatorTree = useMemo(() => buildHierarchyTree(pages?.[activePageIndex]?.builder), [pages, activePageIndex]);

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

  const derivedPages = (pages ?? []).map((p) => {
    const builder = ensureBuilderHasColumn(p.builder);
    const widgets = collectWidgetNodesInRenderOrder(builder);
    return {
      ...p,
      builder,
      _widgetIds: widgets.map((w) => w.id),
      components: widgetNodesToFlatComponents(widgets),
    };
  });

  const page = derivedPages?.[activePageIndex] ?? null;
  const comps = page?.components ?? [];
  const activeComponent = comps?.[activeComponentIndex] ?? null;

  const layerIds = comps.map((c, idx) => c.__cid ?? c.id ?? `${c.type}-${idx}`);

  const activeDragLabel = (() => {
    if (!activeDragId) return null;
    if (typeof activeDragId === 'string' && activeDragId.startsWith('new:')) {
      return activeDragId.slice('new:'.length);
    }
    const idx = layerIds.indexOf(activeDragId);
    const comp = idx >= 0 ? comps[idx] : null;
    return comp?.type ?? null;
  })();

  const selectedNodeStyle = (() => {
    const p = pages?.[activePageIndex];
    if (!p || !selectedNodeId) return {};
    const node = findAnyNodeById(p.builder, selectedNodeId);
    return node?.style ?? {};
  })();

  const previewWidth = previewMode === 'mobile' ? 375 : previewMode === 'tablet' ? 768 : null;

  const twoColInfo = (() => {
    if (!page) return { enabled: false };
    const { columns } = getColumns(page.builder);
    return { enabled: (columns?.length ?? 0) >= 2 };
  })();

  const selectedLabel = (() => {
    if (!selectedNodeId) return 'None';
    if (selectedNodeType === 'COLUMN') return `Column ${selectedColumnIndex + 1}`;
    if (selectedNodeType === 'CONTAINER') return 'Container';
    if (selectedNodeType === 'SECTION') return 'Section';
    return activeComponent?.type ?? 'Widget';
  })();

  const breadcrumbIds = (() => {
    const p = pages?.[activePageIndex];
    const b = ensureBuilderHasColumn(p?.builder);

    if (selectedNodeType === 'WIDGET' && selectedNodeId) {
      const derived = deriveHierarchyFromWidgetId(b, selectedNodeId);
      return {
        sectionId: derived?.section?.id ?? null,
        containerId: derived?.container?.id ?? null,
        columnId: derived?.column?.id ?? null,
        widgetId: selectedNodeId,
      };
    }

    const { section, container, columns } = getSectionContainerColumns(b);
    const colId = columns?.[selectedColumnIndex]?.id ?? null;
    return {
      sectionId: section?.id ?? null,
      containerId: container?.id ?? null,
      columnId: colId,
      widgetId: null,
    };
  })();

  function closeContextMenu() {
    setContextMenu(null);
  }

  function copySelectedWidget() {
    const p = pages?.[activePageIndex];
    if (!p) return;
    if (selectedNodeType !== 'WIDGET' || !selectedNodeId) return;

    const node = findAnyNodeById(p.builder, selectedNodeId);
    if (!node || node.type !== 'WIDGET') return;
    setWidgetClipboard({ widgetType: node.widgetType, props: deepClone(node.props ?? {}), style: deepClone(node.style ?? {}) });
    setStatus('Copied');
    setTimeout(() => setStatus(null), 800);
  }

  function copySelectedStyle() {
    const p = pages?.[activePageIndex];
    if (!p) return;
    if (!(selectedNodeType === 'SECTION' || selectedNodeType === 'CONTAINER' || selectedNodeType === 'COLUMN')) return;
    if (!selectedNodeId) return;

    const node = findAnyNodeById(p.builder, selectedNodeId);
    if (!node) return;
    setStyleClipboard({ style: deepClone(node.style ?? {}) });
    setStatus('Copied');
    setTimeout(() => setStatus(null), 800);
  }

  function pasteSelectedStyle() {
    if (!styleClipboard?.style) return;
    if (!(selectedNodeType === 'SECTION' || selectedNodeType === 'CONTAINER' || selectedNodeType === 'COLUMN')) return;
    if (!selectedNodeId) return;
    updateSelectedNodeStyle(deepClone(styleClipboard.style));
  }

  function deleteSelectedWidget() {
    if (selectedNodeType !== 'WIDGET') return;
    setPages((prev) => {
      const next = deepClone(prev ?? []);
      const page2 = next?.[activePageIndex];
      if (!page2) return prev;

      const widgets = collectWidgetNodesInRenderOrder(ensureBuilderHasColumn(page2.builder));
      const idx = Number(activeComponentIndex);
      const widgetId = widgets?.[idx]?.id ?? selectedNodeId ?? null;
      if (!widgetId) return prev;
      page2.builder = removeWidgetById(page2.builder, widgetId);

      return next;
    });
    setHasUnsavedChanges(true);
    setActiveComponentIndex((cur) => Math.max(0, Number(cur) - 1));
    setSelectedNodeId(null);
  }

  function duplicateSelectedWidget() {
    if (selectedNodeType !== 'WIDGET' || !selectedNodeId) return;
    setPages((prev) => {
      const next = deepClone(prev ?? []);
      const page2 = next?.[activePageIndex];
      if (!page2) return prev;

      page2.builder = duplicateWidgetById(page2.builder, selectedNodeId);
      return next;
    });
    setHasUnsavedChanges(true);
    setActiveComponentIndex((cur) => {
      const i = Number(cur);
      if (!Number.isFinite(i)) return cur;
      return i + 1;
    });
  }

  function pasteAfterSelectedWidget() {
    if (!widgetClipboard?.widgetType) return;
    setPages((prev) => {
      const next = deepClone(prev ?? []);
      const page2 = next?.[activePageIndex];
      if (!page2) return prev;

      const idx = Number(activeComponentIndex);
      const insertAt = Number.isFinite(idx) ? idx + 1 : 0;
      if (twoColInfo.enabled) {
        page2.builder = insertWidgetIntoColumn(
          page2.builder,
          selectedColumnIndex,
          insertAt,
          widgetClipboard.widgetType,
          deepClone(widgetClipboard.props ?? {}),
          deepClone(widgetClipboard.style ?? {})
        );
      } else {
        page2.builder = insertWidgetIntoFirstColumn(
          page2.builder,
          insertAt,
          widgetClipboard.widgetType,
          deepClone(widgetClipboard.props ?? {}),
          deepClone(widgetClipboard.style ?? {})
        );
      }

      return next;
    });
    setHasUnsavedChanges(true);
    setActiveComponentIndex((cur) => {
      const i = Number(cur);
      if (!Number.isFinite(i)) return cur;
      return i + 1;
    });
  }

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
          <SmallButton variant={hasUnsavedChanges ? "primary" : "neutral"} onClick={() => saveStructure(pages)} disabled={saving}>
            {saving ? 'Saving...' : hasUnsavedChanges ? '● Save*' : 'Save'}
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
                                await api.post(`/websites/${websiteId}/versions/${v.id}/restore`);
                                await reloadBuilder();
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

      {contextMenu ? (
        <div className="fixed inset-0 z-50" onMouseDown={closeContextMenu}>
          <div
            className="absolute rounded-xl border border-white/10 bg-black/90 shadow-xl p-1 min-w-[180px]"
            style={{ left: `${contextMenu.x}px`, top: `${contextMenu.y}px` }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            {selectedNodeType === 'WIDGET' ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    closeContextMenu();
                    copySelectedWidget();
                  }}
                  className="w-full rounded-lg px-3 py-2 text-left text-xs text-white/80 hover:bg-white/10"
                >
                  Copy
                </button>
                <button
                  type="button"
                  disabled={!widgetClipboard?.widgetType}
                  onClick={() => {
                    closeContextMenu();
                    pasteAfterSelectedWidget();
                  }}
                  className="w-full rounded-lg px-3 py-2 text-left text-xs text-white/80 hover:bg-white/10 disabled:opacity-40"
                >
                  Paste
                </button>
                <button
                  type="button"
                  onClick={() => {
                    closeContextMenu();
                    duplicateSelectedWidget();
                  }}
                  className="w-full rounded-lg px-3 py-2 text-left text-xs text-white/80 hover:bg-white/10"
                >
                  Duplicate
                </button>
                <div className="my-1 h-px bg-white/10" />
                <button
                  type="button"
                  onClick={() => {
                    closeContextMenu();
                    deleteSelectedWidget();
                  }}
                  className="w-full rounded-lg px-3 py-2 text-left text-xs text-red-200 hover:bg-red-500/10"
                >
                  Delete
                </button>
              </>
            ) : selectedNodeType === 'SECTION' || selectedNodeType === 'CONTAINER' || selectedNodeType === 'COLUMN' ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    closeContextMenu();
                    copySelectedStyle();
                  }}
                  className="w-full rounded-lg px-3 py-2 text-left text-xs text-white/80 hover:bg-white/10"
                >
                  Copy Style
                </button>
                <button
                  type="button"
                  disabled={!styleClipboard?.style}
                  onClick={() => {
                    closeContextMenu();
                    pasteSelectedStyle();
                  }}
                  className="w-full rounded-lg px-3 py-2 text-left text-xs text-white/80 hover:bg-white/10 disabled:opacity-40"
                >
                  Paste Style
                </button>
              </>
            ) : (
              <div className="px-3 py-2 text-xs text-white/60">No actions</div>
            )}
          </div>
        </div>
      ) : null}

      {/* Welcome Layout Picker Modal */}
      {showWelcome ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={(e) => { e.stopPropagation(); setShowWelcome(false); }}>
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <div className="relative z-10 w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900 to-black shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="border-b border-white/10 bg-black/40 px-6 py-4 flex items-center justify-between">
              <div>
                <div className="text-xl font-bold">Welcome to the Builder</div>
                <div className="text-sm text-white/60 mt-1">Choose a starting layout or start from scratch</div>
              </div>
              <button type="button" onClick={() => setShowWelcome(false)} className="text-white/60 hover:text-white text-2xl leading-none">&times;</button>
            </div>
            <div className="p-6 max-h-[70vh] overflow-auto">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {/* Blank Page */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowWelcome(false);
                    setTimeout(() => insertLayout('SECTION', null), 50);
                  }}
                  className="group rounded-xl border-2 border-dashed border-white/20 bg-white/5 p-6 text-center hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all"
                >
                  <div className="h-24 flex items-center justify-center text-4xl text-white/30 group-hover:text-indigo-400">+</div>
                  <div className="mt-3 font-semibold">Blank Page</div>
                  <div className="text-xs text-white/50 mt-1">Start from scratch</div>
                </button>

                {/* Landing Page */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowWelcome(false);
                    setTimeout(() => {
                      insertLayout('SECTION', null);
                      setTimeout(() => {
                        insertComponentAt(0, 'NAVBAR');
                        insertComponentAt(1, 'HERO');
                        insertComponentAt(2, 'FEATURES');
                        insertComponentAt(3, 'TESTIMONIALS');
                        insertComponentAt(4, 'FAQ');
                        insertComponentAt(5, 'FOOTER_LINKS');
                      }, 100);
                    }, 50);
                  }}
                  className="group rounded-xl border border-white/10 bg-white/5 p-6 text-center hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all"
                >
                  <div className="h-24 flex flex-col items-center justify-center gap-1">
                    <div className="w-full h-3 bg-white/20 rounded group-hover:bg-indigo-500/40"></div>
                    <div className="w-full h-8 bg-white/10 rounded group-hover:bg-indigo-500/20"></div>
                    <div className="w-full flex gap-1">
                      <div className="flex-1 h-4 bg-white/10 rounded group-hover:bg-indigo-500/20"></div>
                      <div className="flex-1 h-4 bg-white/10 rounded group-hover:bg-indigo-500/20"></div>
                      <div className="flex-1 h-4 bg-white/10 rounded group-hover:bg-indigo-500/20"></div>
                    </div>
                    <div className="w-full h-3 bg-white/10 rounded group-hover:bg-indigo-500/20"></div>
                  </div>
                  <div className="mt-3 font-semibold">Landing Page</div>
                  <div className="text-xs text-white/50 mt-1">Hero, Features, Testimonials</div>
                </button>

                {/* Business Page */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowWelcome(false);
                    setTimeout(() => {
                      insertLayout('SECTION', null);
                      setTimeout(() => {
                        insertComponentAt(0, 'ADVANCED_NAVBAR');
                        insertComponentAt(1, 'HERO');
                        insertComponentAt(2, 'LOGO_CLOUD');
                        insertComponentAt(3, 'FEATURES');
                        insertComponentAt(4, 'CARDS');
                        insertComponentAt(5, 'STATS_CTA');
                        insertComponentAt(6, 'FOOTER_LINKS');
                      }, 100);
                    }, 50);
                  }}
                  className="group rounded-xl border border-white/10 bg-white/5 p-6 text-center hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all"
                >
                  <div className="h-24 flex flex-col items-center justify-center gap-1">
                    <div className="w-full h-3 bg-white/20 rounded group-hover:bg-indigo-500/40"></div>
                    <div className="w-full h-6 bg-white/10 rounded group-hover:bg-indigo-500/20"></div>
                    <div className="w-full flex gap-1">
                      <div className="w-4 h-4 bg-white/20 rounded group-hover:bg-indigo-500/30"></div>
                      <div className="w-4 h-4 bg-white/20 rounded group-hover:bg-indigo-500/30"></div>
                      <div className="w-4 h-4 bg-white/20 rounded group-hover:bg-indigo-500/30"></div>
                    </div>
                    <div className="w-full h-6 bg-white/10 rounded group-hover:bg-indigo-500/20"></div>
                  </div>
                  <div className="mt-3 font-semibold">Business</div>
                  <div className="text-xs text-white/50 mt-1">Professional layout</div>
                </button>

                {/* E-commerce */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowWelcome(false);
                    setTimeout(() => {
                      insertLayout('SECTION', null);
                      setTimeout(() => {
                        insertComponentAt(0, 'ADVANCED_NAVBAR');
                        insertComponentAt(1, 'HERO');
                        insertComponentAt(2, 'FILTER_TABS');
                        insertComponentAt(3, 'PRODUCT_GRID');
                        insertComponentAt(4, 'TESTIMONIALS');
                        insertComponentAt(5, 'FOOTER_LINKS');
                      }, 100);
                    }, 50);
                  }}
                  className="group rounded-xl border border-white/10 bg-white/5 p-6 text-center hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all"
                >
                  <div className="h-24 flex flex-col items-center justify-center gap-1">
                    <div className="w-full h-3 bg-white/20 rounded group-hover:bg-indigo-500/40"></div>
                    <div className="w-full grid grid-cols-3 gap-1">
                      <div className="h-8 bg-white/10 rounded group-hover:bg-indigo-500/20"></div>
                      <div className="h-8 bg-white/10 rounded group-hover:bg-indigo-500/20"></div>
                      <div className="h-8 bg-white/10 rounded group-hover:bg-indigo-500/20"></div>
                      <div className="h-8 bg-white/10 rounded group-hover:bg-indigo-500/20"></div>
                      <div className="h-8 bg-white/10 rounded group-hover:bg-indigo-500/20"></div>
                      <div className="h-8 bg-white/10 rounded group-hover:bg-indigo-500/20"></div>
                    </div>
                  </div>
                  <div className="mt-3 font-semibold">E-commerce</div>
                  <div className="text-xs text-white/50 mt-1">Products & Shop</div>
                </button>

                {/* Portfolio */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowWelcome(false);
                    setTimeout(() => {
                      insertLayout('SECTION', null);
                      setTimeout(() => {
                        insertComponentAt(0, 'NAVBAR');
                        insertComponentAt(1, 'HERO');
                        insertComponentAt(2, 'GALLERY');
                        insertComponentAt(3, 'CONTACT_FORM');
                        insertComponentAt(4, 'FOOTER');
                      }, 100);
                    }, 50);
                  }}
                  className="group rounded-xl border border-white/10 bg-white/5 p-6 text-center hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all"
                >
                  <div className="h-24 flex flex-col items-center justify-center gap-1">
                    <div className="w-full h-3 bg-white/20 rounded group-hover:bg-indigo-500/40"></div>
                    <div className="w-full h-6 bg-white/10 rounded group-hover:bg-indigo-500/20"></div>
                    <div className="w-full grid grid-cols-4 gap-1">
                      <div className="h-6 bg-white/15 rounded group-hover:bg-indigo-500/25"></div>
                      <div className="h-6 bg-white/15 rounded group-hover:bg-indigo-500/25"></div>
                      <div className="h-6 bg-white/15 rounded group-hover:bg-indigo-500/25"></div>
                      <div className="h-6 bg-white/15 rounded group-hover:bg-indigo-500/25"></div>
                    </div>
                  </div>
                  <div className="mt-3 font-semibold">Portfolio</div>
                  <div className="text-xs text-white/50 mt-1">Gallery & Contact</div>
                </button>

                {/* SaaS */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowWelcome(false);
                    setTimeout(() => {
                      insertLayout('SECTION', null);
                      setTimeout(() => {
                        insertComponentAt(0, 'ADVANCED_NAVBAR');
                        insertComponentAt(1, 'HERO');
                        insertComponentAt(2, 'FEATURES');
                        insertComponentAt(3, 'PRICING');
                        insertComponentAt(4, 'FAQ');
                        insertComponentAt(5, 'FOOTER_LINKS');
                      }, 100);
                    }, 50);
                  }}
                  className="group rounded-xl border border-white/10 bg-white/5 p-6 text-center hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all"
                >
                  <div className="h-24 flex flex-col items-center justify-center gap-1">
                    <div className="w-full h-3 bg-white/20 rounded group-hover:bg-indigo-500/40"></div>
                    <div className="w-full h-6 bg-white/10 rounded group-hover:bg-indigo-500/20"></div>
                    <div className="w-full flex gap-1 justify-center">
                      <div className="w-8 h-10 bg-white/10 rounded group-hover:bg-indigo-500/20"></div>
                      <div className="w-8 h-12 bg-white/20 rounded group-hover:bg-indigo-500/30"></div>
                      <div className="w-8 h-10 bg-white/10 rounded group-hover:bg-indigo-500/20"></div>
                    </div>
                  </div>
                  <div className="mt-3 font-semibold">SaaS</div>
                  <div className="text-xs text-white/50 mt-1">Features & Pricing</div>
                </button>
              </div>

              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => setShowWelcome(false)}
                  className="text-sm text-white/50 hover:text-white/80 underline"
                >
                  Skip and start empty
                </button>
              </div>
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
              : 'rounded-2xl border border-white/10 bg-white/5 p-4 space-y-4 overflow-y-auto'
          }
        >
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold">Panels</div>
          </div>

          <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-black/20 p-1">
            <button
              type="button"
              onClick={() => setLeftTab('elements')}
              className={`flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition ${
                leftTab === 'elements'
                  ? 'bg-indigo-500/30 text-white'
                  : 'text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              ▦ Elements
            </button>
            <button
              type="button"
              onClick={() => setLeftTab('navigator')}
              className={`flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition ${
                leftTab === 'navigator'
                  ? 'bg-indigo-500/30 text-white'
                  : 'text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              ☰ Navigator
            </button>
            <button
              type="button"
              onClick={() => setLeftTab('settings')}
              className={`flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition ${
                leftTab === 'settings'
                  ? 'bg-indigo-500/30 text-white'
                  : 'text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              ⚙ Settings
            </button>
          </div>

          {leftTab === 'elements' ? (
            <div className="space-y-3">
              <label className="block">
                <div className="text-xs text-white/60">Search</div>
                <input
                  value={paletteQuery}
                  onChange={(e) => setPaletteQuery(e.target.value)}
                  placeholder="Search components…"
                  className="mt-1 w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm"
                />
              </label>

              <div className="space-y-2">
                {Object.entries(paletteFiltered ?? {}).map(([group, items]) => {
                  const open = paletteOpen[group] !== false;
                  const groupIcons = {
                    'Structure': '▭',
                    'Basic Elements': '▢',
                    'Media': '▣',
                    'Navigation': '≣',
                    'Hero & Headers': '★',
                    'Content Blocks': '▤',
                    'Social Proof': '💬',
                    'Products & Commerce': '💰',
                    'Interactive': '▼',
                    'Carousels': '⇆',
                    'Forms': '✉',
                    'Footer': '▁',
                  };
                  const groupIcon = groupIcons[group] ?? '▦';
                  return (
                    <ElementsGroup
                      key={group}
                      title={group}
                      icon={groupIcon}
                      count={(items ?? []).length}
                      open={open}
                      onToggle={() => setPaletteOpen((p) => ({ ...(p ?? {}), [group]: !(p?.[group] !== false) }))}
                    >
                      <div className="grid grid-cols-1 gap-1.5">
                        {(items ?? []).map((t) => {
                          const meta = typeMeta(t);
                          return (
                            <PaletteDraggable
                              key={t}
                              type={t}
                              label={meta.label}
                              icon={meta.icon}
                              desc={meta.desc}
                              onClick={() => {
                                if (!t) return;
                                if (t === 'SECTION' || t === 'CONTAINER' || t === 'COLUMNS') {
                                  insertLayout(t, null);
                                  return;
                                }
                                insertComponentAt(comps.length, t);
                              }}
                            />
                          );
                        })}
                      </div>
                    </ElementsGroup>
                  );
                })}
              </div>
            </div>
          ) : leftTab === 'navigator' ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-xs text-white/60">Structure</div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setNavigatorExpanded({})}
                    className="text-[10px] px-2 py-0.5 rounded bg-white/10 hover:bg-white/15 transition"
                    title="Collapse all"
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const all = {};
                      (navigatorTree ?? []).forEach((s) => {
                        all[s.id] = true;
                        (s.children ?? []).forEach((c) => {
                          all[c.id] = true;
                          (c.children ?? []).forEach((col) => { all[col.id] = true; });
                        });
                      });
                      setNavigatorExpanded(all);
                    }}
                    className="text-[10px] px-2 py-0.5 rounded bg-white/10 hover:bg-white/15 transition"
                    title="Expand all"
                  >
                    ▼
                  </button>
                </div>
              </div>
              <div className="space-y-0.5">
                {(navigatorTree ?? []).map((section, sIdx) => {
                  const sectionExpanded = navigatorExpanded[section.id] !== false;
                  return (
                    <div key={section.id}>
                      <NavigatorRow
                        depth={0}
                        icon={typeMeta('SECTION').icon}
                        title={`Section ${sIdx + 1}`}
                        active={selectedNodeId === section.id && selectedNodeType === 'SECTION'}
                        hasChildren={(section.children ?? []).length > 0}
                        expanded={sectionExpanded}
                        onToggle={() => setNavigatorExpanded((p) => ({ ...p, [section.id]: !sectionExpanded }))}
                        onClick={() => {
                          setSelectedNodeType('SECTION');
                          setSelectedNodeId(section.id);
                          setInspectorTab('style');
                        }}
                        actions={
                          <>
                            <NavigatorActionButton icon="+" title="Add container" onClick={() => insertLayout('CONTAINER', null)} />
                          </>
                        }
                      />
                      {sectionExpanded && (section.children ?? []).map((container, cIdx) => {
                        const containerExpanded = navigatorExpanded[container.id] !== false;
                        return (
                          <div key={container.id}>
                            <NavigatorRow
                              depth={1}
                              icon={typeMeta('CONTAINER').icon}
                              title={`Container ${cIdx + 1}`}
                              active={selectedNodeId === container.id && selectedNodeType === 'CONTAINER'}
                              hasChildren={(container.children ?? []).length > 0}
                              expanded={containerExpanded}
                              onToggle={() => setNavigatorExpanded((p) => ({ ...p, [container.id]: !containerExpanded }))}
                              onClick={() => {
                                setSelectedNodeType('CONTAINER');
                                setSelectedNodeId(container.id);
                                setInspectorTab('style');
                              }}
                              actions={
                                <>
                                  <NavigatorActionButton icon="▦" title="Add columns" onClick={() => insertLayout('COLUMNS', null)} />
                                </>
                              }
                            />
                            {containerExpanded && (container.children ?? []).map((col, colIdx) => {
                              const colExpanded = navigatorExpanded[col.id] !== false;
                              return (
                                <div key={col.id}>
                                  <NavigatorRow
                                    depth={2}
                                    icon={typeMeta('COLUMNS').icon}
                                    title={`Column ${colIdx + 1}`}
                                    active={selectedNodeId === col.id && selectedNodeType === 'COLUMN'}
                                    hasChildren={(col.children ?? []).length > 0}
                                    expanded={colExpanded}
                                    onToggle={() => setNavigatorExpanded((p) => ({ ...p, [col.id]: !colExpanded }))}
                                    onClick={() => {
                                      const { columns } = getColumns(page?.builder);
                                      const idx = (columns ?? []).findIndex((c) => c?.id === col.id);
                                      selectColumn({ columnIndex: idx >= 0 ? idx : 0 });
                                    }}
                                  />
                                  {colExpanded && (col.children ?? []).map((w) => {
                                    const wm = typeMeta(w.widgetType);
                                    return (
                                      <NavigatorRow
                                        key={w.id}
                                        depth={3}
                                        icon={wm.icon}
                                        title={wm.label}
                                        active={selectedNodeId === w.id && selectedNodeType === 'WIDGET'}
                                        hasChildren={false}
                                        onClick={() => {
                                          const b = ensureBuilderHasColumn(page?.builder);
                                          const derived = deriveHierarchyFromWidgetId(b, w.id);
                                          const idx = (page?._widgetIds ?? []).indexOf(w.id);
                                          selectWidget({ widgetId: w.id, columnIndex: derived?.columnIndex ?? 0, componentIndex: idx >= 0 ? idx : 0 });
                                        }}
                                        actions={
                                          <>
                                            <NavigatorActionButton
                                              icon="⧉"
                                              title="Duplicate"
                                              onClick={() => {
                                                setPages((prev) => {
                                                  const next = deepClone(prev ?? []);
                                                  const page2 = next?.[activePageIndex];
                                                  if (!page2) return prev;
                                                  page2.builder = duplicateWidgetById(page2.builder, w.id);
                                                  return next;
                                                });
                                                setHasUnsavedChanges(true);
                                              }}
                                            />
                                            <NavigatorActionButton
                                              icon="✕"
                                              title="Delete"
                                              variant="danger"
                                              onClick={() => {
                                                setPages((prev) => {
                                                  const next = deepClone(prev ?? []);
                                                  const page2 = next?.[activePageIndex];
                                                  if (!page2) return prev;
                                                  page2.builder = removeWidgetById(page2.builder, w.id);
                                                  return next;
                                                });
                                                setHasUnsavedChanges(true);
                                                if (selectedNodeId === w.id) {
                                                  setSelectedNodeId(null);
                                                }
                                              }}
                                            />
                                          </>
                                        }
                                      />
                                    );
                                  })}
                                </div>
                              );
                            })}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}

                {(!navigatorTree || navigatorTree.length === 0) && (comps?.length ?? 0) === 0 ? (
                  <div className="rounded-lg border border-white/10 bg-black/20 px-3 py-3 text-xs text-white/50 text-center">
                    <div className="mb-2">No elements yet</div>
                    <button
                      type="button"
                      onClick={() => insertLayout('SECTION', null)}
                      className="text-indigo-300 hover:text-indigo-200 underline"
                    >
                      Add a section
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          ) : leftTab === 'settings' ? (
            <div className="space-y-3">
              <div className="text-xs text-white/60">Site Settings</div>
              
              <CollapsibleSection title="Global Colors" icon="🎨" defaultOpen={true}>
                <div className="space-y-3">
                  <ColorPickerField
                    label="Primary Color"
                    value={themeDraft?.primaryColor ?? website?.settings?.theme?.primaryColor ?? '#6366f1'}
                    onChange={(v) => setThemeDraft((d) => ({ ...(d ?? {}), primaryColor: v }))}
                    placeholder="#6366f1"
                  />
                  <ColorPickerField
                    label="Secondary Color"
                    value={themeDraft?.secondaryColor ?? website?.settings?.theme?.secondaryColor ?? '#8b5cf6'}
                    onChange={(v) => setThemeDraft((d) => ({ ...(d ?? {}), secondaryColor: v }))}
                    placeholder="#8b5cf6"
                  />
                  <ColorPickerField
                    label="Accent Color"
                    value={themeDraft?.accentColor ?? website?.settings?.theme?.accentColor ?? '#f59e0b'}
                    onChange={(v) => setThemeDraft((d) => ({ ...(d ?? {}), accentColor: v }))}
                    placeholder="#f59e0b"
                  />
                  <ColorPickerField
                    label="Text Color"
                    value={themeDraft?.textColor ?? website?.settings?.theme?.textColor ?? '#ffffff'}
                    onChange={(v) => setThemeDraft((d) => ({ ...(d ?? {}), textColor: v }))}
                    placeholder="#ffffff"
                  />
                  <ColorPickerField
                    label="Background Color"
                    value={themeDraft?.backgroundColor ?? website?.settings?.theme?.backgroundColor ?? '#0f172a'}
                    onChange={(v) => setThemeDraft((d) => ({ ...(d ?? {}), backgroundColor: v }))}
                    placeholder="#0f172a"
                  />
                </div>
              </CollapsibleSection>

              <CollapsibleSection title="Typography" icon="T" defaultOpen={false}>
                <div className="space-y-3">
                  <SelectField
                    label="Heading Font"
                    value={designSystemDraft?.headingFont ?? website?.settings?.designSystem?.headingFont ?? ''}
                    onChange={(v) => setDesignSystemDraft((d) => ({ ...(d ?? {}), headingFont: v || null }))}
                    options={[
                      { value: '', label: 'Default (System)' },
                      { value: 'Inter, sans-serif', label: 'Inter' },
                      { value: "'Playfair Display', serif", label: 'Playfair Display' },
                      { value: "'Roboto', sans-serif", label: 'Roboto' },
                      { value: "'Open Sans', sans-serif", label: 'Open Sans' },
                      { value: "'Poppins', sans-serif", label: 'Poppins' },
                      { value: "'Montserrat', sans-serif", label: 'Montserrat' },
                      { value: "Georgia, serif", label: 'Georgia' },
                    ]}
                  />
                  <SelectField
                    label="Body Font"
                    value={designSystemDraft?.bodyFont ?? website?.settings?.designSystem?.bodyFont ?? ''}
                    onChange={(v) => setDesignSystemDraft((d) => ({ ...(d ?? {}), bodyFont: v || null }))}
                    options={[
                      { value: '', label: 'Default (System)' },
                      { value: 'Inter, sans-serif', label: 'Inter' },
                      { value: "'Roboto', sans-serif", label: 'Roboto' },
                      { value: "'Open Sans', sans-serif", label: 'Open Sans' },
                      { value: "'Lato', sans-serif", label: 'Lato' },
                      { value: "'Source Sans Pro', sans-serif", label: 'Source Sans Pro' },
                      { value: "Georgia, serif", label: 'Georgia' },
                    ]}
                  />
                  <NumberSliderField
                    label="Base Font Size"
                    value={designSystemDraft?.baseFontSize ?? website?.settings?.designSystem?.baseFontSize ?? 16}
                    onChange={(v) => setDesignSystemDraft((d) => ({ ...(d ?? {}), baseFontSize: v }))}
                    min={12}
                    max={24}
                  />
                  <NumberSliderField
                    label="Line Height"
                    value={designSystemDraft?.lineHeight ?? website?.settings?.designSystem?.lineHeight ?? 1.6}
                    onChange={(v) => setDesignSystemDraft((d) => ({ ...(d ?? {}), lineHeight: v }))}
                    min={1}
                    max={2.5}
                    step={0.1}
                    unit=""
                  />
                </div>
              </CollapsibleSection>

              <CollapsibleSection title="Spacing & Layout" icon="↔" defaultOpen={false}>
                <div className="space-y-3">
                  <NumberSliderField
                    label="Container Max Width"
                    value={designSystemDraft?.containerMaxWidth ?? website?.settings?.designSystem?.containerMaxWidth ?? 1280}
                    onChange={(v) => setDesignSystemDraft((d) => ({ ...(d ?? {}), containerMaxWidth: v }))}
                    min={800}
                    max={1920}
                  />
                  <NumberSliderField
                    label="Section Padding"
                    value={designSystemDraft?.sectionPadding ?? website?.settings?.designSystem?.sectionPadding ?? 80}
                    onChange={(v) => setDesignSystemDraft((d) => ({ ...(d ?? {}), sectionPadding: v }))}
                    min={20}
                    max={200}
                  />
                  <NumberSliderField
                    label="Element Gap"
                    value={designSystemDraft?.elementGap ?? website?.settings?.designSystem?.elementGap ?? 24}
                    onChange={(v) => setDesignSystemDraft((d) => ({ ...(d ?? {}), elementGap: v }))}
                    min={8}
                    max={64}
                  />
                </div>
              </CollapsibleSection>

              <CollapsibleSection title="Buttons" icon="⏺" defaultOpen={false}>
                <div className="space-y-3">
                  <NumberSliderField
                    label="Border Radius"
                    value={designSystemDraft?.buttonRadius ?? website?.settings?.designSystem?.buttonRadius ?? 8}
                    onChange={(v) => setDesignSystemDraft((d) => ({ ...(d ?? {}), buttonRadius: v }))}
                    min={0}
                    max={50}
                  />
                  <NumberSliderField
                    label="Padding X"
                    value={designSystemDraft?.buttonPaddingX ?? website?.settings?.designSystem?.buttonPaddingX ?? 24}
                    onChange={(v) => setDesignSystemDraft((d) => ({ ...(d ?? {}), buttonPaddingX: v }))}
                    min={8}
                    max={64}
                  />
                  <NumberSliderField
                    label="Padding Y"
                    value={designSystemDraft?.buttonPaddingY ?? website?.settings?.designSystem?.buttonPaddingY ?? 12}
                    onChange={(v) => setDesignSystemDraft((d) => ({ ...(d ?? {}), buttonPaddingY: v }))}
                    min={4}
                    max={32}
                  />
                  <SelectField
                    label="Button Style"
                    value={designSystemDraft?.buttonStyle ?? website?.settings?.designSystem?.buttonStyle ?? 'filled'}
                    onChange={(v) => setDesignSystemDraft((d) => ({ ...(d ?? {}), buttonStyle: v }))}
                    options={[
                      { value: 'filled', label: 'Filled' },
                      { value: 'outline', label: 'Outline' },
                      { value: 'ghost', label: 'Ghost' },
                    ]}
                  />
                </div>
              </CollapsibleSection>

              <CollapsibleSection title="Borders & Shadows" icon="◐" defaultOpen={false}>
                <div className="space-y-3">
                  <NumberSliderField
                    label="Default Border Radius"
                    value={designSystemDraft?.borderRadius ?? website?.settings?.designSystem?.borderRadius ?? 12}
                    onChange={(v) => setDesignSystemDraft((d) => ({ ...(d ?? {}), borderRadius: v }))}
                    min={0}
                    max={32}
                  />
                  <ColorPickerField
                    label="Border Color"
                    value={designSystemDraft?.borderColor ?? website?.settings?.designSystem?.borderColor ?? 'rgba(255,255,255,0.1)'}
                    onChange={(v) => setDesignSystemDraft((d) => ({ ...(d ?? {}), borderColor: v }))}
                    placeholder="rgba(255,255,255,0.1)"
                  />
                  <SelectField
                    label="Shadow Style"
                    value={designSystemDraft?.shadowStyle ?? website?.settings?.designSystem?.shadowStyle ?? 'subtle'}
                    onChange={(v) => setDesignSystemDraft((d) => ({ ...(d ?? {}), shadowStyle: v }))}
                    options={[
                      { value: 'none', label: 'None' },
                      { value: 'subtle', label: 'Subtle' },
                      { value: 'medium', label: 'Medium' },
                      { value: 'strong', label: 'Strong' },
                    ]}
                  />
                </div>
              </CollapsibleSection>

              {(themeDraft || designSystemDraft) && (
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setThemeDraft(null);
                      setDesignSystemDraft(null);
                    }}
                    className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium hover:bg-white/10 transition"
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      setPanelBusy(true);
                      try {
                        const updates = {};
                        if (themeDraft) updates.theme = { ...(website?.settings?.theme ?? {}), ...themeDraft };
                        if (designSystemDraft) updates.designSystem = { ...(website?.settings?.designSystem ?? {}), ...designSystemDraft };
                        await api.patch(`/websites/${websiteId}`, { settings: { ...(website?.settings ?? {}), ...updates } });
                        setThemeDraft(null);
                        setDesignSystemDraft(null);
                        window.location.reload();
                      } catch (err) {
                        console.error(err);
                      } finally {
                        setPanelBusy(false);
                      }
                    }}
                    disabled={panelBusy}
                    className="flex-1 rounded-lg bg-indigo-500 px-3 py-2 text-xs font-medium hover:bg-indigo-400 transition disabled:opacity-50"
                  >
                    {panelBusy ? 'Saving...' : 'Apply Changes'}
                  </button>
                </div>
              )}
            </div>
          ) : null}
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={(evt) => {
            setActiveDragId(evt.active.id);
          }}
          onDragMove={(evt) => {
            if (!evt?.activatorEvent) return;
            const e = evt.activatorEvent;
            const x = e.clientX;
            const y = e.clientY;
            setCanvasPointer((prev) => {
              const container = document.querySelector('[data-canvas-drop-root]');
              if (!container) return prev;
              return { x, y, root: container };
            });

            if (!isOverCanvas) {
              setDropIndicator(null);
              return;
            }

            if (!twoColInfo.enabled) {
              const idx = computeCanvasInsertIndexFromPointer();
              const yPx = computeDropIndicatorY({ columnIndex: null, insertIndex: idx ?? 0 });
              setDropIndicator({ columnIndex: null, index: idx ?? 0, yPx });
              return;
            }

            const colIdx = computeColumnTargetFromPointer();
            const idx = computeCanvasInsertIndexForColumnFromPointer(colIdx);
            const yPx = computeDropIndicatorY({ columnIndex: colIdx, insertIndex: idx ?? 0 });
            setDropIndicator({ columnIndex: colIdx, index: idx ?? 0, yPx });
          }}
          onDragEnd={(evt) => {
            const { active, over } = evt;
            setActiveDragId(null);
            setDropIndicator(null);
            if (!over) return;

            const activeId = active.id;
            const overId = over.id;

            if (typeof activeId === 'string' && activeId.startsWith('new:')) {
              const type = activeId.slice('new:'.length);
              if (overId === 'canvas-drop') {
                if (type === 'SECTION' || type === 'CONTAINER' || type === 'COLUMNS') {
                  insertLayout(type, null);
                  return;
                }
                if (!twoColInfo.enabled) {
                  const idx = computeCanvasInsertIndexFromPointer();
                  insertComponentAt(idx ?? comps.length, type);
                  return;
                }
                const colIdx = computeColumnTargetFromPointer();
                const idx = computeCanvasInsertIndexForColumnFromPointer(colIdx);
                setPages((prev) => {
                  const next = deepClone(prev ?? []);
                  const p = next?.[activePageIndex];
                  if (!p) return prev;
                  p.builder = insertWidgetIntoColumn(p.builder, colIdx, idx ?? 0, type, defaultPropsForType(type), defaultStylesForType(type));
                  return next;
                });
                setHasUnsavedChanges(true);
                return;
              }
              const overIndex = layerIds.indexOf(overId);
              const insertIndex = overIndex >= 0 ? overIndex : comps.length;
              if (type === 'SECTION' || type === 'CONTAINER' || type === 'COLUMNS') {
                insertLayout(type, insertIndex);
                return;
              }
              insertComponentAt(insertIndex, type);
              return;
            }

            if (overId === 'canvas-drop') {
              const oldIndex = layerIds.indexOf(activeId);
              if (oldIndex < 0) return;
              if (!twoColInfo.enabled) {
                const idx = computeCanvasInsertIndexFromPointer();
                reorderComponents(oldIndex, idx ?? Math.max(0, (comps?.length ?? 1) - 1));
                return;
              }
              // In 2-col mode, move the widget node between columns based on pointer X/Y.
              const widgetId = String(activeId);
              const colIdx = computeColumnTargetFromPointer();
              const idx = computeCanvasInsertIndexForColumnFromPointer(colIdx);
              setPages((prev) => {
                const next = deepClone(prev ?? []);
                const p = next?.[activePageIndex];
                if (!p) return prev;
                p.builder = moveWidgetBetweenColumns(p.builder, widgetId, colIdx, idx ?? 0);
                return next;
              });
              setHasUnsavedChanges(true);
              return;
            }

            const oldIndex = layerIds.indexOf(activeId);
            const newIndex = layerIds.indexOf(overId);
            if (oldIndex < 0 || newIndex < 0) return;
            if (oldIndex === newIndex) return;

            const nextOrder = arrayMove(layerIds, oldIndex, newIndex);
            const fromIndex = oldIndex;
            const toIndex = nextOrder.indexOf(activeId);
            reorderComponents(fromIndex, toIndex);
          }}
        >
          <div
            ref={setCanvasDropRef}
            className={
              isOverCanvas
                ? 'rounded-2xl border border-indigo-400/50 bg-indigo-500/10 overflow-hidden h-full'
                : 'rounded-2xl border border-white/10 bg-black/10 overflow-hidden h-full'
            }
          >
            <div className="h-full overflow-auto">
              <div
                data-canvas-drop-root
                className="relative mx-auto"
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
                {dropIndicator ? (
                  <div
                    className="pointer-events-none absolute left-0 right-0 z-50"
                    style={{
                      top: `${Math.max(0, Number(dropIndicator.yPx ?? 0))}px`,
                    }}
                  >
                    <div className="mx-auto max-w-6xl px-4">
                      <div className="h-0.5 w-full rounded bg-indigo-400 shadow" />
                    </div>
                  </div>
                ) : null}

                {twoColInfo.enabled ? (
                  <div className="grid grid-cols-2 gap-6">
                    {[0, 1].map((colIdx) => {
                      const { builder: baseBuilder, columns } = getColumns(page?.builder);
                      const colNode = columns?.[colIdx] ?? null;
                      const { widgets } = collectWidgetNodesForColumn(page?.builder, colIdx);
                      const colComps = widgetNodesToFlatComponents(widgets).map((c, idx) => ({
                        ...c,
                        __cid: c.__cid ?? `${c.id}-${idx}`,
                        __col: colIdx,
                        __idx: idx,
                      }));
                      const colPages = [
                        {
                          ...(page ?? {}),
                          components: colComps.map((c) => ({
                            id: c.id,
                            type: c.type,
                            orderIndex: c.orderIndex,
                            props: c.props,
                            styles: c.styles,
                            __cid: c.__cid,
                          })),
                        },
                      ];
                      return (
                        <div
                          key={colIdx}
                          data-builder-col-root={colIdx}
                          className={
                            selectedNodeType === 'COLUMN' && selectedColumnIndex === colIdx
                              ? 'min-h-[200px] rounded-xl outline outline-2 outline-indigo-400/50'
                              : 'min-h-[200px] rounded-xl outline outline-1 outline-transparent'
                          }
                          onClick={(e) => {
                            e.stopPropagation();
                            selectColumn({ columnIndex: colIdx });
                          }}
                        >
                          <SiteRenderer
                            pages={colPages}
                            activePageIndex={0}
                            theme={website?.settings?.theme}
                            designSystem={website?.settings?.designSystem}
                            editor={{
                              columnId: colIdx,
                              selectedIndex: selectedNodeType === 'WIDGET' && selectedColumnIndex === colIdx ? activeComponentIndex : null,
                              dragIndex,
                              dragNewType,
                              onSetDragIndex: setDragIndex,
                              onSetDragNewType: setDragNewType,
                              onContextMenu: ({ componentIndex, columnIndex, nodeType, nodeId, x, y }) => {
                                if (nodeType && nodeId) {
                                  setSelectedNodeType(nodeType);
                                  setSelectedNodeId(nodeId);
                                  if (nodeType === 'COLUMN') setSelectedColumnIndex(Number.isFinite(Number(columnIndex)) ? Number(columnIndex) : colIdx);
                                  if (nodeType === 'SECTION' || nodeType === 'CONTAINER' || nodeType === 'COLUMN') setInspectorTab('style');
                                  setContextMenu({ x, y });
                                  return;
                                }

                                const { widgets } = collectWidgetNodesForColumn(page?.builder, columnIndex);
                                const w = widgets?.[Number(componentIndex)] ?? null;
                                if (w?.id) {
                                  selectWidget({ widgetId: w.id, columnIndex, componentIndex: Number(componentIndex) || 0 });
                                }
                                setContextMenu({ x, y });
                              },
                              onInsert: (idx, type) => {
                                setPages((prev) => {
                                  const next = deepClone(prev ?? []);
                                  const p = next?.[activePageIndex];
                                  if (!p) return prev;
                                  p.builder = insertWidgetIntoColumn(p.builder, colIdx, idx, type, defaultPropsForType(type), defaultStylesForType(type));
                                  return next;
                                });
                                setHasUnsavedChanges(true);
                              },
                              onMove: (from, to) => {
                                setPages((prev) => {
                                  const next = deepClone(prev ?? []);
                                  const p = next?.[activePageIndex];
                                  if (!p) return prev;
                                  p.builder = reorderWidgetsInColumn(p.builder, colIdx, from, to);
                                  return next;
                                });
                                setHasUnsavedChanges(true);
                              },
                              onSelect: (idx) => {
                                const widgetId = widgets?.[idx]?.id ?? null;
                                selectWidget({ widgetId, columnIndex: colIdx, componentIndex: idx });
                              },
                              onUpdateProps: (componentIndex, patch) => {
                                setPages((prev) => {
                                  const next = deepClone(prev ?? []);
                                  const p = next?.[activePageIndex];
                                  if (!p) return prev;
                                  const { widgets } = collectWidgetNodesForColumn(p.builder, colIdx);
                                  const widget = widgets?.[Number(componentIndex)];
                                  if (!widget) return prev;
                                  p.builder = updateWidgetNodeById(p.builder, widget.id, (node) => {
                                    node.props = { ...(node.props ?? {}), ...(patch ?? {}) };
                                  });
                                  return next;
                                });
                                setHasUnsavedChanges(true);
                              },
                            }}
                            linkBasePath={page?.path === '/' ? '' : page?.path}
                          />
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <SiteRenderer
                    pages={derivedPages}
                    activePageIndex={activePageIndex}
                    theme={website?.settings?.theme}
                    designSystem={website?.settings?.designSystem}
                    editor={{
                      columnId: null,
                      selectedIndex: selectedNodeType === 'WIDGET' ? activeComponentIndex : null,
                      dragIndex,
                      dragNewType,
                      onSetDragIndex: setDragIndex,
                      onSetDragNewType: setDragNewType,
                      onContextMenu: ({ componentIndex, columnIndex, nodeType, nodeId, x, y }) => {
                        if (nodeType && nodeId) {
                          setSelectedNodeType(nodeType);
                          setSelectedNodeId(nodeId);
                          if (nodeType === 'COLUMN') setSelectedColumnIndex(0);
                          if (nodeType === 'SECTION' || nodeType === 'CONTAINER' || nodeType === 'COLUMN') setInspectorTab('style');
                          setContextMenu({ x, y });
                          return;
                        }

                        const widgets = collectWidgetNodesInRenderOrder(ensureBuilderHasColumn(page?.builder));
                        const w = widgets?.[Number(componentIndex)] ?? null;
                        if (w?.id) {
                          selectWidget({ widgetId: w.id, columnIndex: 0, componentIndex: Number(componentIndex) || 0 });
                        }
                        setContextMenu({ x, y });
                      },
                      onInsert: insertComponentAt,
                      onMove: reorderComponents,
                      onSelect: setActiveComponentIndex,
                      onUpdateProps: (componentIndex, patch) => {
                        setPages((prev) => {
                          const next = deepClone(prev ?? []);
                          const page2 = next?.[activePageIndex];
                          if (!page2) return prev;
                          page2.builder = updateWidgetPropsAtIndex(page2.builder, componentIndex, patch);
                          return next;
                        });
                        setHasUnsavedChanges(true);
                      },
                    }}
                  />
                )}
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
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold">Inspector</div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-white/40 uppercase">Breakpoint</span>
                <ResponsiveTabs value={responsiveBreakpoint} onChange={setResponsiveBreakpoint} />
              </div>
            </div>

            <div className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white/60 text-[10px] uppercase">Selected</div>
                  <div className="font-medium">{selectedLabel}</div>
                </div>
                <div className="h-8 w-8 rounded-lg bg-indigo-500/20 grid place-items-center text-indigo-300 text-sm">
                  {selectedNodeType === 'SECTION' ? '▭' : selectedNodeType === 'CONTAINER' ? '▢' : selectedNodeType === 'COLUMN' ? '▥' : '◇'}
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/20 p-2">
              <div className="text-[10px] font-semibold uppercase tracking-wide text-white/50 mb-2">Breadcrumbs</div>
              <div className="flex flex-wrap gap-1">
                <button
                  type="button"
                  onClick={selectSection}
                  className={`rounded-md px-2 py-1 text-[11px] transition ${selectedNodeType === 'SECTION' ? 'bg-indigo-500/30 text-indigo-200' : 'bg-white/10 hover:bg-white/15'}`}
                >
                  ▭ Section
                </button>
                <button
                  type="button"
                  onClick={selectContainer}
                  className={`rounded-md px-2 py-1 text-[11px] transition ${selectedNodeType === 'CONTAINER' ? 'bg-indigo-500/30 text-indigo-200' : 'bg-white/10 hover:bg-white/15'}`}
                >
                  ▢ Container
                </button>
                <button
                  type="button"
                  onClick={() => selectColumn({ columnIndex: selectedColumnIndex })}
                  className={`rounded-md px-2 py-1 text-[11px] transition ${selectedNodeType === 'COLUMN' ? 'bg-indigo-500/30 text-indigo-200' : 'bg-white/10 hover:bg-white/15'}`}
                >
                  ▥ Col {selectedColumnIndex + 1}
                </button>
                {breadcrumbIds.widgetId ? (
                  <button
                    type="button"
                    onClick={() => selectWidget({ widgetId: breadcrumbIds.widgetId, columnIndex: selectedColumnIndex, componentIndex: activeComponentIndex })}
                    className={`rounded-md px-2 py-1 text-[11px] transition ${selectedNodeType === 'WIDGET' ? 'bg-indigo-500/30 text-indigo-200' : 'bg-white/10 hover:bg-white/15'}`}
                  >
                    ◇ Widget
                  </button>
                ) : null}
              </div>
            </div>

            <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-black/20 p-1">
              <button
                type="button"
                onClick={() => setInspectorTab('content')}
                className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition ${
                  inspectorTab === 'content'
                    ? 'bg-indigo-500/30 text-white'
                    : 'text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                📝 Content
              </button>
              <button
                type="button"
                onClick={() => setInspectorTab('style')}
                className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition ${
                  inspectorTab === 'style'
                    ? 'bg-indigo-500/30 text-white'
                    : 'text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                🎨 Style
              </button>
              <button
                type="button"
                onClick={() => setInspectorTab('advanced')}
                className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition ${
                  inspectorTab === 'advanced'
                    ? 'bg-indigo-500/30 text-white'
                    : 'text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                ⚙️ Advanced
              </button>
            </div>

            {selectedNodeType === 'SECTION' || selectedNodeType === 'CONTAINER' ? (
              <div className="space-y-3">
                {inspectorTab === 'style' ? (
                  <>
                    <CollapsibleSection title="Background" icon="🎨" defaultOpen={true}>
                      <BackgroundControl
                        styles={selectedNodeStyle}
                        onChange={(patch) => updateSelectedNodeStyle(patch)}
                      />
                    </CollapsibleSection>

                    <CollapsibleSection title="Spacing" icon="↔" defaultOpen={true}>
                      <LinkedBoxControl
                        label="Padding"
                        top={selectedNodeStyle?.paddingTop}
                        right={selectedNodeStyle?.paddingRight}
                        bottom={selectedNodeStyle?.paddingBottom}
                        left={selectedNodeStyle?.paddingLeft}
                        onChangeTop={(v) => updateSelectedNodeStyle({ paddingTop: v })}
                        onChangeRight={(v) => updateSelectedNodeStyle({ paddingRight: v })}
                        onChangeBottom={(v) => updateSelectedNodeStyle({ paddingBottom: v })}
                        onChangeLeft={(v) => updateSelectedNodeStyle({ paddingLeft: v })}
                      />
                      <LinkedBoxControl
                        label="Margin"
                        top={selectedNodeStyle?.marginTop}
                        right={selectedNodeStyle?.marginRight}
                        bottom={selectedNodeStyle?.marginBottom}
                        left={selectedNodeStyle?.marginLeft}
                        onChangeTop={(v) => updateSelectedNodeStyle({ marginTop: v })}
                        onChangeRight={(v) => updateSelectedNodeStyle({ marginRight: v })}
                        onChangeBottom={(v) => updateSelectedNodeStyle({ marginBottom: v })}
                        onChangeLeft={(v) => updateSelectedNodeStyle({ marginLeft: v })}
                      />
                    </CollapsibleSection>

                    <CollapsibleSection title="Border" icon="▢" defaultOpen={false}>
                      <BorderControl
                        border={{
                          style: selectedNodeStyle?.borderStyle,
                          width: selectedNodeStyle?.borderWidth,
                          color: selectedNodeStyle?.borderColor,
                          radius: selectedNodeStyle?.borderRadius,
                        }}
                        onChange={(b) => updateSelectedNodeStyle({
                          borderStyle: b.style,
                          borderWidth: b.width,
                          borderColor: b.color,
                          borderRadius: b.radius,
                        })}
                      />
                    </CollapsibleSection>

                    <CollapsibleSection title="Layout" icon="⊞" defaultOpen={false}>
                      <LayoutControl
                        styles={selectedNodeStyle}
                        onChange={(patch) => updateSelectedNodeStyle(patch)}
                      />
                    </CollapsibleSection>

                    <CollapsibleSection title="Size" icon="↕" defaultOpen={false}>
                      <SizeControl
                        styles={selectedNodeStyle}
                        onChange={(patch) => updateSelectedNodeStyle(patch)}
                      />
                    </CollapsibleSection>

                    <CollapsibleSection title="Position" icon="📍" defaultOpen={false}>
                      <PositionControl
                        styles={selectedNodeStyle}
                        onChange={(patch) => updateSelectedNodeStyle(patch)}
                      />
                    </CollapsibleSection>

                    <CollapsibleSection title="Shadow" icon="◐" defaultOpen={false}>
                      <ShadowControl
                        shadow={{
                          x: selectedNodeStyle?.shadowX,
                          y: selectedNodeStyle?.shadowY,
                          blur: selectedNodeStyle?.shadowBlur,
                          spread: selectedNodeStyle?.shadowSpread,
                          color: selectedNodeStyle?.shadowColor,
                        }}
                        onChange={(s) => updateSelectedNodeStyle({
                          shadowX: s.x,
                          shadowY: s.y,
                          shadowBlur: s.blur,
                          shadowSpread: s.spread,
                          shadowColor: s.color,
                        })}
                      />
                    </CollapsibleSection>

                    <CollapsibleSection title="Transform & Effects" icon="✨" defaultOpen={false}>
                      <TransformControl
                        styles={selectedNodeStyle}
                        onChange={(patch) => updateSelectedNodeStyle(patch)}
                      />
                    </CollapsibleSection>
                  </>
                ) : (
                  <div className="text-sm text-white/60">Select the Style tab to edit {selectedNodeType.toLowerCase()}.</div>
                )}
              </div>
            ) : selectedNodeType === 'COLUMN' ? (
              <div className="space-y-3">
                {inspectorTab === 'style' ? (
                  <>
                    <CollapsibleSection title="Column Width" icon="↔" defaultOpen={true}>
                      <SelectField
                        label="Grid Columns"
                        value={String(getColumns(pages?.[activePageIndex]?.builder).columns?.[selectedColumnIndex]?.props?.width ?? 6)}
                        onChange={(v) =>
                          updateSelectedColumn((col) => {
                            col.props = { ...(col.props ?? {}), width: Number(v) };
                          })
                        }
                        options={[
                          { value: '12', label: '12/12 (Full)' },
                          { value: '9', label: '9/12 (75%)' },
                          { value: '8', label: '8/12 (66%)' },
                          { value: '6', label: '6/12 (50%)' },
                          { value: '4', label: '4/12 (33%)' },
                          { value: '3', label: '3/12 (25%)' },
                        ]}
                      />
                    </CollapsibleSection>

                    <CollapsibleSection title="Background" icon="🎨" defaultOpen={true}>
                      <BackgroundControl
                        styles={getColumns(pages?.[activePageIndex]?.builder).columns?.[selectedColumnIndex]?.style ?? {}}
                        onChange={(patch) =>
                          updateSelectedColumn((col) => {
                            col.style = { ...(col.style ?? {}), ...patch };
                          })
                        }
                      />
                    </CollapsibleSection>

                    <CollapsibleSection title="Layout" icon="⊞" defaultOpen={false}>
                      <LayoutControl
                        styles={getColumns(pages?.[activePageIndex]?.builder).columns?.[selectedColumnIndex]?.style ?? {}}
                        onChange={(patch) =>
                          updateSelectedColumn((col) => {
                            col.style = { ...(col.style ?? {}), ...patch };
                          })
                        }
                      />
                    </CollapsibleSection>

                    <CollapsibleSection title="Spacing" icon="↔" defaultOpen={false}>
                      <LinkedBoxControl
                        label="Padding"
                        top={getColumns(pages?.[activePageIndex]?.builder).columns?.[selectedColumnIndex]?.style?.paddingTop}
                        right={getColumns(pages?.[activePageIndex]?.builder).columns?.[selectedColumnIndex]?.style?.paddingRight}
                        bottom={getColumns(pages?.[activePageIndex]?.builder).columns?.[selectedColumnIndex]?.style?.paddingBottom}
                        left={getColumns(pages?.[activePageIndex]?.builder).columns?.[selectedColumnIndex]?.style?.paddingLeft}
                        onChangeTop={(v) => updateSelectedColumn((col) => { col.style = { ...(col.style ?? {}), paddingTop: v }; })}
                        onChangeRight={(v) => updateSelectedColumn((col) => { col.style = { ...(col.style ?? {}), paddingRight: v }; })}
                        onChangeBottom={(v) => updateSelectedColumn((col) => { col.style = { ...(col.style ?? {}), paddingBottom: v }; })}
                        onChangeLeft={(v) => updateSelectedColumn((col) => { col.style = { ...(col.style ?? {}), paddingLeft: v }; })}
                      />
                    </CollapsibleSection>

                    <CollapsibleSection title="Border" icon="▢" defaultOpen={false}>
                      <BorderControl
                        border={{
                          style: getColumns(pages?.[activePageIndex]?.builder).columns?.[selectedColumnIndex]?.style?.borderStyle,
                          width: getColumns(pages?.[activePageIndex]?.builder).columns?.[selectedColumnIndex]?.style?.borderWidth,
                          color: getColumns(pages?.[activePageIndex]?.builder).columns?.[selectedColumnIndex]?.style?.borderColor,
                          radius: getColumns(pages?.[activePageIndex]?.builder).columns?.[selectedColumnIndex]?.style?.borderRadius,
                        }}
                        onChange={(b) =>
                          updateSelectedColumn((col) => {
                            col.style = { ...(col.style ?? {}), borderStyle: b.style, borderWidth: b.width, borderColor: b.color, borderRadius: b.radius };
                          })
                        }
                      />
                    </CollapsibleSection>
                  </>
                ) : (
                  <div className="text-sm text-white/60">Select the Style tab to edit column.</div>
                )}
              </div>
            ) : !activeComponent ? (
              <div className="text-sm text-white/60">Select something on the canvas.</div>
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

                {inspectorTab === 'style' ? (
                  <div className="space-y-3">
                    {(activeComponent.type === 'HEADING' || activeComponent.type === 'TEXT') && (
                      <CollapsibleSection title="Typography" icon="T" defaultOpen={true}>
                        <TypographyControl
                          styles={activeComponent.styles ?? {}}
                          onChange={(patch) => updateActiveComponent((c) => (c.styles = { ...(c.styles ?? {}), ...patch }))}
                        />
                      </CollapsibleSection>
                    )}

                    {activeComponent.type === 'BUTTON' && (
                      <CollapsibleSection title="Button Style" icon="⏺" defaultOpen={true}>
                        <ColorPickerField
                          label="Text Color"
                          value={String(activeComponent.styles?.color ?? '')}
                          onChange={(v) => updateActiveComponent((c) => (c.styles = { ...(c.styles ?? {}), color: v || null }))}
                          placeholder="#ffffff"
                        />
                        <ColorPickerField
                          label="Background"
                          value={String(activeComponent.styles?.backgroundColor ?? '')}
                          onChange={(v) => updateActiveComponent((c) => (c.styles = { ...(c.styles ?? {}), backgroundColor: v || null }))}
                          placeholder="#6366f1"
                        />
                        <ColorPickerField
                          label="Hover Background"
                          value={String(activeComponent.styles?.hoverBackgroundColor ?? '')}
                          onChange={(v) => updateActiveComponent((c) => (c.styles = { ...(c.styles ?? {}), hoverBackgroundColor: v || null }))}
                          placeholder="#4f46e5"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <NumberSliderField
                            label="Font Size"
                            value={activeComponent.styles?.fontSize}
                            onChange={(v) => updateActiveComponent((c) => (c.styles = { ...(c.styles ?? {}), fontSize: v }))}
                            min={10}
                            max={32}
                          />
                          <NumberSliderField
                            label="Font Weight"
                            value={activeComponent.styles?.fontWeight}
                            onChange={(v) => updateActiveComponent((c) => (c.styles = { ...(c.styles ?? {}), fontWeight: v }))}
                            min={100}
                            max={900}
                            step={100}
                            unit=""
                          />
                        </div>
                        <NumberSliderField
                          label="Border Radius"
                          value={activeComponent.styles?.borderRadius}
                          onChange={(v) => updateActiveComponent((c) => (c.styles = { ...(c.styles ?? {}), borderRadius: v }))}
                          min={0}
                          max={50}
                        />
                        <LinkedBoxControl
                          label="Padding"
                          top={activeComponent.styles?.paddingTop}
                          right={activeComponent.styles?.paddingRight}
                          bottom={activeComponent.styles?.paddingBottom}
                          left={activeComponent.styles?.paddingLeft}
                          onChangeTop={(v) => updateActiveComponent((c) => (c.styles = { ...(c.styles ?? {}), paddingTop: v }))}
                          onChangeRight={(v) => updateActiveComponent((c) => (c.styles = { ...(c.styles ?? {}), paddingRight: v }))}
                          onChangeBottom={(v) => updateActiveComponent((c) => (c.styles = { ...(c.styles ?? {}), paddingBottom: v }))}
                          onChangeLeft={(v) => updateActiveComponent((c) => (c.styles = { ...(c.styles ?? {}), paddingLeft: v }))}
                        />
                      </CollapsibleSection>
                    )}

                    {activeComponent.type === 'DIVIDER' && (
                      <CollapsibleSection title="Divider Style" icon="—" defaultOpen={true}>
                        <ColorPickerField
                          label="Color"
                          value={String(activeComponent.styles?.borderColor ?? activeComponent.styles?.color ?? '')}
                          onChange={(v) => updateActiveComponent((c) => (c.styles = { ...(c.styles ?? {}), borderColor: v || null, color: v || null }))}
                          placeholder="rgba(255,255,255,0.12)"
                        />
                        <NumberSliderField
                          label="Thickness"
                          value={activeComponent.props?.thickness}
                          onChange={(v) => updateActiveComponent((c) => (c.props = { ...(c.props ?? {}), thickness: v }))}
                          min={1}
                          max={20}
                        />
                        <SelectField
                          label="Style"
                          value={activeComponent.styles?.borderStyle ?? 'solid'}
                          onChange={(v) => updateActiveComponent((c) => (c.styles = { ...(c.styles ?? {}), borderStyle: v }))}
                          options={[
                            { value: 'solid', label: 'Solid' },
                            { value: 'dashed', label: 'Dashed' },
                            { value: 'dotted', label: 'Dotted' },
                            { value: 'double', label: 'Double' },
                          ]}
                        />
                        <NumberSliderField
                          label="Width %"
                          value={activeComponent.styles?.width}
                          onChange={(v) => updateActiveComponent((c) => (c.styles = { ...(c.styles ?? {}), width: v }))}
                          min={10}
                          max={100}
                          unit="%"
                        />
                      </CollapsibleSection>
                    )}

                    {activeComponent.type === 'IMAGE' && (
                      <CollapsibleSection title="Image Style" icon="▣" defaultOpen={true}>
                        <NumberSliderField
                          label="Border Radius"
                          value={activeComponent.styles?.borderRadius}
                          onChange={(v) => updateActiveComponent((c) => (c.styles = { ...(c.styles ?? {}), borderRadius: v }))}
                          min={0}
                          max={100}
                        />
                        <NumberSliderField
                          label="Max Width"
                          value={activeComponent.styles?.maxWidth}
                          onChange={(v) => updateActiveComponent((c) => (c.styles = { ...(c.styles ?? {}), maxWidth: v }))}
                          min={50}
                          max={1200}
                        />
                        <SelectField
                          label="Object Fit"
                          value={activeComponent.styles?.objectFit ?? 'cover'}
                          onChange={(v) => updateActiveComponent((c) => (c.styles = { ...(c.styles ?? {}), objectFit: v }))}
                          options={[
                            { value: 'cover', label: 'Cover' },
                            { value: 'contain', label: 'Contain' },
                            { value: 'fill', label: 'Fill' },
                            { value: 'none', label: 'None' },
                          ]}
                        />
                        <BorderControl
                          border={{
                            style: activeComponent.styles?.borderStyle,
                            width: activeComponent.styles?.borderWidth,
                            color: activeComponent.styles?.borderColor,
                            radius: activeComponent.styles?.borderRadius,
                          }}
                          onChange={(b) => updateActiveComponent((c) => (c.styles = { ...(c.styles ?? {}), borderStyle: b.style, borderWidth: b.width, borderColor: b.color, borderRadius: b.radius }))}
                        />
                      </CollapsibleSection>
                    )}

                    {activeComponent.type === 'SPACER' && (
                      <CollapsibleSection title="Spacer" icon="↕" defaultOpen={true}>
                        <NumberSliderField
                          label="Height"
                          value={activeComponent.props?.height}
                          onChange={(v) => updateActiveComponent((c) => (c.props = { ...(c.props ?? {}), height: v }))}
                          min={0}
                          max={600}
                        />
                      </CollapsibleSection>
                    )}

                    <CollapsibleSection title="Background" icon="🎨" defaultOpen={activeComponent.type !== 'HEADING' && activeComponent.type !== 'TEXT'}>
                      <BackgroundControl
                        styles={activeComponent.styles ?? {}}
                        onChange={(patch) => updateActiveComponent((c) => (c.styles = { ...(c.styles ?? {}), ...patch }))}
                      />
                    </CollapsibleSection>

                    <CollapsibleSection title="Spacing" icon="↔" defaultOpen={false}>
                      <LinkedBoxControl
                        label="Padding"
                        top={activeComponent.styles?.paddingTop}
                        right={activeComponent.styles?.paddingRight}
                        bottom={activeComponent.styles?.paddingBottom}
                        left={activeComponent.styles?.paddingLeft}
                        onChangeTop={(v) => updateActiveComponent((c) => (c.styles = { ...(c.styles ?? {}), paddingTop: v }))}
                        onChangeRight={(v) => updateActiveComponent((c) => (c.styles = { ...(c.styles ?? {}), paddingRight: v }))}
                        onChangeBottom={(v) => updateActiveComponent((c) => (c.styles = { ...(c.styles ?? {}), paddingBottom: v }))}
                        onChangeLeft={(v) => updateActiveComponent((c) => (c.styles = { ...(c.styles ?? {}), paddingLeft: v }))}
                      />
                      <LinkedBoxControl
                        label="Margin"
                        top={activeComponent.styles?.marginTop}
                        right={activeComponent.styles?.marginRight}
                        bottom={activeComponent.styles?.marginBottom}
                        left={activeComponent.styles?.marginLeft}
                        onChangeTop={(v) => updateActiveComponent((c) => (c.styles = { ...(c.styles ?? {}), marginTop: v }))}
                        onChangeRight={(v) => updateActiveComponent((c) => (c.styles = { ...(c.styles ?? {}), marginRight: v }))}
                        onChangeBottom={(v) => updateActiveComponent((c) => (c.styles = { ...(c.styles ?? {}), marginBottom: v }))}
                        onChangeLeft={(v) => updateActiveComponent((c) => (c.styles = { ...(c.styles ?? {}), marginLeft: v }))}
                      />
                    </CollapsibleSection>

                    <CollapsibleSection title="Border" icon="▢" defaultOpen={false}>
                      <BorderControl
                        border={{
                          style: activeComponent.styles?.borderStyle,
                          width: activeComponent.styles?.borderWidth,
                          color: activeComponent.styles?.borderColor,
                          radius: activeComponent.styles?.borderRadius,
                        }}
                        onChange={(b) => updateActiveComponent((c) => (c.styles = { ...(c.styles ?? {}), borderStyle: b.style, borderWidth: b.width, borderColor: b.color, borderRadius: b.radius }))}
                      />
                    </CollapsibleSection>

                    <CollapsibleSection title="Shadow" icon="◐" defaultOpen={false}>
                      <ShadowControl
                        shadow={{
                          x: activeComponent.styles?.shadowX,
                          y: activeComponent.styles?.shadowY,
                          blur: activeComponent.styles?.shadowBlur,
                          spread: activeComponent.styles?.shadowSpread,
                          color: activeComponent.styles?.shadowColor,
                        }}
                        onChange={(s) => updateActiveComponent((c) => (c.styles = { ...(c.styles ?? {}), shadowX: s.x, shadowY: s.y, shadowBlur: s.blur, shadowSpread: s.spread, shadowColor: s.color }))}
                      />
                    </CollapsibleSection>

                    <CollapsibleSection title="Size" icon="↕" defaultOpen={false}>
                      <SizeControl
                        styles={activeComponent.styles ?? {}}
                        onChange={(patch) => updateActiveComponent((c) => (c.styles = { ...(c.styles ?? {}), ...patch }))}
                      />
                    </CollapsibleSection>

                    <CollapsibleSection title="Position" icon="📍" defaultOpen={false}>
                      <PositionControl
                        styles={activeComponent.styles ?? {}}
                        onChange={(patch) => updateActiveComponent((c) => (c.styles = { ...(c.styles ?? {}), ...patch }))}
                      />
                    </CollapsibleSection>

                    <CollapsibleSection title="Transform & Effects" icon="✨" defaultOpen={false}>
                      <TransformControl
                        styles={activeComponent.styles ?? {}}
                        onChange={(patch) => updateActiveComponent((c) => (c.styles = { ...(c.styles ?? {}), ...patch }))}
                      />
                      <EffectsControl
                        styles={activeComponent.styles ?? {}}
                        onChange={(patch) => updateActiveComponent((c) => (c.styles = { ...(c.styles ?? {}), ...patch }))}
                      />
                    </CollapsibleSection>
                  </div>
                ) : null}

                {inspectorTab === 'content' && activeComponent.type === 'HEADING' ? (
                  <div className="space-y-3">
                    <TextInput
                      label="Text"
                      value={activeComponent.props?.text}
                      onChange={(v) => updateActiveComponent((c) => (c.props = { ...(c.props ?? {}), text: v }))}
                    />
                    <label className="block">
                      <div className="text-sm text-white/70">Level</div>
                      <select
                        value={String(activeComponent.props?.level ?? 2)}
                        onChange={(e) => updateActiveComponent((c) => (c.props = { ...(c.props ?? {}), level: Number(e.target.value) }))}
                        className="mt-1 w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm"
                      >
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                          <option key={n} value={String(n)}>
                            H{n}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                ) : null}

                {inspectorTab === 'content' && activeComponent.type === 'TEXT' ? (
                  <TextInput
                    label="Text"
                    value={activeComponent.props?.text}
                    onChange={(v) => updateActiveComponent((c) => (c.props = { ...(c.props ?? {}), text: v }))}
                  />
                ) : null}

                {inspectorTab === 'content' && activeComponent.type === 'BUTTON' ? (
                  <div className="space-y-3">
                    <TextInput
                      label="Label"
                      value={activeComponent.props?.label}
                      onChange={(v) => updateActiveComponent((c) => (c.props = { ...(c.props ?? {}), label: v }))}
                    />
                    <TextInput
                      label="Href"
                      value={activeComponent.props?.href}
                      onChange={(v) => updateActiveComponent((c) => (c.props = { ...(c.props ?? {}), href: v }))}
                      placeholder="# / /contact"
                    />
                  </div>
                ) : null}

                {inspectorTab === 'content' && activeComponent.type === 'SPACER' ? (
                  <NumberSliderField
                    label="Height (px)"
                    value={activeComponent.props?.height}
                    onChange={(v) => updateActiveComponent((c) => (c.props = { ...(c.props ?? {}), height: v }))}
                    min={0}
                    max={600}
                  />
                ) : null}

                {inspectorTab === 'content' && activeComponent.type === 'IMAGE' ? (
                  <div className="space-y-3">
                    <TextInput
                      label="Image URL"
                      value={activeComponent.props?.src}
                      onChange={(v) => updateActiveComponent((c) => (c.props = { ...(c.props ?? {}), src: v }))}
                      placeholder="https://..."
                    />
                    <TextInput
                      label="Alt"
                      value={activeComponent.props?.alt}
                      onChange={(v) => updateActiveComponent((c) => (c.props = { ...(c.props ?? {}), alt: v }))}
                    />
                  </div>
                ) : null}

                {inspectorTab === 'content' && activeComponent.type === 'NAVBAR' ? (
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
                    deleteSelectedWidget();
                  }}
                >
                  Delete component
                </SmallButton>
              </>
            )}
          </div>
        </div>
        </DndContext>
      </div>
    </div>
  );
}
