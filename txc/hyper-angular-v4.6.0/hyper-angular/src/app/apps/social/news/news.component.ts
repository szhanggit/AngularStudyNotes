import { Component, Input, OnInit } from '@angular/core';

// type
import { Topic } from '../shared/social.model';

@Component({
  selector: 'app-social-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {

  @Input() trendingNews: Topic[] = [];

  constructor () { }

  ngOnInit(): void {
  }

}
