(() => {
  const supported = new Set(["zh-CN", "en"]);
  const params = new URLSearchParams(window.location.search);
  const requested = params.get("lang");
  let stored = null;
  try {
    stored = window.localStorage.getItem("game-archive-language");
  } catch {
    stored = null;
  }

  const language = supported.has(requested)
    ? requested
    : supported.has(stored) ? stored : "zh-CN";

  window.APP_LANGUAGE = language;
  document.documentElement.lang = language;
  document.documentElement.dataset.language = language;

  window.setGameArchiveLanguage = (nextLanguage) => {
    if (!supported.has(nextLanguage) || nextLanguage === window.APP_LANGUAGE) return;
    try {
      window.localStorage.setItem("game-archive-language", nextLanguage);
    } catch {
      // Local files can disable storage; the URL still carries the selection.
    }
    const url = new URL(window.location.href);
    url.searchParams.set("lang", nextLanguage);
    window.location.assign(url.href);
  };

  window.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-app-language]").forEach((button) => {
      const active = button.dataset.appLanguage === window.APP_LANGUAGE;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
      button.addEventListener("click", () => window.setGameArchiveLanguage(button.dataset.appLanguage));
    });
  });
})();
