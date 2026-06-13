import Link from "next/link";
import { FAQ } from "./components/FAQ";
import { Icon } from "./components/icons";
import { PropertyCard } from "./components/PropertyCard";
import { Testimonials } from "./components/Testimonials";
import { properties } from "./data/properties";

export default function Home() {
  return (
    <>
      <section className="home-hero">
        <img src={properties[0].hero} alt="Casa Alba in Joshua Tree" />
        <div className="hero-shade" />
        <div className="shell hero-content"><p>Exceptional homes · Unforgettable places</p><h1>Stay somewhere<br /><em>remarkable.</em></h1><span>Curated vacation homes for quiet mornings, long dinners, and the moments you keep.</span><Link className="button button-light" href="/properties">Explore our homes <Icon name="arrow" /></Link></div>
        <div className="hero-location"><Icon name="map" /> <span><b>Featured stay</b>Casa Alba · Joshua Tree, CA</span></div>
      </section>

      <section className="section intro-section"><div className="shell intro-grid"><div><div className="section-kicker">The StayNest collection</div><h2>Beautiful places.<br /><em>Thoughtfully hosted.</em></h2></div><div><p>We believe the best stays do more than give you somewhere to sleep. They help you slow down, reconnect, and experience a place more deeply.</p><Link href="/about" className="text-link">Discover our approach <Icon name="arrow" /></Link></div></div></section>

      <section className="section featured-section"><div className="shell"><div className="section-heading"><div><div className="section-kicker">Find your place</div><h2>Our featured homes.</h2></div><Link href="/properties" className="text-link">View all homes <Icon name="arrow" /></Link></div><div className="property-grid">{properties.slice(0, 3).map((property) => <PropertyCard property={property} key={property.slug} />)}</div></div></section>

      <section className="split-story"><div className="split-image"><img src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1400&q=85" alt="Thoughtful home interior" /></div><div className="split-copy"><div className="section-kicker">The art of the stay</div><h2>More than a<br />beautiful address.</h2><p>Every StayNest home is chosen for its sense of place, then thoughtfully prepared for the way you want to spend your time.</p><div className="values-list"><span><b>01</b><strong>Distinctive design</strong>Homes with character, warmth, and a story of their own.</span><span><b>02</b><strong>Human hospitality</strong>Local insight and thoughtful support, whenever you need it.</span><span><b>03</b><strong>Effortless arrival</strong>Simple booking, clear details, and everything ready for you.</span></div><Link href="/about" className="button button-outline">Our story <Icon name="arrow" /></Link></div></section>
      <Testimonials />
      <FAQ />
      <section className="cta-banner"><img src={properties[3].hero} alt="Olive Cottage" /><div className="hero-shade" /><div><p>Where will you go next?</p><h2>Your remarkable stay<br />is waiting.</h2><Link href="/properties" className="button button-light">Explore all homes <Icon name="arrow" /></Link></div></section>
    </>
  );
}
