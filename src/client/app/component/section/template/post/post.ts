import { CustomElement, Component, Listen } from '@readymade/core';

import style from './post.scss';
import template from './post.html';

@Component({
  selector: 't-post',
  style: style,
  template: template
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
