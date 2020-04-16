import { CustomElement, Component, Listen } from '@readymade/core';
import {
  animate,
  AnimationPlayer,
  slideInAnimation
} from './../../../../util/anim';
import { WebAnimation } from './../../../../util/anim/interface';
import style from './profile.scss';
import template from './profile.html';

declare global {
  interface Window {
    observer$: IntersectionObserver;
  }
}

@Component({
  selector: 't-profile',
  style: style,
  template: template
})
class ProfileComponent extends CustomElement {

  private wrapper!: HTMLElement;
  private isVisible: boolean | null = null;
  private animIn: AnimationPlayer[];
  private animations: { [key: string]: (options: any) => WebAnimation } = {
    slideIn: slideInAnimation
  };

  constructor() {
    super();
    this.animIn = [];
  }

  connectedCallback() {

    this.setAttribute('data-index', 'profile-0');
    if (this.shadowRoot && this.shadowRoot.querySelector) {
      const root = this.shadowRoot as ShadowRoot;
      Array.from(root.querySelectorAll('.title')).forEach((h1, index) => {
        const options = index === 0 ? 'left' : 'right';
        const anim = this.animations.slideIn(options);
        this.animIn[index] = animate(h1 as HTMLElement, anim);
        this.animIn[index].pause();
      });
 
      this.wrapper = root.querySelector('.profile__description') as HTMLElement;
      // window.addEventListener('mousemove', this.onMouseMove.bind(this));
      // window.addEventListener('mouseout', this.onMouseOut.bind(this));
      if (window && window.observer$) {
        window.observer$.observe(this);
      }
    }
    if (this.isVisible === null) {
      this.animIn.forEach((anim: AnimationPlayer, index: number) => {
        anim.play();
      });
    }
    this.isVisible = true;
  }

  disconnectedCallback() {
    window.removeEventListener('mousemove', this.onMouseMove.bind(this));
    window.removeEventListener('mouseout', this.onMouseOut.bind(this));
    window.removeEventListener('deviceorientation', this.onOrientationChange.bind(this));
  }

  @Listen('entry')
  onIntersect(ev: any) {

  }

  @Listen('exit')
  onExit(ev: any) {
    this.isVisible = false;
  }

  @Listen('touchend')
  public onClick(ev) {
    // if ( typeof( DeviceMotionEvent ) !== "undefined" && typeof( DeviceMotionEvent.requestPermission ) === "function" ) {
    // DeviceOrientationEvent.requestPermission()
    //     .then(response => {
    //         if (response == 'granted') {
    //             window.addEventListener('deviceorientation', this.onOrientationChange.bind(this), true);
    //         }
    //     })
    //     .catch(console.error);
    //   } else if (window.DeviceOrientationEvent) {
    //     window.addEventListener('deviceorientation', this.onOrientationChange.bind(this), true);
    //   }
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
