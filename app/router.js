import EmberRouter from '@ember/routing/router';
import config from 'ember-app/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('index', { path: '/' });
  this.route('add', { path: '/add-employee' });
  this.route('view', { path: '/employee-list' });
  this.route('edit', { path: '/edit-employee/:employee_id' });
});
