import { CustomElement, Component, Listen, Emitter } from '@readymade/core';

import style from './section.css?raw';
import template from './section.html?raw';

declare global {
  interface Window {
    observer$: IntersectionObserver;
  }
}

@Component({
  selector: 'v-section',
  style: style,
  template: template,
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
  @Emitter('load', {}, 'lazy')
  @Listen('entry')
  onIntersect(ev: any) {
    this.emitter.broadcast(
      new CustomEvent('load', {
        detail: {
          type: 'load',
          index: this.getAttribute('data-index'),
        },
      }),
      'lazy',
    );
  }
}

// customElements.define('v-section', SectionComponent);

export { SectionComponent };
