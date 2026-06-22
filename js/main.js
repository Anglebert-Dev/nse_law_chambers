/* NSE Law Chambers — main.js (vanilla JS, no dependencies) */

/* --- Page loader ------------------------------------------- */
window.addEventListener('load', () => {
  const loader = document.getElementById('page-loader');
  if (loader) {
    loader.classList.add('hidden');
    setTimeout(() => loader.remove(), 600);
  }
});

/* --- Navbar scroll behaviour ------------------------------- */
const navbar = document.getElementById('navbar');
if (navbar) {
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* --- Mobile nav toggle ------------------------------------- */
const toggle = document.getElementById('nav-toggle');
const drawer = document.getElementById('nav-drawer');
if (toggle && drawer) {
  toggle.addEventListener('click', () => {
    const open = toggle.classList.toggle('open');
    drawer.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    drawer.setAttribute('aria-hidden', String(!open));
  });

  // Close drawer on link click
  drawer.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      toggle.classList.remove('open');
      drawer.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      drawer.setAttribute('aria-hidden', 'true');
    });
  });
}

/* --- Scroll reveal (replaces AOS + Waypoints + animate.css) */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

/* --- Footer year ------------------------------------------ */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* --- Form helper ------------------------------------------ */
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(fields) {
  let valid = true;
  fields.forEach(({ input, error, check }) => {
    const ok = check(input.value.trim());
    input.classList.toggle('invalid', !ok);
    error.classList.toggle('visible', !ok);
    if (!ok) valid = false;
  });
  return valid;
}

async function submitForm(formId, statusId, fields, submitId) {
  const form   = document.getElementById(formId);
  const status = document.getElementById(statusId);
  const submit = document.getElementById(submitId);
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Clear previous status
    status.className = 'form-status';
    status.textContent = '';

    if (!validate(fields)) return;

    const originalText = submit.textContent;
    submit.disabled = true;
    submit.textContent = 'Sending…';

    try {
      const data = new FormData(form);
      const res  = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: data,
      });
      const json = await res.json();

      if (json.success) {
        status.className = 'form-status success';
        status.textContent = 'Thank you — your message has been sent. We will be in touch shortly.';
        form.reset();
        fields.forEach(({ input, error }) => {
          input.classList.remove('invalid');
          error.classList.remove('visible');
        });
      } else {
        throw new Error(json.message || 'Submission failed');
      }
    } catch {
      status.className = 'form-status error-msg';
      status.textContent = 'Something went wrong. Please email us directly at nselawchambers@gmail.com';
    } finally {
      submit.disabled = false;
      submit.textContent = originalText;
    }
  });
}

/* --- Consult form ------------------------------------------ */
submitForm('consult-form', 'consult-status', [
  {
    input: document.getElementById('consult-name'),
    error: document.getElementById('consult-name-error'),
    check: v => v.length > 0,
  },
  {
    input: document.getElementById('consult-email'),
    error: document.getElementById('consult-email-error'),
    check: v => emailRe.test(v),
  },
  {
    input: document.getElementById('consult-matter'),
    error: document.getElementById('consult-matter-error'),
    check: v => v.length > 0,
  },
], 'consult-submit');

/* --- Contact form ------------------------------------------ */
submitForm('contact-form', 'contact-status', [
  {
    input: document.getElementById('contact-name'),
    error: document.getElementById('contact-name-error'),
    check: v => v.length > 0,
  },
  {
    input: document.getElementById('contact-email'),
    error: document.getElementById('contact-email-error'),
    check: v => emailRe.test(v),
  },
  {
    input: document.getElementById('contact-subject'),
    error: document.getElementById('contact-subject-error'),
    check: v => v.length > 0,
  },
  {
    input: document.getElementById('contact-message'),
    error: document.getElementById('contact-message-error'),
    check: v => v.length > 0,
  },
], 'contact-submit');

/* --- Practice area filter (practice-areas.html) ----------- */
const filterBtns = document.querySelectorAll('.practice-filter__btn');
const practiceCards = document.querySelectorAll('.practice-page-card');

if (filterBtns.length && practiceCards.length) {
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const cat = btn.dataset.filter;
      practiceCards.forEach(card => {
        const show = cat === 'all' || card.dataset.category === cat;
        card.style.display = show ? '' : 'none';
      });
    });
  });
}
