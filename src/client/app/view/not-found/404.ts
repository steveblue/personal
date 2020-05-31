import { CustomElement, Component, State } from '@readymade/core';

import style from './404.scss';
import template from './404.html';

@Component({
  selector: 'not-found-view',
  style: style,
  template: template
})
class FileNotFoundComponent extends CustomElement {
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

// customElements.define('not-found-view', FileNotFoundComponent);

export { FileNotFoundComponent };
