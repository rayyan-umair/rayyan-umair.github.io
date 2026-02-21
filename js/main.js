/* =========================================================
   main.js — System orchestrator, phase transitions
   ========================================================= */

(function SystemController() {

  const _identityScreen = document.getElementById('identity-screen');
  const _mainInterface  = document.getElementById('main-interface');
  const _enterBtn       = document.getElementById('enter-btn');
  const _hudTime        = document.getElementById('hud-time');

  // ── HUD Clock ─────────────────────────────────────────────
  function _startClock() {
    function tick() {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      _hudTime.textContent = `${h}:${m}:${s}`;
    }
    tick();
    setInterval(tick, 1000);
  }

  // ── Phase Transitions ─────────────────────────────────────
  function _showIdentity() {
    Boot.hideSequence(() => {
      _identityScreen.classList.add('active');
    });
  }

  function _showMainInterface() {
    _identityScreen.classList.add('fade-out');
    setTimeout(() => {
      _identityScreen.classList.remove('active', 'fade-out');
      _mainInterface.classList.add('active');
      Visuals.init();
      Nodes.init((nodeId) => Overlays.open(nodeId));
      _startClock();
    }, 600);
  }

  // ── Bootstrap ─────────────────────────────────────────────
  function _init() {
    Boot.init(() => {
      // Boot messages done → run loader
      Loader.run(() => {
        // Loader done → show identity
        setTimeout(_showIdentity, 400);
      });
    });

    _enterBtn.addEventListener('click', _showMainInterface);
  }

  // Start when DOM ready (scripts are deferred via placement at end of body)
  _init();

})();
