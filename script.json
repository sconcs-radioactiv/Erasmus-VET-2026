
  const menuIcon = document.getElementById('menuIcon');
  const sidebar = document.getElementById('sidebar');
  const headerBar = document.getElementById('headerBar');
  const hero = document.getElementById('hero');
  const heroBg = document.getElementById('heroBg');
  const heroTitle = document.getElementById('heroTitle');

  // --- Sidebar toggle ---
  menuIcon.addEventListener('click', () => {
    sidebar.classList.toggle('expanded');
    menuIcon.classList.toggle('open');
  });

  document.addEventListener('click', (e) => {
    if (!sidebar.contains(e.target) && !menuIcon.contains(e.target)) {
      sidebar.classList.remove('expanded');
      menuIcon.classList.remove('open');
    }
  });

  // --- Flyout hover: level 1 -> level 2 ---
  document.querySelectorAll('.nav-item.has-sub').forEach(item => {
    item.addEventListener('mouseenter', () => item.classList.add('hovered'));
    item.addEventListener('mouseleave', () => item.classList.remove('hovered'));
  });

  // --- Flyout hover: level 2 -> level 3 ---
  document.querySelectorAll('.sub-item.has-subsub').forEach(sub => {
    sub.addEventListener('mouseenter', () => sub.classList.add('hovered'));
    sub.addEventListener('mouseleave', () => sub.classList.remove('hovered'));
  });

  // --- Parallax + title shrink on scroll ---
  const maxSize = parseFloat(getComputedStyle(heroTitle).fontSize);
  const minSize = 1.2 * 16; // ~1.2rem, matches header bar size
  const heroHeight = () => hero.offsetHeight;

  function onScroll() {
    const scrollY = window.scrollY;
    const hh = heroHeight();

    // Parallax: move background at half speed
    const bgOffset = scrollY * 0.5;
    heroBg.style.transform = `translateY(${bgOffset}px)`;

    // Title shrink: as the title's natural position moves above the viewport top,
    // it "sticks" at the top and scales down from maxSize to minSize over the last
    // portion of the hero.
    const progress = Math.min(Math.max(scrollY / (hh * 0.6), 0), 1);
    const currentSize = maxSize - (maxSize - minSize) * progress;
    heroTitle.style.fontSize = `${currentSize}px`;

    // Hand off to header bar once the title is nearly fully shrunk
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
    // Recalculate max font size on resize
    heroTitle.style.fontSize = '';
    const newMax = parseFloat(getComputedStyle(heroTitle).fontSize);
    // Store for use in onScroll
    onScroll._maxSize = newMax;
    onScroll();
  });

  // Initialize
  onScroll._maxSize = maxSize;
  onScroll();
