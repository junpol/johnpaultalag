// Year
document.getElementById('year').textContent = new Date().getFullYear();

// Parallax hero
const heroBg = document.querySelector('.hero-bg');
window.addEventListener('scroll', ()=>{
  const y = window.scrollY * 0.15;
  heroBg.style.transform = `translateY(${y}px)`;
}, {passive:true});

// Theme & accent
const root = document.documentElement;
const savedTheme = localStorage.getItem('theme'); if(savedTheme) root.setAttribute('data-theme', savedTheme);
const savedAccent = localStorage.getItem('accent'); if(savedAccent) root.setAttribute('data-accent', savedAccent);
document.getElementById('theme-toggle').addEventListener('click', ()=>{
  const cur = root.getAttribute('data-theme') || 'light';
  const nxt = cur === 'light' ? 'dark' : 'light';
  root.setAttribute('data-theme', nxt); localStorage.setItem('theme', nxt);
});
document.querySelectorAll('.swatch').forEach(b=> b.addEventListener('click', ()=>{
  root.setAttribute('data-accent', b.dataset.accent);
  localStorage.setItem('accent', b.dataset.accent);
}));

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{
  const id=a.getAttribute('href'); if(id.length>1){ e.preventDefault(); document.querySelector(id)?.scrollIntoView({behavior:'smooth'}); }
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
