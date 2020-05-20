import { WebAnimation } from './interface';

const navInAnimation: WebAnimation = {
  keyframes: [
    {
      transform: 'translateX(0%) translateY(0%)',
      width: '44px',
      top: '0%',
      right: '0%',
      opacity: '0'
    },
    {
      transform: 'translateX(0%) translateY(0%)',
      width: '44px',
      top: '0%',
      right: '0%',
      opacity: '0'
    },
    {
      transform: 'translateX(50%) translateY(-50%)',
      width: '320px',
      top: '50%',
      right: '50%',
      opacity: '1'
    },
    {
      transform: 'translateX(50%) translateY(-50%)',
      width: '320px',
      top: '50%',
      right: '50%',
      opacity: '1'
    }
  ],
  options: {
    fill: 'forwards',
    easing: 'ease-in-out',
    duration: 500
  }
};

const navOutAnimation: WebAnimation = {
  keyframes: [
    {
      transform: 'translateX(50%) translateY(-50%)',
      width: '320px',
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
    },
  ],
  options: {
    fill: 'forwards',
    easing: 'ease-out',
    duration: 900
  }
};


const containerAnimation: WebAnimation = {
  keyframes: [
    {
      borderRadius: '0% 0% 0% 0%',
      width: '44px',
      height: '44px'
    },
    {
      borderRadius: '50% 0% 50% 50%',
      width: '100vw',
      height: '100vh'
    },
    {
      borderRadius: '0% 0% 0% 0%',
      width: '100vw',
      height: '100vh'
    }
  ],
  options: {
    fill: 'both',
    easing: 'ease-in',
    duration: 700
  }
};


export { navInAnimation, navOutAnimation, containerAnimation };
