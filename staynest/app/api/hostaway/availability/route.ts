import { NextRequest, NextResponse } from "next/server";
import {
  getHostawayListingById,
  getHostawayListingByPropertyId,
  getHostawayListingByPropertySlug,
  getMockAvailability,
} from "../../../data/hostaway";

export async function GET(request: NextRequest) {
  const listingIdParam = request.nextUrl.searchParams.get("listingId");
  const propertyIdParam = request.nextUrl.searchParams.get("propertyId");
  const propertySlugParam = request.nextUrl.searchParams.get("propertySlug");
  const identifiers = [listingIdParam, propertyIdParam, propertySlugParam].filter(Boolean);

  if (identifiers.length === 0) {
    return NextResponse.json(
      {
        error: {
          code: "MISSING_PROPERTY_ID",
          message: "Provide a propertyId, propertySlug, or listingId query parameter.",
        },
      },
      { status: 400 },
    );
  }

  if (identifiers.length > 1) {
    return NextResponse.json(
      {
        error: {
          code: "MULTIPLE_PROPERTY_IDS",
          message: "Provide only one query parameter: propertyId, propertySlug, or listingId.",
        },
      },
      { status: 400 },
    );
  }

  const numericListingId = listingIdParam ? Number(listingIdParam) : undefined;
  const listing = listingIdParam
    ? Number.isInteger(numericListingId) && numericListingId
      ? getHostawayListingById(numericListingId)
      : undefined
    : propertySlugParam
      ? getHostawayListingByPropertySlug(propertySlugParam)
      : getHostawayListingByPropertyId(propertyIdParam!);

  if (!listing) {
    return NextResponse.json(
      {
        error: {
          code: "PROPERTY_NOT_FOUND",
          message: `No mock Hostaway property was found for ${
            listingIdParam ? "listingId" : propertySlugParam ? "propertySlug" : "propertyId"
          } "${listingIdParam ?? propertySlugParam ?? propertyIdParam}".`,
        },
      },
      { status: 404 },
    );
  }

  // Production note: connect this server route to Hostaway availability/rates.
  // Keep HOSTAWAY_ACCOUNT_ID, HOSTAWAY_API_KEY, and live endpoint URLs in env vars
  // so no API keys or secrets are ever exposed in frontend JavaScript.
  return NextResponse.json({
    source: "mock-hostaway",
    listing,
    availability: getMockAvailability(listing.id),
  });
}
