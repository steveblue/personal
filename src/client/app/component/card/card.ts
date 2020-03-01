import { CustomElement, Component } from '@readymade/core';

import style from './card.scss';
import template from './card.html';

@Component({
    selector: 'v-card',
    style: style,
    template: template,
})
class CardComponent extends CustomElement {

    private timeline: any = [
        { transform: 'translate3D(50%, 50%, -100px)', opacity: '0'},
        { transform: 'translate3D(50%, 50%, 0px)', opacity: '1' }
    ];

    private timing: any = {
        fill: 'forwards',
        easing: 'ease-in',
        duration: 1000
    };

    constructor() {
        super();
    }

    connectedCallback() {
        if (this.animate) {
            const elem = this as HTMLElement;
            const anim = elem.animate(
                this.timeline,
                this.timing
            );
            anim.play();
        }
     }
}

customElements.define('v-card', CardComponent);

export { CardComponent };
