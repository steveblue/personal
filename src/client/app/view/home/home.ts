import { CustomElement, Component, Listen } from '@readymade/core';

import style from './home.scss';
import template from './home.html';

@Component({
  selector: 'home-view',
  style: style,
  template: template
})
class HomeComponent extends CustomElement {
  constructor() {
    super();
  }

  @Listen('load', 'lazy')
  onLazyload(ev: any) {
    if (!this.shadowRoot.querySelectorAll) return;
    if (ev.detail.index === '2') {
      let items: HTMLElement[] = [];
      const blurb: HTMLElement = this.shadowRoot.querySelector(`.blurb`);
      items = items.concat([blurb]).concat(Array.from(this.shadowRoot.querySelectorAll(`.icon`)));
      items.forEach((item, index) => this.stagger(index, item));
    }
    if (ev.detail.index === '3' || ev.detail.index === '5') {
      const photos = Array.from(this.shadowRoot.querySelectorAll(`[lazy-index="${ev.detail.index}"]`));
      if (photos.length && photos.filter(img => !img.getAttribute('src')).length) {
        photos.forEach(img => {
          const src = img.getAttribute('data-src');
          img.setAttribute('src', src);
        });
      }
    }
  }
  stagger(step: number, item: HTMLElement) {
    setTimeout(() => item.classList.add('is--visible'), step * 50);
  }
}

// customElements.define('home-view', HomeComponent);

export { HomeComponent };
