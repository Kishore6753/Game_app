(function () {
  "use strict";

  var STORAGE_KEY = "theme"; // values: "dark" | "light"

  function supportsLocalStorage() {
    try {
      var s = window.localStorage;
      var testKey = "__theme_test__";
      s.setItem(testKey, "1");
      s.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  }

  function getStoredTheme() {
    if (!supportsLocalStorage()) return null;
    return window.localStorage.getItem(STORAGE_KEY);
  }

  function setStoredTheme(theme) {
    if (!supportsLocalStorage()) return;
    window.localStorage.setItem(STORAGE_KEY, theme);
  }

  function prefersDark() {
    return !!(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
  }

  function applyTheme(theme) {
    // Theme is applied to <html> so it can style both html and body.
    var root = document.documentElement;
    var isDark = theme === "dark";

    root.classList.toggle("theme-dark", isDark);

    // Sync toggle state if it exists.
    var btn = document.getElementById("theme-toggle");
    if (btn) {
      btn.setAttribute("aria-checked", isDark ? "true" : "false");
    }
  }

  function initialTheme() {
    var stored = getStoredTheme();
    if (stored === "dark" || stored === "light") return stored;
    return prefersDark() ? "dark" : "light";
  }

  function toggleTheme() {
    var isDark = document.documentElement.classList.contains("theme-dark");
    var next = isDark ? "light" : "dark";
    setStoredTheme(next);
    applyTheme(next);
  }

  function bindToggle() {
    var btn = document.getElementById("theme-toggle");
    if (!btn) return;

    btn.addEventListener("click", function (e) {
      e.preventDefault();
      toggleTheme();
    });

    // Make the switch usable via keyboard even in older browsers.
    btn.addEventListener("keydown", function (e) {
      var key = e.which || e.keyCode;
      if (key === 13 || key === 32) {
        e.preventDefault();
        toggleTheme();
      }
    });
  }

  // Apply theme as early as possible to minimize flashing.
  applyTheme(initialTheme());

  // Bind once DOM is ready so the toggle is present.
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bindToggle);
  } else {
    bindToggle();
  }
})();
