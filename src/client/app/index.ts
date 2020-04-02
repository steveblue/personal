// components
import {
  StageComponent,
  ScrollSync,
  ScrollView,
  CardComponent,
  NavComponent,
  SectionComponent,
  ProfileComponent,
  PostComponent
} from './shared';

// views
import { HomeComponent } from './view/home';
import { BlogComponent } from './view/blog';
import { ResumeComponent } from './view/resume';
import { GalleryComponent } from './view/gallery';

// router
import { rdrouter } from './router';

document.body.classList.add('is--init');

export { StageComponent,
         CardComponent,
         NavComponent,
         SectionComponent,
         ProfileComponent,
         PostComponent,
         ScrollSync,
         ScrollView,
         HomeComponent,
         BlogComponent,
         ResumeComponent,
         GalleryComponent,
         rdrouter };
