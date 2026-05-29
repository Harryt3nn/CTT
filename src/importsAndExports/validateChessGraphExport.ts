/*src/importsAndExports/validateChessGraphExports.ts*/

import type { Node } from "../types/Node";

// validates selected files to ensure they are appropriate
// appropriate files are in compliance with chess graph formatting
// returns null if the file is valid

export function validateChessGraphExport(data: any): string | null {
  
  if (!data || typeof data !== "object") {return "File is not valid JSON.";}
  if (!("version" in data)) {return "Missing 'version' field.";}
  if (!Array.isArray(data.repertoires)) {return "Missing or invalid 'repertoires' array.";}
  if (typeof data.nodes !== "object" || data.nodes === null) {return "Missing or invalid 'nodes' object.";}

  for (const rep of data.repertoires) 
    {
    if (!rep || typeof rep !== "object" || !rep.id || !rep.name || !rep.side || !rep.rootNodeId){
      return "One or more repertoires are missing required fields.";
    }
  }

  for (const rawNode of Object.values(data.nodes)) 
    {
    const node = rawNode as Node;

    if (!node || typeof node !== "object") {return "A node is malformed or not an object.";}
    if (!node.id) {return "A node is missing an 'id' field.";}
    if (node.children == null) {node.children = [];}
    if (!Array.isArray(node.children)) {return "A node has an invalid 'children' field.";}
  }
  return null;
}