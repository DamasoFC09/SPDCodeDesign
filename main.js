
(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


  var themeBtn = document.querySelector('[data-theme-toggle]');

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      themeBtn.setAttribute(
        'aria-label',
        next === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'
      );
      try {
        localStorage.setItem('spd-theme', next);
      } catch (e) {
      }
    });
  }


  var navToggle = document.querySelector('[data-nav-toggle]');
  var nav = document.querySelector('[data-nav]');

  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      var open = nav.getAttribute('data-open') === 'true';
      nav.setAttribute('data-open', String(!open));
      navToggle.setAttribute('aria-expanded', String(!open));
    });

    nav.addEventListener('click', function (event) {
      if (event.target.tagName === 'A') {
        nav.setAttribute('data-open', 'false');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && nav.getAttribute('data-open') === 'true') {
        nav.setAttribute('data-open', 'false');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.focus();
      }
    });
  }


  var revealables = document.querySelectorAll('[data-reveal]');

  if (revealables.length) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      revealables.forEach(function (el) {
        el.classList.add('is-visible');
      });
    } else {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
      );

      revealables.forEach(function (el) {
        observer.observe(el);
      });
    }
  }


  var terminal = document.querySelector('[data-terminal]');

  if (terminal) {
    var prompt =
      '<span class="term-user">damaso@spd</span>:<span class="term-path">~</span>$ ';

    var script = [
      { type: 'cmd', text: 'cat sobre-nosotros.txt' },
      { type: 'out', text: 'Estudio de programación y diseño.' },
      { type: 'out', text: 'Empezamos haciendo sitios web a la medida.' },
      { type: 'out', text: 'Hoy también programamos para Linux y Windows.' },
      { type: 'gap' },
      { type: 'cmd', text: 'ls servicios/' },
      {
        type: 'raw',
        html:
          '<span class="term-dir">web/</span>   ' +
          '<span class="term-dir">sistemas/</span>   ' +
          '<span class="term-dir">diseno/</span>'
      },
      { type: 'gap' },
      { type: 'cmd', text: 'echo "Cuéntanos qué necesitas."' },
      { type: 'out', text: 'Cuéntanos qué necesitas.' }
    ];

    var buffer = '';
    var caret = '<span class="caret" aria-hidden="true"></span>';

    function paint(extra) {
      terminal.innerHTML = buffer + (extra || '') + caret;
    }

    function escapeHtml(value) {
      return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function renderInstantly() {
      buffer = script
        .map(function (line) {
          if (line.type === 'gap') return '\n';
          if (line.type === 'raw') return line.html + '\n';
          if (line.type === 'cmd') {
            return prompt + '<span class="term-cmd">' + escapeHtml(line.text) + '</span>\n';
          }
          return escapeHtml(line.text) + '\n';
        })
        .join('');
      paint();
    }

    function runLine(index) {
      if (index >= script.length) {
        paint();
        return;
      }

      var line = script[index];

      if (line.type === 'gap') {
        buffer += '\n';
        paint();
        setTimeout(function () {
          runLine(index + 1);
        }, 180);
        return;
      }

      if (line.type === 'raw') {
        buffer += line.html + '\n';
        paint();
        setTimeout(function () {
          runLine(index + 1);
        }, 320);
        return;
      }

      if (line.type === 'out') {
        buffer += escapeHtml(line.text) + '\n';
        paint();
        setTimeout(function () {
          runLine(index + 1);
        }, 260);
        return;
      }

      var typed = 0;
      buffer += prompt;

      (function typeChar() {
        if (typed >= line.text.length) {
          buffer += '\n';
          paint();
          setTimeout(function () {
            runLine(index + 1);
          }, 420);
          return;
        }
        typed += 1;
        paint('<span class="term-cmd">' + escapeHtml(line.text.slice(0, typed)) + '</span>');
        setTimeout(typeChar, 42 + Math.random() * 45);
      })();
    }

    if (reduceMotion) {
      renderInstantly();
    } else {
      paint();
      setTimeout(function () {
        runLine(0);
      }, 700);
    }
  }


  var yearSlot = document.querySelector('[data-year]');
  if (yearSlot) {
    yearSlot.textContent = String(new Date().getFullYear());
  }
})();
