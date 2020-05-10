import fetch from 'node-fetch';

function BroadcastChannel(channel) {}
global['BroadcastChannel'] = BroadcastChannel;
global['observer$'] = {
  observe: () => {}
};

global['fetch'] = fetch;

import {
  StageComponent,
  SectionComponent,
  ProfileComponent,
  PostComponent,
  MarketingComponent,
  NavComponent,
} from './app/shared';

import { HomeComponent } from './app/view/home';
import { BlogComponent } from './app/view/blog';
import { ResumeComponent } from './app/view/resume';
import { CVComponent } from './app/view/cv';
import { FileNotFoundComponent } from 'app/view/not-found';

const routes = [
                { path: '/', component: HomeComponent, title: 'Stephen Belovarich, Web Engineer and Digital Artist in Portland, OR' },
                { path: '/blog', component: BlogComponent, title: 'Stephen Belovarich Web Development Blog' },
                { path: '/resume', component: ResumeComponent, title: 'Stephen Belovarich Resume' },
                { path: '/cv', component: CVComponent, title: 'Stephen Belovarich Curriculum Vitae, CV' },
                { path: '/404', component: FileNotFoundComponent, title: 'File Not Found' }
              ];

document.body.classList.add('is--init');

export {
  fetch,
  StageComponent,
  SectionComponent,
  ProfileComponent,
  PostComponent,
  MarketingComponent,
  NavComponent,
  HomeComponent,
  BlogComponent,
  ResumeComponent,
  CVComponent,
  routes
};