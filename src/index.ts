/*src/index.ts*/

import { app, BrowserWindow, ipcMain, dialog, IpcMainInvokeEvent, OpenDialogOptions } from "electron";
import fs from "fs";
import path from "path";
import { ImportRepertoiresPayload } from "./types/ImportPayload";
import { importRepertoires } from "./Storage/ImportService";
import {
  loadFolders,
  saveFolders,
  loadRepertoires,
  saveRepertoires
} from "./Storage/MainStorage";

// main electron process
// creates application window, handles IPC requests from renderer, manages filesystem
// 'backend' of the app

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

const DATA_DIR = path.join(app.getPath("userData"), "ctt-data");
const FOLDERS_PATH = path.join(DATA_DIR, "folders.json");
const REPS_DIR = path.join(DATA_DIR, "repositories");

// ensures correct directories

function ensureDirs() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(REPS_DIR)) fs.mkdirSync(REPS_DIR, { recursive: true });
  if (!fs.existsSync(FOLDERS_PATH)) {
    fs.writeFileSync(FOLDERS_PATH, JSON.stringify({ folders: [] }, null, 2));
  }
}

// all IPC functions

ipcMain.handle("storage:loadFolders", async () => {
  ensureDirs();
  const raw = await fs.promises.readFile(FOLDERS_PATH, "utf8");
  return JSON.parse(raw).folders ?? [];
});

ipcMain.handle("storage:saveFolders", async (_, folders) => {
  ensureDirs();
  await fs.promises.writeFile(
    FOLDERS_PATH,
    JSON.stringify({ folders }, null, 2),
    "utf8"
  );
});

ipcMain.handle("storage:loadRepertoires", async () => {
  ensureDirs();
  const files = await fs.promises.readdir(REPS_DIR);
  const reps = [];
  for (const file of files) {
    if (!file.endsWith(".json")) continue;
    const raw = await fs.promises.readFile(path.join(REPS_DIR, file), "utf8");
    reps.push(JSON.parse(raw));
  }
  return reps;
});

ipcMain.handle("storage:saveRepertoire", async (_, rep) => {
  ensureDirs();
  const filePath = path.join(REPS_DIR, `${rep.id}.json`);
  await fs.promises.writeFile(filePath, JSON.stringify(rep, null, 2), "utf8");
});

ipcMain.handle(
  "storage:openFileDialog",
  async (_event: Electron.IpcMainInvokeEvent, options: Electron.OpenDialogOptions) => {
    const result = await dialog.showOpenDialog(options);
    return result.filePaths;
  }
);

ipcMain.handle(
  "storage:readFile",
  async (_event: Electron.IpcMainInvokeEvent, filePath: string) => {
    return fs.promises.readFile(filePath, "utf8");
  }
);

ipcMain.handle("storage:importRepertoires", async (_, payload) => {
  return await importRepertoires(payload);
});

// creation of window object

const createWindow = (): void => {
  const mainWindow = new BrowserWindow({
    height: 1300,
    width: 1300,
    autoHideMenuBar: true,
    icon: path.join(__dirname, "../src/Images/icon.ico"),
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  mainWindow.webContents.openDevTools();
};

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
