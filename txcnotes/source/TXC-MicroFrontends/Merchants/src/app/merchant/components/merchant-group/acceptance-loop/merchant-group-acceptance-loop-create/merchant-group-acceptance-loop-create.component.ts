import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AcceptanceLoopFormGroup } from 'src/app/merchant/models/acceptance-loop-form-group.model';

@Component({
  selector: 'app-merchant-group-acceptance-loop-create',
  templateUrl: './merchant-group-acceptance-loop-create.component.html',
  styleUrls: ['./merchant-group-acceptance-loop-create.component.scss']
})
export class MerchantGroupAcceptanceLoopCreateComponent implements OnInit {

  acceptanceLoopFormGroupDef: AcceptanceLoopFormGroup = new AcceptanceLoopFormGroup();
  acceptanceLoopFormGroup: FormGroup;
  merchantId: number = 0;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly formBuilder: FormBuilder,
  ) { 
    this.acceptanceLoopFormGroup = this.acceptanceLoopFormGroupDef.define(formBuilder);

  }

  ngOnInit(): void {
    const idFromRoute = this.route.snapshot.queryParamMap.get('merchantId');
    this.merchantId = idFromRoute ? Number.parseInt(idFromRoute) : 0;
  }

}
