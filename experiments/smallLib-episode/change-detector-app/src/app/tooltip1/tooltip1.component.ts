import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-tooltip1',
  templateUrl: './tooltip1.component.html',
  styleUrls: ['./tooltip1.component.css']
})
export class Tooltip1Component implements OnInit {
  name = 'World';
  counter = 0;
  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
  }

  toggleWithGreeting(tooltip: NgbTooltip, greeting: string) {
		if (tooltip.isOpen()) {
			tooltip.close();
		} else {
			tooltip.open({ greeting });
		}
	}

  increment() {
    // Increment the counter
    this.counter++;
    // Manually trigger change detection
    this.cdr.detectChanges();
  }

  manualChangeDetection() {
    // Some logic that does not automatically trigger change detection
    setTimeout(() => {
      this.counter++;
      // Manually trigger change detection
      this.cdr.detectChanges();
    }, 2000);
  }
}
