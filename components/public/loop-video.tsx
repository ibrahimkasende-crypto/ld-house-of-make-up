"use client";

import { useEffect, useRef, useState } from "react";

export function LoopVideo({ src, poster, priority = false }: { src: string; poster: string; priority?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video || failed) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) return;

    const arm = () => {
      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;
      video.setAttribute("playsinline", "");
      video.setAttribute("webkit-playsinline", "true");
    };

    let visible = false;
    const tryPlay = () => {
      if (!visible || reduce.matches || document.hidden) return;
      arm();
      const pending = video.play();
      if (pending) pending.catch(() => undefined);
    };

    arm();
    const observer = new IntersectionObserver((entries) => {
      visible = entries.some((entry) => entry.isIntersecting);
      if (visible) tryPlay();
      else video.pause();
    }, { threshold: 0.05, rootMargin: "120px 0px" });
    observer.observe(video);

    video.addEventListener("canplay", tryPlay);
    video.addEventListener("loadeddata", tryPlay);
    const onVisible = () => { if (!document.hidden) tryPlay(); };
    document.addEventListener("visibilitychange", onVisible);
    const onGesture = () => tryPlay();
    window.addEventListener("touchstart", onGesture, { passive: true });
    window.addEventListener("pointerdown", onGesture, { passive: true });

    return () => {
      observer.disconnect();
      video.removeEventListener("canplay", tryPlay);
      video.removeEventListener("loadeddata", tryPlay);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("touchstart", onGesture);
      window.removeEventListener("pointerdown", onGesture);
    };
  }, [failed, src]);

  if (failed) return null;

  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      autoPlay
      preload={priority ? "auto" : "metadata"}
      poster={poster}
      aria-hidden="true"
      onError={() => setFailed(true)}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
