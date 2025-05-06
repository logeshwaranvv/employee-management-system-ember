import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class ColumnStateService extends Service {
  @tracked columnStates = {};

  save(name, states) {
    localStorage.setItem(`${name}`, JSON.stringify(states));
  }
  load(name) {
    return JSON.parse(localStorage.getItem(`${name}`));
  }
}
