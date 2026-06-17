import { notFound } from "next/navigation";
import { Icon } from "../../components/icons";
import { PropertyBookingExperience } from "../../components/PropertyBookingExperience";
import { PropertyGallery } from "../../components/PropertyGallery";
import { getProperty, properties } from "../../data/properties";

export function generateStaticParams() {
  return properties.map(({ slug }) => ({ slug }));
}

export default async function PropertyDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const property = getProperty(slug);
  if (!property) notFound();

  return (
    <>
      <section className="property-detail-head">
        <div className="shell">
          <div>
            <div className="section-kicker">{property.eyebrow}</div>
            <h1>{property.name}</h1>
            <p>
              <Icon name="map" /> {property.location} <span>|</span> <Icon name="star" /> {property.rating} ({property.reviews} reviews)
            </p>
          </div>
          <a className="button button-outline" href="#book">Check Availability on Hostaway</a>
        </div>
      </section>

      <div className="shell">
        <PropertyGallery images={property.images} name={property.name} />
      </div>

      <section className="section property-content">
        <div className="shell property-layout">
          <PropertyBookingExperience property={property} />
        </div>
      </section>

      <section className="map-section">
        <div className="shell">
          <div>
            <div className="section-kicker">The neighborhood</div>
            <h2>{property.location}</h2>
            <p>Exact location details are shared after booking.</p>
          </div>
          <div className="map-placeholder"><span><Icon name="map" />{property.name}</span></div>
        </div>
      </section>
    </>
  );
}
