/* ============================================================
   NAVBAR — scroll effect
   ============================================================ */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ============================================================
   HAMBURGER — mobile nav
   ============================================================ */
const hamburger = document.getElementById('hamburger');

const mobileNav = document.createElement('div');
mobileNav.classList.add('mobile-nav');
mobileNav.innerHTML = `
  <a href="#about">Sobre</a>
  <a href="#services">Serviços</a>
  <a href="#science">Metodologia</a>
  <a href="#testimonials">Resultados</a>
  <a href="#blog">Insights</a>
  <a href="#contact" class="btn-nav">Discovery Call</a>
`;
document.body.appendChild(mobileNav);

hamburger.addEventListener('click', () => {
  const open = mobileNav.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', open);
  document.body.style.overflow = open ? 'hidden' : '';

  const spans = hamburger.querySelectorAll('span');
  if (open) {
    spans[0].style.cssText = 'transform:translateY(7px) rotate(45deg)';
    spans[1].style.cssText = 'opacity:0';
    spans[2].style.cssText = 'transform:translateY(-7px) rotate(-45deg)';
  } else {
    spans.forEach(s => (s.style.cssText = ''));
  }
});

mobileNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    document.body.style.overflow = '';
    hamburger.querySelectorAll('span').forEach(s => (s.style.cssText = ''));
  });
});

/* ============================================================
   SMOOTH SCROLL — active nav link highlight
   ============================================================ */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a:not(.btn-nav)');

const highlightNav = () => {
  const scrollY = window.scrollY;
  sections.forEach(section => {
    const top    = section.offsetTop - 100;
    const bottom = top + section.offsetHeight;
    const id     = section.getAttribute('id');
    navLinks.forEach(link => {
      if (link.getAttribute('href') === `#${id}`) {
        link.style.color = scrollY >= top && scrollY < bottom
          ? 'var(--gold)'
          : '';
      }
    });
  });
};
window.addEventListener('scroll', highlightNav, { passive: true });

/* ============================================================
   REVEAL ON SCROLL
   ============================================================ */
const revealTargets = [
  '.service-card',
  '.pillar',
  '.framework-item',
  '.testimonial-card',
  '.blog-card',
  '.step',
  '.about-text',
  '.contact-info',
  '.contact-form-wrap',
  '.hero-stats .stat',
  '.stat',
];

revealTargets.forEach(selector => {
  document.querySelectorAll(selector).forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${i * 0.07}s`;
  });
});

const revealObserver = new IntersectionObserver(
  entries => entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  }),
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ============================================================
   COUNTER ANIMATION — hero stats
   ============================================================ */
const counters = document.querySelectorAll('.stat-num');

const animateCounter = (el) => {
  const raw   = el.textContent.trim();
  const isPlus = raw.startsWith('+');
  const isPct  = raw.endsWith('%');
  const num    = parseInt(raw.replace(/[^0-9]/g, ''), 10);
  const dur    = 1400;
  const start  = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - start) / dur, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    const current  = Math.round(eased * num);
    el.textContent = `${isPlus ? '+' : ''}${current}${isPct ? '%' : ''}`;
    if (progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};

const counterObserver = new IntersectionObserver(
  entries => entries.forEach(e => {
    if (e.isIntersecting) {
      animateCounter(e.target);
      counterObserver.unobserve(e.target);
    }
  }),
  { threshold: 0.5 }
);
counters.forEach(c => counterObserver.observe(c));

/* ============================================================
   CONTACT FORM — simple feedback
   ============================================================ */
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();

    const btn = form.querySelector('button[type="submit"]');
    const original = btn.textContent;
    btn.textContent = 'A enviar...';
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = '✓ Pedido enviado!';
      btn.style.background = '#2d6a4f';
      btn.style.borderColor = '#2d6a4f';
      btn.style.color = '#fff';

      setTimeout(() => {
        form.reset();
        btn.textContent = original;
        btn.style.cssText = '';
        btn.disabled = false;
      }, 3500);
    }, 1200);
  });
}
