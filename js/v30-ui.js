/* V30 presentation bridge: keeps the new systems visible without owning the renderer. */
(function () {
  'use strict';
  function boot() {
    const V = window.ChanarV30;
    if (!V || V.__uiReady) return;

    const style = document.createElement('style');
    style.textContent = `
      #v30-save-button{position:fixed;left:16px;bottom:16px;z-index:9000;width:46px;height:46px;border:1px solid rgba(255,255,255,.25);border-radius:12px;background:rgba(28,25,20,.86);color:#fff;font-size:20px;cursor:pointer;box-shadow:0 4px 16px rgba(0,0,0,.25)}
      #v30-save-button:active{transform:translateY(1px)}
      #notification.v30-visible{opacity:1;pointer-events:auto}
      #notification{transition:opacity .18s ease}
    `;
    document.head.appendChild(style);

    const missionHud = document.getElementById('mission-hud');
    V.on('mission:started', function (mission) {
      if (missionHud && mission) missionHud.textContent = mission.title || mission.id;
    });
    V.on('mission:completed', function () {
      if (missionHud) missionHud.textContent = 'Objetivo cumplido';
    });
    V.on('save:saved', function () {
      const button = document.getElementById('v30-save-button');
      if (button) button.setAttribute('aria-label', 'Partida guardada');
    });

    V.__uiReady = true;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once:true });
  } else {
    boot();
  }
})();
