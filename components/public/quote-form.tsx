"use client";

import { useActionState } from "react";
import { submitQuote } from "@/actions/public";

type Service = { id: string; title: string };

export function QuoteForm({ services }: { services: Service[] }) {
  const [state, action, pending] = useActionState(submitQuote, { ok: false, error: "" });
  if (state.ok) {
    return (
      <div className="confirm" role="status">
        <h3 className="serif">Merci pour votre demande.</h3>
        <p>Laura ou son équipe reviendra vers vous rapidement.</p>
      </div>
    );
  }
  return (
    <form action={action} id="devis">
      <div className="form-grid">
        <div><label htmlFor="firstName">Prénom</label><input id="firstName" name="firstName" required autoComplete="given-name" /></div>
        <div><label htmlFor="lastName">Nom</label><input id="lastName" name="lastName" required autoComplete="family-name" /></div>
        <div><label htmlFor="email">E-mail</label><input id="email" name="email" type="email" required autoComplete="email" /></div>
        <div><label htmlFor="phone">Téléphone</label><input id="phone" name="phone" type="tel" required autoComplete="tel" /></div>
        <div><label htmlFor="country">Pays</label><input id="country" name="country" required autoComplete="country-name" /></div>
        <div><label htmlFor="city">Ville</label><input id="city" name="city" required autoComplete="address-level2" /></div>
        <div>
          <label htmlFor="serviceId">Type de prestation</label>
          <select id="serviceId" name="serviceId" required defaultValue="">
            <option value="" disabled>Choisir</option>
            {services.map((service) => <option key={service.id} value={service.id}>{service.title}</option>)}
          </select>
        </div>
        <div><label htmlFor="desiredDate">Date souhaitée</label><input id="desiredDate" name="desiredDate" type="date" /></div>
        <div><label htmlFor="location">Lieu</label><input id="location" name="location" /></div>
        <div><label htmlFor="peopleCount">Nombre de personnes</label><input id="peopleCount" name="peopleCount" inputMode="numeric" /></div>
        <div><label htmlFor="budget">Budget indicatif</label><input id="budget" name="budget" /></div>
        <div className="full"><label htmlFor="message">Message</label><textarea id="message" name="message" /></div>
      </div>
      <button className="btn btn-primary form-submit" type="submit" disabled={pending}>
        {pending ? "Envoi…" : "Envoyer ma demande"}
      </button>
      {state.error ? <p className="form-error" role="alert">{state.error}</p> : null}
    </form>
  );
}
