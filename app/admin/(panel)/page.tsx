import Link from "next/link";
import { Icon, type IconName } from "@/components/admin/icons";
import { STATUS_LABELS, type RequestStatus } from "@/lib/db/schema";
import { dashboardStats } from "@/lib/queries";
import { formatDate, formatMoney } from "@/lib/utils";

export const dynamic = "force-dynamic";

const shortcuts: { href: string; icon: IconName; title: string; text: string }[] = [
  { href: "/admin/requests", icon: "requests", title: "Demandes", text: "Devis, statuts, rendez-vous" },
  { href: "/admin/clients", icon: "clients", title: "Clients", text: "Fiches et historique" },
  { href: "/admin/services", icon: "services", title: "Prestations", text: "Offre et tarifs" },
  { href: "/admin/portfolio", icon: "portfolio", title: "Portfolio", text: "Réalisations" },
  { href: "/admin/workshops", icon: "workshops", title: "Ateliers", text: "Formats publiés" },
  { href: "/admin/messages", icon: "messages", title: "Messages", text: "Courrier enregistré" },
];

export default async function DashboardPage() {
  const stats = await dashboardStats();
  const max = Math.max(1, ...stats.monthCounts.map((item) => item.count));
  const topMax = Math.max(1, ...stats.topServices.map(([, count]) => count));
  const todayLabel = new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
  const hour = Number(new Intl.DateTimeFormat("fr-FR", { hour: "numeric", hourCycle: "h23", timeZone: "Europe/Paris" }).format(new Date()));
  const hello = hour < 18 ? "Bonjour" : "Bonsoir";
  const cards: { icon: IconName; value: string; label: string; tone: string; hint: string }[] = [
    { icon: "calendar", value: String(stats.today), label: "Aujourd'hui", tone: "gold", hint: "Nouvelles demandes" },
    { icon: "clock", value: String(stats.pending), label: "À traiter", tone: "ink", hint: "Nouvelles et en étude" },
    { icon: "check", value: String(stats.confirmed), label: "Confirmées", tone: "sage", hint: "Prestations tenues" },
    { icon: "clients", value: String(stats.clients), label: "Clients", tone: "blush", hint: "Fiches au carnet" },
  ];

  return (
    <div className="dash">
      <section className="dash-hero">
        <div>
          <p className="eyebrow">{hello}</p>
          <h1>Votre maison, en un regard.</h1>
          <p>{todayLabel.trim()}. Les chiffres viennent uniquement des demandes enregistrées.</p>
        </div>
        <Link className="dash-focus" href="/admin/requests">
          <b>{stats.pending}</b>
          <span>{stats.pending > 1 ? "demandes à traiter" : stats.pending === 1 ? "demande à traiter" : "rien en attente"}</span>
        </Link>
      </section>

      <div className="dash-kpis">
        {cards.map((card) => (
          <article className={`dash-kpi tone-${card.tone}`} key={card.label}>
            <span className="dash-kpi-icon">
              <Icon name={card.icon} size={18} />
            </span>
            <b>{card.value}</b>
            <strong>{card.label}</strong>
            <span>{card.hint}</span>
          </article>
        ))}
      </div>

      <div className="dash-pulse">
        <article>
          <Icon name="calendar" size={16} />
          <b>{stats.upcoming}</b>
          <span>Rendez-vous à venir</span>
        </article>
        <article>
          <Icon name="requests" size={16} />
          <b>{stats.total}</b>
          <span>Demandes au total</span>
        </article>
        <article>
          <Icon name="coins" size={16} />
          <b>{stats.revenueCents == null ? "—" : formatMoney(stats.revenueCents)}</b>
          <span>Devis acceptés</span>
        </article>
      </div>

      <div className="dash-layout">
        <section className="dash-panel dash-chart">
          <div className="dash-panel-head">
            <h2 className="serif">
              <Icon name="calendar" size={18} />
              Six derniers mois
            </h2>
            <span>{stats.total} demande{stats.total > 1 || stats.total === 0 ? "s" : ""}</span>
          </div>
          <div className="dash-bars" aria-label="Demandes par mois">
            {stats.monthCounts.map((item) => (
              <div key={item.month}>
                <span>{item.count}</span>
                <div className="dash-track">
                  <i style={{ height: `${Math.max(item.count === 0 ? 0 : 12, (item.count / max) * 100)}%` }} />
                </div>
                <small>{new Date(`${item.month}-01T12:00:00`).toLocaleDateString("fr-FR", { month: "short" })}</small>
              </div>
            ))}
          </div>
        </section>

        <section className="dash-panel">
          <div className="dash-panel-head">
            <h2 className="serif">
              <Icon name="services" size={18} />
              La maison
            </h2>
          </div>
          <div className="dash-maison">
            <Link href="/admin/services">
              <b>{stats.catalog.services}</b>
              <span>Prestations visibles</span>
            </Link>
            <Link href="/admin/workshops">
              <b>{stats.catalog.workshops}</b>
              <span>Ateliers publiés</span>
            </Link>
            <Link href="/admin/portfolio">
              <b>{stats.catalog.portfolio}</b>
              <span>Photos au portfolio</span>
            </Link>
          </div>
          <h3>Les plus demandées</h3>
          {stats.topServices.length === 0 ? (
            <p className="dash-quiet">Dès la première demande, le classement apparaîtra ici.</p>
          ) : (
            <ul className="rank-list">
              {stats.topServices.map(([label, count]) => (
                <li key={label}>
                  <div>
                    <strong>{label}</strong>
                    <span>{count}</span>
                  </div>
                  <i style={{ width: `${(count / topMax) * 100}%` }} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <div className="dash-layout">
        <section className="dash-panel">
          <div className="dash-panel-head">
            <h2 className="serif">
              <Icon name="requests" size={18} />
              Dernières demandes
            </h2>
            <Link href="/admin/requests">Tout voir</Link>
          </div>
          {stats.recent.length === 0 ? (
            <div className="dash-empty">
              <span className="dash-kpi-icon">
                <Icon name="requests" size={18} />
              </span>
              <strong>Le carnet est encore vide</strong>
              <p>Chaque devis envoyé depuis le site arrive ici, prêt à être suivi.</p>
            </div>
          ) : (
            <ul className="dash-recent">
              {stats.recent.map((item) => (
                <li key={item.id}>
                  <Link href={`/admin/requests/${item.id}`}>
                    <span>
                      <strong>{item.name}</strong>
                      <small>{item.serviceLabel} · {formatDate(item.createdAt)}</small>
                    </span>
                    <em className={`badge status-${item.status}`}>{STATUS_LABELS[item.status as RequestStatus] ?? item.status}</em>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="dash-panel">
          <div className="dash-panel-head">
            <h2 className="serif">Accès rapides</h2>
          </div>
          <div className="dash-links">
            {shortcuts.map((item) => (
              <Link className="dash-link" key={item.href} href={item.href}>
                <span className="dash-kpi-icon">
                  <Icon name={item.icon} size={16} />
                </span>
                <span>
                  <strong>{item.title}</strong>
                  <small>{item.text}</small>
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
