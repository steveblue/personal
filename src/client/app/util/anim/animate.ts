import { WebAnimation } from "./interface";

export class AnimationPlayer {
    public elem: HTMLElement | SVGElement;
    public animation: WebAnimation;
    public player: Animation;
    constructor(elem: HTMLElement | SVGElement,
                animation: WebAnimation) {
        this.elem = elem;
        this.animation = animation;
        this.player = this.elem.animate(
            animation.keyframes,
            animation.options ? animation.options : {}
        );
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