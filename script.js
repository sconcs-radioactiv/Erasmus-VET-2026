// ==========================================
// 1. DEFINIREA COMPONENTELOR WEB (Custom Elements)
// ==========================================

class HeaderNav extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <button class="menu-icon" id="menuIcon" aria-label="Toggle menu">
        <span></span><span></span><span></span>
      </button>

      <nav class="sidebar" id="sidebar">
        <ul class="nav-list">
          <li class="nav-item">
            <button><a href="index.html">Acasa</a></button>
          </li>

          <li class="nav-item has-sub">
            <button>Spania <span class="nav-arrow">▶</span></button>
            <ul class="sub-list">
              <li class="sub-item"><button><a href="spania/culturala.html">Experienta culturala</a></button></li>
              <li class="sub-item has-subsub">
                <button>Experienta profesionala<span class="nav-arrow">▶</span></button>
                <ul class="subsub-list">
                  <li><a href="spania/mate-info.html">Mate-Info</a></li>
                  <li><a href="spania/pedagogie.html">Pedagogie</a></li>
                </ul>
              </li>
            </ul>
          </li>

          <li class="nav-item has-sub">
            <button>Portugalia <span class="nav-arrow">▶</span></button>
            <ul class="sub-list">
              <li class="sub-item"><button><a href="portugalia/culturala.html">Experienta culturala</a></button></li>
              <li class="sub-item has-subsub">
                <button>Experienta profesionala<span class="nav-arrow">▶</span></button>
                <ul class="subsub-list">
                  <li><a href="portugalia/mate-info.html">Mate-Info</a></li>
                  <li><a href="portugalia/pedagogie.html">Pedagogie</a></li>
                </ul>
              </li>
            </ul>
          </li>

          <li class="nav-item has-sub">
            <button>Activitati de diseminare<span class="nav-arrow">▶</span></button>
            <ul class="sub-list">
              <li class="sub-item"><button><a href="diseminare/ziar.html">Articol ziar</a></button></li>
              <li class="sub-item"><button><a href="diseminare/radio.html">Emisiune radio</a></button></li>
              <li class="sub-item"><button><a href="diseminare/tv.html">Emisiune TV</a></button></li>
            </ul>
          </li>
        </ul>
      </nav>
    `;

    // Inițializăm toate evenimentele de navigație după ce HTML-ul s-a încărcat
    initNavigationEvents();
  }
}
customElements.define('header-nav', HeaderNav);


class SiteFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer>
        <p>©2026 Colegiul National de Informatica "Matei Basarab"</p>
      </footer>
    `;
  }
}
customElements.define('site-footer', SiteFooter);


// ==========================================
// 2. EVENIMENTE SI LOGICA MENIU
// ==========================================

function initNavigationEvents() {
  const menuIcon = document.getElementById('menuIcon');
  const sidebar = document.getElementById('sidebar');

  // Funcție ajutătoare pentru închiderea tuturor submeniurilor
  const closeAllSubmenus = () => {
    document.querySelectorAll('.sidebar .open, .sidebar .hovered').forEach(el => {
      el.classList.remove('open', 'hovered');
    });
  };

  if (menuIcon && sidebar) {
    // Deschidere / Închidere Sidebar
    menuIcon.addEventListener('click', () => {
      const isExpanded = sidebar.classList.contains('expanded');
      sidebar.classList.toggle('expanded');
      menuIcon.classList.toggle('open');

      // Dacă închidem sidebar-ul, resetăm și submeniurile din el
      if (isExpanded) {
        closeAllSubmenus();
      }
    });

    // Închidere la click în afara sidebar-ului
    document.addEventListener('click', (e) => {
      if (!sidebar.contains(e.target) && !menuIcon.contains(e.target)) {
        sidebar.classList.remove('expanded');
        menuIcon.classList.remove('open');
        closeAllSubmenus();
      }
    });
  }

  // --- Hover (Desktop) ---
  document.querySelectorAll('.nav-item.has-sub').forEach(item => {
    item.addEventListener('mouseenter', () => item.classList.add('hovered'));
    item.addEventListener('mouseleave', () => item.classList.remove('hovered'));
  });

  document.querySelectorAll('.sub-item.has-subsub').forEach(sub => {
    sub.addEventListener('mouseenter', () => sub.classList.add('hovered'));
    sub.addEventListener('mouseleave', () => sub.classList.remove('hovered'));
  });

  // --- Click pe butoane cu link-uri (Extinde suprafața de click pe tot butonul) ---
  document.querySelectorAll('.sidebar button:has(a)').forEach(button => {
    button.addEventListener('click', () => {
      const link = button.querySelector('a');
      if (link) {
        window.location.href = link.getAttribute('href');
      }
    });
  });

  // --- Toggle submeniuri (Mobil / Click) ---
  document.querySelectorAll('.has-sub > button, .has-subsub > button').forEach(button => {
    button.addEventListener('click', (e) => {
      // Dacă butonul este doar pentru deschidere submeniu (fără link direct)
      if (!button.querySelector('a')) {
        e.preventDefault();
        e.stopPropagation();

        const parentLi = button.parentElement;
        const isOpen = parentLi.classList.contains('open');

        // Închidem celelalte submeniuri de pe același nivel
        const siblings = parentLi.parentElement.children;
        Array.from(siblings).forEach(sibling => {
          if (sibling !== parentLi) {
            sibling.classList.remove('open', 'hovered');
            sibling.querySelectorAll('.open, .hovered').forEach(child => {
              child.classList.remove('open', 'hovered');
            });
          }
        });

        // Comutăm starea pe cel curent
        if (!isOpen) {
          parentLi.classList.add('open');
        } else {
          parentLi.classList.remove('open', 'hovered');
        }
      }
    });
  });
}


// ==========================================
// 3. PARALLAX + TITLE SHRINK ON SCROLL
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
  const headerBar = document.getElementById('headerBar');
  const hero = document.getElementById('hero');
  const heroBg = document.getElementById('heroBg');
  const heroTitle = document.getElementById('heroTitle');

  if (!hero || !heroBg || !heroTitle || !headerBar) return;

  let maxSize = parseFloat(getComputedStyle(heroTitle).fontSize);
  const minSize = 1.2 * 16; 
  const heroHeight = () => hero.offsetHeight;

  function onScroll() {
    const scrollY = window.scrollY;
    const hh = heroHeight();

    const bgOffset = scrollY * 0.5;
    heroBg.style.transform = `translateY(${bgOffset}px)`;

    const progress = Math.min(Math.max(scrollY / (hh * 0.6), 0), 1);
    const currentSize = maxSize - (maxSize - minSize) * progress;
    heroTitle.style.fontSize = `${currentSize}px`;

    if (scrollY > hh * 0.7) {
      headerBar.classList.add('visible');
      heroTitle.style.opacity = String(1 - Math.min((scrollY - hh * 0.7) / (hh * 0.15), 1));
    } else {
      headerBar.classList.remove('visible');
      heroTitle.style.opacity = '1';
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  
  window.addEventListener('resize', () => {
    heroTitle.style.fontSize = '';
    maxSize = parseFloat(getComputedStyle(heroTitle).fontSize);
    onScroll();
  });

  onScroll();
});