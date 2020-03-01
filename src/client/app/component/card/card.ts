import { CustomElement, Component } from '@readymade/core';

import { zoomAnimation, animate, AnimationPlayer } from './../../util/anim';

import style from './card.scss';
import template from './card.html';

@Component({
    selector: 'v-card',
    style: style,
    template: template,
})
class CardComponent extends CustomElement {

    private player: AnimationPlayer | undefined;

    constructor() {
        super();
    }

    connectedCallback() {
        if (this.animate) {
           this.player = animate(this, zoomAnimation);
           this.player.play();
        }
     }
}

customElements.define('v-card', CardComponent);

export { CardComponent };
