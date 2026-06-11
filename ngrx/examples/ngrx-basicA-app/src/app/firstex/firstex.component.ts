import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

interface AppState{
  message: string;
}

@Component({
  selector: 'firstex',
  templateUrl: './firstex.component.html',
  styleUrls: ['./firstex.component.scss']
})
export class FirstexComponent implements OnInit {
  message$: Observable<string>;

  constructor(private store: Store<AppState>) {
    this.message$ = this.store.select('message');
  }

  spanishMessage(){
    this.store.dispatch({type: 'SPANISH'});
  }

  frenchMessage(){
    this.store.dispatch({type: 'FRENCH'});
  }

  ngOnInit() {

  }

  logout() {

  }
}
