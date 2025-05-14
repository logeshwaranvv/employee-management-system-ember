import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class EditRoute extends Route {
  @service employeeStore;
  @service router;

  async model(params) {
    const id = parseInt(params.employee_id);
    const employee = await this.employeeStore.find(id);
    return employee;
  }
}
