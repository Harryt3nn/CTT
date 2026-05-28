import React from "react";
import type { Folder } from "../types/Folder";
import type { Repertoire } from "../types/Repertoire";

interface RepListProps {
  folders: Folder[];
  repertoires: Repertoire[];
}

export function RepList({ folders, repertoires }: RepListProps) {
  return (
    <div className="rep-list">
      {folders.map(folder => {
        const repsInFolder = repertoires.filter(r => r.folderId === folder.id);

        return (
          <div key={folder.id} className="folder-row">
            <div className="folder-header">
              <span className="folder-name">{folder.name}</span>
            </div>

            <div className="folder-reps">
              {repsInFolder.length === 0 ? (
                <div className="empty">No repertoires</div>
              ) : (
                repsInFolder.map(rep => (
                  <div key={rep.id} className="rep-preview">
                    • {rep.name} ({rep.side})
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}