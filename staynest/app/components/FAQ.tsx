"use client";

import { useState } from "react";

const questions = [
  ["What time are check-in and check-out?", "Check-in begins at 4:00 PM and check-out is by 11:00 AM. When the calendar allows, our team is happy to help arrange additional time."],
  ["Can I change or cancel my reservation?", "Our flexible cancellation terms vary by home and season. The applicable policy is shown clearly before a reservation is confirmed."],
  ["Are your homes family and pet friendly?", "Families are warmly welcomed at every StayNest home. Select homes welcome pets; please review the individual property details or contact us."],
  ["How does the booking process work?", "This portfolio demo simulates a direct booking flow. In a live project, availability and checkout would connect securely to a Hostaway booking engine."]
];

export function FAQ() {
  const [open, setOpen] = useState(0);
  return <section className="section faq-section"><div className="shell faq-layout"><div><div className="section-kicker">Good to know</div><h2>Questions,<br />answered.</h2><p>Need a little more help? Our guest team is only a message away.</p></div><div className="faq-list">{questions.map(([q, a], index) => <button key={q} className="faq-item" onClick={() => setOpen(open === index ? -1 : index)}><span>{q}<b>{open === index ? "−" : "+"}</b></span>{open === index && <p>{a}</p>}</button>)}</div></div></section>;
}
