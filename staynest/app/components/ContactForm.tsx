"use client";

import { FormEvent, useState } from "react";

export function ContactForm() {
  const [sent, setSent] = useState(false);
  function submit(event: FormEvent) { event.preventDefault(); setSent(true); }
  return (
    <form className="contact-form" onSubmit={submit}>
      <div className="form-row"><label>First name<input required placeholder="Jane" /></label><label>Last name<input required placeholder="Smith" /></label></div>
      <label>Email address<input type="email" required placeholder="jane@example.com" /></label>
      <div className="form-row"><label>Interested in<select><option>General inquiry</option><option>Casa Alba</option><option>Tide House</option><option>Pine & Peak</option><option>Olive Cottage</option></select></label><label>Travel dates<input type="text" placeholder="Flexible" /></label></div>
      <label>How can we help?<textarea rows={5} placeholder="Tell us a little about your ideal stay..." /></label>
      <button className="button button-full">Send inquiry</button>
      {sent && <p className="success-message">Thanks for reaching out. This demo form is ready to connect to your preferred inbox or CRM.</p>}
    </form>
  );
}
