/*src/types/ImportPayload.ts*/
import type { PreparedRepertoire } from "../importsAndExports/prepareForImport";
import type { Node } from "./Node";

// defines data shape for importing chess graph repertoires

export type ImportRepertoiresPayload = {
  repertoires: PreparedRepertoire[];
  nodes: Record<string, Node>;
};