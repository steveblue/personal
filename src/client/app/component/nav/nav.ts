import { CustomElement, Component, Listen } from '@readymade/core';

import style from './nav.scss';
import template from './nav.html';


@Component({
  selector: 'v-nav',
  style: style,
  template: template
})
class NavComponent extends CustomElement {
  private isActive: boolean = false;
  constructor() {
    super();
  }
  connectedCallback() {
    this.shadowRoot?.querySelector('.nav__button')?.addEventListener('click', this.toggle.bind(this));
  }
  toggle() {
    this.isActive = this.isActive ? false : true;
    if (this.isActive) {
      this.shadowRoot?.querySelector('.nav__container')?.classList.add('is--open');
    } else {
      this.shadowRoot?.querySelector('.nav__container')?.classList.remove('is--open');
    }
  }
}

customElements.define('v-nav', NavComponent);

export { NavComponent };