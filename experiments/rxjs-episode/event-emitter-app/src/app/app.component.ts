import { Component, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { MessageSubscriberService } from './service/message-subscriber.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy{
  title = 'event-emitter-app';
  myCount: number = 10;
  private ngUnsubscribe = new Subject<void>();

  constructor(private readonly messageSubscriberSvc: MessageSubscriberService){
    this.subscribeToChild();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  countChange(event :any) {
    this.myCount = event;
  }

  private subscribeToChild(){
    this.messageSubscriberSvc.currentState.pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: (res) => {
        if(res == null){
          return;
        }
        console.log(res);
      }
    });
  }
}
