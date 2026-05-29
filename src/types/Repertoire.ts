/*src/types/Repertoire.ts*/

export interface Repertoire {
  id: string;
  name: string;
  side: "white" | "black";
  rootNodeId: string;
  folderId: string | null;
  createdAt: number;
  updatedAt: number;
}
