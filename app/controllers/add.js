import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

import 'ember-power-select/styles'; //important for power select

export default class AddController extends Controller {
  @service employeeStore;
  @service router;

  @action
  saveEmployee(employee) {
    this.employeeStore.add(employee);
    this.router.transitionTo('view');
  }
}
