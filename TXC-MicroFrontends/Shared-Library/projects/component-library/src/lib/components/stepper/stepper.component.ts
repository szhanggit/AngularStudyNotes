import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'lib-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss']
})
export class StepperComponent implements OnInit {
  @Input() step = 0;
  @Input() stepTitles!: string[];
  @Input() selectedStep!: number;
  @Input() stepsReached: number[] = [];
  @Input() stepsWithIssue: number[] = [];

  @Output() stepperChanged = new EventEmitter<number>();
  constructor() { }

  ngOnInit(): void {
  }

  jumpStep(nextStep: number) {
    if (this.step > nextStep || this.stepsReached.includes(nextStep)) {
      this.stepperChanged.emit(nextStep);
    }
  }
}
