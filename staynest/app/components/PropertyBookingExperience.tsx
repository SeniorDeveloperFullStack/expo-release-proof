"use client";

import { useCallback, useEffect, useState } from "react";
import type { HostawayAvailabilityNight, HostawayListing } from "../data/hostaway";
import type { Property } from "../data/properties";
import { AvailabilitySection } from "./AvailabilitySection";
import { BookingCTA } from "./BookingCTA";
import { Icon } from "./icons";

type ListingsResponse = {
  count: number;
  listings: HostawayListing[];
};

type AvailabilityResponse = {
  listing: HostawayListing;
  availability: HostawayAvailabilityNight[];
};

type BookingData = {
  listing: HostawayListing;
  availability: HostawayAvailabilityNight[];
};

type LoadState = "loading" | "success" | "error";

async function readJson<T>(response: Response): Promise<T> {
  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload?.error?.message ?? "The mock Hostaway API request failed.");
  }

  return payload as T;
}

async function fetchJson<T>(url: string, signal: AbortSignal) {
  return readJson<T>(await fetch(url, { cache: "no-store", signal }));
}

export function PropertyBookingExperience({ property }: { property: Property }) {
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [status, setStatus] = useState<LoadState>("loading");
  const [error, setError] = useState("");
  const [requestKey, setRequestKey] = useState(0);

  const loadBookingData = useCallback(async () => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 10000);

    setStatus("loading");
    setError("");

    try {
      const [listingsData, availabilityData] = await Promise.all([
        fetchJson<ListingsResponse>("/api/hostaway/listings", controller.signal),
        fetchJson<AvailabilityResponse>(
          `/api/hostaway/availability?propertySlug=${encodeURIComponent(property.slug)}`,
          controller.signal,
        ),
      ]);
      const listing = listingsData.listings.find((item) => item.propertySlug === property.slug);

      if (listingsData.count !== 4 || !listing) {
        throw new Error("The mock Hostaway listings response did not include all 4 properties.");
      }

      setBookingData({
        listing: availabilityData.listing,
        availability: availabilityData.availability,
      });
      setStatus("success");
    } catch (requestError) {
      const isAbort = requestError instanceof DOMException && requestError.name === "AbortError";
      setBookingData(null);
      setError(isAbort ? "The mock Hostaway API took too long to respond." : requestError instanceof Error ? requestError.message : "Unable to load booking data.");
      setStatus("error");
    } finally {
      window.clearTimeout(timeout);
    }
  }, [property.slug]);

  useEffect(() => {
    void loadBookingData();
  }, [loadBookingData, requestKey]);

  return (
    <>
      <div className="property-main">
        <div className="stay-summary">
          <h2>{property.description}</h2>
          <div className="property-meta big">
            <span><Icon name="users" />{property.guests} guests</span>
            <span><Icon name="bed" />{property.bedrooms} bedrooms</span>
            <span><Icon name="bath" />{property.bathrooms} bathrooms</span>
          </div>
        </div>

        <div className="prose">
          <div className="section-kicker">About this home</div>
          <p>{property.longDescription}</p>
        </div>

        <HostawayDemoState
          status={status}
          property={property}
          bookingData={bookingData}
          error={error}
          onRetry={() => setRequestKey((key) => key + 1)}
        />

        {status === "success" && bookingData && (
          <AvailabilitySection listing={bookingData.listing} availability={bookingData.availability} />
        )}

        <div className="amenities">
          <div className="section-kicker">Everything you need</div>
          <h2>Amenities</h2>
          <div>
            {property.amenities.map((amenity) => (
              <span key={amenity}><Icon name="check" />{amenity}</span>
            ))}
          </div>
        </div>

        <div className="highlights">
          <div className="section-kicker">Why you&apos;ll love it</div>
          {property.highlights.map((item, index) => (
            <span key={item}><b>0{index + 1}</b>{item}</span>
          ))}
        </div>
      </div>

      <BookingSidebar
        status={status}
        property={property}
        bookingData={bookingData}
        error={error}
        onRetry={() => setRequestKey((key) => key + 1)}
      />
    </>
  );
}

function HostawayDemoState({
  status,
  property,
  bookingData,
  error,
  onRetry,
}: {
  status: LoadState;
  property: Property;
  bookingData: BookingData | null;
  error: string;
  onRetry: () => void;
}) {
  return (
    <div className="hostaway-demo" id="hostaway-demo">
      <span className="integration-icon"><Icon name={status === "error" ? "close" : "check"} /></span>
      <div className="integration-copy">
        <div className="section-kicker">Hostaway-style booking integration demo</div>
        <h2>{status === "success" ? "Mock availability loaded." : "Built for a seamless booking flow."}</h2>
        <p>
          This section calls the mock API using <strong>propertySlug={property.slug}</strong>. Real Hostaway credentials can
          later be connected securely on the server without exposing secrets in frontend code.
        </p>
      </div>

      {status === "loading" && <ApiState status="loading" />}
      {status === "error" && <ApiState status="error" error={error} onRetry={onRetry} />}
      {status === "success" && bookingData && (
        <>
          <div className="api-success" role="status"><Icon name="check" /> Booking data loaded successfully from the mock API.</div>
          <div className="integration-meta">
            <span><strong>Listing ID</strong>{bookingData.listing.id}</span>
            <span><strong>Property slug</strong>{bookingData.listing.propertySlug}</span>
            <span><strong>Mock status</strong>{bookingData.listing.channelStatus}</span>
          </div>
        </>
      )}
    </div>
  );
}

function BookingSidebar({
  status,
  property,
  bookingData,
  error,
  onRetry,
}: {
  status: LoadState;
  property: Property;
  bookingData: BookingData | null;
  error: string;
  onRetry: () => void;
}) {
  if (status === "success" && bookingData) {
    return (
      <BookingCTA
        property={property}
        listing={bookingData.listing}
        availability={bookingData.availability}
      />
    );
  }

  return (
    <div className={`api-state api-state-booking ${status === "error" ? "api-error" : "api-loading"}`}>
      {status === "loading" ? <span className="loading-spinner" /> : <span><Icon name="close" /></span>}
      <div>
        <strong>{status === "loading" ? "Loading booking data" : "Booking data could not load"}</strong>
        <p>{status === "loading" ? "Connecting to the mock Hostaway API..." : error}</p>
        {status === "error" && <button onClick={onRetry}>Try again</button>}
      </div>
    </div>
  );
}

function ApiState({
  status,
  error,
  onRetry,
}: {
  status: LoadState;
  error?: string;
  onRetry?: () => void;
}) {
  if (status === "error") {
    return (
      <div className="api-state api-error" role="alert">
        <span><Icon name="close" /></span>
        <div>
          <strong>Booking data could not load</strong>
          <p>{error}</p>
          {onRetry && <button onClick={onRetry}>Try again</button>}
        </div>
      </div>
    );
  }

  return (
    <div className="api-state api-loading" aria-live="polite">
      <span className="loading-spinner" />
      <div><strong>Loading booking data</strong><p>Connecting to the mock Hostaway API...</p></div>
    </div>
  );
}
