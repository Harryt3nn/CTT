/* src/components/FolderSelection.tsx */

import React, { useState, useRef } from "react";
import type { Folder } from "../types/Folder";
import type { Repertoire } from "../types/Repertoire";
import RepertoireRow from "./RepertoireRow";

// UI component to display available 'folders' (JSON objects)
// ensures folders can collapse
// functions: collapse, rename (rep + folder), select, delete
// returns raw html


// predefine all operations
interface FolderSelectionProps {
  folder: Folder;
  repertoires: Repertoire[];
  onToggle: (id: string) => void;
  onRenameFolder: (id: string, name: string) => void;
  onRenameRepertoire: (id: string, name: string) => void;
  onSelectRepertoire: (id: string) => void;
  onDeleteFolder: (id: string) => void;
}

// folder names cannot be too long (for optimal display)
const MAX_FOLDER_NAME = 32;

const FolderSelection: React.FC<FolderSelectionProps> = ({
  folder,
  repertoires,
  onToggle,
  onRenameFolder,
  onRenameRepertoire,
  onSelectRepertoire,
  onDeleteFolder
}) => {
  const [editingFolder, setEditingFolder] = useState(false);
  const [folderName, setFolderName] = useState(folder.name);
  const folderInputRef = useRef<HTMLInputElement>(null);

  // name cannot be empty
  const startFolderRename = () => {
    setEditingFolder(true);
    setTimeout(() => folderInputRef.current?.focus(), 0);
  };

  const finishFolderRename = () => {
    const trimmed = folderName.trim();

    setEditingFolder(false);
    if (!trimmed || trimmed === folder.name) {
      setFolderName(folder.name);
      return;
    }
    if (trimmed.length > MAX_FOLDER_NAME) {
      alert(`Folder names must be under ${MAX_FOLDER_NAME} characters.`);
      setFolderName(folder.name);
      return;
    }

    onRenameFolder(folder.id, trimmed);
  };

  // render:
  return (
    <div className="folder-block">
      {/* Folder Header */}
      <div className="folder-header">
        {/* Expand/Collapse */}
        <i
          className={`fa-solid ${folder.collapsed ? "fa-folder" : "fa-folder-open"} folder-icon`}
          onClick={() => onToggle(folder.id)}
        />

        {/* Folder Name or Input */}
        {editingFolder ? (
          <input
            ref={folderInputRef}
            value={folderName}
            maxLength={MAX_FOLDER_NAME + 5}
            onChange={e => setFolderName(e.target.value)}
            onBlur={finishFolderRename}
            onKeyDown={e => {
              if (e.key === "Enter") finishFolderRename();
              if (e.key === "Escape") {
                setEditingFolder(false);
                setFolderName(folder.name);
              }
            }}
            className={`folder-input ${
              folderName.length > MAX_FOLDER_NAME ? "folder-input-error" : ""
            }`}
          />
        ) : (
          <span className="folder-name">{folder.name}</span>
        )}

        {/* RENAME BUTTON */}
        {!editingFolder && (
          <button
            onClick={startFolderRename}
            className="folder-btn folder-btn-rename"
            title="Rename folder"
          >
            <i className="fa-solid fa-pen" />
          </button>
        )}

        {/* DELETE BUTTON */}
        <button
          onClick={() => onDeleteFolder(folder.id)}
          className="folder-btn folder-btn-delete"
          title="Delete folder"
        >
          <i className="fa-solid fa-trash" />
        </button>
      </div>

      {/* Repertoires */}
      {!folder.collapsed && (
        <div className="repertoire-list">
          {repertoires.length === 0 ? (
            <div className="repertoire-empty">No repertoires</div>
          ) : (
            repertoires.map(rep => (
              <RepertoireRow
                key={rep.id}
                rep={rep}
                onRename={onRenameRepertoire}
                onSelect={onSelectRepertoire}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default FolderSelection;