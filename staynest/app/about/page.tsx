import Link from "next/link";
import { Icon } from "../components/icons";
import { Testimonials } from "../components/Testimonials";

export default function AboutPage() {
  return (
    <>
      <section className="about-hero"><img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=85" alt="StayNest interior" /><div className="hero-shade" /><div><div className="section-kicker light">Our story</div><h1>We collect homes<br />with a <em>sense of place.</em></h1></div></section>
      <section className="section"><div className="shell intro-grid about-intro"><div><div className="section-kicker">Why StayNest</div><h2>Travel should leave<br />a lasting impression.</h2></div><div><p>StayNest began with a simple idea: the place you stay should be as memorable as the place you visit.</p><p>We seek out singular homes, partner with thoughtful local hosts, and shape every detail around a more meaningful kind of travel. The result is a small collection where each stay feels personal, grounded, and entirely its own.</p></div></div></section>
      <section className="about-image-grid"><img src="https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=85" alt="Warm interior" /><img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85" alt="Designed living space" /></section>
      <section className="section principles"><div className="shell"><div className="section-kicker">Our principles</div><h2>What makes a StayNest.</h2><div className="principle-grid"><article><b>01</b><h3>Design with soul</h3><p>We choose homes that feel considered, expressive, and deeply connected to their surroundings.</p></article><article><b>02</b><h3>Hospitality with heart</h3><p>Warm, intuitive service from people who know the home and the place around it.</p></article><article><b>03</b><h3>Quality you can feel</h3><p>From crisp linens to a well-stocked kitchen, the small details make a meaningful difference.</p></article></div></div></section>
      <Testimonials />
      <section className="simple-cta"><div><div className="section-kicker">Come stay awhile</div><h2>Find the home that<br />speaks to you.</h2></div><Link href="/properties" className="button">Explore our homes <Icon name="arrow" /></Link></section>
    </>
  );
}
