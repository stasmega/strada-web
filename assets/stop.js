(() => {
  const messages = {
    en: {
      invalid: 'This link is missing a valid stop ID. Ask the sender to share the stop again, or find it in the Strada app.',
      download: 'You can get Strada using the Google Play link above.',
      description: 'Open this stop in Strada to see its routes and current departures.',
      code: 'Stop code: ', id: 'Stop ID: ', title: ' — Strada stop',
      guide: ' · Use the Open in Strada button on your Android phone. If the app is not installed, get it from Google Play first.'
    },
    et: {
      invalid: 'Lingil puudub kehtiv peatuse ID. Palu saatjal peatust uuesti jagada või leia see Strada rakendusest.',
      download: 'Strada saad alla laadida ülaloleva Google Play lingi kaudu.',
      description: 'Ava peatus Stradas, et näha selle liine ja praegusi väljumisi.',
      code: 'Peatuse kood: ', id: 'Peatuse ID: ', title: ' — Strada peatus',
      guide: ' · Vajuta Androidi telefonis nuppu „Ava Stradas”. Kui rakendus pole paigaldatud, laadi see esmalt alla Google Playst.'
    },
    ru: {
      invalid: 'В ссылке нет корректного ID остановки. Попросите отправителя поделиться остановкой ещё раз или найдите её в Strada.',
      download: 'Strada можно скачать по ссылке Google Play выше.',
      description: 'Откройте остановку в Strada, чтобы увидеть маршруты и ближайшие отправления.',
      code: 'Код остановки: ', id: 'ID остановки: ', title: ' — остановка Strada',
      guide: ' · Нажмите «Открыть в Strada» на телефоне Android. Если приложение не установлено, сначала скачайте его в Google Play.'
    }
  };
  const copy = messages[document.documentElement?.lang] || messages.en;
  const params = new URLSearchParams(window.location.search);
  const one = key => params.getAll(key).length === 1 ? params.get(key) : null;
  const validText = (value, limit) => typeof value === 'string' && value.trim().length > 0 &&
    value.length <= limit && !/[\u0000-\u001f\u007f\ufffd]/u.test(value);
  const id = one('id');
  const link = document.getElementById('app-link');
  const description = document.getElementById('stop-description');
  const status = document.getElementById('stop-status');
  const title = document.getElementById('stop-title');
  if (!validText(id, 256)) {
    link.hidden = true;
    link.removeAttribute('href');
    description.textContent = copy.invalid;
    status.textContent = copy.download;
    return;
  }

  const metadata = new URLSearchParams();
  const name = one('name');
  const code = one('code');
  if (validText(name, 200)) metadata.set('name', name);
  if (validText(code, 80)) metadata.set('code', code);
  const lat = one('lat');
  const lon = one('lon');
  if (lat?.trim() && lon?.trim() && Number.isFinite(Number(lat)) && Number.isFinite(Number(lon)) &&
      Math.abs(Number(lat)) <= 90 && Math.abs(Number(lon)) <= 180 && (Number(lat) !== 0 || Number(lon) !== 0)) {
    metadata.set('lat', lat);
    metadata.set('lon', lon);
    metadata.set('train', one('train') === 'true' ? 'true' : 'false');
  }
  const path = 'stop/' + encodeURIComponent(id) + (metadata.size ? '?' + metadata.toString() : '');
  const play = 'https://play.google.com/store/apps/details?id=com.stasmega.strada';
  const androidChrome = /Android/i.test(navigator.userAgent) && /Chrome|Chromium|SamsungBrowser|EdgA/i.test(navigator.userAgent);
  // Only a user click opens the app. Chrome can also send an uninstalled app to its store page.
  link.href = androidChrome
    ? 'intent://' + path + '#Intent;scheme=strada;package=com.stasmega.strada;S.browser_fallback_url=' + encodeURIComponent(play) + ';end'
    : 'strada://' + path;
  link.hidden = false;
  if (validText(name, 200)) {
    title.textContent = name;
    document.title = name + copy.title;
  }
  description.textContent = copy.description;
  status.textContent = (validText(code, 80) ? copy.code + code : copy.id + id) + copy.guide;
})();
