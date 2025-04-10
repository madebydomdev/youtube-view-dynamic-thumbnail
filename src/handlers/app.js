import { svgToPng, updateTextInSvg } from "../lib/thumbnail-processor.js";

export const handler = async () => {
  var svg = updateTextInSvg(
    "/var/task/src/assets/dynamic-youtube-thumbnail.svg",
    {
      attribute: process.env.NODE_ATTRIBUTE,
      value: process.env.NODE_VALUE,
    },
    "1000000"
  );

  var pngPath = await svgToPng(svg);
  console.log();
};
