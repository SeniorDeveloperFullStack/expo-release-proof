import type { HostawayAvailabilityNight, HostawayListing } from "../data/hostaway";
import { Icon } from "./icons";

export function AvailabilitySection({
  listing,
  availability,
}: {
  listing: HostawayListing;
  availability: HostawayAvailabilityNight[];
}) {
  const availableCount = availability.filter((night) => night.isAvailable).length;

  return (
    <section className="availability-section">
      <div className="section-kicker">Live-ready calendar</div>
      <div className="availability-head">
        <div>
          <h2>Plan your stay</h2>
          <p>Preview nightly rates and availability. Choose your dates in the booking panel when you are ready.</p>
        </div>
        <span className="availability-pill">
          <Icon name="calendar" />
          {availableCount} nights available
        </span>
      </div>
      <div className="availability-grid">
        {availability.map((night) => {
          const date = new Date(`${night.date}T12:00:00`);

          return (
            <article className={night.isAvailable ? "night-card available" : "night-card blocked"} key={night.date}>
              <div className="night-date">
                <span>{date.toLocaleDateString("en-US", { weekday: "short" })}</span>
                <strong>{date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}</strong>
              </div>
              <span className="night-status">{night.isAvailable ? "Available" : "Booked"}</span>
              <p><strong>${night.nightlyRate}</strong> / night</p>
              <small>{night.minimumStay} night minimum</small>
            </article>
          );
        })}
      </div>
      <p className="availability-caption">
        Demo calendar for listing {listing.externalListingId}. Live dates would sync through the secure Hostaway API route.
      </p>
    </section>
  );
}
