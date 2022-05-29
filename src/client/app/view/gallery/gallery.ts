import { CustomElement, Component, State } from '@readymade/core';

import style from './gallery.scss';
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

// customElements.define('gallery-view', GalleryComponent);

export { GalleryComponent };
