import type { tools } from '@/data/site';
export function ToolCard({tool,interactive=false}:{tool:(typeof tools)[number],interactive?:boolean}){
 return <div className="tool" tabIndex={interactive?0:undefined} aria-label={interactive?tool.name:undefined}>
  <strong>{tool.initials}</strong><span>{tool.name}</span>
 </div>;
}
