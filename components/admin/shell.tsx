"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { logoutAction } from "@/actions/admin";
import { Icon, type IconName } from "./icons";

const groups: { label: string; items: { href: string; label: string; icon: IconName }[] }[] = [
  { label: "Pilotage", items: [{ href: "/admin", label: "Tableau de bord", icon: "dashboard" }] },
  {
    label: "Activité",
    items: [
      { href: "/admin/requests", label: "Demandes", icon: "requests" },
      { href: "/admin/clients", label: "Clients", icon: "clients" },
      { href: "/admin/messages", label: "Messages", icon: "messages" },
    ],
  },
  {
    label: "Offre",
    items: [
      { href: "/admin/services", label: "Prestations", icon: "services" },
      { href: "/admin/portfolio", label: "Portfolio", icon: "portfolio" },
      { href: "/admin/workshops", label: "Ateliers", icon: "workshops" },
      { href: "/admin/instagram", label: "Instagram", icon: "instagram" },
    ],
  },
  { label: "Maison", items: [{ href: "/admin/settings", label: "Paramètres", icon: "settings" }] },
];

export function AdminShell({ email, children }: { email: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const initial = email.slice(0, 1).toUpperCase();

  return (
    <div className="admin">
      {open ? <button className="side-backdrop" type="button" aria-label="Fermer le menu" onClick={() => setOpen(false)} /> : null}
      <aside className={`side${open ? " open" : ""}`}>
        <div className="side-brand">
          <span className="brand-mark">
            <Icon name="mark" size={16} />
          </span>
          <a className="logo" href="/admin">
            LD HOUSE<span>GESTION</span>
          </a>
        </div>
        <nav>
          {groups.map((group) => (
            <div className="nav-group" key={group.label}>
              <p>{group.label}</p>
              {group.items.map((item) => {
                const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
                return (
                  <Link key={item.href} href={item.href} className={active ? "active" : ""} onClick={() => setOpen(false)}>
                    <span className="nav-ico">
                      <Icon name={item.icon} size={16} />
                    </span>
                    {item.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
        <a className="side-site" href="/" target="_blank" rel="noreferrer">
          <Icon name="external" size={15} />
          Voir le site
        </a>
        <form action={logoutAction}>
          <div className="side-user">
            <span className="avatar">{initial}</span>
            <div>
              <strong>Compte admin</strong>
              <span>{email}</span>
            </div>
          </div>
          <button className="btn btn-ghost light" type="submit">
            <Icon name="logout" size={15} />
            Se déconnecter
          </button>
        </form>
      </aside>
      <div className="admin-main">
        <div className="admin-top">
          <button className="btn btn-ghost menu-toggle" type="button" onClick={() => setOpen((value) => !value)}>
            <Icon name="menu" size={16} />
            Menu
          </button>
          <p>LD House of Make Up</p>
        </div>
        <div className="admin-content">{children}</div>
      </div>
    </div>
  );
}
