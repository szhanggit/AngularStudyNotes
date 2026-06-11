import { Component, ViewChild } from '@angular/core';
import { StopwatchComponent } from '../stopwatch/stopwatch.component';

@Component({
  selector: 'app-stopwatch-parent',
  templateUrl: './stopwatch-parent.component.html',
  styleUrls: ['./stopwatch-parent.component.sass']
})
export class StopwatchParentComponent {
  @ViewChild(StopwatchComponent)
  private stopwatchComponent = {} as StopwatchComponent;
  startStopwatch() {
         this.stopwatchComponent.start();
  }
  stopStopwatch() {
         this.stopwatchComponent.stop();
  }
}
