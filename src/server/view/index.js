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

class EventDispatcher {
    constructor(context, channelName) {
        this.target = context;
        this.channels = {
            default: new BroadcastChannel('default'),
        };
        if (channelName) {
            this.setChannel(channelName);
        }
        this.events = {};
    }
    get(eventName) {
        return this.events[eventName];
    }
    set(eventName, ev) {
        this.events[eventName] = ev;
        return this.get(eventName);
    }
    emit(ev) {
        if (typeof ev === 'string') {
            ev = this.events[ev];
        }
        this.target.dispatchEvent(ev);
    }
    broadcast(ev, name) {
        if (typeof ev === 'string') {
            ev = this.events[ev];
        }
        this.target.dispatchEvent(ev);
        const evt = {
            bubbles: ev.bubbles,
            cancelBubble: ev.cancelBubble,
            cancelable: ev.cancelable,
            defaultPrevented: ev.defaultPrevented,
            detail: ev.detail,
            timeStamp: ev.timeStamp,
            type: ev.type,
        };
        (name) ? this.channels[name].postMessage(evt) : this.channels.default.postMessage(evt);
    }
    setChannel(name) {
        this.channels[name] = new BroadcastChannel(name);
        this.channels[name].onmessage = (ev) => {
            for (const prop in this.target.elementMeta.eventMap) {
                if (prop.includes(name) && prop.includes(ev.data.type)) {
                    this.target[this.target.elementMeta.eventMap[prop].handler](ev.data);
                }
            }
        };
    }
    removeChannel(name) {
        this.channels[name].close();
        delete this.channels[name];
    }
}

function attachShadow(instance, options) {
    const shadowRoot = instance.attachShadow(options || {});
    const t = document.createElement('template');
    t.innerHTML = instance.template;
    shadowRoot.appendChild(t.content.cloneNode(true));
    instance.bindTemplate();
}

const TEMPLATE_BIND_REGEX = /\{\{(\s*)(.*?)(\s*)\}\}/g;
const BIND_SUFFIX = ' __state';
function templateId() {
    let str = '';
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    while (str.length < 3) {
        str += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
    return str;
}
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(24);
    });
}
class NodeTree {
    constructor(parentNode) {
        this.$flatMap = {};
        this.$parent = parentNode;
        this.$flatMap = {};
        this.$parentId = templateId();
        this.create();
    }
    setNode(node, key, value) {
        const id = this.$parentId + '-' + uuidv4().slice(0, 6);
        const clone = node.cloneNode(true);
        if (!node.setAttribute) {
            node.setAttribute = function (i, v) { };
        }
        node.setAttribute(id, '');
        if (!clone.setAttribute) {
            clone.setAttribute = function (i, v) { };
        }
        clone.setAttribute(id, '');
        if (!this.$flatMap[id]) {
            this.$flatMap[id] = {
                id,
                node: clone,
            };
            if (key && value) {
                this.updateNode(node, key, value);
            }
        }
    }
    updateNode(node, key, value) {
        if (this.getElementByAttribute(node).length === 0) {
            return;
        }
        const regex = new RegExp(`\{\{(\s*)(${key})(\s*)\}\}`, 'gi');
        const attrId = this.getElementByAttribute(node)[0].nodeName || this.getElementByAttribute(node)[0].name;
        const protoNode = this.$flatMap[attrId].node;
        let attr;
        for (const attribute of protoNode.attributes) {
            attr = attribute.nodeName || attribute.name;
            if (attr.includes('attr.') && !protoNode.getAttribute(attr.replace('attr.', ''))) {
                if (attribute.nodeName) {
                    attr = attribute.nodeName.replace('attr.', '');
                }
                else if (attribute.name) {
                    attr = attribute.name.replace('attr.', '');
                }
                if (!protoNode.setAttribute) {
                    protoNode.setAttribute = function (i, v) { };
                }
                protoNode.setAttribute(attr, attribute.nodeValue.replace(TEMPLATE_BIND_REGEX, ''));
                const remove = attribute.nodeName || attribute.name;
                node.removeAttribute(remove);
            }
            const attributeValue = attribute.nodeValue || attribute.value;
            if (attributeValue.match(regex, 'gi')) {
                if (!node.setAttribute) {
                    node.setAttribute = function (i, v) { };
                }
                node.setAttribute(attr, attributeValue.replace(regex, value));
            }
            const check = attribute.nodeName || attribute.name;
            if (check.includes('attr.')) {
                node.removeAttribute(check);
            }
        }
        if (protoNode.textContent.match(regex)) {
            node.textContent = protoNode.textContent.replace(regex, value);
        }
    }
    create() {
        const walk = document.createTreeWalker(this.$parent, NodeFilter.SHOW_ELEMENT, { acceptNode(node) { return NodeFilter.FILTER_ACCEPT; } }, false);
        while (walk.nextNode()) {
            this.setNode(walk.currentNode);
        }
    }
    getElementByAttribute(node) {
        if (!node.attributes) {
            return [];
        }
        return Array.from(node.attributes).filter((attr) => {
            return /[A-Za-z0-9]{3}-[A-Za-z0-9]{6}/gm.test(attr.nodeName || attr.name);
        });
    }
    update(key, value) {
        const walk = document.createTreeWalker(this.$parent, NodeFilter.SHOW_ELEMENT, { acceptNode(node) { return NodeFilter.FILTER_ACCEPT; } }, false);
        while (walk.nextNode()) {
            if (this.getElementByAttribute(walk.currentNode).length > 0) {
                this.updateNode(walk.currentNode, key, value);
            }
            else {
                this.setNode(walk.currentNode, key, value);
            }
        }
        return this.$parent;
    }
}
class BoundNode {
    constructor(parent) {
        this.$parent = parent;
        this.$tree = new NodeTree(this.$parent);
    }
    update(key, value) {
        this.$tree.update(key, value);
        if (this.$parent.onUpdate) {
            this.$parent.onUpdate();
        }
    }
}
class BoundHandler {
    constructor(obj) {
        this.$parent = obj;
    }
    set(target, key, value) {
        const change = {
            [key]: {
                previousValue: target[key],
                newValue: value,
            },
        };
        target[key] = value;
        this.$parent.$$state['node' + BIND_SUFFIX].update(key, target[key]);
        if (target.onStateChange) {
            target.onStateChange(change);
        }
        return true;
    }
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
function State(property) {
    return function decorator(target, key, descriptor) {
        function bindState() {
            this.$$state = this[key]();
            this.$$state['handler' + BIND_SUFFIX] = new BoundHandler(this);
            this.$$state['node' + BIND_SUFFIX] = new BoundNode(this.shadowRoot ? this.shadowRoot : this);
            this.$state = new Proxy(this, this.$$state['handler' + BIND_SUFFIX]);
            for (const prop in this.$$state) {
                if (this.$$state[prop] && !prop.includes('__state')) {
                    this.$state[prop] = this.$$state[prop];
                }
            }
        }
        target.bindState = function onBind() {
            bindState.call(this);
        };
    };
}
function Emitter(eventName, options, channelName) {
    return function decorator(target, key, descriptor) {
        const channel = channelName ? channelName : 'default';
        let prop = '';
        if (eventName) {
            prop = '$emit' + channel + eventName;
        }
        else {
            prop = '$emit' + channel;
        }
        function addEvent(name, chan) {
            if (!this.emitter) {
                this.emitter = new EventDispatcher(this, chan);
            }
            if (name) {
                this.emitter.set(name, new CustomEvent(name, options ? options : {}));
            }
            if (chan && !this.emitter.channels[chan]) {
                this.emitter.setChannel(chan);
            }
        }
        function bindEmitters() {
            for (const property in this) {
                if (property.includes('$emit')) {
                    this[property].call(this);
                }
            }
        }
        if (!target[prop]) {
            target[prop] = function () {
                addEvent.call(this, eventName, channelName);
            };
        }
        target.bindEmitters = function onEmitterInit() {
            bindEmitters.call(this);
        };
    };
}
function Listen(eventName, channelName) {
    return function decorator(target, key, descriptor) {
        const symbolHandler = Symbol(key);
        let prop = '';
        if (channelName) {
            prop = '$listen' + eventName + channelName;
        }
        else {
            prop = '$listen' + eventName;
        }
        function addListener(name, chan) {
            const handler = this[symbolHandler] = (...args) => {
                descriptor.value.apply(this, args);
            };
            if (!this.emitter) {
                this.emitter = new EventDispatcher(this, chan ? chan : null);
            }
            this.elementMeta.eventMap[prop] = {
                key: name,
                handler: key,
            };
            this.addEventListener(name, handler);
        }
        function removeListener() {
            this.removeEventListener(eventName, this[symbolHandler]);
        }
        function addListeners() {
            for (const property in this) {
                if (property.includes('$listen')) {
                    this[property].onListener.call(this);
                }
            }
        }
        if (!target[prop]) {
            target[prop] = {};
            target[prop].onListener = function onInitWrapper() {
                addListener.call(this, eventName, channelName);
            };
            target[prop].onDestroyListener = function onDestroyWrapper() {
                removeListener.call(this, eventName, channelName);
            };
        }
        target.bindListeners = function onListenerInit() {
            addListeners.call(this);
        };
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

var css_248z = ":host{display:block;position:relative;width:0;height:0%;perspective:1000px}";
styleInject(css_248z);

var template = "<slot></slot>\n";

let StageComponent = class StageComponent extends CustomElement {
    constructor() {
        super();
    }
    connectedCallback() { }
};
StageComponent = __decorate([
    Component({
        selector: 'v-stage',
        style: css_248z,
        template: template
    }),
    __metadata("design:paramtypes", [])
], StageComponent);
customElements.define('v-stage', StageComponent);

const zoomInAnimation = {
    keyframes: [
        {
            transform: 'translate3D(0%, 0%, -50px)',
            opacity: '0',
            zIndex: '-10'
        },
        { transform: 'translate3D(0%, 0%, 0px)', opacity: '1', zIndex: '0' }
    ],
    options: {
        fill: 'both',
        easing: 'ease-in',
        duration: 500
    }
};

const navInAnimation = {
    keyframes: [
        {
            transform: 'translateX(0%) translateY(0%)',
            width: '44px',
            top: '0%',
            right: '0%'
        },
        {
            transform: 'translateX(50%) translateY(-50%)',
            width: '44px',
            top: '50%',
            right: '50%'
        },
        {
            transform: 'translateX(50%) translateY(-50%)',
            width: '320px',
            top: '50%',
            right: '50%'
        },
        {
            transform: 'translateX(50%) translateY(-50%)',
            width: '320px',
            top: '50%',
            right: '50%'
        }
    ],
    options: {
        fill: 'forwards',
        easing: 'ease-in-out',
        duration: 700
    }
};
const navOutAnimation = {
    keyframes: [
        {
            transform: 'translateX(50%) translateY(-50%)',
            width: '320px',
            top: '50%',
            right: '50%'
        },
        {
            transform: 'translateX(50%) translateY(-50%)',
            width: '120px',
            top: '50%',
            right: '50%'
        },
        {
            transform: 'translateX(0%) translateY(0%)',
            width: '44px',
            top: '0%',
            right: '0%'
        },
        {
            transform: 'translateX(0%) translateY(0%)',
            width: '44px',
            top: '0%',
            right: '0%'
        }
    ],
    options: {
        fill: 'forwards',
        easing: 'ease-out',
        duration: 900
    }
};

const slideUpAnimation = {
    keyframes: [
        { transform: 'translate3D(50%, 52%, 0px)', opacity: '0' },
        { transform: 'translate3D(50%, 50%, 0px)', opacity: '1' }
    ],
    options: {
        fill: 'forwards',
        easing: 'ease-in',
        duration: 1000
    }
};

class AnimationPlayer {
    constructor(elem, animation) {
        this.elem = elem;
        this.animation = animation;
        if (this.elem.animate) {
            this.player = this.elem.animate(animation.keyframes, animation.options ? animation.options : {});
        }
        else {
            this.player = {
                cancel: () => { },
                play: () => { },
                pause: () => { },
                finish: () => { },
                reverse: () => { }
            };
        }
    }
    cancel() {
        this.player.cancel();
    }
    play() {
        this.player.play();
    }
    pause() {
        this.player.pause();
    }
    finish() {
        this.player.finish();
    }
    reverse() {
        this.player.reverse();
    }
}
function animate(elem, animation) {
    return new AnimationPlayer(elem, animation);
}

var css_248z$1 = "@keyframes containerIn{0%{width:44px;height:44px;border-radius:0 0 0 0;background:transparent}50%{width:100vw;height:100vh;border-radius:50% 0 50% 50%;background:#000}to{width:100vw;height:100vh;border-radius:0 0 0 0;background:#000}}@keyframes containerOut{0%{width:100vw;height:100vh;border-radius:0 0 0 0;background:#000}50%{width:100vw;height:100vh;border-radius:50% 0 50% 50%;background:#000}to{width:44px;height:44px;border-radius:0 0 0 0;background:transparent}}@keyframes linkIn{0%{font-size:1em;line-height:1em;color:transparent;transform:translateY(0) scaleY(.2)}15%{font-size:1em;line-height:1em;color:transparent;transform:translateY(0) scaleY(.2)}to{font-size:1.5em;line-height:1.5em;color:#d2d2d2;transform:translateY(0) scaleY(1)}}@keyframes linkOut{0%{font-size:1.5em;line-height:1.5em;color:#d2d2d2;transform:translateY(0) scaleY(1)}1%{font-size:0;line-height:1em;color:transparent;transform:translateY(0) scaleY(1)}15%{font-size:0;line-height:1em;color:transparent;transform:translateY(0) scaleY(.2)}to{font-size:1em;line-height:1em;color:transparent;transform:translateY(0) scaleY(.2)}}:host{display:block;padding:12px;z-index:1000}:host,:host .nav__container{position:fixed;top:0;right:0;width:44px;height:44px}:host .nav__container{border-radius:0 0 0 0;background:transparent;margin:12px}:host .nav__container .nav__wrapper{position:absolute;right:0;top:0;width:44px;height:44px}:host .nav__container .nav__wrapper .nav__button{width:44px;height:44px;box-sizing:border-box;cursor:pointer}:host .nav__container .nav__wrapper nav{position:absolute;display:block;top:0;right:0;width:44px;height:44px;transform:translateX(0) translateY(0);pointer-events:none;text-align:center}:host .nav__container .nav__wrapper nav a:link,:host .nav__container .nav__wrapper nav a:visited{text-transform:uppercase;text-decoration:none}:host .nav__container .nav__wrapper nav a{display:block;color:transparent;opacity:1;width:100%;font-size:1em;line-height:1em;transform:translateY(0) scaleY(.3);transition:.7s,opacity;margin-bottom:0}:host .nav__container .nav__wrapper nav a:nth-child(n+4){opacity:0}:host .nav__container .nav__wrapper nav a:before{position:absolute;content:\"\";top:0;left:0;width:100%;height:12px;background:var(--font-color);transition:.2s}:host .nav__container.is--init{animation:containerOut .4s;animation-fill-mode:both}:host .nav__container.is--open{background:#000;animation:containerIn .7s;animation-fill-mode:both;margin:0}:host .nav__container.is--open .nav__wrapper{width:100vw;height:100vh;opacity:1;pointer-events:auto;transform:translateX(0);margin:0}:host .nav__container.is--open .nav__wrapper .nav__button{position:fixed;top:0;right:0;margin:12px}:host .nav__container.is--open .nav__wrapper .nav__button:before{position:absolute;content:\"\";top:50%;left:50%;width:100%;height:2px;background:var(--font-color);transform:translateX(-50%) translateY(-50%) rotate(45deg);transition:.7s}:host .nav__container.is--open .nav__wrapper .nav__button:after{position:absolute;content:\"\";top:50%;left:50%;width:100%;height:2px;background:var(--font-color);transform:translateX(-50%) translateY(-50%) rotate(-45deg);transition:.7s}:host .nav__container.is--open .nav__wrapper nav{top:50%;right:50%;width:320px;height:auto;transform:translateX(50%) translateY(-50%);pointer-events:auto;border-top:3px solid var(--font-color);border-bottom:3px solid var(--font-color)}:host .nav__container.is--open .nav__wrapper nav a{background:transparent;animation:linkIn .7s;animation-fill-mode:both;transition:.7s,opacity;margin-bottom:20px}:host .nav__container.is--open .nav__wrapper nav a:nth-child(n+4){opacity:1}:host .nav__container.is--open .nav__wrapper nav a:before{height:0;opacity:0}:host .nav__container.is--open .nav__wrapper nav a:first-child{margin-top:20px}:host .nav__container.is--open.is--init a{animation:linkOut .5s;animation-fill-mode:both}";
styleInject(css_248z$1);

var template$1 = "<div class=\"nav__container\">\n\n    <div class=\"nav__wrapper\">\n        <nav>\n            <a href=\"/\">Home</a>\n            <a href=\"/blog\">Blog</a>\n            <a href=\"/resume\">Resume</a>\n            <a href=\"/gallery\">Gallery</a>\n        </nav>\n        <div class=\"nav__button\"></div>\n    </div>\n\n</div>";

let NavComponent = class NavComponent extends CustomElement {
    constructor() {
        super();
        this.animations = {
            navIn: navInAnimation,
            navOut: navOutAnimation
        };
        this.isActive = false;
    }
    connectedCallback() {
        if (!this.shadowRoot.querySelector)
            return;
        this.shadowRoot.querySelector('.nav__button').addEventListener('click', this.toggle.bind(this), false);
    }
    toggle() {
        if (!this.shadowRoot.querySelector)
            return;
        this.isActive = this.isActive ? false : true;
        this.navIn = animate(this.shadowRoot.querySelector('nav'), this.animations.navIn);
        this.navOut = animate(this.shadowRoot.querySelector('nav'), this.animations.navOut);
        if (!this.shadowRoot.querySelector('.nav__container').classList.contains('is--init')) {
            this.shadowRoot.querySelector('.nav__container').classList.add('is--init');
        }
        if (this.isActive) {
            this.style.width = '100vw';
            this.style.width = '100vh';
            this.navOut.cancel();
            this.navIn.play();
            this.shadowRoot.querySelector('.nav__container').classList.add('is--open');
        }
        else {
            this.style.width = '68px';
            this.style.width = '68px';
            this.navIn.cancel();
            this.navOut.play();
            this.shadowRoot.querySelector('.nav__container').classList.remove('is--open');
        }
    }
};
NavComponent = __decorate([
    Component({
        selector: 'v-nav',
        style: css_248z$1,
        template: template$1
    }),
    __metadata("design:paramtypes", [])
], NavComponent);
customElements.define('v-nav', NavComponent);

var css_248z$2 = ":host{display:block;opacity:0;border-radius:6px;border:1px solid var(--font-color);width:640px;height:480px;position:absolute;left:50%;top:50%;transform:translate3D(-50%,-50%,0);transform-origin:50% 50%;background-color:var(--body-color)}@media screen and (max-width:640px){:host{width:300px;height:320px;left:0}}";
styleInject(css_248z$2);

var template$2 = "<div class=\"v__card\">\n  <slot></slot>\n</div>\n";

let CardComponent = class CardComponent extends CustomElement {
    constructor() {
        super();
        this.multiplier = 1500;
        this.index = 0;
        this.direction = 'forwards';
        this.in = zoomInAnimation;
        this.animations = {
            zoomIn: zoomInAnimation,
            slideUp: slideUpAnimation
        };
        this.animIn = animate(this, this.in);
        this.currentIndex = 0;
    }
    static get observedAttributes() {
        return ['in', 'out', 'index'];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'in' && this.animations[newValue]) {
            this.in = this.animations[newValue];
            this.animIn = animate(this, this.in);
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
    onScroll(ev) {
        const payload = ev.detail;
        const index = Math.floor(payload.position / this.multiplier) * -1;
        if (index !== this.currentIndex) {
            this.currentIndex = index;
            if (this.index === index) {
                if (this.direction === 'backwards') {
                    this.direction = 'forwards';
                    this.animIn.reverse();
                }
                this.animIn.play();
            }
            else if (index === this.index + 1 || index === this.index - 1) {
                if (this.direction === 'forwards') {
                    this.direction = 'backwards';
                    this.animIn.reverse();
                }
                this.animIn.play();
            }
        }
    }
};
__decorate([
    Listen('update', 'scroll'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CustomEvent]),
    __metadata("design:returntype", void 0)
], CardComponent.prototype, "onScroll", null);
CardComponent = __decorate([
    Component({
        selector: 'v-card',
        style: css_248z$2,
        template: template$2
    }),
    __metadata("design:paramtypes", [])
], CardComponent);
customElements.define('v-card', CardComponent);

var css_248z$3 = ":host{display:block;width:100vw;height:100vh}";
styleInject(css_248z$3);

var template$3 = "<slot></slot>\n";

var SCROLL_DIRECTION;
(function (SCROLL_DIRECTION) {
    SCROLL_DIRECTION[SCROLL_DIRECTION["X"] = 0] = "X";
    SCROLL_DIRECTION[SCROLL_DIRECTION["Y"] = 1] = "Y";
})(SCROLL_DIRECTION || (SCROLL_DIRECTION = {}));
let ScrollSync = class ScrollSync extends CustomElement {
    constructor() {
        super();
        this.inProgress = false;
        this.options = {
            direction: 1,
            preventDefault: true,
            lineHeight: 16,
            scale: 1,
            velocitySampleLength: 10
        };
        this.payload = {
            delta: 0,
            position: 0,
            velocity: 0,
            slip: true,
            timestamp: Date.now(),
            clientX: 0,
            clientY: 0
        };
        if (this.options.direction !== undefined) {
            this.payload.position = 0;
            this.payload.velocity = 0;
            this.payload.delta = 0;
        }
        else {
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
            const scale = parseFloat(this.getAttribute('scale'));
            const options = {
                scale: scale
            };
            this.options = {
                ...this.options,
                ...options
            };
        }
    }
    handleTouchStart(event) {
        if (this.options.preventDefault)
            event.preventDefault();
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
        this.emitter.broadcast(new CustomEvent('update', {
            detail: this.payload
        }), 'scroll');
    }
    handleTouchMove(event) {
        if (this.options.preventDefault)
            event.preventDefault();
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
            }
            else {
                diffX = 0;
            }
            if (Math.abs(velDiffX) > Math.abs(velDiffY)) {
                velDiffY = 0;
            }
            else {
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
        }
        else if (this.options.direction === SCROLL_DIRECTION.Y) {
            nextDelta = scale * diffY;
            nextVel = scale * velY;
            this.position += nextDelta;
            if (this.position > 0) {
                this.position = 0;
            }
        }
        else {
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
        this.emitter.broadcast(new CustomEvent('update', {
            detail: this.payload
        }), 'scroll');
    }
    handleTouchEnd(event) {
        this.payload.type = 'end';
        this.emitter.broadcast(new CustomEvent('update', {
            detail: this.payload
        }), 'scroll');
    }
    handleWheel(event) {
        if (this.options.preventDefault)
            event.preventDefault();
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
            this.emitter.broadcast(new CustomEvent('update', {
                detail: this.payload
            }), 'scroll');
        }
        const MINIMUM_TICK_TIME = 8;
        const last = this.history[this.history.length - 1];
        let nextVel;
        let nextDelta;
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
            }
            else {
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
        }
        else if (this.options.direction === SCROLL_DIRECTION.Y) {
            nextDelta = scale * diffY;
            nextVel = scale * velY;
            this.position += nextDelta;
            if (this.position > 0) {
                this.position = 0;
            }
        }
        else {
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
        this.emitter.broadcast(new CustomEvent('update', {
            detail: this.payload
        }), 'scroll');
    }
};
__decorate([
    Listen('touchstart'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ScrollSync.prototype, "handleTouchStart", null);
__decorate([
    Emitter('update', {}, 'scroll'),
    Listen('touchmove'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ScrollSync.prototype, "handleTouchMove", null);
__decorate([
    Listen('touchend'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ScrollSync.prototype, "handleTouchEnd", null);
__decorate([
    Listen('wheel'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ScrollSync.prototype, "handleWheel", null);
ScrollSync = __decorate([
    Component({
        selector: 'v-scroll-sync',
        style: css_248z$3,
        template: template$3
    }),
    __metadata("design:paramtypes", [])
], ScrollSync);
customElements.define('v-scroll-sync', ScrollSync);

var css_248z$4 = ":host{display:block;position:relative;width:100vw;height:40000px}";
styleInject(css_248z$4);

var template$4 = "<slot></slot>\n";

let ScrollView = class ScrollView extends CustomElement {
    constructor() {
        super();
        this.transform = '';
        this.transform = `matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1.0)`;
    }
    connectedCallback() {
        this.style.transform = this.transform;
    }
    onScroll(ev) {
        const payload = ev.detail;
        this.transform = `matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,${payload.position},0,1.0)`;
        this.style.transform = this.transform;
    }
};
__decorate([
    Listen('update', 'scroll'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CustomEvent]),
    __metadata("design:returntype", void 0)
], ScrollView.prototype, "onScroll", null);
ScrollView = __decorate([
    Component({
        selector: 'v-scroll-view',
        style: css_248z$4,
        template: template$4
    }),
    __metadata("design:paramtypes", [])
], ScrollView);
customElements.define('v-scroll-view', ScrollView);

var css_248z$5 = ":host{position:relative;display:flex;width:100vw;perspective:1000px;z-index:0}";
styleInject(css_248z$5);

var template$5 = "<slot></slot>\n";

let SectionComponent = class SectionComponent extends CustomElement {
    constructor() {
        super();
    }
    connectedCallback() {
        if (window && window.observer$) {
            window.observer$.observe(this);
        }
    }
    onIntersect(ev) {
        console.log('bang!', ev.detail);
    }
};
__decorate([
    Listen('entry'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SectionComponent.prototype, "onIntersect", null);
SectionComponent = __decorate([
    Component({
        selector: 'v-section',
        style: css_248z$5,
        template: template$5
    }),
    __metadata("design:paramtypes", [])
], SectionComponent);
customElements.define('v-section', SectionComponent);

var css_248z$6 = ":host{position:relative;perspective:1000px;color:var(--font-color);left:50%;top:50%}:host .profile__avatar{display:none;position:absolute;top:0;right:0;width:320px;height:320px;background:var(--font-color)}:host .profile__avatar,:host .profile__avatar img{-webkit-clip-path:polygon(5% 0,100% 60%,20% 100%);clip-path:polygon(5% 0,100% 60%,20% 100%);box-sizing:border-box}:host .profile__avatar img{background:var(--body-color)}:host .profile{position:relative;opacity:0;transform:translateZ(-50px);display:flex;transition:transform 30ms ease-out;justify-content:flex-start;align-content:flex-end;perspective:1000px}:host .profile .profile__description h1{display:block;position:relative;font-family:var(--headline-font);font-size:74px;font-weight:900;transform:rotate3d(0,32px);-webkit-margin-before:0;margin-block-start:0;-webkit-margin-after:0;margin-block-end:0}:host .profile .profile__description p{display:block;position:relative;font-family:var(--body-font);font-size:28px;font-weight:400;transform:rotate(0,32px);-webkit-margin-before:.5em;margin-block-start:.5em;-webkit-margin-after:1em;margin-block-end:1em}@media (max-width:767px){:host{display:block;width:calc(100vw - 40px);left:0}:host .profile{height:640px;width:100%;justify-content:flex-start;align-content:flex-end}:host .profile .profile__avatar,:host .profile .profile__avatar img{width:280px;height:280px}:host .profile .profile__description{flex:1;align-self:flex-end;margin-left:10px;margin-right:10px;margin-bottom:60px}:host .profile .profile__description h1{font-size:48px}:host .profile .profile__description p{font-size:18px}}@media (min-width:768px) and (max-width:1023px){:host{transform:translateX(-50%);width:100%}:host .profile{height:720px;width:100%}:host .profile .profile__avatar{width:320px;height:320px;position:relative;left:50%;transform:translateX(-50%) translateY(-20px)}:host .profile .profile__avatar img{width:320px;height:320px}:host .profile .profile__description{flex:1;align-self:flex-end;margin-left:20px;margin-right:20px;margin-bottom:60px}:host .profile .profile__description h1{font-size:64px}:host .profile .profile__description p{font-size:24px}}@media (min-width:1024px) and (max-width:1359px){:host{left:50%;transform:translateX(-50%);width:100%}:host .profile{height:90vh;width:720px}:host .profile .profile__avatar{-ms-grid-row-align:center;align-self:center;width:320px;height:320px}:host .profile .profile__avatar img{width:320px;height:320px}:host .profile .profile__description{flex:1;align-self:flex-end;margin-left:40px;margin-bottom:60px}:host .profile .profile__description h1{font-size:64px}:host .profile .profile__description p{font-size:24px}}@media (min-width:1360px) and (max-width:1879px){:host{left:50%;transform:translateX(-50%);width:100%}:host .profile{height:90vh;width:720px}:host .profile .profile__avatar{-ms-grid-row-align:center;align-self:center;width:320px;height:320px}:host .profile .profile__avatar img{width:320px;height:320px}:host .profile .profile__description{flex:1;align-self:flex-end;margin-left:40px;margin-bottom:60px}}@media (min-width:1880px){:host{left:50%;transform:translateX(-50%);width:100%}:host .profile{height:90vh;width:720px}:host .profile .profile__avatar{-ms-grid-row-align:center;align-self:center;width:360px;height:360px}:host .profile .profile__avatar img{width:360px;height:360px}:host .profile .profile__description{flex:1;align-self:flex-end;margin-left:40px;margin-bottom:60px}}a:link,a:visited{color:var(--cta-color)}";
styleInject(css_248z$6);

var template$6 = "\n\n\n\n<div class=\"profile\">\n    <div class=\"profile__avatar\">\n\n    </div>\n    <div class=\"profile__description\">\n        <h1>Steve Belovarich</h1>\n        <p>Web Engineer &amp; Digital Artist in Portland, OR</p>\n    </div>\n    <div class=\"log\"></div>\n</div>";

let ProfileComponent = class ProfileComponent extends CustomElement {
    constructor() {
        super();
        this.isVisible = null;
        this.in = zoomInAnimation;
        this.animations = {
            zoomIn: zoomInAnimation
        };
        this.in = this.animations.zoomIn;
        this.animIn = animate(this, this.in);
    }
    connectedCallback() {
        this.setAttribute('data-index', 'profile-0');
        if (this.shadowRoot && this.shadowRoot.querySelector) {
            const root = this.shadowRoot;
            this.animIn = animate(root.querySelector('.profile'), this.in);
            this.animIn.pause();
            this.wrapper = root.querySelector('.profile__description');
            window.addEventListener('mousemove', this.onMouseMove.bind(this));
            window.addEventListener('mouseout', this.onMouseOut.bind(this));
            if (window && window.observer$) {
                window.observer$.observe(this);
            }
        }
        if (this.isVisible === null) {
            this.animIn.play();
        }
        this.isVisible = true;
    }
    disconnectedCallback() {
        window.removeEventListener('mousemove', this.onMouseMove.bind(this));
        window.removeEventListener('mouseout', this.onMouseOut.bind(this));
        window.removeEventListener('deviceorientation', this.onOrientationChange.bind(this));
    }
    onIntersect(ev) {
    }
    onExit(ev) {
        this.isVisible = false;
    }
    onClick(ev) {
        if (typeof (DeviceMotionEvent) !== "undefined" && typeof (DeviceMotionEvent.requestPermission) === "function") {
            DeviceOrientationEvent.requestPermission()
                .then(response => {
                if (response == 'granted') {
                    window.addEventListener('deviceorientation', this.onOrientationChange.bind(this), true);
                }
            })
                .catch(console.error);
        }
        else if (window.DeviceOrientationEvent) {
            window.addEventListener('deviceorientation', this.onOrientationChange.bind(this), true);
        }
    }
    onMouseMove(ev) {
        if (this.isVisible) {
            const angle = this.scale(ev.pageX, 0, window.innerWidth, -5.00, 5.00);
            this.wrapper.style.transform = `rotate3d(0, 1, 0, ${angle}deg)`;
        }
    }
    onMouseOut(ev) {
        this.wrapper.style.transform = `rotate3d(0, 1, 0, 0deg)`;
    }
    onOrientationChange(ev) {
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
    scale(v, min, max, gmin, gmax) {
        return ((v - min) / (max - min)) * (gmax - gmin) + gmin;
    }
};
__decorate([
    Listen('entry'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProfileComponent.prototype, "onIntersect", null);
__decorate([
    Listen('exit'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProfileComponent.prototype, "onExit", null);
__decorate([
    Listen('touchend'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProfileComponent.prototype, "onClick", null);
ProfileComponent = __decorate([
    Component({
        selector: 't-profile',
        style: css_248z$6,
        template: template$6
    }),
    __metadata("design:paramtypes", [])
], ProfileComponent);
customElements.define('t-profile', ProfileComponent);

var css_248z$7 = ":host{display:block;width:100%}:host .post__wrapper{width:100%;height:640px}:host .post__wrapper.is--light{color:var(--body-color)}:host .post__wrapper.is--light .post__background{background:var(--font-color)}:host .post__wrapper.is--dark{color:var(--font-color)}:host .post__wrapper.is--dark .post__background{background:var(--body-color)}:host .post__background{position:absolute;top:-40px;width:100%;height:100%}:host .post__content{position:absolute;top:50%;left:50%;transform:translateX(-50%) translateY(-50%)}:host .post__content h2{font-size:20px}:host .post__content p{font-size:16px}@media (max-width:767px){:host{margin-top:640px}}";
styleInject(css_248z$7);

var template$7 = "<div class=\"post__wrapper\">\n    <div class=\"post__background\"></div>\n    <div class=\"post__content\">\n        <slot></slot>\n    </div>\n</div>";

let PostComponent = class PostComponent extends CustomElement {
    constructor() {
        super();
    }
    static get observedAttributes() {
        return ['theme'];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (!this.shadowRoot.querySelector)
            return;
        if (name === 'theme') {
            this.shadowRoot.querySelector('.post__wrapper').classList.add(newValue);
        }
    }
};
PostComponent = __decorate([
    Component({
        selector: 't-post',
        style: css_248z$7,
        template: template$7
    }),
    __metadata("design:paramtypes", [])
], PostComponent);
customElements.define('t-post', PostComponent);

var css_248z$8 = ":host{display:block;width:100vw;height:100vh}:host p{font-size:1.4em}.i--center{position:absolute;top:50%;left:50%;transform:translateX(-50%) translateY(-50%);text-align:center}";
styleInject(css_248z$8);

var template$8 = "<v-nav></v-nav>\r\n<v-scroll-sync scale=\"{{scale}}\">\r\n  <v-stage>\r\n    <v-scroll-view>\r\n      <v-section data-index=\"1\">\r\n        <t-profile></t-profile>\r\n      </v-section>\r\n      <v-section data-index=\"2\">\r\n        <t-post theme=\"is--light\">\r\n          <h2>Hey there!</h2>\r\n          <p>I'm a fullstack JavaScript engineer who specializes in UI library architecture and design. I've made a career out of developing web apps for Nike, Lexus, NBCUniversal and Ubiquiti Networks. I'm currently employed at Workday in the role of Senior Software Development Engineer.</p>\r\n          <p>You may also find me exhibiting a variety of artwork from photography and print to interactive installations and video art. When I'm not teaching in the classroom I'm writing, speaking and mentoring others. I like to bicycle, digital detox with a hike in the mountains, attend meetups and indie rock shows. I'm a leader.</p>\r\n        </t-post>\r\n      </v-section>\r\n<!--  <v-section data-index=\"3\">3</v-section>\r\n      <v-section data-index=\"4\">4</v-section>\r\n      <v-section data-index=\"5\">5</v-section>\r\n      <v-section data-index=\"6\">6</v-section>\r\n      <v-section data-index=\"7\">7</v-section>\r\n      <v-section data-index=\"8\">8</v-section> -->\r\n    </v-scroll-view>\r\n  </v-stage>\r\n</v-scroll-sync>\r\n";

let HomeComponent = class HomeComponent extends CustomElement {
    constructor() {
        super();
    }
    getState() {
        return {
            scale: 1.0
        };
    }
};
__decorate([
    State(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HomeComponent.prototype, "getState", null);
HomeComponent = __decorate([
    Component({
        selector: 'home-view',
        style: css_248z$8,
        template: template$8
    }),
    __metadata("design:paramtypes", [])
], HomeComponent);
customElements.define('home-view', HomeComponent);

var css_248z$9 = ":host{display:block;width:100vw;height:100vh}:host p{font-size:1.4em}";
styleInject(css_248z$9);

var template$9 = "<v-nav></v-nav>\n<v-scroll-sync scale=\"{{scale}}\">\n  <v-stage>\n    <v-scroll-view>\n      <v-section data-index=\"1\">\n        <t-post theme=\"is--light\">\n          <h2>Headline</h2>\n          <p>I'm a fullstack JavaScript engineer who specializes in UI library architecture and design. I've made a career out of developing web apps for Nike, Lexus, NBCUniversal and Ubiquiti Networks. I'm currently employed at Workday in the role of Senior Software Development Engineer.</p>\n        </t-post>\n      </v-section>\n    </v-scroll-view>\n  </v-stage>\n</v-scroll-sync>\n";

let BlogComponent = class BlogComponent extends CustomElement {
    constructor() {
        super();
    }
    getState() {
        return {
            scale: 1.0
        };
    }
};
__decorate([
    State(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BlogComponent.prototype, "getState", null);
BlogComponent = __decorate([
    Component({
        selector: 'blog-view',
        style: css_248z$9,
        template: template$9
    }),
    __metadata("design:paramtypes", [])
], BlogComponent);
customElements.define('blog-view', BlogComponent);

var css_248z$a = ":host{display:block}";
styleInject(css_248z$a);

var template$a = "<v-nav></v-nav>\n<v-scroll-sync scale=\"{{scale}}\">\n    <v-stage>\n      <v-scroll-view>\n        <v-section data-index=\"1\">\n            <t-post theme=\"is--light\">\n              <h2>Resume</h2>\n            </t-post>\n          </v-section>\n      </v-scroll-view>\n     </v-stage>\n</v-scroll-sync>";

let ResumeComponent = class ResumeComponent extends CustomElement {
    constructor() {
        super();
    }
    getState() {
        return {
            scale: 1.0
        };
    }
};
__decorate([
    State(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ResumeComponent.prototype, "getState", null);
ResumeComponent = __decorate([
    Component({
        selector: 'resume-view',
        style: css_248z$a,
        template: template$a
    }),
    __metadata("design:paramtypes", [])
], ResumeComponent);
customElements.define('resume-view', ResumeComponent);

var css_248z$b = ":host{display:block}";
styleInject(css_248z$b);

var template$b = "<v-nav></v-nav>\n<v-scroll-sync scale=\"{{scale}}\">\n    <v-stage>\n      <v-scroll-view>\n        <v-section data-index=\"1\">\n            <t-post theme=\"is--light\">\n                <h2>Gallery</h2>\n            </t-post>\n          </v-section>\n      </v-scroll-view>\n     </v-stage>\n</v-scroll-sync>";

let GalleryComponent = class GalleryComponent extends CustomElement {
    constructor() {
        super();
    }
    getState() {
        return {
            scale: 1.0
        };
    }
};
__decorate([
    State(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GalleryComponent.prototype, "getState", null);
GalleryComponent = __decorate([
    Component({
        selector: 'gallery-view',
        style: css_248z$b,
        template: template$b
    }),
    __metadata("design:paramtypes", [])
], GalleryComponent);
customElements.define('gallery-view', GalleryComponent);

function BroadcastChannel$1(channel) { }
global['BroadcastChannel'] = BroadcastChannel$1;
global['observer$'] = {
    observe: () => { }
};
const routes = [{ path: '/', component: HomeComponent },
    { path: '/blog', component: BlogComponent },
    { path: '/resume', component: ResumeComponent },
    { path: '/gallery', component: GalleryComponent }];

export { BlogComponent, CardComponent, GalleryComponent, HomeComponent, NavComponent, PostComponent, ProfileComponent, ResumeComponent, ScrollSync, ScrollView, SectionComponent, StageComponent, routes };
