import { CustomElement, Component, State } from '@readymade/core';

import style from './photo.css?raw';
import template from './photo.html?raw';

@Component({
  selector: 'photo-view',
  style: style,
  template: template,
})
class PhotoComponent extends CustomElement {
  constructor() {
    super();
  }
  @State()
  getState() {
    return {
      scale: 1.0,
    };
  }
}

const render = () => `
  <photo-view>
    <template shadowrootmode="open">
      <style>
        ${style}
      </style>
      ${template}
    </template>
  </photo-view>
`;

export { PhotoComponent, render };
