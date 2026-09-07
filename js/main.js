/* ============================================================
   Tri-Aid — main.js
   i18n application (localStorage), mobile nav, scroll reveals.
   ============================================================ */

(function () {
  "use strict";

  var I18N = window.I18N || {};
  var LANGS = ["en", "es"];

  /* ---------------- i18n ---------------- */

  var stored = null;
  try { stored = localStorage.getItem("lang"); } catch (e) { /* private mode */ }
  var lang = LANGS.indexOf(stored) >= 0 ? stored : "en";

  function isTermsPage() {
    return /terms\.html?$/.test(window.location.pathname);
  }

  function apply(next) {
    lang = next;
    var dict = I18N[lang] || {};

    document.documentElement.lang = lang === "es" ? "es-419" : "en-US";

    var titleKey = isTermsPage() ? "doc.termsTitle" : "doc.title";
    if (dict[titleKey]) document.title = dict[titleKey];

    var els = document.querySelectorAll("[data-i18n]");
    for (var i = 0; i < els.length; i++) {
      var key = els[i].getAttribute("data-i18n");
      if (dict[key] != null) els[i].textContent = dict[key];
    }

    var ariaEls = document.querySelectorAll("[data-i18n-aria]");
    for (var j = 0; j < ariaEls.length; j++) {
      var ariaKey = ariaEls[j].getAttribute("data-i18n-aria");
      if (dict[ariaKey] != null) ariaEls[j].setAttribute("aria-label", dict[ariaKey]);
    }

    var btns = document.querySelectorAll("[data-lang-btn]");
    for (var k = 0; k < btns.length; k++) {
      var on = btns[k].getAttribute("data-lang-btn") === lang;
      btns[k].setAttribute("aria-pressed", on ? "true" : "false");
      btns[k].classList.toggle("is-active", on);
    }
  }

  function setLang(next) {
    try { localStorage.setItem("lang", next); } catch (e) { /* private mode */ }
    apply(next);
  }

  var langBtns = document.querySelectorAll("[data-lang-btn]");
  for (var b = 0; b < langBtns.length; b++) {
    langBtns[b].addEventListener("click", function () {
      setLang(this.getAttribute("data-lang-btn"));
    });
  }

  /* ---------------- Mobile nav ---------------- */

  var burger = document.querySelector(".nav-burger");
  var panel = document.getElementById("mobile-panel");

  function closeNav() {
    if (!burger || !panel) return;
    burger.setAttribute("aria-expanded", "false");
    burger.classList.remove("is-open");
    panel.classList.remove("is-open");
    document.body.classList.remove("nav-locked");
  }

  if (burger && panel) {
    burger.addEventListener("click", function () {
      var open = burger.getAttribute("aria-expanded") === "true";
      burger.setAttribute("aria-expanded", open ? "false" : "true");
      burger.classList.toggle("is-open", !open);
      panel.classList.toggle("is-open", !open);
      document.body.classList.toggle("nav-locked", !open);
    });

    var panelLinks = panel.querySelectorAll("a");
    for (var p = 0; p < panelLinks.length; p++) {
      panelLinks[p].addEventListener("click", closeNav);
    }

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });
  }

  /* ---------------- Scroll reveal ---------------- */

  var reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var revealEls = document.querySelectorAll(".reveal");

  if (!reduceMotion && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    for (var r = 0; r < revealEls.length; r++) io.observe(revealEls[r]);
  } else {
    for (var r2 = 0; r2 < revealEls.length; r2++) {
      revealEls[r2].classList.add("in");
    }
  }

  apply(lang);
})();
