import { useState, type FormEvent } from "react";
import { supabase } from "../../lib/supabase";
import styles from "./Contact.module.css";

type Status = "idle" | "sending" | "done" | "error";

const EMAIL_RE = /^\S+@\S+\.\S+$/;

export function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [company, setCompany] = useState(""); // honeypot — humans never see it
  const [status, setStatus] = useState<Status>("idle");

  const valid = name.trim().length > 0 && EMAIL_RE.test(email.trim()) && message.trim().length > 0;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (status === "sending") return;
    // bot filled the hidden field — pretend it worked, save nothing
    if (company.trim()) {
      setStatus("done");
      return;
    }
    if (!valid) return;

    setStatus("sending");
    const { error } = await supabase.from("messages").insert({
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
    });
    setStatus(error ? "error" : "done");
  }

  return (
    <section className={styles.section} id="contact">
      <div className={styles.inner}>
        <div className={styles.intro}>
          <span className={styles.eyebrow}>Pit lane · get in touch</span>
          <h2 className={styles.title}>
            Pull up and
            <br />
            say hello
          </h2>
          <p className={styles.lead}>
            Got a question about the build, a workshop tip, or want to follow the cart down the hill? Drop us a
            line and we'll get back to you.
          </p>
          <ul className={styles.points}>
            <li>
              <span aria-hidden="true" /> Sponsors &amp; collaborators welcome
            </li>
            <li>
              <span aria-hidden="true" /> Press &amp; event enquiries
            </li>
            <li>
              <span aria-hidden="true" /> Or just come cheer us on
            </li>
          </ul>
        </div>

        {status === "done" ? (
          <div className={`${styles.card} ${styles.doneCard}`} role="status">
            <span className={styles.doneMark} aria-hidden="true">
              ✓
            </span>
            <h3 className={styles.doneTitle}>Message away.</h3>
            <p className={styles.doneCopy}>Thanks for reaching out — we'll get back to you down the track.</p>
          </div>
        ) : (
          <form className={styles.card} onSubmit={onSubmit} noValidate>
            <div className={styles.field}>
              <label htmlFor="ct-name">Name</label>
              <input
                id="ct-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Who's reaching out?"
                maxLength={120}
                autoComplete="name"
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="ct-email">Email</label>
              <input
                id="ct-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                maxLength={200}
                autoComplete="email"
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="ct-message">Message</label>
              <textarea
                id="ct-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us what's on your mind…"
                rows={4}
                maxLength={4000}
                required
              />
            </div>

            {/* honeypot: visually hidden, off the tab order */}
            <div className={styles.hp} aria-hidden="true">
              <label htmlFor="ct-company">Company</label>
              <input
                id="ct-company"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>

            {status === "error" && (
              <p className={styles.error} role="alert">
                Something jammed on our end. Give it another go in a moment.
              </p>
            )}

            <button className={styles.send} type="submit" disabled={!valid || status === "sending"}>
              {status === "sending" ? "Sending…" : "Send it down the hill →"}
            </button>
            <p className={styles.fineprint}>We'll only use your email to reply. No lists, no noise.</p>
          </form>
        )}
      </div>
    </section>
  );
}
