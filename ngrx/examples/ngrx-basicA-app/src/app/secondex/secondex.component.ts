import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as PostActions from '../action/post.actions';
import { Post } from '../model/post.model';

interface AppState{
  post: Post
}

@Component({
  selector: 'secondex',
  templateUrl: './secondex.component.html',
  styleUrls: ['./secondex.component.scss']
})
export class SecondexComponent implements OnInit {
  post: Observable<Post>;
  text: string;
  constructor(private store: Store<AppState>) { 
    
  }

  editText(){
    this.store.dispatch(new PostActions.EditText(this.text)); 
  }

  resetPost(){
    this.store.dispatch(new PostActions.Reset());
  }

  upvote(){
    this.store.dispatch(new PostActions.Upvote()); 
  }

  downvote(){
    this.store.dispatch(new PostActions.Downvote());
  }

  ngOnInit(): void {
    this.editText();
    this.post = this.store.select('post');
  }

}
