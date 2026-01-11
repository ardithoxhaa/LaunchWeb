export function scopeCss(cssText, scopeSelector, options = {}) {
  const css = String(cssText || '');
  const scope = String(scopeSelector || '').trim();
  if (!css.trim() || !scope) return css;

  const rootId = options?.rootId ? String(options.rootId).trim() : '';
  const rootClasses = String(options?.rootClasses || '')
    .split(/\s+/)
    .map((c) => c.trim())
    .filter(Boolean);

  const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  function findMatchingBrace(input, openIdx) {
    let depth = 0;
    let i = openIdx;
    let quote = null;

    while (i < input.length) {
      const ch = input[i];
      const next = input[i + 1];

      if (!quote && ch === '/' && next === '*') {
        const end = input.indexOf('*/', i + 2);
        if (end === -1) return -1;
        i = end + 2;
        continue;
      }

      if (quote) {
        if (ch === '\\') {
          i += 2;
          continue;
        }
        if (ch === quote) quote = null;
        i += 1;
        continue;
      }

      if (ch === '"' || ch === "'") {
        quote = ch;
        i += 1;
        continue;
      }

      if (ch === '{') {
        depth += 1;
      } else if (ch === '}') {
        depth -= 1;
        if (depth === 0) return i;
      }

      i += 1;
    }

    return -1;
  }

  function splitSelectors(selectorText) {
    const out = [];
    let buf = '';
    let quote = null;
    let paren = 0;
    let bracket = 0;

    for (let i = 0; i < selectorText.length; i += 1) {
      const ch = selectorText[i];
      const next = selectorText[i + 1];

      if (!quote && ch === '/' && next === '*') {
        const end = selectorText.indexOf('*/', i + 2);
        if (end === -1) break;
        buf += selectorText.slice(i, end + 2);
        i = end + 1;
        continue;
      }

      if (quote) {
        buf += ch;
        if (ch === '\\') {
          buf += next ?? '';
          i += 1;
          continue;
        }
        if (ch === quote) quote = null;
        continue;
      }

      if (ch === '"' || ch === "'") {
        quote = ch;
        buf += ch;
        continue;
      }

      if (ch === '(') paren += 1;
      if (ch === ')') paren = Math.max(0, paren - 1);
      if (ch === '[') bracket += 1;
      if (ch === ']') bracket = Math.max(0, bracket - 1);

      if (ch === ',' && paren === 0 && bracket === 0) {
        out.push(buf.trim());
        buf = '';
        continue;
      }

      buf += ch;
    }

    if (buf.trim()) out.push(buf.trim());
    return out;
  }

  function scopeOneSelector(sel) {
    let s = String(sel || '').trim();
    if (!s) return '';

    s = s.replace(/\b(html|body)\b/g, scope);
    s = s.replace(/:root\b/g, scope);
    s = s.replace(/\&/g, scope);

    if (rootId) {
      const idRe = new RegExp(`^#${escapeRegExp(rootId)}(?![\\w-])`);
      if (idRe.test(s)) s = s.replace(idRe, scope);
    }

    for (const cls of rootClasses) {
      const clsRe = new RegExp(`^\\.${escapeRegExp(cls)}(?![\\w-])`);
      if (clsRe.test(s)) s = s.replace(clsRe, scope);
    }

    s = s.trim();

    if (!s) return scope;
    if (s === scope) return scope;
    if (s.startsWith(scope)) return s;

    return `${scope} ${s}`;
  }

  function transformRulePrelude(prelude) {
    const selectors = splitSelectors(prelude);
    return selectors.map(scopeOneSelector).filter(Boolean).join(', ');
  }

  function processBlock(input) {
    let out = '';
    let i = 0;

    while (i < input.length) {
      const ch = input[i];

      if (ch === '/' && input[i + 1] === '*') {
        const end = input.indexOf('*/', i + 2);
        if (end === -1) {
          out += input.slice(i);
          break;
        }
        out += input.slice(i, end + 2);
        i = end + 2;
        continue;
      }

      if (/\s/.test(ch)) {
        out += ch;
        i += 1;
        continue;
      }

      if (ch === '@') {
        const braceIdx = input.indexOf('{', i);
        const semiIdx = input.indexOf(';', i);

        if (semiIdx !== -1 && (braceIdx === -1 || semiIdx < braceIdx)) {
          out += input.slice(i, semiIdx + 1);
          i = semiIdx + 1;
          continue;
        }

        if (braceIdx === -1) {
          out += input.slice(i);
          break;
        }

        const header = input.slice(i, braceIdx).trim();
        const closeIdx = findMatchingBrace(input, braceIdx);
        if (closeIdx === -1) {
          out += input.slice(i);
          break;
        }

        const body = input.slice(braceIdx + 1, closeIdx);
        const lowerHeader = header.toLowerCase();

        if (lowerHeader.startsWith('@keyframes') || lowerHeader.startsWith('@font-face')) {
          out += `${header} {${body}}`;
        } else {
          out += `${header} {${processBlock(body)}}`;
        }

        i = closeIdx + 1;
        continue;
      }

      const braceIdx = input.indexOf('{', i);
      if (braceIdx === -1) {
        out += input.slice(i);
        break;
      }

      const prelude = input.slice(i, braceIdx).trim();
      const closeIdx = findMatchingBrace(input, braceIdx);
      if (closeIdx === -1) {
        out += input.slice(i);
        break;
      }

      const body = input.slice(braceIdx + 1, closeIdx);
      const scopedPrelude = transformRulePrelude(prelude);
      out += `${scopedPrelude} {${body}}`;
      i = closeIdx + 1;
    }

    return out;
  }

  return processBlock(css);
}
