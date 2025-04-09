import { XMLBuilder, XMLParser } from "fast-xml-parser";

import fs from "fs";
import path from "path";

export const updateTextInSvg = (filepath, nodeToFind, newValue) => {
  var svg = parseSvg(readSvg(filepath));

  const nodeToUpdate = findNodeToUpdate(
    svg,
    nodeToFind.attribute,
    nodeToFind.value
  );

  nodeToUpdate["#text"] = newValue;
  saveSvg(buildSvg(svg));
};

const readSvg = (filepath) => {
  try {
    return fs.readFileSync(filepath, "utf-8");
  } catch (err) {
    if (err.code === "ENOENT") {
      throw new Error(`File "${filepath}" not found`);
    }
  }
};

const parseSvg = (svg) => {
  var parser = new XMLParser({ ignoreAttributes: false });
  return parser.parse(svg);
};

const buildSvg = (svg) => {
  var builder = new XMLBuilder({
    ignoreAttributes: false,
    format: true,
  });

  return builder.build(svg);
};

const saveSvg = (svg) => {
  const filePath = path.join("/tmp", "output.svg");
  fs.writeFileSync(filePath, svg);
  console.log();
};

const findNodeToUpdate = (svg, attribute, value) => {
  var node = findByAttribute(svg, attribute, value);

  if (node === undefined) {
    throw new Error(`Node with attribute "${attribute}=${value}" not found`);
  }

  if (!("#text" in node)) {
    throw new Error("No text node found");
  }

  return node;
};

const findByAttribute = (obj, attribute, value) => {
  if (typeof obj !== "object" || obj === null) return undefined;
  if (obj[attribute] === value) return obj;

  for (const key in obj) {
    const result = findByAttribute(obj[key], attribute, value);
    if (result) return result;
  }

  return undefined;
};
