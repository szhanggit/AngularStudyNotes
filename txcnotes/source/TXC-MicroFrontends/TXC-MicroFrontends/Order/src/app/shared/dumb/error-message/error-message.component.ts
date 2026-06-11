import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ErrorMessage } from '../../models/dumb-models/error-message.model';

@Component({
  selector: 'app-error-message',
  templateUrl: './error-message.component.html',
  styleUrls: ['./error-message.component.scss']
})
export class ErrorMessageComponent {
  @Input() errorMessages!: ErrorMessage[];
  @Input() addHorizontalMargin = true;
  @Input() addVerticalMargin = false;
  @Input() showHeading = true;
  @Input() showRefreshButton = false;
  @Output() refreshClicked: EventEmitter<boolean> = new EventEmitter<boolean>();

  refreshStatus() {
    this.refreshClicked.emit(true);
  }
}
