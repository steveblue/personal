import { CustomElement, Component, Listen } from '@readymade/core';

import style from './nav.scss';
import template from './nav.html';
import {
  animate,
  AnimationPlayer,
  navOutAnimation,
  navInAnimation
} from './../../util/anim';
import { WebAnimation } from 'app/util/anim/interface';

@Component({
  selector: 'v-nav',
  style: style,
  template: template
})
class NavComponent extends CustomElement {
  private isActive: boolean;
  private navIn: AnimationPlayer;
  private navOut: AnimationPlayer;
  private animations: { [key: string]: WebAnimation } = {
    navIn: navInAnimation,
    navOut: navOutAnimation
  };
  constructor() {
    super();
    this.isActive = false;
    this.navIn = animate((<unknown>this) as HTMLElement, this.animations.navIn);
    this.navOut = animate((<unknown>this) as HTMLElement, this.animations.navOut);
  }
  connectedCallback() {
    this.navIn = animate((<unknown>this.shadowRoot?.querySelector('nav')) as HTMLElement, this.animations.navIn);
    this.navOut = animate((<unknown>this.shadowRoot?.querySelector('nav')) as HTMLElement, this.animations.navOut);
    this.navIn.pause();
    this.navOut.play();
    this.shadowRoot?.querySelector('.nav__button')?.addEventListener('click', this.toggle.bind(this));
  }
  toggle() {
    this.isActive = this.isActive ? false : true;
    if (!this.shadowRoot?.querySelector('.nav__container')?.classList.contains('is--init')) {
      this.shadowRoot?.querySelector('.nav__container')?.classList.add('is--init');
    }
    if (this.isActive) {
      this.style.width = '100vw';
      this.style.width = '100vh';
      this.navOut.cancel();
      this.navIn.play();
      this.shadowRoot?.querySelector('.nav__container')?.classList.add('is--open');
    } else {
      this.style.width = '68px';
      this.style.width = '68px';
      this.navIn.cancel();
      this.navOut.play();
      this.shadowRoot?.querySelector('.nav__container')?.classList.remove('is--open');
    }
  }
}

customElements.define('v-nav', NavComponent);

export { NavComponent };