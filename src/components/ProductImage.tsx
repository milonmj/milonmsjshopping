"use client";
import { useState } from "react";
import { ImageOff } from "lucide-react";

type Props = {
  src?: string | null;
  alt: string;
  className?: string;
};

export default function ProductImage({ src, alt, className = "" }: Props) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className={`flex items-center justify-center bg-brand-pinkLight/40 text-brand-ink/30 ${className}`}>
        <ImageOff size={28} strokeWidth={1.5} />
      </div>
    );
  }

  return <img src={src} alt={alt} className={className} onError={() => setFailed(true)} />;
}
