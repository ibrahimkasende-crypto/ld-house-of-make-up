"use client";

import { useEffect } from "react";

export function ScrollEffects() {
  useEffect(() => {
    const header = document.querySelector("header");
    const bar = document.getElementById("scrollProgress");
    const stage = document.querySelector(".hero-stage");
    const content = document.getElementById("heroContent");
    const plate = document.querySelector<HTMLElement>(".hero-plate");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const onScroll = () => {
      const y = window.scrollY;
      header?.classList.toggle("scrolled", y > 12);
      const height = document.documentElement.scrollHeight - window.innerHeight;
      if (bar && height > 0) bar.style.width = `${(y / height) * 100}%`;
      if (reduce || !stage || !content || !plate) return;
      const stageHeight = (stage as HTMLElement).offsetHeight - window.innerHeight;
      const progress = stageHeight > 0 ? Math.min(Math.max(y / stageHeight, 0), 1) : 0;
      plate.style.setProperty("--hero-scale", (1 + progress * 0.08).toFixed(3));
      content.style.setProperty("--hero-shift", `${(progress * -40).toFixed(1)}px`);
      content.style.setProperty("--hero-fade", Math.max(1 - progress * 0.85, 0.2).toFixed(2));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const nodes = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    if (reduce) {
      nodes.forEach((node) => node.classList.add("in"));
    }
    const reveal = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          reveal.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16, rootMargin: "0px 0px -8% 0px" });
    if (!reduce) nodes.forEach((node) => reveal.observe(node));

    return () => {
      window.removeEventListener("scroll", onScroll);
      reveal.disconnect();
    };
  }, []);
  return <div className="scroll-progress" id="scrollProgress" />;
}
