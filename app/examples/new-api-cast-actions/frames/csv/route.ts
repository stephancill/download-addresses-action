import { NextRequest } from "next/server";
import { getAddressesFromReplies, getCastReplies } from "../../../../utils";
import { kv } from "@vercel/kv";

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get("key");
  const includeFids = req.nextUrl.searchParams.get("fids");

  if (!key) {
    return new Response("Missing key", { status: 400 });
  }

  const addresses = await kv.get<ReturnType<typeof getAddressesFromReplies>>(
    key
  );

  if (!addresses) {
    return new Response("Addresses not found", { status: 404 });
  }

  console.log(addresses);

  const head = includeFids ? "address,fid" : "address";
  const csv = [
    head,
    ...addresses.map(
      ({ address, fid }) => address + (includeFids ? `,${fid}` : "")
    ),
  ].join("\n");

  const buffer = Buffer.from(csv, "utf8");
  const headers = new Headers();
  headers.append(
    "Content-Disposition",
    `attachment; filename="${key.replace(":", "_")}.csv"`
  );
  headers.append("Content-Type", "text/csv");

  return new Response(buffer, {
    headers,
  });
}
