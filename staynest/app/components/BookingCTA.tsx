"use client";

import { useMemo, useState } from "react";
import type { HostawayAvailabilityNight, HostawayListing } from "../data/hostaway";
import type { Property } from "../data/properties";
import { Icon } from "./icons";

export function BookingCTA({
  property,
  listing,
  availability,
}: {
  property: Property;
  listing: HostawayListing;
  availability: HostawayAvailabilityNight[];
}) {
  const [message, setMessage] = useState("");
  const availableNights = useMemo(() => availability.filter((night) => night.isAvailable), [availability]);
  const nextDates = availableNights.slice(0, 3);
  const nextPrice = nextDates[0]?.nightlyRate ?? listing.basePrice;

  function simulate() {
    setMessage(listing.bookingUrl);
  }

  return (
    <aside className="booking-card" id="book">
      <div className="booking-eyebrow">Mock Hostaway booking</div>
      <div className="booking-price">
        <div><strong>${nextPrice}</strong> <span>/ night</span></div>
        <span className="rating"><Icon name="star" className="h-4 w-4" /> {property.rating} <span className="booking-dot">|</span> {property.reviews} reviews</span>
      </div>

      <div className="booking-status-row">
        <span className="booking-status available">Booking status: {listing.channelStatus}</span>
        <span>{availableNights.length} dates open</span>
      </div>

      <div className="next-dates">
        <strong>Next available dates</strong>
        {nextDates.length > 0 ? (
          nextDates.map((night) => {
            const date = new Date(`${night.date}T12:00:00`);
            return (
              <span key={night.date}>
                {date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                <b>${night.nightlyRate}</b>
              </span>
            );
          })
        ) : (
          <span>No sample dates available<b>Check later</b></span>
        )}
      </div>

      <div className="date-grid">
        <label>Check-in<input type="date" /></label>
        <label>Check-out<input type="date" /></label>
        <label className="guest-field">Guests<select defaultValue="2"><option value="2">2 guests</option><option value="4">4 guests</option><option value={property.guests}>{property.guests} guests</option></select></label>
      </div>
      <button className="button button-full" onClick={simulate}>Check Availability on Hostaway <Icon name="arrow" /></button>
      <p className="booking-note">No payment required. This is a safe mock booking demo.</p>
      {message && <p className="booking-message"><Icon name="check" /> Mock Hostaway redirect ready: {message}</p>}
      <div className="booking-list">
        <span><Icon name="check" />Loaded from `/api/hostaway/availability`</span>
        <span><Icon name="check" />No real API keys exposed</span>
        <span><Icon name="check" />Portfolio-safe integration flow</span>
      </div>
    </aside>
  );
}
