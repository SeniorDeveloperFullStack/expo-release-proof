import { NextResponse } from "next/server";
import { hostawayListings } from "../../../data/hostaway";

export async function GET() {
  // Real Hostaway integration belongs on the server, never in client components.
  // Later, exchange this mock response for a fetch to Hostaway's listings endpoint
  // with API credentials read from environment variables, not committed source code.
  return NextResponse.json({
    source: "mock-hostaway",
    count: hostawayListings.length,
    listings: hostawayListings,
  });
}
