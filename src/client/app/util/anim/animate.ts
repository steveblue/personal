import { WebAnimation } from "./interface";

export class AnimationPlayer {
    public elem: HTMLElement | SVGElement;
    public animation: WebAnimation;
    public player: Animation | any;
    constructor(elem: HTMLElement | SVGElement,
                animation: WebAnimation) {
        this.elem = elem;
        this.animation = animation;
        if (this.elem.animate) {
            this.player = this.elem.animate(
                animation.keyframes,
                animation.options ? animation.options : {}
            );
        } else {
            this.player = {
                cancel: () => {},
                play: () => {},
                pause: () => {},
                finish: () => {},
                reverse: () => {}
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

export function animate(elem: HTMLElement | SVGElement, animation: WebAnimation): AnimationPlayer {
    return new AnimationPlayer(elem, animation);
}