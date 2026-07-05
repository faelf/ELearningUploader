type Theme = "light" | "dark";

function updateThemeButton(theme: "light" | "dark"): void {
  const btn = document.querySelector("[data-action='theme']");
  if (!btn) return;
  btn.textContent = theme === "dark" ? "Switch to light" : "Switch to dark";
}

export function init(): void {
  const saved = localStorage.getItem("theme");
  let theme: Theme = "light";
  if (saved === "light" || saved === "dark") {
    theme = saved;
  } else if (document.documentElement.dataset.theme === "light") {
    theme = "light";
  } else if (document.documentElement.dataset.theme === "dark") {
    theme = "dark";
  }
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("theme", theme);
  updateThemeButton(theme);
}

export function click(): void {
  const root = document.documentElement;

  const theme: "light" | "dark" =
    root.dataset.theme === "light" ? "dark" : "light";

  root.dataset.theme = theme;
  localStorage.setItem("theme", theme);

  updateThemeButton(theme);
}
