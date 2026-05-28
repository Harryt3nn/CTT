import { contextBridge, ipcRenderer, } from "electron";
import type { Folder } from "./types/Folder";
import type { Repertoire } from "./types/Repertoire";
import { ImportRepertoiresPayload } from "./types/ImportPayload";

contextBridge.exposeInMainWorld("storage", {
  loadFolders: (): Promise<Folder[]> =>
    ipcRenderer.invoke("storage:loadFolders"),

  saveFolders: (folders: Folder[]): Promise<void> =>
    ipcRenderer.invoke("storage:saveFolders", folders),

  loadRepertoires: (): Promise<Repertoire[]> =>
    ipcRenderer.invoke("storage:loadRepertoires"),

  saveRepertoire: (rep: Repertoire): Promise<void> =>
    ipcRenderer.invoke("storage:saveRepertoire", rep),

  openFileDialog: (options: Electron.OpenDialogOptions): Promise<string[]> =>
    ipcRenderer.invoke("storage:openFileDialog", options),

  readFile: (filePath: string): Promise<string> =>
    ipcRenderer.invoke("storage:readFile", filePath),

  importRepertoires: (payload: ImportRepertoiresPayload) =>
    ipcRenderer.invoke("storage:importRepertoires", payload),
});
