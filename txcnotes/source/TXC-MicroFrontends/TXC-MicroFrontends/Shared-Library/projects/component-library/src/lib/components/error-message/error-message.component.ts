import { Component, Input, OnInit } from '@angular/core';
import { ErrorMessage } from '../../models/dumb-models/error-message.model';

@Component({
  selector: 'lib-error-message',
  templateUrl: './error-message.component.html',
  styleUrls: ['./error-message.component.scss']
})
export class ErrorMessageLibComponent implements OnInit {
  @Input() errorMessages!: ErrorMessage[];
  @Input() addHorizontalMargin: boolean = true;
  @Input() addVerticalMargin: boolean = false;
  @Input() showHeading: boolean = true;
  @Input() limit: number = 0;

  constructor(){}

  ngOnInit(){
    if(this.errorMessages.length > this.limit && this.limit > 0){
      this.errorMessages = this.errorMessages.slice(0, this.limit);
    };
  }
}
