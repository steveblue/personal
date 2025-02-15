import { CustomElement, Component, State } from '@readymade/core';

import style from './../resume/resume.css?raw';
import template from './cv.html?raw';

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
  connectedCallback() {
    if (!this.shadowRoot.querySelectorAll) return;
    setTimeout(
      () =>
        this.shadowRoot.querySelector('.title').classList.add('is--visible'),
      0
    );
  }
}

const render = () => `
  <cv-view>
    <template shadowrootmode="open">
      <style>
        ${style}
      </style>
      ${template}
    </template>
  </cv-view>
`;

export { CVComponent, render };
