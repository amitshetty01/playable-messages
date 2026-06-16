"use client";

import { useState } from "react";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const mailSubject = encodeURIComponent(`Craft Your Message: ${subject || "Contact form message"}`);
    const mailBody = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
    window.location.href = `mailto:hello@craftyourmessage.com?subject=${mailSubject}&body=${mailBody}`;
    setSent(true);
  }

  return (
    <form className="glass rounded-[2rem] p-5 sm:p-8" onSubmit={submit}>
      <p className="text-xs font-bold tracking-[0.08em] text-white/50">Get in touch</p>
      <h1 className="display-title mt-3 text-4xl font-bold leading-tight sm:text-6xl">Contact us</h1>
      <p className="mt-5 max-w-2xl text-white/70">Have a question, suggestion, or feedback? We would love to hear from you. Fill out the form below and we will get back to you.</p>
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <label className="grid gap-2"><span className="text-sm font-bold text-white/90">Your name</span><input className="input" value={name} onChange={(event) => setName(event.target.value)} required /></label>
        <label className="grid gap-2"><span className="text-sm font-bold text-white/90">Your email</span><input className="input" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
        <label className="grid gap-2 md:col-span-2"><span className="text-sm font-bold text-white/90">Subject</span><input className="input" value={subject} onChange={(event) => setSubject(event.target.value)} required /></label>
        <label className="grid gap-2 md:col-span-2"><span className="text-sm font-bold text-white/90">Message</span><textarea className="input min-h-40 py-3" value={message} onChange={(event) => setMessage(event.target.value)} required /></label>
      </div>
      <button className="premium-button mt-7" type="submit">Send message</button>
      {sent ? <p className="mt-4 text-sm font-bold text-white/60">Opening your email app with the message details.</p> : null}
    </form>
  );
}
