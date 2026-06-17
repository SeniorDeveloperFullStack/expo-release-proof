import { properties } from "./properties";

export type HostawayListing = {
  id: number;
  propertySlug: string;
  externalListingId: string;
  name: string;
  city: string;
  state: string;
  country: string;
  basePrice: number;
  currency: "USD";
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  bookingUrl: string;
  channelStatus: "listed" | "draft";
  syncedAt: string;
};

export type HostawayAvailabilityNight = {
  listingId: number;
  date: string;
  isAvailable: boolean;
  minimumStay: number;
  nightlyRate: number;
  currency: "USD";
};

// Portfolio-safe mock data shaped like a Hostaway listings response.
// In production this file would be replaced by server-side calls to Hostaway,
// using credentials stored only in environment variables such as HOSTAWAY_API_KEY.
export const hostawayListings: HostawayListing[] = properties.map((property, index) => {
  const [city, state] = property.location.split(", ");

  return {
    id: 730100 + index,
    propertySlug: property.slug,
    externalListingId: `staynest-${property.slug}`,
    name: property.name,
    city,
    state,
    country: "United States",
    basePrice: property.price,
    currency: "USD",
    maxGuests: property.guests,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    bookingUrl: `https://booking.hostaway-demo.example/listings/staynest-${property.slug}`,
    channelStatus: "listed",
    syncedAt: "2026-06-13T08:00:00.000Z",
  };
});

const availabilitySeed: Record<string, Array<Omit<HostawayAvailabilityNight, "listingId">>> = {
  "casa-alba": [
    { date: "2026-07-12", isAvailable: true, minimumStay: 2, nightlyRate: 425, currency: "USD" },
    { date: "2026-07-13", isAvailable: true, minimumStay: 2, nightlyRate: 425, currency: "USD" },
    { date: "2026-07-14", isAvailable: false, minimumStay: 2, nightlyRate: 455, currency: "USD" },
    { date: "2026-07-15", isAvailable: true, minimumStay: 3, nightlyRate: 455, currency: "USD" },
  ],
  "tide-house": [
    { date: "2026-07-12", isAvailable: false, minimumStay: 3, nightlyRate: 610, currency: "USD" },
    { date: "2026-07-13", isAvailable: true, minimumStay: 3, nightlyRate: 650, currency: "USD" },
    { date: "2026-07-14", isAvailable: true, minimumStay: 3, nightlyRate: 650, currency: "USD" },
    { date: "2026-07-15", isAvailable: true, minimumStay: 2, nightlyRate: 625, currency: "USD" },
  ],
  "pine-and-peak": [
    { date: "2026-07-12", isAvailable: true, minimumStay: 4, nightlyRate: 780, currency: "USD" },
    { date: "2026-07-13", isAvailable: true, minimumStay: 4, nightlyRate: 780, currency: "USD" },
    { date: "2026-07-14", isAvailable: true, minimumStay: 4, nightlyRate: 810, currency: "USD" },
    { date: "2026-07-15", isAvailable: false, minimumStay: 4, nightlyRate: 810, currency: "USD" },
  ],
  "olive-cottage": [
    { date: "2026-07-12", isAvailable: true, minimumStay: 2, nightlyRate: 495, currency: "USD" },
    { date: "2026-07-13", isAvailable: false, minimumStay: 2, nightlyRate: 495, currency: "USD" },
    { date: "2026-07-14", isAvailable: true, minimumStay: 2, nightlyRate: 525, currency: "USD" },
    { date: "2026-07-15", isAvailable: true, minimumStay: 2, nightlyRate: 525, currency: "USD" },
  ],
};

export function getHostawayListingBySlug(slug: string) {
  return hostawayListings.find((listing) => listing.propertySlug === slug);
}

export function getHostawayListingById(listingId: number) {
  return hostawayListings.find((listing) => listing.id === listingId);
}

export function getHostawayListingByPropertyId(propertyId: string) {
  const numericPropertyId = Number(propertyId);

  return hostawayListings.find(
    (listing) =>
      listing.propertySlug === propertyId ||
      listing.externalListingId === propertyId ||
      (Number.isInteger(numericPropertyId) && listing.id === numericPropertyId),
  );
}

export function getHostawayListingByPropertySlug(propertySlug: string) {
  return hostawayListings.find((listing) => listing.propertySlug === propertySlug);
}

export function getMockAvailability(listingId: number) {
  const listing = getHostawayListingById(listingId);
  if (!listing) return [];

  return (availabilitySeed[listing.propertySlug] ?? []).map((night) => ({
    listingId: listing.id,
    ...night,
  }));
}
