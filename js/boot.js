/* =========================================================
   boot.js — Boot terminal, key capture, boot log sequence
   ========================================================= */

const Boot = (() => {

  const _bootScreen    = document.getElementById('boot-screen');
  const _bootSequence  = document.getElementById('boot-sequence');
  const _logLines      = document.getElementById('log-lines');
  const _logTimestamp  = document.getElementById('log-timestamp');
  const _loaderWrap    = document.getElementById('loader-wrap');

  let _onComplete = null;

  function _setTimestamp() {
    const now = new Date();
    _logTimestamp.textContent = now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
  }

  function _showBootScreen() {
    _bootScreen.classList.add('active');

    const onEnter = (e) => {
      if (e.key === 'Enter') {
        document.removeEventListener('keydown', onEnter);
        _transitionToSequence();
      }
    };
    document.addEventListener('keydown', onEnter);

    // Also allow tap/click for mobile
    _bootScreen.addEventListener('click', () => {
      document.removeEventListener('keydown', onEnter);
      _transitionToSequence();
    }, { once: true });
  }

  function _transitionToSequence() {
    _bootScreen.classList.add('fade-out');
    setTimeout(() => {
      _bootScreen.classList.remove('active', 'fade-out');
      _showSequence();
    }, 600);
  }

  function _showSequence() {
    _setTimestamp();
    _bootSequence.classList.add('active');

    const messages = CONFIG.bootMessages;
    let index = 0;

    function showNext() {
      if (index >= messages.length) {
        setTimeout(() => {
          _loaderWrap.classList.remove('hidden');
          if (_onComplete) _onComplete();
        }, 400);
        return;
      }

      const msg = messages[index];
      const line = document.createElement('div');
      line.className = 'log-line';

      const tag = document.createElement('span');
      tag.className = 'tag' + (msg.type === 'ok' ? ' ok' : '');
      tag.textContent = msg.tag;

      const text = document.createElement('span');
      text.textContent = ' ' + msg.text;

      line.appendChild(tag);
      line.appendChild(text);
      _logLines.appendChild(line);
      _logLines.scrollTop = _logLines.scrollHeight;

      index++;
      const delay = msg.type === 'ok' ? 280 : 160 + Math.random() * 100;
      setTimeout(showNext, delay);
    }

    setTimeout(showNext, 300);
  }

  function init(onComplete) {
    _onComplete = onComplete;
    _showBootScreen();
  }

  function hideSequence(onDone) {
    _bootSequence.classList.add('fade-out');
    setTimeout(() => {
      _bootSequence.classList.remove('active', 'fade-out');
      if (onDone) onDone();
    }, 600);
  }

  return { init, hideSequence };

})();
