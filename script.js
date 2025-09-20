// Ajusta la altura del iframe cuando el form (hijo) informa su tamaño
(function () {
  const frame = document.getElementById('calcFrame');

  function onMessage(e) {
    if (!e?.data) return;
    const { type, height } = e.data || {};
    if (type === 'VELAROMA_FORM_HEIGHT' && typeof height === 'number') {
      // Altura mínima por seguridad
      const h = Math.max(height, 700);
      frame.style.height = `${h}px`;
    }
  }

  window.addEventListener('message', onMessage);
})();
