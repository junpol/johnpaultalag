// Year
document.getElementById('year').textContent = new Date().getFullYear();

// Scroll progress
const progress = document.getElementById('progress');
const onScroll = () => {
  const h = document.documentElement;
  const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight);
  progress.style.width = (scrolled * 100) + '%';
};
document.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Reveal on scroll
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('revealed'); } });
},{ threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el=> io.observe(el));

// Parallax blob
const blob = document.querySelector('.blob');
document.addEventListener('mousemove', (e)=>{
  const x = (e.clientX / window.innerWidth - 0.5) * 20;
  const y = (e.clientY / window.innerHeight - 0.5) * 20;
  blob.style.transform = `translate(${x}px, ${y}px)`;
});

// Command palette (press "k")
const palette = document.getElementById('palette');
const input = document.getElementById('palette-input');
const list = document.getElementById('palette-list');

const openPalette = () => { palette.setAttribute('aria-hidden','false'); input.value = ''; input.focus(); };
const closePalette = () => palette.setAttribute('aria-hidden','true');
document.addEventListener('keydown', (e)=>{
  if(e.key.toLowerCase() === 'k' && !e.metaKey && !e.ctrlKey){ openPalette(); }
  if(e.key === 'Escape'){ closePalette(); }
});
input?.addEventListener('input', ()=>{
  const q = input.value.toLowerCase();
  list.querySelectorAll('li').forEach(li=>{
    const t = li.textContent.toLowerCase();
    li.style.display = t.includes(q) ? '' : 'none';
  });
});
list?.addEventListener('click', (e)=>{
  const li = e.target.closest('li'); if(!li) return;
  document.querySelector(li.dataset.target)?.scrollIntoView({ behavior:'smooth'});
  closePalette();
});
palette.addEventListener('click', (e)=>{ if(e.target === palette) closePalette(); });

// Theme toggle with localStorage
const root = document.documentElement;
const saved = localStorage.getItem('theme'); if(saved){ root.setAttribute('data-theme', saved); }
document.getElementById('theme-toggle').addEventListener('click', ()=>{
  const current = root.getAttribute('data-theme') || 'light';
  const next = current === 'light' ? 'dark' : 'light';
  root.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});

// Magnetic button effect for primary CTAs
document.querySelectorAll('.magnet').forEach(btn=>{
  btn.addEventListener('mousemove', (e)=>{
    const r = btn.getBoundingClientRect();
    const x = e.clientX - r.left - r.width/2;
    const y = e.clientY - r.top - r.height/2;
    btn.style.transform = `translate(${x*0.08}px, ${y*0.08}px)`;
  });
  btn.addEventListener('mouseleave', ()=>{ btn.style.transform = 'translate(0,0)'; });
});

// Rotating lede in hero
const phrases = ['Business Economics Student','Internal Audit Intern','Data Storyteller'];
let i = 0;
setInterval(()=>{
  const el = document.getElementById('rotator');
  i = (i + 1) % phrases.length;
  el.style.opacity = 0;
  setTimeout(()=>{ el.textContent = phrases[i]; el.style.opacity = 1; }, 200);
}, 2200);

// Project modals
const modal = document.getElementById('modal');
const modalContent = document.getElementById('modal-content');
document.querySelectorAll('.project').forEach(card=>{
  card.addEventListener('click', ()=>{
    const key = card.dataset.project;
    const data = window.PROJECTS[key];
    if(!data) return;
    modalContent.innerHTML = `<h3>${data.title}</h3>
      <div class="meta">${data.period} · ${data.assoc}</div>
      ${data.body}`;
    modal.setAttribute('aria-hidden','false');
  });
});
document.getElementById('modal-close').addEventListener('click', ()=> modal.setAttribute('aria-hidden','true'));
modal.addEventListener('click', (e)=>{ if(e.target === modal) modal.setAttribute('aria-hidden','true'); });

// Stat counters
const counters = document.querySelectorAll('.about-stats .stat span');
const ioStats = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      const el = e.target;
      const target = Number(el.dataset.count || '0');
      let n = 0;
      const step = Math.max(1, Math.floor(target/40));
      const tick = () => {
        n += step;
        if(n >= target){ n = target; }
        el.textContent = n.toString();
        if(n < target) requestAnimationFrame(tick);
      };
      tick();
      ioStats.unobserve(el);
    }
  });
},{ threshold: 0.8 });
counters.forEach(c=> ioStats.observe(c));
