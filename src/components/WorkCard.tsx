import type { Project } from '@/data/site';
import Image from 'next/image';
export function WorkCard({project}:{project:Project}){
 return (
  <article className="work-card" data-name={project.name} data-number={project.number} data-type={project.category} data-slug={project.slug} data-description={project.description} role="button" tabIndex={0} aria-label={`Abrir vista del ${project.name}`}>
   <div className={`work-art ${project.coverClass}`}>
    {project.coverImage ? <Image className="work-cover-image" src={project.coverImage} alt={`Portada del ${project.name}`} fill sizes="(max-width: 700px) 100vw, 75vw" /> : <span className="art-large">{project.coverText}</span>}
    <span className="work-art-corners" aria-hidden="true" />
    <span className="work-art-meta micro">AS® / {project.number}</span>
    <span className="work-art-bottom micro">CONCEPT VISUAL — INTERACTIVE STUDY</span>
    <span className="work-hover micro">EXPLORE ↗</span>
   </div>
   <div className="work-caption"><strong>{project.name.toUpperCase()} ↗</strong><span className="micro">{project.categoryShort}</span></div>
  </article>
 );
}
