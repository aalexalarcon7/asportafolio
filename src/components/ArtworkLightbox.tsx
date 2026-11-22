"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { projects, type Project } from "@/data/site";

type Selection = { project: Project; index: number };

/** Full-resolution artwork viewer shared by the homepage case study and /works/[slug].
 * Triggers use native data attributes so the existing V2.4 motion choreography stays untouched.
 */
export function ArtworkLightbox() {
  const [selection, setSelection] = useState<Selection | null>(null);
  const [zoomed, setZoomed] = useState(false);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const pointerStartRef = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null);
  const swipeStartRef = useRef<{ x: number; y: number } | null>(null);

  const show = useCallback((project: Project, index: number, trigger: HTMLElement) => {
    if (!project.coverImage && !project.gallery?.length) return;
    returnFocusRef.current = trigger;
    setSelection({ project, index });
    setZoomed(false);
    setPan({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const trigger = target.closest<HTMLElement>("[data-artwork-open]");
      if (!trigger) return;
      const project = projects.find((p) => p.slug === trigger.dataset.artworkOpen);
      if (!project) return;
      event.preventDefault();
      event.stopPropagation();
      show(project, Number(trigger.dataset.artworkIndex ?? 0), trigger);
    }
    // Capture before the V2.4 document-level project navigation callbacks.
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [show]);

  useEffect(() => {
    if (!selection) return;
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const frame = window.requestAnimationFrame(() => closeRef.current?.focus());
    return () => {
      window.cancelAnimationFrame(frame);
      document.documentElement.style.overflow = previousOverflow;
    };
  }, [selection !== null]); // eslint-disable-line react-hooks/exhaustive-deps

  const close = useCallback(() => {
    setSelection(null);
    setZoomed(false);
    setPan({ x: 0, y: 0 });
    window.requestAnimationFrame(() => returnFocusRef.current?.focus({ preventScroll: true }));
  }, []);

  const images = selection ? [selection.project.coverImage, ...(selection.project.gallery ?? [])].filter((src): src is string => Boolean(src)) : [];
  const index = selection ? Math.min(Math.max(selection.index, 0), images.length - 1) : 0;
  const source = images[index];

  function step(delta: number) {
    if (!selection || !images.length) return;
    setSelection({ ...selection, index: (index + delta + images.length) % images.length });
    setZoomed(false);
    setPan({ x: 0, y: 0 });
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); close(); }
    if (event.key === "ArrowRight") { event.preventDefault(); event.stopPropagation(); step(1); }
    if (event.key === "ArrowLeft") { event.preventDefault(); event.stopPropagation(); step(-1); }
    if (event.key === "Tab") {
      const elements = [...(dialogRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])') ?? [])]
        .filter((el) => el.getClientRects().length);
      if (!elements.length) return;
      const first = elements[0], last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  }

  if (!selection || !source) return null;

  return (
    <div
      className="artwork-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`Vista ampliada de ${selection.project.name}`}
      data-artwork-lightbox="open"
      ref={dialogRef}
      onKeyDown={onKeyDown}
      onClick={(event) => { if (event.target === event.currentTarget) close(); }}
      onTouchStart={(event) => {
        swipeStartRef.current = { x: event.touches[0].clientX, y: event.touches[0].clientY };
      }}
      onTouchEnd={(event) => {
        if (!swipeStartRef.current || zoomed) return;
        const dx = event.changedTouches[0].clientX - swipeStartRef.current.x;
        const dy = event.changedTouches[0].clientY - swipeStartRef.current.y;
        if (Math.abs(dx) > 65 && Math.abs(dx) > Math.abs(dy) * 1.4) step(dx < 0 ? 1 : -1);
        swipeStartRef.current = null;
      }}
    >
      <div className="artwork-lightbox-top">
        <div className="artwork-lightbox-heading">
          <span className="artwork-lightbox-brand micro">AS® / A CLOSER LOOK</span>
          <strong>{selection.project.name}</strong>
        </div>
        <button className="artwork-lightbox-close micro" type="button" onClick={close} ref={closeRef} aria-label="Cerrar imagen ampliada">CLOSE <span aria-hidden="true">✕</span></button>
      </div>

      <div className="artwork-lightbox-backdrop" style={{ backgroundImage: `url("${source}")` }} aria-hidden="true" />
      <div className="artwork-lightbox-stage" aria-live="polite">
        <div className="artwork-lightbox-frame">
          <div
            className={`artwork-lightbox-picture${zoomed ? " is-zoomed" : ""}`}
            style={{ transform: `translate3d(${pan.x}px,${pan.y}px,0) scale(${zoomed ? 1.8 : 1})` }}
            onPointerDown={(event) => {
              if (!zoomed) return;
              pointerStartRef.current = { x: event.clientX, y: event.clientY, panX: pan.x, panY: pan.y };
              event.currentTarget.setPointerCapture(event.pointerId);
            }}
            onPointerMove={(event) => {
              if (!pointerStartRef.current) return;
              setPan({ x: Math.max(-350, Math.min(350, pointerStartRef.current.panX + event.clientX - pointerStartRef.current.x)), y: Math.max(-300, Math.min(300, pointerStartRef.current.panY + event.clientY - pointerStartRef.current.y)) });
            }}
            onPointerUp={() => { pointerStartRef.current = null; }}
            onPointerCancel={() => { pointerStartRef.current = null; }}
          >
            <Image src={source} alt={`${selection.project.name} — imagen ${index + 1} de ${images.length}`} fill sizes="100vw" className="artwork-lightbox-image" priority />
          </div>
        </div>
      </div>

      <div className="artwork-lightbox-bottom">
        <div className="artwork-lightbox-counter micro"><span>{String(index + 1).padStart(2, '0')}</span><span className="muted">/ {String(images.length).padStart(2, '0')}</span></div>
        <div className="artwork-lightbox-controls">
          <button className="artwork-lightbox-control micro" type="button" onClick={() => { setZoomed(!zoomed); setPan({ x: 0, y: 0 }); }} aria-pressed={zoomed}>{zoomed ? 'FIT TO SCREEN −' : 'ZOOM IN +'}</button>
          <button className="artwork-lightbox-control artwork-lightbox-arrow" type="button" onClick={() => step(-1)} aria-label="Imagen anterior">←</button>
          <button className="artwork-lightbox-control artwork-lightbox-arrow" type="button" onClick={() => step(1)} aria-label="Imagen siguiente">→</button>
        </div>
        <span className="artwork-lightbox-help micro">← → NAVEGAR · ESC CERRAR</span>
      </div>
    </div>
  );
}
