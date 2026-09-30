import { Header } from "@/components/public/header";
import { ScrollEffects } from "@/components/public/effects";
import { PortfolioGrid } from "@/components/public/portfolio-grid";
import { QuoteForm } from "@/components/public/quote-form";
import { CoverImage } from "@/components/public/cover-image";
import { LoopVideo } from "@/components/public/loop-video";
import { getPublishedInstagram, getPublishedPortfolio, getPublishedWorkshops, getActiveServices } from "@/lib/queries";
import { getInstagramUrl, getWhatsappLink } from "@/lib/settings";
import { formatMoney, siteUrl } from "@/lib/utils";
import { WORKSHOP_KINDS } from "@/lib/db/schema";
import { demoInstagram, demoPortfolio, demoServices } from "@/lib/demo-media";

export const dynamic = "force-dynamic";

function kindLabel(kind: string) {
  return WORKSHOP_KINDS.find((item) => item.id === kind)?.label ?? kind;
}

export default async function HomePage() {
  const [services, portfolio, workshops, posts, whatsapp, instagram] = await Promise.all([
    getActiveServices(),
    getPublishedPortfolio(),
    getPublishedWorkshops(),
    getPublishedInstagram(),
    getWhatsappLink(),
    getInstagramUrl(),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "LD House of Make Up",
    description: "Maquillage professionnel entre la RDC et la France.",
    url: await siteUrl(),
    founder: { "@type": "Person", name: "Laura Dineka" },
    areaServed: ["France", "République démocratique du Congo"],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <a className="skip" href="#contenu">Aller au contenu</a>
      <ScrollEffects />
      <Header />
      <main id="contenu">
        <div className="hero-stage">
          <section className="hero" id="accueil">
            <div className="wrap hero-grid">
              <div id="heroContent">
                <div className="hero-tag"><span className="dot" />RDC · FRANCE</div>
                <h1>Votre beauté.<br /><em>Votre signature.</em></h1>
                <p className="sub">Maquillage professionnel, expériences beauté et ateliers entre la RDC et la France.</p>
                <div className="hero-ctas">
                  <a href="#contact" className="btn btn-primary">Demander un devis</a>
                  <a href="#prestations" className="btn btn-ghost">Découvrir les prestations</a>
                </div>
              </div>
              <div className="plate hero-plate">
                <CoverImage src="/images/hero/hero-portrait.jpg" alt="Visuel de démonstration : portrait beauté" width={800} height={1000} />
                <LoopVideo src="/videos/demo-maquillage.mp4" poster="/images/hero/hero-portrait.jpg" />
              </div>
            </div>
          </section>
        </div>

        <section className="intro-band">
          <div className="wrap intro reveal">
            <h2>Plus qu&apos;un maquillage, une expérience.</h2>
            <div>
              <p>LD House of Make Up accompagne chaque projet avec une approche personnalisée, pensée pour révéler la personnalité, le style et l&apos;occasion.</p>
              <div className="signature">Laura Dineka<small>MAKE UP ARTIST</small></div>
            </div>
          </div>
        </section>

        <section id="prestations">
          <div className="wrap">
            <div className="section-head reveal">
              <div>
                <div className="eyebrow">Prestations</div>
                <h2>Des catégories pensées pour chaque projet</h2>
              </div>
            </div>
            <div className="cards">
              {services.map((service) => (
                <article className="card reveal" key={service.id}>
                  <div className="frame plate">
                    <CoverImage src={service.imagePath || demoServices[service.slug] || demoServices.maquillage} alt={service.title} width={800} height={640} loading="lazy" />
                  </div>
                  <div className="card-body">
                    <h3>{service.title}</h3>
                    <p>{service.description}</p>
                    <div className="meta">
                      <span>{service.pricePublic ? formatMoney(service.priceCents) : "Tarif sur demande"}</span>
                      <span>{service.availability}</span>
                    </div>
                    <a href="#contact">Demander cette prestation</a>
                  </div>
                </article>
              ))}
            </div>
            <p className="note">La liste définitive des prestations reste à confirmer avec Laura. Aucun tarif public n&apos;est affiché tant qu&apos;il n&apos;a pas été saisi.</p>
          </div>
        </section>

        <section className="portfolio" id="portfolio">
          <div className="wrap">
            <div className="section-head reveal">
              <div>
                <div className="eyebrow">Portfolio</div>
                <h2>Un aperçu de l&apos;univers LD House of Make Up</h2>
              </div>
            </div>
            <PortfolioGrid items={(portfolio.length ? portfolio : demoPortfolio).map((item) => ({ ...item, category: item.category }))} />
            <p className="note" style={{ color: "rgba(246,241,233,.72)" }}>
              {portfolio.length === 0
                ? "Sélection de démonstration, photos libres de droits. Les vraies réalisations remplaceront ces visuels."
                : `${portfolio.length} réalisation${portfolio.length > 1 ? "s" : ""} publiée${portfolio.length > 1 ? "s" : ""}.`}
            </p>
          </div>
        </section>

        <section>
          <div className="wrap story">
            <div className="frame plate reveal reveal-media">
              <CoverImage src="/images/services/service-shooting.jpg" alt="Visuel de démonstration : séance maquillage" width={800} height={1000} loading="lazy" />
            </div>
            <div className="reveal">
              <div className="eyebrow">Approche</div>
              <h2>Chaque visage raconte quelque chose.</h2>
              <p>Une approche personnalisée qui s&apos;adapte au visage, à la personnalité et à l&apos;occasion, pour révéler une beauté qui reste identifiable.</p>
              <a href="#contact" className="btn btn-ghost">Parler de mon projet</a>
            </div>
          </div>
        </section>

        <section className="ateliers" id="ateliers">
          <div className="wrap at-grid">
            <div className="reveal">
              <div className="eyebrow">Ateliers beauté</div>
              <h2>Apprendre, expérimenter, révéler.</h2>
              <div className="at-list">
                {workshops.map((workshop) => (
                  <article key={workshop.id}>
                    <strong>{workshop.title}</strong>
                    <span>
                      {kindLabel(workshop.kind)}
                      {workshop.eventDate ? ` · ${workshop.eventDate}` : ""}
                      {workshop.location ? ` · ${workshop.location}` : ""}
                      {" · "}
                      {workshop.pricePublic ? formatMoney(workshop.priceCents) : "Tarif sur demande"}
                    </span>
                  </article>
                ))}
              </div>
              <a href="#contact" className="btn btn-primary">Organiser un atelier</a>
            </div>
            <div className="frame plate reveal reveal-media">
              <CoverImage src="/images/workshops/workshop-01.jpg" alt="Visuel de démonstration : préparation maquillage" width={800} height={1000} loading="lazy" />
              <LoopVideo src="/videos/demo-salon.mp4" poster="/images/workshops/workshop-01.jpg" />
            </div>
          </div>
        </section>

        <section className="fxr">
          <div className="wrap reveal">
            <div className="eyebrow">Positionnement</div>
            <h2>Entre la France et la RDC.</h2>
            <p>Une présence qui relie deux univers autour d&apos;une même passion pour la beauté. Les villes d&apos;exercice restent à confirmer.</p>
            <div className="flags" role="img" aria-label="Drapeaux de la RDC et de la France, réunis">
              <div className="flag-plate flag-rdc">
                <img src="/images/flags/rdc.svg" alt="" />
                <span>RDC</span>
              </div>
              <div className="flag-plate flag-fr">
                <img src="/images/flags/france.svg" alt="" />
                <span>France</span>
              </div>
            </div>
          </div>
        </section>

        <section id="apropos">
          <div className="wrap about">
            <div className="frame plate reveal reveal-media">
              <CoverImage src="/images/about/laura-dineka.jpg" alt="Laura Dineka" width={480} height={640} loading="lazy" />
            </div>
            <div className="reveal">
              <div className="eyebrow">À propos</div>
              <h2>À propos de Laura</h2>
              <p>Laura Dineka est une professionnelle du maquillage et de la beauté, entre la RDC et la France. Sa biographie complète sera ajoutée ici dès qu&apos;elle sera transmise.</p>
            </div>
          </div>
        </section>

        <section className="insta">
          <div className="wrap reveal">
            <h2>Retrouvez l&apos;univers LD House of Make Up</h2>
            {instagram ? <div className="handle">{instagram.replace("https://instagram.com/", "@").replace(/\/$/, "")}</div> : null}
            {posts.length === 0 ? (
              <div className="insta-grid">
                {demoInstagram.map((src) => (
                  <div className="shot" key={src}>
                    <CoverImage src={src} alt="Visuel de démonstration" width={400} height={400} loading="lazy" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="insta-grid">
                {posts.map((post) => (
                  <a key={post.id} href={post.permalink || instagram || "#"} target={post.permalink ? "_blank" : undefined} rel="noreferrer">
                    <CoverImage src={post.imagePath} alt={post.caption || "Publication"} width={400} height={400} loading="lazy" />
                  </a>
                ))}
              </div>
            )}
            {instagram ? <a className="btn btn-ghost light" href={instagram} target="_blank" rel="noreferrer">Voir sur Instagram</a> : null}
            <p className="note">
              {posts.length === 0 ? "Grille de démonstration, photos libres de droits. " : ""}
              Le compte indiqué reprend celui de la démo. Il reste à confirmer.
            </p>
          </div>
        </section>

        <section className="final" id="contact">
          <div className="wrap reveal">
            <h2>Votre prochain projet mérite une mise en beauté à sa hauteur.</h2>
            <div className="final-ctas">
              <a href="#devis" className="btn btn-primary">Demander un devis</a>
              <a href="#devis" className="btn btn-ghost">Parler de mon projet</a>
            </div>
            <div className="form-box">
              <h3>Demande de devis</h3>
              <QuoteForm services={services.map((service) => ({ id: service.id, title: service.title }))} whatsapp={whatsapp} />
            </div>
          </div>
        </section>
      </main>
      <footer>
        <div className="wrap">
          <div className="foot-top">
            <div>
              <div className="logo">LD HOUSE<span>OF MAKE UP</span></div>
              <p>Make Up · Beauty · Experiences</p>
            </div>
            <div className="foot-links">
              <div>
                {instagram ? <a href={instagram} target="_blank" rel="noreferrer">Instagram</a> : null}
                <a href="#contact">Contact</a>
              </div>
              <div>
                <a href="#prestations">Prestations</a>
                <a href="#ateliers">Ateliers</a>
                <a href="#portfolio">Portfolio</a>
              </div>
              <div>
                <a href="/mentions-legales">Mentions légales</a>
                <a href="/confidentialite">Confidentialité</a>
                <a href="/admin/login">Espace gestion</a>
              </div>
            </div>
          </div>
          <div className="foot-bottom">
            <span>© {new Date().getFullYear()} LD House of Make Up</span>
          </div>
        </div>
      </footer>
      {whatsapp ? (
        <a className="wa-float" href={whatsapp} target="_blank" rel="noreferrer" aria-label="Écrire sur WhatsApp">
          <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.2 14.2c-.2.6-1.2 1.1-1.7 1.2-.4.1-1 .1-1.6-.1-.4-.1-.9-.3-1.5-.5-2.6-1.1-4.3-3.8-4.4-4-.1-.2-1-1.3-1-2.5s.6-1.8.9-2c.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5.2.6.7 2 .8 2.1.1.2.1.3 0 .5-.1.2-.2.3-.4.5l-.3.3c-.1.1-.2.3-.1.5.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.4.2.1.4.1.5-.1l.7-.8c.2-.2.3-.2.5-.1.2.1 1.4.7 1.6.8.2.1.4.2.4.3.1.2.1.7-.1 1.3z"/></svg>
        </a>
      ) : null}
    </>
  );
}
