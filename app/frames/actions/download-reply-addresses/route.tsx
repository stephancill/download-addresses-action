import { NextRequest } from "next/server";
import { appURL } from "../../../utils";
import { frames } from "../../frames";
import { ActionMetadata } from "frames.js";

export const GET = async (req: NextRequest) => {
  const actionMetadata: ActionMetadata = {
    action: {
      type: "post",
    },
    icon: "filter",
    name: "Download Replies Addresses",
    aboutUrl: `${appURL()}/`,
    description:
      "Parse and download all the addresses in replies of cast as CSV",
  };

  return Response.json(actionMetadata);
};

export const POST = frames(async (ctx) => {
  return Response.json({
    type: "frame",
    frameUrl: `${appURL()}/frames/download-reply-addresses`,
  });
});
