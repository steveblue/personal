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
  MarketingComponent,
  NavComponent,
} from './app/shared';

import { HomeComponent } from './app/view/home';
import { BlogComponent } from './app/view/blog';
import { ResumeComponent } from './app/view/resume';
import { CVComponent } from './app/view/cv';
import { GalleryComponent } from './app/view/gallery';
import { FileNotFoundComponent } from 'app/view/not-found';

const routes = [
                { path: '/', component: HomeComponent },
                { path: '/blog', component: BlogComponent },
                { path: '/resume', component: ResumeComponent },
                { path: '/cv', component: CVComponent },
                { path: '/404', component: FileNotFoundComponent }
                //{ path: '/gallery', component: GalleryComponent }
              ];

document.body.classList.add('is--init');

export {
  StageComponent,
  CardComponent,
  ScrollSync,
  ScrollView,
  SectionComponent,
  ProfileComponent,
  PostComponent,
  MarketingComponent,
  NavComponent,
  HomeComponent,
  BlogComponent,
  ResumeComponent,
  CVComponent,
  GalleryComponent,
  routes
};