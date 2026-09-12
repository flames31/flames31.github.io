// Theme toggle. The stored value is applied by the inline snippet in <head>;
// this only handles flipping it and keeping the button's label honest.

(function () {
  var root = document.documentElement;
  var button = document.getElementById('theme-toggle');
  if (!button) return;

  function current() {
    if (root.dataset.scheme) return root.dataset.scheme;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function label() {
    button.setAttribute(
      'aria-label',
      current() === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
    );
  }

  button.addEventListener('click', function () {
    var next = current() === 'dark' ? 'light' : 'dark';
    root.dataset.scheme = next;
    try { localStorage.setItem('scheme', next); } catch (e) {}
    label();
  });

  // follow the system while no explicit choice has been made
  window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', function () {
    if (!root.dataset.scheme) label();
  });

  label();
})();
