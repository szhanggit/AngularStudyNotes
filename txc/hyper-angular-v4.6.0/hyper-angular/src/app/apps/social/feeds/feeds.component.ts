import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

// type
import { Comment, Post } from '../shared/social.model';


@Component({
  selector: 'app-social-feeds',
  templateUrl: './feeds.component.html',
  styleUrls: ['./feeds.component.scss']
})
export class FeedsComponent implements OnInit {

  @Input() socialFeeds: Post[] = [];

  constructor (private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
  }

  /**
   * returns the safe content which can be rendered
   * @param content string
   */
  getRenderedPostContent(content: string) {
    return this.sanitizer.sanitize(1, content);
  }

  /**
   * toggle like
   * @param post post
   */
  toggleLike(post: Post) {
    post.isLiked = !post.isLiked;
  }

  /**
   * Comment
   * @param comment comment obj
   */
  toggleLikeOnComment(comment: Comment) {
    comment.isLiked = !comment.isLiked;
  }

}
