import { CustomElement, Component, State } from '@readymade/core';

import style from './gallery.css?raw';
import template from './gallery.html?raw';

@Component({
  selector: 'gallery-view',
  style: style,
  template: template
})
class GalleryComponent extends CustomElement {
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
  <gallery-view>
    <template shadowrootmode="open">
      <style>
        ${style}
      </style>
      ${template}
    </template>
  </gallery-view>
`;

export { GalleryComponent, render };
