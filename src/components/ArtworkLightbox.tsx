"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { projects, type Project } from "@/data/site";

type Selection = { project: Project; index: number };
type Pan = { x: number; y: number };
const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

/** Shared cinema-style viewer for project routes and the selected-works case studies.
 * DOM data attributes intentionally preserve the approved V2.4 motion runtime.
 */
export function ArtworkLightbox() {
  const [selection, setSelection] = useState<Selection | null>(null);
  const [closing, setClosing] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [pan, setPan] = useState<Pan>({ x: 0, y: 0 });
  const [loaded, setLoaded] = useState(false);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pointerStartRef = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null);
  const swipeStartRef = useRef<{ x: number; y: number } | null>(null);
  const thumbnailRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const show = useCallback((project: Project, index: number, trigger: HTMLElement) => {
    if (!project.coverImage && !project.gallery?.length) return;
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    returnFocusRef.current = trigger;
    setSelection({ project, index });
    setClosing(false);
    setZoomed(false);
    setPan({ x: 0, y: 0 });
    setLoaded(false);
    setDirection("next");
  }, []);

  useEffect(() => {
    function openFromArtwork(event: MouseEvent) {
      if (!(event.target instanceof Element)) return;
      const trigger = event.target.closest<HTMLElement>("[data-artwork-open]");
      if (!trigger) return;
      const project = projects.find((item) => item.slug === trigger.dataset.artworkOpen);
      if (!project) return;
      event.preventDefault();
      event.stopPropagation();
      show(project, Number(trigger.dataset.artworkIndex ?? 0), trigger);
    }
    // Capture before the DOM-based project-card navigation; the two overlays must not open together.
    document.addEventListener("click", openFromArtwork, true);
    return () => document.removeEventListener("click", openFromArtwork, true);
  }, [show]);

  useEffect(() => {
    if (!selection) return;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    const raf = requestAnimationFrame(() => closeRef.current?.focus());
    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
    };
  }, [selection !== null]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
  }, []);

  const close = useCallback(() => {
    if (closing) return;
    setClosing(true);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    closeTimerRef.current = setTimeout(() => {
      setSelection(null);
      setClosing(false);
      setZoomed(false);
      setPan({ x: 0, y: 0 });
      requestAnimationFrame(() => returnFocusRef.current?.focus({ preventScroll: true }));
    }, reduced ? 0 : 260);
  }, [closing]);

  const images = selection
    ? [selection.project.coverImage, ...(selection.project.gallery ?? [])].filter((src): src is string => Boolean(src))
    : [];
  const index = selection ? clamp(selection.index, 0, Math.max(0, images.length - 1)) : 0;
  const source = images[index];

  function selectImage(next: number, preferredDirection?: "next" | "prev") {
    if (!selection || !images.length || next === index || closing) return;
    setDirection(preferredDirection ?? (next > index ? "next" : "prev"));
    setSelection({ ...selection, index: (next + images.length) % images.length });
    setZoomed(false);
    setPan({ x: 0, y: 0 });
    setLoaded(false);
    // Keep the active preview visible inside the horizontal filmstrip.
    requestAnimationFrame(() => thumbnailRefs.current[(next + images.length) % images.length]?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" }));
  }

  function step(delta: number) {
    if (!selection || images.length < 2) return;
    selectImage((index + delta + images.length) % images.length, delta > 0 ? "next" : "prev");
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); close(); return; }
    if (event.key === "ArrowRight") { event.preventDefault(); step(1); return; }
    if (event.key === "ArrowLeft") { event.preventDefault(); step(-1); return; }
    if (event.key === "Tab") {
      const elements = [...(dialogRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]),a[href],[tabindex]:not([tabindex="-1"])') ?? [])]
        .filter((element) => element.getClientRects().length > 0);
      if (!elements.length) return;
      const first = elements[0], last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  }

  function dragPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (!zoomed || event.button !== 0) return;
    pointerStartRef.current = { x: event.clientX, y: event.clientY, panX: pan.x, panY: pan.y };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function dragPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!pointerStartRef.current) return;
    const start = pointerStartRef.current;
    const maxX = Math.max(100, window.innerWidth * .38);
    const maxY = Math.max(90, window.innerHeight * .34);
    setPan({
      x: clamp(start.panX + event.clientX - start.x, -maxX, maxX),
      y: clamp(start.panY + event.clientY - start.y, -maxY, maxY),
    });
  }

  if (!selection || !source) return null;
  const artworkLabel = index === 0 ? "Portada del proyecto" : `Exploración visual ${String(index).padStart(2, "0")}`;
  const progress = `${((index + 1) / images.length * 100).toFixed(2)}%`;

  return (
    <div
      ref={dialogRef}
      className={`artwork-lightbox artwork-lightbox-v13${closing ? " is-closing" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label={`Galería ampliada de ${selection.project.name}`}
      data-artwork-lightbox="open"
      onKeyDown={onKeyDown}
      onClick={(event) => { if (event.target === event.currentTarget) close(); }}
    >
      <div className="artwork-lightbox-backdrop" style={{ backgroundImage: `url("${source}")` }} aria-hidden="true" />
      <div className="artwork-lightbox-top">
        <div className="artwork-lightbox-heading">
          <span className="artwork-lightbox-brand micro">AS® — SELECTED WORKS / IMAGE VIEWER</span>
          <strong>{selection.project.name}</strong>
        </div>
        <span className="artwork-lightbox-top-index micro">{artworkLabel}</span>
        <button ref={closeRef} className="artwork-lightbox-close micro" type="button" onClick={close} aria-label="Cerrar galería">CLOSE <span aria-hidden="true">✕</span></button>
      </div>

      <div className="artwork-lightbox-stage" aria-live="off"
        onTouchStart={(event) => { swipeStartRef.current = { x: event.touches[0].clientX, y: event.touches[0].clientY }; }}
        onTouchEnd={(event) => {
          const start = swipeStartRef.current;
          swipeStartRef.current = null;
          if (!start || zoomed || images.length < 2) return;
          const dx = event.changedTouches[0].clientX - start.x;
          const dy = event.changedTouches[0].clientY - start.y;
          if (Math.abs(dx) > 65 && Math.abs(dx) > Math.abs(dy) * 1.4) step(dx < 0 ? 1 : -1);
        }}
      >
        <button className="artwork-stage-arrow artwork-stage-arrow-left" type="button" onClick={() => step(-1)} aria-label="Imagen anterior" disabled={images.length < 2}>←</button>
        <div className="artwork-lightbox-frame">
          <div className={`artwork-lightbox-picture${zoomed ? " is-zoomed" : ""}`} key={`${selection.project.slug}-${index}`}
            data-direction={direction}
            style={{ transform: `translate3d(${pan.x}px,${pan.y}px,0) scale(${zoomed ? 1.85 : 1})` }}
            onPointerDown={dragPointerDown}
            onPointerMove={dragPointerMove}
            onPointerUp={() => { pointerStartRef.current = null; }}
            onPointerCancel={() => { pointerStartRef.current = null; }}
            onLostPointerCapture={() => { pointerStartRef.current = null; }}
            onDoubleClick={() => { setZoomed(!zoomed); setPan({ x: 0, y: 0 }); }}
          >
            <Image
              src={source}
              alt={`${selection.project.name} — ${artworkLabel}`}
              fill
              sizes="100vw"
              className={`artwork-lightbox-image${loaded ? " is-loaded" : ""}`}
              priority
              onLoad={() => setLoaded(true)}
              draggable={false}
            />
          </div>
        </div>
        <button className="artwork-stage-arrow artwork-stage-arrow-right" type="button" onClick={() => step(1)} aria-label="Imagen siguiente" disabled={images.length < 2}>→</button>
        <span className="artwork-stage-hint micro" aria-hidden="true">{zoomed ? "DRAG TO EXPLORE" : "DOUBLE CLICK TO ZOOM"}</span>
      </div>

      <div className="artwork-lightbox-footer">
        <div className="artwork-lightbox-meter" aria-hidden="true"><span style={{ width: progress }} /></div>
        <div className="artwork-lightbox-bottom">
          <div className="artwork-lightbox-counter micro"><span>{String(index + 1).padStart(2, "0")}</span><span className="muted">/ {String(images.length).padStart(2, "0")}</span></div>
          <div className="artwork-filmstrip" role="group" aria-label="Seleccionar imagen del proyecto">
            {images.map((image, imageIndex) => (
              <button
                key={`${image}-${imageIndex}`}
                ref={(element) => { thumbnailRefs.current[imageIndex] = element; }}
                className={`artwork-thumb${imageIndex === index ? " is-active" : ""}`}
                type="button"
                onClick={() => selectImage(imageIndex)}
                aria-label={`Ver imagen ${imageIndex + 1} de ${images.length}`}
                aria-current={imageIndex === index ? "true" : undefined}
              >
                <Image src={image} alt="" width={112} height={70} loading="lazy" sizes="112px" />
                <span className="artwork-thumb-count micro">{String(imageIndex + 1).padStart(2, "0")}</span>
              </button>
            ))}
          </div>
          <div className="artwork-lightbox-controls">
            <button className="artwork-lightbox-control micro" type="button" onClick={() => { setZoomed(!zoomed); setPan({ x: 0, y: 0 }); }} aria-pressed={zoomed}>{zoomed ? "FIT −" : "ZOOM +"}</button>
            <button className="artwork-lightbox-control artwork-lightbox-arrow" type="button" onClick={() => step(-1)} aria-label="Imagen anterior" disabled={images.length < 2}>←</button>
            <button className="artwork-lightbox-control artwork-lightbox-arrow" type="button" onClick={() => step(1)} aria-label="Imagen siguiente" disabled={images.length < 2}>→</button>
          </div>
        </div>
        <div className="artwork-lightbox-footnote micro">CLICK TO EXPLORE / ARROWS TO NAVIGATE / ESC TO CLOSE</div>
      </div>
    </div>
  );
}
