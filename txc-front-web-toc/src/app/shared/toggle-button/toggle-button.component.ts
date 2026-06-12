import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-toggle-button',
  templateUrl: './toggle-button.component.html',
  styleUrls: ['./toggle-button.component.scss']
})
export class ToggleButtonComponent implements OnInit {

  @Input()
  checked:boolean = true;
  @Output() changed = new EventEmitter<boolean>();
  constructor() { }

  ngOnInit(): void {
  }

  onClick(){
    this.checked = !this.checked;
    this.changed.emit(this.checked);
  }

}
