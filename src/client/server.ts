import fetch from 'node-fetch';

function BroadcastChannel(channel) {}
global['BroadcastChannel'] = BroadcastChannel as any;
global['observer$'] = {
  observe: () => { }
};
global['fetch'] = fetch as any;

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

import { personSchema } from './meta/person';
import { blogSchema } from './meta/blog';
import { indexSchema } from './meta/index';

const routes = [
  { path: '/', component: HomeComponent, title: 'Stephen Belovarich, Web Engineer and Digital Artist in Portland, OR', description: indexSchema.description, schema: JSON.stringify(indexSchema) },
  { path: '/blog', component: BlogComponent, title: 'Stephen Belovarich Web Development Blog', description: blogSchema.description, schema: JSON.stringify(blogSchema) },
  { path: '/resume', component: ResumeComponent, title: 'Stephen Belovarich Resume', description: indexSchema.description, schema: JSON.stringify(personSchema) },
  { path: '/cv', component: CVComponent, title: 'Stephen Belovarich Curriculum Vitae, CV', description: indexSchema.description, schema: JSON.stringify(personSchema) },
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