/* ═══════════════════════════════════════════════════════════════
   main.js — Master orchestrator
   Controls all phase transitions and wires modules together.
═══════════════════════════════════════════════════════════════ */

(function SystemController() {

  /* ── DOM refs ─────────────────────────────────────────── */
  const _phaseIdentity = document.getElementById('phase-identity');
  const _phaseMain     = document.getElementById('phase-main');
  const _enterBtn      = document.getElementById('enter-btn');
  const _hudClock      = document.getElementById('hud-clock');
  const _hudDate       = document.getElementById('hud-date');
  const _tickerText    = document.getElementById('ticker-text');

  /* ── Helpers ──────────────────────────────────────────── */
  function _wait(ms) { return new Promise(r => setTimeout(r, ms)); }

  /* ── HUD Clock ────────────────────────────────────────── */
  function _startClock() {
    const tick = () => {
      const n  = new Date();
      const hh = String(n.getHours()).padStart(2, '0');
      const mm = String(n.getMinutes()).padStart(2, '0');
      const ss = String(n.getSeconds()).padStart(2, '0');
      _hudClock.textContent = `${hh}:${mm}:${ss}`;

      const days   = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
      const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
      _hudDate.textContent = `${days[n.getDay()]} ${String(n.getDate()).padStart(2,'0')} ${months[n.getMonth()]} ${n.getFullYear()}`;
    };
    tick();
    setInterval(tick, 1000);
  }

  /* ── Status ticker ────────────────────────────────────── */
  function _startTicker() {
    const msgs   = CONFIG.tickerMessages;
    let   idx    = 0;

    const show = () => {
      _tickerText.style.opacity = '0';
      setTimeout(() => {
        _tickerText.textContent = msgs[idx % msgs.length];
        _tickerText.style.transition = 'opacity 1s';
        _tickerText.style.opacity = '1';
        idx++;
      }, 500);
    };

    show();
    setInterval(show, 6000);
  }

  /* ── Phase: Identity reveal ───────────────────────────── */
  async function _showIdentity() {
    Boot.hideSequence(async () => {
      _phaseIdentity.classList.add('active');

      // Staggered reveal of enter button
      await _wait(CONFIG.identity.buttonDelay);
      _enterBtn.style.opacity    = '1';
      _enterBtn.style.transform  = 'translateY(0)';
    });
  }

  /* ── Phase: Main interface ────────────────────────────── */
  function _showMain() {
    _phaseIdentity.classList.add('fade-out');

    setTimeout(() => {
      _phaseIdentity.classList.remove('active', 'fade-out');
      _phaseMain.classList.add('active');

      // Init all systems
      Visuals.init();
      Nodes.init(id => Overlays.open(id));
      _startClock();
      _startTicker();

    }, 550);
  }

  /* ── Wire enter button ────────────────────────────────── */
  _enterBtn.style.opacity   = '0';
  _enterBtn.style.transform = 'translateY(10px)';
  _enterBtn.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  _enterBtn.addEventListener('click', _showMain);

  // Also allow ENTER key on identity screen
  document.addEventListener('keydown', e => {
    if (e.key === 'Enter' && _phaseIdentity.classList.contains('active')) {
      _showMain();
    }
  });

  /* ── Expose global API (DevTools access) ─────────────── */
  window.RayyanNet = {
    openConsole:  () => RayyanConsole.show(),
    openNode:     (id) => Overlays.open(id),
    version:      '2.4.1',
  };

  /* ── Seed DevTools message ────────────────────────────── */
  RayyanConsole.seedDevTools();

  /* ── Boot ─────────────────────────────────────────────── */
  Boot.init(() => {
    // Sequence done → run loader → show identity
    Loader.run(() => _showIdentity());
  });

})();
