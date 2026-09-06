/* V30 compatibility bridge: the legacy engine keeps gameStarted in module scope. */
(function () {
  'use strict';
  function bootBridge() {
    if (!window.ChanarV30 || window.ChanarV30.__loadBridged) return;
    const V = window.ChanarV30;
    const legacyLoad = V.load;
    V.load = function () {
      const ok = legacyLoad();
      if (!ok) return false;
      const start = document.getElementById('start-button');
      if (start) start.click();
      V.emit('runtime:resumed', V.getState ? V.getState() : null);
      return true;
    };
    V.__loadBridged = true;
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootBridge, { once: true });
  } else {
    bootBridge();
  }
})();
