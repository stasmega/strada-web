(() => {
  const options = [...document.querySelectorAll('[data-feature]')];
  const screens = [...document.querySelectorAll('.feature-screen')];
  if (!options.length || !screens.length) return;
  document.documentElement.classList.add('interactive');
  const show = (id, animate = false) => {
    if (!screens.some(screen => screen.id === id)) return false;
    options.forEach(option => {
      if (option.dataset.feature === id) option.setAttribute('aria-current', 'true');
      else option.removeAttribute('aria-current');
    });
    screens.forEach(screen => {
      screen.hidden = screen.id !== id;
      screen.classList.toggle('is-changing', animate && !screen.hidden);
    });
    return true;
  };
  if (!show(location.hash.slice(1))) show('live-map');
  options.forEach(option => option.addEventListener('click', event => {
    event.preventDefault();
    show(option.dataset.feature, true);
    history.replaceState(null, '', option.hash);
  }));
  window.addEventListener('hashchange', () => show(location.hash.slice(1)));
  document.querySelectorAll('.menu-panel a').forEach(link => link.addEventListener('click', () => {
    const menu = document.querySelector('.mobile-menu');
    if (menu) menu.open = false;
  }));
})();
