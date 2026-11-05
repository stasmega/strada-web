(() => {
  const id = new URLSearchParams(window.location.search).get('id');
  const link = document.getElementById('app-link');
  const description = document.getElementById('stop-description');
  const status = document.getElementById('stop-status');
  if (!id || !/^[A-Za-z0-9_-]{1,80}$/.test(id)) {
    description.textContent = 'This link is missing a valid stop ID. Ask the sender to share the stop again, or find it in the Strada app.';
    status.textContent = 'You can install Strada using the Google Play link above.';
    return;
  }
  link.href = 'strada://stop/' + encodeURIComponent(id);
  link.hidden = false;
  status.textContent = 'Stop ' + id + ' · Open in the app to see current departures. If Strada is not installed, get it from Google Play first.';
})();
