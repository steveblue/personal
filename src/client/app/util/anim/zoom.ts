import { WebAnimation } from './interface';

const zoomInAnimation: WebAnimation = {
    keyframes: [
        { transform: 'translate3D(50%, 50%, -100px)', opacity: '0'},
        { transform: 'translate3D(50%, 50%, 0px)', opacity: '1' }
    ],
    options: {
        fill: 'both',
        easing: 'ease-in',
        duration: 500
    }
};

const zoomOutAnimation: WebAnimation = {
    keyframes: [
        { transform: 'translate3D(50%, 50%, 0px)', opacity: '1'},
        { transform: 'translate3D(50%, 50%, -100px)', opacity: '0' }
    ],
    options: {
        fill: 'forwards',
        easing: 'ease-in',
        duration: 500
    }
};

export { zoomInAnimation, zoomOutAnimation }