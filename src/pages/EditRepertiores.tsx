import React, { useState, useEffect, useRef } from 'react';
import Analytics from './Analytics';
import Settings from './Settings';
import TrainingToolkit from './TrainingToolkit';
import { FileSystemStorageProvider } from "../Storage/FileSystemStorageProvider";
import { useMemo } from "react";
import FolderSelection from "../components/FolderSelection";
import { validateChessGraphExport } from "../importsAndExports/validateChessGraphExport";
import { prepareForImport } from "../importsAndExports/prepareForImport";
import { ImportModal } from "../components/ImportModal";
import { RepList } from "../Storage/RepList";

export interface Repertoire {
  id: string;
  name: string;
  side: "white" | "black";
  rootNodeId: string;
  folderId: string | null;
  createdAt: number; 
  updatedAt: number; 
}

export interface Folder {
  id: string;
  name: string;
  sortOrder: number;
  collapsed: boolean;
  createdAt: number; 
  updatedAt: number; 
}

type Page = 'home' | 'analytics' | 'tools' | 'settings';

function timeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function generateId(): string {
  return crypto.randomUUID();
}


function ChessKnightIcon({ color }: { color: "white" | "black" }) {
  const isWhite = color === 'white';
  return (
    <div style={{
      width: 32, height: 32, borderRadius: 6,
      background: isWhite ? 'rgba(240,217,181,0.15)' : 'rgba(100,80,60,0.25)',
      border: `1px solid ${isWhite ? 'rgba(240,217,181,0.3)' : 'rgba(150,120,90,0.3)'}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      <i className="fa-solid fa-chess-queen" style={{
        fontSize: 14,
        color: isWhite ? '#f0d9b5' : '#b58863',
      }} />
    </div>
  );
}

function InlineEdit({
  value,
  onSave,
  style,
}: {
  value: string;
  onSave: (v: string) => void;
  style?: React.CSSProperties;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const cancelledRef = useRef(false);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const commit = () => {
    if (!cancelledRef.current) {
      onSave(draft.trim() || value);
    }
    cancelledRef.current = false;
    setEditing(false);
  };

  if (editing) {
    return (
      <input
        ref={inputRef}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit();
          if (e.key === "Escape") {
            cancelledRef.current = true;
            setEditing(false);
          }
        }}
        style={{
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(240,217,181,0.4)",
          borderRadius: 4,
          color: "#e8e0d5",
          padding: "2px 6px",
          fontSize: "inherit",
          fontFamily: "inherit",
          fontWeight: "inherit",
          outline: "none",
          ...style,
        }}
      />
    );
  }

  return (
    <span
      onDoubleClick={() => {
        setDraft(value);
        setEditing(true);
      }}
      title="Double-click to rename"
      style={{ cursor: "text", ...style }}
    >
      {value}
    </span>
  );
}

function RepertoireCard({
  file,
  onRename,
  onSelect,
}: {
  file: Repertoire;
  onRename: (id: string, name: string) => void;
  onSelect: (id: string) => void;
}) {
  return (
    <div
      onClick={() => onSelect(file.id)}
      style={{
        background: "#2a2725",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 10,
        padding: "16px 18px",
        cursor: "pointer",
        transition: "border-color 0.15s, background 0.15s, transform 0.1s",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        minHeight: 110,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(240,217,181,0.3)";
        e.currentTarget.style.background = "#302e2c";
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
        e.currentTarget.style.background = "#2a2725";
        e.currentTarget.style.transform = "none";
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <ChessKnightIcon color={file.side} />

        <InlineEdit
          value={file.name}
          onSave={(name) => onRename(file.id, name)}
          style={{
            fontWeight: 600,
            fontSize: 15,
            color: "#e8e0d5",
            flex: 1,
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "auto",
          fontSize: 12,
          color: "#6e6560",
        }}
      >
        <span>Repertoire</span>
        <span>{timeAgo(file.updatedAt)}</span>
      </div>
    </div>
  );
}


function FolderSection({
  folder,
  files,
  onToggle,
  onRenameFolder,
  onRenameFile,
  onSelectFile,
}: {
  folder: Folder;
  files: Repertoire[];
  onToggle: (id: string) => void;
  onRenameFolder: (id: string, name: string) => void;
  onRenameFile: (fileId: string, name: string) => void;
  onSelectFile: (fileId: string) => void;
}) {
  return (
    <div style={{ marginBottom: 28 }}>
      {/* Folder header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 14,
          color: "#9a9080",
        }}
      >
        <button
          onClick={() => onToggle(folder.id)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#9a9080",
            padding: 0,
            display: "flex",
            alignItems: "center",
            transition: "transform 0.2s",
            transform: folder.collapsed ? "rotate(-90deg)" : "rotate(0deg)",
          }}
        >
          <i className="fa-solid fa-chevron-down" style={{ fontSize: 11 }} />
        </button>

        <i className="fa-solid fa-folder" style={{ fontSize: 13 }} />

        <InlineEdit
          value={folder.name}
          onSave={(name) => onRenameFolder(folder.id, name)}
          style={{ fontWeight: 600, fontSize: 14, color: "#c0b8b0" }}
        />

        <span style={{ fontSize: 12, marginLeft: 2, color: "#6e6560" }}>
          {files.length}
        </span>
      </div>

      {/* Cards grid */}
      {!folder.collapsed && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 12,
          }}
        >
          {files.length === 0 && (
            <div
              style={{
                color: "#6e6560",
                fontSize: 13,
                padding: "8px 4px",
              }}
            >
              No repertoires in this folder
            </div>
          )}

          {files.map((file) => (
            <RepertoireCard
              key={file.id}
              file={file}
              onRename={(fileId, name) => onRenameFile(fileId, name)}
              onSelect={onSelectFile}
            />
          ))}
        </div>
      )}
    </div>
  );
}



const EditRepertoires = ({ onBack }: { onBack: () => void }) => {
  const [page, setPage] = useState<Page>("home");
  const [folders, setFolders] = useState<Folder[]>([]);
  const [repertoires, setRepertoires] = useState<Repertoire[]>([]);
  const [search, setSearch] = useState("");
  const [creatingFolder, setCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const newFolderRef = useRef<HTMLInputElement>(null);
  const storage = useMemo(() => new FileSystemStorageProvider(), []);
  const [pendingImportData, setPendingImportData] = useState<any | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  

  const handleImportClick = async () => {
  const filePaths = await window.storage.openFileDialog({
    filters: [{ name: "JSON Files", extensions: ["json"] }]
  });

  if (!filePaths || filePaths.length === 0) return;

  const filePath = filePaths[0];

  const fileContents = await window.storage.readFile(filePath);
  if (!fileContents) {
    alert("Could not read file.");
    return;
  }

  let parsed: any;
  try {
    parsed = JSON.parse(fileContents);
  } catch {
    alert("File is not valid JSON.");
    return;
  }

  const error = validateChessGraphExport(parsed);
  if (error) {
    alert("Invalid ChessGraph export: " + error);
    return;
  }

  const prepared = prepareForImport(parsed);

  setPendingImportData(prepared);
  setShowImportModal(true);
};


  useEffect(() => {
    if (creatingFolder) newFolderRef.current?.focus();
  }, [creatingFolder]);

  useEffect(() => {
  storage.loadFolders().then(setFolders);
  storage.loadRepertoires().then(setRepertoires);
}, []);

  if (page === 'analytics') return <Analytics onBack={() => setPage('home')} />;
  if (page === 'tools') return <TrainingToolkit onBack={() => setPage('home')} />;
  if (page === 'settings') return <Settings onBack={onBack} />;

  
  const toggleFolder = async (id: string) => {
  setFolders(prev => {
    const updated = prev.map(f =>
      f.id === id ? { ...f, collapsed: !f.collapsed, updatedAt: Date.now() } : f
    );
    storage.saveFolders(updated);
    return updated;
  });
};


  const renameFolder = async (id: string, name: string) => {
  setFolders(prev => {
    const updated = prev.map(f =>
      f.id === id ? { ...f, name, updatedAt: Date.now() } : f
    );
    storage.saveFolders(updated);
    return updated;
  });
};

  const renameRepertoire = async (repId: string, name: string) => {
  setRepertoires(prev => {
    const updated = prev.map(r =>
      r.id === repId ? { ...r, name, updatedAt: Date.now() } : r
    );
    const rep = updated.find(r => r.id === repId);
    if (rep) storage.saveRepertoire(rep);
    return updated;
  });
};

  const createFolder = async () => {
  const name = newFolderName.trim() || "New Folder";
  const newFolder = {
    id: generateId(),
    name,
    collapsed: false,
    sortOrder: folders.length,
    createdAt: Date.now(),
    updatedAt: Date.now()
  };

  setFolders(prev => {
    const updated = [...prev, newFolder];
    storage.saveFolders(updated);
    return updated;
  });

  setNewFolderName("");
  setCreatingFolder(false);
};

  const selectRepertoire = (repId: string) => {
  console.log("Selected repertoire:", repId);
  // later: open viewer/editor
};

const deleteFolder = async (folderId: string) => {
    const updatedFolders = folders.filter(f => f.id !== folderId);
    const updatedRepertoires = repertoires.map(rep =>
      rep.folderId === folderId ? { ...rep, folderId: null } : rep
    );
    await storage.saveFolders(updatedFolders);
    for (const rep of updatedRepertoires) {
      await storage.saveRepertoire(rep);
    }
    setFolders(updatedFolders);
    setRepertoires(updatedRepertoires);
  };

  const reloadData = async () => {
  const folders = await window.storage.loadFolders();
  setFolders(folders);

  const reps = await window.storage.loadRepertoires();
  setRepertoires(reps);
};

 const filtered = search.trim()
  ? folders
      .map(folder => {
        const repsInFolder = repertoires.filter(
          r =>
            r.folderId === folder.id &&
            r.name.toLowerCase().includes(search.toLowerCase())
        );

        const folderMatches = folder.name
          .toLowerCase()
          .includes(search.toLowerCase());

        return {
          ...folder,
          collapsed: false,
          filteredRepertoires: repsInFolder,
          folderMatches
        };
      })
      .filter(f => f.folderMatches || f.filteredRepertoires.length > 0)
  : folders.map(folder => ({
      ...folder,
      filteredRepertoires: repertoires.filter(r => r.folderId === folder.id)
    }));



  // ── Render ─────────────────────────────────────────────────────────────────

  return (
  <div className="app-layout">

    {/* Sidebar */}
    <aside className="sidebar">
      <div className="sidebar-logo">
        <i className="fa-solid fa-chess-knight" />
        <span>CTT</span>
      </div>

      <nav className="sidebar-nav">
        {[
          { label: 'Repertoires', icon: 'fa-book-open', active: true, onClick: () => {} },
          { label: 'Analytics', icon: 'fa-chart-line', active: false, onClick: () => setPage('analytics') },
          { label: 'Training', icon: 'fa-dumbbell', active: false, onClick: () => setPage('tools') },
        ].map(({ label, icon, active, onClick }) => (
          <button
            key={label}
            className={active ? "nav-btn active" : "nav-btn"}
            onClick={onClick}
          >
            <i className={`fa-solid ${icon}`} />
            {label}
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        {[
          { label: 'Home', icon: 'fa-house', onClick: onBack },
          { label: 'Settings', icon: 'fa-gear', onClick: () => setPage('settings') },
        ].map(({ label, icon, onClick }) => (
          <button key={label} className="nav-btn" onClick={onClick}>
            <i className={`fa-solid ${icon}`} />
            {label}
          </button>
        ))}
      </div>
    </aside>

    {/* Main */}
    <main className="main-content">

      {/* Top bar */}
      <div className="topbar">
        <h1>Your Repertoires</h1>

        <div className="topbar-actions">
          <button className="btn-outline" onClick={() => setCreatingFolder(true)}>
            <i className="fa-solid fa-folder-plus" />
            New Folder
          </button>

          <button className="btn-primary" onClick={() => {/* TODO */}}>
            <i className="fa-solid fa-plus" />
            New Graph
          </button>

          <button className="btn-outline" onClick={handleImportClick}>
            <i className="fa-solid fa-file-import" />
            Import from Chess Graph
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="search-container">
        <div className="search-wrapper">
          <i className="fa-solid fa-magnifying-glass search-icon" />
          <input
            className="search-input"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search repertoires..."
          />
        </div>
      </div>

      {/* New folder inline input */}
      {creatingFolder && (
        <div className="new-folder-container">
          <div className="new-folder-input">
            <i className="fa-solid fa-folder" />
            <input
              ref={newFolderRef}
              value={newFolderName}
              onChange={e => setNewFolderName(e.target.value)}
              placeholder="Folder name..."
              onKeyDown={e => {
                if (e.key === 'Enter') createFolder();
                if (e.key === 'Escape') setCreatingFolder(false);
              }}
              onBlur={createFolder}
            />
          </div>
        </div>
      )}

      {/* Folder list */}
     <div className="folder-list">
  {filtered.length === 0 ? (
    <div className="empty-message">No repertoires found.</div>
  ) : (
    filtered.map(folder => (
      <FolderSelection
        key={folder.id}
        folder={folder}
        repertoires={folder.filteredRepertoires}
        onToggle={toggleFolder}
        onRenameFolder={renameFolder}
        onRenameRepertoire={renameRepertoire}
        onSelectRepertoire={selectRepertoire}
        onDeleteFolder={deleteFolder}
      />
    ))
  )}
</div>
    </main>
    {showImportModal && pendingImportData && (
  <ImportModal
  data={pendingImportData}
  onClose={() => setShowImportModal(false)}
  reloadData={reloadData}
/>
)}
  </div>
);
};

export default EditRepertoires;