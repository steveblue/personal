import { CustomElement, Component } from '@readymade/core';

import style from './post.css?raw';
import template from './post.html?raw';

@Component({
  selector: 't-post',
  style: style,
  template: template,
})
class PostComponent extends CustomElement {
  constructor() {
    super();
  }

  static get observedAttributes() {
    return ['theme'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (!this.shadowRoot.querySelector) return;
    if (name === 'theme') {
      this.shadowRoot.querySelector('.post__wrapper').classList.add(newValue);
    }
  }
}

// customElements.define('t-post', PostComponent);

export { PostComponent };
