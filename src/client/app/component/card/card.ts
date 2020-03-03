import { CustomElement, Component, Listen } from '@readymade/core';

import { animate, AnimationPlayer, slideUpAnimation, zoomAnimation } from './../../util/anim';
import { WebAnimation } from 'app/util/anim/interface';

import style from './card.scss';
import template from './card.html';
import { ScrollPayload } from '../scroll/scroll';

@Component({
    selector: 'v-card',
    style: style,
    template: template,
})
class CardComponent extends CustomElement {

    private player: AnimationPlayer | undefined;
    private in: WebAnimation = zoomAnimation;
    private animations: {[key: string]: WebAnimation} = {
        'zoom': zoomAnimation,
        'slideUp': slideUpAnimation
    };

    constructor() {
        super();
    }

    static get observedAttributes() { return ['in']; }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'in' && this.animations[newValue]) {
            this.in = this.animations[newValue];
        }
    }

    connectedCallback() {
        if (this.animate && this.getAttribute('in')) {
           this.player = animate(this, this.in);
           this.player.play();
        }
     }

     @Listen('update', 'scroll')
     onScroll(ev: CustomEvent) {
         const payload = ev.detail as ScrollPayload;
         console.log(payload);
     }
}

customElements.define('v-card', CardComponent);

export { CardComponent };
