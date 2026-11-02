import type {
  BoardDocumentPayload,
  BoardDocumentTreeNode,
} from '@/api/types';
import type { MenuNode } from '@/helpers/menu/menu-node';
import {
  evaluateLogicExpr,
  type LogicEvalContext,
} from '@/helpers/menu/evaluate-logic-expr';

/** Catalog slug → CE menu node name. */
function slugToMenuName(slug: string): string {
  if (slug === 'box') return 'input-box';
  return slug;
}

function buildNodesById(
  payload: BoardDocumentPayload,
): LogicEvalContext['nodesById'] {
  const map: LogicEvalContext['nodesById'] = new Map();
  for (const node of payload.nodes ?? []) {
    map.set(String(node.id), {
      props: node.props ?? {},
      catalogSlug: node.catalogSlug,
    });
  }
  // Also index tree props so leaf lookups work if flat nodes are missing.
  const walk = (n: BoardDocumentTreeNode) => {
    if (!map.has(String(n.id))) {
      map.set(String(n.id), {
        props: n.props ?? {},
        catalogSlug: n.slug,
      });
    }
    for (const child of n.children) walk(child);
  };
  if (payload.tree) walk(payload.tree);
  return map;
}

function adaptNode(
  node: BoardDocumentTreeNode,
  ctx: LogicEvalContext,
): MenuNode {
  return {
    id: String(node.id),
    name: slugToMenuName(node.slug),
    data: { ...(node.props ?? {}) },
    children: node.children.map((child) => adaptNode(child, ctx)),
    isVisible: evaluateLogicExpr(node.isVisible, ctx),
    isEnabled: evaluateLogicExpr(node.isEnabled, ctx),
  };
}

/** Adapt + evaluate published document tree into a renderable MenuNode. */
export function documentToMenuNode(
  payload: BoardDocumentPayload,
  configuration: Record<string, string[]>,
): MenuNode | null {
  if (!payload?.tree) return null;
  const ctx: LogicEvalContext = {
    configuration,
    nodesById: buildNodesById(payload),
  };
  return adaptNode(payload.tree, ctx);
}
