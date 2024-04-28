import { fetchMetadata } from "frames.js/next";
import type { Metadata } from "next";
import { appURL } from "./utils";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Download Replies Addresses",
    description:
      "Parse and download all the addresses in replies of cast as CSV",
    other: {
      ...(await fetchMetadata(new URL("/frames", appURL()))),
    },
  };
}

export default async function Home() {
  return (
    <div>
      Download Replies Addresses - Parse and download all the addresses in
      replies of cast as CSV
    </div>
  );
}
