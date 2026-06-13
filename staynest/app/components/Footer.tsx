import Link from "next/link";

export function Footer() {
  return (
    <footer className="footer">
      <div className="shell footer-grid">
        <div>
          <Link href="/" className="logo logo-light">Stay<span>Nest</span></Link>
          <p>Remarkable homes in remarkable places.<br />Thoughtfully hosted, beautifully remembered.</p>
        </div>
        <div><h4>Explore</h4><Link href="/properties">Our homes</Link><Link href="/about">Our story</Link><Link href="/contact">Contact</Link></div>
        <div><h4>Destinations</h4><span>California</span><span>Oregon Coast</span><span>Montana</span></div>
        <div><h4>Stay in the know</h4><p>Seasonal escapes and first looks, sent occasionally.</p><div className="newsletter"><input aria-label="Email address" placeholder="Your email address" /><button aria-label="Subscribe">→</button></div></div>
      </div>
      <div className="shell footer-bottom"><span>© 2026 StayNest. Portfolio demonstration.</span><span>Privacy · Terms · Guest policy</span></div>
    </footer>
  );
}
