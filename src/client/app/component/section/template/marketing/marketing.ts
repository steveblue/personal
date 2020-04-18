import { CustomElement, Component, Listen } from '@readymade/core';

import style from './marketing.scss';
import template from './marketing.html';

@Component({
  selector: 't-market',
  style: style,
  template: template
})
class MarketingComponent extends CustomElement {
  background: {
    image: string;
    size: string;
    repeat: string;
    position: string;
  };
  bgProps: string[];
  constructor() {
    super();
    this.background = {
      image: '',
      size: '',
      repeat: '',
      position: ''
    }
    this.bgProps = ['background', 'background-size', 'background-position', 'background-repeat'];
  }

  static get observedAttributes() {
    return ['theme', 'background', 'background-size', 'background-position', 'background-repeat'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (!this.shadowRoot.querySelector) return;
    if (name === 'theme') {
      this.shadowRoot.querySelector('.post__wrapper').classList.add(newValue);
    }
    console.log(name);
    if (this.bgProps.includes(name)) {
      this.setBackground(name, newValue);
    }
  }

  onConnectedCallbck() {
    if (this.background.image.length) {
      this.drawBackground();
    }
  }

  setBackground(prop: string, value: string) {
    const bgElem: HTMLElement = this.shadowRoot.querySelector('.post__background');
    if (prop === 'background') {
      this.background.image = value;
    }
    if (prop === 'background-size') {
      this.background.size = value;
    }
    if (prop === 'background-repeat') {
      this.background.repeat = value;
    }
    if (prop === 'background-position') {
      this.background.position = value;
    }
    if (bgElem && this.background.image.length) {
      this.drawBackground();
    }
  }

  drawBackground() {
    const bgElem: HTMLElement = this.shadowRoot.querySelector('.post__background');
    bgElem.style.backgroundImage = this.background.image;
    if (this.background.repeat) {
      bgElem.style.backgroundRepeat = this.background.repeat;
    }
    if (this.background.size) {
      bgElem.style.backgroundSize = this.background.size;
    }
    if (this.background.position) {
      bgElem.style.backgroundPosition = this.background.position;
    }
    console.log(this.background);
  }

}

customElements.get('t-market') || customElements.define('t-market', MarketingComponent);

export { MarketingComponent };
