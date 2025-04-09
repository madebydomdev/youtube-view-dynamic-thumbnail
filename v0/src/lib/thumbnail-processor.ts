import { XMLBuilder, XMLParser } from "fast-xml-parser";

import fs from "fs";
import path from "path";

export const updateTextInSvg = (
  filepath: string,
  node: { attribute: string; search: string },
  newValue: string
) => {
  let svg = "";
  try {
    svg = fs.readFileSync(filepath, "utf8");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    if (err.code === "ENOENT") {
      throw new Error(`File not found ${filepath}`);
    }
    throw err;
  }

  const parser = new XMLParser({ ignoreAttributes: false });
  const svgParsed = parser.parse(svg);

  const viewCountNode = findByAttribute(svgParsed, node.attribute, node.search);

  if (viewCountNode === undefined) {
    throw new Error(
      `Node with attribute ${node.attribute} equal to ${node.search}`
    );
  } else if (!("#text" in viewCountNode)) {
    throw new Error("No text node found");
  }

  viewCountNode["#text"] = newValue;
  const builder = new XMLBuilder({
    ignoreAttributes: false,
    format: true,
  });

  const updatedSvg = builder.build(svgParsed);
  const filePath = path.join("/tmp", "output.svg");
  fs.writeFileSync(filePath, updatedSvg);

  console.log();
};

function findByAttribute<T>(
  obj: Record<string, unknown>,
  attribute: string,
  value: T
): Record<string, T | unknown> | undefined {
  if (typeof obj !== "object" || obj === null) return undefined;

  if (obj[attribute] === value) return obj;

  for (const key in obj) {
    const result = findByAttribute(
      obj[key] as Record<string, unknown>,
      attribute,
      value
    );

    if (result) return result;
  }

  return undefined;
}
