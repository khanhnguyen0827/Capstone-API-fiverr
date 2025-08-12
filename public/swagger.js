// Add theme toggle and persist preference
(function () {
  try {
    var saved = localStorage.getItem('swagger_theme') || 'light';
    document.body.setAttribute('data-theme', saved);

    var btn = document.createElement('button');
    btn.className = 'swagger-theme-toggle';
    btn.textContent = saved === 'dark' ? 'Light mode' : 'Dark mode';
    btn.onclick = function () {
      var next = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.body.setAttribute('data-theme', next);
      localStorage.setItem('swagger_theme', next);
      btn.textContent = next === 'dark' ? 'Light mode' : 'Dark mode';
    };
    document.addEventListener('DOMContentLoaded', function () {
      document.body.appendChild(btn);
    });
  } catch (e) {
    // no-op
  }
})();

