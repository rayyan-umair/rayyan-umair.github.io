/* ═══════════════════════════════════════════════════════════════
   visuals.js — Neural network canvas animation engine
   Owns: particle system, connection lines, neural layer aesthetic
═══════════════════════════════════════════════════════════════ */

const Visuals = (() => {

  const _canvas  = document.getElementById('net-canvas');
  const _ctx     = _canvas.getContext('2d');
  const cfg      = CONFIG.network;

  let _W         = 0;
  let _H         = 0;
  let _particles = [];
  let _raf       = null;

  /* ── Particle ─────────────────────────────────────────── */
  class Particle {
    constructor() { this._init(); }

    _init() {
      // Bias particles toward neural layer x-positions
      const layerX = cfg.layers[Math.floor(Math.random() * cfg.layers.length)];
      const spread = 0.18;
      this.x  = (layerX + (Math.random() - 0.5) * spread) * _W;
      this.y  = Math.random() * _H;
      this.vx = (Math.random() - 0.5) * cfg.speed;
      this.vy = (Math.random() - 0.5) * cfg.speed;
      this.r  = cfg.nodeRadius * (0.5 + Math.random() * 0.8);
      this.isCyan   = Math.random() < 0.15;
      this.opacity  = 0.3 + Math.random() * 0.45;
      this.pulse    = Math.random() * Math.PI * 2;
      this.pulseSpd = 0.012 + Math.random() * 0.018;
    }

    update() {
      this.x    += this.vx;
      this.y    += this.vy;
      this.pulse += this.pulseSpd;

      const m = 30;
      if (this.x < -m) this.x = _W + m;
      if (this.x > _W + m) this.x = -m;
      if (this.y < -m) this.y = _H + m;
      if (this.y > _H + m) this.y = -m;
    }

    draw() {
      const flicker = this.opacity * (0.85 + Math.sin(this.pulse) * 0.15);
      const color   = this.isCyan ? cfg.cyan : cfg.amber;

      _ctx.save();
      _ctx.globalAlpha = flicker;
      _ctx.shadowColor = color;
      _ctx.shadowBlur  = 8;
      _ctx.fillStyle   = color;
      _ctx.beginPath();
      _ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      _ctx.fill();
      _ctx.restore();
    }
  }

  /* ── Helpers ──────────────────────────────────────────── */
  function _resize() {
    _W = _canvas.width  = window.innerWidth;
    _H = _canvas.height = window.innerHeight;
  }

  function _build() {
    _particles = Array.from({ length: cfg.nodeCount }, () => new Particle());
  }

  /* ── Draw neural layer columns (very subtle) ──────────── */
  function _drawLayers() {
    cfg.layers.forEach(lx => {
      const x = lx * _W;
      const grad = _ctx.createLinearGradient(x, 0, x, _H);
      grad.addColorStop(0,   'transparent');
      grad.addColorStop(0.3, 'rgba(232,160,32,0.018)');
      grad.addColorStop(0.7, 'rgba(232,160,32,0.018)');
      grad.addColorStop(1,   'transparent');
      _ctx.fillStyle = grad;
      _ctx.fillRect(x - 30, 0, 60, _H);
    });
  }

  /* ── Draw connection lines ────────────────────────────── */
  function _drawLines() {
    const maxD  = cfg.maxDistance;
    const maxD2 = maxD * maxD;

    for (let i = 0; i < _particles.length; i++) {
      for (let j = i + 1; j < _particles.length; j++) {
        const a  = _particles[i];
        const b  = _particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        if (d2 > maxD2) continue;

        const ratio = 1 - (d2 / maxD2);
        const alpha = ratio * 0.13;

        // Prefer cyan connections for cross-layer links
        const useCyan = a.isCyan || b.isCyan;
        const color   = useCyan ? cfg.cyan : cfg.amber;

        _ctx.save();
        _ctx.globalAlpha = alpha;
        _ctx.strokeStyle = color;
        _ctx.lineWidth   = 0.5 + ratio * 0.4;
        _ctx.beginPath();
        _ctx.moveTo(a.x, a.y);
        _ctx.lineTo(b.x, b.y);
        _ctx.stroke();
        _ctx.restore();
      }
    }
  }

  /* ── Main animation loop ──────────────────────────────── */
  function _frame() {
    _ctx.clearRect(0, 0, _W, _H);
    _drawLayers();
    _drawLines();
    _particles.forEach(p => { p.update(); p.draw(); });
    _raf = requestAnimationFrame(_frame);
  }

  /* ── Public API ───────────────────────────────────────── */
  function init() {
    _resize();
    _build();
    window.addEventListener('resize', () => { _resize(); _build(); });
    _frame();
  }

  function stop() {
    if (_raf) { cancelAnimationFrame(_raf); _raf = null; }
  }

  return { init, stop };

})();
