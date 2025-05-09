// Script para corregir problemas de visualización

document.addEventListener('DOMContentLoaded', function() {
  console.log('Inicializando página...');
  
  // Referencias de elementos
  const sidebar = document.getElementById('sidebar');
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const mainContent = document.getElementById('main-content');
  const lightbox = document.getElementById('lightbox-modal');
  
  // 1. CORRECCIÓN: Ocultar modales al inicio
  if (lightbox) {
    // Asegurarse de que el lightbox está oculto al cargar la página
    lightbox.classList.add('hidden');
    lightbox.style.display = 'none';
  }
  
  // Inicialización del sidebar
  function initSidebar() {
    // En móvil, asegurar que comienza cerrado
    if (window.innerWidth < 992) {
      sidebar.classList.remove('open');
      mainContent.style.marginLeft = '0';
    } else {
      // En desktop, asegurarse que el sidebar está visible y el contenido ajustado
      sidebar.classList.add('open');
      mainContent.style.marginLeft = '260px';
    }
    
    // Toggle para mostrar/ocultar sidebar
    if (sidebarToggle) {
      sidebarToggle.addEventListener('click', function(e) {
        e.stopPropagation(); // Evitar propagación del evento
        sidebar.classList.toggle('open');
        
        // Ajustar margen del contenido principal en desktop
        if (window.innerWidth >= 992) {
          if (sidebar.classList.contains('open')) {
            mainContent.style.marginLeft = '260px';
          } else {
            mainContent.style.marginLeft = '0';
          }
        }
      });
    }
    
    // Resto de handlers
    // Cerrar sidebar al hacer clic en un enlace (móvil)
    document.querySelectorAll('#toc a').forEach(link => {
      link.addEventListener('click', function() {
        if (window.innerWidth < 992) {
          sidebar.classList.remove('open');
        }
      });
    });
    
    // Cerrar sidebar al hacer clic fuera (móvil)
    document.addEventListener('click', function(e) {
      if (window.innerWidth < 992 &&
          sidebar.classList.contains('open') && 
          !sidebar.contains(e.target) && 
          e.target !== sidebarToggle &&
          !sidebarToggle.contains(e.target)) {
        sidebar.classList.remove('open');
      }
    });
  }

  // 3. Inicializar acordeones
  function initAccordions() {
    const accordionToggles = document.querySelectorAll('.accordion-toggle');
    
    // Asegurarse de que al menos el primer acordeón esté abierto
    if (accordionToggles.length > 0) {
      const firstToggle = accordionToggles[0];
      const firstContent = firstToggle.nextElementSibling;
      
      firstToggle.setAttribute('aria-expanded', 'true');
      firstContent.classList.add('open');
      firstContent.style.display = 'block';
    }
    
    // Configurar eventos para todos los toggles
    accordionToggles.forEach(toggle => {
      toggle.addEventListener('click', function() {
        const content = this.nextElementSibling;
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        
        // Cerrar todos los acordeones
        accordionToggles.forEach(t => {
          t.setAttribute('aria-expanded', 'false');
          const c = t.nextElementSibling;
          c.classList.remove('open');
          c.style.display = 'none';
        });
        
        // Abrir este si estaba cerrado
        if (!isExpanded) {
          this.setAttribute('aria-expanded', 'true');
          content.classList.add('open');
          content.style.display = 'block';
        }
      });
    });
  }

  // 4. Inicializar tabla de contenidos
  function generateTOC() {
    const tocList = document.querySelector('#toc ul');
    const sections = document.querySelectorAll('.accordion-section');
    
    if (tocList) {
      tocList.innerHTML = '';
      
      sections.forEach(section => {
        if (section.id) {
          const heading = section.querySelector('h2');
          if (heading) {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = '#' + section.id;
            a.textContent = heading.textContent;
            
            a.addEventListener('click', function(e) {
              e.preventDefault();
              
              // En móvil, cerrar sidebar
              if (window.innerWidth < 992) {
                sidebar.classList.remove('open');
              }
              
              // Expandir el acordeón y desplazarse
              const toggle = section.querySelector('.accordion-toggle');
              if (toggle && toggle.getAttribute('aria-expanded') !== 'true') {
                toggle.click();
              }
              
              // Scroll con pequeño retraso
              setTimeout(() => {
                section.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start'
                });
              }, 100);
            });
            
            li.appendChild(a);
            tocList.appendChild(li);
          }
        }
      });
    }
  }

  // 5. CORREGIDO - Lightbox para imágenes
  function initLightbox() {
    const images = document.querySelectorAll('.lightbox-trigger');
    const lightbox = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.querySelector('.lightbox-close');
    const prevBtn = document.getElementById('lightbox-prev');
    const nextBtn = document.getElementById('lightbox-next');

    // array con todas las imágenes del lightbox
    const gallery = Array.from(images);
    let currentIndex = -1;

    images.forEach((img, idx) => {
      img.addEventListener('click', function() {
        currentIndex = idx;
        lightboxImg.src = this.src;
        lightboxCaption.textContent = this.alt;
        lightbox.classList.remove('hidden');
        lightbox.style.display = 'flex';
        lightboxImg.classList.remove('zoom');   // reset zoom
      });
    });

    // hacer zoom al clic en la imagen del lightbox
    lightboxImg.addEventListener('click', function() {
      this.classList.toggle('zoom');
    });

    // cerrar
    lightboxClose.addEventListener('click', () => {
      lightbox.classList.add('hidden');
      lightbox.style.display = 'none';
    });
    lightbox.addEventListener('click', e => {
      if (e.target === lightbox) {
        lightbox.classList.add('hidden');
        lightbox.style.display = 'none';
      }
    });

    // navegación
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + gallery.length) % gallery.length;
        const img = gallery[currentIndex];
        lightboxImg.src = img.src;
        lightboxCaption.textContent = img.alt;
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % gallery.length;
        const img = gallery[currentIndex];
        lightboxImg.src = img.src;
        lightboxCaption.textContent = img.alt;
      });
    }
  }

  // 6. Manejo del banner de cookies
  function initCookieBanner() {
    const cookieBanner = document.getElementById('cookie-consent');
    const acceptBtn = document.getElementById('accept-cookies');
    const rejectBtn = document.getElementById('reject-cookies');
    
    if (!cookieBanner) return;
    
    if (localStorage.getItem('cookiesAccepted')) {
      cookieBanner.style.display = 'none';
    } else {
      // Mostrar banner después de un pequeño retraso para mejor UX
      setTimeout(() => {
        cookieBanner.style.opacity = '1';
      }, 1000);
    }
    
    if (acceptBtn) {
      acceptBtn.addEventListener('click', function() {
        localStorage.setItem('cookiesAccepted', 'true');
        cookieBanner.style.opacity = '0';
        setTimeout(() => {
          cookieBanner.style.display = 'none';
        }, 300);
      });
    }
    
    if (rejectBtn) {
      rejectBtn.addEventListener('click', function() {
        localStorage.setItem('cookiesAccepted', 'false');
        cookieBanner.style.opacity = '0';
        setTimeout(() => {
          cookieBanner.style.display = 'none';
        }, 300);
      });
    }
  }

  // 8. Indicador de progreso con scroll passivo y debounce
  function initProgressBar() {
    const progressBar = document.querySelector('.progress-value');
    let ticking = false;
    window.addEventListener('scroll', function(e) {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const total = document.body.scrollHeight - window.innerHeight;
          const pct = Math.round((window.pageYOffset / total) * 100);
          progressBar.style.width = pct + '%';
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // Añadir función para verificar y cargar imágenes
  function checkImages() {
    document.querySelectorAll('img').forEach(img => {
      // Se omite el manejo onerror para evitar reintentos infinitos de carga
      img.classList.add('loading');
      img.onload = function() {
        this.classList.remove('loading');
        this.classList.add('loaded');
      };
    });
  }

  // 9. Animar secciones e imágenes al hacer scroll
  function initSectionAnimations() {
    const sections = document.querySelectorAll('.accordion-section');
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // imágenes
          entry.target.querySelectorAll('.section-image')
            .forEach(img => img.classList.add('visible'));
          // bloques de texto
          entry.target.querySelectorAll('.text-content')
            .forEach(txt => txt.classList.add('visible'));
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    sections.forEach(sec => observer.observe(sec));
  }

  // Inicializar todos los componentes
  initSidebar();
  initAccordions();
  generateTOC();
  initLightbox();
  initCookieBanner();
  initProgressBar(); // Agregar la inicialización de la barra de progreso
  checkImages(); // Verificar imágenes
  initSectionAnimations(); // Llamar al final

  // Restaurar estado de acuerdo a la URL al cargar
  setTimeout(function() {
    const hash = window.location.hash;
    if (hash) {
      const section = document.querySelector(hash);
      if (section) {
        const toggle = section.querySelector('.accordion-toggle');
        if (toggle && toggle.getAttribute('aria-expanded') !== 'true') {
          toggle.click();
        }
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, 500);
});
