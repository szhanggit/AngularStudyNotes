import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/core/service/auth.service';

// type
import { User } from '../../core/models/auth.models';
import { BreadcrumbItem } from '../../shared/page-title/page-title.model';
import { Post, SocialEvent, Topic, Person } from './shared/social.model';

// data
import { news, peopleToFollow, posts, socialEvents } from './shared/data';


@Component({
  selector: 'app-social',
  templateUrl: './social.component.html',
  styleUrls: ['./social.component.scss']
})
export class SocialComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  loggedInUser: User | null = {};
  socialEvents: SocialEvent[] = [];
  trendingNews: Topic[] = [];
  socialFeeds: Post[] = [];
  peopleToFollow: Person[] = [];

  constructor (private authService: AuthenticationService) { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Apps', path: '/' }, { label: 'Social Feed', path: '/', active: true }];

    this.loggedInUser = this.authService.currentUser();

    // get data
    this._fetchData();
  }


  /**
   *  fetches event data
   */
  _fetchData(): void {
    this.socialEvents = [...socialEvents];
    this.trendingNews = news;
    this.socialFeeds = posts;
    this.peopleToFollow = peopleToFollow;
  }

}
