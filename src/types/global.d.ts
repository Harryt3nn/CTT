import type { Folder } from "./Folder";
import type { Repertoire } from "./Repertoire";

export {};

declare global {
  interface Window {
    storage: {
      loadFolders(): Promise<any[]>;
      saveFolders(folders: any[]): Promise<void>;
      loadRepertoires(): Promise<any[]>;
      saveRepertoire(rep: any): Promise<void>;
      openFileDialog(options: Electron.OpenDialogOptions): Promise<string[]>;
      readFile(filePath: string): Promise<string>;
      importRepertoires(payload: ImportRepertoiresPayload): Promise<{ success: boolean }>;
    };
  }
}