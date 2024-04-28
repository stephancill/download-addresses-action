import { Button } from "frames.js/next";
import { frames } from "../frames";
import { getCastReplies } from "../../../../utils";

export const POST = frames(async (ctx) => {
  if (!ctx.message?.castId?.fid || !ctx.message?.castId?.hash) {
    throw new Error("Missing castId in message");
  }

  const replies = await getCastReplies({
    hash: ctx.message?.castId?.hash!,
    fid: ctx.message?.castId?.fid!.toString(),
  });

  return {
    image: <div tw="flex">The user's FID is {ctx.message?.castId?.fid}</div>,
    buttons: [
      <Button
        action="post"
        target={{ pathname: "/check-fid", query: { self: true } }}
      >
        My FID
      </Button>,
    ],
  };
});
