import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DropdownItem } from '../../models/dropdown-item.model';
@Component({
  selector: 'app-view-form-accordion',
  templateUrl: './view-form-accordion.component.html',
  styleUrls: ['./view-form-accordion.component.scss'],
})
export class ViewFormAccordionComponent {
  @Input() showEdit: boolean = true;
  @Input() sectionCollapsed!: boolean;
  @Input() sectionTitle!: string;
  @Input() showChildProductToggle: boolean = false;
  @Input() isPrimary = false;
  @Input() editText = 'Edit';
  @Input() showEditDropdown: boolean = false;
  @Input() dropdownItems!: DropdownItem[];
  @Input() hasSecondaryButton: boolean = false;
  @Input() secondaryButtonText: string = 'Active all';
  @Input() isSecondaryButtonDisabled: boolean = true;
  @Input() disableChildToggle: boolean = false;
  @Input() isShowChildProduct: boolean = false;
  @Output() showChildProduct: EventEmitter<boolean> =
    new EventEmitter<boolean>();
  @Output() editClicked: EventEmitter<void> = new EventEmitter<void>();
  @Output() secondaryButtonClicked: EventEmitter<void> =
    new EventEmitter<void>();

  onShowChildProductChanged() {
    this.showChildProduct.emit(this.isShowChildProduct);
  }

  onEdit() {
    this.editClicked.emit();
  }

  onSecondaryButtonClicked() {
    this.secondaryButtonClicked.emit();
  }
}
