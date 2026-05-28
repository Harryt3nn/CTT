import type { Node } from "../types/Node";

export type PreparedFolder = {
  id: string;
  name: string;
};

export type PreparedRepertoire = {
  id: string;
  name: string;
  side: "white" | "black";
  rootNodeId: string;
  folderId: string | null;
};

export type PreparedImportData = {
  folders: PreparedFolder[];
  repertoires: PreparedRepertoire[];
  nodes: Record<string, Node>;
};

export function prepareForImport(data: any): PreparedImportData {
  // Normalise nodes
  const normalisedNodes: Record<string, Node> = {};
  for (const [id, rawNode] of Object.entries(data.nodes)) {
    const node = rawNode as Node;
    normalisedNodes[id] = {
      ...node,
      children: Array.isArray(node.children) ? node.children : []
    };
  }

  // Extract folders
  const folders: PreparedFolder[] = Array.isArray(data.folders)
    ? data.folders.map((f: any) => ({
        id: f.id,
        name: f.name
      }))
    : [];

  // Extract repertoires
  const repertoires: PreparedRepertoire[] = data.repertoires.map((rep: any) => ({
    id: rep.id,
    name: rep.name,
    side: rep.side,
    rootNodeId: rep.rootNodeId,
    folderId: rep.folderId ?? null
  }));

  return {
    folders,
    repertoires,
    nodes: normalisedNodes
  };
}