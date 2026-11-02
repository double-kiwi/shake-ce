export type QueryValue = string | number | boolean | undefined | null;

export type QueryParams = { [key: string]: QueryValue | undefined };

export interface PresetMeta {
  id: string;
  name: string;
  boardDocumentId: string;
}

/** Matches BE LogicExpr (board-document serializer). */
export type LogicExpr =
  | null
  | { op: 'and'; nodeId: number; args: LogicExpr[] }
  | { op: 'or'; nodeId: number; args: LogicExpr[] }
  | { op: 'not'; nodeId: number; arg: LogicExpr }
  | { op: 'between'; nodeId: number; boxNodeId: number }
  | { op: 'selected'; nodeId: number; tileNodeId: number };

export type BoardDocumentTreeNode = {
  id: number;
  slug: string;
  props: Record<string, unknown>;
  isVisible: LogicExpr;
  isEnabled: LogicExpr;
  children: BoardDocumentTreeNode[];
};

export type BoardDocumentPayload = {
  board?: { id: number; name: string };
  nodes?: Array<{
    id: number;
    catalogSlug: string;
    props: Record<string, unknown>;
    value?: string | null;
  }>;
  connections?: unknown[];
  tree: BoardDocumentTreeNode;
};

export type PresetBundle = {
  preset: PresetMeta;
  document: BoardDocumentPayload;
  defaults: Record<string, string[]>;
};
