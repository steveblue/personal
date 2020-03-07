import { CustomElement, Component, Listen } from '@readymade/core';

import style from './section.scss';
import template from './section.html';

declare var observer$: IntersectionObserver;

@Component({
    selector: 'v-section',
    style: style,
    template: template,
})
class SectionComponent extends CustomElement {

    private hasInit: boolean = false;

    constructor() {
        super();
    }

    connectedCallback() {
        if (observer$) {
            observer$.observe(this);
        }
    }

    @Listen('entry', 'main')
    onIntersect(ev: any) {
        if (ev.index === this.getAttribute('data-index')) {
            console.log(ev, ev.index, this.getAttribute('data-index'));
        }
    }

}

customElements.define('v-section', SectionComponent);

export { SectionComponent };
