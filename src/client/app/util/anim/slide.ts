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


const slideInAnimation = function(options: 'left' | 'right' | 'top' | 'bottom'): WebAnimation {
  let from;
  if (options === 'left') from = 'translate3D(-100vw, 0%, -50px)';
  if (options === 'right') from = 'translate3D(100vw, 0%, -50px)';
  if (options === 'top') from = 'translate3D(0%, -100vh, -50px)';
  if (options === 'bottom') from = 'translate3D(0%, 100vh, -50px)';

  return {
    keyframes: [
      {
        transform: from,
      },
      {
        transform: 'translate3D(0%, 0%, 0px)',
      }
    ],
    options: {
      fill: 'forwards',
      easing: 'cubic-bezier(0.0,0.0,0.58,1.0)',
      duration: 500
    }
  }
};

export { slideUpAnimation, slideInAnimation };
