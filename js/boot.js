/* ═══════════════════════════════════════════════════════════════
   boot.js — Phase 1 & 2 — upgraded v3.0
   · Red flash on detection line
   · Glitch chars on era years
   · Long pause + centered IDENTITY CONFIRMED
   · Session counter from localStorage
═══════════════════════════════════════════════════════════════ */

const Boot = (() => {

  const _phaseBoot    = document.getElementById('phase-boot');
  const _phaseSeq     = document.getElementById('phase-sequence');
  const _detectLine   = document.getElementById('detect-line');
  const _seqLines     = document.getElementById('seq-lines');
  const _seqTimestamp = document.getElementById('seq-timestamp');
  const _seqLoader    = document.getElementById('seq-loader');

  let _onSequenceDone = null;

  /* ── Helpers ──────────────────────────────────────────── */
  function _wait(ms) { return new Promise(r => setTimeout(r, ms)); }

  function _timestamp() {
    const n = new Date();
    return n.toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
  }

  /* ── Session counter ──────────────────────────────────── */
  function _getSession() {
    const count = parseInt(localStorage.getItem('rn_visits') || '0') + 1;
    localStorage.setItem('rn_visits', count);
    const last  = localStorage.getItem('rn_last');
    localStorage.setItem('rn_last', new Date().toISOString());
    return { count, last };
  }

  /* ── Type characters one by one ──────────────────────── */
  function _typeLine(el, text, speed = 18) {
    return new Promise(resolve => {
      let i = 0;
      const cursor = document.createElement('span');
      cursor.className = 'cursor-blink';
      cursor.textContent = '_';
      el.appendChild(cursor);
      const tick = setInterval(() => {
        if (i < text.length) {
          cursor.before(document.createTextNode(text[i]));
          if (typeof Audio !== 'undefined') Audio.keyClick();
          i++;
        } else {
          clearInterval(tick);
          cursor.remove();
          resolve();
        }
      }, speed);
    });
  }

  /* ── Glitch decode a short string ────────────────────── */
  const _glitchChars = 'ABCDEF0123456789#@!%&*';
  function _glitchText(el, finalText, duration = 600) {
    return new Promise(resolve => {
      const span = document.createElement('span');
      span.style.color = 'var(--amber-bright)';
      el.appendChild(span);
      const steps = 18;
      const interval = duration / steps;
      let step = 0;
      const tick = setInterval(() => {
        if (step >= steps) {
          clearInterval(tick);
          span.textContent = finalText;
          resolve();
          return;
        }
        const progress = step / steps;
        let result = '';
        for (let i = 0; i < finalText.length; i++) {
          if (i / finalText.length < progress) {
            result += finalText[i];
          } else {
            result += _glitchChars[Math.floor(Math.random() * _glitchChars.length)];
          }
        }
        span.textContent = result;
        step++;
      }, interval);
    });
  }

  /* ── Append a log line ────────────────────────────────── */
  async function _appendLine(msg) {
    if (msg.type === 'divider') {
      const div = document.createElement('div');
      div.className = 'seq-line divider-line visible';
      div.textContent = msg.text;
      _seqLines.appendChild(div);
      await _wait(60);
      return;
    }

    if (msg.type === 'era') {
      const div = document.createElement('div');
      div.className = 'seq-line visible';
      _seqLines.appendChild(div);

      // Extract year and content
      const bracketEnd = msg.text.indexOf(']');
      const yearPart   = msg.text.slice(0, bracketEnd + 1);
      const restPart   = msg.text.slice(bracketEnd + 1);

      // Glitch the year, then type the rest
      await _glitchText(div, yearPart, 400);
      await _typeLine(div, restPart, 10);
      await _wait(55);
      return;
    }

    if (msg.type === 'ok') {
      // Long dramatic pause before OK
      await _wait(900);
      const div = document.createElement('div');
      div.className = 'seq-line identity-line visible';
      _seqLines.appendChild(div);
      const tag = document.createElement('span');
      tag.className = 'stag ok';
      tag.textContent = '[OK]  ';
      div.appendChild(tag);
      await _typeLine(div, msg.text, 25);
      await _wait(300);
      return;
    }

    // sys
    const div = document.createElement('div');
    div.className = 'seq-line visible';
    _seqLines.appendChild(div);
    const tag = document.createElement('span');
    tag.className = 'stag';
    tag.textContent = '[SYS] ';
    div.appendChild(tag);
    await _typeLine(div, msg.text, 15);
    await _wait(80);
  }

  /* ── Run sequence ─────────────────────────────────────── */
  async function _runSequence() {
    const { count, last } = _getSession();
    _seqTimestamp.textContent = _timestamp();
    _phaseSeq.classList.add('active');

    // Show session info
    await _wait(250);
    const sessionDiv = document.createElement('div');
    sessionDiv.className = 'seq-line visible';
    sessionDiv.style.color = 'var(--amber-dim)';
    sessionDiv.style.fontSize = '14px';
    const lastStr = last
      ? `LAST SESSION: ${new Date(last).toLocaleDateString('en-CA', { year:'numeric',month:'short',day:'numeric' }).toUpperCase()}`
      : 'FIRST SESSION DETECTED';
    sessionDiv.textContent = `VISITOR #${String(count).padStart(4,'0')} · ${lastStr}`;
    _seqLines.appendChild(sessionDiv);
    await _wait(300);

    for (const msg of CONFIG.bootMessages) {
      await _appendLine(msg);
      _seqLines.scrollTop = _seqLines.scrollHeight;
    }

    await _wait(400);
    _seqLoader.classList.remove('hidden');
    if (_onSequenceDone) _onSequenceDone();
  }

  /* ── Boot screen ──────────────────────────────────────── */
  async function _startBootScreen() {
    _phaseBoot.classList.add('active');
    await _wait(500);

    // Brief red flash then type detection line in cyan
    _detectLine.style.color = 'var(--red, #8b1a1a)';
    _detectLine.textContent = '!';
    await _wait(180);
    _detectLine.textContent = '';
    _detectLine.style.color = 'var(--cyan)';
    await _typeLine(_detectLine, CONFIG.detectionLine, 20);
    await _wait(350);

    const proceed = () => {
      _phaseBoot.classList.add('fade-out');
      setTimeout(() => {
        _phaseBoot.classList.remove('active', 'fade-out');
        _runSequence();
      }, 500);
    };

    const onKey   = (e) => { if (e.key === 'Enter') { cleanup(); proceed(); } };
    const onClick = ()  => { cleanup(); proceed(); };
    const cleanup = ()  => {
      document.removeEventListener('keydown', onKey);
      _phaseBoot.removeEventListener('click', onClick);
    };
    document.addEventListener('keydown', onKey);
    _phaseBoot.addEventListener('click', onClick);
  }

  /* ── Public ───────────────────────────────────────────── */
  function init(onDone) {
    _onSequenceDone = onDone;
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
