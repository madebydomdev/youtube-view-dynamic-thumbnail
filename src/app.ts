import thumbnail from "./assets/dynamic-youtube-thumbnail.svg";
import { updateTextInSvg } from "./lib/thumbnail-processor";

export const handler = async () => {
  console.log("hello");
  updateTextInSvg(
    thumbnail,
    {
      attribute: process.env.NODE_ATTRIBUTE ?? "",
      search: process.env.NODE_VALUE ?? "",
    },
    "123"
  );

  return { statusCode: 200 };
};
