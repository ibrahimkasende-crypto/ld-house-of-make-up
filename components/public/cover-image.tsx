"use client";

import { useState, type ImgHTMLAttributes } from "react";

type Props = ImgHTMLAttributes<HTMLImageElement>;

export function CoverImage({ alt = "", ...props }: Props) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return <span className="img-fallback" role="img" aria-label={alt || "Visuel indisponible"} />;
  }
  return <img {...props} alt={alt} onError={() => setFailed(true)} />;
}
