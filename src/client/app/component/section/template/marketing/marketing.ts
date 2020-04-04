import { CustomElement, Component, Listen } from '@readymade/core';

import style from './marketing.scss';
import template from './marketing.html';

@Component({
  selector: 't-market',
  style: style,
  template: template
})
class MarketingComponent extends CustomElement {
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

customElements.define('t-market', MarketingComponent);

export { MarketingComponent };
