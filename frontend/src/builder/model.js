export function makeId() {
  if (typeof globalThis !== 'undefined' && globalThis.crypto && typeof globalThis.crypto.randomUUID === 'function') {
    return globalThis.crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function ensureArray(value) {
  return Array.isArray(value) ? value : [];
}

export function clone(value) {
  return value == null ? value : JSON.parse(JSON.stringify(value));
}

export function ensureBuilderRoot(builder) {
  const b = clone(builder ?? null);
  if (b?.root?.id && b?.root?.type) return b;
  return {
    version: 1,
    root: {
      id: makeId(),
      type: 'ROOT',
      children: [],
    },
  };
}

export function walkNodes(node, visitor, parent = null) {
  if (!node) return;
  visitor(node, parent);
  for (const ch of ensureArray(node.children)) {
    walkNodes(ch, visitor, node);
  }
}

export function findNodeById(builder, nodeId) {
  const b = ensureBuilderRoot(builder);
  let found = null;
  walkNodes(b.root, (n, parent) => {
    if (found) return;
    if (n.id === nodeId) found = { node: n, parent };
  });
  return found;
}

export function updateNodeById(builder, nodeId, mutator) {
  const b = ensureBuilderRoot(builder);
  const hit = findNodeById(b, nodeId);
  if (!hit?.node) return b;
  mutator(hit.node);
  return b;
}

export function getChildIndex(parent, childId) {
  const children = ensureArray(parent?.children);
  return children.findIndex((c) => c?.id === childId);
}

export function removeNodeById(builder, nodeId) {
  const b = ensureBuilderRoot(builder);
  const hit = findNodeById(b, nodeId);
  if (!hit?.parent) return b;
  const idx = getChildIndex(hit.parent, nodeId);
  if (idx < 0) return b;
  hit.parent.children = ensureArray(hit.parent.children).filter((c) => c?.id !== nodeId);
  return b;
}

export function insertChild(builder, parentId, index, childNode) {
  const b = ensureBuilderRoot(builder);
  const hit = findNodeById(b, parentId);
  if (!hit?.node) return b;
  const children = [...ensureArray(hit.node.children)];
  const i = Math.max(0, Math.min(Number(index), children.length));
  children.splice(i, 0, childNode);
  hit.node.children = children;
  return b;
}

export function moveChild(builder, fromParentId, childId, toParentId, toIndex) {
  const b = ensureBuilderRoot(builder);
  const fromHit = findNodeById(b, fromParentId);
  const toHit = findNodeById(b, toParentId);
  if (!fromHit?.node || !toHit?.node) return b;

  const fromChildren = [...ensureArray(fromHit.node.children)];
  const fromIdx = fromChildren.findIndex((c) => c?.id === childId);
  if (fromIdx < 0) return b;
  const [moved] = fromChildren.splice(fromIdx, 1);
  fromHit.node.children = fromChildren;

  const toChildren = [...ensureArray(toHit.node.children)];
  const i = Math.max(0, Math.min(Number(toIndex), toChildren.length));
  toChildren.splice(i, 0, moved);
  toHit.node.children = toChildren;

  return b;
}

export function createDefaultSectionTree() {
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

export function isNodeTypeAllowed(parentType, childType) {
  if (parentType === 'ROOT') return childType === 'SECTION';
  if (parentType === 'SECTION') return childType === 'CONTAINER';
  if (parentType === 'CONTAINER') return childType === 'COLUMN';
  if (parentType === 'COLUMN') return childType === 'WIDGET';
  return false;
}
