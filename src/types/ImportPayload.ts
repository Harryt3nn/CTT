import type { PreparedRepertoire } from "../importsAndExports/prepareForImport";
import type { Node } from "./Node";

export type ImportRepertoiresPayload = {
  repertoires: PreparedRepertoire[];
  nodes: Record<string, Node>;
};