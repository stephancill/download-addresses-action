import { Button } from "frames.js/next";
import { frames } from "../frames";
import {
  extractFirstENSName,
  extractFirstEthereumAddress,
  getAddressesFromReplies,
  getCastReplies,
} from "../../../../utils";
import { kv } from "@vercel/kv";

export const POST = frames(async (ctx) => {
  const hash = ctx.message?.castId?.hash;
  const fid = ctx.message?.castId?.fid.toString();

  if (!fid || !hash) {
    throw new Error("Missing castId in message");
  }

  const refreshResponse = {
    image: <div tw="flex">Fetching...</div>,
    buttons: [
      <Button
        action="post"
        target={{
          pathname: "/download-reply-addresses",
          query: { hash, fid, refresh: true },
        }}
      >
        Refresh
      </Button>,
    ] as any, // keep typescript happy
  };

  if (!ctx.searchParams.refresh) {
    // clear kv
    await kv.del(`addresses:${hash}`);

    getAddressesFromReplies({
      hash: hash,
      fid: fid.toString(),
    }).then(async (addresses) => {
      // save to kv
      await kv.set(`addresses:${hash}`, JSON.stringify(addresses));
    });

    return refreshResponse;
  } else {
    const addresses = await kv.get<ReturnType<typeof getAddressesFromReplies>>(
      `addresses:${hash}`
    );

    if (!addresses) {
      return refreshResponse;
    }

    return {
      image: <div tw="flex">Parsed {addresses.length} addresses</div>,
      buttons: [
        <Button
          action="link"
          target={{ pathname: "/csv", query: { key: `addresses:${hash}` } }}
        >
          Download CSV
        </Button>,
        <Button
          action="link"
          target={{
            pathname: "/csv",
            query: { key: `addresses:${hash}`, fids: true },
          }}
        >
          Download CSV with fids
        </Button>,
      ],
    };
  }
});
