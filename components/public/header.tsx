"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

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

  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    const header = document.querySelector("header");
    header?.classList.toggle("menu-on", open);
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 1100px)");
    const close = () => {
      if (query.matches) setOpen(false);
    };
    query.addEventListener("change", close);
    return () => {
      query.removeEventListener("change", close);
      document.body.classList.remove("menu-open");
      document.querySelector("header")?.classList.remove("menu-on");
    };
  }, []);

  const close = () => setOpen(false);

  return (
    <>
    <header>
      <nav className="nav" aria-label="Navigation principale">
        <a className="logo" href="#accueil" onClick={close}>LD HOUSE<span>OF MAKE UP</span></a>
        <div className="nav-links">
          {links.map(([href, label]) => <a key={href} href={href}>{label}</a>)}
        </div>
        <div className="nav-cta">
          <Link href="/admin/login" className="nav-admin">Gestion</Link>
          <a href="#contact" className="btn btn-ghost">Réserver / Devis</a>
          <button
            className={`burger${open ? " open" : ""}`}
            aria-expanded={open}
            aria-controls="mobileMenu"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            onClick={() => setOpen((value) => !value)}
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>
    </header>
      <div className={`mobile-menu${open ? " open" : ""}`} id="mobileMenu" inert={open ? undefined : true}>
        <div>
          <p className="eyebrow">LD House of Make Up</p>
          {links.map(([href, label], index) => (
            <a key={href} href={href} style={{ animationDelay: `${80 + index * 45}ms` }} onClick={close}>{label}</a>
          ))}
          <Link href="/admin/login" style={{ animationDelay: "360ms" }} onClick={close}>Espace gestion</Link>
          <a className="btn btn-primary menu-cta" href="#contact" style={{ animationDelay: "410ms" }} onClick={close}>Réserver / Devis</a>
        </div>
      </div>
    </>
  );
}
