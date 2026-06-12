import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

// modules
import { PageTitleModule } from '../../shared/page-title/page-title.module';
import { SocialRoutingModule } from './social-routing.module';

// components
import { SocialComponent } from './social.component';
import { FeedsComponent } from './feeds/feeds.component';
import { FollowersComponent } from './followers/followers.component';
import { NewsComponent } from './news/news.component';
import { ProfileComponent } from './profile/profile.component';
import { NewPostComponent } from './new-post/new-post.component';
import { FeaturedVideoComponent } from './featured-video/featured-video.component';
import { EventsComponent } from './events/events.component';


@NgModule({
  declarations: [
    SocialComponent,
    FeedsComponent,
    FollowersComponent,
    NewsComponent,
    ProfileComponent,
    NewPostComponent,
    FeaturedVideoComponent,
    EventsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbDropdownModule,
    NgbNavModule,
    PageTitleModule,
    SocialRoutingModule
  ],
  exports: [FeedsComponent,
    FollowersComponent,
    NewsComponent,
    ProfileComponent,
    NewPostComponent,
    FeaturedVideoComponent,
    EventsComponent]
})
export class SocialModule { }
