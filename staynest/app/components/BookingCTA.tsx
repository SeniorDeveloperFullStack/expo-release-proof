"use client";

import { useState } from "react";
import type { Property } from "../data/properties";
import { Icon } from "./icons";

export function BookingCTA({ property }: { property: Property }) {
  const [message, setMessage] = useState("");
  function simulate() {
    setMessage("Demo booking link opened — in production, this connects to the Hostaway booking engine.");
  }
  return (
    <aside className="booking-card" id="book">
      <div className="booking-price"><div><strong>${property.price}</strong> <span>/ night</span></div><span className="rating"><Icon name="star" className="h-4 w-4" /> {property.rating} · {property.reviews} reviews</span></div>
      <div className="date-grid"><label>Check-in<input type="date" /></label><label>Check-out<input type="date" /></label><label className="guest-field">Guests<select defaultValue="2"><option value="2">2 guests</option><option value="4">4 guests</option><option value={property.guests}>{property.guests} guests</option></select></label></div>
      <button className="button button-full" onClick={simulate}>Check availability <Icon name="arrow" /></button>
      <p className="booking-note">You won&apos;t be charged. Secure booking powered by Hostaway.</p>
      {message && <p className="booking-message">{message}</p>}
      <div className="booking-list"><span><Icon name="check" />Best rate guarantee</span><span><Icon name="check" />Instant confirmation</span><span><Icon name="check" />Flexible support</span></div>
    </aside>
  );
}
