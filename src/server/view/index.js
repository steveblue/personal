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

var css_248z = ":host{display:block;position:relative;perspective:1000px}";
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

var css_248z$1 = "@keyframes containerIn{0%{width:44px;height:44px;border-radius:0 0 0 0;background:transparent}50%{width:100vw;height:100vh;border-radius:50% 0 50% 50%;background:#000}to{width:100vw;height:100vh;border-radius:0 0 0 0;background:#000}}@keyframes containerOut{0%{width:100vw;height:100vh;border-radius:0 0 0 0;background:#000}50%{width:100vw;height:100vh;border-radius:50% 0 50% 50%;background:#000}to{width:44px;height:44px;border-radius:0 0 0 0;background:transparent}}@keyframes linkIn{0%{font-size:1em;line-height:1em;color:transparent;transform:translateY(0) scaleY(.2)}15%{font-size:1em;line-height:1em;color:transparent;transform:translateY(0) scaleY(.2)}to{font-size:1.5em;line-height:1.5em;color:#d2d2d2;transform:translateY(0) scaleY(1)}}@keyframes linkOut{0%{font-size:1.5em;line-height:1.5em;color:#d2d2d2;transform:translateY(0) scaleY(1)}1%{font-size:0;line-height:1em;color:transparent;transform:translateY(0) scaleY(1)}15%{font-size:0;line-height:1em;color:transparent;transform:translateY(0) scaleY(.2)}to{font-size:1em;line-height:1em;color:transparent;transform:translateY(0) scaleY(.2)}}:host{display:block;padding:12px;z-index:1000}:host,:host .nav__container{position:fixed;top:0;right:0;width:44px;height:44px}:host .nav__container{border-radius:0 0 0 0;background:transparent;margin:12px}:host .nav__container .nav__wrapper{position:absolute;right:0;top:0;width:44px;height:44px}:host .nav__container .nav__wrapper .nav__button{width:44px;height:44px;box-sizing:border-box;cursor:pointer}:host .nav__container .nav__wrapper nav{position:absolute;display:block;top:0;right:0;width:44px;height:44px;transform:translateX(0) translateY(0);pointer-events:none;text-align:center}:host .nav__container .nav__wrapper nav ul{list-style-type:none;-webkit-margin-before:0;margin-block-start:0;-webkit-margin-after:0;margin-block-end:0;-webkit-margin-start:0;margin-inline-start:0;-webkit-margin-end:0;margin-inline-end:0;-webkit-padding-start:0;padding-inline-start:0}:host .nav__container .nav__wrapper nav ul li{opacity:1;transform:translateY(0) scaleY(.3);transition:.7s,opacity;margin-bottom:0}:host .nav__container .nav__wrapper nav ul li:nth-child(n+4){opacity:0}:host .nav__container .nav__wrapper nav ul li:before{position:absolute;content:\"\";top:0;left:0;width:100%;height:12px;background:var(--font-color);transition:.2s}:host .nav__container .nav__wrapper nav ul li span{opacity:0}:host .nav__container .nav__wrapper nav a:link,:host .nav__container .nav__wrapper nav a:visited{text-transform:uppercase;text-decoration:none}:host .nav__container .nav__wrapper nav a{display:inline-block;color:transparent;font-size:1em;line-height:1em}:host .nav__container .nav__wrapper nav a+span+a,:host .nav__container .nav__wrapper nav span{display:none}:host .nav__container.is--init{animation:containerOut .4s;animation-fill-mode:both}:host .nav__container.is--open{background:#000;animation:containerIn .7s;animation-fill-mode:both;margin:0}:host .nav__container.is--open .nav__wrapper{width:100vw;height:100vh;opacity:1;pointer-events:auto;transform:translateX(0);margin:0}:host .nav__container.is--open .nav__wrapper .nav__button{position:fixed;top:0;right:0;margin:12px}:host .nav__container.is--open .nav__wrapper .nav__button:before{position:absolute;content:\"\";top:50%;left:50%;width:100%;height:2px;background:var(--font-color);transform:translateX(-50%) translateY(-50%) rotate(45deg);transition:.7s}:host .nav__container.is--open .nav__wrapper .nav__button:after{position:absolute;content:\"\";top:50%;left:50%;width:100%;height:2px;background:var(--font-color);transform:translateX(-50%) translateY(-50%) rotate(-45deg);transition:.7s}:host .nav__container.is--open .nav__wrapper nav{top:50%;right:50%;width:320px;height:auto;transform:translateX(50%) translateY(-50%);pointer-events:auto;border-top:3px solid var(--font-color);border-bottom:3px solid var(--font-color)}:host .nav__container.is--open .nav__wrapper nav ul li{background:transparent;animation:linkIn .7s;animation-fill-mode:both;transition:.7s,opacity;margin-bottom:20px}:host .nav__container.is--open .nav__wrapper nav ul li:nth-child(n+4){opacity:1}:host .nav__container.is--open .nav__wrapper nav ul li:before{height:0;opacity:0}:host .nav__container.is--open .nav__wrapper nav ul li:first-child{margin-top:20px}:host .nav__container.is--open .nav__wrapper nav ul li span{display:inline-block;opacity:1}:host .nav__container.is--open .nav__wrapper nav ul li a{color:#fff}:host .nav__container.is--open .nav__wrapper nav ul li a+span+a{display:inline-block}:host .nav__container.is--open.is--init li{animation:linkOut .5s;animation-fill-mode:both}";
styleInject(css_248z$1);

var template$1 = "<div class=\"nav__container\">\n\n    <div class=\"nav__wrapper\">\n        <nav>\n            <ul>\n                <li><a href=\"/\">Home</a></li>\n                <li><a href=\"/blog\">Blog</a></li>\n                <li><a href=\"/resume\">Resume</a> <span>/</span> <a href=\"/cv\">CV</a></li>\n                <!-- <li><a href=\"/gallery\">Gallery</a></li> -->\n            </ul>\n        </nav>\n        <div class=\"nav__button\"></div>\n    </div>\n\n</div>";

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

var css_248z$4 = ":host{display:flex;flex-direction:column;position:relative;width:100vw;height:auto}";
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

var template$6 = "\n\n\n\n<div class=\"profile\">\n    <div class=\"profile__avatar\">\n\n    </div>\n    <div class=\"profile__description\">\n        <h1>Hi! I'm Steve 👋</h1>\n        <p>I code, make art, teach, and write.</p>\n    </div>\n    <div class=\"log\"></div>\n</div>";

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

var css_248z$7 = ":host{display:block;width:100%}:host:after{content:\"\";display:table;clear:both}:host .post__wrapper{width:100%;height:100%}:host .post__wrapper.is--light{color:var(--body-color);background:var(--font-color)}:host .post__wrapper.is--light .post__background{background:var(--font-color)}:host .post__wrapper.is--dark{color:var(--font-color);background:var(--body-color)}:host .post__wrapper.is--dark .post__background{background:var(--body-color)}:host .post__content h2{font-size:20px;-webkit-margin-before:0;margin-block-start:0}:host .post__content p{font-size:16px}@media (max-width:767px){:host{margin-top:640px}}";
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

var css_248z$8 = ":host{display:block;width:100%}:host .post__wrapper{width:100%;height:640px}:host .post__wrapper.is--light{color:var(--body-color)}:host .post__wrapper.is--light .post__background{background:var(--font-color)}:host .post__wrapper.is--dark{color:var(--font-color)}:host .post__wrapper.is--dark .post__background{background:var(--body-color)}:host .post__background{position:absolute;width:100%;height:100%}:host .post__content{position:absolute;top:50%;left:50%;transform:translateX(-50%) translateY(-50%)}:host .post__content h2{font-size:20px}:host .post__content p{font-size:16px}@media (max-width:767px){:host{margin-top:640px}}";
styleInject(css_248z$8);

var template$8 = "<div class=\"post__wrapper\">\n    <div class=\"post__background\"></div>\n    <div class=\"post__content\">\n        <slot></slot>\n    </div>\n</div>";

let MarketingComponent = class MarketingComponent extends CustomElement {
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
MarketingComponent = __decorate([
    Component({
        selector: 't-market',
        style: css_248z$8,
        template: template$8
    }),
    __metadata("design:paramtypes", [])
], MarketingComponent);
customElements.define('t-market', MarketingComponent);

var css_248z$9 = ":host{display:block;width:100vw;height:100vh;overflow-y:scroll}:host p{font-size:1.4em}.i--center{position:absolute;top:50%;left:50%;transform:translateX(-50%) translateY(-50%);text-align:center}";
styleInject(css_248z$9);

var template$9 = "<v-nav></v-nav>\r\n\r\n  <v-stage>\r\n\r\n      <v-section data-index=\"1\">\r\n        <t-profile></t-profile>\r\n      </v-section>\r\n      <v-section data-index=\"2\">\r\n        <t-market theme=\"is--light\">\r\n          <h2>Engineer By Trade, Artist At Heart</h2>\r\n          <p>I'm a fourth generation engineer. Even when I'm making art, I find myself solving problems with technological solutions. In my current role at Workday, I'm a senior software development engineer. I help maintain the UI platform. <a href=\"/resume\">View my resume</a>.</p>\r\n        </t-market>\r\n      </v-section>\r\n      <v-section data-index=\"3\">\r\n        <t-market theme=\"is--dark\">\r\n          <h2>Livin' In The Pacific Northwest</h2>\r\n          <p>I live in Portland, OR with my significant other Susanne. We travel around the Pacific Northwest, soaking up the lush environments. I take photographs documenting our adventures. <a href=\"https://500px.com/stevebelovarich\" target=\"_blank\">View my photography on 500px</a>.</p>\r\n        </t-market>\r\n      </v-section>\r\n      <v-section data-index=\"4\">\r\n        <t-market theme=\"is--light\">\r\n          <h2>I Code, Therefore I Am</h2>\r\n          <p>You'll usually find me coding user interfaces in a web browser. I love architecting UI libraries and experimenting with web standards. This site was made entirely with custom elements. I followed a \"no framework\" approach. I challenged myself to make this interation of my personal site performant yet design forward. In what seems like a past life I was a web designer. <a href=\"/resume\">View my resume</a>.</p>\r\n        </t-market>\r\n      </v-section>\r\n      <v-section data-index=\"5\">\r\n        <t-market theme=\"is--dark\">\r\n          <h2>Photography Is My Jam</h2>\r\n          <p>I'm working on a series of photographs about the American Dream. It's taken over a decade to collect the images I want to portray the decaying ideal of the dream in America. <a href=\"https://500px.com/stevebelovarich/galleries/american_dream_photo_essay\" target=\"_blank\">View candidates for this exhibition on 500px</a>.</p>\r\n         </t-market>\r\n      </v-section>\r\n      <v-section data-index=\"6\">\r\n        <t-market theme=\"is--light\">\r\n          <h2>Teaching Is A Way Of Life</h2>\r\n          <p>I love learning new things and helping others unlock thier potential. I taught part-time at General Assembly where I helped architect the curricula for a course about JavaScript. I'm currently looking for a part-time faculty position in higher education focusing either on web development or digital art. <a href=\"/cv\">View my curriculum vitae</a></p>\r\n        </t-market>\r\n      </v-section>\r\n      <v-section data-index=\"7\">\r\n        <t-market theme=\"is--dark\">\r\n          <h2>I Write About Web Development</h2>\r\n          <p><a href=\"https://dev.to/steveblue\" target=\"_blank\">I write about web development on dev.to</a>. This year I'm focused on writing a technical book about front end web development.</p>\r\n        </t-market>\r\n      </v-section>\r\n      <v-section data-index=\"8\">\r\n        <t-market theme=\"is--light\">\r\n          <h2>I'm Steve</h2>\r\n          <p>You can <a href=\"https://twitter.com/iplayitofflegit\" target=\"_blank\">find me on Twitter</a>.</p>\r\n        </t-market>\r\n      </v-section>\r\n\r\n  </v-stage>\r\n\r\n";

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
        style: css_248z$9,
        template: template$9
    }),
    __metadata("design:paramtypes", [])
], HomeComponent);
customElements.define('home-view', HomeComponent);

var css_248z$a = ":host{display:block;width:100vw;height:100vh;overflow-y:scroll}:host p{font-size:1.4em}";
styleInject(css_248z$a);

var template$a = "<v-nav></v-nav>\n<v-stage>\n\n</v-stage>";

let BlogComponent = class BlogComponent extends CustomElement {
    constructor() {
        super();
    }
    getState() {
        return {
            scale: 1.0
        };
    }
    connectedCallback() {
        if (!fetch)
            return;
        fetch('http://localhost:4444/api/blog')
            .then((data) => {
            return data.json();
        })
            .then((json) => {
            this.displayPosts(json);
        })
            .catch((error) => console.error(error));
    }
    displayPosts(data) {
        if (!this.shadowRoot || !this.shadowRoot.querySelector)
            return;
        if (data && data.length) {
            const wrapper = this.shadowRoot.querySelector('v-stage');
            data.forEach((article, index) => {
                const section = document.createElement('v-section');
                const post = document.createElement('t-post');
                const postWrapper = document.createElement('div');
                const h2 = document.createElement('h2');
                const p = document.createElement('p');
                section.setAttribute('data-index', (index + 1).toString());
                post.setAttribute('theme', 'is--light');
                h2.innerText = article.title;
                p.innerText = article.description;
                postWrapper.appendChild(h2);
                postWrapper.appendChild(p);
                postWrapper.style.overflow = 'hidden';
                post.appendChild(postWrapper);
                section.appendChild(post);
                wrapper.appendChild(section);
            });
        }
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
        style: css_248z$a,
        template: template$a
    }),
    __metadata("design:paramtypes", [])
], BlogComponent);
customElements.define('blog-view', BlogComponent);

var css_248z$b = ":host{display:block;width:100vw;height:100vh;overflow-y:scroll}:host .resume__wrapper{overflow:hidden}";
styleInject(css_248z$b);

var template$b = "<v-nav></v-nav>\n\n<v-stage>\n    <v-section data-index=\"1\">\n        <t-post theme=\"is--light\">\n          <div class=\"resume__wrapper\">\n          <h1>Steve Belovarich's Resume</h1>\n          <section>\n            <h2>Profile</h2>\n            <p>Software engineer with strong experience in full stack web development. I want to help a team achieve greatness by architecting solutions and mentoring others.</p>\n          </section>\n          <section>\n            <h2>Experience</h2>\n            <div class=\"job\">\n              <div class=\"icon\"><img src=\"\" alt=\"\" /></div>\n              <div class=\"description\">\n                <header>\n                  <h3>Senior Front End Engineer at NBCUniversal</h3>\n                  <p>Current</p>\n                </header>\n                <p>Develop application used internally to apply metadata to media distributed on streaming platforms. Mentor other engineers on development team, code and architect Angular app.</p>\n              </div>\n            </div>\n            <div class=\"job\">\n              <div class=\"icon\"><img src=\"\" alt=\"\" /></div>\n              <div class=\"description\">\n                <header>\n                  <h3>Lead Angular Node Engineer at Nike</h3>\n                  <p>2018-2019</p>\n                </header>\n                <p>Developed internal application used for product line planning. Led development team, actively coded, maintained CI servers and managed deployments in contract position.</p>\n              </div>\n            </div>\n            <div class=\"job\">\n              <div class=\"icon\"><img src=\"\" alt=\"\" /></div>\n              <div class=\"description\">\n                <header>\n                  <h3>Manager UI (Principal Software Engineer) at Symantec</h3>\n                  <p>2016-2018</p>\n                </header>\n                <p>Oversaw the architecture and development of Angular UI component libraries for consumer and enterprise. Rapidly prototyped new product ideas for Symantec web applications.</p>\n              </div>\n            </div>\n            <div class=\"job\">\n              <div class=\"icon\"><img src=\"\" alt=\"\" /></div>\n              <div class=\"description\">\n                <header>\n                  <h3>Software Developer at Ubiquiti Networks</h3>\n                  <p>2015-2016</p>\n                </header>\n                <p>Built web application with AngularJS for UI on ARM based video devices. Rapidly prototyped NodeJS backend to replace the existing Java implementation for the hardware controller.</p>\n              </div>\n            </div>\n            <div class=\"job\">\n              <div class=\"icon\"><img src=\"\" alt=\"\" /></div>\n              <div class=\"description\">\n                <header>\n                  <h3>Front End Web Development Instructor at General Assembly</h3>\n                  <p>2015-2016</p>\n                </header>\n                <p>Taught industry professionals how to code. Developed curriculum for the Front End Web Development part-time course focused on JavaScript, CSS, HTML and web fundamentals.</p>\n              </div>\n            </div>\n            <div class=\"job\">\n              <div class=\"icon\"><img src=\"\" alt=\"\" /></div>\n              <div class=\"description\">\n                <header>\n                  <h3>Lead Web Application Engineer at Mediahound</h3>\n                  <p>2014-2015</p>\n                </header>\n                <p>Managed front end engineering team that built UI for social network with AngularJS. Teamed up with leads to architect APIs and sustainable development practices for the start up.</p>\n              </div>\n            </div>\n            <div class=\"job\">\n              <div class=\"icon\"><img src=\"\" alt=\"\" /></div>\n              <div class=\"description\">\n                <header>\n                  <h3>Senior Front End Developer at Team One</h3>\n                  <p>2012-2014</p>\n                </header>\n                <p>Developed landing pages for Lexus and 2K Games. Worked closely with designers to proto- type UI for client pitches. Executed production of interactive experiences on lexus.com.</p>\n              </div>\n            </div>\n            <div class=\"job\">\n              <div class=\"icon\"><img src=\"\" alt=\"\" /></div>\n              <div class=\"description\">\n                <header>\n                  <h3>Freelance Developer and Digital Artist</h3>\n                  <p>2004-2012</p>\n                </header>\n                <p>Provided end to end creative and engineering solutions for clients. Developed and designed web sites, installations and prototypes with anything that got the job done including Adobe CS, Max/MSP, Final Cut Pro, Arduino, Raspberry Pi, JavaScript, HTML, CSS, Java, C++, cus- tom electronics, sensors, motors, and video devices.</p>\n              </div>\n            </div>\n            <div class=\"job\">\n              <div class=\"icon\"><img src=\"\" alt=\"\" /></div>\n              <div class=\"description\">\n                <header>\n                  <h3>MFA Computer Art at Syracuse University</h3>\n                  <p>2007-2010</p>\n                </header>\n              </div>\n            </div>\n            <div class=\"job\">\n              <div class=\"icon\"><img src=\"\" alt=\"\" /></div>\n              <div class=\"description\">\n                <header>\n                  <h3>BS Electronic Arts at Rensselaer Polytechnic Institute</h3>\n                  <p>2000-2004</p>\n                </header>\n              </div>\n            </div>\n          </section>\n          </div>\n        </t-post>\n      </v-section>\n  </v-stage>\n";

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
        style: css_248z$b,
        template: template$b
    }),
    __metadata("design:paramtypes", [])
], ResumeComponent);
customElements.define('resume-view', ResumeComponent);

var template$c = "<v-nav></v-nav>\n\n    <v-stage>\n\n        <v-section data-index=\"1\">\n            <t-post theme=\"is--light\">\n              <div class=\"resume__wrapper\">\n              <h1>Steve Belovarich's Curriculum Vitae</h1>\n              <section>\n                <h2>Profile</h2>\n                <p>Digital artist and software engineer with strong experience in web design and full stack web development. I want to help others achieve their dreams of being a creative professional.</p>\n              </section>\n              <section>\n                <h2>Experience</h2>\n                <div class=\"job\">\n                  <div class=\"icon\"><img src=\"\" alt=\"\" /></div>\n                  <div class=\"description\">\n                    <header>\n                      <h3>Senior Front End Engineer at NBCUniversal</h3>\n                      <p>Current</p>\n                    </header>\n                    <p>Develop application used internally to apply metadata to media distributed on streaming platforms. Mentor other engineers on development team, code and architect Angular app.</p>\n                  </div>\n                </div>\n                <div class=\"job\">\n                  <div class=\"icon\"><img src=\"\" alt=\"\" /></div>\n                  <div class=\"description\">\n                    <header>\n                      <h3>Lead Angular Node Engineer at Nike</h3>\n                      <p>2018-2019</p>\n                    </header>\n                    <p>Developed internal application used for product line planning. Led development team, actively coded, maintained CI servers and managed deployments in contract position.</p>\n                  </div>\n                </div>\n                <div class=\"job\">\n                  <div class=\"icon\"><img src=\"\" alt=\"\" /></div>\n                  <div class=\"description\">\n                    <header>\n                      <h3>Manager UI (Principal Software Engineer) at Symantec</h3>\n                      <p>2016-2018</p>\n                    </header>\n                    <p>Oversaw the architecture and development of Angular UI component libraries for consumer and enterprise. Rapidly prototyped new product ideas for Symantec web applications.</p>\n                  </div>\n                </div>\n                <div class=\"job\">\n                  <div class=\"icon\"><img src=\"\" alt=\"\" /></div>\n                  <div class=\"description\">\n                    <header>\n                      <h3>Software Developer at Ubiquiti Networks</h3>\n                      <p>2015-2016</p>\n                    </header>\n                    <p>Built web application with AngularJS for UI on ARM based video devices. Rapidly prototyped NodeJS backend to replace the existing Java implementation for the hardware controller.</p>\n                  </div>\n                </div>\n                <div class=\"job\">\n                  <div class=\"icon\"><img src=\"\" alt=\"\" /></div>\n                  <div class=\"description\">\n                    <header>\n                      <h3>Front End Web Development Instructor at General Assembly</h3>\n                      <p>2015-2016</p>\n                    </header>\n                    <p>Taught industry professionals how to code. Developed curriculum for the Front End Web Development part-time course focused on JavaScript, CSS, HTML and web fundamentals.</p>\n                  </div>\n                </div>\n                <div class=\"job\">\n                  <div class=\"icon\"><img src=\"\" alt=\"\" /></div>\n                  <div class=\"description\">\n                    <header>\n                      <h3>Lead Web Application Engineer at Mediahound</h3>\n                      <p>2014-2015</p>\n                    </header>\n                    <p>Managed front end engineering team that built UI for social network with AngularJS. Teamed up with leads to architect APIs and sustainable development practices for the start up.</p>\n                  </div>\n                </div>\n                <div class=\"job\">\n                  <div class=\"icon\"><img src=\"\" alt=\"\" /></div>\n                  <div class=\"description\">\n                    <header>\n                      <h3>Senior Front End Developer at Team One</h3>\n                      <p>2012-2014</p>\n                    </header>\n                    <p>Developed landing pages for Lexus and 2K Games. Worked closely with designers to proto- type UI for client pitches. Executed production of interactive experiences on lexus.com.</p>\n                  </div>\n                </div>\n                <div class=\"job\">\n                  <div class=\"icon\"><img src=\"\" alt=\"\" /></div>\n                  <div class=\"description\">\n                    <header>\n                      <h3>Freelance Developer and Digital Artist</h3>\n                      <p>2004-2012</p>\n                    </header>\n                    <p>Provided end to end creative and engineering solutions for clients. Developed and designed web sites, installations and prototypes with anything that got the job done including Adobe CS, Max/MSP, Final Cut Pro, Arduino, Raspberry Pi, JavaScript, HTML, CSS, Java, C++, cus- tom electronics, sensors, motors, and video devices.</p>\n                  </div>\n                </div>\n                <div class=\"job\">\n                  <div class=\"icon\"><img src=\"\" alt=\"\" /></div>\n                  <div class=\"description\">\n                    <header>\n                      <h3>MFA Computer Art at Syracuse University</h3>\n                      <p>2007-2010</p>\n                    </header>\n                    <p>Taught computer science and art theory / practice to undergraduate and graduate students. Built several interactive installations in the course of my studies.</p>\n                  </div>\n                </div>\n                <div class=\"job\">\n                  <div class=\"icon\"><img src=\"\" alt=\"\" /></div>\n                  <div class=\"description\">\n                    <header>\n                      <h3>Adjunct Professor at Syracuse University</h3>\n                      <p>2008-2009</p>\n                    </header>\n                    <p>First graduate student to design curriculum for the Transmedia department. Taught class about Situationism / Culture Jamming. Facilitated discussions based on selected readings and screenings concerning the trickster in mythology, situationism, media interventions, hacktivism, pirate radio, civil disobedience. Led critiques of student works.</p>\n                  </div>\n                </div>\n                <div class=\"job\">\n                  <div class=\"icon\"><img src=\"\" alt=\"\" /></div>\n                  <div class=\"description\">\n                    <header>\n                      <h3>Graduate Teaching Assistant at Syracuse University</h3>\n                      <p>2008-2010</p>\n                    </header>\n                    <p>TA for interdisciplinary classes focused on integrating electronics and programming into the skill sets of artists and designers. Constructed in-class workshops, designed portions of computer programming curriculum, tutored students in Arduino microcontroller, C programming language, and Max/MSP.</p>\n                  </div>\n                </div>\n                <div class=\"job\">\n                  <div class=\"icon\"><img src=\"\" alt=\"\" /></div>\n                  <div class=\"description\">\n                    <header>\n                      <h3>Community Art Facilitator at Syracuse University</h3>\n                      <p>2008</p>\n                    </header>\n                    <p>Conducted workshops, lessons, and historical presentations in an inner city high school photography class at Nottingham H.S. in Syracuse, NY.</p>\n                  </div>\n                </div>\n                <div class=\"job\">\n                  <div class=\"icon\"><img src=\"\" alt=\"\" /></div>\n                  <div class=\"description\">\n                    <header>\n                      <h3>Computer Art Lab Manager at Syracuse University</h3>\n                      <p>2007-2010</p>\n                    </header>\n                    <p>Hired and scheduled work study lab monitors. Administered and maintained lab computers.</p>\n                  </div>\n                </div>\n                <div class=\"job\">\n                  <div class=\"icon\"><img src=\"\" alt=\"\" /></div>\n                  <div class=\"description\">\n                    <header>\n                      <h3>Guest Lecturer at Rensselaer Polytechnic Institute</h3>\n                      <p>2007</p>\n                    </header>\n                    <p>Conducted Lecture and Lab: Becoming a VJ + Programming with Quartz Composer.</p>\n                  </div>\n                </div>\n                <div class=\"job\">\n                  <div class=\"icon\"><img src=\"\" alt=\"\" /></div>\n                  <div class=\"description\">\n                    <header>\n                      <h3>Freelance Developer and Digital Artist</h3>\n                      <p>2004-2012</p>\n                    </header>\n                    <p>Provided end-to-end creative and engineering solutions for clients. Developed and designed web sites, installations and prototypes with tools including Adobe CS, Max/MSP, Final Cut Pro, Arduino, Raspberry Pi, JavaScript, HTML, CSS, Java, C++, custom electronics, sensors, motors, and video devices.</p>\n                  </div>\n                </div>\n                <div class=\"job\">\n                  <div class=\"icon\"><img src=\"\" alt=\"\" /></div>\n                  <div class=\"description\">\n                    <header>\n                      <h3>Artist in Resident at Experimental Television Center</h3>\n                      <p>2004</p>\n                    </header>\n                    <p>Created motion tracking application for use in several projects during residency.</p>\n                  </div>\n                </div>\n                <div class=\"job\">\n                  <div class=\"icon\"><img src=\"\" alt=\"\" /></div>\n                  <div class=\"description\">\n                    <header>\n                      <h3>BS Electronic Arts at Rensselaer Polytechnic Institute</h3>\n                      <p>2000-2004</p>\n                    </header>\n                    <p>Studied computer science and art / design in an interdisciplinary degree.</p>\n                  </div>\n                </div>\n              </section>\n              <section>\n                <h2>Speaking Engagements</h2>\n                <div class=\"job\">\n                  <div class=\"description\">\n                    <header>\n                      <h3>“Growing Up With a Mom in Tech” ACT-W.</h3>\n                      <p>2019</p>\n                    </header>\n                  </div>\n                </div>\n                <div class=\"job\">\n                  <div class=\"description\">\n                    <header>\n                      <h3>“Angular Elements” Angular Portland Meetup.</h3>\n                      <p>2019</p>\n                    </header>\n                  </div>\n                </div>\n                <div class=\"job\">\n                  <div class=\"description\">\n                    <header>\n                      <h3>“It’s Not About Web Components vs. React” Front End PDX Meetup.</h3>\n                      <p>2019</p>\n                    </header>\n                  </div>\n                </div>\n                <div class=\"job\">\n                  <div class=\"description\">\n                    <header>\n                      <h3>“It’s Not About Web Components vs. React” Front End Small Talk.</h3>\n                      <p>2019</p>\n                    </header>\n                  </div>\n                </div>\n                <div class=\"job\">\n                  <div class=\"description\">\n                    <header>\n                      <h3>“Writing A Custom Angular Build” ng-conf.</h3>\n                      <p>2018</p>\n                    </header>\n                  </div>\n                </div>\n              </section>\n              <section>\n                <h2>Exhibition</h2>\n                <div class=\"job\">\n                  <div class=\"description\">\n                    <header>\n                      <h3>Kinetic Light. Gallery 381 Solo Exhibition of Video & Photography. Los Angeles, CA.</h3>\n                      <p>2013</p>\n                    </header>\n                  </div>\n                </div>\n                <div class=\"job\">\n                  <div class=\"description\">\n                    <header>\n                      <h3>MFA Exhibition. “American Dream Machine” Syracuse University.</h3>\n                      <p>2010</p>\n                    </header>\n                  </div>\n                </div>\n                <div class=\"job\">\n                  <div class=\"description\">\n                    <header>\n                      <h3>SPARK Video SPARK Gallery “No Strings Attached” Syracuse, NY.</h3>\n                      <p>2009</p>\n                    </header>\n                  </div>\n                </div>\n                <div class=\"job\">\n                  <div class=\"description\">\n                    <header>\n                      <h3>Techno Culture Dowd Gallery “No Strings Attached” Cortland, NY.</h3>\n                      <p>2009</p>\n                    </header>\n                  </div>\n                </div>\n                <div class=\"job\">\n                  <div class=\"description\">\n                    <header>\n                      <h3>Techno Culture Redhouse Gallery “No Strings Attached” Syracuse, NY.</h3>\n                      <p>2009</p>\n                    </header>\n                  </div>\n                </div>\n                <div class=\"job\">\n                  <div class=\"description\">\n                    <header>\n                      <h3>Wired Space CASE Warehouse “Audiobombing the Erie” Syracuse, NY.</h3>\n                      <p>2009</p>\n                    </header>\n                  </div>\n                </div>\n                <div class=\"job\">\n                  <div class=\"description\">\n                    <header>\n                      <h3>Electric Art 4 XL Projects “NSA, Audiobombs, & .highway” Syracuse, NY.</h3>\n                      <p>2009</p>\n                    </header>\n                  </div>\n                </div>\n                <div class=\"job\">\n                  <div class=\"description\">\n                    <header>\n                      <h3>Wearable Technologies The Warehouse “Meet The Tourist Live” Syracuse University.</h3>\n                      <p>2008</p>\n                    </header>\n                  </div>\n                </div>\n                <div class=\"job\">\n                  <div class=\"description\">\n                    <header>\n                      <h3>Celebration of the Arts “The Tourist” New Paltz, NY.</h3>\n                      <p>2008</p>\n                    </header>\n                  </div>\n                </div>\n                <div class=\"job\">\n                  <div class=\"description\">\n                    <header>\n                      <h3>Electric Art 3 Tosh Gallery “Information Hunter/Gatherer” Syracuse, NY.</h3>\n                      <p>2008</p>\n                    </header>\n                  </div>\n                </div>\n                <div class=\"job\">\n                  <div class=\"description\">\n                    <header>\n                      <h3>SPARK Meet and Greet SPARK Gallery “Attention Span” Syracuse, NY.</h3>\n                      <p>2007</p>\n                    </header>\n                  </div>\n                </div>\n                <div class=\"job\">\n                  <div class=\"description\">\n                    <header>\n                      <h3>FOCUS Rensselaer Polytechnic Institute “Eye Control” Troy, NY.</h3>\n                      <p>2004</p>\n                    </header>\n                  </div>\n                </div>\n              </section>\n              <section>\n                <h2>Bibliography</h2>\n                <div class=\"job\">\n                  <div class=\"description\">\n                    <header>\n                      <h3>Kinetic Light. Exhibition Companion Book.</h3>\n                      <p>2013</p>\n                    </header>\n                  </div>\n                </div>\n                <div class=\"job\">\n                  <div class=\"description\">\n                    <header>\n                      <h3>Web Designer Magazine. Featured Designer. Issue 199.</h3>\n                      <p>2012</p>\n                    </header>\n                  </div>\n                </div>\n                <div class=\"job\">\n                  <div class=\"description\">\n                    <header>\n                      <h3>Home for Living. Video. Aired on The Looseleaf Report. LA & NY.</h3>\n                      <p>2/16/05</p>\n                    </header>\n                  </div>\n                </div>\n                <div class=\"job\">\n                  <div class=\"description\">\n                    <header>\n                      <h3>Aaron, Kenneth. “Creativity gets its close-up“ Albany Times Union.</h3>\n                      <p>5/24/04</p>\n                    </header>\n                  </div>\n                </div>\n              </section>\n              </div>\n            </t-post>\n          </v-section>\n\n     </v-stage>\n";

let CVComponent = class CVComponent extends CustomElement {
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
], CVComponent.prototype, "getState", null);
CVComponent = __decorate([
    Component({
        selector: 'cv-view',
        style: css_248z$b,
        template: template$c
    }),
    __metadata("design:paramtypes", [])
], CVComponent);
customElements.define('cv-view', CVComponent);

var css_248z$c = ":host{display:block;position:absolute;left:50%;top:50%;transform:translateX(-50%) translateY(-50%)}:host h1{font-size:72px}";
styleInject(css_248z$c);

var template$d = "<h1>404</h1>\n<p>File Not Found</p>\n<p><a href=\"/\">Go Home</a></p>";

let FileNotFoundComponent = class FileNotFoundComponent extends CustomElement {
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
], FileNotFoundComponent.prototype, "getState", null);
FileNotFoundComponent = __decorate([
    Component({
        selector: 'not-found-view',
        style: css_248z$c,
        template: template$d
    }),
    __metadata("design:paramtypes", [])
], FileNotFoundComponent);
customElements.define('not-found-view', FileNotFoundComponent);

function BroadcastChannel$1(channel) { }
global['BroadcastChannel'] = BroadcastChannel$1;
global['observer$'] = {
    observe: () => { }
};
global['fetch'] = undefined;
const routes = [
    { path: '/', component: HomeComponent },
    { path: '/blog', component: BlogComponent },
    { path: '/resume', component: ResumeComponent },
    { path: '/cv', component: CVComponent },
    { path: '/404', component: FileNotFoundComponent }
];
document.body.classList.add('is--init');

export { BlogComponent, CVComponent, HomeComponent, MarketingComponent, NavComponent, PostComponent, ProfileComponent, ResumeComponent, SectionComponent, StageComponent, routes };
