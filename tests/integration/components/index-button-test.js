import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-app/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | index-button', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<IndexButton />`);

    assert.dom().hasText('');

    // Template block usage:
    await render(hbs`
      <IndexButton>
        template block text
      </IndexButton>
    `);

    assert.dom().hasText('template block text');
  });
});
