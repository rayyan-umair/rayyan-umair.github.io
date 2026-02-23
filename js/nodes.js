/* ═══════════════════════════════════════════════════════════════
   nodes.js — Node creation, positioning, hover, click events
   Owns: DOM node elements, staggered spawn, click dispatch
═══════════════════════════════════════════════════════════════ */

const Nodes = (() => {

  const _layer     = document.getElementById('nodes-layer');
  let   _onSelect  = null;

  /* ── Build a single node element ─────────────────────── */
  function _buildNode(cfg) {
    const el = document.createElement('div');
    el.className  = 'node-el';
    el.dataset.id = cfg.id;

    // Desktop: absolute position
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

    // Staggered spawn
    setTimeout(() => el.classList.add('spawned'), cfg.delay);

    el.addEventListener('click', () => {
      if (_onSelect) _onSelect(cfg.id);
    });

    // Touch-friendly: slightly larger hit area on mobile via CSS
    return el;
  }

  /* ── Public API ───────────────────────────────────────── */
  function init(onSelect) {
    _onSelect     = onSelect;
    _layer.innerHTML = '';

    CONFIG.nodes.forEach(nodeCfg => {
      _layer.appendChild(_buildNode(nodeCfg));
    });
  }

  return { init };

})();
