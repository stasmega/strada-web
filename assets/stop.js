(() => {
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
    description.textContent = 'This link is missing a valid stop ID. Ask the sender to share the stop again, or find it in the Strada app.';
    status.textContent = 'You can get Strada using the Google Play link above.';
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
    document.title = name + ' — Strada stop';
  }
  description.textContent = 'Open this stop in Strada to see its routes and current departures.';
  status.textContent = (validText(code, 80) ? 'Stop code: ' + code : 'Stop ID: ' + id) +
    ' · Use the Open in Strada button on your Android phone. If the app is not installed, get it from Google Play first.';
})();
