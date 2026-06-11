import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormModel } from '../../models/dumb-models/form.model';
import { OrderSettingsFieldsDefinition } from '../../models/fields-definition/order-settings-fields-definition.model';
import { QuotationStateService } from 'src/app/order/services/state-service/quotation-state.service';
import { DictionaryService } from 'src/app/order/services/dictionary.service';
import { Subject, map, takeUntil } from 'rxjs';
import { Dictionary } from 'src/app/order/models/dictionary.model';

@Component({
  selector: 'app-order-settings',
  templateUrl: './order-settings.component.html',
  styleUrls: ['./order-settings.component.scss'],
})
export class OrderSettingsComponent implements OnInit, OnDestroy {
  @Input() settingsFormGroup!: FormGroup;
  orderSettingsFieldsDefinition!: OrderSettingsFieldsDefinition;
  get settingsFormModel(): FormModel {
    return {
      title: 'Settings',
      formGroup: this.settingsFormGroup,
      fieldsDefinition: this.orderSettingsFieldsDefinition.define(),
      withHorizontalRule: true,
    };
  }

  destroyed$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private quotationStateService: QuotationStateService,
    private dictionaryService: DictionaryService
  ) {}

  ngOnInit(): void {
    this.quotationStateService.selectedOrderMode$.subscribe((orderMode) => {
      this.orderSettingsFieldsDefinition = new OrderSettingsFieldsDefinition(
        orderMode
      );
    });

    this.dictionaryService
      .getChannels()
      .pipe(
        takeUntil(this.destroyed$),
        map((response) => JSON.parse(response.data).dictionaries)
      )
      .subscribe({
        next: (dictionaries: Dictionary[]) => {
          const channelSelect2Data = dictionaries.map((dictionary) => ({
            label: dictionary.displayName,
            value: dictionary.dictionaryId,
          }));

          this.settingsFormModel.fieldsDefinition.find(
            (field) => field.formControlName === 'channelId'
          )!.select2Data = channelSelect2Data;

          this.settingsFormGroup
            .get('channelId')
            ?.setValue(this.settingsFormGroup.get('channelId')?.value);
        },
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
