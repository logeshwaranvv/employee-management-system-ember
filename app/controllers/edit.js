import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

import 'ember-power-select/styles'; //important for power select

export default class EditController extends Controller {
  @service router;
  @service employeeStore;

  @action
  async update(event) {
    this.employeeStore.update(updatedEmployee);
    this.router.transitionTo('view');
  }
}
