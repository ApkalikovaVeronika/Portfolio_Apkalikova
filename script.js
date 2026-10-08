(() => {
  const body = document.body;
  const dot = document.querySelector('.cursor-dot');
  const label = document.querySelector('.cursor-label');
  const projects = [...document.querySelectorAll('.project')];
  const navItems = [...document.querySelectorAll('.nav-item')];
  const sections = [...document.querySelectorAll('#work, #info')];

  if (window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener('pointermove', (event) => {
      body.classList.add('has-pointer');
      dot.style.left = `${event.clientX}px`;
      dot.style.top = `${event.clientY}px`;
      label.style.left = `${event.clientX}px`;
      label.style.top = `${event.clientY}px`;
    });

    projects.forEach((project) => {
      const image = project.querySelector('.project-image-wrap');
      project.addEventListener('pointerenter', () => { label.textContent = project.dataset.index + ' / VIEW'; });
      project.addEventListener('pointermove', (event) => {
        const rect = project.getBoundingClientRect();
        const dx = (event.clientX - (rect.left + rect.width / 2)) / rect.width;
        const dy = (event.clientY - (rect.top + rect.height / 2)) / rect.height;
        image.style.setProperty('--mx', `${dx * 10}px`);
        image.style.setProperty('--my', `${dy * 7}px`);
      });
      project.addEventListener('pointerleave', () => {
        image.style.setProperty('--mx', '0px');
        image.style.setProperty('--my', '0px');
      });
    });
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navItems.forEach((item) => item.classList.toggle('is-active', item.getAttribute('href') === `#${entry.target.id}`));
    });
  }, { threshold: 0.18 });
  sections.forEach((section) => observer.observe(section));

  let ticking = false;
  const update = () => {
    const viewport = window.innerHeight;
    projects.forEach((project) => {
      const wrap = project.querySelector('.project-image-wrap');
      const rect = project.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const progress = Math.max(-1, Math.min(1, (center - viewport / 2) / viewport));
      const depth = Number(project.dataset.index) % 2 ? -10 : 10;
      wrap.style.setProperty('--scroll-y', `${progress * depth}px`);
    });
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
  update();
})();
