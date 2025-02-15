import { Router } from '@readymade/router';

const routing = [
  { path: '/', component: 'home-view' },
  { path: '/blog', component: 'blog-view' },
  { path: '/resume', component: 'resume-view' },
  { path: '/cv', component: 'cv-view' },
  { path: '/404', component: 'not-found-view' },
  { path: '/photographer-in-portland-or', component: 'gallery-view' },
];

export { Router, routing };
