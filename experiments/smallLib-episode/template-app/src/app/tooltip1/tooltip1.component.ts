import { Component, OnInit } from '@angular/core';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-tooltip1',
  templateUrl: './tooltip1.component.html',
  styleUrls: ['./tooltip1.component.css']
})
export class Tooltip1Component implements OnInit {
  name = 'World';
  constructor() { }

  ngOnInit(): void {
  }

  toggleWithGreeting(tooltip: NgbTooltip, greeting: string) {
		if (tooltip.isOpen()) {
			tooltip.close();
		} else {
			tooltip.open({ greeting });
		}
	}
}
