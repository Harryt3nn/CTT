import { Node } from "../types/Node";
import type { Folder } from "../types/Folder";
import type { Repertoire } from "../types/Repertoire";

export type PreparedImportData = {
  folders: Folder[];
  repertoires: Repertoire[];
  nodes: Record<string, Node>;
};

export function prepareForImport(data: any): PreparedImportData {
  const now = Date.now();

  // Normalise nodes — chessgraph exports as array, we store as map
  const normalisedNodes: Record<string, Node> = {};
  const nodesArray: any[] = Array.isArray(data.nodes)
    ? data.nodes
    : Object.values(data.nodes);

  for (const node of nodesArray) {
    normalisedNodes[node.id] = {
      ...node,
      children: Array.isArray(node.children)
        ? node.children
        : Array.isArray(node.childIds)
          ? node.childIds
          : [],
    };
  }

  // Extract folders
  const folders: Folder[] = Array.isArray(data.folders)
    ? data.folders.map((f: any) => ({
        id: f.id,
        name: f.name,
        collapsed: false,
        sortOrder: f.sortOrder ?? 0,
        createdAt: f.createdAt ?? now,
        updatedAt: f.updatedAt ?? now,
      }))
    : [];

  // Extract repertoires
  const repertoires: Repertoire[] = data.repertoires.map((rep: any) => ({
    id: rep.id,
    name: rep.name,
    side: rep.side,
    rootNodeId: rep.rootNodeId,
    folderId: rep.folderId ?? null,
    createdAt: rep.createdAt ?? now,
    updatedAt: rep.updatedAt ?? now,
  }));

  return {
    folders,
    repertoires,
    nodes: normalisedNodes,
  };
}