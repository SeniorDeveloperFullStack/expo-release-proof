import { notFound } from "next/navigation";
import { BookingCTA } from "../../components/BookingCTA";
import { Icon } from "../../components/icons";
import { PropertyGallery } from "../../components/PropertyGallery";
import { properties, getProperty } from "../../data/properties";

export function generateStaticParams() { return properties.map(({ slug }) => ({ slug })); }

export default async function PropertyDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const property = getProperty(slug);
  if (!property) notFound();
  return (
    <>
      <section className="property-detail-head"><div className="shell"><div><div className="section-kicker">{property.eyebrow}</div><h1>{property.name}</h1><p><Icon name="map" /> {property.location} <span>·</span> <Icon name="star" /> {property.rating} ({property.reviews} reviews)</p></div><a className="button button-outline" href="#book">Check availability</a></div></section>
      <div className="shell"><PropertyGallery images={property.images} name={property.name} /></div>
      <section className="section property-content"><div className="shell property-layout"><div className="property-main"><div className="stay-summary"><h2>{property.description}</h2><div className="property-meta big"><span><Icon name="users" />{property.guests} guests</span><span><Icon name="bed" />{property.bedrooms} bedrooms</span><span><Icon name="bath" />{property.bathrooms} bathrooms</span></div></div><div className="prose"><div className="section-kicker">About this home</div><p>{property.longDescription}</p></div><div className="amenities"><div className="section-kicker">Everything you need</div><h2>Amenities</h2><div>{property.amenities.map((amenity) => <span key={amenity}><Icon name="check" />{amenity}</span>)}</div></div><div className="highlights"><div className="section-kicker">Why you'll love it</div>{property.highlights.map((item, index) => <span key={item}><b>0{index + 1}</b>{item}</span>)}</div></div><BookingCTA property={property} /></div></section>
      <section className="map-section"><div className="shell"><div><div className="section-kicker">The neighborhood</div><h2>{property.location}</h2><p>Exact location details are shared after booking.</p></div><div className="map-placeholder"><span><Icon name="map" />{property.name}</span></div></div></section>
    </>
  );
}
