export interface TableConfig {
  container: string;
  columns: Record<string, string>;
  data: any[];
}

function emptyState(): HTMLDivElement {
  const div = document.createElement("div");
  div.className = "empty-state";
  div.innerHTML = /* html */ `
    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"/>
    </svg>
    <span>Add trainings to be uploaded ...</span>
  `;

  return div;
}

function createTbody(
  columns: Record<string, string>,
  data: any[],
): HTMLTableSectionElement {
  const tbody = document.createElement("tbody");

  data.forEach((item) => {
    const tr = document.createElement("tr");

    for (const column of Object.keys(columns)) {
      const td = document.createElement("td");
      td.innerText = item[column] ?? "";
      tr.appendChild(td);
    }

    const actionsTd = document.createElement("td");

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.dataset.action = "delete-row";
    deleteBtn.className = "btn-sm red";
    deleteBtn.innerText = "Delete";

    actionsTd.appendChild(deleteBtn);
    tr.appendChild(actionsTd);

    tbody.appendChild(tr);
  });

  return tbody;
}

function createThead(columns: Record<string, string>): HTMLTableSectionElement {
  const thead = document.createElement("thead");
  const tr = document.createElement("tr");

  Object.values(columns).forEach((value) => {
    const th = document.createElement("th");
    th.innerText = value;
    tr.appendChild(th);
  });

  const actionsTh = document.createElement("th");
  actionsTh.innerText = "Actions";
  tr.appendChild(actionsTh);

  thead.appendChild(tr);

  return thead;
}

export function load(config: TableConfig): void {
  const tableContainer = document.querySelector<HTMLElement>(config.container);

  if (!tableContainer) return;

  tableContainer.innerHTML = "";

  if (config.data.length === 0) {
    tableContainer.appendChild(emptyState());
    return;
  }

  const table = document.createElement("table");

  table.appendChild(createThead(config.columns));
  table.appendChild(createTbody(config.columns, config.data));

  tableContainer.appendChild(table);
}
