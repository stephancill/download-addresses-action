import { headers } from "next/headers";
import { HUB_API_URL } from "./env";
import { kv } from "@vercel/kv";

export function currentURL(pathname: string): URL {
  const headersList = headers();
  const host = headersList.get("x-forwarded-host") || headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto") || "http";

  try {
    return new URL(pathname, `${protocol}://${host}`);
  } catch (error) {
    return new URL("http://localhost:3000");
  }
}

export function appURL() {
  if (process.env.APP_URL) {
    return process.env.APP_URL;
  } else {
    const url = process.env.APP_URL || vercelURL() || "http://localhost:3000";
    console.warn(
      `Warning: APP_URL environment variable is not set. Falling back to ${url}.`
    );
    return url;
  }
}

export function vercelURL() {
  return process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : undefined;
}

export async function getCastReplies({
  hash,
  fid,
}: {
  hash: string;
  fid: string;
}) {
  // const res = await fetch(
  //   `${HUB_API_URL}/v1/castsByParent?fid=${fid}&hash=${hash}`
  // );
  // const { messages, nextPageToken } = await res.json();

  // const casts: { text: string; fid: string }[] = messages.map(
  //   (message: any) => ({
  //     text: message.data.castAddBody.text,
  //     fid: message.data.fid.toString(),
  //   })
  // );

  const casts: { text: string; fid: string }[] = [];

  let nextPageToken: string | null = null;
  do {
    console.log("nextPageToken", nextPageToken);
    const searchParames = new URLSearchParams({
      fid,
      hash,
    });
    if (nextPageToken) {
      searchParames.set("pageToken", nextPageToken);
    }
    const res = await fetch(
      `${HUB_API_URL}/v1/castsByParent?${searchParames.toString()}`
    );
    const { messages: nextMessages, nextPageToken: nextNextPageToken } =
      await res.json();

    nextMessages
      .map((message: any) => ({
        text: message.data.castAddBody.text,
        fid: message.data.fid.toString(),
      }))
      .map((cast: { text: string; fid: string }) => casts.push(cast));

    nextPageToken = nextNextPageToken;
  } while (nextPageToken);

  return casts;
}

export function extractFirstEthereumAddress(text: string): string | null {
  const regex = /0x[a-fA-F0-9]{40}/;
  const match = text.match(regex);
  return match ? match[0] : null;
}

export function extractFirstENSName(text: string): string | null {
  const regex = /[a-zA-Z0-9-]+\.eth\b/;
  const match = text.match(regex);
  return match ? match[0].toLowerCase() : null;
}

export async function getAddressesFromReplies({
  hash,
  fid,
}: Parameters<typeof getCastReplies>[0]) {
  const casts = await getCastReplies({ hash, fid });

  const addresses = casts
    .map(({ text, fid }) => ({
      address: extractFirstEthereumAddress(text) || extractFirstENSName(text),
      fid,
    }))
    .filter(({ address }) => Boolean(address));

  return addresses;
}
