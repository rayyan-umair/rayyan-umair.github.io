/* ═══════════════════════════════════════════════════════════════
   loader.js — Progress bar + block fill animation
   Owns: the loader bar, block indicators, percentage display
═══════════════════════════════════════════════════════════════ */

const Loader = (() => {

  const _bar        = document.getElementById('seq-loader-bar');
  const _pctText    = document.getElementById('loader-pct-text');
  const _statusText = document.getElementById('loader-status-text');
  const _blockWrap  = document.getElementById('loader-blocks');

  const _statusSteps = [
    { at: 0,   text: 'LOADING OPERATOR PROFILE'     },
    { at: 25,  text: 'MOUNTING EXPERIENCE MODULES'  },
    { at: 50,  text: 'VALIDATING CREDENTIALS'       },
    { at: 75,  text: 'INITIALIZING INTERFACE NODES' },
    { at: 95,  text: 'FINALIZING ENVIRONMENT'       },
  ];

  /* ── Build block indicators ───────────────────────────── */
  function _buildBlocks() {
    _blockWrap.innerHTML = '';
    for (let i = 0; i < CONFIG.loader.blockCount; i++) {
      const b = document.createElement('div');
      b.className = 'lb';
      b.dataset.index = i;
      _blockWrap.appendChild(b);
    }
  }

  function _updateBlocks(pct) {
    const filled = Math.floor((pct / 100) * CONFIG.loader.blockCount);
    _blockWrap.querySelectorAll('.lb').forEach((b, i) => {
      if (i < filled) b.classList.add('lit');
      else            b.classList.remove('lit');
    });
  }

  function _updateStatus(pct) {
    for (let i = _statusSteps.length - 1; i >= 0; i--) {
      if (pct >= _statusSteps[i].at) {
        _statusText.textContent = _statusSteps[i].text;
        break;
      }
    }
  }

  /* ── Run loader ───────────────────────────────────────── */
  function run(onComplete) {
    _buildBlocks();

    const duration = CONFIG.loader.duration;
    const interval = 30;
    const steps    = duration / interval;
    let progress   = 0;

    const tick = setInterval(() => {
      // Natural-feeling easing with slight randomness
      const remaining = 100 - progress;
      const increment = (remaining * 0.06) + (Math.random() * 0.8);
      progress = Math.min(progress + increment, 100);

      const display = Math.floor(progress);
      _bar.style.width     = `${progress}%`;
      _pctText.textContent = `${display}%`;
      _updateBlocks(display);
      _updateStatus(display);

      if (progress >= 100) {
        clearInterval(tick);
        _bar.style.width     = '100%';
        _pctText.textContent = '100%';
        _updateBlocks(100);
        _statusText.textContent = 'COMPLETE';
        setTimeout(() => { if (onComplete) onComplete(); }, 400);
      }
    }, interval);
  }

  return { run };

})();
