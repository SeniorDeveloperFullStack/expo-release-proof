"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "./icons";

const links = [["Properties", "/properties"], ["About", "/about"], ["Contact", "/contact"]];

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="shell nav-wrap">
        <Link href="/" className="logo" onClick={() => setOpen(false)}>Stay<span>Nest</span></Link>
        <nav className={open ? "nav-links open" : "nav-links"}>
          {links.map(([label, href]) => <Link key={href} href={href} onClick={() => setOpen(false)}>{label}</Link>)}
          <Link href="/properties#stay" className="button button-small" onClick={() => setOpen(false)}>Find a stay</Link>
        </nav>
        <button className="menu-button" onClick={() => setOpen(!open)} aria-label="Toggle navigation">
          <Icon name={open ? "close" : "menu"} />
        </button>
      </div>
    </header>
  );
}
