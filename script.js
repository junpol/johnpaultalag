// Year
const _yEl = document.getElementById('year'); if(_yEl) _yEl.textContent = new Date().getFullYear();

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
  withThemeFade(()=>{
    root.setAttribute('data-accent', b.dataset.accent);
    localStorage.setItem('accent', b.dataset.accent);
  });
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


// === Active section nav highlight ===
(function(){
  const sections = ['home','about','work','projects','impact','experience','contact',];
  const links = Array.from(document.querySelectorAll('.links a'));
  function update(){
    let current = 'home';
    const scrollY = window.scrollY + 120; // offset for sticky nav
    sections.forEach(id=>{
      const el = document.getElementById(id);
      if(!el) return;
      const top = el.offsetTop;
      if(scrollY >= top) current = id;
    });
    links.forEach(a=>{
      const href = a.getAttribute('href')||'';
      const id = href.startsWith('#') ? href.slice(1) : '';
      const isActive = id === current;
      a.classList.toggle('active', isActive);
      a.setAttribute('aria-current', isActive ? 'page' : 'false');
    });
  }
  window.addEventListener('scroll', update, {passive:true});
  window.addEventListener('load', update);
})();

// === Keyboard shortcuts ===
// t: theme toggle, m: mobile menu, g: go top, c: contact, ?: help
(function(){
  function isTyping(){ return ['INPUT','TEXTAREA'].includes(document.activeElement?.tagName); }
  document.addEventListener('keydown', (e)=>{
    if(isTyping() || e.metaKey || e.ctrlKey || e.altKey) return;
    if(e.key === 't'){ e.preventDefault(); document.getElementById('theme-toggle')?.click(); }
    if(e.key === 'm'){ e.preventDefault(); document.getElementById('menu-toggle')?.click(); }
    if(e.key === 'g'){ e.preventDefault(); window.scrollTo({top:0, behavior:'smooth'}); }
    if(e.key.toLowerCase() === 'c'){ e.preventDefault(); document.getElementById('contact')?.scrollIntoView({behavior:'smooth'}); }
    if(false){}
  });
})();

// === Command Palette ===
(function(){
  const root = document.documentElement;
  const cmd = document.getElementById('cmdk');
  const input = document.getElementById('cmdk-input');
  const list = document.getElementById('cmdk-list');
  if(!cmd || !input || !list) return;

  const actions = [
    {label:'Go: Home', k:'↵', fn:()=>document.getElementById('home')?.scrollIntoView({behavior:'smooth'})},
    {label:'Go: About', k:'↵', fn:()=>document.getElementById('about')?.scrollIntoView({behavior:'smooth'})},
    {label:'Go: Selected Work', k:'↵', fn:()=>document.getElementById('work')?.scrollIntoView({behavior:'smooth'})},
    {label:'Go: Projects', k:'↵', fn:()=>document.getElementById('projects')?.scrollIntoView({behavior:'smooth'})},
    {label:'Go: Impact', k:'↵', fn:()=>document.getElementById('impact')?.scrollIntoView({behavior:'smooth'})},
    {label:'Go: Experience', k:'↵', fn:()=>document.getElementById('experience')?.scrollIntoView({behavior:'smooth'})},
    {label:'Go: Contact', k:'↵', fn:()=>document.getElementById('contact')?.scrollIntoView({behavior:'smooth'})},
    {label:'Toggle theme', k:'t', fn:()=>document.getElementById('theme-toggle')?.click()},
    {label:'Switch accent', k:'', fn:()=>{
      const acc=['graphite','coral','indigo','emerald'];
      const cur=root.getAttribute('data-accent')||acc[0];
      const i=(acc.indexOf(cur)+1)%acc.length; root.setAttribute('data-accent',acc[i]); localStorage.setItem('accent',acc[i]);
    }},
    {label:'Copy email', k:'⧉', fn:()=>navigator.clipboard?.writeText('johnpaultalag@gmail.com').then(()=>toast('Email copied ✓')).catch(()=>toast('johnpaultalag@gmail.com'))},
    {label:'Open LinkedIn', k:'↗', fn:()=>window.open('https://www.linkedin.com/in/johnpaultalag','_blank')},
    {label:'Open GitHub', k:'↗', fn:()=>window.open('https://github.com/junpol','_blank')},
    {label:'Download resume', k:'⬇', fn:()=>window.open('resume.pdf','_blank')},
    {label:'Back to top', k:'g', fn:()=>window.scrollTo({top:0, behavior:'smooth'})}
  ];

  let items = actions.slice();
  let iSel = 0;

  function render(arr){
    list.innerHTML = '';
    arr.forEach((a, i)=>{
      const li = document.createElement('li');
      li.setAttribute('role','option');
      li.setAttribute('aria-selected', String(i === iSel));
      li.innerHTML = `<span>${a.label}</span><span class="k">${a.k||''}</span>`;
      li.addEventListener('mousemove', ()=>{ iSel = i; highlight(); });
      li.addEventListener('click', ()=>{ a.fn(); close(); });
      list.appendChild(li);
    });
  }
  function highlight(){
    Array.from(list.children).forEach((el, j)=> el.setAttribute('aria-selected', String(j===iSel)));
  }
  function open(){
    cmd.setAttribute('aria-hidden','false');
    input.value=''; iSel=0; render(items); highlight();
    setTimeout(()=> input.focus(), 10);
  }
  function close(){
    cmd.setAttribute('aria-hidden','true');
  }

  function filter(q){
    const s = q.trim().toLowerCase();
    items = s ? actions.filter(a => a.label.toLowerCase().includes(s)) : actions.slice();
    iSel = 0; render(items); highlight();
  }

  input.addEventListener('input', ()=> filter(input.value));
  input.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape'){ e.preventDefault(); close(); }
    if(e.key === 'ArrowDown'){ e.preventDefault(); iSel = Math.min(iSel+1, items.length-1); highlight(); }
    if(e.key === 'ArrowUp'){ e.preventDefault(); iSel = Math.max(iSel-1, 0); highlight(); }
    if(e.key === 'Enter'){ e.preventDefault(); items[iSel]?.fn?.(); close(); }
  });

  cmd.addEventListener('click', (e)=>{ if(e.target.classList.contains('cmdk-backdrop')) close(); });

  function isTyping(){ return ['INPUT','TEXTAREA'].includes(document.activeElement?.tagName); }
  document.addEventListener('keydown', (e)=>{
    if(e.metaKey && e.key.toLowerCase()==='k'){ e.preventDefault(); open(); return; }
    if(!isTyping() && e.key.toLowerCase()==='k'){ e.preventDefault(); open(); }
  });
})();

// === Tilt effect ===
(function(){
  const els = document.querySelectorAll('.tilt');
  els.forEach(el=>{
    let rect = null;
    function onMove(e){
      rect = rect || el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rx = (0.5 - y) * 6; // tilt range
      const ry = (x - 0.5) * 8;
      el.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
    }
    function onLeave(){ el.style.transform = ''; rect = null; }
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
  });
})();

// =================== Feature: Timeline Scrubber ===================
(function(){
  const exp = document.getElementById('experience');
  if(!exp) return;
  const head = exp.querySelector('.section-head') || exp.querySelector('h2')?.parentElement || exp;
  const scrub = document.createElement('div');
  scrub.className = 'exp-scrubber';
  scrub.innerHTML = `
    <span class="exp-year" id="expYear">—</span>
    <input id="expRange" type="range" min="0" max="0" step="1" value="0" aria-label="Experience timeline">
  `;
  head.appendChild(scrub);
  const rows = exp.querySelectorAll('.timeline .row');
  if(!rows.length){ scrub.style.display='none'; return; }
  const range = scrub.querySelector('#expRange');
  const yearLabel = scrub.querySelector('#expYear');
  range.max = String(rows.length - 1);
  function updateFromIndex(i){
    i = Math.max(0, Math.min(rows.length-1, i));
    const row = rows[i];
    row.scrollIntoView({behavior:'smooth', block:'center'});
    const year = row.querySelector('.left')?.textContent.trim() || '';
    yearLabel.textContent = year || '—';
    range.value = String(i);
  }
  range.addEventListener('input', ()=> updateFromIndex(parseInt(range.value,10)||0));
  const obs = new IntersectionObserver((entries)=>{
    const visible = entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio - a.intersectionRatio);
    if(!visible.length) return;
    const idx = Array.from(rows).indexOf(visible[0].target);
    const year = visible[0].target.querySelector('.left')?.textContent.trim() || '—';
    yearLabel.textContent = year;
    range.value = String(idx);
  }, {rootMargin:'-40% 0px -40% 0px', threshold:[0,0.25,0.5,0.75,1]});
  rows.forEach(r => obs.observe(r));
})();

// =================== Feature: AMA Buttons & Modal ===================
(function(){
  const work = document.getElementById('work');
  const amaModal = document.getElementById('amaModal');
  const amaList = amaModal ? document.getElementById('amaList') : null;
  const amaTitle = amaModal ? document.getElementById('amaTitle') : null;
  const amaChip = document.getElementById('amaChip');
  if(!work || !amaModal || !amaList || !amaTitle || !amaChip) return;

  function getQA(title){
    const generic = [
      ["How did you validate controls?", "Mapped design→operation, sampled evidence, tied exceptions to risk statements, and documented reproducible steps."],
      ["What failed first and why?", "Initial access review showed stale accounts due to deprovisioning gaps; tightened joiner/mover/leaver controls and reminders."],
      ["What did you automate?", "Checklists/templates; Power BI & DataSnipper to speed reconciliation, sampling, and evidence capture."],
      ["How did you measure impact?", "Fewer QC issues, faster reviews, and on‑time delivery; documented before/after where possible."],
      ["What would you do differently?", "Align earlier on 'sufficient evidence' and owner responsibilities to avoid late surprises."],
      ["How is this transferable?", "Same approach applies across controls/analytics: clarify, test, document, iterate."]
    ];
    // Light keyword tailoring
    if(title && /Realty Income|Internal Audit/i.test(title)){
      generic.unshift(["How did you test ITGCs/ELCs?", "Followed control matrix; sampled & traced to criteria; documented in AuditBoard; coordinated PBCs."]);
    }
    if(title && /Research|Lab|UC San Diego/i.test(title)){
      generic.unshift(["What did you analyze?", "Experimental econ data; ran regressions/visuals; ensured reproducibility and clarity of code."]);
    }
    return generic;
  }

  function openAMA(forEl){
    let title = "Project";
    const h = forEl?.querySelector?.('h3,h4,h2') || forEl?.closest?.('dialog')?.querySelector('h3,h4,h2');
    if(h) title = h.textContent.trim();
    amaTitle.textContent = "Ask Me Anything — " + title;
    amaList.innerHTML = "";
    const qa = getQA(title);
    qa.forEach(([q,a], i)=>{
      const div = document.createElement('div'); div.className = 'ama-item'; div.setAttribute('role','listitem'); div.id = 'ama-q'+(i+1);
      div.innerHTML = `<h4>${q}</h4><p>${a}</p>`;
      amaList.appendChild(div);
    });
    amaModal.showModal();
  }

  // Add visible AMA pills next to each project title in #work
  const titleEls = work.querySelectorAll('h3, h4');
  titleEls.forEach(t => {
    if(t.parentElement.querySelector('.ama-btn')) return;
    const btn = document.createElement('button');
    btn.className = 'ama-btn';
    btn.type = 'button';
    btn.title = 'Curated Q&A about this project';
    btn.innerHTML = '<span class="dot"></span><span>AMA</span>';
    btn.addEventListener('click', (e)=>{ e.preventDefault(); openAMA(t.closest('.card, .row, section, article') || work); });
    t.insertAdjacentElement('afterend', btn);
  });

  // Duplicate AMA pill inside each modal header (after <h3>)
  document.querySelectorAll('dialog.modal').forEach(d => {
    const h = d.querySelector('h3');
    if(!h || d.querySelector('.ama-btn')) return;
    const btn = document.createElement('button');
    btn.className = 'ama-btn';
    btn.type = 'button';
    btn.title = 'Curated Q&A about this project';
    btn.innerHTML = '<span class="dot"></span><span>AMA</span>';
    btn.addEventListener('click', (e)=>{ e.preventDefault(); openAMA(d); });
    h.insertAdjacentElement('afterend', btn);
  });

  // Sticky "Questions?" chip: shows when a project is in view; opens AMA for the most visible card
  const cards = work.querySelectorAll('.card, .row, article, section');
  const vis = new Map();
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e => vis.set(e.target, e.isIntersecting ? e.intersectionRatio : 0));
    const top = Array.from(vis.entries()).sort((a,b)=>b[1]-a[1])[0];
    const hasVisible = top && top[1] > 0.2;
    amaChip.setAttribute('aria-hidden', hasVisible ? 'false' : 'true');
    amaChip.onclick = hasVisible ? ()=> openAMA(top[0]) : null;
  }, {rootMargin:'-20% 0px -20% 0px', threshold:[0,0.25,0.5,0.75,1]});
  cards.forEach(c => io.observe(c));
})();




// A11y additions: keyboard activation for cards and tiles
document.querySelectorAll('.card[role="button"], .tile[role="button"]').forEach(el=>{
  el.addEventListener('keydown', (e)=>{
    if(e.key === 'Enter' || e.key === ' '){
      e.preventDefault();
      const modalId = el.getAttribute('data-modal');
      if(modalId){ document.getElementById(modalId)?.showModal(); }
      const gal = el.getAttribute('data-gallery');
      if(gal){ openLightbox(gal, 0); }
    }
  });
});

// Reduced motion guard
const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if(prefersReduced){
  // Disable tilt handlers if present
  document.querySelectorAll('.tilt').forEach(el=>{
    el.onmousemove = null;
    el.onmouseleave = null;
  });
  if(heroBg){ heroBg.style.transform = ''; window.removeEventListener('scroll', ()=>{}); }
}

// Dialog focus management
document.querySelectorAll('dialog[aria-modal="true"]').forEach(dlg=>{
  dlg.addEventListener('close', ()=>{
    const opener = document.querySelector('[data-modal="'+ dlg.id +'"]');
    opener?.focus();
  });
  dlg.addEventListener('cancel', ()=>{
    const opener = document.querySelector('[data-modal="'+ dlg.id +'"]');
    opener?.focus();
  });
  dlg.addEventListener('show', ()=>{
    dlg.querySelector('button,[href],[tabindex="0"]')?.focus();
  });
});



// Interactive Data Demo Chart.js
document.addEventListener('DOMContentLoaded', ()=>{
  const ctx = document.getElementById('demoChart')?.getContext('2d');
  if(ctx){
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Before', 'After'],
        datasets: [{
          label: 'Data Accuracy (%)',
          data: [78, 93],
          backgroundColor: ['#ccc', '#4F46E5']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          title: { display: true, text: 'Cleaner Data Impact' }
        },
        scales: {
          y: { beginAtZero: true, max: 100 }
        }
      }
    });
  }
});



// HERO BG FADE-IN
window.addEventListener('load', ()=>{ try{ document.querySelector('.hero-bg')?.classList.add('show'); }catch(e){} });

// Footer last updated
const lu = document.getElementById('lastUpdated');
if(lu){
  const d = new Date();
  lu.textContent = d.toLocaleDateString(undefined, { year: 'numeric', month: 'short' });
}

// Hero playful animation (complexity -> clarity)
const anim = document.querySelector('.hero-animation');
if(anim){
  anim.innerHTML = '<div class="dots"></div>';
  setTimeout(()=>{
    anim.innerHTML = '<div class="checkmark">✓</div>';
  }, 1800);
}

// Modal close handlers (× button + backdrop)
document.querySelectorAll('.modal').forEach(dlg=>{
  dlg.querySelector('.modal-close')?.addEventListener('click', ()=> dlg.close());
  dlg.addEventListener('keydown', (e)=>{ if(e.key==='Escape') dlg.close(); });
  dlg.addEventListener('click', (e)=>{ if(e.target === dlg) dlg.close(); });
});


// === Robust Modals (with fallback) ===
(function(){
  function openDlgById(id){
    const dlg = document.getElementById(id);
    if(!dlg) return;
    try{
      if(typeof dlg.showModal === 'function'){ dlg.showModal(); }
      else {
        dlg.setAttribute('open','');
        dlg.setAttribute('aria-hidden','false');
        document.body.classList.add('modal-open');
      }
    }catch{
      dlg.setAttribute('open','');
      dlg.setAttribute('aria-hidden','false');
      document.body.classList.add('modal-open');
    }
  }
  function closeDlg(dlg){
    if(!dlg) return;
    try{ if(typeof dlg.close === 'function') dlg.close(); }catch{}
    dlg.removeAttribute('open');
    dlg.setAttribute('aria-hidden','true');
    document.body.classList.remove('modal-open');
  }

  // Open on click or Enter/Space
  document.querySelectorAll('[data-modal]').forEach(card=>{
    const id = card.dataset.modal;
    card.addEventListener('click', ()=> openDlgById(id));
    card.addEventListener('keydown', (e)=>{
      if(e.key === 'Enter' || e.key === ' '){
        e.preventDefault();
        openDlgById(id);
      }
    });
  });

  // Close handlers
  document.querySelectorAll('.modal').forEach(dlg=>{
    // close button
    dlg.querySelector('.modal-close')?.addEventListener('click', ()=> closeDlg(dlg));
    // backdrop / click-out
    dlg.addEventListener('click', (e)=>{ if(e.target === dlg) closeDlg(dlg); });
    // ESC
    dlg.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') closeDlg(dlg); });
  });
})();



// === Scrollspy ===
(function(){
  try{
    const links = Array.from(document.querySelectorAll('#site-menu a[href^="#"]'));
    if(!links.length) return;
    const map = new Map(links.map(a=> [a.getAttribute('href').slice(1), a]));
    const sections = Array.from(document.querySelectorAll('section[id]')).filter(s=> map.has(s.id));
    const setActive = (id)=>{
      map.forEach(a=>{ a.removeAttribute('aria-current'); a.classList.remove('active'); });
      const a = map.get(id); if(a){ a.setAttribute('aria-current','true'); a.classList.add('active'); }
    };
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(en=>{ if(en.isIntersecting){ setActive(en.target.id); } });
    }, {root:null, rootMargin: '-30% 0px -65% 0px', threshold: 0.01});
    sections.forEach(s=> io.observe(s));
    window.addEventListener('load', ()=>{
      const cur = sections.find(s=> s.getBoundingClientRect().top >= 0) || sections[0];
      if(cur) setActive(cur.id);
    });
  }catch(e){}
})();

// === Shortcuts overlay ('?') ===
(function(){
  try{
    const dlg = document.getElementById('shortcuts');
    if(!dlg) return;
    dlg.querySelector('.modal-close')?.addEventListener('click', ()=> dlg.close());
    document.addEventListener('keydown', (e)=>{
      const tag = (e.target?.tagName||'').toLowerCase();
      if(tag === 'input' || tag === 'textarea') return;
      if(e.key === '?'){ e.preventDefault(); if(typeof dlg.showModal === 'function'){ dlg.showModal(); } else { dlg.setAttribute('open',''); } }
    });
  }catch(e){}
})();



// Intro overlay logic (shows once per session) — type & delete version
(function(){
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const overlay = document.getElementById('intro-overlay');
  if(!overlay) return;

  const KEY = 'introShown';
  if(sessionStorage.getItem(KEY) === '1' || prefersReduced){
    overlay.setAttribute('hidden','');
    return;
  }

  const el = document.getElementById('intro-rotator');
  const skipBtn = document.getElementById('intro-skip');

  const words = [
  'stories backed by numbers',
  'small steps, steady progress',
  'helping teams get unstuck',
  'playing guitar live',
  'watching the Lakers',
  'leaving things better'
];

  const TYPE_MS = 40;
  const DELETE_MS = 28;
  const HOLD_MS = 700;

  let stop = false;
  const sleep = (ms)=> new Promise(r => setTimeout(r, ms));

  function finishImmediate(){
    stop = true;
    overlay.classList.add('fade-out');
    setTimeout(() => overlay.setAttribute('hidden',''), 280);
    sessionStorage.setItem(KEY, '1');
  }

  async function revealThenFinish(){
    if (stop) return;
    overlay.classList.add('reveal');
    await new Promise(r => setTimeout(r, 650));
    if (stop) return;
    overlay.classList.add('fade-out');
    await new Promise(r => setTimeout(r, 280));
    overlay.setAttribute('hidden','');
    sessionStorage.setItem(KEY, '1');
  }

  if (skipBtn) skipBtn.addEventListener('click', finishImmediate);
  document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') finishImmediate(); }, {once:true});

  async function typeWord(text){
    el.textContent = '';
    for (let i = 0; i < text.length && !stop; i++){
      el.textContent += text[i];
      if (typeof fitIntroLine === 'function') fitIntroLine();
      await sleep(TYPE_MS);
    }
    await sleep(HOLD_MS);
    for (let i = text.length; i > 0 && !stop; i--){
      el.textContent = text.slice(0, i - 1);
      await sleep(DELETE_MS);
    }
  }

  (async function run(){
    for (const word of words){
      if (stop) break;
      await typeWord(word);
    }
    if (!stop) await revealThenFinish();
  })();
})();


// Ensure the single-line intro fits without wrapping by nudging font-size down if needed
function fitIntroLine(){
  const line = document.querySelector('.intro-line');
  const wrap = document.querySelector('.intro-inner');
  if(!line || !wrap) return;
  // reset to CSS-defined size, then reduce if needed
  line.style.fontSize = '';
  const maxWidth = wrap.clientWidth * 0.96;
  let size = parseFloat(getComputedStyle(line).fontSize);
  let attempts = 24;
  while(line.scrollWidth > maxWidth && attempts-- > 0){
    size *= 0.95; // reduce 5%
    line.style.fontSize = size + 'px';
  }
}
window.addEventListener('resize', fitIntroLine);
