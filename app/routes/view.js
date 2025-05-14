import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class ViewRoute extends Route {
  @service scrollView;
  @service employeeStore;
  @service columnState;

  model() {
    return this.employeeStore.get();
  }
  setupController(controller, model) {
    super.setupController(controller, model);
    controller.refresh();
    controller.loadColumnStates();
    setTimeout(() => {
      controller.applyWidths();
    }, 200);
  }
  activate() {
    super.activate();
    this.restoreSV();
  }
  deactivate() {
    super.deactivate();
    this.saveSV();
    this.saveColumnStates();
  }
  saveColumnStates() {
    const thAll = document.querySelectorAll(
      '.employee-table th[data-column-id]',
    );
    const states = {
      visibleColumns: this.controller.visibleColumnsID,
      columnWidths: {},
    };
    thAll.forEach((th) => {
      const columnID = th.dataset.columnId;
      if (columnID && this.controller.visibleColumnsID.includes(columnID)) {
        const width = th.getBoundingClientRect().width;
        if (width > 0) {
          states.columnWidths[columnID] = Math.round(width);
        }
      }
    });
    if (Object.keys(states.columnWidths).length > 0) {
      this.columnState.save('column-states', states);
    }
  }
  saveSV() {
    const body = document.documentElement;
    const container = document.querySelector('.view-content');
    const view = this.controller.isOverFlowMode;
    if (body || container) {
      this.scrollView.put(body.scrollTop, container.scrollTop, view);
    }
  }

  restoreSV() {
    setTimeout(() => {
      const savedBody = this.scrollView.getBody();
      const savedContainer = this.scrollView.getContainer();
      const view = this.scrollView.getView();
      if (view) {
        this.controller.isOverFlowMode = view;
      }
      setTimeout(() => {
        const container = document.querySelector('.view-content');
        if (
          container &&
          savedBody !== undefined &&
          savedContainer !== undefined
        ) {
          window.scrollTo({ top: savedBody, behavior: 'instant' });
          container.scrollTo({ top: savedContainer, behavior: 'instant' });
        }
      }, 150);
    }, 150);
  }
}
