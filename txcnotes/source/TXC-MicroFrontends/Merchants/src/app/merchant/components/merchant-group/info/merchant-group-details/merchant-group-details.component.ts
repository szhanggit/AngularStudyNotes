import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { NgbdToastGlobal } from '@txc-angular/component-library';
import { MerchantGroup, MerchantGroupView } from '../../../../models/get-merchant-group-response.model';
import { IDetailsToastDefinition, VnrCancelledToast, VnrCreatedToast, VnrUpdatedToast } from '../../../../models/merchant-group-details-toast.model';
import { IProgram } from '../../../../models/program.model';
import { MerchantGroupService } from '../../../../services/merchant-group.service';
import { ProgramService } from '../../../../services/program.service';
import { TenantConfigService } from '../../../../services/tenant-config.service';
import { VoucherNumberRuleListComponent } from '../../../voucher-number-rule/voucher-number-rule-list/voucher-number-rule-list.component';
import { AuthorizationLibraryService } from '@txc-angular/authorization-library';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'merchant-group-details',
  templateUrl: './merchant-group-details.component.html',
  styleUrls: ['./merchant-group-details.component.scss']
})
export class MerchantGroupDetailsComponent implements OnInit {
  @ViewChild(NgbdToastGlobal) toast!: NgbdToastGlobal;
  @ViewChild('voucherNumberRule') vnrListComp!: VoucherNumberRuleListComponent;

  tenant!: string;
  merchantId: number;
  merchantGroup!: MerchantGroupView;
  action!: string;

  currentProgram!: IProgram;
  isLoadingDetails: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  toastDefinitions: IDetailsToastDefinition[] = [];
  merchantCount: number = 0;

  // getter for merchant editor flag
  get isMerchantEditor(): boolean {
    return this.authLibraryService.getElementOperationFlag([environment.merchant_create_op_id]);
  }

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly tenantConfigService: TenantConfigService,
    private readonly programService: ProgramService,
    private readonly authLibraryService: AuthorizationLibraryService,
    private readonly router: Router,
    private merchantGroupService: MerchantGroupService,
  ) {
    const tenantFromRoute = this.activatedRoute.snapshot.queryParamMap.get('tenantName');
    this.tenant = this.tenantConfigService.getTenant(tenantFromRoute).name;
    const idFromRoute = this.activatedRoute.snapshot.queryParamMap.get('merchantId');
    this.merchantId = idFromRoute ? Number.parseInt(idFromRoute) : 0;
  }

  ngOnInit(): void {
    this.merchantGroupService.getMerchantGroupByMerchantId(this.merchantId).subscribe(
      (res) => {
        const result = JSON.parse(res.data);
        const mg: MerchantGroup = result?.merchantGroups?.items ? result.merchantGroups.items[0] : {};
        this.merchantGroupService.merchantGroupId = mg.merchantGroupId ? mg.merchantGroupId : 0;
        this.merchantGroup = {
          merchantGroupId: mg.merchantGroupId ?? 0,
          merchantId: mg.merchantId ?? 0,
          programId: mg.merchant?.programId ?? 0,
          name: mg.merchant?.name ?? '',
          status: mg.merchant?.status ?? 0,
          merchantGroupMerchantMaps: mg.merchantGroupMerchantMaps?.filter(x=> x.status === true) || []
        }

        this.merchantCount = (this.merchantGroup.merchantGroupMerchantMaps?.length) || 0;

        // get program by id using graphql endpoint
        this.programService.getProgramId(this.merchantGroup.programId).subscribe({
          next: (res: any) => {
            this.currentProgram = JSON.parse(res.data).programs.items[0];

            // to expand panel if record is added/updated
            setTimeout(() => {
              this.action = history.state?.action;
              if (this.merchantGroup) {
                this.toastDefinitions = [
                  new VnrCreatedToast(this.toast, this.vnrListComp),
                  new VnrUpdatedToast(this.toast, this.vnrListComp),
                  new VnrCancelledToast(this.toast, this.vnrListComp),
                ];
                if (this.action) {
                  let def = this.toastDefinitions.find(f => f.action === this.action);
                  if (def && !def.cancelled) {
                    def.getMessageToast();
                  }
                }
              }
            });
          },
          error: (err: any) => {
            this.toast.showDanger(err.error.Message ?? err.error.message);
          },
          complete: () => {
            this.isLoadingDetails.next(false);
          }
        });
      },
      (err) => {
        this.toast.showDanger(err.error.message);
      });
  }

}
