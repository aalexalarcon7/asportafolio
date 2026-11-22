import Image from 'next/image';
const exhibited = [
  {key:'one',src:'/projects/born-to-die/cover.webp',alt:'Born To Die — diseño de carpeta discográfica'},
  {key:'two',src:'/projects/garamond/lamina-01.webp',alt:'Estudio tipográfico Garamond'},
  {key:'three',src:'/projects/tango-arrabal/poster-rojo.webp',alt:'Póster Tango Arrabal'},
  {key:'four',src:'/projects/cachafaz/latas.webp',alt:'Packaging Cachafaz'},
  {key:'five',src:'/projects/born-to-die/afiches.webp',alt:'Pósteres Born To Die'},
];
export function Exhibition(){return (<div className="exhibition-journey" id="exhibition"><section className="exhibition" id="exhibition-scene" aria-label="Exposición inmersiva"><div className="gallery-light"></div><div className="gallery-corridor" id="gallery-corridor"><div className="gallery-floor"></div><div className="gallery-beam b1"></div><div className="gallery-beam b2"></div>{exhibited.map((work,i)=><div className={`gallery-poster ${work.key}`} data-poster={i+1} key={work.key}><Image src={work.src} alt={work.alt} fill sizes="(max-width: 700px) 45vw, 26vw" className="exhibition-image" /></div>)}<div className="gallery-crosshair"></div></div><div className="gallery-overlay"><div className="micro muted">02 — IMMERSIVE SPACE</div><h2>THE<br />EXHIBITION.</h2><p>Una selección de piezas reales: identidad, packaging, editorial y experimentación tipográfica.</p><a className="link-arrow micro" href="#works">DISCOVER SELECTED WORKS <span>↗</span></a></div><div className="gallery-frame"></div><div className="gallery-meta micro"><span>AS® EXHIBITION / SELECTED DESIGNS</span><span id="gallery-count">01 — 04</span></div></section></div>);}
