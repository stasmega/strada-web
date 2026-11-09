(() => {
  const base = new URL('../',document.currentScript.src);
  const current = document.documentElement.lang;
  const route = location.pathname.slice(base.pathname.length).replace(/^(et|ru)\//,'');
  const links = document.querySelectorAll('[data-language]');
  links.forEach(link => {
    const target = new URL(link.href);
    target.search = location.search;
    target.hash = location.hash;
    link.href = target.href;
    link.addEventListener('click',() => {
      // Feature selection can change the fragment after the page has loaded.
      target.search = location.search;
      target.hash = location.hash;
      link.href = target.href;
      window.stradaStorage?.rememberLanguage(link.dataset.language);
    });
  });
  try {
    const preference = window.stradaStorage?.language();
    // An explicit localized URL wins over the saved preference.
    if (current==='en' && (preference==='ru'||preference==='et')) {
      const target = new URL(preference+'/'+route,base);
      target.search=location.search;
      target.hash=location.hash;
      location.replace(target.href);
    }
  } catch { /* All language links work without browser storage or JavaScript. */ }
})();
