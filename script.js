// =========================================================
// LOADER
// =========================================================
window.addEventListener("load", () => {
  setTimeout(() => document.getElementById("loader").classList.add("hidden"), 1500);
});

// =========================================================
// CUSTOM CURSOR
// =========================================================
const cursorDot = document.getElementById('cursorDot');
const cursorGlow = document.getElementById('cursorGlow');
let mouseX = 0, mouseY = 0, glowX = 0, glowY = 0;

window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX; mouseY = e.clientY;
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top = mouseY + 'px';

  const heroGlow = document.getElementById('heroGlow');
  const hero = document.getElementById('hero');
  if (hero) {
    const rect = hero.getBoundingClientRect();
    if (mouseY < rect.bottom) {
      heroGlow.style.left = mouseX + 'px';
      heroGlow.style.top = mouseY + 'px';
    }
  }
});

function animateGlow(){
  glowX += (mouseX - glowX) * 0.12;
  glowY += (mouseY - glowY) * 0.12;
  cursorGlow.style.left = glowX + 'px';
  cursorGlow.style.top = glowY + 'px';
  requestAnimationFrame(animateGlow);
}
animateGlow();

function bindCursorHover(el){
  el.addEventListener('mouseenter', () => cursorDot.classList.add('hover'));
  el.addEventListener('mouseleave', () => cursorDot.classList.remove('hover'));
}
document.querySelectorAll('a, button, .magnetic').forEach(bindCursorHover);

// =========================================================
// MAGNETIC BUTTONS
// =========================================================
document.querySelectorAll('.magnetic').forEach(el => {
  el.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
  });
  el.addEventListener('mouseleave', () => { el.style.transform = ''; });
});

// =========================================================
// SPOTLIGHT CARD TRACKING (--x / --y for .glass-card radial glow)
// =========================================================
function bindSpotlight(el){
  el.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--x', `${e.clientX - rect.left}px`);
    el.style.setProperty('--y', `${e.clientY - rect.top}px`);
  });
}
function bindAllSpotlights(){
  document.querySelectorAll('.glass-card').forEach(bindSpotlight);
}
bindAllSpotlights();

// =========================================================
// SCROLL PROGRESS + NAV SCROLLED/HIDE + BACK TO TOP
// =========================================================
const scrollProgress = document.getElementById('scrollProgress');
const nav = document.getElementById('nav');
const backToTop = document.getElementById('backToTop');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  scrollProgress.style.width = (scrollTop / docHeight) * 100 + '%';

  nav.classList.toggle('scrolled', scrollTop > 40);

  if (scrollTop > lastScroll && scrollTop > 200) {
    nav.classList.add('nav-hidden');
  } else {
    nav.classList.remove('nav-hidden');
  }
  lastScroll = scrollTop;

  backToTop.classList.toggle('visible', scrollTop > 600);
}, { passive: true });

backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// =========================================================
// MOBILE NAV
// =========================================================
const navBurger = document.getElementById('navBurger');
const navLinks = document.getElementById('navLinks');
navBurger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  navBurger.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  navLinks.classList.remove('open');
  navBurger.classList.remove('open');
}));

// =========================================================
// TYPEWRITER
// =========================================================
const roles = [
  'Android Developer',
  'Front-End Web Developer',
  'Python Enthusiast',
  'EEG Deep Learning Researcher'
];
const twEl = document.getElementById('typewriter');
let roleIndex = 0, charIndex = 0, deleting = false;

function typeLoop(){
  const current = roles[roleIndex];
  if (!deleting) {
    charIndex++;
    twEl.textContent = current.slice(0, charIndex);
    if (charIndex === current.length) { deleting = true; setTimeout(typeLoop, 1400); return; }
  } else {
    charIndex--;
    twEl.textContent = current.slice(0, charIndex);
    if (charIndex === 0) { deleting = false; roleIndex = (roleIndex + 1) % roles.length; }
  }
  setTimeout(typeLoop, deleting ? 40 : 70);
}
typeLoop();

// =========================================================
// HERO CHIP PARALLAX (subtle drift toward cursor)
// =========================================================
const heroChipsWrap = document.getElementById('heroChips');
if (heroChipsWrap) {
  window.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth / 2, cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx, dy = (e.clientY - cy) / cy;
    heroChipsWrap.style.transform = `translate(${dx * -10}px, ${dy * -8}px)`;
  });
}

// =========================================================
// HERO SIGNAL / NEURAL CANVAS
// EEG-wave inspired particle network that reacts to the cursor —
// a nod to the seizure-detection thesis
// =========================================================
const canvas = document.getElementById('signalCanvas');
const ctx = canvas.getContext('2d');
let W, H, nodes = [];
let canvasMouseX = -9999, canvasMouseY = -9999;

canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  canvasMouseX = e.clientX - rect.left;
  canvasMouseY = e.clientY - rect.top;
});
canvas.addEventListener('mouseleave', () => { canvasMouseX = -9999; canvasMouseY = -9999; });

function resizeCanvas(){
  W = canvas.width = canvas.offsetWidth;
  H = canvas.height = canvas.offsetHeight;
}
window.addEventListener('resize', resizeCanvas);

function initNodes(){
  const count = Math.min(85, Math.floor((W * H) / 16000));
  nodes = Array.from({ length: count }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    r: Math.random() * 1.6 + 0.6
  }));
}

function drawFrame(){
  ctx.clearRect(0, 0, W, H);
  nodes.forEach(n => {
    n.x += n.vx; n.y += n.vy;
    if (n.x < 0 || n.x > W) n.vx *= -1;
    if (n.y < 0 || n.y > H) n.vy *= -1;

    // gentle repel from cursor
    const dx = n.x - canvasMouseX, dy = n.y - canvasMouseY;
    const d = Math.hypot(dx, dy);
    if (d < 110) {
      const force = (110 - d) / 110 * 0.6;
      n.x += (dx / d) * force;
      n.y += (dy / d) * force;
    }
  });

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i], b = nodes[j];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (d < 130) {
        ctx.strokeStyle = `rgba(79,141,255,${0.16 * (1 - d / 130)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
  }
  nodes.forEach(n => {
    ctx.fillStyle = 'rgba(34,211,238,0.7)';
    ctx.beginPath();
    ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
    ctx.fill();
  });
  requestAnimationFrame(drawFrame);
}

resizeCanvas();
initNodes();
drawFrame();
window.addEventListener('resize', () => { resizeCanvas(); initNodes(); });

// animate the small EEG waveform path in the research diagram
const eegWave = document.getElementById('eegWave');
if (eegWave) {
  let t = 0;
  setInterval(() => {
    t += 0.15;
    const y1 = 40 + Math.sin(t) * 14;
    const y2 = 40 + Math.sin(t + 1.2) * 18;
    eegWave.setAttribute('d', `M10 40 Q 25 ${y1}, 40 40 T 70 40 T 100 ${y2} T 130 40`);
  }, 90);
}

// =========================================================
// REVEAL ON SCROLL
// =========================================================
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal, .reveal-up').forEach(el => revealObserver.observe(el));

// =========================================================
// TIMELINE DRAW-ON-SCROLL
// =========================================================
const timelineObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('drawn');
      timelineObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.timeline').forEach(el => timelineObserver.observe(el));

// =========================================================
// STAT COUNTERS
// =========================================================
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseInt(el.dataset.count, 10);
    let current = 0;
    const step = Math.max(1, Math.ceil(target / 40));
    const tick = () => {
      current = Math.min(target, current + step);
      el.textContent = current;
      if (current < target) requestAnimationFrame(tick);
    };
    tick();
    statObserver.unobserve(el);
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-num').forEach(el => statObserver.observe(el));

// =========================================================
// SKILLS DATA + RENDER + FILTER + MARQUEE
// =========================================================
const skillData = [
  { name: 'Kotlin',        level: 85, cat: 'languages' },
  { name: 'Java',          level: 78, cat: 'languages' },
  { name: 'Python',        level: 90, cat: 'languages' },
  { name: 'JavaScript',    level: 82, cat: 'languages' },
  { name: 'PHP',           level: 65, cat: 'languages' },
  { name: 'HTML & CSS',    level: 88, cat: 'mobile-web' },
  { name: 'Android SDK',   level: 82, cat: 'mobile-web' },
  { name: 'React',         level: 70, cat: 'mobile-web' },
  { name: 'REST APIs',     level: 75, cat: 'mobile-web' },
  { name: 'Pandas',        level: 80, cat: 'data' },
  { name: 'MySQL',         level: 72, cat: 'data' },
  { name: 'Concurrency',   level: 74, cat: 'data' },
  { name: 'Deep Learning', level: 76, cat: 'data' },
  { name: 'Git & GitHub',  level: 85, cat: 'tools' },
  { name: 'VS Code',       level: 90, cat: 'tools' },
  { name: 'Figma',         level: 60, cat: 'tools' },
];

const skillsGrid = document.getElementById('skillsGrid');
skillData.forEach((s, i) => {
  const card = document.createElement('div');
  card.className = 'glass-card skill-card reveal';
  card.style.setProperty('--d', `${(i % 4) * 0.06}s`);
  card.dataset.cat = s.cat;
  card.innerHTML = `
    <div class="skill-name"><span>${s.name}</span><span>${s.level}%</span></div>
    <div class="skill-bar"><div class="skill-bar-fill" data-level="${s.level}"></div></div>
  `;
  skillsGrid.appendChild(card);
  bindSpotlight(card);
});

document.querySelectorAll('.skill-card.reveal').forEach(el => revealObserver.observe(el));

const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fill = entry.target.querySelector('.skill-bar-fill');
      fill.style.width = fill.dataset.level + '%';
      barObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });
document.querySelectorAll('.skill-card').forEach(el => barObserver.observe(el));

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.skill-card').forEach(card => {
      const show = filter === 'all' || card.dataset.cat === filter;
      card.classList.toggle('hidden', !show);
    });
  });
});

// marquee strips — built from the same skill list, duplicated for a seamless loop
function fillMarquee(id, list){
  const track = document.getElementById(id);
  if (!track) return;
  const html = list.map(s => `<span class="marquee-item">${s.name}</span>`).join('');
  track.innerHTML = html + html; // duplicate for seamless scroll
}
fillMarquee('marqueeTop', skillData.slice(0, 8));
fillMarquee('marqueeBottom', skillData.slice(8));

// =========================================================
// PROJECTS DATA + RENDER + TILT
// EDIT ME: update href to your actual repo URLs and swap in real descriptions
// =========================================================
const projectData = [
  { name: "AuraFi", desc: "A personal finance / budgeting concept app focused on clear, at-a-glance money tracking.", tech: ["HTML", "CSS", "JavaScript"], href: "https://github.com/aurnabar-209/AuraFi", featured: true, wide: true, grad: "linear-gradient(135deg,#4f8dff,#22d3ee)" },
  { name: "Daraz Scraper", desc: "Concurrent Python scraper for collecting product information from Daraz.", tech: ["Python", "Requests", "Pandas"], href: "https://github.com/aurnabar-209/Daraz_Scraper", featured: true, wide: false, grad: "linear-gradient(135deg,#22d3ee,#4f8dff)" },
  { name: "Wallet App", desc: "An expense-tracking wallet application for managing daily transactions.", tech: ["HTML", "CSS", "JavaScript"], href: "https://github.com/aurnabar-209/wallet-app", featured: false, wide: false, grad: "linear-gradient(135deg,#8b6bff,#4f8dff)" },
  { name: "Pocket Ledger", desc: "A lightweight ledger app for tracking balances and shared expenses.", tech: ["HTML", "CSS", "JavaScript"], href: "https://github.com/aurnabar-209/Pocket-Ledger", featured: false, wide: false, grad: "linear-gradient(135deg,#22d3ee,#8b6bff)" },
  { name: "Screen Dimmer", desc: "A utility for reducing screen brightness beyond the system minimum.", tech: ["Android"], href: "https://github.com/aurnabar-209/Screen-Dimmer", featured: false, wide: false, grad: "linear-gradient(135deg,#4f8dff,#8b6bff)" },
  { name: "Leaf Disease Detection", desc: "Machine learning project for detecting plant leaf diseases from images.", tech: ["Python", "Machine Learning"], href: "https://github.com/aurnabar-209/leaf-disease-detection", featured: true, wide: false, grad: "linear-gradient(135deg,#00c6a7,#4f8dff)" },
  { name: "Wedding Management System", desc: "Complete PHP-based wedding management system with admin and customer features.", tech: ["PHP", "MySQL"], href: "https://github.com/aurnabar-209/Wedding-Management-System-using-PHP-", featured: true, wide: true, grad: "linear-gradient(135deg,#4f8dff,#ec4899)" },
  { name: "Python Learning", desc: "Collection of Python practice programs, automation scripts, and exercises.", tech: ["Python"], href: "https://github.com/aurnabar-209/python-learning", featured: false, wide: false, grad: "linear-gradient(135deg,#8b6bff,#22d3ee)" },
  { name: "Canvas Drawing App", desc: "Simple Android drawing application built using Kotlin.", tech: ["Kotlin", "Android"], href: "https://github.com/aurnabar-209/Canvas-Simple-drawing-App-", featured: false, wide: false, grad: "linear-gradient(135deg,#4f8dff,#00d4ff)" },
  { name: "ToDo List App", desc: "Task management application for organizing daily activities.", tech: ["Java", "Android"], href: "https://github.com/aurnabar-209/ToDoList-App", featured: false, wide: false, grad: "linear-gradient(135deg,#f59e0b,#8b6bff)" },
  { name: "Wedding Management", desc: "Modern wedding management website built with HTML, CSS and JavaScript.", tech: ["HTML", "CSS", "JavaScript"], href: "https://github.com/aurnabar-209/wedding-management", featured: false, wide: false, grad: "linear-gradient(135deg,#ff6b6b,#8b6bff)" },
  { name: "Valentine", desc: "Interactive Valentine's Day themed webpage.", tech: ["HTML", "CSS", "JavaScript"], href: "https://github.com/aurnabar-209/valentine", featured: false, wide: false, grad: "linear-gradient(135deg,#ff4d6d,#ff9f68)" },
  { name: "Happy Birthday", desc: "Animated birthday greeting webpage with interactive effects.", tech: ["HTML", "CSS", "JavaScript"], href: "https://github.com/aurnabar-209/Happy_Birthday", featured: false, wide: false, grad: "linear-gradient(135deg,#00c6ff,#8b6bff)" }
];

const projectsGrid = document.getElementById('projectsGrid');
projectData.forEach((p, i) => {
  const card = document.createElement('div');
  card.className = 'glass-card project-card reveal beam-card' + (p.wide ? ' wide' : '');
  card.style.setProperty('--d', `${(i % 3) * 0.08}s`);
  card.innerHTML = `
    ${p.featured ? '<span class="project-featured">Featured</span>' : ''}
    <div class="project-thumb" style="background:${p.grad}">
      <span class="project-thumb-mark">${p.name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase()}</span>
    </div>
    <div class="project-body">
      <h3>${p.name}</h3>
      <p>${p.desc}</p>
      <div class="badge-row">${p.tech.map(t => `<span class="badge">${t}</span>`).join('')}</div>
      <div style="margin-top:.4rem;">
        <a class="project-link" href="${p.href}" target="_blank" rel="noopener">View on GitHub &rarr;</a>
      </div>
    </div>
  `;
  projectsGrid.appendChild(card);
  bindSpotlight(card);
  bindCursorHover(card);

  // 3D tilt
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(700px) rotateX(${py * -6}deg) rotateY(${px * 6}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});
document.querySelectorAll('.project-card.reveal').forEach(el => revealObserver.observe(el));

// =========================================================
// CERTIFICATES DATA + RENDER
// EDIT ME: this is a placeholder — replace with your real certificates
// =========================================================
const certData = [
  // { title: 'Course name', org: 'Issuer', year: '2026', href: '#' },
  { title: 'Inernship ', org: 'Technogram', year: '2026', href: 'Certificates/internship.pdf' }
];

const certGrid = document.getElementById('certGrid');
if (certData.length === 0) {
  certGrid.innerHTML = `<div class="cert-empty">No certificates added yet — edit the <code>certData</code> array in script.js to add yours here.</div>`;
} else {
  certData.forEach(c => {
    const card = document.createElement('a');
    card.className = 'glass-card cert-card reveal';
    card.href = c.href || '#';
    card.target = '_blank';
    card.rel = 'noopener';
    card.innerHTML = `<h4>${c.title}</h4><p>${c.org} · ${c.year}</p>`;
    certGrid.appendChild(card);
    bindSpotlight(card);
  });
  document.querySelectorAll('.cert-card.reveal').forEach(el => revealObserver.observe(el));
}

// =========================================================
// CONTACT FORM (demo behaviour until Formspree ID is added)
// =========================================================
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', (e) => {
  if (contactForm.action.includes('YOUR_FORM_ID')) {
    e.preventDefault();
    alert('Add your Formspree endpoint in index.html (contactForm action) to receive messages. For now, email aurnabar209@gmail.com directly.');
  }
});

// =========================================================
// FOOTER YEAR
// =========================================================
document.getElementById('year').textContent = new Date().getFullYear();

// re-bind spotlight for any static glass-cards not covered above
bindAllSpotlights();
