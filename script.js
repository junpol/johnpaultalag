// Year
document.getElementById('year').textContent = new Date().getFullYear();

// Parallax hero
const heroBg = document.querySelector('.hero-bg');
window.addEventListener('scroll', ()=>{
  const y = window.scrollY * 0.15;
  if(heroBg) heroBg.style.transform = `translateY(${y}px)`;
}, {passive:true});

// Theme & accent
const root = document.documentElement;
const savedTheme = localStorage.getItem('theme'); if(savedTheme) root.setAttribute('data-theme', savedTheme);
const savedAccent = localStorage.getItem('accent'); if(savedAccent) root.setAttribute('data-accent', savedAccent);

// Dual theme toggles (desktop + mobile)
function toggleTheme(){
  withThemeFade(()=>{
  const cur = root.getAttribute('data-theme') || 'light';
  const nxt = cur === 'light' ? 'dark' : 'light';
  root.setAttribute('data-theme', nxt); localStorage.setItem('theme', nxt);
  });
}
document.getElementById('theme-toggle')?.addEventListener('click', toggleTheme);
document.getElementById('theme-toggle-mobile')?.addEventListener('click', toggleTheme);

// Accent swatches
document.querySelectorAll('.swatch').forEach(b=> b.addEventListener('click', ()=>{
  root.setAttribute('data-accent', b.dataset.accent);
  localStorage.setItem('accent', b.dataset.accent);
}));

// Mobile menu
const menuBtn = document.getElementById('menu-toggle');
if(menuBtn){
  menuBtn.addEventListener('click', ()=>{
    const open = document.body.classList.toggle('menu-open');
    menuBtn.setAttribute('aria-expanded', String(open));
  });
  // Close on link click
  document.querySelectorAll('#site-menu a').forEach(a=> a.addEventListener('click', ()=>{
    document.body.classList.remove('menu-open');
    menuBtn.setAttribute('aria-expanded', 'false');
  }));
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{
  const id=a.getAttribute('href'); if(id && id.length>1){ e.preventDefault(); document.querySelector(id)?.scrollIntoView({behavior:'smooth'}); }
}));

// Toasts
function toast(text){
  const wrap = document.getElementById('toasts');
  const t = document.createElement('div');
  t.className = 'toast'; t.textContent = text;
  wrap.appendChild(t);
  requestAnimationFrame(()=> t.classList.add('show'));
  setTimeout(()=>{ t.classList.remove('show'); setTimeout(()=> t.remove(), 300); }, 2200);
}
const styleToast = document.createElement('style');
styleToast.textContent = `#toasts{position:fixed;right:18px;bottom:18px;display:grid;gap:8px;z-index:1000}
.toast{background:var(--ink);color:var(--paper-true);padding:10px 12px;border-radius:10px;box-shadow:0 10px 22px rgba(0,0,0,.18);opacity:0;transform:translateY(10px);transition:all .3s}
.toast.show{opacity:1;transform:translateY(0)}`;
document.head.appendChild(styleToast);

// Copy email
['email-copy','email-copy-2'].forEach(id=>{
  const el = document.getElementById(id); if(!el) return;
  el.addEventListener('click', async ()=>{
    const email = el.dataset.email;
    try{ await navigator.clipboard.writeText(email); toast('Email copied ✓'); }
    catch{ toast('Email: '+email); }
  });
});

// Counters
function animateCounter(el){ const target = +el.dataset.count || 0; let n=0; const step = Math.max(1, Math.floor(target/40));
  const t=()=>{ n+=step; if(n>=target) n=target; el.textContent=String(n); if(n<target) requestAnimationFrame(t); }; t();}
const counters = document.querySelectorAll('.stat span');
const cObs = new IntersectionObserver((es)=>{ es.forEach(e=>{ if(e.isIntersecting){ animateCounter(e.target); cObs.unobserve(e.target); } })},{threshold:.8});
counters.forEach(c=> cObs.observe(c));

// Reveal on scroll
const reveals = document.querySelectorAll('.reveal');
const rObs = new IntersectionObserver((es)=>{ es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); rObs.unobserve(e.target); } })},{threshold:.2});
reveals.forEach(el=> rObs.observe(el));

// CAI Modals
document.querySelectorAll('[data-modal]').forEach(card=>{
  card.addEventListener('click', ()=> document.getElementById(card.dataset.modal).showModal());
});
document.querySelectorAll('.modal').forEach(d=>{
  d.addEventListener('click', (e)=>{ if(e.target === d) d.close(); });
});

// Lightbox galleries
const GALLERIES = {
  framing: ['assets/project1.svg','https://picsum.photos/id/1025/1200/800','https://picsum.photos/id/1005/1200/800'],
  nba: ['assets/project2.svg','https://picsum.photos/id/1043/1200/800','https://picsum.photos/id/1037/1200/800'],
  kp: ['assets/project3.svg','https://picsum.photos/id/1050/1200/800','https://picsum.photos/id/1052/1200/800']
};
const lightbox = document.getElementById('lightbox');
const lbImg = document.querySelector('.lb-img'); let current=0,activeKey=null;
function openLightbox(key, idx=0){ activeKey=key; current=idx; lbImg.src = GALLERIES[key][current]; lightbox.setAttribute('aria-hidden','false'); }
function closeLightbox(){ lightbox.setAttribute('aria-hidden','true'); }
function next(){ if(!activeKey) return; current=(current+1)%GALLERIES[activeKey].length; lbImg.src = GALLERIES[activeKey][current]; }
function prev(){ if(!activeKey) return; current=(current-1+GALLERIES[activeKey].length)%GALLERIES[activeKey].length; lbImg.src = GALLERIES[activeKey][current]; }
document.querySelectorAll('[data-gallery]').forEach(tile=> tile.addEventListener('click', ()=> openLightbox(tile.dataset.gallery,0)));
document.querySelector('.lb-close').addEventListener('click', closeLightbox);
document.querySelector('.lb-next').addEventListener('click', next);
document.querySelector('.lb-prev').addEventListener('click', prev);
lightbox.addEventListener('click', (e)=>{ if(e.target === lightbox) closeLightbox(); });

// Impact meters animation
const meters = document.querySelectorAll('.meter:not(.count)');
const mObs = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      const el = e.target;
      const pct = Math.max(0, Math.min(100, parseInt(el.dataset.percent||'0',10)));
      let cur = 0;
      const sweep = ()=>{
        cur += Math.max(1, Math.ceil(pct/40));
        if(cur > pct) cur = pct;
        el.style.background = `conic-gradient(var(--brand) ${3.6*cur}deg, var(--line) 0deg)`;
        if(cur < pct) requestAnimationFrame(sweep);
      };
      sweep();
      mObs.unobserve(el);
    }
  });
},{threshold:.6});
meters.forEach(m=> mObs.observe(m));

// Count meter hookup
document.querySelectorAll('.meter.count span').forEach(s=>{
  s.dataset.count = s.parentElement.dataset.count;
  const target = +s.dataset.count || 0; let n=0; const step = Math.max(1, Math.floor(target/40));
  const t=()=>{ n+=step; if(n>=target) n=target; s.textContent = (n).toString(); if(n<target) requestAnimationFrame(t); }; 
  const io = new IntersectionObserver(es=>{ es.forEach(x=>{ if(x.isIntersecting){ t(); io.unobserve(s); } }); },{threshold:.6});
  io.observe(s);
});

// Contact form handling (mailto + clipboard fallback)
const form = document.getElementById('contactForm');
const copyBtn = document.getElementById('copyMessage');
if(form){
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const name = (document.getElementById('name')?.value || '').trim();
    const email = (document.getElementById('email')?.value || '').trim();
    const message = (document.getElementById('message')?.value || '').trim();
    const subject = `Portfolio inquiry from ${name}`;
    const body = `Name: ${name}%0D%0AEmail: ${email}%0D%0A%0D%0A${encodeURIComponent(message)}`;
    const mailto = `mailto:johnpaultalag@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;
    try{
      window.location.href = mailto;
      toast('Opening email…');
    }catch{
      toast('Could not open email app');
    }
  });
}
if(copyBtn){
  copyBtn.addEventListener('click', async ()=>{
    const name = (document.getElementById('name')?.value || '').trim();
    const email = (document.getElementById('email')?.value || '').trim();
    const message = (document.getElementById('message')?.value || '').trim();
    const text = `Inquiry via portfolio\nName: ${name}\nEmail: ${email}\n\n${message}`;
    try{ await navigator.clipboard.writeText(text); toast('Message copied ✓'); }
    catch{ toast('Copy not available'); }
  });
}


// Scroll progress indicator
window.addEventListener('scroll', ()=>{
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrolled = (window.scrollY / docHeight) * 100;
  document.documentElement.style.setProperty('--scroll-progress', scrolled + '%');
},{passive:true});



// --- Staggered reveal logic ---
function applyStagger(container){
  if(!container) return;
  container.classList.add('stagger');
  Array.from(container.children).forEach((child, i)=> child.setAttribute('data-i', i));
}
// mark key containers
applyStagger(document.querySelector('.cards'));
applyStagger(document.querySelector('.gallery'));
applyStagger(document.querySelector('.timeline'));

// Observer to toggle stagger class
const staggers = document.querySelectorAll('.stagger');
const sObs = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('in');
      sObs.unobserve(e.target);
    }
  });
},{threshold:.18});
staggers.forEach(el=> sObs.observe(el));

// --- Scroll progress indicator ---
const progressEl = document.querySelector('.scroll-progress span');
function setProgress(){
  if(!progressEl) return;
  const h = document.documentElement;
  const max = (h.scrollHeight - h.clientHeight);
  const top = (h.scrollTop || document.body.scrollTop);
  const pct = max > 0 ? top / max : 0;
  progressEl.style.width = (pct * 100).toFixed(2) + '%';
}
window.addEventListener('scroll', setProgress, {passive:true});
window.addEventListener('load', setProgress);



// --- Back to top ---
const backBtn = document.getElementById('backToTop');
function onScrollTopBtn(){
  if(!backBtn) return;
  const show = (window.scrollY || document.documentElement.scrollTop) > 420;
  backBtn.classList.toggle('show', show);
}
window.addEventListener('scroll', onScrollTopBtn, {passive:true});
window.addEventListener('load', onScrollTopBtn);
backBtn?.addEventListener('click', ()=> window.scrollTo({top:0, behavior:'smooth'}));

// --- Theme fade helper ---
function withThemeFade(fn){
  document.documentElement.classList.add('theme-xfade');
  try{ fn(); } finally {
    setTimeout(()=> document.documentElement.classList.remove('theme-xfade'), 260);
  }
}


// === Reliable observers v2 ===
// Helper to check if element is in viewport
function inViewport(el){
  const r = el.getBoundingClientRect();
  return r.top < (window.innerHeight * 0.9) && r.bottom > 0;
}

// Counters (About stats)
(function(){
  const counters = document.querySelectorAll('.stat span');
  if(!counters.length) return;
  function animateCounter(el){ 
    const target = +el.dataset.count || +el.textContent || 0; 
    if(!target){ return; }
    let n = 0; const step = Math.max(1, Math.floor(target/40));
    const t=()=>{ n += step; if(n >= target) n = target; el.textContent = String(n); if(n < target) requestAnimationFrame(t); };
    t();
  }
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ animateCounter(e.target); io.unobserve(e.target); } });
  }, { threshold: .35, rootMargin: "0px 0px -10% 0px" });
  counters.forEach(c=>{
    // Ensure data-count is present from parent .stat
    if(!c.dataset.count && c.parentElement?.dataset.count){
      c.dataset.count = c.parentElement.dataset.count;
    }
    if(inViewport(c)) animateCounter(c); else io.observe(c);
  });
})();

// Impact meters (circle % + count)
(function(){
  const meters = document.querySelectorAll('.meter:not(.count)');
  function sweepMeter(el){
    const pct = Math.max(0, Math.min(100, parseInt(el.dataset.percent||'0',10)));
    let cur = 0;
    const sweep = ()=>{
      cur += Math.max(1, Math.ceil(pct/40));
      if(cur > pct) cur = pct;
      el.style.background = `conic-gradient(var(--brand) ${3.6*cur}deg, var(--line) 0deg)`;
      if(cur < pct) requestAnimationFrame(sweep);
    };
    sweep();
  }
  const ioM = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ sweepMeter(e.target); ioM.unobserve(e.target);} });
  }, { threshold: .25, rootMargin: "0px 0px -10% 0px" });
  meters.forEach(m=>{ if(inViewport(m)) sweepMeter(m); else ioM.observe(m); });

  const countSpans = document.querySelectorAll('.meter.count span');
  function animateCountSpan(s){
    const target = +(s.dataset.count || s.parentElement?.dataset.count || 0);
    if(!target){ s.textContent = '0'; return; }
    let n=0; const step = Math.max(1, Math.floor(target/40));
    const t=()=>{ n+=step; if(n>=target) n=target; s.textContent = String(n); if(n<target) requestAnimationFrame(t); };
    t();
  }
  const ioC = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ animateCountSpan(e.target); ioC.unobserve(e.target);} });
  }, { threshold: .25, rootMargin: "0px 0px -10% 0px" });
  countSpans.forEach(s=>{
    if(!s.dataset.count && s.parentElement?.dataset.count){
      s.dataset.count = s.parentElement.dataset.count;
    }
    if(inViewport(s)) animateCountSpan(s); else ioC.observe(s);
  });
})();
