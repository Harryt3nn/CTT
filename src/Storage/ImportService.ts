import {
  loadFolders,
  saveFolders,
  loadRepertoires,
  saveRepertoires,
  loadNodes,
  saveNodes
} from "./MainStorage";

import type { Folder } from "../types/Folder";
import type { Repertoire } from "../types/Repertoire";
import type { Node } from "../types/Node";

export interface ImportPayload {
  folders: Folder[];
  repertoires: Repertoire[];
  nodes: Record<string, Node>;
}

function mergeFolders(existing: Folder[], incoming: Folder[]): Folder[] {
  const map = new Map(existing.map(f => [f.id, f]));
  for (const f of incoming) {
    if (!map.has(f.id)) map.set(f.id, f);
  }
  return [...map.values()];
}

function mergeRepertoires(existing: Repertoire[], incoming: Repertoire[]): Repertoire[] {
  const map = new Map(existing.map(r => [r.id, r]));
  for (const r of incoming) {
    if (!map.has(r.id)) map.set(r.id, r);
  }
  return [...map.values()];
}

export async function importRepertoires(payload: ImportPayload): Promise<{ success: true }> {
  const { folders, repertoires, nodes } = payload;

  const existingFolders = await loadFolders();
  const existingRepertoires = await loadRepertoires();
  const existingNodes = await loadNodes();

  const mergedFolders = mergeFolders(existingFolders, folders);
  const mergedRepertoires = mergeRepertoires(existingRepertoires, repertoires);
  const mergedNodes: Record<string, Node> = { ...existingNodes, ...nodes };

  await saveFolders(mergedFolders);
  await saveRepertoires(mergedRepertoires);
  await saveNodes(mergedNodes);

  return { success: true };
}
