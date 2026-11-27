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
// Loader V4.4.2: curva única aprobada (V4 a 0.25x = nuevo 1x).
function segment(a,b,t){return clamp((t-a)/(b-a))}
function smoother(t){t=clamp(t);return t*t*(3-2*t)}
function loaderPath(landing){
 const origin={x:innerWidth+160,y:-180};
 return [origin,
  {x:lerp(origin.x,landing.x,.35),y:lerp(origin.y,landing.y,.08)},
  {x:lerp(origin.x,landing.x,.72),y:lerp(origin.y,landing.y,.30)},landing];
}
function spotOnPath(points,t){return {x:cubic(points[0].x,points[1].x,points[2].x,points[3].x,t),y:cubic(points[0].y,points[1].y,points[2].y,points[3].y,t)}}
function setStar(x,y,scale=1,opacity=1,trail=0,glow=1){
 flight.style.opacity=String(clamp(opacity));
 flight.style.transform=`translate3d(${x}px,${y}px,0) translate(-50%,-50%) scale(${scale})`;
 flight.style.setProperty('--trail',String(clamp(trail)));
 flight.style.setProperty('--trail-length',`${Math.round(190+380*trail)}px`);
 flight.style.setProperty('--glow-opacity',String(clamp(glow)));
 flight.style.setProperty('--star-bloom',`${(3+glow*14).toFixed(1)}px`);
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
const INTRO_FLIGHT=2.56;
const INTRO_SETTLE=.64;
const INTRO_TOTAL=INTRO_FLIGHT+INTRO_SETTLE; // 3.20s aprobado
const INTRO_TYPO_DUR=.34;
const INTRO_TYPO_GAP=.10;
const INTRO_HANDOFF_START=4.05;
const INTRO_HANDOFF_DURATION=.95;
function startIntro(){
 introToken++;cancelAnimationFrame(raf);clearTimeout(dismissTimer);
 const token=introToken;introActive=true;
 window.scrollTo({top:0,behavior:'instant'});
 document.body.classList.add('is-loading');
 hero.classList.remove('is-visible');heroStar.classList.remove('show');
 header.classList.remove('shown');rail.classList.remove('shown');
 loader.className='loader';loader.style.opacity='1';loader.style.backgroundColor='#000';
 flight.style.opacity='0';flight.style.setProperty('--trail','0');
 const frame=$('#card-face'), glow=$('#loader-glow'),fill=$('#meter-fill');
 const typo=[$('#typo-monogram'),$('#typo-name'),$('#typo-country')];
 typo.forEach(el=>{el.style.opacity='0';el.style.transform='translateY(8px)'});
 glow.style.opacity='0';
 fill.style.width='0';$('#loading-label').textContent='REVELANDO IDENTIDAD';$('#loading-progress').textContent='01 / 03';
 frame.style.opacity='1';frame.style.setProperty('--reveal-x','-9999px');frame.style.setProperty('--reveal-y','-9999px');frame.style.setProperty('--reveal-radius','1px');
 const r=card.getBoundingClientRect();
 if(r.width<40 || r.height<40){
  // No iniciar desde un layout sin medidas, evita el salto del primer fotograma.
  raf=requestAnimationFrame(()=>{if(token===introToken)startIntro()});return;
 }
 const landing={x:r.left+r.width*.46,y:r.top+r.height*.46};
 const curve=loaderPath(landing);
 // PNG 736x736 con tarjeta original en x=161..575, y=101..646.
 const photoScale=r.width/414;
 const imageRect={left:r.left-161*photoScale,top:r.top-101*photoScale,size:736*photoScale};
 frame.style.left=`${imageRect.left}px`;
 frame.style.top=`${imageRect.top}px`;
 frame.style.width=`${imageRect.size}px`;
 frame.style.height=`${imageRect.size}px`;
 const heroRect=heroStar.getBoundingClientRect();
 const heroDest={x:heroRect.left+heroRect.width*.5,y:heroRect.top+heroRect.height*.5};
 const heroScale=heroRect.width/Math.max(1,flight.offsetWidth);
 const start=performance.now();
 const flightEndScale=.72;
 const smooth=smoother;
 function updateLighting(pos,radius){
  const radiusPx=radius*(r.height/550);
  frame.style.setProperty('--reveal-x',`${(pos.x-imageRect.left).toFixed(2)}px`);
  frame.style.setProperty('--reveal-y',`${(pos.y-imageRect.top).toFixed(2)}px`);
  frame.style.setProperty('--reveal-radius',`${radiusPx.toFixed(2)}px`);
 }
 function animate(now){
  if(token!==introToken)return;
  const t=(now-start)/1000;
  let pos=landing,scale=flightEndScale,opacity=1,trail=0,light=.10,revealRadius=1100;
  if(t<INTRO_FLIGHT){
   const p=clamp(t/INTRO_FLIGHT),e=easeOut(p);
   pos=spotOnPath(curve,e);scale=lerp(1,flightEndScale,e);
   opacity=smooth(segment(0,.10,p));
   trail=Math.sin(p*Math.PI)*.8;
   light=.50+.42*Math.sin(p*Math.PI);
   revealRadius=80+820*Math.pow(p,3);
  }else if(t<INTRO_TOTAL){
   const sp=clamp((t-INTRO_FLIGHT)/INTRO_SETTLE),se=easeInOut(sp);
   trail=Math.sin(sp*Math.PI)*.10*(1-se);
   light=lerp(.50,.14,se);
   revealRadius=900+200*se;
  }
  // Luz y máscara sincronizadas exactamente con la V4.4.2.
  if(t<INTRO_HANDOFF_START) updateLighting(pos,revealRadius);
  if(t>=INTRO_TOTAL){
   typo.forEach((el,i)=>{
    const v=smooth(segment(INTRO_TOTAL+i*INTRO_TYPO_GAP,INTRO_TOTAL+i*INTRO_TYPO_GAP+INTRO_TYPO_DUR,t));
    el.style.opacity=String(v);el.style.transform=`translateY(${((1-v)*8).toFixed(2)}px)`;
   });
  }
  const textEnd=INTRO_TOTAL+2*INTRO_TYPO_GAP+INTRO_TYPO_DUR;
  const meter=smooth(segment(INTRO_TOTAL,textEnd,t));
  fill.style.width=`${Math.round(meter*100)}%`;
  $('#loading-progress').textContent=t<INTRO_TOTAL?'01 / 03':t<textEnd?'02 / 03':'READY';
  if(t>=textEnd)$('#loading-label').textContent='EXPERIENCIA LISTA';
  const dist=Math.hypot(pos.x-landing.x,pos.y-landing.y);
  glow.style.opacity=String(.25*clamp(1-dist/(Math.max(innerWidth,innerHeight)*.55)));
  glow.style.setProperty('--light-x',`${(pos.x/innerWidth)*100}%`);
  glow.style.setProperty('--light-y',`${(pos.y/innerHeight)*100}%`);
  if(t>=INTRO_HANDOFF_START){
   // El aterrizaje en la tarjeta y el destino del Hero son puntos distintos.
   // Este tramo es independiente del vuelo aprobado, que nunca cambia.
   if(!loader.classList.contains('exiting')){
    loader.classList.add('exiting');loader.style.backgroundColor='transparent';
    hero.classList.add('is-visible');header.classList.add('shown');rail.classList.add('shown');
    document.body.classList.remove('is-loading');
   }
   const p=smooth(clamp((t-INTRO_HANDOFF_START)/INTRO_HANDOFF_DURATION));
   pos={x:lerp(landing.x,heroDest.x,p),y:lerp(landing.y,heroDest.y,p)};
   scale=lerp(flightEndScale,heroScale,p);
   opacity=1-smooth(segment(.64,1,p));
   light=.10*(1-p);
   if(p>.63)heroStar.classList.add('show');
  }
  setStar(pos.x,pos.y,scale,opacity,trail,light);
  if(t>=INTRO_HANDOFF_START+INTRO_HANDOFF_DURATION){endIntro();return;}
  raf=requestAnimationFrame(animate);
 }
 raf=requestAnimationFrame(animate);
}

$('#skip').addEventListener('click',()=>endIntro(true));$('#replay').addEventListener('click',()=>{if(reduce){scrollTo({top:0,behavior:'instant'});return}startIntro()});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&introActive)endIntro(true)});
const sectionIds=['home','exhibition','works','expertise','about','contact'];
function sectionProgress(id){const el=document.getElementById(id),r=el.getBoundingClientRect();return clamp(-r.top/Math.max(1,r.height-innerHeight))}
// Mobile performance: read layouts once, only animate sections near the viewport.
// The desktop's approved 3D choreography remains unchanged.
const mobileMotionMedia=window.matchMedia('(max-width:700px)');
const heroMain=$('#hero-main'),heroLower=$('.hero-lower');
const corridor=$('#gallery-corridor'),galleryLight=$('.gallery-light');
const galleryPosters=$$('.gallery-poster'),galleryOverlay=$('.gallery-overlay'),galleryCount=$('#gallery-count');
const workCardsForScroll=$$('.work-card'),workSceneForScroll=$('#works-scene'),
      workTrackForScroll=$('#work-track'),workWindowForScroll=$('#work-window');
const progressLinks=$$('.progress-rail a');
function isNearViewport(rect,height){return rect.bottom>-height*.12&&rect.top<height*1.12}
function rectProgress(rect,height){return clamp(-rect.top/Math.max(1,rect.height-height))}
function updateScroll(){
 scrollRaf=0;
 const h=innerHeight, mobile=mobileMotionMedia.matches;
 const homeRect=document.getElementById('home').getBoundingClientRect();
 const galleryRect=document.getElementById('exhibition').getBoundingClientRect();
 const worksRect=document.getElementById('works').getBoundingClientRect();
 const hp=rectProgress(homeRect,h),ep=rectProgress(galleryRect,h),wp=rectProgress(worksRect,h);
 if(!reduce){
  if(isNearViewport(homeRect,h)){
   // Desktop keeps the original text scale; mobile avoids an extra large composited layer.
   heroMain.style.transform=mobile?`translate3d(0,${(-hp*64).toFixed(1)}px,0)`:
     `translate3d(0,${-hp*118}px,0) scale(${1+hp*.14})`;
   heroMain.style.opacity=String(1-clamp(hp*(mobile?.82:.88)));
   heroStar.style.transform=mobile?`translate3d(${(hp*64).toFixed(1)}px,${(-hp*52).toFixed(1)}px,0)`:
     `translate3d(${hp*190}px,${-hp*130}px,0) rotate(${hp*-18}deg) scale(${1+hp*.15})`;
   heroLower.style.opacity=String(1-hp);
  }
  if(isNearViewport(galleryRect,h)){
   if(mobile){
    // A lightweight 2D camera move replaces per-frame 3D scaling, Z translation and Y rotation.
    // Only the visible artworks are animated; transforms remain GPU-compositable.
    corridor.style.transform=`translate3d(0,${(lerp(28,-18,ep)).toFixed(1)}px,0)`;
    galleryLight.style.opacity=String(lerp(.32,.74,clamp(ep*2)));
    galleryPosters.forEach((poster,i)=>{
     if(i>2)return; // The other two artworks are display:none on small screens.
     const offset=i-1;
     poster.style.transform=`translate3d(${(offset*ep*-9).toFixed(1)}px,${(-ep*(12+Math.abs(offset)*8)).toFixed(1)}px,0)`;
     poster.style.opacity=String(clamp((ep+.12)*5)*(ep>.87?lerp(1,.65,(ep-.87)/.13):1));
    });
    galleryOverlay.style.transform=`translate3d(0,${(-ep*28).toFixed(1)}px,0)`;
   } else {
    corridor.style.transform=`translate3d(0,${lerp(65,-25,ep)}px,0) scale(${lerp(.8,1.23,ep)})`;
    galleryLight.style.opacity=String(lerp(.28,.95,clamp(ep*2)));
    galleryPosters.forEach((poster,i)=>{
     const offset=i-2;
     poster.style.transform=`translate3d(${offset*ep*-26}px,${-ep*(20+Math.abs(offset)*15)}px,${(ep-.4)*Math.abs(offset)*-75}px) rotateY(${offset*(1-ep)*9}deg) scale(${1+ep*(i===0?.11:.03)})`;
     poster.style.opacity=String(clamp((ep+.09)*5)*(ep>.87?lerp(1,.45,(ep-.87)/.13):1));
    });
    galleryOverlay.style.transform=`translate3d(0,${-ep*55}px,0)`;
   }
   galleryOverlay.style.opacity=String(ep>.74?clamp(1-(ep-.74)*3.6):1);
   galleryCount.textContent=ep<.36?'01 — 04':ep<.72?'02 — 04':'03 — 04';
  }
  if(isNearViewport(worksRect,h)){
   const inWorks=worksRect.top<h*.85&&worksRect.bottom>h*.15;
   workSceneForScroll.classList.toggle('work-active',inWorks);
   if(!mobile){
    const max=Math.max(0,workTrackForScroll.scrollWidth-workWindowForScroll.clientWidth);
    workTrackForScroll.style.transform=`translate3d(${-max*wp}px,0,0)`;
    $('#works-progress-fill').style.width=`${wp*100}%`;
    let nearest=0,best=Infinity;
    workCardsForScroll.forEach((work,i)=>{
     const rect=work.getBoundingClientRect();
     const distance=(rect.left+rect.width*.5-innerWidth*.5)/Math.max(1,innerWidth);
     work.style.setProperty('--art-shift-x',`${(-distance*42).toFixed(1)}px`);
     work.style.setProperty('--art-shift-y',`${(Math.sin((wp+i*.22)*Math.PI)*13).toFixed(1)}px`);
     if(Math.abs(distance)<best){best=Math.abs(distance);nearest=i}
    });
    workCardsForScroll.forEach((work,i)=>work.classList.toggle('is-featured',i===nearest));
    $('#works-counter').textContent=String(nearest+1).padStart(2,'0')+' / '+String(workCardsForScroll.length).padStart(2,'0');
    $('#works-current-label').textContent='PROJECT '+String(nearest+1).padStart(2,'0')+' — SELECTED WORKS';
   }
  }
  const contactRect=document.getElementById('contact').getBoundingClientRect();
  if(isNearViewport(contactRect,h)){
   const cp=clamp((h-contactRect.top)/(h+contactRect.height*.4));
   $('#contact-star').style.transform=`translate3d(${-cp*190}px,${cp*85}px,0) rotate(${cp*10}deg)`;
   $('#contact-outline').classList.toggle('fill',cp>.52);
  }
 }
 // On mobile the progress rail is hidden: don't do its per-section layout work every frame.
 if(!mobile){
  let active='home';
  for(const id of sectionIds)if(document.getElementById(id).getBoundingClientRect().top<h*.48)active=id;
  progressLinks.forEach(link=>{link.classList.toggle('active',link.dataset.target===active);link.setAttribute('aria-current',link.dataset.target===active?'location':'false')});
 }
}
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
function removeFly(){if(activeFly){activeFly.remove();activeFly=null}}
function clonedArtwork(card){const artwork=card.querySelector('.work-art').cloneNode(true);artwork.removeAttribute('id');return artwork}
function caseGalleryCard(card,src,i){
 const button=document.createElement('button');button.type='button';
 button.className='case-piece case-animate';
 button.dataset.artworkOpen=card.dataset.slug;
 button.dataset.artworkIndex=String(i+1);
 button.setAttribute('aria-label',`Ampliar ${card.dataset.name}: pieza ${i+1}`);
 const stage=document.createElement('div');stage.className='case-piece-image';
 const image=document.createElement('img');image.src=src;
 image.alt=`${card.dataset.name} — pieza ${i+1}`;
 image.loading='lazy';image.decoding='async';
 stage.append(image);
 // Directional lighting: use local coordinates so the artwork itself is never stretched.
 if(!reduce && matchMedia('(pointer:fine)').matches){
  button.addEventListener('pointermove',event=>{
   const r=button.getBoundingClientRect();
   button.style.setProperty('--pointer-x',`${((event.clientX-r.left)/r.width*100).toFixed(1)}%`);
   button.style.setProperty('--pointer-y',`${((event.clientY-r.top)/r.height*100).toFixed(1)}%`);
  },{passive:true});
  button.addEventListener('pointerleave',()=>{button.style.removeProperty('--pointer-x');button.style.removeProperty('--pointer-y')});
 }
 const info=document.createElement('div');info.className='case-piece-label';
 const type=document.createElement('span');type.textContent=`EXPLORATION / ${String(i+1).padStart(2,'0')}`;
 const hint=document.createElement('span');hint.textContent='AMPLIAR ↗';
 info.append(type,hint);button.append(stage,info);
 return button;
}
function populateProject(index){
 const card=workCards[index];activeWorkIndex=index;const permalink=$('#case-permalink');if(permalink)permalink.href='/works/'+card.dataset.slug;
 $('#dialog-number').textContent='PROJECT '+card.dataset.number+' / '+String(workCards.length).padStart(2,'0');
 const displayName=card.dataset.name.toUpperCase();
 const title=$('#dialog-title');
 if(/^PROYECTO \d+$/.test(displayName)){
  title.replaceChildren(document.createTextNode('PROYECTO'),document.createElement('br'),document.createTextNode(card.dataset.number));
 }else title.textContent=displayName;
 $('#dialog-type').textContent=card.dataset.type.toUpperCase();
 $('#dialog-description').textContent=card.dataset.description||'';
 const brief=$('#case-brief-text');if(brief)brief.textContent=card.dataset.brief||card.dataset.description||'';
 const following=(index+1)%workCards.length;
 $('#case-next-name').textContent=workCards[following].dataset.name.toUpperCase();
 $('#next-art').replaceChildren(clonedArtwork(workCards[following]));
 const gallery=JSON.parse(card.dataset.gallery||'[]');
 $('#case-showcase').replaceChildren(...gallery.map((src,i)=>caseGalleryCard(card,src,i)));
 const cover=$('#open-cover-art');cover.dataset.artworkOpen=card.dataset.slug;cover.dataset.artworkIndex='0';
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
const chapterElements=()=>$$('.case-animate');
const chapterObserver=('IntersectionObserver' in window)?new IntersectionObserver(entries=>{
 entries.forEach(entry=>{if(entry.isIntersecting)entry.target.classList.add('case-inview')});
},{root:dialog,threshold:.13,rootMargin:'0px 0px -6% 0px'}):null;
function resetChapterMotion(){
 chapterElements().forEach(el=>{el.classList.remove('case-inview');if(chapterObserver)chapterObserver.observe(el);else el.classList.add('case-inview')});
 updateProjectProgress();
}
function updateProjectProgress(){if(!dialog.classList.contains('open'))return;
 const available=Math.max(1,dialog.scrollHeight-dialog.clientHeight);
 $('#project-reading-fill').style.width=`${(dialog.scrollTop/available*100).toFixed(2)}%`;
 if(!reduce){
   const chapter=$('#case-chapter').getBoundingClientRect();
   const p=clamp((innerHeight-chapter.top)/Math.max(1,chapter.height+innerHeight));
   $('#case-showcase')?.style.setProperty('--gallery-shift',`${((p-.5)*-22).toFixed(1)}px`);
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
 if(!dialog.classList.contains('open')||document.querySelector('[data-artwork-lightbox="open"]'))return;
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
