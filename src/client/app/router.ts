import { RdRouter } from './router/index';

const routing = [
    { path: '/', component: 'home-view' },
    { path: '/blog', component: 'blog-view' },
    { path: '/resume', component: 'resume-view' },
    { path: '/cv', component: 'cv-view' }
    // { path: '/gallery', component: 'gallery-view' }
];

const rdrouter = new RdRouter('#root', routing);

export { rdrouter };
