import { CustomElement, Component, State } from '@readymade/core';

import style from './../resume/resume.scss';
import template from './cv.html';

@Component({
  selector: 'cv-view',
  style: style,
  template: template
})
class CVComponent extends CustomElement {
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

customElements.define('cv-view', CVComponent);

export { CVComponent };
