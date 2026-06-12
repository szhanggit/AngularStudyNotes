import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { StatusProperty } from '../../models/table.model';

@Component({
  selector: 'lib-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusLibComponent {
  @Input() status!: any;
  @Input() statusEnum!: any;
  @Input() statusProperties: StatusProperty[] = [];
  constructor() {}

  get statusStyle() {
    return this.statusProperties.find((props) =>
      props.values.includes(this.status)
    );
  }
}
