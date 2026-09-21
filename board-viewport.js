// @ts-check
/** One viewport owns the responsive fit; map data stays in its original coordinates. */
const BoardViewport = (() => {
  const WIDTH = 1920, HEIGHT = 900, MARGIN = 8;
  let disconnect = () => {};

  /** @param {{sourceWidth:number, sourceHeight:number}} source */
  function sourceTransform(source) {
    const {sourceWidth: w, sourceHeight: h} = source;
    if (![w, h].every(n => Number.isFinite(n) && n > 0)) {
      throw new RangeError('Board dimensions must be positive finite numbers');
    }
    const scale = Math.min(WIDTH / w, HEIGHT / h);
    return `translate(${(WIDTH - w * scale) / 2} ${(HEIGHT - h * scale) / 2}) scale(${scale})`;
  }

  /** @param {HTMLElement} view @param {{sourceWidth:number, sourceHeight:number}} source */
  function connect(view, source) {
    disconnect();
    const viewport = /** @type {HTMLElement} */ (view.querySelector('#boardViewport'));
    const svg = /** @type {SVGSVGElement} */ (view.querySelector('#boardMap'));
    const layers = /** @type {SVGGElement} */ (view.querySelector('#boardLayers'));
    const shell = /** @type {HTMLElement} */ (view.closest('.board-game'));
    const task = /** @type {HTMLElement} */ (view.querySelector('#taskDrawer'));
    const options = /** @type {HTMLElement} */ (view.querySelector('#boardOptions'));
    const cradle = /** @type {HTMLElement} */ (shell.querySelector('.dice-cradle'));
    svg.setAttribute('viewBox', `0 0 ${WIDTH} ${HEIGHT}`);
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    layers.setAttribute('transform', sourceTransform(source));
    let frame = 0;
    function fit() {
      frame = 0;
      if (!view.isConnected) return;
      const box = view.getBoundingClientRect();
      const top = MARGIN; // The board label floats over the map without reserving a full row.
      const adaptive = shell.dataset.boardFit === 'adaptive';
      const right = adaptive && options.classList.contains('open') ? box.width - options.offsetLeft + MARGIN : MARGIN;
      // In adaptive mode reserve panels; otherwise keep the board stable beneath them.
      const bottom = (adaptive ? Math.max(task.classList.contains('open') ? task.offsetHeight : 0,
        box.bottom - cradle.getBoundingClientRect().top, 0) : 0) + MARGIN;
      Object.assign(viewport.style, {
        left: `${MARGIN}px`, top: `${top}px`,
        width: `${Math.max(0, box.width - MARGIN - right)}px`,
        height: `${Math.max(0, box.height - top - bottom)}px`
      });
    }
    function schedule() { if (!frame) frame = requestAnimationFrame(fit); }
    const resize = new ResizeObserver(schedule);
    [view, task, options, cradle].forEach(el => resize.observe(el));
    const state = new MutationObserver(schedule);
    [shell, task, options].forEach(el => state.observe(el, {attributes: true, attributeFilter: ['class', 'data-footer', 'data-board-fit']}));
    window.addEventListener('resize', schedule);
    document.addEventListener('fullscreenchange', schedule);
    shell.addEventListener('transitionend', schedule);
    fit();
    disconnect = () => {
      resize.disconnect(); state.disconnect(); cancelAnimationFrame(frame);
      window.removeEventListener('resize', schedule);
      document.removeEventListener('fullscreenchange', schedule);
      shell.removeEventListener('transitionend', schedule);
      disconnect = () => {};
    };
  }
  return {connect, disconnect: () => disconnect(), sourceTransform, WIDTH, HEIGHT};
})();
