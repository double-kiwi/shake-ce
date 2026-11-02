import type { LogicExpr } from '@/api/types';

export type LogicEvalContext = {
  configuration: Record<string, string[]>;
  /** Flat published nodes by numeric id (string key). */
  nodesById: Map<string, { props: Record<string, unknown>; catalogSlug: string }>;
};

function isSelected(
  ctx: LogicEvalContext,
  tileNodeId: number,
): boolean {
  const node = ctx.nodesById.get(String(tileNodeId));
  if (!node) return false;
  const property = node.props.property;
  const value = node.props.value;
  if (typeof property !== 'string' || property.length === 0) return false;
  if (value == null || value === '') return false;
  const selected = ctx.configuration[property] ?? [];
  return selected.includes(String(value));
}

/**
 * `between`: box value is present and (if min/max on props) within range.
 * First-shot semantics until product rules are tightened.
 */
function isBetween(ctx: LogicEvalContext, boxNodeId: number): boolean {
  const node = ctx.nodesById.get(String(boxNodeId));
  if (!node) return false;
  const property = node.props.property;
  if (typeof property !== 'string' || property.length === 0) return false;
  const raw = ctx.configuration[property]?.[0];
  if (raw == null || raw === '') return false;

  const num = Number(raw);
  if (Number.isNaN(num)) return true;

  const min =
    typeof node.props.min === 'number' ? node.props.min : undefined;
  const max =
    typeof node.props.max === 'number' ? node.props.max : undefined;
  if (min != null && num < min) return false;
  if (max != null && num > max) return false;
  return true;
}

export function evaluateLogicExpr(
  expr: LogicExpr,
  ctx: LogicEvalContext,
): boolean {
  if (expr == null) return true;

  switch (expr.op) {
    case 'and':
      return expr.args.every((arg) => evaluateLogicExpr(arg, ctx));
    case 'or':
      return expr.args.some((arg) => evaluateLogicExpr(arg, ctx));
    case 'not':
      return !evaluateLogicExpr(expr.arg, ctx);
    case 'selected':
      return isSelected(ctx, expr.tileNodeId);
    case 'between':
      return isBetween(ctx, expr.boxNodeId);
    default:
      return true;
  }
}
