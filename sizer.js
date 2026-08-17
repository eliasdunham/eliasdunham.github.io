/* ==========================================================================
   TEMPORARY SIZING TOOL — delete this file and its <script> tag when done.

   Drag the amber handle at the bottom-right of any project image.
     · Normal images  -> drag sideways, adjusts the image column width
     · Tall images (class="media side") -> drag up/down, adjusts height

   The panel in the corner shows current values. Hit COPY, paste the result
   into portfolio.html, then remove this script.
   ========================================================================== */

(function () {
  var COL_MIN = 140, COL_MAX = 640;   // column width limits, px
  var H_MIN   = 120, H_MAX   = 720;   // side-mode height limits, px

  var items = [];

  document.querySelectorAll('.proj .media').forEach(function (media) {
    var art   = media.closest('.proj');
    var side  = media.classList.contains('side');
    var title = (art.querySelector('h2') || {}).textContent || 'project';

    art.style.position = 'relative';
    media.style.position = 'relative';

    // Starting values: read what is already inline, else use the defaults.
    var startCol = parseInt(art.style.getPropertyValue('--col'), 10) ||
                   Math.round(media.getBoundingClientRect().width);
    var startH   = parseInt(media.style.getPropertyValue('--h'), 10) || 420;

    var rec = { title: title.trim(), side: side, col: startCol, h: startH,
                art: art, media: media };
    items.push(rec);

    var grip = document.createElement('div');
    grip.textContent = side ? '↕' : '↔';
    grip.style.cssText = [
      'position:absolute', 'right:-11px', 'bottom:-11px',
      'width:24px', 'height:24px', 'border-radius:50%',
      'background:#e0a33c', 'color:#14171a',
      'font:600 13px/24px system-ui,sans-serif', 'text-align:center',
      'cursor:' + (side ? 'ns-resize' : 'ew-resize'),
      'z-index:50', 'user-select:none', 'touch-action:none',
      'box-shadow:0 0 0 3px rgba(0,0,0,.5)'
    ].join(';');
    media.appendChild(grip);

    var readout = document.createElement('div');
    readout.style.cssText = [
      'position:absolute', 'left:0', 'bottom:-26px',
      'font:500 11px/1 ui-monospace,monospace', 'letter-spacing:.06em',
      'color:#e0a33c', 'pointer-events:none'
    ].join(';');
    media.appendChild(readout);

    function paint() {
      if (side) {
        media.style.setProperty('--h', rec.h + 'px');
        readout.textContent = '--h: ' + rec.h + 'px';
      } else {
        art.style.setProperty('--col', rec.col + 'px');
        readout.textContent = '--col: ' + rec.col + 'px';
      }
      renderPanel();
    }
    paint();

    grip.addEventListener('pointerdown', function (e) {
      e.preventDefault();
      grip.setPointerCapture(e.pointerId);
      var x0 = e.clientX, y0 = e.clientY;
      var c0 = rec.col, h0 = rec.h;

      function move(ev) {
        if (side) {
          rec.h = Math.max(H_MIN, Math.min(H_MAX, h0 + (ev.clientY - y0)));
        } else {
          rec.col = Math.max(COL_MIN, Math.min(COL_MAX, c0 + (ev.clientX - x0)));
        }
        paint();
      }
      function up() {
        grip.removeEventListener('pointermove', move);
        grip.removeEventListener('pointerup', up);
      }
      grip.addEventListener('pointermove', move);
      grip.addEventListener('pointerup', up);
    });
  });

  /* ---- corner panel ---- */
  var panel = document.createElement('div');
  panel.style.cssText = [
    'position:fixed', 'right:16px', 'bottom:16px', 'z-index:9999',
    'max-width:340px', 'padding:12px 14px',
    'background:#1c2023', 'border:1px solid #3a4045', 'border-radius:6px',
    'font:500 11px/1.7 ui-monospace,monospace', 'color:#c9ced3',
    'box-shadow:0 8px 30px rgba(0,0,0,.6)'
  ].join(';');
  document.body.appendChild(panel);

  function lines() {
    return items.map(function (r) {
      return r.side
        ? '· ' + r.title + '\n  style="--h: ' + r.h + 'px"   (on the media div)'
        : '· ' + r.title + '\n  style="--col: ' + r.col + 'px"  (on the article tag)';
    }).join('\n');
  }

  function renderPanel() {
    panel.innerHTML =
      '<div style="color:#e0a33c;letter-spacing:.1em;margin-bottom:8px">IMAGE SIZER</div>' +
      '<pre style="margin:0 0 10px;white-space:pre-wrap;font:inherit;color:#c9ced3">' +
      lines().replace(/</g, '&lt;') + '</pre>' +
      '<button id="szCopy" style="font:600 11px ui-monospace,monospace;letter-spacing:.08em;' +
      'background:#e0a33c;color:#14171a;border:0;border-radius:4px;padding:6px 12px;cursor:pointer">' +
      'COPY VALUES</button>';
    panel.querySelector('#szCopy').onclick = function () {
      navigator.clipboard.writeText(lines()).then(function () {
        panel.querySelector('#szCopy').textContent = 'COPIED';
        setTimeout(renderPanel, 1200);
      });
    };
  }
  renderPanel();
})();
