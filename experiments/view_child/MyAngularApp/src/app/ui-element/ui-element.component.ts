import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { NumberComponent } from '../number/number.component';
import { StopwatchComponent } from '../stopwatch/stopwatch.component';
import { CpcolorDirective } from '../cpcolor.directive';

@Component({
  selector: 'app-ui-element',
  templateUrl: './ui-element.component.html',
  styleUrls: ['./ui-element.component.sass']
})
export class UiElementComponent {
	@ViewChild(NumberComponent)
	private numberComponent = {} as NumberComponent;
	@ViewChild(StopwatchComponent)
	private stopwatchComponent = {} as StopwatchComponent;
	@ViewChild(CpcolorDirective)
	private cpColorDirective = {} as CpcolorDirective;
	@ViewChild('title')
	private elTitle = {} as ElementRef;

	ngAfterViewInit() {
		this.elTitle.nativeElement.style.backgroundColor = 'cyan';
		this.elTitle.nativeElement.style.color = 'red';
	}
	increase() {
		this.numberComponent.increaseByOne();
	}
	decrease() {
		this.numberComponent.decreaseByOne();
	}
	startStopwatch() {
		this.stopwatchComponent.start();
	}
	stopStopwatch() {
		this.stopwatchComponent.stop();
	}
	changeColor(color: string) {
		this.cpColorDirective.change(color);
	}

}
