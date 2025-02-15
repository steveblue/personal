import { CustomElement, Component, State } from '@readymade/core';

import style from './404.css?raw';
import template from './404.html?raw';

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

const render = () => `
  <not-found-view>
    <template shadowrootmode="open">
      <style>
        ${style}
      </style>
      ${template}
    </template>
  </not-found-view>
`;

export { FileNotFoundComponent, render };
