import { CustomElement, Component, Listen } from '@readymade/core';

import style from './nav.scss';
import template from './nav.html';


@Component({
  selector: 'v-nav',
  style: style,
  template: template
})
class NavComponent extends CustomElement {
  constructor() {
    super();
  }
}

customElements.define('v-nav', NavComponent);

export { NavComponent };