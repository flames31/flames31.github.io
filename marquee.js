// Projects strip. Sits still until moved: drag (mouse or touch), swipe a
// trackpad sideways, or use the arrow keys. The cards are repeated and the
// position is wrapped modulo one set of cards, so it cycles in both directions.

(function () {
  var strip = document.querySelector('.marquee');
  var track = strip && strip.querySelector('.marquee-track');
  if (!track) return;

  var originals = Array.prototype.slice.call(track.children);
  if (!originals.length) return;

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  var offset = 0;   // px moved to the right through the cards; unbounded
  var step = 0;     // one card plus its margin
  var setWidth = 0; // one full set of cards

  function mod(n, m) { return ((n % m) + m) % m; }

  // ── layout ──────────────────────────────────────────────────────────────

  function copyOf(el) {
    var copy = el.cloneNode(true);
    copy.setAttribute('data-clone', '');
    copy.setAttribute('aria-hidden', 'true');
    copy.querySelectorAll('a').forEach(function (a) { a.tabIndex = -1; });
    return copy;
  }

  // one set before the originals (so dragging right never shows a gap), then
  // enough after them to cover the widest view
  function build() {
    var oldStep = step;
    track.querySelectorAll('[data-clone]').forEach(function (el) { el.remove(); });

    var first = originals[0];
    step = first.offsetWidth + parseFloat(getComputedStyle(first).marginRight);
    setWidth = step * originals.length;
    if (!setWidth) return;

    originals.forEach(function (el) { track.insertBefore(copyOf(el), first); });
    var after = 1 + Math.ceil(strip.clientWidth / setWidth);
    for (var i = 0; i < after; i++) {
      originals.forEach(function (el) { track.appendChild(copyOf(el)); });
    }

    stop();
    if (oldStep) offset = Math.round(offset / oldStep) * step;
    render();
  }

  var frame = 0;

  function render() {
    frame = 0;
    if (!setWidth) return;
    track.style.transform = 'translate3d(' + -(mod(offset, setWidth) + setWidth) + 'px, 0, 0)';
  }

  function schedule() {
    if (!frame) frame = requestAnimationFrame(render);
  }

  // ── gliding ─────────────────────────────────────────────────────────────

  var anim = 0;
  var goal = 0;

  function stop() {
    cancelAnimationFrame(anim);
    anim = 0;
  }

  function glideTo(target) {
    stop();
    goal = target;
    var from = offset;
    var dist = target - from;

    if (reduce.matches || Math.abs(dist) < 0.5) {
      offset = target;
      schedule();
      return;
    }

    var duration = Math.min(600, Math.max(250, Math.abs(dist) * 0.8));
    var start = performance.now();

    function tick(now) {
      var t = Math.min(1, (now - start) / duration);
      offset = from + dist * (1 - Math.pow(1 - t, 3)); // ease-out cubic
      render();
      anim = t < 1 ? requestAnimationFrame(tick) : 0;
    }
    anim = requestAnimationFrame(tick);
  }

  function snap(target) {
    glideTo(Math.round(target / step) * step);
  }

  // ── drag ────────────────────────────────────────────────────────────────

  var pointer = null;
  var dragged = false;

  strip.addEventListener('pointerdown', function (e) {
    if (e.button !== 0) return;
    stop();
    dragged = false;
    pointer = { id: e.pointerId, x: e.clientX, offset: offset, dragging: false, samples: [] };
  });

  strip.addEventListener('pointermove', function (e) {
    if (!pointer || e.pointerId !== pointer.id) return;
    var dx = e.clientX - pointer.x;

    // a few px of slack, so a plain click on a link still counts as a click
    if (!pointer.dragging) {
      if (Math.abs(dx) < 5) return;
      pointer.dragging = true;
      strip.setPointerCapture(e.pointerId);
      strip.classList.add('is-dragging');
    }

    offset = pointer.offset - dx;

    var now = performance.now();
    pointer.samples.push({ t: now, x: e.clientX });
    while (now - pointer.samples[0].t > 100) pointer.samples.shift();

    schedule();
  });

  function release(e) {
    if (!pointer || e.pointerId !== pointer.id) return;
    var p = pointer;
    pointer = null;

    if (!p.dragging) {
      snap(offset);
      return;
    }

    dragged = true;
    strip.classList.remove('is-dragging');

    // carry the flick's speed a little way, then settle on a card
    var velocity = 0;
    var s = p.samples;
    var last = s[s.length - 1];
    if (s.length > 1 && performance.now() - last.t < 100) {
      velocity = (last.x - s[0].x) / (last.t - s[0].t || 1);
    }
    snap(reduce.matches ? offset : offset - velocity * 250);
  }

  strip.addEventListener('pointerup', release);
  strip.addEventListener('pointercancel', release);

  // a drag that started on a link shouldn't follow it
  strip.addEventListener('click', function (e) {
    if (!dragged) return;
    dragged = false;
    e.preventDefault();
    e.stopPropagation();
  }, true);

  strip.addEventListener('dragstart', function (e) { e.preventDefault(); });

  // ── trackpad + keyboard ─────────────────────────────────────────────────

  var wheelTimer;

  strip.addEventListener('wheel', function (e) {
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
    e.preventDefault();
    stop();
    offset += e.deltaX;
    schedule();
    clearTimeout(wheelTimer);
    wheelTimer = setTimeout(function () { snap(offset); }, 150);
  }, { passive: false });

  strip.addEventListener('keydown', function (e) {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    var from = anim ? goal : Math.round(offset / step) * step;
    glideTo(from + (e.key === 'ArrowRight' ? step : -step));
  });

  // tabbing to a link in a card: glide that card into view, the short way round
  strip.addEventListener('focusin', function (e) {
    var card = e.target.closest('.card');
    var index = originals.indexOf(card);
    if (index < 0) return;
    var delta = mod(index * step - offset + setWidth / 2, setWidth) - setWidth / 2;
    glideTo(offset + delta);
  });

  // the browser scrolls overflow:hidden boxes to reveal focus; the transform does that job
  strip.addEventListener('scroll', function () { strip.scrollLeft = 0; });

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(build, 150);
  });

  build();
})();
