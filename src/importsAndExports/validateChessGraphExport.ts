import type { Node } from "../types/Node";

/**
 * Validates a ChessGraph export file.
 * Returns `null` if valid, otherwise a human-readable error string.
 */
export function validateChessGraphExport(data: any): string | null {
  // Basic shape check
  if (!data || typeof data !== "object") {
    return "File is not valid JSON.";
  }

  // Version field
  if (!("version" in data)) {
    return "Missing 'version' field.";
  }

  // Repertoires array
  if (!Array.isArray(data.repertoires)) {
    return "Missing or invalid 'repertoires' array.";
  }

  // Nodes object
  if (typeof data.nodes !== "object" || data.nodes === null) {
    return "Missing or invalid 'nodes' object.";
  }

  // Validate repertoires
  for (const rep of data.repertoires) {
    if (
      !rep ||
      typeof rep !== "object" ||
      !rep.id ||
      !rep.name ||
      !rep.side ||
      !rep.rootNodeId
    ) {
      return "One or more repertoires are missing required fields.";
    }
  }

  // Validate and normalise nodes
  for (const rawNode of Object.values(data.nodes)) {
    const node = rawNode as Node;

    if (!node || typeof node !== "object") {
      return "A node is malformed or not an object.";
    }

    if (!node.id) {
      return "A node is missing an 'id' field.";
    }

    // Normalise children: null or missing → []
    if (node.children == null) {
      node.children = [];
    }

    // Validate children is now an array
    if (!Array.isArray(node.children)) {
      return "A node has an invalid 'children' field.";
    }
  }

  return null;
}

