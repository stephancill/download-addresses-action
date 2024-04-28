import { headers } from "next/headers";
import { HUB_API_URL } from "./env";

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
  //curl http://127.0.0.1:2281/v1/castsByParent?fid=226&hash=0xa48dd46161d8e57725f5e26e34ec19c13ff7f3b9
  const res = await fetch(
    `${HUB_API_URL}/v1/castsByParent?fid=${fid}&hash=${hash}`
  );
  const json = await res.json();

  console.log(json);

  return json;
}
