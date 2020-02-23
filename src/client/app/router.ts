
import { RdRouter } from './router/index';

const routing = [
    { path: '/', component: 'home-view' }
];

const rdrouter = new RdRouter('#root', routing);

export { rdrouter }