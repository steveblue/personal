// components
import {
  StageComponent,
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
import { FileNotFoundComponent } from './view/not-found';

// router
import { rdrouter } from './router';

document.body.classList.add('is--init');

export { StageComponent,
         NavComponent,
         SectionComponent,
         ProfileComponent,
         PostComponent,
         MarketingComponent,
         HomeComponent,
         BlogComponent,
         ResumeComponent,
         CVComponent,
         FileNotFoundComponent,
         rdrouter };
