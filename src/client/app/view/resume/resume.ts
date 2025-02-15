import { CustomElement, Component, State } from '@readymade/core';

import style from './resume.css?raw';
import template from './resume.html?raw';

@Component({
  selector: 'resume-view',
  style: style,
  template: template,
})
class ResumeComponent extends CustomElement {
  constructor() {
    super();
  }
  @State()
  getState() {
    return {
      scale: 1.0,
    };
  }
  connectedCallback() {
    if (!this.shadowRoot.querySelectorAll) return;
    setTimeout(
      () =>
        this.shadowRoot.querySelector('.title').classList.add('is--visible'),
      0,
    );
  }
}

const render = () => `
  <resume-view>
    <template shadowrootmode="open">
      <style>
        ${style}
      </style>
      ${template}
    </template>
  </resume-view>
`;

// customElements.define('resume-view', ResumeComponent);

export { ResumeComponent, render };
