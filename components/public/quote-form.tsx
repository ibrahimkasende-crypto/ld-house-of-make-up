"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { submitQuote } from "@/actions/public";

type Service = { id: string; title: string };

const STEPS = ["Prestation", "Moment", "Vous", "Envoi"];
const COUNTRIES = ["France", "RDC", "Autre"];

export function QuoteForm({ services, whatsapp }: { services: Service[]; whatsapp: string | null }) {
  const [state, action, pending] = useActionState(submitQuote, { ok: false, error: "", reference: "" });
  const [step, setStep] = useState(0);
  const [hint, setHint] = useState("");
  const [serviceId, setServiceId] = useState(services[0]?.id ?? "");
  const [country, setCountry] = useState("France");
  const [otherCountry, setOtherCountry] = useState("");
  const [summary, setSummary] = useState({ city: "", firstName: "", phone: "" });
  const draft = useRef("");
  const opened = useRef(false);

  const serviceTitle = services.find((service) => service.id === serviceId)?.title ?? "";

  useEffect(() => {
    if (!state.ok || !whatsapp || opened.current) return;
    opened.current = true;
    const text = `${draft.current}\nRéférence : ${state.reference}`.trim();
    window.location.assign(`${whatsapp}?text=${encodeURIComponent(text)}`);
  }, [state.ok, state.reference, whatsapp]);

  if (state.ok) {
    const href = whatsapp ? `${whatsapp}?text=${encodeURIComponent(`${draft.current}\nRéférence : ${state.reference}`.trim())}` : "";
    return (
      <div className="confirm" role="status">
        <p className="eyebrow">Demande prête</p>
        <h3 className="serif">On ouvre WhatsApp.</h3>
        <p>Votre message pour Laura est préparé{state.reference ? ` (${state.reference})` : ""}.</p>
        {href ? <a className="btn btn-primary" href={href}>Ouvrir WhatsApp</a> : <p>Le numéro WhatsApp n&apos;est pas disponible.</p>}
      </div>
    );
  }

  function next() {
    const form = document.getElementById("devis") as HTMLFormElement | null;
    const data = form ? new FormData(form) : new FormData();
    if (step === 0 && !serviceId) {
      setHint("Choisissez une prestation.");
      return;
    }
    if (step === 1 && !String(data.get("city") ?? "").trim()) {
      setHint("Indiquez la ville.");
      return;
    }
    if (step === 1 && country === "Autre" && !otherCountry.trim()) {
      setHint("Indiquez le pays.");
      return;
    }
    if (step === 2) {
      if (!String(data.get("firstName") ?? "").trim()) {
        setHint("Indiquez votre prénom.");
        return;
      }
      if (String(data.get("phone") ?? "").trim().length < 6) {
        setHint("Indiquez un téléphone joignable.");
        return;
      }
    }
    setSummary({
      city: String(data.get("city") ?? "").trim(),
      firstName: String(data.get("firstName") ?? "").trim(),
      phone: String(data.get("phone") ?? "").trim(),
    });
    setHint("");
    setStep((value) => Math.min(value + 1, STEPS.length - 1));
  }

  function remember() {
    const form = document.getElementById("devis") as HTMLFormElement | null;
    const data = form ? new FormData(form) : new FormData();
    const lines = [
      "Bonjour Laura, je souhaite un devis LD House of Make Up.",
      `Prénom : ${data.get("firstName") || ""}`,
      `Téléphone : ${data.get("phone") || ""}`,
      data.get("email") ? `E-mail : ${data.get("email")}` : "",
      `Prestation : ${serviceTitle}`,
      `Pays : ${data.get("country") || ""}`,
      `Ville : ${data.get("city") || ""}`,
      data.get("desiredDate") ? `Date : ${data.get("desiredDate")}` : "",
      data.get("location") ? `Lieu : ${data.get("location")}` : "",
      data.get("message") ? `\n${data.get("message")}` : "",
    ].filter(Boolean);
    draft.current = lines.join("\n");
  }

  return (
    <form className="wizard" id="devis" action={action} onSubmit={remember}>
      <div className="wizard-progress" aria-hidden="true">
        {STEPS.map((label, index) => <i key={label} className={index <= step ? "on" : ""} />)}
      </div>
      <p className="wizard-kicker">Étape {step + 1} sur {STEPS.length}</p>

      <fieldset hidden={step !== 0}>
        <legend>Quelle mise en beauté ?</legend>
        <div className="choices">
          {services.map((service) => (
            <button key={service.id} type="button" className={`choice${serviceId === service.id ? " on" : ""}`} onClick={() => setServiceId(service.id)}>
              {service.title}
            </button>
          ))}
        </div>
        <input type="hidden" name="serviceId" value={serviceId} />
      </fieldset>

      <fieldset hidden={step !== 1}>
        <legend>Où et quand ?</legend>
        <div className="choices countries">
          {COUNTRIES.map((item) => (
            <button key={item} type="button" className={`choice${country === item ? " on" : ""}`} onClick={() => setCountry(item)}>{item}</button>
          ))}
        </div>
        {country === "Autre" ? (
          <label className="wizard-field">Pays<input value={otherCountry} onChange={(event) => setOtherCountry(event.target.value)} autoComplete="country-name" /></label>
        ) : null}
        <input type="hidden" name="country" value={country === "Autre" ? otherCountry : country} />
        <label className="wizard-field">Ville<input name="city" autoComplete="address-level2" placeholder="Paris, Kinshasa…" /></label>
        <label className="wizard-field">Date souhaitée<input name="desiredDate" type="date" /></label>
        <label className="wizard-field">Lieu précis, si vous le savez<input name="location" placeholder="Domicile, hôtel, studio…" /></label>
      </fieldset>

      <fieldset hidden={step !== 2}>
        <legend>Comment vous joindre ?</legend>
        <label className="wizard-field">Prénom<input name="firstName" autoComplete="given-name" /></label>
        <label className="wizard-field">Téléphone ou WhatsApp<input name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="+33 ou +243" /></label>
        <label className="wizard-field">E-mail, si vous préférez<input name="email" type="email" inputMode="email" autoComplete="email" /></label>
        <input type="hidden" name="lastName" value="" />
        <input type="hidden" name="peopleCount" value="" />
        <input type="hidden" name="budget" value="" />
      </fieldset>

      <fieldset hidden={step !== 3}>
        <legend>Un mot pour Laura</legend>
        <div className="recap">
          <p><span>Prestation</span><strong>{serviceTitle || "À choisir"}</strong></p>
          <p><span>Lieu</span><strong>{summary.city || "Ville"} · {country === "Autre" ? otherCountry || "Pays" : country}</strong></p>
          <p><span>Contact</span><strong>{summary.firstName || "Prénom"}{summary.phone ? ` · ${summary.phone}` : ""}</strong></p>
        </div>
        <label className="wizard-field">Message, facultatif<textarea name="message" placeholder="L'occasion, l'heure, le nombre de personnes…" /></label>
      </fieldset>

      {hint || state.error ? <p className="form-error" role="alert">{hint || state.error}</p> : null}

      <div className="wizard-actions">
        {step > 0 ? <button className="btn btn-ghost" type="button" onClick={() => { setHint(""); setStep((value) => value - 1); }}>Retour</button> : null}
        {step < STEPS.length - 1 ? (
          <button className="btn btn-primary" type="button" onClick={next}>Continuer</button>
        ) : (
          <button className="btn btn-primary" type="submit" disabled={pending || !whatsapp}>{pending ? "Envoi…" : "Envoyer sur WhatsApp"}</button>
        )}
      </div>
    </form>
  );
}
