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


const slideInAnimation = function(options: 'left' | 'right'): WebAnimation {
  const from = (options === 'left') ? 'translate3D(-100vw, 0%, -50px)' : 'translate3D(100vw, 0%, -50px)';
  console.log(from);
  return {
    keyframes: [
      {
        transform: from,
        opacity: '0'
      },
      {
        transform: 'translate3D(0%, 0%, 0px)',
        opacity: '1'
      }
    ],
    options: {
      fill: 'both',
      easing: 'ease-in',
      duration: 500
    }
  }
};

export { slideUpAnimation, slideInAnimation };
