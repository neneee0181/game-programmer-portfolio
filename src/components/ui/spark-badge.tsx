import { useEffect, useRef, useState } from "react";
import { SPARK_BADGE_MARKUP } from "./spark-badge-utils/spark-badge-markup";

export type SparkBadgeVariant = "badge" | "gallery";
export type SparkBadgeProps = {
  className?: string;
  sourceUrl?: string;
  variant?: SparkBadgeVariant;
  galleryIndex?: number;
};

export function SparkBadge({ className = "", sourceUrl, variant = "badge", galleryIndex = 0 }: SparkBadgeProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const intersectsRef = useRef(true);
  const [mounted, setMounted] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const sync = () =>
      setMounted(
        intersectsRef.current && document.visibilityState !== "hidden",
      );
    const observer = new IntersectionObserver(
      ([entry]) => {
        intersectsRef.current = entry.isIntersecting;
        sync();
      },
      { rootMargin: "80px" },
    );
    observer.observe(host);
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  useEffect(() => {
    if (!mounted) setReady(false);
  }, [mounted]);

  useEffect(() => {
    if (!ready) return;
    frameRef.current?.contentWindow?.postMessage(
      { type: "spark-badge-variant", variant },
      "*",
    );
  }, [ready, variant]);

  useEffect(() => {
    if (!ready || variant !== "gallery") return;
    frameRef.current?.contentWindow?.postMessage(
      { type: "spark-badge-gallery-index", index: galleryIndex },
      "*",
    );
  }, [ready, variant, galleryIndex]);

  return (
    <div
      ref={hostRef}
      className={`spark-badge${className ? ` ${className}` : ""}`}
      data-state={!mounted ? "paused" : ready ? "ready" : "loading"}
      data-variant={variant}
    >
      {mounted ? (
        <iframe
          ref={frameRef}
          className={`spark-badge__frame${ready ? " is-ready" : ""}`}
          title="Animated credential badge in rain"
          {...(sourceUrl ? { src: sourceUrl } : { srcDoc: SPARK_BADGE_MARKUP })}
          sandbox="allow-scripts"
          loading="eager"
          onLoad={() => setReady(true)}
        />
      ) : null}
    </div>
  );
}

export default SparkBadge;
