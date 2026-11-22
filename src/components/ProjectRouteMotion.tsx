"use client";

import { useEffect } from "react";

/** Lightweight scroll reveals on standalone project routes.
 * Does not interfere with the V2.4 homepage scroll choreography. */
export function ProjectRouteMotion() {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>(".project-route-gallery .project-gallery-item, .project-route-info, .project-route-next"));
    if (!elements.length) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("route-inview"));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("route-inview");
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -7% 0px", threshold: .1 });
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);
  return null;
}
