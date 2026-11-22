let mounted = false;

export function initializeMotion(){
 if(mounted) return; mounted = true;
 'use strict';
const $=s=>document.querySelector(s),$$=s=>Array.from(document.querySelectorAll(s));
const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));const lerp=(a,b,t)=>a+(b-a)*t;const easeOut=t=>1-Math.pow(1-t,3);const easeInOut=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
const loader=$('#loader'),card=$('#loader-card'),flight=$('#flight'),grad=$('#card-lamp'),hero=$('#hero-scene'),heroStar=$('#hero-star'),header=$('#header'),rail=$('#rail');
let raf=0,introToken=0,scrollRaf=0,introActive=false,dialogReturnFocus=null;
function cubic(p0,p1,p2,p3,t){let q=1-t;return q*q*q*p0+3*q*q*t*p1+3*q*t*t*p2+t*t*t*p3}
// Loader V2.1: three spatial beats rather than one linear fly-in.
// A: falling star (top right), B: occlusion beneath rim, C: gentle orbit into signature position.
function segment(a,b,t){return clamp((t-a)/(b-a))}
function smoother(t){t=clamp(t);return t*t*(3-2*t)}
function dynamicPath(){
 const r=card.getBoundingClientRect(),w=innerWidth,h=innerHeight;
 const landing={x:r.left+r.width*.46,y:r.top+r.height*.46};
 const rim={x:r.left+r.width*.875,y:r.top+r.height*.185};
 const portal={x:r.left+r.width*.665,y:r.top+r.height*.35};
 return {r,landing,
  arrival:[{x:w+220,y:-h*.14},{x:w*.90,y:h*.035},{x:r.right+110,y:r.top-85},rim],
  behind:[rim,{x:r.right+9,y:r.top+r.height*.305},{x:r.left+r.width*.92,y:r.top+r.height*.365},portal],
  settle:[portal,{x:r.left+r.width*.52,y:r.top+r.height*.33},{x:r.left+r.width*.38,y:r.top+r.height*.43},landing]
 };
}
function spotOnPath(points,t){return {x:cubic(points[0].x,points[1].x,points[2].x,points[3].x,t),y:cubic(points[0].y,points[1].y,points[2].y,points[3].y,t)}}
function setStar(x,y,scale=1,angle=0,opacity=1,trail=0,glow=1){
 flight.style.opacity=String(clamp(opacity));
 flight.style.transform=`translate3d(${x}px,${y}px,0) translate(-50%,-50%) rotate(${angle}deg) scale(${scale})`;
 flight.style.setProperty('--trail',String(clamp(trail)));
 flight.style.setProperty('--trail-length',`${Math.round(190+430*trail)}px`);
 flight.style.setProperty('--glow-opacity',String(clamp(glow)));
 flight.style.setProperty('--star-bloom',`${(3+glow*15).toFixed(1)}px`);
}
let dismissTimer=0;
function endIntro(immediate=false){
 introToken++;cancelAnimationFrame(raf);clearTimeout(dismissTimer);introActive=false;
 loader.classList.add('exiting');hero.classList.add('is-visible');heroStar.classList.add('show');
 header.classList.add('shown');rail.classList.add('shown');document.body.classList.remove('is-loading');
 if(immediate){loader.classList.add('dismissed');loader.style.opacity='0';loader.classList.remove('exiting');}
 else{loader.style.opacity='0';dismissTimer=setTimeout(()=>loader.classList.add('dismissed'),850)}
 requestScroll();
}
function startIntro(){
 introToken++;cancelAnimationFrame(raf);clearTimeout(dismissTimer);
 const token=introToken;introActive=true;
 window.scrollTo({top:0,behavior:'instant'});document.body.classList.add('is-loading');
 hero.classList.remove('is-visible');heroStar.classList.remove('show');
 header.classList.remove('shown');rail.classList.remove('shown');
 loader.className='loader';loader.style.opacity='1';loader.style.backgroundColor='#000';
 loader.style.setProperty('--frame-opacity',0);loader.style.setProperty('--ambient-opacity',0);
 card.style.setProperty('--card-halo',0);
 flight.style.opacity='0';flight.style.setProperty('--trail','0');
 $('#meter-fill').style.width='0';$('#loading-label').textContent='REVELANDO IDENTIDAD';
 $('#loading-progress').textContent='01 / 03';
 const start=performance.now(),path=dynamicPath(),r=path.r;
 const frame=$('#card-face');frame.style.left=`${r.left}px`;frame.style.top=`${r.top}px`;frame.style.width=`${r.width}px`;frame.style.height=`${r.height}px`;
 const destRect=heroStar.getBoundingClientRect();
 const heroDest={x:destRect.left+destRect.width*.50,y:destRect.top+destRect.height*.47};
 const move=4.50;
 function animate(now){
  if(token!==introToken)return;
  const t=(now-start)/1000;
  let pos=path.arrival[0],scale=1.14,rot=-23,opacity=0,trail=0,glow=.5;
  // 00.18-00.98: fast incoming trajectory from upper right
  if(t>=.18 && t<.98){
   const p=segment(.18,.98,t);
   pos=spotOnPath(path.arrival,Math.sin(p*Math.PI/2));
   scale=1.28-.12*smoother(p);rot=-24+5*smoother(p);
   opacity=segment(.18,.30,t);trail=Math.sin(p*Math.PI)*.95+.05;glow=.75+.25*Math.sin(p*Math.PI);
  }
  // 00.98-01.52: light grazes the right edge; star passes BEHIND the physical rim.
  else if(t<1.52){
   const p=segment(.98,1.52,t);
   pos=spotOnPath(path.behind,smoother(p));scale=1.16-.20*p;
   rot=-19+10*p;
   // true two-depth disappearance: card-face remains above star; brightness also dims when hidden.
   opacity=p<.37?1-smoother(p/.37)*.96:p<.66?.04:.04+.96*smoother((p-.66)/.34);
   trail=(1-p)*.27;glow=p<.3?1:.25;
  }
  // 01.52-02.27: return from behind the frame into the negative space, slow landing.
  else if(t<2.27){
   const p=segment(1.52,2.27,t);
   pos=spotOnPath(path.settle,smoother(p));scale=.96-.10*smoother(p);
   rot=-9+9*smoother(p);opacity=1;trail=.13*(1-p);glow=.3*(1-p);
  }
  else {pos=path.landing;scale=.86;rot=0;opacity=1;trail=0;glow=.12;}
  // Card is not shown on a timer alone: the highlight follows the trajectory of the star.
  // First light begins near card's upper-right border and settles into dark graphite.
  if(t>.67)loader.classList.add('lit');
  const appearance=smoother(segment(.66,1.58,t));
  loader.style.setProperty('--frame-opacity',String(appearance));
  const flash=Math.sin(Math.PI*segment(.65,1.75,t));
  loader.style.setProperty('--ambient-opacity',String(Math.max(0,flash)*.9));
  card.style.setProperty('--card-halo',String(appearance*.75));
  $('#loader-glow').style.setProperty('--light-x',`${pos.x/innerWidth*100}%`);
  $('#loader-glow').style.setProperty('--light-y',`${pos.y/innerHeight*100}%`);
  grad.setAttribute('cx',`${(pos.x-r.left)/r.width*100}%`);
  grad.setAttribute('cy',`${(pos.y-r.top)/r.height*100}%`);
  // Sharpen the card after the specular light moves away.
  grad.setAttribute('r',`${Math.round(36+20*flash)}%`);
  if(t>2.18)loader.classList.add('typed');
  if(t>2.52){const progress=smoother(segment(2.52,3.43,t));$('#meter-fill').style.width=`${Math.round(progress*100)}%`;
   $('#loading-progress').textContent=t<2.95?'02 / 03':t<3.43?'03 / 03':'READY';}
  if(t>3.38)$('#loading-label').textContent='EXPERIENCIA LISTA';
  if(t>3.56){
   if(!loader.classList.contains('exiting')){
    loader.classList.add('exiting');loader.style.backgroundColor='transparent';hero.classList.add('is-visible');
    header.classList.add('shown');rail.classList.add('shown');document.body.classList.remove('is-loading');
   }
   const p=smoother(segment(3.56,4.40,t));
   pos={x:lerp(path.landing.x,heroDest.x,p),y:lerp(path.landing.y,heroDest.y,p)};
   scale=lerp(.86,1.52,p);rot=lerp(0,-13,p);opacity=1-smoother(segment(4.07,4.43,t));
   trail=.23*Math.sin(p*Math.PI);
   if(t>4.12)heroStar.classList.add('show');
   // Hide the flying layer before the final hero symbol takes over.
  }
  setStar(pos.x,pos.y,scale,rot,opacity,trail,glow);
  if(t>=move){endIntro();return;}
  raf=requestAnimationFrame(animate);
 }
 raf=requestAnimationFrame(animate);
}
$('#skip').addEventListener('click',()=>endIntro(true));$('#replay').addEventListener('click',()=>{if(reduce){scrollTo({top:0,behavior:'instant'});return}startIntro()});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&introActive)endIntro(true)});
const sectionIds=['home','exhibition','works','expertise','about','contact'];
function sectionProgress(id){const el=document.getElementById(id),r=el.getBoundingClientRect();return clamp(-r.top/Math.max(1,r.height-innerHeight))}
function updateScroll(){scrollRaf=0;const y=window.scrollY,h=innerHeight;const hp=sectionProgress('home'),ep=sectionProgress('exhibition'),wp=sectionProgress('works');if(!reduce){
$('#hero-main').style.transform=`translate3d(0,${-hp*118}px,0) scale(${1+hp*.14})`;$('#hero-main').style.opacity=String(1-clamp(hp*.88));heroStar.style.transform=`translate3d(${hp*190}px,${-hp*130}px,0) rotate(${hp*-18}deg) scale(${1+hp*.15})`;$('.hero-lower').style.opacity=String(1-hp);
const corridor=$('#gallery-corridor');corridor.style.transform=`translate3d(0,${lerp(65,-25,ep)}px,0) scale(${lerp(.8,1.23,ep)})`;$('.gallery-light').style.opacity=String(lerp(.28,.95,clamp(ep*2)));$$('.gallery-poster').forEach((p,i)=>{const offset=i-2;const curve=Math.sin(ep*Math.PI);p.style.transform=`translate3d(${offset*ep*-26}px,${-ep*(20+Math.abs(offset)*15)}px,${(ep-.4)*Math.abs(offset)*-75}px) rotateY(${offset*(1-ep)*9}deg) scale(${1+ep*(i===0?.11:.03)})`;p.style.opacity=String(clamp((ep+.09)*5)*(ep>.87?lerp(1,.45,(ep-.87)/.13):1))});$('.gallery-overlay').style.transform=`translate3d(0,${-ep*55}px,0)`;$('.gallery-overlay').style.opacity=String(ep>.74?clamp(1-(ep-.74)*3.6):1);$('#gallery-count').textContent=ep<.36?'01 — 04':ep<.72?'02 — 04':'03 — 04';
const workCards=$$('.work-card'),workScene=$('#works-scene');
const inWorks=$('#works').getBoundingClientRect().top<h*.85&&$('#works').getBoundingClientRect().bottom>h*.15;
workScene.classList.toggle('work-active',inWorks);
if(innerWidth>700){
 const track=$('#work-track'),win=$('#work-window'),max=Math.max(0,track.scrollWidth-win.clientWidth);
 track.style.transform=`translate3d(${-max*wp}px,0,0)`;
 $('#works-progress-fill').style.width=`${wp*100}%`;
 let nearest=0,best=Infinity;
 workCards.forEach((card,i)=>{
  const r=card.getBoundingClientRect(),distance=(r.left+r.width*.5-innerWidth*.5)/Math.max(1,innerWidth);
  const vis=clamp(1-Math.abs(distance)*1.65);
  card.style.setProperty('--art-shift-x',`${(-distance*42).toFixed(1)}px`);
  card.style.setProperty('--art-shift-y',`${(Math.sin((wp+i*.22)*Math.PI)*13).toFixed(1)}px`);
  if(Math.abs(distance)<best){best=Math.abs(distance);nearest=i}
 });
 workCards.forEach((card,i)=>card.classList.toggle('is-featured',i===nearest));
 $('#works-counter').textContent=String(nearest+1).padStart(2,'0')+' / '+String(workCards.length).padStart(2,'0');
 $('#works-current-label').textContent='PROJECT '+String(nearest+1).padStart(2,'0')+' — SELECTED WORKS';
}
const c=document.getElementById('contact').getBoundingClientRect(),cp=clamp((h-c.top)/(h+c.height*.4));$('#contact-star').style.transform=`translate3d(${-cp*190}px,${cp*85}px,0) rotate(${cp*10}deg)`;$('#contact-outline').classList.toggle('fill',cp>.52);
}let active='home';for(const id of sectionIds){if(document.getElementById(id).getBoundingClientRect().top<h*.48)active=id}$$('.progress-rail a').forEach(a=>{a.classList.toggle('active',a.dataset.target===active);a.setAttribute('aria-current',a.dataset.target===active?'location':'false')})}
function requestScroll(){if(!scrollRaf)scrollRaf=requestAnimationFrame(updateScroll)}window.addEventListener('scroll',requestScroll,{passive:true});window.addEventListener('resize',requestScroll,{passive:true});
const observer=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}},{threshold:.12,rootMargin:'0px 0px -4% 0px'});$$('.reveal').forEach(el=>observer.observe(el));

// Preserve a similar slow speed across screen sizes and font metrics.
const toolSet=$('#tool-set-primary'),toolTrack=$('#tools-track');
function sizeToolMarquee(){if(!toolSet||!toolTrack)return;const distance=toolSet.getBoundingClientRect().width;toolTrack.style.setProperty('--toolbox-duration',`${(distance/24).toFixed(2)}s`);}
sizeToolMarquee();
window.addEventListener('resize',sizeToolMarquee,{passive:true});
if('ResizeObserver' in window)new ResizeObserver(sizeToolMarquee).observe(toolSet);
if(!reduce && matchMedia('(pointer:fine)').matches){const hs=heroStar;hero.addEventListener('pointermove',e=>{const r=hero.getBoundingClientRect();const dx=(e.clientX-r.left)/r.width-.5,dy=(e.clientY-r.top)/r.height-.5;hs.style.filter=`drop-shadow(${dx*10}px ${dy*10}px 12px #fff3)`});$$('.tool').forEach(el=>el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;el.style.transform=`perspective(700px) rotateX(${-y*11}deg) rotateY(${x*11}deg) translateY(-5px)`}));$$('.tool').forEach(el=>el.addEventListener('pointerleave',()=>el.style.transform=''));}
// V2.3 Selected Works — pointer depth, staged FLIP opening and full-screen case-study preview.
const dialog=$('#project-dialog'),label=$('#cursor-label'),workCards=$$('.work-card');
const display=$('#experience-display'),artHost=$('#experience-art'),closeButton=$('#close-dialog');
let activeWorkIndex=-1,returnFocus=null,projectMotionToken=0,activeFly=null,projectTransitionRunning=false;
const projectDescriptions=[
 'Exploración conceptual de identidad visual: escala, contraste y un sistema gráfico que se reconoce a primera vista.',
 'Exploración editorial de ritmo, grilla y jerarquías tipográficas. Una demostración, no un proyecto final.',
 'Estudio visual de materialidad, formas y aplicaciones de marca para una pieza de packaging conceptual.',
 'Un ejercicio de experimentación gráfica en blanco y negro, creado para probar la experiencia de navegación.'
];
function removeFly(){if(activeFly){activeFly.remove();activeFly=null}}
function clonedArtwork(card){const artwork=card.querySelector('.work-art').cloneNode(true);artwork.removeAttribute('id');return artwork}
function populateProject(index){
 const card=workCards[index];activeWorkIndex=index;const permalink=$('#case-permalink');if(permalink)permalink.href='/works/'+card.dataset.slug;
 $('#dialog-number').textContent='PROJECT '+card.dataset.number+' / '+String(workCards.length).padStart(2,'0');
 const displayName=card.dataset.name.toUpperCase();
 const title=$('#dialog-title');
 if(/^PROYECTO \d+$/.test(displayName)){
  title.replaceChildren(document.createTextNode('PROYECTO'),document.createElement('br'),document.createTextNode(card.dataset.number));
 }else title.textContent=displayName;
 $('#dialog-type').textContent=card.dataset.type.toUpperCase();
 $('#dialog-description').textContent=card.dataset.description||projectDescriptions[index];
 const following=(index+1)%workCards.length;
 $('#case-next-name').textContent='PROJECT '+workCards[following].dataset.number;
 $('#next-art').replaceChildren(clonedArtwork(workCards[following]));
 $('#case-art-a').replaceChildren(clonedArtwork(card));
 $('#case-art-b').replaceChildren(clonedArtwork(card));
 $('#project-reading-fill').style.width='0%';
 artHost.replaceChildren(clonedArtwork(card));
 $('#next-project').textContent=index===workCards.length-1?'BACK TO PROJECT 01 ↗':'NEXT PROJECT ↗';
}
function flyArtwork(fromRect,toRect,card,reverse=false){
 if(reduce||!fromRect||!toRect||!card)return Promise.resolve();
 removeFly();
 const fly=document.createElement('div');fly.className='project-fly';
 fly.style.cssText=`left:${fromRect.left}px;top:${fromRect.top}px;width:${fromRect.width}px;height:${fromRect.height}px`;
 fly.appendChild(clonedArtwork(card));document.body.appendChild(fly);activeFly=fly;
 const dx=toRect.left-fromRect.left,dy=toRect.top-fromRect.top,sx=toRect.width/Math.max(1,fromRect.width),sy=toRect.height/Math.max(1,fromRect.height);
 const anim=fly.animate([{transform:'translate3d(0,0,0) scale(1,1)',opacity:1},{transform:`translate3d(${dx}px,${dy}px,0) scale(${sx},${sy})`,opacity:1}],{duration:reverse?520:720,easing:'cubic-bezier(.76,0,.24,1)',fill:'forwards'});
 return anim.finished.catch(()=>{}).then(()=>{if(activeFly===fly)removeFly()});
}
function freezePage(state){document.documentElement.style.overflow=state?'hidden':'';document.body.style.overflow=state?'hidden':'';document.querySelector('main').inert=state;header.inert=state;rail.inert=state}
const chapterElements=$$('.case-animate');
const chapterObserver=('IntersectionObserver' in window)?new IntersectionObserver(entries=>{
 entries.forEach(entry=>{if(entry.isIntersecting)entry.target.classList.add('case-inview')});
},{root:dialog,threshold:.13,rootMargin:'0px 0px -6% 0px'}):null;
function resetChapterMotion(){
 chapterElements.forEach(el=>{el.classList.remove('case-inview');if(chapterObserver)chapterObserver.observe(el);else el.classList.add('case-inview')});
 updateProjectProgress();
}
function updateProjectProgress(){if(!dialog.classList.contains('open'))return;
 const available=Math.max(1,dialog.scrollHeight-dialog.clientHeight);
 $('#project-reading-fill').style.width=`${(dialog.scrollTop/available*100).toFixed(2)}%`;
 if(!reduce){
   const chapter=$('#case-chapter').getBoundingClientRect();
   const p=clamp((innerHeight-chapter.top)/Math.max(1,chapter.height+innerHeight));
   $('#case-art-a').style.setProperty('--case-shift-a',`${((p-.5)*-40).toFixed(1)}px`);
   $('#case-art-b').style.setProperty('--case-shift-b',`${((p-.5)*52).toFixed(1)}px`);
 }
}
dialog.addEventListener('scroll',updateProjectProgress,{passive:true});
$('#explore-case').addEventListener('click',()=>$('#case-chapter').scrollIntoView({behavior:reduce?'instant':'smooth',block:'start'}));

async function openProject(index, card=workCards[index]){
 if(projectTransitionRunning||dialog.classList.contains('open'))return;
 const token=++projectMotionToken;projectTransitionRunning=true;returnFocus=card;
 const initialRect=card.querySelector('.work-art').getBoundingClientRect();
 populateProject(index);
 dialog.scrollTop=0;resetChapterMotion();dialog.setAttribute('aria-hidden','false');dialog.classList.add('open');dialog.classList.remove('ready');
 label.classList.remove('show');freezePage(true);
 // Force layout before calculating final FLIP destination.
 void dialog.offsetWidth;
 const targetRect=display.getBoundingClientRect();
 await flyArtwork(initialRect,targetRect,card);
 if(token!==projectMotionToken)return;
 dialog.classList.add('ready');projectTransitionRunning=false;closeButton.focus({preventScroll:true});
}
function swapProject(direction=1){
 if(projectTransitionRunning)return;
 projectTransitionRunning=true;
 const next=(activeWorkIndex+direction+workCards.length)%workCards.length;
 dialog.classList.remove('ready');
 setTimeout(()=>{
  populateProject(next);dialog.scrollTo({top:0,behavior:'instant'});resetChapterMotion();
  requestAnimationFrame(()=>{dialog.classList.add('ready');projectTransitionRunning=false})
 },reduce?0:250);
}
async function closeProject(){
 if(!dialog.classList.contains('open'))return;
 const token=++projectMotionToken;
 projectTransitionRunning=true;
 const source=workCards[activeWorkIndex];
 const targetRect=source?.querySelector('.work-art')?.getBoundingClientRect();
 const fromRect=display.getBoundingClientRect();
 dialog.classList.remove('ready');
 // Reverse hand-off only when the original card is still on screen.
 if(!reduce&&targetRect&&targetRect.right>0&&targetRect.left<innerWidth&&targetRect.bottom>0&&targetRect.top<innerHeight){
  await flyArtwork(fromRect,targetRect,source,true);
 }else if(!reduce){await new Promise(r=>setTimeout(r,260))}
 if(token!==projectMotionToken)return;
 removeFly();dialog.classList.remove('open');dialog.setAttribute('aria-hidden','true');
 freezePage(false);projectTransitionRunning=false;returnFocus?.focus({preventScroll:true});requestScroll();
}
workCards.forEach((card,i)=>{
 card.addEventListener('click',()=>openProject(i,card));
 card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openProject(i,card)}});
 card.addEventListener('pointerenter',()=>{if(!dialog.classList.contains('open'))label.classList.add('show')});
 card.addEventListener('pointerleave',()=>{label.classList.remove('show');card.style.setProperty('--mouse-x','50%');card.style.setProperty('--mouse-y','50%')});
 card.addEventListener('pointermove',e=>{if(reduce)return;const rect=card.querySelector('.work-art').getBoundingClientRect();card.style.setProperty('--mouse-x',`${((e.clientX-rect.left)/rect.width*100).toFixed(1)}%`);card.style.setProperty('--mouse-y',`${((e.clientY-rect.top)/rect.height*100).toFixed(1)}%`)});
});
document.addEventListener('pointermove',e=>{if(label.classList.contains('show'))label.style.transform=`translate3d(${e.clientX+24}px,${e.clientY+20}px,0)`},{passive:true});
closeButton.addEventListener('click',closeProject);
$('#next-project').addEventListener('click',()=>swapProject(1));
$('#prev-project').addEventListener('click',()=>swapProject(-1));
document.addEventListener('keydown',e=>{
 if(!dialog.classList.contains('open'))return;
 if(e.key==='Escape'){e.preventDefault();closeProject();return}
 if(e.key==='ArrowRight' && !projectTransitionRunning){e.preventDefault();swapProject(1);return}
 if(e.key==='ArrowLeft' && !projectTransitionRunning){e.preventDefault();swapProject(-1);return}
 if(e.key==='Tab'){
  const focusable=[...dialog.querySelectorAll('button:not([disabled]),a[href], [tabindex]:not([tabindex="-1"])')].filter(el=>el.getClientRects().length);
  if(!focusable.length)return;
  const first=focusable[0],last=focusable[focusable.length-1];
  if(e.shiftKey&&(document.activeElement===first||!dialog.contains(document.activeElement))){e.preventDefault();last.focus()}
  else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
 }
});
// Direct manipulation: desktop visitors can drag the horizontal gallery as well as scroll.
// Moving left advances to the next project. A real drag never accidentally opens a card.
const workWindow=$('#work-window');
let galleryDrag=null,ignoreGalleryClickUntil=0;
if(!reduce&&matchMedia('(pointer:fine)').matches){
 workWindow.addEventListener('pointerdown',e=>{
  if(e.button!==0||dialog.classList.contains('open'))return;
  const section=$('#works'),available=section.offsetHeight-innerHeight;
  if(available<=0)return;
  galleryDrag={id:e.pointerId,x:e.clientX,y:e.clientY,scroll:window.scrollY,available,moved:false};
 });
 window.addEventListener('pointermove',e=>{
  if(!galleryDrag||e.pointerId!==galleryDrag.id)return;
  const dx=e.clientX-galleryDrag.x;
  if(!galleryDrag.moved&&Math.abs(dx)>8){galleryDrag.moved=true;$('#works-scene').classList.add('is-dragging');label.classList.remove('show');document.body.style.userSelect='none';}
  if(!galleryDrag.moved)return;
  const section=$('#works');
  const startY=section.getBoundingClientRect().top+window.scrollY;
  const desired=galleryDrag.scroll-dx*(galleryDrag.available/Math.max(200,innerWidth*.85));
  window.scrollTo({top:Math.max(startY,Math.min(startY+galleryDrag.available,desired)),behavior:'instant'});
 },{passive:true});
 const finishDrag=e=>{
  if(!galleryDrag||e.pointerId!==galleryDrag.id)return;
  if(galleryDrag.moved){ignoreGalleryClickUntil=performance.now()+250;$('#works-scene').classList.remove('is-dragging');document.body.style.userSelect='';}
  galleryDrag=null;
 };
 window.addEventListener('pointerup',finishDrag);window.addEventListener('pointercancel',finishDrag);
 workWindow.addEventListener('click',e=>{if(performance.now()<ignoreGalleryClickUntil){e.preventDefault();e.stopImmediatePropagation()}},true);
}
// Mobile uses ordinary vertical navigation; entrance reveals retain the same card order.
if('IntersectionObserver' in window){
 const mobileObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('mobile-inview');mobileObserver.unobserve(e.target)}}),{threshold:.12});
 workCards.forEach(card=>mobileObserver.observe(card));
}else workCards.forEach(card=>card.classList.add('mobile-inview'));
$('#contact-link').addEventListener('click',e=>{if(e.currentTarget.dataset.contactReady!=='true'){e.preventDefault();alert('El correo de AS Design Studio todavía no fue proporcionado. Podrás contactarla desde aquí cuando esté configurado.');}});
if(reduce){loader.classList.add('dismissed');document.body.classList.remove('is-loading');hero.classList.add('is-visible');heroStar.classList.add('show');header.classList.add('shown');rail.classList.add('shown');}else startIntro();requestScroll();
}
