/* src/components/RepertoireRow.tsx */

import React, { useState, useRef } from "react";
import type { Repertoire } from "../types/Repertoire";

// small UI component for individual graphs inside an opened folder
// returns raw html

interface Props {
  rep: Repertoire;
  onRename: (id: string, name: string) => void;
  onSelect: (id: string) => void;
}

const RepertoireRow: React.FC<Props> = ({ rep, onRename, onSelect }) => {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(rep.name);
  const inputRef = useRef<HTMLInputElement>(null);

  const finish = () => {
    setEditing(false);
    const trimmed = name.trim();
    if (trimmed && trimmed !== rep.name) onRename(rep.id, trimmed);
    else setName(rep.name);
  };

  //render
  return (
    <div
      className="rep-row"
      onClick={() => onSelect(rep.id)}
    >
      <i className="fa-solid fa-chess-board rep-row-icon" />

      {editing ? (
        <input
          ref={inputRef}
          value={name}
          onChange={e => setName(e.target.value)}
          onBlur={finish}
          onKeyDown={e => {
            if (e.key === "Enter") finish();
            if (e.key === "Escape") {
              setEditing(false);
              setName(rep.name);
            }
          }}
          className="rep-row-input"
        />
      ) : (
        <span
          className="rep-row-name"
          onDoubleClick={e => {
            e.stopPropagation();
            setEditing(true);
            setTimeout(() => inputRef.current?.focus(), 0);
          }}
        >
          {rep.name}
        </span>
      )}
    </div>
  );
};

export default RepertoireRow;
