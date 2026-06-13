import Link from "next/link";

export default function NotFound() {
  return <section className="not-found"><div><div className="section-kicker">Lost your way?</div><h1>This stay doesn&apos;t exist.</h1><p>Let&apos;s get you back somewhere beautiful.</p><Link href="/properties" className="button">Explore our homes</Link></div></section>;
}
