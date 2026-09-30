"use client";

import { useEffect, useRef, useState } from "react";

export function LoopVideo({ src, poster }: { src: string; poster: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video || failed) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    video.muted = true;
    video.defaultMuted = true;

    const start = () => {
      const play = video.play();
      if (play) play.catch(() => setFailed(true));
    };
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) start();
      else video.pause();
    }, { threshold: 0.2 });
    observer.observe(video);
    return () => observer.disconnect();
  }, [failed, src]);

  if (failed) return null;

  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      autoPlay
      preload="metadata"
      poster={poster}
      aria-hidden="true"
      onError={() => setFailed(true)}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
