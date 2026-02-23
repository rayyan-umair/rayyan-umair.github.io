/* ═══════════════════════════════════════════════════════════════
   boot.js — Phase 1 (terminal) and Phase 2 (boot sequence)
   Owns: detection line, ENTER capture, typed log lines
═══════════════════════════════════════════════════════════════ */

const Boot = (() => {

  /* ── DOM refs ─────────────────────────────────────────── */
  const _phaseBoot     = document.getElementById('phase-boot');
  const _phaseSeq      = document.getElementById('phase-sequence');
  const _detectLine    = document.getElementById('detect-line');
  const _seqLines      = document.getElementById('seq-lines');
  const _seqTimestamp  = document.getElementById('seq-timestamp');
  const _seqLoader     = document.getElementById('seq-loader');

  let _onSequenceDone  = null;

  /* ── Helpers ──────────────────────────────────────────── */
  function _timestamp() {
    const n = new Date();
    return n.toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
  }

  function _wait(ms) {
    return new Promise(res => setTimeout(res, ms));
  }

  /* ── Type a single character at a time into an element ── */
  function _typeLine(el, text, speed = 18) {
    return new Promise(resolve => {
      let i = 0;
      // Add blinking cursor span
      const cursor = document.createElement('span');
      cursor.className = 'cursor-blink';
      cursor.textContent = '_';
      el.appendChild(cursor);

      const tick = setInterval(() => {
        if (i < text.length) {
          cursor.before(document.createTextNode(text[i]));
          i++;
        } else {
          clearInterval(tick);
          cursor.remove();
          resolve();
        }
      }, speed);
    });
  }

  /* ── Append a log line (instant or typed) ────────────── */
  async function _appendLine(msg) {
    const div = document.createElement('div');
    div.className = 'seq-line';
    _seqLines.appendChild(div);

    // Small stagger before making visible
    await _wait(10);
    div.classList.add('visible');

    if (msg.type === 'divider') {
      div.classList.add('divider-line');
      div.textContent = msg.text;
      await _wait(80);
      return;
    }

    if (msg.type === 'era') {
      div.classList.add('divider-line');
      // Typed for era lines — feels like printing
      const tag = document.createElement('span');
      tag.className = 'stag era';
      div.appendChild(tag);
      await _typeLine(div, msg.text, 12);
      await _wait(60);
      return;
    }

    if (msg.type === 'ok') {
      const tag = document.createElement('span');
      tag.className = 'stag ok';
      tag.textContent = '[OK]  ';
      div.appendChild(tag);
      div.classList.add('identity-line');
      await _typeLine(div, msg.text, 20);
      await _wait(200);
      return;
    }

    // Default: sys lines
    const tag = document.createElement('span');
    tag.className = 'stag';
    tag.textContent = '[SYS] ';
    div.appendChild(tag);
    await _typeLine(div, msg.text, 16);
    await _wait(100);
  }

  /* ── Run full sequence ────────────────────────────────── */
  async function _runSequence() {
    _seqTimestamp.textContent = _timestamp();
    _phaseSeq.classList.add('active');

    // Small pause before first line
    await _wait(300);

    for (const msg of CONFIG.bootMessages) {
      await _appendLine(msg);
      _seqLines.scrollTop = _seqLines.scrollHeight;
    }

    // Pause then reveal loader
    await _wait(400);
    _seqLoader.classList.remove('hidden');

    if (_onSequenceDone) _onSequenceDone();
  }

  /* ── Phase 1: detection line then await ENTER ─────────── */
  async function _startBootScreen() {
    _phaseBoot.classList.add('active');

    // Type detection line character by character
    await _wait(600);
    await _typeLine(_detectLine, CONFIG.detectionLine, 22);
    await _wait(300);

    // Listen for ENTER (keyboard) or click/tap (mobile)
    const proceed = () => {
      _phaseBoot.classList.add('fade-out');
      setTimeout(() => {
        _phaseBoot.classList.remove('active', 'fade-out');
        _runSequence();
      }, 500);
    };

    const onKey = (e) => {
      if (e.key === 'Enter') {
        document.removeEventListener('keydown', onKey);
        _phaseBoot.removeEventListener('click', onClick);
        proceed();
      }
    };
    const onClick = () => {
      document.removeEventListener('keydown', onKey);
      _phaseBoot.removeEventListener('click', onClick);
      proceed();
    };

    document.addEventListener('keydown', onKey);
    _phaseBoot.addEventListener('click', onClick);
  }

  /* ── Public API ───────────────────────────────────────── */
  function init(onSequenceDone) {
    _onSequenceDone = onSequenceDone;
    _startBootScreen();
  }

  function hideSequence(onDone) {
    _phaseSeq.classList.add('fade-out');
    setTimeout(() => {
      _phaseSeq.classList.remove('active', 'fade-out');
      if (onDone) onDone();
    }, 500);
  }

  return { init, hideSequence };

})();
