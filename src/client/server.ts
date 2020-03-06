function BroadcastChannel(channel) {}
global['BroadcastChannel'] = BroadcastChannel;


import { StageComponent, CardComponent, ScrollSync, HomeComponent } from './app/view/home';

const routes = [
    { path: '/', component: HomeComponent }
];

export { StageComponent, CardComponent, ScrollSync, routes };
