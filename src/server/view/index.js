/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function attachShadow(instance, options) {
    const shadowRoot = instance.attachShadow(options || {});
    const t = document.createElement('template');
    t.innerHTML = instance.template;
    shadowRoot.appendChild(t.content.cloneNode(true));
    instance.bindTemplate();
}
function bindTemplate() {
    if (this.bindState) {
        this.bindState();
    }
}
function setState(prop, model) {
    this.$state[prop] = model;
}
function compileTemplate(elementMeta, target) {
    if (!elementMeta.style) {
        elementMeta.style = '';
    }
    if (!elementMeta.template) {
        elementMeta.template = '';
    }
    target.prototype.elementMeta = Object.assign(target.elementMeta ? target.elementMeta : {}, elementMeta);
    target.prototype.elementMeta.eventMap = {};
    target.prototype.template = `<style>${elementMeta.style}</style>${elementMeta.template}`;
    target.prototype.bindTemplate = bindTemplate;
    target.prototype.setState = setState;
}
function Component(meta) {
    if (!meta) {
        console.error('Component must include ElementMeta to compile');
        return;
    }
    return (target) => {
        compileTemplate(meta, target);
        return target;
    };
}
class CustomElement extends HTMLElement {
    constructor() {
        super();
        attachShadow(this, { mode: 'open' });
        if (this.bindEmitters) {
            this.bindEmitters();
        }
        if (this.bindListeners) {
            this.bindListeners();
        }
        if (this.onInit) {
            this.onInit();
        }
    }
}

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css = ":host{position:absolute;display:block;transform-origin:50% 50%;width:100%;height:100%}";
styleInject(css);

var template = "<slot></slot>";

let CardComponent = class CardComponent extends CustomElement {
    constructor() {
        super();
        this.timeline = [
            { transform: 'translate3D(50%, 50%, -10000px)', opacity: '0' },
            { transform: 'translate3D(50%, 50%, 0px)', opacity: '1' }
        ];
        this.timing = {
            fill: 'forwards',
            easing: 'ease-out',
            duration: 4000
        };
    }
    connectedCallback() {
        if (this.animate) {
            const elem = this;
            const anim = elem.animate(this.timeline, this.timing);
            anim.play();
        }
    }
};
CardComponent = __decorate([
    Component({
        selector: 'v-card',
        style: css,
        template: template,
    }),
    __metadata("design:paramtypes", [])
], CardComponent);
customElements.define('v-card', CardComponent);

var css$1 = ":host{display:block;perspective:1000px;width:100vw;height:100vh}";
styleInject(css$1);

var template$1 = "<slot></slot>";

let StageComponent = class StageComponent extends CustomElement {
    constructor() {
        super();
    }
    connectedCallback() {
    }
};
StageComponent = __decorate([
    Component({
        selector: 'v-stage',
        style: css$1,
        template: template$1,
    }),
    __metadata("design:paramtypes", [])
], StageComponent);
customElements.define('v-stage', StageComponent);

var css$2 = ":host{display:block;width:100vw;height:100vh}v-portal{position:absolute;top:50%;left:50%;transform:translateX(-50%) translateY(-50%)}";
styleInject(css$2);

var template$2 = "<v-stage>\n    <v-card>\n        <div class=\"i--center\">\n            <h1>Hello World!</h1>\n        </div>\n    </v-card>\n</v-stage>";

let HomeComponent = class HomeComponent extends CustomElement {
    constructor() {
        super();
    }
};
HomeComponent = __decorate([
    Component({
        selector: 'home-view',
        style: css$2,
        template: template$2,
    }),
    __metadata("design:paramtypes", [])
], HomeComponent);
customElements.define('home-view', HomeComponent);

const routes = [
    { path: '/', component: HomeComponent }
];

export { CardComponent, StageComponent, routes };
