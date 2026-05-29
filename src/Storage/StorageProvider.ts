import type { Folder } from "../types/Folder";
import type { Repertoire } from "../types/Repertoire";

export interface StorageProvider {
  loadFolders(): Promise<Folder[]>;
  saveFolders(folders: Folder[]): Promise<void>;

  loadRepertoires(): Promise<Repertoire[]>;
  saveRepertoire(rep: Repertoire): Promise<void>;
}
