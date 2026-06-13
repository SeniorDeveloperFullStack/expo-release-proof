import { ContactForm } from "../components/ContactForm";
import { Icon } from "../components/icons";

export default function ContactPage() {
  return (
    <section className="contact-page"><div className="shell contact-layout"><div className="contact-copy"><div className="section-kicker">Get in touch</div><h1>Let&apos;s plan something<br /><em>remarkable.</em></h1><p>Questions about a home, a special stay, or simply where to begin? Our guest team would love to help.</p><div className="contact-details"><span><Icon name="mail" /><span><b>Email us</b>hello@staynest.com</span></span><span><Icon name="phone" /><span><b>Call us</b>+1 888 555 NEST</span></span><span><Icon name="map" /><span><b>Guest hours</b>Every day, 8am–8pm PT</span></span></div></div><div><div className="form-card"><h2>Send an inquiry</h2><p>Tell us what you have in mind. We&apos;ll be in touch within one business day.</p><ContactForm /></div></div></div></section>
  );
}
