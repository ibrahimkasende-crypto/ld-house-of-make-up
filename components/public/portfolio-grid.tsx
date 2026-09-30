"use client";

import { useEffect, useRef, useState } from "react";
import { CoverImage } from "@/components/public/cover-image";

const CATEGORIES = [
  { id: "makeup", label: "Make Up" },
  { id: "beauty", label: "Beauty" },
  { id: "events", label: "Events" },
  { id: "editorial", label: "Editorial" },
];

type Item = {
  id: string;
  title: string;
  description: string;
  category: string;
  imagePath: string;
};

function labelFor(category: string) {
  return CATEGORIES.find((item) => item.id === category)?.label ?? category;
}

export function PortfolioGrid({ items }: { items: Item[] }) {
  const [filter, setFilter] = useState("all");
  const [active, setActive] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const originX = useRef(0);
  const visible = items.filter((item) => filter === "all" || item.category === filter);
  const current = active == null ? null : visible[active];

  useEffect(() => {
    if (active == null) return;
    document.body.classList.add("lightbox-open");
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActive(null);
      if (event.key === "ArrowRight") setActive((index) => (index == null ? index : (index + 1) % visible.length));
      if (event.key === "ArrowLeft") setActive((index) => (index == null ? index : (index - 1 + visible.length) % visible.length));
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("lightbox-open");
      window.removeEventListener("keydown", onKey);
    };
  }, [active, visible.length]);

  return (
    <>
      <div className="filters" role="toolbar" aria-label="Filtrer le portfolio">
        <button className={`filter-btn${filter === "all" ? " active" : ""}`} onClick={() => setFilter("all")}>Tout</button>
        {CATEGORIES.map((category) => (
          <button key={category.id} className={`filter-btn${filter === category.id ? " active" : ""}`} onClick={() => setFilter(category.id)}>
            {category.label}
          </button>
        ))}
      </div>
      {visible.length === 0 ? (
        <div className="empty">Les réalisations seront publiées ici dès que les visuels officiels seront ajoutés.</div>
      ) : (
        <div className="gallery">
          {visible.map((item, index) => (
            <figure className="g-item" key={item.id}>
              <button
                type="button"
                className="g-open"
                onClick={() => setActive(index)}
                aria-label={`Agrandir ${item.title}`}
              >
                <span className="frame plate">
                  <CoverImage src={item.imagePath} alt={item.title} width={800} height={1000} loading="lazy" />
                  <span className="g-overlay">
                    <strong>{item.title}</strong>
                    <small>{labelFor(item.category)}</small>
                  </span>
                </span>
              </button>
              <figcaption>
                {item.title}
                {item.description ? ` — ${item.description}` : ""}
              </figcaption>
            </figure>
          ))}
        </div>
      )}
      {current ? (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={current.title}
          onClick={(event) => {
            if (event.target === event.currentTarget) setActive(null);
          }}
          onPointerDown={(event) => { originX.current = event.clientX; }}
          onPointerUp={(event) => {
            const delta = event.clientX - originX.current;
            if (delta > 48) setActive((index) => (index == null ? index : (index - 1 + visible.length) % visible.length));
            if (delta < -48) setActive((index) => (index == null ? index : (index + 1) % visible.length));
          }}
        >
          <button ref={closeRef} className="lightbox-close" type="button" onClick={() => setActive(null)} aria-label="Fermer">Fermer</button>
          <button className="lightbox-nav prev" type="button" onClick={() => setActive((index) => (index == null ? index : (index - 1 + visible.length) % visible.length))} aria-label="Image précédente">Précédent</button>
          <figure>
            <CoverImage src={current.imagePath} alt={current.title} />
            <figcaption>
              <strong>{current.title}</strong>
              <span>{labelFor(current.category)}{current.description ? ` — ${current.description}` : ""}</span>
            </figcaption>
          </figure>
          <button className="lightbox-nav next" type="button" onClick={() => setActive((index) => (index == null ? index : (index + 1) % visible.length))} aria-label="Image suivante">Suivant</button>
        </div>
      ) : null}
    </>
  );
}
