/* ═══════════════════════════════════════════════════════════════
   nodes.js — Node creation + hover signaling to visuals v3.0
═══════════════════════════════════════════════════════════════ */

const Nodes = (() => {

  const _layer    = document.getElementById('nodes-layer');
  let   _onSelect = null;

  function _buildNode(cfg) {
    const el      = document.createElement('div');
    el.className  = 'node-el';
    el.dataset.id = cfg.id;
    el.style.left = `${cfg.x}%`;
    el.style.top  = `${cfg.y}%`;

    el.innerHTML = `
      <div class="node-gfx">
        <div class="node-ring"></div>
        <div class="node-ring2"></div>
        <div class="node-core"></div>
      </div>
      <span class="node-label">${cfg.label}</span>
    `;

    setTimeout(() => el.classList.add('spawned'), cfg.delay);

    el.addEventListener('mouseenter', () => { Visuals.setHovered(cfg.id); Audio.nodePing(); });
    el.addEventListener('mouseleave', () => Visuals.clearHovered());

    el.addEventListener('click', () => {
      Visuals.markVisited(cfg.id);
      if (_onSelect) _onSelect(cfg.id);
    });

    // Touch
    el.addEventListener('touchstart', (e) => {
      e.preventDefault();
      Visuals.markVisited(cfg.id);
      if (_onSelect) _onSelect(cfg.id);
    }, { passive: false });

    return el;
  }

  function init(onSelect) {
    _onSelect        = onSelect;
    _layer.innerHTML = '';
    CONFIG.nodes.forEach(n => _layer.appendChild(_buildNode(n)));
  }

  return { init };

})();
