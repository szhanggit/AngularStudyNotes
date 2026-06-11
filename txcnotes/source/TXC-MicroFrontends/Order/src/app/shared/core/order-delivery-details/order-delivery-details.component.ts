import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ErrorMessage } from '../../models/dumb-models/error-message.model';
import { Product } from '../../models/product.model';
import { DeliveryDetailsFieldsDefinition } from '../../models/fields-definition/delivery-details-fields-definition.model';
import { FormModel } from '../../models/dumb-models/form.model';
import { Subject } from 'rxjs';
import { WizardService } from 'src/app/order/services/wizard.service';
import { QuotationStateService } from 'src/app/order/services/state-service/quotation-state.service';
import { OrderMode } from 'src/app/order/models/quotation-type.model';
import { OrderModeEnum } from 'src/app/order/enums/order-mode.enum';
import {
  EmailTemplateStateService,
} from 'src/app/order/services/state-service/email-template-state.service';
import { EmailTemplateOption } from 'src/app/order/interface/product-state.interface';

@Component({
  selector: 'app-order-delivery-details',
  templateUrl: './order-delivery-details.component.html',
  styleUrls: ['./order-delivery-details.component.scss'],
})
export class OrderDeliveryDetailsComponent implements OnInit, OnDestroy {
  @Input() productList: Product[] = [];
  @Input() orderStep: number = 0;
  @Input() deliveryDetailsFormGroup!: FormGroup;
  @Output() editDeliveryDetailsClicked: EventEmitter<number> =
    new EventEmitter<number>();
  @Output() formInvalid: EventEmitter<boolean> = new EventEmitter<boolean>();
  destroyed$: Subject<boolean> = new Subject<boolean>();

  productSelectionOnInitialState = true;
  productSelectionErrorMessages: ErrorMessage[] = [];
  fromUpload = false;
  editMode = false;
  title = 'Customize delivery content';

  deliveryDetailsFieldsDefinition!: DeliveryDetailsFieldsDefinition;

  emailTemplateData = [];

  get deliveryDetailsFormModel(): FormModel {
    return {
      title: 'Default delivery content',
      formGroup: this.deliveryDetailsFormGroup,
      fieldsDefinition: this.deliveryDetailsFieldsDefinition.define(),
    };
  }

  defaultContentFormGroup!: FormGroup;
  selectedTenant: string = '';

  selectedOrderMode!: OrderMode;
  orderTypes = OrderModeEnum;

  constructor(
    private wizardService: WizardService,
    private quotationStateService: QuotationStateService,
    private emailTemplateStateService: EmailTemplateStateService
  ) {}

  ngOnInit() {
    this.setSelectedQuotationType();
    this.emailTemplateStateService.selectedEmailTemplates$.subscribe(
      (templates) => {
        this.deliveryDetailsFieldsDefinition =
          new DeliveryDetailsFieldsDefinition(
            templates.map((template) => {
              return {
                value: template.templateId,
                label: template.templateName,
              } as EmailTemplateOption;
            })
          );
      }
    );

    this.wizardService.checkFormValidation(
      this.deliveryDetailsFormGroup,
      this.formInvalid,
      this.destroyed$,
      true
    );
  }

  setSelectedQuotationType() {
    this.quotationStateService.selectedOrderMode$.subscribe(
      (orderMode) => (this.selectedOrderMode = orderMode)
    );
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  onEditDeliveryDetailsClicked($event: number): void {
    this.editDeliveryDetailsClicked.emit($event);
  }
}
