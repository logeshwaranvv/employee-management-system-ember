import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-app/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | employee-form', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<EmployeeForm />`);

    assert.dom().hasText('');

    // Template block usage:
    await render(hbs`
      <EmployeeForm>
        template block text
      </EmployeeForm>
    `);

    assert.dom().hasText('template block text');
  });
});
