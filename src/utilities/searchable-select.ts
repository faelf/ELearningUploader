export interface CreateSearchableSelectConfig<T> {
  container: string;
  data: T[];
  displayKey: keyof T;
  valueKey: keyof T;
}

export interface SearchableSelectInstance<T> {
  updateData: (newData: T[]) => void;
}

export function createSearchableSelect<T extends Record<string, any>>({
  container,
  data,
  displayKey,
  valueKey,
}: CreateSearchableSelectConfig<T>): SearchableSelectInstance<T> | undefined {
  const containerEl = document.querySelector<HTMLElement>(container);
  if (!containerEl) return undefined;

  const searchInput =
    containerEl.querySelector<HTMLInputElement>(".select-input");
  const hiddenInput = containerEl.querySelector<HTMLInputElement>(
    'input[type="hidden"]',
  );
  const optionsContainer =
    containerEl.querySelector<HTMLDivElement>(".select-options");

  if (!searchInput || !hiddenInput || !optionsContainer) return undefined;

  let currentData: T[] = data;
  let filteredData: T[] = currentData;
  let activeIndex = -1;

  const renderOptions = (items: T[]): void => {
    optionsContainer.innerHTML = "";
    filteredData = items;

    if (!items.length) {
      optionsContainer.classList.remove("open");
      return;
    }

    items.forEach((item) => {
      const option = document.createElement("div");
      option.className = "select-option";
      option.textContent = String(item[displayKey]);
      option.dataset.value = String(item[valueKey]);
      optionsContainer.appendChild(option);
    });

    optionsContainer.classList.add("open");
    activeIndex = -1;
  };

  const selectOption = (item: T): void => {
    searchInput.value = String(item[displayKey]);
    hiddenInput.value = String(item[valueKey]);

    optionsContainer.classList.remove("open");
    optionsContainer.innerHTML = "";

    hiddenInput.dispatchEvent(new Event("change", { bubbles: true }));
  };

  const updateActive = (options: Element[]): void => {
    options.forEach((opt) => opt.classList.remove("active"));

    const active = options[activeIndex] as HTMLElement | undefined;

    if (active) {
      active.classList.add("active");
      active.scrollIntoView({ block: "nearest" });
    }
  };

  const handleClick = (e: MouseEvent): void => {
    if (!(e.target instanceof Element)) return;

    if (!containerEl.contains(e.target)) {
      optionsContainer.classList.remove("open");
      return;
    }

    const option = e.target.closest<HTMLDivElement>(".select-option");

    if (option) {
      e.preventDefault();

      const item = filteredData.find(
        (i) => String(i[valueKey]) === option.dataset.value,
      );

      if (item) selectOption(item);
    }
  };

  searchInput.addEventListener("input", () => {
    hiddenInput.value = "";

    const query = searchInput.value.toLowerCase().trim();
    const searchTerms = query.split(/\s+/).filter(Boolean);

    const matches =
      searchTerms.length > 0
        ? currentData.filter((item) => {
            const displayValue = String(item[displayKey]).toLowerCase();
            const valueValue = String(item[valueKey]).toLowerCase();

            const matchInDisplay = searchTerms.every((term) =>
              displayValue.includes(term),
            );

            return matchInDisplay || valueValue.includes(query);
          })
        : currentData;

    renderOptions(matches);
  });

  searchInput.addEventListener("focus", () => {
    renderOptions(filteredData.length ? filteredData : currentData);
  });

  searchInput.addEventListener("keydown", (e: KeyboardEvent) => {
    const options = Array.from(optionsContainer.children);

    if (!options.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      activeIndex = (activeIndex + 1) % options.length;
      updateActive(options);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      activeIndex = (activeIndex - 1 + options.length) % options.length;
      updateActive(options);
    } else if (e.key === "Enter") {
      e.preventDefault();

      if (activeIndex >= 0) {
        selectOption(filteredData[activeIndex]);
      }
    } else if (e.key === "Escape") {
      optionsContainer.classList.remove("open");
    }
  });

  document.addEventListener("click", handleClick);

  return {
    updateData: (newData: T[]): void => {
      currentData = newData;
      filteredData = newData;
    },
  };
}
