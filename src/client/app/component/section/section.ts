import { CustomElement, Component, Listen } from '@readymade/core';

import style from './section.scss';
import template from './section.html';

declare global {
  interface Window {
    observer$: IntersectionObserver;
  }
}

@Component({
  selector: 'v-section',
  style: style,
  template: template
})
class SectionComponent extends CustomElement {
  constructor() {
    super();
  }

  connectedCallback() {
    if (window && window.observer$) {
      window.observer$.observe(this);
    }
  }

  @Listen('entry')
  onIntersect(ev: any) {
   // console.log('bang!', ev.detail);
  }

}

customElements.define('v-section', SectionComponent);

export { SectionComponent };
