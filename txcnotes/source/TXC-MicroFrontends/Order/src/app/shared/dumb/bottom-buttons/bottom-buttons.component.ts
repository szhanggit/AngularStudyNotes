import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ButtonModel } from '../../models/dumb-models/button-model';
import { ButtonClassEnum } from '../../enums/button-class.enum';

@Component({
  selector: 'app-bottom-buttons',
  templateUrl: './bottom-buttons.component.html',
  styleUrls: ['./bottom-buttons.component.scss']
})
export class BottomButtonsComponent {
  @Input() buttons!: ButtonModel[];
  @Output() buttonClicked = new EventEmitter<string>();

  get buttonClass() {
    return ButtonClassEnum;
  }
}
