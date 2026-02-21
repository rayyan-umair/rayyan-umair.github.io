/* =========================================================
   visuals.js — Network particle / globe animation engine
   ========================================================= */

const Visuals = (() => {

  const _canvas  = document.getElementById('network-canvas');
  const _ctx     = _canvas.getContext('2d');
  const cfg      = CONFIG.network;

  let _particles = [];
  let _raf       = null;
  let _W         = 0;
  let _H         = 0;

  // ── Particle class ───────────────────────────────────────
  class Particle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x  = Math.random() * _W;
      this.y  = Math.random() * _H;
      this.vx = (Math.random() - 0.5) * cfg.speed;
      this.vy = (Math.random() - 0.5) * cfg.speed;
      this.r  = cfg.nodeRadius * (0.5 + Math.random() * 0.8);
      this.opacity = cfg.nodeOpacity * (0.4 + Math.random() * 0.6);
      // Random color: mostly emerald, some cyan
      this.isCyan = Math.random() < 0.18;
      this.pulse  = Math.random() * Math.PI * 2;
      this.pulseSpeed = 0.015 + Math.random() * 0.02;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.pulse += this.pulseSpeed;

      // Wrap edges with margin
      const m = 20;
      if (this.x < -m) this.x = _W + m;
      if (this.x > _W + m) this.x = -m;
      if (this.y < -m) this.y = _H + m;
      if (this.y > _H + m) this.y = -m;
    }

    draw() {
      const flicker = this.opacity * (0.85 + Math.sin(this.pulse) * 0.15);
      const color   = this.isCyan ? cfg.cyan : cfg.emerald;

      _ctx.beginPath();
      _ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      _ctx.fillStyle = color;
      _ctx.globalAlpha = flicker;
      _ctx.fill();

      // Glow
      _ctx.shadowColor  = color;
      _ctx.shadowBlur   = 6;
      _ctx.fill();
      _ctx.shadowBlur   = 0;
      _ctx.globalAlpha  = 1;
    }
  }

  // ── Helpers ───────────────────────────────────────────────
  function _resize() {
    _W = _canvas.width  = window.innerWidth;
    _H = _canvas.height = window.innerHeight;
  }

  function _buildParticles() {
    _particles = [];
    for (let i = 0; i < cfg.nodeCount; i++) {
      _particles.push(new Particle());
    }
  }

  function _drawLines() {
    const maxD  = cfg.maxDistance;
    const maxD2 = maxD * maxD;

    for (let i = 0; i < _particles.length; i++) {
      for (let j = i + 1; j < _particles.length; j++) {
        const a = _particles[i];
        const b = _particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        if (d2 > maxD2) continue;

        const alpha = (1 - d2 / maxD2) * cfg.lineOpacity;
        const grad  = _ctx.createLinearGradient(a.x, a.y, b.x, b.y);
        const cA    = a.isCyan ? cfg.cyan : cfg.emerald;
        const cB    = b.isCyan ? cfg.cyan : cfg.emerald;
        grad.addColorStop(0, cA);
        grad.addColorStop(1, cB);

        _ctx.beginPath();
        _ctx.moveTo(a.x, a.y);
        _ctx.lineTo(b.x, b.y);
        _ctx.strokeStyle = grad;
        _ctx.globalAlpha = alpha;
        _ctx.lineWidth   = 0.6;
        _ctx.stroke();
        _ctx.globalAlpha = 1;
      }
    }
  }

  function _frame() {
    _ctx.clearRect(0, 0, _W, _H);
    _drawLines();
    _particles.forEach(p => { p.update(); p.draw(); });
    _raf = requestAnimationFrame(_frame);
  }

  // ── Public API ────────────────────────────────────────────
  function init() {
    _resize();
    _buildParticles();
    window.addEventListener('resize', () => {
      _resize();
      _buildParticles();
    });
    _frame();
  }

  function stop() {
    if (_raf) { cancelAnimationFrame(_raf); _raf = null; }
  }

  return { init, stop };

})();
