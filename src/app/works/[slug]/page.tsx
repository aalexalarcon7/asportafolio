import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { projects, studio } from '@/data/site';

type RouteProps={params: Promise<{slug:string}>};
export function generateStaticParams(){return projects.map(({slug})=>({slug}));}
export async function generateMetadata({params}:RouteProps):Promise<Metadata>{
 const {slug}=await params;const project=projects.find(p=>p.slug===slug);
 return {title:project?`${project.name} — AS Design Studio`:'Proyecto no encontrado',description:project?.description,robots:{index:!studio.isPrelaunch,follow:!studio.isPrelaunch}};
}
export default async function ProjectPage({params}:RouteProps){
 const {slug}=await params;const project=projects.find(p=>p.slug===slug);
 if(!project)notFound();
 const index=projects.findIndex(p=>p.slug===slug);
 const next=projects[(index+1)%projects.length];
 return <main className="project-route">
  <header className="project-route-header"><Link href="/" className="brand" aria-label="Volver a AS Design Studio">as<sup>®</sup></Link><Link href="/#works" className="micro">← BACK TO WORK</Link></header>
  <section className="project-route-intro shell">
   <div className="micro muted">AS® / SELECTED WORKS / {project.number}</div>
   <h1>{project.name.toUpperCase()}</h1>
   <div className="project-route-meta micro"><span>{project.category.toUpperCase()}</span>{project.year && <span>{project.year}</span>}<span>PROYECTO DE DISEÑO / PORTFOLIO</span></div>
   <div className={`project-route-art work-art ${project.coverClass}`} role="img" aria-label={`Imagen del proyecto ${project.name}`}>{project.coverImage ? <Image src={project.coverImage} alt={`Portada de ${project.name}`} fill sizes="100vw" className="work-cover-image" /> : <span className="art-large">{project.coverText}</span>}</div>
  </section>
  <section className="project-route-info shell"><div><div className="micro muted">01 — THE BRIEF</div><h2>THE IDEA<br/>BEHIND IT.</h2></div><div><p>{project.brief}</p><p>{project.description}</p><div className="micro muted">ÁREAS: {project.deliverables.join(' / ').toUpperCase()}</div></div></section>
  <section className="project-route-visual shell"><div className="micro muted">02 — VISUAL EXPLORATIONS</div><div className="project-route-gallery">{(project.gallery || []).map((image, i) => <figure className="work-art project-gallery-item" key={image}><Image src={image} alt={`${project.name}: pieza ${i + 1}`} fill sizes="(max-width: 700px) 100vw, 50vw" className="project-gallery-image" /></figure>)}</div><p className="micro muted">Piezas originales aportadas para el portafolio. Los proyectos de carácter académico o conceptual no representan encargos oficiales de las marcas mencionadas.</p></section>
  <footer className="project-route-next shell"><span className="micro muted">NEXT PROJECT / {next.number}</span><Link href={`/works/${next.slug}`}> {next.name.toUpperCase()} <span aria-hidden="true">↗</span></Link><Link href="/#works" className="micro">← TODOS LOS PROYECTOS</Link></footer>
 </main>
}
