(() => {
  const choiceKey = 'strada-storage-choice-v1';
  const languageKey = 'strada-language';
  const validChoice = value => value === 'preferences' || value === 'necessary' ? value : null;
  const validLanguage = value => ['en', 'et', 'ru'].includes(value);
  const read = key => { try { return localStorage.getItem(key); } catch { return null; } };
  const write = (key, value) => { try { localStorage.setItem(key, value); } catch {} };
  const forgetLanguage = () => { try { localStorage.removeItem(languageKey); } catch {} };
  let choice = validChoice(read(choiceKey));
  // Old language preferences do not bypass the new explicit choice.
  if (choice !== 'preferences') forgetLanguage();
  const notice = document.querySelector('[data-storage-notice]');
  const settings = document.querySelector('[data-storage-settings]');
  if (settings) settings.hidden = false;
  let opener = null;
  const hide = () => {
    if (!notice) return;
    const needsFocus = notice.contains(document.activeElement);
    notice.hidden = true;
    if (needsFocus) (opener || settings)?.focus({ preventScroll: true });
    opener = null;
  };
  const rememberLanguage = language => {
    if (choice === 'preferences' && validLanguage(language)) write(languageKey, language);
  };
  window.stradaStorage = {
    rememberLanguage,
    language: () => choice === 'preferences' ? read(languageKey) : null
  };
  const choose = value => {
    choice = value;
    write(choiceKey, value);
    if (choice === 'preferences') rememberLanguage(document.documentElement.lang);
    else forgetLanguage();
    hide();
  };
  notice?.querySelector('[data-storage-accept]')?.addEventListener('click', () => choose('preferences'));
  notice?.querySelector('[data-storage-necessary]')?.addEventListener('click', () => choose('necessary'));
  settings?.addEventListener('click', () => {
    if (!notice) return;
    opener = settings;
    notice.hidden = false;
    notice.querySelector('[data-storage-necessary]')?.focus({ preventScroll: true });
  });
  if (notice) notice.hidden = choice !== null;
  window.addEventListener('storage', event => {
    if (event.key !== choiceKey && event.key !== null) return;
    choice = validChoice(read(choiceKey));
    if (choice !== 'preferences') forgetLanguage();
    if (notice) {
      if (choice === null) notice.hidden = false;
      else hide();
    }
  });
})();
