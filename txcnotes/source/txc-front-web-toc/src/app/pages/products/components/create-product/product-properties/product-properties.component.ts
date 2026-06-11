import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { ExternalProperty } from '../../../models/external-property';
import { ProductCustomizationService } from '../../../services/product-customization.service';

@Component({
  selector: 'app-product-properties',
  templateUrl: './product-properties.component.html',
  styleUrls: ['./product-properties.component.scss']
})
export class ProductPropertiesComponent implements OnInit {
  @Input() selectedTenant!: string;
  @Input() selectedExternalProperties: ExternalProperty[] = [];
  @Output() onExternalPropertiesChanged = new EventEmitter<ExternalProperty[]>();

  externalPropertyFormGroup!: FormGroup;

  editMode = false;

  // form
  get f() {
    return this.externalPropertyFormGroup.controls;
  }

  constructor(public productCustomizationSvc: ProductCustomizationService,
    private readonly _formBuilder: FormBuilder,
    private readonly _modalSvc: NgbModal,) { }

  ngOnInit(): void {
    this.externalPropertyFormGroup = this._formBuilder.group({
      propertyName: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.minLength(2), Validators.maxLength(100)]),
      propertyValue: new FormControl({ value: '', disabled: false }),
      description: new FormControl({ value: '', disabled: false }),
      productExternalPropertyId: new FormControl({ value: 1, disabled: false }),
      productExternalPropertySetId: new FormControl({ value: 1, disabled: false }),
    });
  }

  openAddExternalPropertyModal(content: TemplateRef<NgbModal>, index?: number): void {
    if (index > -1) {
      this.f.propertyName.setValue(this.selectedExternalProperties[index].propertyName);
      this.f.propertyValue.setValue(this.selectedExternalProperties[index].propertyValue);
      this.f.description.setValue(this.selectedExternalProperties[index].description);
      this.editMode = true;
    }

    const modalRef = this._modalSvc.open(content, { size: 'md', backdrop: 'static', centered: true });

    modalRef.result.then((data) => {
      if (data === 'Save') {
        if (this.editMode) {
          this.selectedExternalProperties.splice(index, 1, this.externalPropertyFormGroup.value);
          this.editMode = false;
        } else {
          this.selectedExternalProperties.push(this.externalPropertyFormGroup.value);
        }

        this.externalPropertyFormGroup.reset();
        this.onExternalPropertiesChanged.emit(this.selectedExternalProperties);
      }
    })
  }

  deleteExternalProperty(index: number): void {
    this.selectedExternalProperties.splice(index, 1);
    this.onExternalPropertiesChanged.emit(this.selectedExternalProperties);
  }

  toggleTooltipWithContext(tooltip: NgbTooltip, formControl: AbstractControl) {
    if (tooltip.isOpen()) {
      tooltip.close();
    } else {
      tooltip.open({ formControl });
    }
  }

}
