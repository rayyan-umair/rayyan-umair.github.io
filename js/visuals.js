/* ═══════════════════════════════════════════════════════════════
   visuals.js — Full environment engine v3.0
   · Perspective grid (deep background)
   · Neural network with directional activations
   · Ambient data streams (foreground)
   · Ghost text events
   · Node hub density + visit memory
═══════════════════════════════════════════════════════════════ */

const Visuals = (() => {

  const _canvas = document.getElementById('net-canvas');
  const _ctx    = _canvas.getContext('2d');
  const cfg     = CONFIG.network;

  let _W = 0, _H = 0;
  let _particles  = [];
  let _activations = [];
  let _streams    = [];
  let _ghostText  = null;
  let _raf        = null;
  let _visitedNodes = {};   // node id -> brightness boost
  let _hoveredNode  = null; // node id being hovered
  let _nodePositions = {};  // node id -> {x,y} in canvas px

  /* ═══════════════════════════════════════════════════════
     RESIZE
  ═══════════════════════════════════════════════════════ */
  function _resize() {
    _W = _canvas.width  = window.innerWidth;
    _H = _canvas.height = window.innerHeight;
    _buildNodePositions();
  }

  function _buildNodePositions() {
    _nodePositions = {};
    CONFIG.nodes.forEach(n => {
      _nodePositions[n.id] = {
        x: (n.x / 100) * _W,
        y: (n.y / 100) * _H,
      };
    });
  }

  /* ═══════════════════════════════════════════════════════
     PERSPECTIVE GRID
  ═══════════════════════════════════════════════════════ */
  function _drawGrid() {
    const vx = _W * 0.5;
    const vy = _H * 0.5;
    const cols = 14;
    const rows = 10;
    const alpha = 0.028;

    _ctx.save();
    _ctx.strokeStyle = cfg.amber;
    _ctx.lineWidth   = 0.5;
    _ctx.globalAlpha = alpha;

    // Horizontal lines — converge to vanishing point
    for (let r = 0; r <= rows; r++) {
      const t  = r / rows;
      const y  = _H * 0.1 + t * _H * 0.8;
      const spread = 0.1 + t * 0.9;
      const x1 = vx - spread * _W * 0.6;
      const x2 = vx + spread * _W * 0.6;
      _ctx.beginPath();
      _ctx.moveTo(x1, y);
      _ctx.lineTo(x2, y);
      _ctx.stroke();
    }

    // Vertical lines — fan from vanishing point
    for (let c = 0; c <= cols; c++) {
      const t  = c / cols;
      const xB = _W * 0.05 + t * _W * 0.9;
      _ctx.beginPath();
      _ctx.moveTo(vx, vy);
      _ctx.lineTo(xB, _H * 0.95);
      _ctx.stroke();
    }

    _ctx.restore();
  }

  /* ═══════════════════════════════════════════════════════
     PARTICLES
  ═══════════════════════════════════════════════════════ */
  class Particle {
    constructor() { this._init(); }

    _init() {
      // Bias toward neural layer columns
      const lx     = cfg.layers[Math.floor(Math.random() * cfg.layers.length)];
      const spread = 0.16;
      this.x  = (lx + (Math.random() - 0.5) * spread) * _W;
      this.y  = Math.random() * _H;
      this.vx = (Math.random() - 0.5) * cfg.speed;
      this.vy = (Math.random() - 0.5) * cfg.speed;
      this.r  = cfg.nodeRadius * (0.5 + Math.random() * 0.8);
      this.isCyan  = Math.random() < 0.14;
      this.opacity = 0.28 + Math.random() * 0.4;
      this.pulse   = Math.random() * Math.PI * 2;
      this.pulseSpd= 0.010 + Math.random() * 0.016;
    }

    update() {
      this.x    += this.vx;
      this.y    += this.vy;
      this.pulse += this.pulseSpd;
      const m = 32;
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
      _ctx.shadowBlur  = 6;
      _ctx.fillStyle   = color;
      _ctx.beginPath();
      _ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      _ctx.fill();
      _ctx.restore();
    }
  }

  function _build() {
    _particles = Array.from({ length: cfg.nodeCount }, () => new Particle());
  }

  /* ═══════════════════════════════════════════════════════
     CONNECTIONS + DIRECTIONAL ACTIVATIONS
  ═══════════════════════════════════════════════════════ */
  class Activation {
    constructor(ax, ay, bx, by, color) {
      this.ax = ax; this.ay = ay;
      this.bx = bx; this.by = by;
      this.color = color;
      this.t = 0;
      this.speed = 0.012 + Math.random() * 0.018;
      this.done  = false;
    }
    update() {
      this.t += this.speed;
      if (this.t >= 1) this.done = true;
    }
    draw() {
      const x = this.ax + (this.bx - this.ax) * this.t;
      const y = this.ay + (this.by - this.ay) * this.t;
      _ctx.save();
      _ctx.globalAlpha = 0.9;
      _ctx.shadowColor = this.color;
      _ctx.shadowBlur  = 10;
      _ctx.fillStyle   = this.color;
      _ctx.beginPath();
      _ctx.arc(x, y, 2.2, 0, Math.PI * 2);
      _ctx.fill();
      _ctx.restore();
    }
  }

  function _drawConnections() {
    const maxD  = cfg.maxDistance;
    const maxD2 = maxD * maxD;

    for (let i = 0; i < _particles.length; i++) {
      for (let j = i + 1; j < _particles.length; j++) {
        const a = _particles[i], b = _particles[j];
        // Only connect left-to-right (directional, like neural net)
        if (a.x > b.x) continue;
        const dx = b.x - a.x, dy = b.y - a.y;
        const d2 = dx * dx + dy * dy;
        if (d2 > maxD2) continue;

        const ratio = 1 - d2 / maxD2;
        const useCyan = a.isCyan || b.isCyan;
        const color   = useCyan ? cfg.cyan : cfg.amber;

        _ctx.save();
        _ctx.globalAlpha = ratio * 0.11;
        _ctx.strokeStyle = color;
        _ctx.lineWidth   = 0.4 + ratio * 0.5;
        _ctx.beginPath();
        _ctx.moveTo(a.x, a.y);
        _ctx.lineTo(b.x, b.y);
        _ctx.stroke();
        _ctx.restore();

        // Occasionally spawn a directional activation
        if (Math.random() < 0.00018) {
          _activations.push(new Activation(a.x, a.y, b.x, b.y,
            useCyan ? cfg.cyan : cfg.amberBright));
        }
      }
    }
  }

  /* ═══════════════════════════════════════════════════════
     NODE TETHERS + HALOS
  ═══════════════════════════════════════════════════════ */
  function _drawNodeEnvironment() {
    const cx = _W * 0.5;
    const cy = _H * 0.5;

    CONFIG.nodes.forEach(n => {
      const pos   = _nodePositions[n.id];
      if (!pos) return;
      const nx    = pos.x, ny = pos.y;
      const visited = _visitedNodes[n.id] || 0;
      const hovered = _hoveredNode === n.id;

      // Tether line to center
      const tetherAlpha = hovered ? 0.22 : 0.06 + visited * 0.04;
      _ctx.save();
      _ctx.globalAlpha = tetherAlpha;
      _ctx.strokeStyle = cfg.amber;
      _ctx.lineWidth   = hovered ? 1.2 : 0.5;
      _ctx.setLineDash([4, 8]);
      _ctx.beginPath();
      _ctx.moveTo(cx, cy);
      _ctx.lineTo(nx, ny);
      _ctx.stroke();
      _ctx.setLineDash([]);
      _ctx.restore();

      // Node halo
      const haloRadius = hovered ? 44 : 32 + visited * 4;
      const haloAlpha  = hovered ? 0.14 : 0.05 + visited * 0.03;
      const grad = _ctx.createRadialGradient(nx, ny, 0, nx, ny, haloRadius);
      grad.addColorStop(0,   `rgba(232,160,32,${haloAlpha * 2})`);
      grad.addColorStop(0.5, `rgba(232,160,32,${haloAlpha})`);
      grad.addColorStop(1,   'rgba(232,160,32,0)');
      _ctx.save();
      _ctx.fillStyle = grad;
      _ctx.beginPath();
      _ctx.arc(nx, ny, haloRadius, 0, Math.PI * 2);
      _ctx.fill();
      _ctx.restore();

      // Increased network density around node
      if (hovered || visited > 0) {
        const densityRadius = 80;
        _particles.forEach(p => {
          const dx = p.x - nx, dy = p.y - ny;
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d < densityRadius) {
            const boost = (1 - d / densityRadius) * (hovered ? 0.5 : 0.2);
            _ctx.save();
            _ctx.globalAlpha = boost;
            _ctx.shadowColor = cfg.amber;
            _ctx.shadowBlur  = 8;
            _ctx.fillStyle   = cfg.amber;
            _ctx.beginPath();
            _ctx.arc(p.x, p.y, p.r * 1.4, 0, Math.PI * 2);
            _ctx.fill();
            _ctx.restore();
          }
        });
      }
    });
  }

  /* ═══════════════════════════════════════════════════════
     AMBIENT DATA STREAMS
  ═══════════════════════════════════════════════════════ */
  class DataStream {
    constructor() { this._reset(); }
    _reset() {
      this.x       = Math.random() * _W;
      this.y       = -20;
      this.speed   = cfg.streamSpeed + Math.random() * 0.3;
      this.chars   = Array.from({ length: 8 + Math.floor(Math.random() * 8) },
                       () => cfg.streamChars[Math.floor(Math.random() * cfg.streamChars.length)]);
      this.spacing = 16;
      this.opacity = 0;
      this.fadeIn  = true;
      this.active  = true;
    }
    update() {
      this.y += this.speed;
      if (this.fadeIn && this.opacity < 0.18) this.opacity += 0.005;
      const maxY = this.chars.length * this.spacing + _H;
      if (this.y > maxY * 0.6) { this.opacity -= 0.004; }
      if (this.opacity <= 0 && this.y > 0) this.active = false;
      // Randomly shuffle a char occasionally
      if (Math.random() < 0.03) {
        const idx = Math.floor(Math.random() * this.chars.length);
        this.chars[idx] = cfg.streamChars[Math.floor(Math.random() * cfg.streamChars.length)];
      }
    }
    draw() {
      if (!this.active) return;
      _ctx.save();
      _ctx.font = '11px VT323, monospace';
      this.chars.forEach((ch, i) => {
        const cy = this.y + i * this.spacing;
        if (cy < -10 || cy > _H + 10) return;
        const alpha = this.opacity * (i === 0 ? 1.2 : 0.7);
        _ctx.globalAlpha = Math.min(alpha, 0.22);
        _ctx.fillStyle   = cfg.amberBright;
        _ctx.fillText(ch, this.x, cy);
      });
      _ctx.restore();
    }
  }

  function _updateStreams() {
    _streams = _streams.filter(s => s.active);
    while (_streams.length < cfg.streamCount) {
      _streams.push(new DataStream());
    }
    _streams.forEach(s => s.update());
  }

  /* ═══════════════════════════════════════════════════════
     GHOST TEXT
  ═══════════════════════════════════════════════════════ */
  function _triggerGhost() {
    const msgs = CONFIG.ghost.messages;
    const msg  = msgs[Math.floor(Math.random() * msgs.length)];
    _ghostText = {
      text:    msg,
      x:       _W * (0.25 + Math.random() * 0.5),
      y:       _H * (0.2  + Math.random() * 0.6),
      opacity: 0,
      phase:   'in',   // in | hold | out
      holdTimer: 0,
    };
  }

  function _drawGhost() {
    if (!_ghostText) return;
    const g = _ghostText;

    if (g.phase === 'in') {
      g.opacity += 0.012;
      if (g.opacity >= 0.18) { g.opacity = 0.18; g.phase = 'hold'; }
    } else if (g.phase === 'hold') {
      g.holdTimer++;
      if (g.holdTimer > 140) g.phase = 'out';
    } else {
      g.opacity -= 0.006;
      if (g.opacity <= 0) { _ghostText = null; return; }
    }

    _ctx.save();
    _ctx.globalAlpha = g.opacity;
    _ctx.font        = '14px VT323, monospace';
    _ctx.fillStyle   = cfg.cyan;
    _ctx.letterSpacing = '4px';
    _ctx.fillText(g.text, g.x, g.y);
    _ctx.restore();
  }

  /* ═══════════════════════════════════════════════════════
     LAYER COLUMN GLOW
  ═══════════════════════════════════════════════════════ */
  function _drawLayers() {
    cfg.layers.forEach(lx => {
      const x    = lx * _W;
      const grad = _ctx.createLinearGradient(x, 0, x, _H);
      grad.addColorStop(0,   'transparent');
      grad.addColorStop(0.3, 'rgba(232,160,32,0.016)');
      grad.addColorStop(0.7, 'rgba(232,160,32,0.016)');
      grad.addColorStop(1,   'transparent');
      _ctx.fillStyle = grad;
      _ctx.fillRect(x - 28, 0, 56, _H);
    });
  }

  /* ═══════════════════════════════════════════════════════
     MAIN LOOP
  ═══════════════════════════════════════════════════════ */
  function _frame() {
    _ctx.clearRect(0, 0, _W, _H);

    _drawGrid();
    _drawLayers();
    _drawConnections();
    _activations = _activations.filter(a => !a.done);
    _activations.forEach(a => { a.update(); a.draw(); });
    _particles.forEach(p => { p.update(); p.draw(); });
    _drawNodeEnvironment();
    _updateStreams();
    _streams.forEach(s => s.draw());
    _drawGhost();

    _raf = requestAnimationFrame(_frame);
  }

  /* ═══════════════════════════════════════════════════════
     PUBLIC API
  ═══════════════════════════════════════════════════════ */
  function init() {
    _resize();
    _build();
    window.addEventListener('resize', () => { _resize(); _build(); });

    // Ghost event timer
    setInterval(() => {
      if (!_ghostText) _triggerGhost();
    }, CONFIG.ghost.interval + Math.random() * 20000);

    // Initial ghost after 12 seconds
    setTimeout(_triggerGhost, 12000);

    _frame();
  }

  function markVisited(nodeId) {
    _visitedNodes[nodeId] = Math.min((_visitedNodes[nodeId] || 0) + 1, 3);
  }

  function setHovered(nodeId) { _hoveredNode = nodeId; }
  function clearHovered()     { _hoveredNode = null;   }

  function stop() {
    if (_raf) { cancelAnimationFrame(_raf); _raf = null; }
  }

  return { init, stop, markVisited, setHovered, clearHovered };

})();
