/* ============================================================
   i18n — LANGUAGE SWITCHER
   ============================================================ */
const LANG_FLAGS = { en: '🇬🇧', pt: '🇵🇹', es: '🇪🇸', fr: '🇫🇷' };

let currentLang = localStorage.getItem('lang') || 'en';

function applyLang(lang) {
  const t = translations[lang];
  if (!t) return;
  currentLang = lang;
  localStorage.setItem('lang', lang);
  document.documentElement.lang = lang;

  // text content
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key] !== undefined) el.textContent = t[key];
  });

  // innerHTML (supports <strong> etc.)
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.getAttribute('data-i18n-html');
    if (t[key] !== undefined) el.innerHTML = t[key];
  });

  // placeholder attributes
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (t[key] !== undefined) el.setAttribute('placeholder', t[key]);
  });

  // update switcher button
  document.getElementById('langFlag').textContent = LANG_FLAGS[lang];
  document.getElementById('langCode').textContent = lang.toUpperCase();

  // highlight active language in dropdown
  document.querySelectorAll('.lang-dropdown button').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
}

// Dropdown open/close
const langSwitcher = document.getElementById('langSwitcher');
const langToggle   = document.getElementById('langToggle');
const langDropdown = document.getElementById('langDropdown');

langToggle.addEventListener('click', (e) => {
  e.stopPropagation();
  const isOpen = langSwitcher.classList.toggle('open');
  langToggle.setAttribute('aria-expanded', isOpen);
});

document.addEventListener('click', (e) => {
  if (!langSwitcher.contains(e.target)) {
    langSwitcher.classList.remove('open');
    langToggle.setAttribute('aria-expanded', false);
  }
});

langDropdown.querySelectorAll('button[data-lang]').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    applyLang(btn.dataset.lang);
    langSwitcher.classList.remove('open');
  });
});

// Apply saved/default language on load
applyLang(currentLang);

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
  <a href="#about"        data-i18n="nav_about">About</a>
  <a href="#services"     data-i18n="nav_services">Services</a>
  <a href="#science"      data-i18n="nav_methodology">Methodology</a>
  <a href="#testimonials" data-i18n="nav_results">Results</a>
  <a href="#blog"         data-i18n="nav_insights">Insights</a>
  <a href="#contact" class="btn-nav" data-i18n="nav_cta">Discovery Call</a>
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
   CONTACT FORM — Supabase submission to discovery_calls table
   ============================================================ */
const SUPABASE_URL = 'https://uknmeyzfmugdzanvmfaa.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVrbm1leXpmbXVnZHphbnZtZmFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEzNjE2MzMsImV4cCI6MjA5NjkzNzYzM30.QS_N-kEEU358petOyig9tfP2U0pYQNLGY7T_obMB7K4';

const form = document.getElementById('contactForm');
if (form) {
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^\+?[1-9]\d{1,14}$/.test(phone.replace(/\D/g, ''));

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const btn = form.querySelector('button[type="submit"]');
    const original = btn.textContent;
    const t = translations[currentLang] || translations['en'];

    const email = form.querySelector('#email').value.trim();
    const phone = form.querySelector('#phone').value.trim();
    const goal = form.querySelector('#goal').value.trim();

    if (!validateEmail(email)) {
      btn.textContent = '✗ ' + (t.f_error_email || 'Invalid email');
      btn.style.background = '#9b2226';
      btn.style.borderColor = '#9b2226';
      btn.style.color = '#fff';
      setTimeout(() => {
        btn.textContent = original;
        btn.style.cssText = '';
      }, 3000);
      return;
    }

    if (!validatePhone(phone)) {
      btn.textContent = '✗ ' + (t.f_error_phone || 'Invalid phone');
      btn.style.background = '#9b2226';
      btn.style.borderColor = '#9b2226';
      btn.style.color = '#fff';
      setTimeout(() => {
        btn.textContent = original;
        btn.style.cssText = '';
      }, 3000);
      return;
    }

    if (!goal) {
      btn.textContent = '✗ ' + (t.f_error_goal || 'Select a goal');
      btn.style.background = '#9b2226';
      btn.style.borderColor = '#9b2226';
      btn.style.color = '#fff';
      setTimeout(() => {
        btn.textContent = original;
        btn.style.cssText = '';
      }, 3000);
      return;
    }

    btn.textContent = t.f_sending || 'Sending…';
    btn.disabled = true;

    const formData = new FormData(form);
    const data = {
      name: formData.get('name'),
      email: email,
      role: formData.get('role'),
      country: formData.get('country'),
      phone: phone,
      goal: goal || null,
      message: formData.get('message') || null
    };

    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/discovery_calls`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        btn.textContent = t.f_sent || '✓ Request sent!';
        btn.style.background = '#2d6a4f';
        btn.style.borderColor = '#2d6a4f';
        btn.style.color = '#fff';
        form.reset();
        setTimeout(() => {
          btn.textContent = original;
          btn.style.cssText = '';
          btn.disabled = false;
        }, 4000);
      } else {
        throw new Error('Server error');
      }
    } catch (error) {
      btn.textContent = t.f_error || '✗ Something went wrong. Please try again.';
      btn.style.background = '#9b2226';
      btn.style.borderColor = '#9b2226';
      btn.style.color = '#fff';
      btn.disabled = false;
      setTimeout(() => {
        btn.textContent = original;
        btn.style.cssText = '';
      }, 4000);
    }
  });
}
