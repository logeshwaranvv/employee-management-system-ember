import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class ScrollViewService extends Service {
  @tracked scrollPositionForBody;
  @tracked scrollPositionForContainer;
  @tracked isOverflow;

  put(body, container, view) {
    this.scrollPositionForBody = body;
    this.scrollPositionForContainer = container;
    this.isOverflow = view;
  }
  getBody() {
    return this.scrollPositionForBody;
  }
  getContainer() {
    return this.scrollPositionForContainer;
  }
  getView() {
    return this.isOverflow;
  }
}
