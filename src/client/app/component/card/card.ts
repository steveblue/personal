import { CustomElement, Component, Listen } from '@readymade/core';

import {
  animate,
  AnimationPlayer,
  slideUpAnimation,
  zoomInAnimation,
} from './../../util/anim';
import { WebAnimation } from '../../../app/util/anim/interface';

import style from './card.css?raw';
import template from './card.html?raw';
import { ScrollPayload } from '../scroll/scroll';

@Component({
  selector: 'v-card',
  style: style,
  template: template,
})
class CardComponent extends CustomElement {
  private multiplier: number = 1500;
  private index: number = 0;
  private direction: string = 'forwards';
  private currentIndex: number;
  private animIn: AnimationPlayer;
  private in: WebAnimation = zoomInAnimation;
  private animations: { [key: string]: WebAnimation } = {
    zoomIn: zoomInAnimation,
    slideUp: slideUpAnimation,
  };

  constructor() {
    super();
    this.animIn = animate((<unknown>this) as HTMLElement, this.in);
    this.currentIndex = 0;
  }

  static get observedAttributes() {
    return ['in', 'out', 'index'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'in' && this.animations[newValue]) {
      this.in = this.animations[newValue];
      this.animIn = animate((<unknown>this) as HTMLElement, this.in);
      this.animIn.pause();
    }
    if (name === 'index') {
      this.index = parseInt(newValue, 10);
    }
  }

  connectedCallback() {
    if (this.getAttribute('in') && this.getAttribute('index') === '0') {
      this.animIn.play();
    }
  }

  @Listen('update', 'scroll')
  onScroll(ev: CustomEvent) {
    const payload = ev.detail as ScrollPayload;
    const index =
      Math.floor((payload.position as number) / this.multiplier) * -1;
    if (index !== this.currentIndex) {
      this.currentIndex = index;
      if (this.index === index) {
        if (this.direction === 'backwards') {
          this.direction = 'forwards';
          this.animIn.reverse();
        }
        this.animIn.play();
      } else if (index === this.index + 1 || index === this.index - 1) {
        if (this.direction === 'forwards') {
          this.direction = 'backwards';
          this.animIn.reverse();
        }
        this.animIn.play();
      }
    }
  }
}

// customElements.define('v-card', CardComponent);

export { CardComponent };
