/* Shared behaviour for all invitation designs:
   countdown, calendar links, scroll reveals. */
(function () {
  'use strict';

  var WED = (window.WED = {
    start: new Date('2026-11-22T10:45:00+05:30'),
    muhurtham: new Date('2026-11-22T11:45:00+05:30'),
    end: new Date('2026-11-22T13:30:00+05:30'),
    title: 'Wedding of Anupama & Ajay',
    venue: 'Sooryaprabha Convention Centre, Mannanthala, Thiruvananthapuram',
    mapLink: 'https://maps.app.goo.gl/k4yAPyagTmacP6tu9'
  });

  /* ---------- Scroll reveal ---------- */
  WED.reveal = function () {
    var els = document.querySelectorAll('[data-reveal]');
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (el) { io.observe(el); });
  };

  /* ---------- Countdown ---------- */
  WED.countdown = function (root) {
    if (!root) return;
    var parts = {};
    ['d', 'h', 'm', 's'].forEach(function (k) { parts[k] = root.querySelector('[data-cd="' + k + '"]'); });
    function pad(n) { return n < 10 ? '0' + n : '' + n; }
    function tick() {
      var diff = WED.muhurtham - new Date();
      if (diff <= 0) {
        root.classList.add('done');
        ['d', 'h', 'm', 's'].forEach(function (k) { if (parts[k]) parts[k].textContent = '00'; });
        return;
      }
      var s = Math.floor(diff / 1000);
      var vals = { d: Math.floor(s / 86400), h: Math.floor(s / 3600) % 24, m: Math.floor(s / 60) % 60, s: s % 60 };
      Object.keys(vals).forEach(function (k) {
        if (!parts[k]) return;
        var v = k === 'd' ? String(vals[k]) : pad(vals[k]);
        if (parts[k].textContent !== v) {
          parts[k].textContent = v;
          parts[k].classList.remove('flip'); void parts[k].offsetWidth; parts[k].classList.add('flip');
        }
      });
    }
    tick();
    setInterval(tick, 1000);
  };

  /* ---------- Calendar ---------- */
  function stamp(d) { return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, ''); }
  var details = 'Sweekaranam 10:45 AM · Muhurtham between 11:45 AM & 12:06 PM. ' +
    'Bride: S. Anupama (D/o Sajeev S & Smitha L.R). Groom: Ajay Ratheendran (S/o P.R Ratheendra Kurup & Usha Devi). ' +
    'Map: ' + WED.mapLink;

  WED.googleCal = function () {
    return 'https://calendar.google.com/calendar/render?action=TEMPLATE' +
      '&text=' + encodeURIComponent(WED.title) +
      '&dates=' + stamp(WED.start) + '/' + stamp(WED.end) +
      '&details=' + encodeURIComponent(details) +
      '&location=' + encodeURIComponent(WED.venue) +
      '&ctz=Asia/Kolkata';
  };



  WED.bindLinks = function () {
    document.querySelectorAll('[data-cal="google"]').forEach(function (a) { a.href = WED.googleCal(); });
    document.querySelectorAll('[data-map]').forEach(function (a) { a.href = WED.mapLink; });
  };

  WED.init = function () { WED.reveal(); WED.bindLinks(); WED.countdown(document.querySelector('[data-countdown]')); };
})();
