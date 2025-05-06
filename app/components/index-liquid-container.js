import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class IndexLiquidContainerComponent extends Component {
  @tracked showMessage = false;

  @action
  change() {
    this.showMessage = !this.showMessage;
  }

  @action
  hide() {
    this.showMessage = false;
  }
}
