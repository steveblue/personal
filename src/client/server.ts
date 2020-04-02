function BroadcastChannel(channel) {}
global['BroadcastChannel'] = BroadcastChannel;
global['observer$'] = {
  observe: () => {}
};

import {
  StageComponent,
  CardComponent,
  ScrollSync,
  ScrollView,
  SectionComponent,
  ProfileComponent,
  PostComponent,
  NavComponent,
} from './app/shared';

import { HomeComponent } from './app/view/home';
import { BlogComponent } from './app/view/blog';
import { ResumeComponent } from './app/view/resume';
import { GalleryComponent } from './app/view/gallery';

const routes = [{ path: '/', component: HomeComponent },
                { path: '/blog', component: BlogComponent },
                { path: '/resume', component: ResumeComponent },
                { path: '/gallery', component: GalleryComponent }];

document.body.classList.add('is--init');

export {
  StageComponent,
  CardComponent,
  ScrollSync,
  ScrollView,
  SectionComponent,
  ProfileComponent,
  PostComponent,
  NavComponent,
  HomeComponent,
  BlogComponent,
  ResumeComponent,
  GalleryComponent,
  routes
};