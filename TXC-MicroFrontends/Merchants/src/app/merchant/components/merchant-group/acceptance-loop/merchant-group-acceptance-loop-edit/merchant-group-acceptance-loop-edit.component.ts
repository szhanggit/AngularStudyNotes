import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AcceptanceLoopFormGroup } from 'src/app/merchant/models/acceptance-loop-form-group.model';

@Component({
  selector: 'app-merchant-group-acceptance-loop-edit',
  templateUrl: './merchant-group-acceptance-loop-edit.component.html',
  styleUrls: ['./merchant-group-acceptance-loop-edit.component.scss']
})
export class MerchantGroupAcceptanceLoopEditComponent implements OnInit {

  acceptanceLoopFormGroupDef: AcceptanceLoopFormGroup = new AcceptanceLoopFormGroup();
  acceptanceLoopFormGroup: FormGroup;
  merchantId: number = 0;
  acceptanceLoopId: number = 0;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly formBuilder: FormBuilder,
  ) {
    this.acceptanceLoopFormGroup = this.acceptanceLoopFormGroupDef.define(formBuilder);
  }

  ngOnInit(): void {
    const merchantIdFromRoute = Number.parseInt(this.route.snapshot.queryParamMap.get('merchantId') as string);
    const acceptanceLoopIdFromRoute = Number.parseInt(this.route.snapshot.paramMap.get('id') as string);

    this.merchantId = isNaN(merchantIdFromRoute) ? 0 : merchantIdFromRoute;
    this.acceptanceLoopId = isNaN(acceptanceLoopIdFromRoute) ? 0 : acceptanceLoopIdFromRoute;
  }
}
