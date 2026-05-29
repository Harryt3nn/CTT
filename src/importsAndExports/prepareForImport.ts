/*src/importsAndExports/prepareForImports*/

import { Node } from "../types/Node";
import type { Folder } from "../types/Folder";
import type { Repertoire } from "../types/Repertoire";

// takes poorly arranged chess graph JSON data and converts it into CTTs filesystem template
// all types defined in a way that objects in CTT and chess graph are compatible

export type PreparedImportData = {
  folders: Folder[];
  repertoires: Repertoire[];
  nodes: Record<string, Node>;
};

export function prepareForImport(data: any): PreparedImportData {
  const now = Date.now();

// normalised data is now stored as a map

// extract nodes

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

  // extract folders

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

  // extract repertoires

  const repertoires: Repertoire[] = data.repertoires.map((rep: any) => ({
    id: rep.id,
    name: rep.name,
    side: rep.side,
    rootNodeId: rep.rootNodeId,
    folderId: rep.folderId ?? null,
    createdAt: rep.createdAt ?? now,
    updatedAt: rep.updatedAt ?? now,
  }));

  // normalised data is returned

  return {
    folders,
    repertoires,
    nodes: normalisedNodes,
  };
}