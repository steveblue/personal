import { WebAnimation } from './interface';

const zoomInAnimation: WebAnimation = {
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

const zoomOutAnimation: WebAnimation = {
  keyframes: [
    { transform: 'translate3D(50%, 50%, 0px)', opacity: '1' },
    { transform: 'translate3D(50%, 50%, -100px)', opacity: '0' }
  ],
  options: {
    fill: 'forwards',
    easing: 'ease-in',
    duration: 500
  }
};

const perspectiveAnimation= function(index): WebAnimation {
  const zoom = index * -100;
  return {
    keyframes: [
      {
        transform: `translate3D(50%, 50%, ${zoom}px)`,
        opacity: '0.2',
        zIndex: '-100'
      },
      { transform: `translate3D(50%, 50%, 0px)`, opacity: '1', zIndex: '0' }
    ],
    options: {
      fill: 'both',
      easing: 'ease-in',
      duration: 500
    }
  };
};


export { zoomInAnimation, zoomOutAnimation, perspectiveAnimation };
