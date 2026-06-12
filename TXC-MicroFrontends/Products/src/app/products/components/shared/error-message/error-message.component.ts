import { Component, Input } from '@angular/core';
import { ErrorMessage } from 'src/app/products/models/error-message.model';

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
}
