import { CustomElement, Component, Listen, Emitter } from '@readymade/core';

import style from './scroll.css?raw';
import template from './scroll.html?raw';

export interface ScrollOptions {
  direction: number;
  scale: number;
  lineHeight: number;
  preventDefault: boolean;
  minimumEndSpeed?: number;
  rails?: boolean;
  stallTime?: number;
  velocitySampleLength?: number;
}

export interface ScrollPayload {
  type?: string;
  delta: number | number[];
  position: number | number[];
  velocity: number | number[];
  slip: boolean;
  timestamp: number;
  clientX: number;
  clientY: number;
  offsetX?: number;
  offsetY?: number;
  direction?: number;
  count?: number;
  touch?: boolean;
}

export interface ScrollTouchEvent extends TouchEvent {
  pageX: number;
  pageY: number;
}

export interface ScrollWheelEvent extends WheelEvent {}

export enum SCROLL_DIRECTION {
  X = 0,
  Y = 1,
}

@Component({
  selector: 'v-scroll-sync',
  style: style,
  template: template,
})
class ScrollSync extends CustomElement {
  public options: ScrollOptions;
  private inProgress: boolean = false;
  private position: number | number[];
  private payload: ScrollPayload;
  private history: ScrollPayload[];
  private initialPayload: ScrollPayload;

  constructor() {
    super();
    this.options = {
      direction: 1,
      preventDefault: true,
      lineHeight: 16,
      scale: 1,
      velocitySampleLength: 10,
    };
    this.payload = {
      delta: 0,
      position: 0,
      velocity: 0,
      slip: true,
      timestamp: Date.now(),
      clientX: 0,
      clientY: 0,
    };

    if (this.options.direction !== undefined) {
      this.payload.position = 0;
      this.payload.velocity = 0;
      this.payload.delta = 0;
    } else {
      this.payload.position = [0, 0];
      this.payload.velocity = [0, 0];
      this.payload.delta = [0, 0];
    }

    this.position = 0;
    this.inProgress = false;
    this.history = [];
    this.initialPayload = this.payload;
    this.history.push(this.payload);
  }

  static get observedAttributes() {
    return ['scale'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'scale') {
      const scale = parseFloat(this.getAttribute('scale') as string);
      const options = {
        scale: scale,
      };
      this.options = {
        ...this.options,
        ...options,
      };
    }
  }

  @Listen('touchstart')
  private handleTouchStart(event: ScrollTouchEvent) {
    if (this.options.preventDefault) event.preventDefault();

    const last = this.history[this.history.length - 1];

    this.position = last.position;

    this.payload.delta = last.delta;
    this.payload.position = this.position;
    this.payload.velocity = last.velocity;
    this.payload.clientX = event.pageX;
    this.payload.clientY = event.pageY;
    this.payload.count = event.targetTouches.length;
    this.payload.touch = true;
    this.payload.timestamp = Date.now();
    this.initialPayload = this.payload;
    this.payload.type = 'start';
    this.history.push(this.payload);
    this.emitter.broadcast(
      new CustomEvent('update', {
        detail: this.payload,
      }),
      'scroll',
    );
  }

  @Emitter('update', {}, 'scroll')
  @Listen('touchmove')
  private handleTouchMove(event: ScrollTouchEvent) {
    if (this.options.preventDefault) event.preventDefault();

    const MINIMUM_TICK_TIME = 8;

    const last = this.history[this.history.length - 1];
    const first = this.initialPayload;

    let currTime = Date.now();

    let diffX = event.pageX - last.clientX;
    let diffY = event.pageY - last.clientY;

    let velDiffX = event.pageX - first.clientX;
    let velDiffY = event.pageY - first.clientY;

    if (this.options.rails) {
      if (Math.abs(diffX) > Math.abs(diffY)) {
        diffY = 0;
      } else {
        diffX = 0;
      }

      if (Math.abs(velDiffX) > Math.abs(velDiffY)) {
        velDiffY = 0;
      } else {
        velDiffX = 0;
      }
    }

    let diffTime = Math.max(currTime - last.timestamp, MINIMUM_TICK_TIME);

    let velX = velDiffX / diffTime;
    let velY = velDiffY / diffTime;

    let scale = this.options.scale;
    let nextVel;
    let nextDelta;

    if (this.options.direction === SCROLL_DIRECTION.X) {
      nextDelta = scale * diffX;
      nextVel = scale * velX;
      this.position += nextDelta;
      if (this.position > 0) {
        this.position = 0;
      }
    } else if (this.options.direction === SCROLL_DIRECTION.Y) {
      nextDelta = scale * diffY;
      nextVel = scale * velY;
      this.position += nextDelta;
      if (this.position > 0) {
        this.position = 0;
      }
    } else {
      nextDelta = [scale * diffX, scale * diffY];
      nextVel = [scale * velX, scale * velY];
      this.position[0] += nextDelta[0];
      this.position[1] += nextDelta[1];
      if (this.position[0] > 0) {
        this.position[0] = 0;
      }
      if (this.position[1] > 0) {
        this.position[1] = 0;
      }
    }

    this.payload.delta = nextDelta;
    this.payload.velocity = nextVel;
    this.payload.position = this.position;
    this.payload.clientX = event.pageX;
    this.payload.clientY = event.pageY;
    this.payload.timestamp = Date.now();
    this.payload.type = 'update';
    this.history.push(this.payload);
    this.emitter.broadcast(
      new CustomEvent('update', {
        detail: this.payload,
      }),
      'scroll',
    );
  }

  @Listen('touchend')
  private handleTouchEnd(event: ScrollTouchEvent) {
    this.payload.type = 'end';
    this.emitter.broadcast(
      new CustomEvent('update', {
        detail: this.payload,
      }),
      'scroll',
    );
  }

  @Listen('wheel')
  private handleWheel(event: ScrollWheelEvent) {
    if (this.options.preventDefault) event.preventDefault();
    if (!this.inProgress) {
      this.inProgress = true;
      this.position = this.options.direction === undefined ? [0, 0] : 0;
      this.payload.slip = true;
      this.payload.position = this.position;
      this.payload.clientX = event.clientX;
      this.payload.clientY = event.clientY;
      this.payload.offsetX = event.offsetX;
      this.payload.offsetY = event.offsetY;
      this.payload.timestamp = Date.now();
      this.payload.type = 'start';
      this.emitter.broadcast(
        new CustomEvent('update', {
          detail: this.payload,
        }),
        'scroll',
      );
    }

    const MINIMUM_TICK_TIME = 8;
    const last = this.history[this.history.length - 1];

    let nextVel: any;
    let nextDelta: any;
    let currTime = Date.now();
    let prevTime = last.timestamp;

    let diffX = -event.deltaX;
    let diffY = -event.deltaY;

    if (event.deltaMode === 1) {
      diffX *= this.options.lineHeight;
      diffY *= this.options.lineHeight;
    }

    if (this.options.rails) {
      if (Math.abs(diffX) > Math.abs(diffY)) {
        diffY = 0;
      } else {
        diffX = 0;
      }
    }

    let diffTime = Math.max(currTime - prevTime, MINIMUM_TICK_TIME); // minimum tick time

    let velX = diffX / diffTime;
    let velY = diffY / diffTime;

    let scale = this.options.scale;

    if (this.options.direction === SCROLL_DIRECTION.X) {
      nextDelta = scale * diffX;
      nextVel = scale * velX;
      this.position += nextDelta;
      if (this.position > 0) {
        this.position = 0;
      }
    } else if (this.options.direction === SCROLL_DIRECTION.Y) {
      nextDelta = scale * diffY;
      nextVel = scale * velY;
      this.position += nextDelta;
      if (this.position > 0) {
        this.position = 0;
      }
    } else {
      nextDelta = [scale * diffX, scale * diffY];
      nextVel = [scale * velX, scale * velY];
      this.position[0] += nextDelta[0];
      this.position[1] += nextDelta[1];
      if (this.position[0] > 0) {
        this.position[0] = 0;
      }
      if (this.position[1] > 0) {
        this.position[1] = 0;
      }
    }

    this.payload.delta = nextDelta;
    this.payload.velocity = nextVel;
    this.payload.position = this.position;
    this.payload.timestamp = Date.now();
    this.payload.slip = true;
    this.payload.type = 'update';
    this.history.push(this.payload);
    this.emitter.broadcast(
      new CustomEvent('update', {
        detail: this.payload,
      }),
      'scroll',
    );
  }
}

// customElements.define('v-scroll-sync', ScrollSync);

export { ScrollSync };
