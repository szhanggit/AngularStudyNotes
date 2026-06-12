import { Component, Input, OnInit } from '@angular/core';
import { Button } from '../../models/button.model';

@Component({
  selector: 'lib-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() title: string = '';
  @Input() buttons!: Button[];

  constructor() { }

  ngOnInit(): void {
  }

  getButtonClasses(button: Button, isLast: boolean) {
    const classes: string[] = [];
    if (button && button.buttonClass) {
      classes.push(button.buttonClass);
    }
    if (!isLast) {
      classes.push('mr-2');
    }
    return classes;
  }
}
