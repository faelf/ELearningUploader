import * as theme from "./utilities/theme.ts";

function init(): void {
  theme.init();
}

document.addEventListener("click", (event: MouseEvent): void => {
  if (!(event.target instanceof Element)) return;

  const action = event.target.closest<HTMLElement>("[data-action]");
  if (!action) return;

  switch (action.dataset.action) {
    case "theme":
      theme.click();
      break;
  }
});

document.addEventListener("DOMContentLoaded", init);
