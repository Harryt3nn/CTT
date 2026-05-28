import React, { useState } from "react";
import type { PreparedImportData } from "../importsAndExports/prepareForImport";
import { toast } from "react-toastify";
export function ImportModal({
  data,
  onClose,
  reloadData
}: {
  data: PreparedImportData;
  onClose: () => void;
  reloadData: () => Promise<void>;
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const toggle = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleImport = async () => {
  setLoading(true);

  await window.storage.importRepertoires({
    folders: data.folders,
    repertoires: data.repertoires.filter(r => selected.includes(r.id)),
    nodes: data.nodes
  })

  await reloadData();
  toast.success("Imported repertoires successfully");
  setLoading(false);
  onClose();
};

  return (
    <div className="modal-backdrop">
      <div className="modal-window">

        <h2>Import from Chess Graph</h2>
        <p>Select repertoires to import. Folders + nodes will be saved automatically.</p>

        <div className="folder-view">
          {data.folders.map(folder => {
            const reps = data.repertoires.filter(r => r.folderId === folder.id);
            if (reps.length === 0) return null;

            return (
              <div key={folder.id} className="folder-block">
                <div className="folder-title">{folder.name}</div>

                {reps.map(rep => (
                  <label key={rep.id} className="rep-item">
                    <input
                      type="checkbox"
                      checked={selected.includes(rep.id)}
                      onChange={() => toggle(rep.id)}
                    />
                    {rep.name} ({rep.side})
                  </label>
                ))}
              </div>
            );
          })}

          {/* Repertoires with no folder */}
          {data.repertoires.filter(r => r.folderId === null).length > 0 && (
            <div className="folder-block">
              <div className="folder-title">(No Folder)</div>

              {data.repertoires
                .filter(r => r.folderId === null)
                .map(rep => (
                  <label key={rep.id} className="rep-item">
                    <input
                      type="checkbox"
                      checked={selected.includes(rep.id)}
                      onChange={() => toggle(rep.id)}
                    />
                    {rep.name} ({rep.side})
                  </label>
                ))}
            </div>
          )}
        </div>

        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button
            className="btn-primary"
            disabled={selected.length === 0 || loading}
            onClick={handleImport}
          >
            {loading ? "Importing..." : "Import Selected"}
          </button>
        </div>

      </div>
    </div>
  );
}
