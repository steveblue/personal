import { CustomElement, Component, Listen } from '@readymade/core';

import style from './marketing.scss';
import template from './marketing.html';

@Component({
  selector: 't-market',
  style: style,
  template: template
})
class MarketingComponent extends CustomElement {
  theme: string[];
  constructor() {
    super();
    this.theme = [];
  }

  static get observedAttributes() {
    return ['theme'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (!this.shadowRoot.querySelector) return;
    if (name === 'theme') {
      this.theme = newValue.split(' ');
      this.theme.forEach(theme => this.shadowRoot.querySelector('.post__wrapper').classList.add(theme));
    }
  }

  onConnectedCallbck() {
    this.theme.forEach(theme => this.shadowRoot.querySelector('.post__wrapper').classList.add(theme));
  }

}

customElements.get('t-market') || customElements.define('t-market', MarketingComponent);

export { MarketingComponent };
