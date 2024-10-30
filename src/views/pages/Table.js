import { Component } from "../../utils/component";

export class TablePage extends Component {
  constructor() {
    super();
    this.data = [
      { id: 1, name: "John", age: 30, city: "New York" },
      { id: 2, name: "Jane", age: 25, city: "Boston" },
      { id: 3, name: "Bob", age: 35, city: "Chicago" },
    ];
    this.state = {
      sortField: null,
      sortDirection: "asc",
      currentPage: 1,
      itemsPerPage: 2,
      filters: {},
    };
    this.debounceTimeout = null;
    this.activeFilterField = null;
    this.cursorPosition = null;
  }

  debounce(func, wait) {
    return (...args) => {
      clearTimeout(this.debounceTimeout);
      this.debounceTimeout = setTimeout(() => func.apply(this, args), wait);
    };
  }
  handleFilter = this.debounce(() => {
    this.rerender();
  }, 300);
  sortData(field) {
    this.state.sortField = this.state.sortField === field ? field : field;
    this.state.sortDirection =
      this.state.sortField === field
        ? this.state.sortDirection === "asc"
          ? "desc"
          : "asc"
        : "asc";

    this.data.sort((a, b) => {
      let comparison = 0;
      if (a[field] > b[field]) comparison = 1;
      if (a[field] < b[field]) comparison = -1;
      return this.state.sortDirection === "asc" ? comparison : -comparison;
    });

    this.rerender();
  }

  filterData() {
    return this.data.filter((row) => {
      return Object.entries(this.state.filters).every(([key, value]) => {
        if (!value) return true;
        const cellValue = String(row[key]).toLowerCase();
        return cellValue.includes(value.toLowerCase());
      });
    });
  }

  getPaginatedData() {
    const filteredData = this.filterData();
    const start = (this.state.currentPage - 1) * this.state.itemsPerPage;
    return filteredData.slice(start, start + this.state.itemsPerPage);
  }

  createFilters() {
    let filterHTML = '<div class="flex flex-wrap gap-4 mb-6">';
    Object.keys(this.data[0]).forEach((key) => {
      const currentValue = this.state.filters[key] || "";
      filterHTML += `
        <div class="relative">
          <input 
            type="text" 
            placeholder="Filter ${key}..." 
            data-filter="${key}"
            value="${currentValue}"
            class="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
        </div>
      `;
    });
    filterHTML += "</div>";
    return filterHTML;
  }
  createTableHTML() {
    const headers = Object.keys(this.data[0]);
    const rows = this.getPaginatedData();
    const totalPages = Math.ceil(
      this.filterData().length / this.state.itemsPerPage
    );

    if (this.state.currentPage > totalPages) {
      this.state.currentPage = 1;
    }

    return `
      ${this.createFilters()}
      <div class="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              ${headers
                .map(
                  (header) => `
                <th 
                  data-sort="${header}"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  <div class="flex items-center gap-2">
                    ${header}
                    ${
                      this.state.sortField === header
                        ? `<span class="text-gray-400">
                          ${this.state.sortDirection === "asc" ? "↑" : "↓"}
                        </span>`
                        : ""
                    }
                  </div>
                </th>
              `
                )
                .join("")}
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            ${
              rows.length
                ? rows
                    .map(
                      (row) => `
              <tr class="hover:bg-gray-50">
                ${Object.values(row)
                  .map(
                    (value) => `
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${value}
                  </td>
                `
                  )
                  .join("")}
              </tr>
            `
                    )
                    .join("")
                : `
              <tr>
                <td colspan="${headers.length}" class="px-6 py-4 text-center text-sm text-gray-500">
                  No matching records found
                </td>
              </tr>
            `
            }
          </tbody>
        </table>
      </div>
      ${
        rows.length
          ? `
        <div class="flex items-center justify-between mt-6">
          <button 
            class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            ${this.state.currentPage === 1 ? "disabled" : ""}
          >
            Previous
          </button>
          <span class="text-sm text-gray-700">
            Page ${this.state.currentPage} of ${totalPages}
          </span>
          <button 
            class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            ${this.state.currentPage === totalPages ? "disabled" : ""}
          >
            Next
          </button>
        </div>
      `
          : ""
      }
    `;
  }
  async rerender() {
    const container = document.querySelector('[data-component="table-page"]');
    if (container) {
      // Store active element and its selection info before rerender
      const activeElement = document.activeElement;
      const filterField = activeElement?.getAttribute("data-filter");
      this.cursorPosition = activeElement?.selectionStart || null;

      container.innerHTML = await this.render();
      await this.after_render();

      // Restore focus and cursor position
      if (filterField) {
        const input = document.querySelector(
          `input[data-filter="${filterField}"]`
        );
        if (input) {
          input.focus();
          if (this.cursorPosition !== null) {
            input.setSelectionRange(this.cursorPosition, this.cursorPosition);
          }
        }
      }
    }
  }
  render = async () => {
    const view = `
      <div class="p-6" data-component="table-page">
        <h1 class="text-2xl font-semibold text-gray-900 mb-6">Data Table</h1>
        ${this.createTableHTML()}
      </div>
    `;

    return view;
  };
  after_render = async () => {
    // Add event listeners for sorting
    const headers = document.querySelectorAll("th[data-sort]");
    headers.forEach((header) => {
      header.addEventListener("click", () => {
        const field = header.getAttribute("data-sort");
        this.sortData(field);
      });
    });

    // Add event listeners for filters
    const filters = document.querySelectorAll("input[data-filter]");
    filters.forEach((filter) => {
      filter.addEventListener("input", (e) => {
        const field = e.target.getAttribute("data-filter");
        const value = e.target.value;

        // Update state without triggering rerender
        this.state.filters[field] = value;

        // Store cursor position
        this.cursorPosition = e.target.selectionStart;

        // Debounced rerender
        this.handleFilter();
      });
    });

    // Add event listeners for pagination
    const prevBtn = document.querySelector("button:first-of-type");
    const nextBtn = document.querySelector("button:last-of-type");

    prevBtn?.addEventListener("click", () => {
      if (this.state.currentPage > 1) {
        this.state.currentPage--;
        this.rerender();
      }
    });

    nextBtn?.addEventListener("click", () => {
      const totalPages = Math.ceil(
        this.filterData().length / this.state.itemsPerPage
      );
      if (this.state.currentPage < totalPages) {
        this.state.currentPage++;
        this.rerender();
      }
    });
  };
}
