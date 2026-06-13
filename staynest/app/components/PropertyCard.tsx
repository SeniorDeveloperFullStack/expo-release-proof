import Link from "next/link";
import type { Property } from "../data/properties";
import { Icon } from "./icons";

export function PropertyCard({ property }: { property: Property }) {
  return (
    <Link href={`/properties/${property.slug}`} className="property-card">
      <div className="property-image"><img src={property.hero} alt={property.name} /><span>{property.eyebrow}</span></div>
      <div className="property-card-body">
        <div className="property-title-row"><div><p>{property.location}</p><h3>{property.name}</h3></div><div className="rating"><Icon name="star" className="h-4 w-4" /> {property.rating}</div></div>
        <div className="property-meta"><span><Icon name="users" />{property.guests} guests</span><span><Icon name="bed" />{property.bedrooms} beds</span><span><Icon name="bath" />{property.bathrooms} baths</span></div>
        <div className="property-price"><strong>${property.price}</strong> / night <span>View home <Icon name="arrow" /></span></div>
      </div>
    </Link>
  );
}
