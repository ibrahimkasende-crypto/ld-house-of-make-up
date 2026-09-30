"use client";

import { useState } from "react";
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

export function PortfolioGrid({ items }: { items: Item[] }) {
  const [filter, setFilter] = useState("all");
  const visible = items.filter((item) => filter === "all" || item.category === filter);
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
          {visible.map((item) => (
            <figure className="g-item" key={item.id}>
              <div className="frame plate">
                <img src={item.imagePath} alt={item.title} width={800} height={1000} loading="lazy" />
              </div>
              <figcaption>
                {item.title}
                {item.description ? ` — ${item.description}` : ""}
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </>
  );
}
