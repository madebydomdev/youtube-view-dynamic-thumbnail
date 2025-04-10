import { XMLBuilder, XMLParser } from "fast-xml-parser";

import fs from "fs";
import sharp from "sharp";

export const updateTextInSvg = (filepath, nodeToFind, newValue) => {
  var svg = parseSvg(readSvg(filepath));

  const nodeToUpdate = findNodeToUpdate(
    svg,
    nodeToFind.attribute,
    nodeToFind.value
  );

  nodeToUpdate["#text"] = newValue;

  if (process.env.DYNAMIC_FONT_MAPPING) {
    try {
      updateFont(svg, process.env.DYNAMIC_FONT_MAPPING, newValue.length);
    } catch {}
  }

  return buildSvg(svg);
};

export const svgToPng = async (svgBuffer) => {
  var pngPath = "/tmp/thumbnail.png";
  await sharp(svgBuffer).resize(1280, 720).png().toFile(pngPath);

  return pngPath;
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

  return Buffer.from(builder.build(svg));
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

/** Non-blocking - may throw errors.
 *
 * ⚠️ Be prepared to catch.
 */
const updateFont = (svg, mappings, length) => {
  var { attribute, value, characters } = JSON.parse(mappings);
  var node = findByAttribute(svg, "@_" + attribute, value);
  if (!node) return;

  for (var style of characters) {
    var { range, size } = style;

    var inRange = Array.isArray(range)
      ? range[0] <= length && length <= range[1]
      : range === length;

    if (inRange) {
      node["@_font-size"] = size;
      break;
    }
  }
};
