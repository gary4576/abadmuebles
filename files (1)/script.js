/* ================================================
   ABAD Muebles & Carpintería — script.js
   Funcionalidades: navbar scroll, menú móvil,
   animaciones reveal, filtro de catálogo, formulario
   ================================================ */

/* ── 1. NAVBAR: SCROLL EFFECT ─────────────────── */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  function onScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // ejecutar al cargar por si ya hay scroll
})();


/* ── 2. MENÚ HAMBURGUESA (MÓVIL) ─────────────── */
(function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  if (!hamburger || !navLinks) return;

  // Abrir / cerrar menú
  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    // Prevenir scroll del body cuando el menú está abierto
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Cerrar al hacer click en un enlace
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', false);
      document.body.style.overflow = '';
    });
  });

  // Cerrar al hacer click fuera del menú
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target)) {
      navLinks.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', false);
      document.body.style.overflow = '';
    }
  });
})();


/* ── 3. ANIMACIONES DE REVEAL AL HACER SCROLL ── */
(function initRevealAnimations() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  // Añadir delays escalonados a elementos del mismo padre
  document.querySelectorAll('.services-grid, .catalog-grid, .testimonials-grid, .tips-grid, .about-values, .trust-container').forEach(grid => {
    const children = grid.querySelectorAll('.reveal');
    children.forEach((child, index) => {
      child.style.transitionDelay = `${index * 80}ms`;
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // Una sola vez
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -50px 0px'
    }
  );

  elements.forEach(el => observer.observe(el));
})();


/* ── 4. FILTRO DE CATÁLOGO ──────────────────── */
(function initCatalogFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const catalogItems = document.querySelectorAll('.catalog-item');
  if (!filterBtns.length || !catalogItems.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      // Actualizar botón activo
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Filtrar items con animación
      catalogItems.forEach(item => {
        const itemCategory = item.getAttribute('data-filter');
        const shouldShow = filter === 'all' || itemCategory === filter;

        if (shouldShow) {
          item.classList.remove('hidden');
          // Pequeña animación al aparecer
          requestAnimationFrame(() => {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.95)';
            requestAnimationFrame(() => {
              item.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            });
          });
        } else {
          item.classList.add('hidden');
          item.style.opacity = '';
          item.style.transform = '';
        }
      });
    });
  });
})();


/* ── 5. FORMULARIO DE CONTACTO ───────────────── */
(function initContactForm() {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validación básica
    const nombre   = form.nombre.value.trim();
    const telefono = form.telefono.value.trim();
    const mensaje  = form.mensaje.value.trim();

    if (!nombre || !telefono || !mensaje) {
      shakeForm(form);
      return;
    }

    // Simular envío (aquí puedes conectar tu backend o EmailJS)
    // ---------------------------------------------------------
    // Para conectar con WhatsApp directamente, reemplaza el número:
    const numero  = '51941854935'; // ← REEMPLAZAR con tu número real
    const servicio = form.servicio.value || 'No especificado';
    const texto = encodeURIComponent(
      `Hola, me llamo *${nombre}*.\n` +
      `📞 Teléfono: ${telefono}\n` +
      `🔧 Servicio: ${servicio}\n` +
      `📋 Proyecto: ${mensaje}`
    );
    const waURL = `https://wa.me/${numero}?text=${texto}`;
    // ---------------------------------------------------------

    // Mostrar éxito visual
    const submitBtn = form.querySelector('.btn-submit');
    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;

    setTimeout(() => {
      // Redirigir a WhatsApp con los datos del formulario
      window.open(waURL, '_blank');

      // Mostrar mensaje de éxito
      if (success) {
        success.classList.add('visible');
        success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      // Resetear formulario
      form.reset();
      submitBtn.textContent = 'Enviar Solicitud →';
      submitBtn.disabled = false;

      // Ocultar éxito después de 6 segundos
      setTimeout(() => {
        success && success.classList.remove('visible');
      }, 6000);

    }, 800);
  });

  // Animación de "shake" si hay campos vacíos
  function shakeForm(el) {
    el.style.animation = 'none';
    el.offsetHeight; // reflow
    el.classList.add('shake');
    setTimeout(() => el.classList.remove('shake'), 500);
  }
})();


/* ── 6. FUNCIÓN GLOBAL: SCROLL A CONTACTO ────── */
function scrollToContact() {
  const section = document.getElementById('contacto');
  if (section) {
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}


/* ── 7. LINKS ACTIVOS EN NAVBAR ─────────────── */
(function initActiveLinks() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-links a');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.toggle('active-link', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach(s => observer.observe(s));
})();


/* ── 8. BOTÓN DE WHATSAPP: PULSE ANIMACIÓN ───── */
(function initWhatsappPulse() {
  const waBtn = document.querySelector('.whatsapp-float');
  if (!waBtn) return;

  // Mostrar el botón con animación al hacer scroll
  setTimeout(() => {
    waBtn.style.animation = 'waPulse 2.5s ease-in-out infinite';
  }, 3000);
})();


/* ── CSS EXTRA: ANIMACIONES DINÁMICAS ─────────
   (Inyectado por JS para no modificar el CSS base)
   ──────────────────────────────────────────── */
(function injectDynamicStyles() {
  const style = document.createElement('style');
  style.textContent = `
    /* Shake para formulario inválido */
    @keyframes formShake {
      0%, 100% { transform: translateX(0); }
      20%, 60% { transform: translateX(-8px); }
      40%, 80% { transform: translateX(8px); }
    }
    .shake { animation: formShake 0.4s ease !important; }

    /* Pulso del botón WhatsApp */
    @keyframes waPulse {
      0%, 100% { box-shadow: 0 4px 20px rgba(37,211,102,.45); }
      50%       { box-shadow: 0 4px 32px rgba(37,211,102,.75), 0 0 0 10px rgba(37,211,102,.08); }
    }

    /* Link activo en navbar */
    .nav-links .active-link {
      color: var(--color-wood-light) !important;
    }
    .nav-links .active-link::after {
      width: 100% !important;
    }
  `;
  document.head.appendChild(style);
})();
