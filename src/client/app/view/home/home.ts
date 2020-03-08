import { CustomElement, Component, State } from '@readymade/core';

import style from './home.scss';
import template from './home.html';

@Component({
  selector: 'home-view',
  style: style,
  template: template
})
class HomeComponent extends CustomElement {
  constructor() {
    super();
  }
  @State()
  getState() {
    return {
      scale: 1.0
    };
  }
}

customElements.define('home-view', HomeComponent);

export { HomeComponent };
