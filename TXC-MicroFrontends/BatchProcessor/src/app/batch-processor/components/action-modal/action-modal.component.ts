import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Button } from '../../models/dumb-models/button.model';
import { FormModel } from '../../models/dumb-models/form.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-action-modal',
  templateUrl: './action-modal.component.html',
  styleUrls: ['./action-modal.component.scss'],
})
export class ActionModalComponent implements OnInit {
  @Input() primaryButton!: Button;
  @Input() secondaryButton!: Button;
  @Input() formModel!: FormModel;
  @Input() formGroup!: FormGroup;
  @Input() selectedTemplate!: string;

  @Output() primaryButtonClicked = new EventEmitter<void>();

  isBtnDisabled: boolean = true;

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit() {
    this.getFormValidity();
  }

  getFormValidity() {
    this.formGroup.statusChanges.subscribe((status) => {
      this.isBtnDisabled = status !== 'VALID';
    });
  }

  onPrimaryButtonClicked() {
    this.activeModal.close('confirm');
    this.primaryButtonClicked.emit();
  }
}
