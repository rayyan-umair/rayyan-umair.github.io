/* =========================================================
   loader.js — Progress bar animation engine
   ========================================================= */

const Loader = (() => {

  const _bar   = document.getElementById('loader-bar');
  const _pct   = document.getElementById('loader-pct');

  function run(onComplete) {
    let progress = 0;
    const target = 100;
    const duration = 1800; // ms
    const interval = 30;
    const steps = duration / interval;
    const increment = target / steps;

    const tick = setInterval(() => {
      // Non-linear easing: fast at start, slight hesitation mid, fast at end
      const jitter = Math.random() * 1.5;
      progress = Math.min(progress + increment + jitter - 0.75, target);

      const display = Math.floor(progress);
      _bar.style.width = `${progress}%`;
      _pct.textContent = `${display}%`;

      if (progress >= target) {
        clearInterval(tick);
        _bar.style.width = '100%';
        _pct.textContent = '100%';
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 300);
      }
    }, interval);
  }

  return { run };

})();
