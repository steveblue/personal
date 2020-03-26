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
  HomeComponent
} from './app/view/home';

const routes = [{ path: '/', component: HomeComponent }];

export {
  StageComponent,
  CardComponent,
  ScrollSync,
  ScrollView,
  SectionComponent,
  ProfileComponent,
  PostComponent,
  HomeComponent,
  NavComponent,
  routes
};
