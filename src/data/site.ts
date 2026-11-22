/** Proyectos reales provistos por la diseñadora; textos editoriales resumidos a partir de sus PDFs. */
export type Project = {
  slug: string;
  number: string;
  name: string;
  category: string;
  categoryShort: string;
  coverText: string;
  coverClass: string;
  year: string;
  description: string;
  brief: string;
  deliverables: string[];
  coverImage?: string;
  gallery?: string[];
};
export const projects: Project[] = [
  {
    slug:'tango-arrabal', number:'01', name:'Tango Arrabal', category:'Identidad visual · Festival', categoryShort:'BRANDING / SISTEMA VISUAL',
    coverText:'TA', coverClass:'real-cover', year:'2026',
    description:'Sistema de identidad visual para un festival de arte tanguero. Un lenguaje gráfico de tipografía expresiva, ornamentación y aplicaciones en medios impresos, vía pública y redes sociales.',
    brief:'Proyecto académico de diseño de identidad para un festival de tango. Incluye marca principal, paleta cromática, pósteres, piezas de comunicación urbana, publicaciones digitales y sistema de acreditación.',
    deliverables:['Identidad visual','Diseño de marca','Pósteres','Aplicaciones','Redes sociales'],
    coverImage:'/projects/tango-arrabal/cover.webp',
    gallery:['/projects/tango-arrabal/poster-rojo.webp','/projects/tango-arrabal/poster-azul.webp','/projects/tango-arrabal/aplicaciones.webp','/projects/tango-arrabal/sistema.webp']
  },
  {
    slug:'cachafaz', number:'02', name:'Cachafaz — Packaging', category:'Rediseño de packaging', categoryShort:'PACKAGING / PRODUCTO',
    coverText:'CA', coverClass:'real-cover', year:'',
    description:'Rediseño conceptual de packaging para alfajores de chocolate blanco con crocante de pistacho. La propuesta desarrolla etiquetas, aplicaciones en lata y material de punto de venta.',
    brief:'Ejercicio de rediseño de packaging de una marca existente, con etiquetas y mockups para una presentación en lata. No corresponde necesariamente a un lanzamiento oficial de Cachafaz.',
    deliverables:['Rediseño de packaging','Etiquetas','Mockups','Punto de venta'],
    coverImage:'/projects/cachafaz/cover.webp',
    gallery:['/projects/cachafaz/latas.webp','/projects/cachafaz/frente-dorso.webp','/projects/cachafaz/punto-de-venta.webp','/projects/cachafaz/piezas-tecnicas.webp']
  },
  {
    slug:'born-to-die', number:'03', name:'Born To Die', category:'Diseño discográfico · Editorial', categoryShort:'EDITORIAL / PACKAGING MUSICAL',
    coverText:'BD', coverClass:'real-cover', year:'',
    description:'Interpretación gráfica de Born To Die, de Lana Del Rey, bajo el concepto «El refugio y la trampa». Una serie de piezas discográficas que exploran la convivencia entre protección, deseo y encierro.',
    brief:'Proyecto académico de arte gráfico para una edición conceptual en vinilo del álbum Born To Die, con carpeta exterior, fundas, discos, pósteres, libro de canciones y caja contenedora.',
    deliverables:['Arte de álbum','Diseño de vinilo','Diseño editorial','Packaging','Ilustración'],
    coverImage:'/projects/born-to-die/cover.webp',
    gallery:['/projects/born-to-die/vinilos.webp','/projects/born-to-die/afiches.webp','/projects/born-to-die/libro.webp','/projects/born-to-die/caja.webp','/projects/born-to-die/sistema.webp']
  },
  {
    slug:'garamond', number:'04', name:'Garamond', category:'Estudio tipográfico · Editorial', categoryShort:'TIPOGRAFÍA / EXPERIMENTACIÓN',
    coverText:'G', coverClass:'real-cover', year:'',
    description:'Exploración editorial de la familia Garamond, sus variantes, anatomía, proporciones y contraste. Composiciones que convierten el análisis tipográfico en lenguaje visual.',
    brief:'Estudio académico y láminas tipográficas sobre Garamond, con análisis de serifas, altura de x, trazos, terminaciones, variantes y jerarquías de texto.',
    deliverables:['Tipografía','Diseño editorial','Composición','Análisis tipográfico'],
    coverImage:'/projects/garamond/cover.webp',
    gallery:['/projects/garamond/lamina-01.webp','/projects/garamond/lamina-02.webp']
  },
];
export const tools = [
  { name:'PHOTOSHOP', initials:'Ps' },
  { name:'ILLUSTRATOR', initials:'Ai' },
  { name:'INDESIGN', initials:'Id' },
  { name:'AFTER EFFECTS', initials:'Ae' },
  { name:'FIGMA', initials:'Fi' },
  { name:'MORE TOOLS', initials:'+' },
] as const;
export const studio = {
  name: 'AS Design Studio',
  tagline: 'Identidades, ideas y experiencias visuales que van más allá de lo convencional.',
  location: 'Argentina',
  contactEmail: '', // Completar con correo real; no se inventan direcciones.
  instagram: '',
  behance: '',
  isPrelaunch: true, // Cambiar a false cuando los contenidos y el contacto sean reales.
};
