import { CustomElement, Component, Listen } from '@readymade/core';

import style from './scroll-view.scss';
import template from './scroll-view.html?raw';
import { ScrollPayload } from './scroll';

@Component({
  selector: 'v-scroll-view',
  style: style,
  template: template
})
class ScrollView extends CustomElement {
  transform: string = '';

  constructor() {
    super();
    this.transform = `matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1.0)`;
  }

  connectedCallback() {
    this.style.transform = this.transform;
  }

  @Listen('update', 'scroll')
  onScroll(ev: CustomEvent) {
    const payload = ev.detail as ScrollPayload;
    this.transform = `matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,${payload.position},0,1.0)`;
    this.style.transform = this.transform;
  }
}

// customElements.define('v-scroll-view', ScrollView);

export { ScrollView };
