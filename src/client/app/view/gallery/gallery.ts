import { CustomElement, Component, State } from '@readymade/core';

import style from './gallery.scss';
import template from './gallery.html';

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
  connectedCallback() {
    // this.getModel();
    if (!this.shadowRoot.querySelectorAll) return;
    setTimeout(() => this.shadowRoot.querySelector('.blog__title').classList.add('is--visible'), 0);
  }
}

// customElements.define('gallery-view', GalleryComponent);

export { GalleryComponent };
