/** Datos provisionales: reemplazar con material aprobado de la diseñadora. */
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
  { slug:'proyecto-01', number:'01', name:'Proyecto 01', category:'Identidad visual', categoryShort:'IDENTIDAD VISUAL / CONCEPTO',coverText:'01.',coverClass:'art-1',year:'2026', description:'Exploración conceptual de identidad visual: escala, contraste y un sistema gráfico que se reconoce a primera vista.',brief:'Sistema de identidad visual ilustrativo para estudiar jerarquía, contraste y aplicaciones de marca.',deliverables:['Identidad visual','Composición gráfica','Sistema tipográfico'] },
  { slug:'proyecto-02', number:'02', name:'Proyecto 02',category:'Diseño editorial',categoryShort:'DISEÑO EDITORIAL / CONCEPTO',coverText:'TYPE',coverClass:'art-2',year:'2026',description:'Exploración editorial de ritmo, grilla y jerarquías tipográficas. Una demostración, no un proyecto final.',brief:'Estudio de retícula editorial y dirección tipográfica con piezas de experimentación.',deliverables:['Diseño editorial','Retícula','Composición tipográfica'] },
  { slug:'proyecto-03', number:'03', name:'Proyecto 03',category:'Packaging',categoryShort:'PACKAGING / CONCEPTO',coverText:'AS',coverClass:'art-3',year:'2026',description:'Estudio visual de materialidad, formas y aplicaciones de marca para una pieza de packaging conceptual.',brief:'Concepto experimental de packaging, materiales y lenguaje de marca.',deliverables:['Packaging','Arte aplicado','Dirección visual'] },
  { slug:'proyecto-04', number:'04', name:'Proyecto 04',category:'Experimentación gráfica',categoryShort:'EXPERIMENTAL / CONCEPTO',coverText:'04',coverClass:'art-4',year:'2026',description:'Un ejercicio de experimentación gráfica en blanco y negro, creado para probar la experiencia de navegación.',brief:'Exploración visual de tipografía y composición mediante contrastes monocromáticos.',deliverables:['Experimental','Diseño gráfico','Motion concept'] },
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
