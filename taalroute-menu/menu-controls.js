/* Shared menu presentation; original application controls and handlers stay intact. */
(() => {
  if (window.TaalrouteMenu) return;
  const paths = {
    'notebook-text': '<path d="M2 6h4M2 10h4M2 14h4M2 18h4"/><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M9.5 8h5M9.5 12H16M9.5 16H14"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42"/>',
    moon: '<path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6.25 6.25 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"/>',
    monitor: '<rect width="20" height="14" x="2" y="3" rx="2"/><path d="M8 21h8M12 17v4"/>',
    'arrow-up-right': '<path d="M7 7h10v10M7 17 17 7"/>'
  };
  const icon = name => `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${paths[name] || ''}</svg>`;
  const labels = {light: 'Licht', dark: 'Donker', system: 'Volg apparaat'};
  function mount(panel, manual) {
    if (!panel || panel.classList.contains('tr-settings-panel')) return;
    panel.classList.add('tr-settings-panel');
    manual ||= panel.querySelector('a');
    if (manual) {
      manual.classList.add('tr-menu-manual');
      manual.innerHTML = icon('notebook-text') + '<span>Docentenhandleiding</span>' + (manual.target === '_blank' ? icon('arrow-up-right') : '');
      panel.prepend(manual);
    }
    if (!window.TaalrouteAppearance) return;
    const appearance = document.createElement('div');
    appearance.className = 'tr-menu-appearance';
    appearance.innerHTML = '<div class="tr-menu-label"><span>Kleurstand</span><span data-current-appearance></span></div><div class="tr-menu-modes" role="group" aria-label="Kleurstand">' + Object.entries(labels).map(([mode,label]) => `<button type="button" data-appearance-choice="${mode}" aria-label="${label}" title="${label}" aria-pressed="false">${icon(mode === 'light' ? 'sun' : mode === 'dark' ? 'moon' : 'monitor')}</button>`).join('') + '</div><p class="tr-menu-message" role="status"></p>';
    if (manual) manual.after(appearance); else panel.prepend(appearance);
    appearance.addEventListener('click', event => { const button = event.target.closest('[data-appearance-choice]'); if (button) window.TaalrouteAppearance.set(button.dataset.appearanceChoice); });
    sync(appearance);
  }
  function sync(appearance) {
      const api = window.TaalrouteAppearance;
      appearance.querySelector('[data-current-appearance]').textContent = labels[api.preference];
      appearance.querySelectorAll('[data-appearance-choice]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.appearanceChoice === api.preference)));
      appearance.querySelector('.tr-menu-message').textContent = api.message;
  }
  window.addEventListener('taalroute:appearance', () => document.querySelectorAll('.tr-menu-appearance').forEach(sync));
  window.TaalrouteMenu = {mount, icon};
})();
