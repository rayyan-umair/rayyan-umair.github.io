/* ═══════════════════════════════════════════════════════════════
   main.js — Master orchestrator v3.0
   · Glitch decode on identity name
   · HUD: signal bars, threat level, packet counter, uptime
   · Idle threat escalation
   · Ticker with fade transitions
═══════════════════════════════════════════════════════════════ */

(function SystemController() {

  /* ── DOM refs ─────────────────────────────────────────── */
  const _phaseIdentity = document.getElementById('phase-identity');
  const _phaseMain     = document.getElementById('phase-main');
  const _enterBtn      = document.getElementById('enter-btn');
  const _idName        = document.getElementById('id-name-glitch');
  const _hudClock      = document.getElementById('hud-clock');
  const _hudDate       = document.getElementById('hud-date');
  const _hudUptime     = document.getElementById('hud-uptime');
  const _hudThreat     = document.getElementById('hud-threat');
  const _hudThreatVal  = document.getElementById('hud-threat-val');
  const _hudSignal     = document.getElementById('hud-signal');
  const _hudPkt        = document.getElementById('hud-pkt');
  const _tickerText    = document.getElementById('ticker-text');

  let _pktCount   = Math.floor(Math.random() * 50000);
  let _lastActive = Date.now();
  let _threatNom  = true;

  function _wait(ms) { return new Promise(r => setTimeout(r, ms)); }

  /* ── Glitch decode name ───────────────────────────────── */
  const _gc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@!%';

  async function _glitchName() {
    if (!_idName) return;
    const lines = ['RAYYAN', 'UMAIR'];
    _idName.innerHTML = '';

    for (const word of lines) {
      const span = document.createElement('div');
      _idName.appendChild(span);

      await new Promise(resolve => {
        let step = 0;
        const steps = 22;
        const tick = setInterval(() => {
          if (step >= steps) {
            clearInterval(tick);
            span.textContent = word;
            resolve();
            return;
          }
          const progress = step / steps;
          let result = '';
          for (let i = 0; i < word.length; i++) {
            result += (i / word.length < progress)
              ? word[i]
              : _gc[Math.floor(Math.random() * _gc.length)];
          }
          span.textContent = result;
          step++;
        }, 38);
      });
      await _wait(120);
    }
  }

  /* ── HUD Clock + date ─────────────────────────────────── */
  function _startClock() {
    const days   = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
    const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
    const tick = () => {
      const n  = new Date();
      const hh = String(n.getHours()).padStart(2,'0');
      const mm = String(n.getMinutes()).padStart(2,'0');
      const ss = String(n.getSeconds()).padStart(2,'0');
      if (_hudClock) _hudClock.textContent = `${hh}:${mm}:${ss}`;
      if (_hudDate)  _hudDate.textContent  =
        `${days[n.getDay()]} ${String(n.getDate()).padStart(2,'0')} ${months[n.getMonth()]} ${n.getFullYear()}`;
    };
    tick();
    setInterval(tick, 1000);
  }

  /* ── Uptime counter ───────────────────────────────────── */
  function _startUptime() {
    if (!_hudUptime) return;
    const start = new Date(CONFIG.hud.uptimeStart).getTime();
    const tick = () => {
      const diff  = Date.now() - start;
      const days  = Math.floor(diff / 86400000);
      const hrs   = Math.floor((diff % 86400000) / 3600000);
      const mins  = Math.floor((diff % 3600000)  / 60000);
      _hudUptime.textContent = `UP: ${days}D ${String(hrs).padStart(2,'0')}H ${String(mins).padStart(2,'0')}M`;
    };
    tick();
    setInterval(tick, 60000);
  }

  /* ── Signal bars ──────────────────────────────────────── */
  function _startSignal() {
    if (!_hudSignal) return;
    const bars  = ['▁','▂','▃','▄','▅'];
    let   phase = 0;
    const tick  = () => {
      phase += 0.04;
      const level = Math.floor(3.5 + Math.sin(phase) * 1.4);
      _hudSignal.textContent = bars.slice(0, level + 1).join('') +
        `<span style="opacity:0.2">${bars.slice(level + 1).join('')}</span>`;
    };
    setInterval(tick, 400);
    tick();
  }

  /* ── Packet counter ───────────────────────────────────── */
  function _startPktCounter() {
    if (!_hudPkt) return;
    const tick = () => {
      _pktCount += Math.floor(Math.random() * 12) + 1;
      _hudPkt.textContent = `PKT: ${String(_pktCount).padStart(7,'0')}`;
    };
    setInterval(tick, 300);
    tick();
  }

  /* ── Threat level ─────────────────────────────────────── */
  function _startThreat() {
    if (!_hudThreatVal) return;
    _hudThreatVal.textContent = 'NOMINAL';
    _hudThreatVal.style.color = 'var(--amber-dim)';

    // Watch idle
    ['mousemove','keydown','click','touchstart'].forEach(ev =>
      document.addEventListener(ev, () => { _lastActive = Date.now(); })
    );

    setInterval(() => {
      const idle = Date.now() - _lastActive;
      if (idle > CONFIG.hud.idleThreshold && _threatNom) {
        _threatNom = false;
        _hudThreatVal.textContent = 'ELEVATED';
        _hudThreatVal.style.color = 'var(--cyan)';
        setTimeout(() => {
          _threatNom = true;
          _hudThreatVal.textContent = 'NOMINAL';
          _hudThreatVal.style.color = 'var(--amber-dim)';
        }, 8000);
      }
    }, 10000);
  }

  /* ── Ticker ───────────────────────────────────────────── */
  function _startTicker() {
    if (!_tickerText) return;
    const msgs = CONFIG.tickerMessages;
    let idx = 0;
    const show = () => {
      _tickerText.style.opacity = '0';
      setTimeout(() => {
        _tickerText.textContent = msgs[idx % msgs.length];
        _tickerText.style.transition = 'opacity 1s';
        _tickerText.style.opacity = '1';
        idx++;
      }, 600);
    };
    show();
    setInterval(show, 7000);
  }

  /* ── Identity phase ───────────────────────────────────── */
  async function _showIdentity() {
    Boot.hideSequence(async () => {
      _phaseIdentity.classList.add('active');
      await _wait(300);
      await _glitchName();
      await _wait(CONFIG.identity.buttonDelay);
      _enterBtn.style.opacity   = '1';
      _enterBtn.style.transform = 'translateY(0)';
    });
  }

  /* ── Main phase ───────────────────────────────────────── */
  function _showMain() {
    _phaseIdentity.classList.add('fade-out');
    setTimeout(() => {
      _phaseIdentity.classList.remove('active','fade-out');
      _phaseMain.classList.add('active');
      Visuals.init();
      Nodes.init(id => {
        Overlays.open(id);
      });
      _startClock();
      _startUptime();
      _startSignal();
      _startPktCounter();
      _startThreat();
      _startTicker();
    }, 550);
  }

  /* ── Wire enter ───────────────────────────────────────── */
  _enterBtn.style.opacity   = '0';
  _enterBtn.style.transform = 'translateY(12px)';
  _enterBtn.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  _enterBtn.addEventListener('click', _showMain);
  document.addEventListener('keydown', e => {
    if (e.key === 'Enter' && _phaseIdentity.classList.contains('active')) _showMain();
  });

  /* ── Global API ───────────────────────────────────────── */
  window.RayyanNet = {
    openConsole: () => RayyanConsole.show(),
    openNode:    (id) => Overlays.open(id),
    setThreat:   (level) => {
      if (_hudThreatVal) {
        _hudThreatVal.textContent = level;
        _hudThreatVal.style.color = level === 'NOMINAL' ? 'var(--amber-dim)' :
                                    level === 'ELEVATED' ? 'var(--cyan)' : '#ff4040';
      }
    },
    version: '3.0.0',
  };

  RayyanConsole.seedDevTools();

  Boot.init(() => {
    Loader.run(() => _showIdentity());
  });

})();
