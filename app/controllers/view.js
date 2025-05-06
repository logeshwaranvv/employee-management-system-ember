import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class ViewController extends Controller {
  @service flashMessages;
  @service employeeStore;
  @service columnState;
  @service router;

  @tracked searchText = '';
  @tracked selected = new Set();
  @tracked loadedList = [];
  @tracked isOverFlowMode = true;
  @tracked page = 1;
  @tracked visibleColumnsID = [
    'name',
    'dob',
    'department',
    'skills',
    'employmentType',
    'salary',
  ];
  @tracked pageSize = 10;
  @tracked allEmployees = [];
  @tracked isLoading = false;
  @tracked sortColumn = null;
  @tracked sortDirection = 'asc';
  @tracked columnWidths = {};
  @tracked showNestTableIndex = -1;

  @tracked allColumns = [
    { key: 'name', name: 'Name', visible: true, search: true },
    { key: 'gender', name: 'Gender', visible: false, search: false },
    { key: 'email', name: 'Email', visible: false, search: false },
    { key: 'dob', name: 'DOB', visible: true, search: false },
    { key: 'address', name: 'Address', visible: false, search: false },
    { key: 'country', name: 'Country', visible: false, search: false },
    { key: 'department', name: 'Department', visible: true, search: false },
    { key: 'skills', name: 'Skills', visible: true, search: false },
    {
      key: 'employmentType',
      name: 'Employment Type',
      visible: true,
      search: false,
      accessor: (e) => e.employmentType.value,
    },
    { key: 'salary', name: 'Salary', visible: true, search: false },
  ];

  @action
  async refresh() {
    if (!this.allEmployees || this.allEmployees.length === 0) {
      await this.refreshData();
      console.log('refresh all');
    } else if (!this.loadedList || this.loadedList.length === 0) {
      this.loadedList = this.allEmployees.slice(0, 20);
      this.page = 2;
      console.log('data refresh 2');
    } else {
      console.log('data only refresh');
      this.dataRefresh();
    }
  }

  @action
  loadColumnStates() {
    // const loadStates = this.columnState.load('column-states');
    const savedState = this.columnState.load('column-states');
    console.log(savedState);
    this.visibleColumnsID = savedState?.visibleColumns || [
      'name',
      'dob',
      'department',
      'skills',
      'employmentType',
      'salary',
    ];
    console.log(this.visibleColumnsID);
    this.columnWidths = savedState?.columnWidths || {};
    console.log(this.columnWidths);
  }

  @action
  applyWidths() {
    console.log('applyWidth');
    setTimeout(() => {
      const thAll = document.querySelectorAll('th');
      thAll.forEach((th) => {
        const columnID = th.dataset.columnId;
        const savedWidth = this.columnWidths[columnID];
        if (savedWidth && savedWidth > 0) {
          th.style.width = `${this.columnWidths[columnID]}px`;
        }
      });
    }, 200);
  }

  dataRefresh() {
    this.loadedList = this.loadedList.map((employee) => {
      const updatedEmployee = this.employeeStore.find(employee.id);
      return updatedEmployee;
    });
    this.loadedList = [...this.loadedList];
  }

  @action
  refreshData() {
    this.isLoading = true;
    this.allEmployees = this.employeeStore.get();
    console.log(this.allEmployees);
    this.loadedList = this.allEmployees.slice(0, 20);
    this.page = 2;
    this.selected.clear();
    this.isLoading = false;
  }

  @action
  async loadMore() {
    if (this.isLoading) return;
    this.allEmployees = this.employeeStore.get();

    const startIndex = this.page * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    const currentTotal = this.loadedList.length;
    const newTotal = this.allEmployees.length;

    if (currentTotal < newTotal && startIndex >= currentTotal) {
      this.isLoading = true;

      setTimeout(() => {
        const newEmployees = this.allEmployees.slice(
          currentTotal,
          currentTotal + this.pageSize,
        );
        if (newEmployees.length > 0) {
          this.loadedList = [...this.loadedList, ...newEmployees];
          this.page = Math.ceil(this.loadedList.length / this.pageSize) + 1;
        }
        this.isLoading = false;
      }, 250);
    } else if (startIndex < this.allEmployees.length) {
      this.isLoading = true;

      setTimeout(() => {
        const newEmployees = this.allEmployees.slice(startIndex, endIndex);
        if (newEmployees.length > 0) {
          this.loadedList = [...this.loadedList, ...newEmployees];
          this.page++;
        }
        this.isLoading = false;
      }, 250);
    }
  }

  get employeesL() {
    const input = this.searchText?.toLowerCase() ?? '';

    return input
      ? this.allEmployees.filter((employee) => {
          return this.allColumns.some((column) => {
            if (!column.search) return false;

            const value = column.accessor
              ? column.accessor(employee)
              : employee[column.key];

            if (Array.isArray(value)) {
              return value.join().toLowerCase().includes(input);
            }
            return String(value).toLowerCase().includes(input);
          });
        })
      : this.loadedList;
  }
  get visibleColumns() {
    return this.allColumns.filter((column) =>
      this.visibleColumnsID.includes(column.key),
    );
  }

  @action
  changeSortColumn(column) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.allEmployees = [...this.allEmployees].sort((a, b) => {
      let valueA = a[column];
      let valueB = b[column];

      if (column === 'employmentType') {
        valueA = a.employmentType.value;
        valueB = b.employmentType.value;
      }

      if (column === 'salary') {
        valueA = Number(valueA);
        valueB = Number(valueB);
        if (valueA === valueB) {
          return this.sortDirection === 'asc'
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        }
      } else if (typeof valueA === 'string') {
        valueA = valueA.toLowerCase();
        valueB = valueB.toLowerCase();
      }

      if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;

      return this.sortDirection === 'asc'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    });

    const startIndex = 0;
    const endIndex = this.page * this.pageSize;
    this.loadedList = this.allEmployees.slice(startIndex, endIndex);
  }

  @action
  async update(event) {
    await setTimeout(() => {
      this.searchText = event.target.value;
    }, 200);
    this.flashMessages.clearMessages();
    this.flashMessages.success('Searching for employees, please wait...', {
      timeout: 2000,
      destroyOnClick: true,
    });
  }

  @action
  isVisible(column) {
    return this.visibleColumnsID.includes(column.key);
  }
  @action
  toggleVisible(column) {
    const columnId = column.key;

    if (this.visibleColumnsID.includes(columnId)) {
      this.visibleColumnsID = this.visibleColumnsID.filter(
        (id) => id !== columnId,
      );
    } else {
      this.visibleColumnsID = [...this.visibleColumnsID, columnId];
    }
  }
  @action
  toggleSearch(column) {
    column.search = !column.search;
    this.allColumns = [...this.allColumns];
  }

  @action
  clear() {
    this.searchText = '';
    document.querySelector('.search-box').blur();
  }
  @action
  selectedClear() {
    this.selected.clear();
    this.selected = new Set();
  }
  @action
  goToAdd() {
    this.router.transitionTo('add');
  }

  @action
  delete(id) {
    this.flashMessages.clearMessages();
    this.allEmployees = this.allEmployees.filter(
      (employee) => employee.id !== id,
    );
    this.employeeStore.delete(id);
    this.selected.delete(id);
    this.selected = new Set(this.selected);
    this.loadedList = this.loadedList.filter((employee) => employee.id !== id);
    this.flashMessages.success('Deleted Successfully!', {
      timeout: 2000,
    });
  }
  @action
  deleteSelected() {
    this.selected.forEach((id) => {
      this.allEmployees = this.allEmployees.filter(
        (employee) => employee.id !== id,
      );
      this.employeeStore.delete(id);
    });
    this.loadedList = this.loadedList.filter(
      (employee) => !this.selected.has(employee.id),
    );
    this.selected.clear();
    this.selected = new Set();
    this.flashMessages.success('Deleted Successfully!', {
      timeout: 2000,
    });
  }
  get selectedSize() {
    return this.selected.size;
  }
  @action
  incrementIndex(index) {
    return index + 1;
  }
  @action
  isSelected(id) {
    return this.selected.has(id);
  }
  @action
  toggle(id) {
    if (this.selected.has(id)) {
      this.selected.delete(id);
    } else {
      this.selected.add(id);
    }
    this.selected = new Set(this.selected);
    // console.log(this.selected);
  }
  @action
  setNestTableIndex(index) {
    if (this.showNestTableIndex === index) {
      this.showNestTableIndex = -1;
    } else {
      this.showNestTableIndex = index;
    }
  }
  @action
  toggleAll() {
    if (this.selected.size === this.employeesL.length) {
      this.selected.clear();
      this.selected = new Set();
    } else {
      this.selected = new Set(this.employeesL.map((employee) => employee.id));
    }
  }
  @action
  searchFocus() {
    const element = document.getElementById('search');
    element.focus();
  }
  @action
  toOverflow() {
    this.isOverFlowMode = true;
  }
  @action
  toNoOverflow() {
    this.isOverFlowMode = false;
  }
}
