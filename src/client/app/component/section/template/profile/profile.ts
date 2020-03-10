import { CustomElement, Component, Listen } from '@readymade/core';

import style from './profile.scss';
import template from './profile.html';

@Component({
  selector: 't-profile',
  style: style,
  template: template
})
class ProfileComponent extends CustomElement {

  constructor() {
    super();
  }

  connectedCallback() {

  }


}

customElements.define('t-profile', ProfileComponent);

export { ProfileComponent };
