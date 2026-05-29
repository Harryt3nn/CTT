# Chess Training Toolkit — Architecture

## Overview

CTT is a desktop app built with **Electron + React + TypeScript** using Electron Forge
with the webpack-typescript template. It is fully offline with no backend — all data is
stored locally on disk.

---

## Process Model

Electron runs two separate processes:

### Main Process (`src/main.ts`)
- Runs in Node.js — has full filesystem and OS access
- Creates the `BrowserWindow`
- Registers all **IPC handlers** (`ipcMain.handle`) that the renderer calls
- Handles all direct file I/O via `MainStorage.ts`
- Handles file dialogs via `dialog.showOpenDialog`

### Renderer Process (`src/`)
- Runs in a sandboxed browser context — no direct Node/filesystem access
- All React components and pages live here
- Communicates with main via `window.storage.*` (see Preload Bridge below)

---

## IPC Bridge

Because the renderer is sandboxed, it cannot call Node APIs directly.
The bridge works in three layers:

```
Renderer (React)
    ↓ calls
window.storage.loadFolders()
    ↓ defined in
preload.ts  (contextBridge exposes window.storage)
    ↓ sends
ipcRenderer.invoke("storage:loadFolders")
    ↓ handled by
ipcMain.handle("storage:loadFolders")  in main.ts
    ↓ reads disk via
MainStorage.ts / fs.promises
```

### IPC Handlers registered in `main.ts`

| Handler                     | Description                                                  |
|-----------------------------|--------------------------------------------------------------|
| `storage:loadFolders`       | Reads `folders.json`, returns array of Folder                |
| `storage:saveFolders`       | Writes full folders array to `folders.json`                  |
| `storage:loadRepertoires`   | Reads each `.json` file in `repositories/`, returns array    |
| `storage:saveRepertoire`    | Writes a single repertoire as `{id}.json` in `repositories/` |
| `storage:openFileDialog`    | Opens native file picker, returns selected file paths        |
| `storage:readFile`          | Reads a file from disk and returns its contents as a string  |
| `storage:importRepertoires` | Merges imported folders, repertoires and nodes into storage  |

---

## Storage Layer (Renderer Side)

The renderer never calls `window.storage` directly. Instead it goes through an
abstraction layer:

### `StorageProvider` (interface)
Defines the contract: `loadFolders`, `saveFolders`, `loadRepertoires`, `saveRepertoire`.

### `FileSystemStorageProvider` (implements StorageProvider)
Implements the interface by delegating each method to `window.storage.*` IPC calls.
This is the only implementation currently. A mock implementation could be created for
testing without touching the filesystem.

### Usage in components
```typescript
const storage = useMemo(() => new FileSystemStorageProvider(), []);
const folders = await storage.loadFolders();
```

---

## Data Storage on Disk

All data lives under:
```
%APPDATA%/ctt/ctt-data/        (Windows: AppData/Roaming/ctt/ctt-data)
├── folders.json                # Array of all Folder objects
├── nodes.json                  # Map of nodeId → Node (all nodes across all repertoires)
└── repositories/               # One .json file per repertoire
    ├── {repertoire-id}.json
    ├── {repertoire-id}.json
    └── ...
```

### `folders.json` format
```json
{
  "folders": [
    {
      "id": "uuid",
      "name": "Harry's WB",
      "collapsed": false,
      "sortOrder": 1,
      "createdAt": 1234567890,
      "updatedAt": 1234567890
    }
  ]
}
```

### `repositories/{id}.json` format
```json
{
  "id": "uuid",
  "name": "White Aggressive Italian",
  "side": "white",
  "rootNodeId": "uuid",
  "folderId": "uuid-of-parent-folder",
  "createdAt": 1234567890,
  "updatedAt": 1234567890
}
```

### `nodes.json` format
```json
{
  "node-uuid": {
    "id": "uuid",
    "repertoireId": "uuid",
    "move": "e4",
    "fen": "rnbqkbnr/...",
    "comment": "",
    "color": "#3f3f46",
    "tags": [],
    "parentId": "uuid",
    "children": ["uuid", "uuid"],
    "transpositionEdges": [],
    "arrows": [],
    "highlightedSquares": []
  }
}
```

Note: chessgraph exports use `childIds` instead of `children` and export nodes as an
**array** rather than a map. `prepareForImport.ts` normalises both of these.

---

## Data Model

```
Folder (1)
  └── Repertoire (many)  — linked by repertoire.folderId === folder.id
        └── Node (many)  — linked by node.repertoireId === repertoire.id
                         — tree structure via node.children (array of child node IDs)
                         — root node identified by repertoire.rootNodeId
```

Repertoires with `folderId: null` are shown in the permanent **Uncategorised** folder
(id: `__uncategorised__`), which is never saved to disk and cannot be deleted.

---

## Import Pipeline (ChessGraph JSON)

ChessGraph exports a single JSON file. The import flow is:

```
User picks file
    ↓
validateChessGraphExport()     — checks shape, required fields, normalises null children
    ↓
prepareForImport()             — maps chessgraph format → internal types
                               — converts nodes array → Record<id, Node>
                               — maps childIds → children
                               — fills in missing createdAt/updatedAt with Date.now()
    ↓
ImportModal                    — user selects which repertoires to import
                               — folders and nodes are always included
    ↓
importRepertoires()            — merges into existing storage (skips duplicates by ID)
    ↓
reloadData()                   — refreshes React state from disk
```

---

## Pages & Navigation

Navigation is managed via `useState<Page>` in each page component — there is no router.
The `onBack` prop always navigates to the **App.tsx home screen**, not the previous page.
Sub-pages (Analytics, Training, Settings) are rendered by replacing the current page
component entirely.

### Page tree
```
App.tsx  (home screen)
├── EditRepertoires.tsx   — repertoire file browser, main working page
│   ├── Analytics.tsx
│   ├── TrainingToolkit.tsx
│   └── Settings.tsx      — receives onBack from App.tsx (not local setPage)
├── Analytics.tsx
├── TrainingToolkit.tsx
└── Settings.tsx
```

---

## Key Components

| Component | Description |
|---|---|
| `FolderSelection.tsx` | Renders a single folder row with its repertoire cards |
| `RepertoireRow.tsx` | Renders a single repertoire card inside a folder |
| `ImportModal.tsx` | Checkbox UI for selecting which repertoires to import |
| `RepList.tsx` | Simple debug/alternate list view of folders and repertoires |

---

## Known Quirks

- `main.ts` duplicates some path constants that also exist in `MainStorage.ts`. The
  IPC handlers in `main.ts` are the ones actually used at runtime — `MainStorage.ts`
  functions are used by `ImportService.ts` directly in the main process.
- ChessGraph v3 exports `nodes` as an array; earlier versions may differ.
- The `repositories` directory was previously named `repertoires` in an older code
  version, causing a load/save path mismatch. If reps go missing, check that both
  `main.ts` and `MainStorage.ts` reference `repositories`.



  

CTT (Chess Training Toolkit) is a fully offline desktop app built with Electron + React + TypeScript using Electron Forge (webpack-typescript template). The renderer is sandboxed and communicates with the main process via a window.storage.* IPC bridge (defined in preload, handled in main.ts). All data is stored locally at AppData/Roaming/ctt/ctt-data/ — folders in folders.json, repertoires as individual {id}.json files in repositories/, and all nodes in a single nodes.json map. The data model is Folder → Repertoire (folderId) → Node (repertoireId, children[]). The app is styled dark (chess.com/Lichess aesthetic: #262522 sidebar, #1a1a1a bg, #f0d9b5 accent) with a persistent left sidebar and page navigation via useState<Page> — no router. Users can import opening repertoires from chessgraph.net JSON exports (v3 format: nodes exported as array with childIds, normalised to a Record<id, Node> map with children on import via prepareForImport.ts). Libraries in use: react-chessboard, chess.js, @fortawesome/fontawesome-free, react-toastify. Current pages: EditRepertoires (repertoire file browser — main page), Analytics, TrainingToolkit, Settings. Key components: FolderSelection, RepertoireRow, ImportModal. The onBack prop always navigates to App.tsx home; Settings receives onBack passed through rather than a local setPage.

