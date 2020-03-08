import { CustomElement, Component } from '@readymade/core';

import style from './stage.scss';
import template from './stage.html';

@Component({
  selector: 'v-stage',
  style: style,
  template: template
})
class StageComponent extends CustomElement {
  constructor() {
    super();
  }

  connectedCallback() {}
}

customElements.define('v-stage', StageComponent);

export { StageComponent };
