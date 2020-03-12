import { CustomElement, Component, Listen } from '@readymade/core';

import style from './profile.scss';
import template from './profile.html';

@Component({
  selector: 't-profile',
  style: style,
  template: template
})
class ProfileComponent extends CustomElement {

  private wrapper!: HTMLElement;
  private isVisible: boolean = false;

  constructor() {
    super();
  }

  connectedCallback() {
    this.setAttribute('data-index', 'profile-0');
    const root = this.shadowRoot as ShadowRoot;
    this.wrapper = root.querySelector('.profile') as HTMLElement;
    window.addEventListener('mousemove', this.onMouseMove.bind(this));
    window.addEventListener('mouseout', this.onMouseOut.bind(this));
    if (window && window.observer$) {
      window.observer$.observe(this);
    }
  }

  disconnectedCallback() {
    window.removeEventListener('mousemove', this.onMouseMove.bind(this));
    window.removeEventListener('mouseout', this.onMouseOut.bind(this));
    window.removeEventListener('deviceorientation', this.onOrientationChange.bind(this));
  }

  @Listen('entry')
  onIntersect(ev: any) {
    this.isVisible = true;
  }

  @Listen('exit')
  onExit(ev: any) {
    this.isVisible = false;
  }

  @Listen('touchend')
  public onClick(ev) {
    if ( typeof( DeviceMotionEvent ) !== "undefined" && typeof( DeviceMotionEvent.requestPermission ) === "function" ) {
    DeviceOrientationEvent.requestPermission()
        .then(response => {
            if (response == 'granted') {
                window.addEventListener('deviceorientation', this.onOrientationChange.bind(this), true);
            }
        })
        .catch(console.error);
      } else if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', this.onOrientationChange.bind(this), true);
      }
  }

  onMouseMove(ev: MouseEvent) {
    if (this.isVisible) {
      const angle = this.scale(ev.pageX, 0, window.innerWidth, -5.00, 5.00);
      this.wrapper.style.transform = `rotate3d(0, 1, 0, ${angle}deg)`;
    }

  }

  onMouseOut(ev: MouseEvent) {
    this.wrapper.style.transform = `rotate3d(0, 1, 0, 0deg)`;
  }

  onOrientationChange(ev: any) {
    if (this.isVisible) {
      let angle = 0;
      if (window.matchMedia('(orientation: portrait)').matches) {
        angle = this.scale(ev.gamma, -50, 50, 50.00, -50.0);
      }
      if (window.matchMedia('(orientation: landscape)').matches) {
          angle = this.scale(ev.beta, -50, 50, 50.00, -50.0);
      }
      this.wrapper.style.transform = `rotate3d(0, 1, 0, ${angle}deg)`;
    }
  }

  scale(v: number, min: number, max: number, gmin: number, gmax: number) {
    return ((v - min) / (max - min)) * (gmax - gmin) + gmin;
  }



}

customElements.define('t-profile', ProfileComponent);

export { ProfileComponent };
