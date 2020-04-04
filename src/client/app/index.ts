// components
import {
  StageComponent,
  ScrollSync,
  ScrollView,
  CardComponent,
  NavComponent,
  SectionComponent,
  ProfileComponent,
  PostComponent,
  MarketingComponent
} from './shared';

// views
import { HomeComponent } from './view/home';
import { BlogComponent } from './view/blog';
import { ResumeComponent } from './view/resume';
import { CVComponent } from './view/cv';
import { GalleryComponent } from './view/gallery';
import { FileNotFoundComponent } from './view/not-found';

// router
import { rdrouter } from './router';

document.body.classList.add('is--init');

export { StageComponent,
         CardComponent,
         NavComponent,
         SectionComponent,
         ProfileComponent,
         PostComponent,
         MarketingComponent,
         ScrollSync,
         ScrollView,
         HomeComponent,
         BlogComponent,
         ResumeComponent,
         CVComponent,
         GalleryComponent,
         FileNotFoundComponent,
         rdrouter };
