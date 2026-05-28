export interface Node {
  id: string;
  parentId: string | null;
  move: string | null;
  children: string[];
  annotations?: {
    comment?: string;
    eval?: number;
    tags?: string[];
  };
}