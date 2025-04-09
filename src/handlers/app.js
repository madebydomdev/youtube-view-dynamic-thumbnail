import { updateTextInSvg } from "../lib/thumbnail-processor.js";

export const handler = async () => {
  updateTextInSvg(
    "/var/task/src/assets/dynamic-youtube-thumbnail.svg",
    {
      attribute: process.env.NODE_ATTRIBUTE,
      value: process.env.NODE_VALUE,
    },
    "20"
  );
};
