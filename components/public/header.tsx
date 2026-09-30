"use client";

import { useState } from "react";

const links = [
  ["#accueil", "Accueil"],
  ["#prestations", "Prestations"],
  ["#portfolio", "Portfolio"],
  ["#ateliers", "Ateliers"],
  ["#apropos", "À propos"],
  ["#contact", "Contact"],
];

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header>
      <nav className="nav" aria-label="Navigation principale">
        <a className="logo" href="#accueil">LD HOUSE<span>OF MAKE UP</span></a>
        <div className="nav-links">
          {links.map(([href, label]) => <a key={href} href={href}>{label}</a>)}
        </div>
        <div className="nav-cta">
          <a href="#contact" className="btn btn-ghost">Réserver / Devis</a>
          <button className="burger" aria-expanded={open} aria-controls="mobileMenu" aria-label={open ? "Fermer le menu" : "Ouvrir le menu"} onClick={() => setOpen((value) => !value)}>
            <span /><span /><span />
          </button>
        </div>
      </nav>
      <div className={`mobile-menu${open ? " open" : ""}`} id="mobileMenu" inert={open ? undefined : true}>
        <div>
          {links.map(([href, label]) => (
            <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>
          ))}
        </div>
      </div>
    </header>
  );
}
