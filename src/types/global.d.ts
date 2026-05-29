/*src/types/global.d.ts*/

import type { Folder } from "./Folder";
import type { Repertoire } from "./Repertoire";

export {};

// extension of global window object to include custom APIs in src/preload/ts
// functions are IPC safe wrappers around filesystem operations

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