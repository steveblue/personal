import { WebAnimation } from './interface';

const slideUpAnimation: WebAnimation = {
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

export { slideUpAnimation };
