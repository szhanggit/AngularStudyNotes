import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbModal, NgbModalRef, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SkuService } from '../../../services/sku.service';
import { debounceTime, timeout } from 'rxjs/operators';
import { BaseResponse } from '../../../services/base-response.model';
import { ContractPeriodSkuCost, UpdateContractPeriod } from 'src/app/merchant/models/update-contract-period';
import { UpdateContractRequest } from 'src/app/merchant/models/update-contract-period';
import { SkuData } from 'src/app/merchant/models/update-contract-period';
import { SkuCostData } from 'src/app/merchant/models/update-contract-period';
import { ContractService } from 'src/app/merchant/services/contract.service';
import { NgbdToastGlobal, TxcDateTimeService } from '@txc-angular/component-library';
import { BehaviorSubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilityService } from 'src/app/merchant/services/utility.service';
import { DatePickerType, DateOutputValues } from 'src/app/merchant/enums/date-picker.enum';


@Component({
  selector: 'app-contract-modal-edit-period',
  templateUrl: './contract-modal-edit-period.component.html',
  styleUrls: ['./contract-modal-edit-period.component.scss']
})

export class ContractModalEditPeriodComponent implements OnInit {
  @Input() data!: ModalInputData;
  @ViewChild(NgbdToastGlobal) toast!: NgbdToastGlobal;
  @ViewChild('popup') popupMessageModal!: NgbModal;

  type = DatePickerType
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  formGroup: FormGroup;
  title = '';
  contractDetails: any;
  isFutureDate: boolean = false;
  totaldisplayMonths: number = 1;
  readonly DELIMITER = '/';
  today: NgbDate;
  fromDate: NgbDate;
  toDate: NgbDate | null = null;
  //toDate: NgbDate;
  hoveredDate: NgbDate | null = null;
  controlDatewidth: string = "";
  contractId: number = 0;
  merchantID: number = 0;
  skuList: any = [];
  totalCount: number = 0;
  apiTimeout: number = 1000;
  debounceTime: number = 3000;
  isLoadSku: boolean = false;
  isContractCostBroundaryIssue: boolean = false;
  IsSKUSelectedAll: boolean = false;
  allSKUList: SkuCostParameters[] = [];
  selectedSKUIds: ContractPeriodSkuCost[] = [];
  popupMessageString: string = '';
  popupModalRef: NgbModalRef | null = null;
  readonly outOfBoundaryMessage: string = "Please check the SKUs highlighted in red since their period is out of the contract Boundaries.";
  allcheckboxchecked: boolean = true;


   existingContarctStartDateMilliSecs :any;
   existingContractEndDateMilliSecs :any; 
  
   newContractStartDate :any; 
   newContractEndDate :any; 
  
   newContractStartDateMilliSecs :any; 
   newContractEndDateMilliSecs :any; 


  //setup sku cost period dates
   existingSkuStartDateMilliSecs :any; 
   existingSkuEndDateMilliSecs :any; 

    
  // form
  get f(): any {
    return this.formGroup.controls;
  }


    
    constructor(
      private readonly _router: Router,
      calendar: NgbCalendar,private readonly _formBuilder: FormBuilder,
      private contractService : ContractService,
      public formatter: NgbDateParserFormatter,
      private SkuService : SkuService,
      private readonly modalService: NgbModal,
      private activeModal: NgbActiveModal,
      private utilityService: UtilityService,
      private txcDateTimeService : TxcDateTimeService
    ) { 

          this.today = new NgbDate(calendar.getToday().year,calendar.getToday().month, calendar.getToday().day);
          this.fromDate = this.today;
          this.toDate = this.today;
          this.formGroup = this._formBuilder.group({
            period: new FormControl({ value: '', disabled: false }, [Validators.required]),
          });
          this.formGroup.addControl('allcheckboxchecked', new FormControl(''));
  }

  toModel(date: NgbDate | null): string | null {
    return date ? date.year + this.DELIMITER + date.month + this.DELIMITER + date.day : null;
  }

  ngOnInit(): void {
    
    this.title = this.data.title;
    this.contractDetails = this.data.data;
    this.isFutureDate=this.data.isFutureDate;
    this.totaldisplayMonths=this.isFutureDate ? 2 : 1;
    this.controlDatewidth=this.isFutureDate ? "dateControlWidth100" : "dateControlWidth50";

    //Conversion UTC to Local Timezone
    this.contractDetails.startDate=this.txcDateTimeService.getLocalDateTime(this.contractDetails.startDate);
    this.contractDetails.endDate=this.txcDateTimeService.getLocalDateTime(this.contractDetails.endDate);
    //End conversion
    
    this.fromDate = new NgbDate((new Date(this.contractDetails.startDate)).getFullYear(), (new Date(this.contractDetails.startDate)).getMonth()+1, (new Date(this.contractDetails.startDate)).getDate());
    this.toDate = new NgbDate((new Date(this.contractDetails.endDate.slice(0,10))).getFullYear(), (new Date(this.contractDetails.endDate.slice(0,10))).getMonth()+1, (new Date(this.contractDetails.endDate.slice(0,10))).getDate());
  
    this.contractId=this.contractDetails.contractId;
    this.merchantID=this.data.merchantId;
    if(this.isFutureDate)
    {
      this.f.period.setValue(this.toModel(this.fromDate) +' ~ '+ this.toModel(this.toDate));
    }
    else {
      this.f.period.setValue(this.toModel(this.toDate));
    }

  }

  onDateSelectionChange(event: DateOutputValues) {
    if (event) {
      if (this.isFutureDate) {
        this.fromDate = event.ngbFromDate!;
        this.toDate = event.ngbToDate!;
      } else {
        this.toDate = event.ngbSimpleDate!;
      }
      
    }
  }

  //Close modal
  public closeModal(): void {
    let startdateReverse=new Date(this.contractDetails.startDate);
    let enddateReverse=new Date(this.contractDetails.endDate);
    this.contractDetails.startDate= this.txcDateTimeService.getUtcDateTime(new Date(startdateReverse.getFullYear() + "-" + ((startdateReverse.getMonth() + 1).toString().padStart(2, '0')) + "-" + startdateReverse.getDate().toString().padStart(2, '0') + " 00:00:00"));
    this.contractDetails.endDate= this.txcDateTimeService.getUtcDateTime(new Date(enddateReverse.getFullYear() + "-" + ((enddateReverse.getMonth() + 1).toString().padStart(2, '0')) + "-" + enddateReverse.getDate().toString().padStart(2, '0') + " 23:59:59"));
    this.activeModal.close();
  }

  //Back to Edit Contract Period
  public Back(): void {
    this.isLoadSku=false;
  }

  //Get All SKU by Contract ID
  getSkuList() {
    this.SkuService.getAllByContractId(0, 100, "", this.contractId).pipe(
      debounceTime(this.debounceTime)
    ).subscribe((response: BaseResponse) => {
      if (response.success) {
        this.skuList = JSON.parse(response.data).contractSKUByContractId.items;
        this.totalCount = this.skuList.length;
        this.isContractCostBroundaryIssue = false;
        this.validateContractPeriod();
        //in case of out of boudary scenarios of future contract, error message will be displayed and save button will be disabled.
        if (this.isContractCostBroundaryIssue) {
          this.toast.showDanger(this.outOfBoundaryMessage, 10000);
        }
      }
    });
  }

  //Add the New Propery
  validateContractPeriod() {
    this.allSKUList=[];

    this.skuList.forEach((skuData: { id: number, skuName: string, skuNumber: string, contractSKUCosts: any[]; }) => {
      skuData.contractSKUCosts.forEach(costData => {
        const skuDetails = {} as SkuCostParameters;
        skuDetails.skuId = skuData.id;
        skuDetails.skuCostId = costData.id;
        skuDetails.skuName = skuData.skuName;
        skuDetails.skuNumber = skuData.skuNumber;
        skuDetails.cost = costData.cost;
        skuDetails.validStartDate = new Date(this.txcDateTimeService.getLocalDateTime(costData.validStartDate));
        skuDetails.newValidStartDate = new Date(this.txcDateTimeService.getLocalDateTime(costData.validStartDate));
        skuDetails.validEndDate =new Date(this.txcDateTimeService.getLocalDateTime(costData.validEndDate));
        skuDetails.newValidEndDate = new Date(this.txcDateTimeService.getLocalDateTime(costData.validEndDate));
        this.ValidationContractPeriod(skuDetails, this.isFutureDate);
        this.allSKUList.push(skuDetails);
      })
    });
    this.allSKUList.forEach((skuData, index) => {
        this.formGroup.addControl('isSKUSelected_' + index, new FormControl('', Validators.required));

    });
   this.updateMasterCheckboxState();
  }

  //Function to validate the contract Period
  private ValidationContractPeriod(skuCostDetails: SkuCostParameters, isFutureContract: boolean) {
    //setup sku cost period dates
    this.existingSkuStartDateMilliSecs = Date.parse(skuCostDetails.validStartDate.toLocaleDateString());
    this.existingSkuEndDateMilliSecs = Date.parse(skuCostDetails.validEndDate.toLocaleDateString());
    this.SetContractPeriodVariables();
      //validations for FUTURE contract
      //out of boundary scenarios
      if ((this.existingSkuEndDateMilliSecs <= this.newContractStartDateMilliSecs && this.existingSkuStartDateMilliSecs < this.newContractStartDateMilliSecs)
       || (this.existingSkuStartDateMilliSecs >= this.newContractEndDateMilliSecs && this.existingSkuEndDateMilliSecs > this.newContractEndDateMilliSecs))
      {
        this.OutofBoundries(skuCostDetails);
      }
      //contract period extension scenarios
      else if (this.newContractStartDateMilliSecs <= this.existingContarctStartDateMilliSecs && this.newContractEndDateMilliSecs >= this.existingContractEndDateMilliSecs) {
        this.ContractExtension(this.existingSkuStartDateMilliSecs, this.existingContarctStartDateMilliSecs, this.existingSkuEndDateMilliSecs, this.existingContractEndDateMilliSecs, skuCostDetails, this.newContractStartDate, this.newContractEndDate);
      }
      //Shortning and intersecting boundary scenarios
      else if (this.newContractStartDateMilliSecs >= this.existingContarctStartDateMilliSecs && this.newContractEndDateMilliSecs <= this.existingContractEndDateMilliSecs) {
        this.ContractShortning(this.existingSkuStartDateMilliSecs, this.newContractStartDateMilliSecs, skuCostDetails, this.newContractStartDate, this.existingSkuEndDateMilliSecs, this.newContractEndDateMilliSecs, this.newContractEndDate);
      }
      //New condition for sliding the left 
      else if (this.newContractStartDateMilliSecs >= this.existingContarctStartDateMilliSecs && this.newContractEndDateMilliSecs >= this.existingContractEndDateMilliSecs) {
        this.ContractLeftShortning(this.existingContarctStartDateMilliSecs,this.existingContractEndDateMilliSecs, this.existingSkuStartDateMilliSecs, this.newContractStartDateMilliSecs, skuCostDetails, this.newContractStartDate, this.existingSkuEndDateMilliSecs, this.newContractEndDateMilliSecs, this.newContractEndDate);
      }
      //New condition for sliding the right
      else if (this.newContractStartDateMilliSecs <= this.existingContarctStartDateMilliSecs && this.newContractEndDateMilliSecs <= this.existingContractEndDateMilliSecs) {
        this.ContractRightShortning(this.existingContarctStartDateMilliSecs,this.existingContractEndDateMilliSecs,this.existingSkuStartDateMilliSecs, this.newContractStartDateMilliSecs, skuCostDetails, this.newContractStartDate, this.existingSkuEndDateMilliSecs, this.newContractEndDateMilliSecs, this.newContractEndDate);
      }
      else {
        //new unhandled scenarios
        skuCostDetails.isDisable = true;
        skuCostDetails.isSelected = false;
        skuCostDetails.needRedErrorColor = true;
      }
  }

  private SetContractPeriodVariables() {
    this.existingContarctStartDateMilliSecs = Date.parse(this.contractDetails.startDate.toString().slice(0,10));
    this.existingContractEndDateMilliSecs = Date.parse(this.contractDetails.endDate.toString().slice(0,10));

    this.newContractStartDate = new Date(this.getDateString(this.fromDate.year, this.fromDate.month, this.fromDate.day));
    this.newContractEndDate = this.toDate == null ? new Date() : new Date(this.getDateString(this.toDate.year, this.toDate.month, this.toDate.day));

    this.newContractStartDateMilliSecs = Date.parse(this.newContractStartDate.toString());
    this.newContractEndDateMilliSecs = Date.parse(this.newContractEndDate.toString());
    
  }

  //Method for Handling secario for contract Shorting
  private ContractShortning(existingSkuStartDateMilliSecs: number, newContractStartDateMilliSecs: number, skuCostDetails: SkuCostParameters, newContractStartDate: Date, existingSkuEndDateMilliSecs: number, newContractEndDateMilliSecs: number, newContractEndDate: Date) {
   
    if (existingSkuStartDateMilliSecs < newContractStartDateMilliSecs) {
      skuCostDetails.isDisable = true;
      skuCostDetails.isSelected = true;
      skuCostDetails.newValidStartDate = newContractStartDate;
      skuCostDetails.needRedErrorColor = false;
    }
    if (existingSkuEndDateMilliSecs > newContractEndDateMilliSecs) {
      skuCostDetails.isDisable = true;
      skuCostDetails.isSelected = true;
      skuCostDetails.newValidEndDate = newContractEndDate;
      skuCostDetails.needRedErrorColor = false;
    }

    if (existingSkuStartDateMilliSecs >= newContractStartDateMilliSecs && existingSkuEndDateMilliSecs <= newContractEndDateMilliSecs) {
      //within boundary scenarios
      skuCostDetails.isDisable = true;
      skuCostDetails.isSelected = false;
      skuCostDetails.needRedErrorColor = false;
    }
  }


  //Left Side Move Contract
  private ContractLeftShortning(existingContarctStartDateMilliSecs:number,existingContarctEndDateMilliSecs:number, existingSkuStartDateMilliSecs: number, newContractStartDateMilliSecs: number, skuCostDetails: SkuCostParameters, newContractStartDate: Date, existingSkuEndDateMilliSecs: number, newContractEndDateMilliSecs: number, newContractEndDate: Date) {
    if (existingSkuStartDateMilliSecs < newContractStartDateMilliSecs
      && existingSkuEndDateMilliSecs >  newContractStartDateMilliSecs
      ) {
      skuCostDetails.isDisable = true;
      skuCostDetails.isSelected = true;
      skuCostDetails.newValidStartDate = newContractStartDate;
      skuCostDetails.needRedErrorColor = false;
    }
    else if(existingSkuEndDateMilliSecs == existingContarctEndDateMilliSecs){
      skuCostDetails.isDisable = false;
      skuCostDetails.isSelected = true;
      skuCostDetails.needRedErrorColor = false;
      skuCostDetails.newValidEndDate = newContractEndDate;
     }
    else if (existingSkuStartDateMilliSecs != existingContarctStartDateMilliSecs || 
      existingSkuEndDateMilliSecs != existingContarctEndDateMilliSecs) {
      skuCostDetails.isDisable = true;
      skuCostDetails.isSelected = false;
      skuCostDetails.needRedErrorColor = false;
    }
    else if(existingSkuStartDateMilliSecs == existingContarctStartDateMilliSecs &&  existingSkuEndDateMilliSecs == existingContarctEndDateMilliSecs){
      skuCostDetails.isDisable = true;
      skuCostDetails.isSelected = true;
      skuCostDetails.needRedErrorColor = false;
      skuCostDetails.newValidStartDate = newContractStartDate;
      skuCostDetails.newValidEndDate = newContractEndDate;
     }
    else{
      skuCostDetails.isDisable = true;
      skuCostDetails.isSelected = false;
      skuCostDetails.needRedErrorColor = false;
    }
  }

  //Right Side Move Contract
  private ContractRightShortning(existingContarctStartDateMilliSecs:number,existingContarctEndDateMilliSecs:number, existingSkuStartDateMilliSecs: number, newContractStartDateMilliSecs: number, skuCostDetails: SkuCostParameters, newContractStartDate: Date, existingSkuEndDateMilliSecs: number, newContractEndDateMilliSecs: number, newContractEndDate: Date) {
    if (existingSkuEndDateMilliSecs > newContractEndDateMilliSecs) {
      skuCostDetails.isDisable = true;
      skuCostDetails.isSelected = true;
      skuCostDetails.needRedErrorColor = false;
      skuCostDetails.newValidEndDate = newContractEndDate;
    }
    else if (existingSkuStartDateMilliSecs != existingContarctStartDateMilliSecs && existingSkuEndDateMilliSecs != existingContarctEndDateMilliSecs) {
      skuCostDetails.isDisable = true;
      skuCostDetails.isSelected = false;
      skuCostDetails.needRedErrorColor = false;
    }
    else if(existingSkuStartDateMilliSecs == existingContarctStartDateMilliSecs &&  existingSkuEndDateMilliSecs == existingContarctEndDateMilliSecs){
        skuCostDetails.isDisable = true;
        skuCostDetails.isSelected = true;
        skuCostDetails.needRedErrorColor = false;
        skuCostDetails.newValidStartDate = newContractStartDate;
        skuCostDetails.newValidEndDate = newContractEndDate;
    }
    else if (existingSkuStartDateMilliSecs === existingContarctStartDateMilliSecs && this.newContractStartDateMilliSecs < this.existingContarctStartDateMilliSecs) {
      skuCostDetails.isDisable = false;
      skuCostDetails.isSelected = true;
      skuCostDetails.newValidStartDate = newContractStartDate;
      skuCostDetails.needRedErrorColor = false;
    }
    else{
      skuCostDetails.isDisable = true;
      skuCostDetails.isSelected = false;
      skuCostDetails.needRedErrorColor = false;
    }
  }



  //Method for Handling secario for contract Extension
  private ContractExtension(existingSkuStartDateMilliSecs: number, existingContarctStartDateMilliSecs: number, existingSkuEndDateMilliSecs: number, existingContractEndDateMilliSecs: number, skuCostDetails: SkuCostParameters, newContractStartDate: Date, newContractEndDate: Date) {
    if (existingSkuStartDateMilliSecs != existingContarctStartDateMilliSecs && existingSkuEndDateMilliSecs != existingContractEndDateMilliSecs) {
      skuCostDetails.isDisable = true;
      skuCostDetails.isSelected = false;
      skuCostDetails.needRedErrorColor = false;
    } else if (existingSkuStartDateMilliSecs === existingContarctStartDateMilliSecs && existingSkuEndDateMilliSecs === existingContractEndDateMilliSecs) {
      skuCostDetails.isDisable = false;
      skuCostDetails.isSelected = true;
      skuCostDetails.newValidStartDate = newContractStartDate;
      skuCostDetails.newValidEndDate = newContractEndDate;
      skuCostDetails.needRedErrorColor = false;
    } else if (existingSkuStartDateMilliSecs === existingContarctStartDateMilliSecs && this.newContractStartDateMilliSecs < this.existingContarctStartDateMilliSecs) {
      skuCostDetails.isDisable = false;
      skuCostDetails.isSelected = true;
      skuCostDetails.newValidStartDate = newContractStartDate;
      skuCostDetails.needRedErrorColor = false;
    } else if (existingSkuEndDateMilliSecs === existingContractEndDateMilliSecs && this.newContractEndDateMilliSecs > this.existingContractEndDateMilliSecs) {
      skuCostDetails.isDisable = false;
      skuCostDetails.isSelected = true;
      skuCostDetails.newValidEndDate = newContractEndDate;
      skuCostDetails.needRedErrorColor = false;
    } else {
      skuCostDetails.isDisable = true;
      skuCostDetails.isSelected = false;
      skuCostDetails.needRedErrorColor = false;
    }
  }

  //Method for Handling secario for Out of boundries
  private OutofBoundries(skuCostDetails: SkuCostParameters) {
    skuCostDetails.isDisable = true;
    skuCostDetails.isSelected = false;
    skuCostDetails.needRedErrorColor = true;
    this.isContractCostBroundaryIssue = true;
  }

  //To Render the SKU list on Next Button 
   renderSKUList(): void {
    this.SetContractPeriodVariables();
    //checking change in contract period 
       if ( this.existingContarctStartDateMilliSecs == this.newContractStartDateMilliSecs && this.existingContractEndDateMilliSecs == this.newContractEndDateMilliSecs) 
        { 
          this.toast.showDanger("No changes in contract start date & contract end date");
        }
       else
       { 
        this.isLoadSku = true;
        this.getSkuList(); 
       }
  }


  //method to update contract period
  updateContractPeriod() {
    if (this.isFutureDate) {
      if (!this.isContractCostBroundaryIssue) {
        this.saveFutureContractPeriod();
      }
      else {
        this.toast.showDanger(this.outOfBoundaryMessage, 10000);
      }
    }
    else {
      this.saveOngoingContractPeriod();
    }
  }

  //This method creates request object for update contract, 
  //prepares data of updated SKU cost periods and calls API to update future contract period
  private saveFutureContractPeriod() {
    //Local to UTC Date Conversion
    let newContractStartDate = new Date(this.getDateString(this.fromDate.year, this.fromDate.month, this.fromDate.day));
    let newContractEndDate = this.toDate == null ? new Date() : new Date(this.getDateString(this.toDate.year, this.toDate.month, this.toDate.day));
   
    let request = {} as UpdateContractRequest;
    this.requestMapperSaveContractPeriod(request, newContractStartDate, newContractEndDate);
    
    let selectedCostPeriods = this.allSKUList.filter(costs => costs.isSelected == true);
    if (selectedCostPeriods.length > 0) {
      request.sku = this.getUpdatedSkuCostData(selectedCostPeriods);
    }
    //calling API
    if(console) console.log(request, "temporary log, will be removed after bug fix");
    this.contractService.updateFutureContractPeriod(request).subscribe(
      (data: BaseResponse) => {
        if (data.success === true) {
          setTimeout(() => {
            let message = "Contract period updated successfully";
            this.toast.showSuccess(message);
          }, 2000);
          this.activeModal.close();
          this.navigateToContractDetails();
        }
      },
      (err: any) => {
        this.toasterErrorMessage(err);
      });
  }

  //API Error Message
  private toasterErrorMessage(err: any) {
    if (Array.isArray(err.error.data)) {
      if (err.error.data.length == 1) {
        this.commonpopup(err.error.data[0]);
      }
      else {
        this.utilityService.ShowUniqueValidationErrors(err.error.data, this.toast);
      }
    }
    if (Array.isArray(err.error.data.contractSkuCostValidationError)) {
      if (err.error.data.contractSkuCostValidationError.length == 1) {
        this.commonpopup(err.error.data.contractSkuCostValidationError[0].errorMessage);
      }
      else {
        this.utilityService.ShowUniqueValidationErrors(err.error.data.contractSkuCostValidationError, this.toast);
      }
    }
    if (Array.isArray(err.error.data.contractValidationError)) {
      if (err.error.data.contractValidationError.length == 1) {
        this.commonpopup(err.error.data.contractValidationError[0].errorMessage);
      }
      else {
        this.utilityService.ShowUniqueValidationErrors(err.error.data.contractValidationError, this.toast);
      }
    }
    if (Array.isArray(err.error.data.contractSkuValidationError)) {
      if (err.error.data.contractSkuValidationError.length == 1) {
        this.commonpopup(err.error.data.contractSkuValidationError[0].errorMessage);
      }
      else {
        this.utilityService.ShowUniqueValidationErrors(err.error.data.contractSkuValidationError, this.toast);
      }
    }
  }

  private commonpopup(errmsg: any) {
    this.isLoading$.next(false);
    const element = errmsg;
    this.openPopup(element);
  }

  //Set the request Object
  private requestMapperSaveContractPeriod(request: UpdateContractRequest, newContractStartDate: Date, newContractEndDate: Date) {
    
    request.contractId = this.contractDetails.contractId;
    request.contractName = this.contractDetails.contractName;
    request.startDate = this.txcDateTimeService.getUtcDateTime(new Date(newContractStartDate.getFullYear() + "-" + ((newContractStartDate.getMonth() + 1).toString().padStart(2, '0')) + "-" + newContractStartDate.getDate().toString().padStart(2, '0') + " 00:00:00"));
    request.endDate = this.txcDateTimeService.getUtcDateTime(new Date(newContractEndDate.getFullYear() + "-" + ((newContractEndDate.getMonth() + 1).toString().padStart(2, '0')) + "-" + newContractEndDate.getDate().toString().padStart(2, '0') + " 23:59:59"));;
    request.paymentTermId = this.contractDetails.contractPaymentTerm.id;
    request.priceOptionId = this.contractDetails.contractPriceOption.id;
    request.costSchemeId = this.contractDetails.contractCostScheme.id;
    request.costPercentage = this.contractDetails.costPercentage;
    request.costRoundingRuleId = this.contractDetails.contractCostRoundingRule.id;
    request.costRoundingPlaceId = this.contractDetails.contractCostRoundingPlaces.id;
  }

  //this methos constructs SKU object array for update contract request
  private getUpdatedSkuCostData(skuCostToUpdateArray: SkuCostParameters[]) {
    let skuRequestObjectArray = [] as SkuData[];
    //fetching unique SKU ids
    let distinctSkuIdArray = new Set(skuCostToUpdateArray.map(x => x.skuId));
    distinctSkuIdArray.forEach(skuId => {
      let originalSku = this.skuList.find((x: any) => x.id == skuId);
      //constructing sku data
      let skuRequestObject = {} as SkuData;
      skuRequestObject.skuId = originalSku.id;
      skuRequestObject.skuName = originalSku.skuName;
      skuRequestObject.skuNumber = originalSku.skuNumber;
      skuRequestObject.skuTypeId = originalSku.skuType.id;
      skuRequestObject.faceValueWithTax = originalSku.faceValueWithTax;
      skuRequestObject.voucherNumberRuleId = originalSku.voucherNumberRule.voucherNumberRuleId;
      if (originalSku.multiplier != null) {
        skuRequestObject.multiplier = originalSku.multiplier;
      }
      //constructing sku cost data
      let costDataOfSku = skuCostToUpdateArray.filter((x: SkuCostParameters) => x.skuId == skuId);
      if (costDataOfSku != null && costDataOfSku.length > 0) {
        skuRequestObject.skuCost = [];
        costDataOfSku.forEach(costData => {
          let skuCostRequestObject = {} as SkuCostData;
          let origitalSkuCostData = originalSku.contractSKUCosts.find((x: any) => x.id == costData.skuCostId)
          skuCostRequestObject.skuCostId = origitalSkuCostData.id;
          skuCostRequestObject.cost = origitalSkuCostData.cost;
          skuCostRequestObject.statusId = origitalSkuCostData.contractSkuStatus.id;
          skuCostRequestObject.validStartDate = (costData.newValidStartDate == null) ? skuCostRequestObject.validStartDate : this.txcDateTimeService.getUtcDateTime(new Date(costData.newValidStartDate.getFullYear() + "-" + (((costData.newValidStartDate.getMonth() + 1).toString().padStart(2, '0')) + "-" + costData.newValidStartDate.getDate().toString().padStart(2, '0') + " 00:00:00"))).toString();
          skuCostRequestObject.validEndDate = (costData.newValidEndDate == null) ? skuCostRequestObject.validEndDate : this.txcDateTimeService.getUtcDateTime(new Date(costData.newValidEndDate.getFullYear() + "-" + (((costData.newValidEndDate.getMonth() + 1).toString().padStart(2, '0')) + "-" + costData.newValidEndDate.getDate().toString().padStart(2, '0') + " 23:59:59"))).toString();
          skuRequestObject.skuCost.push(skuCostRequestObject);
        });
      }
      skuRequestObjectArray.push(skuRequestObject)
    });
    return skuRequestObjectArray;
  }

  //Save the SKU List
  private saveOngoingContractPeriod() {
    this.selectedSKUIds = [];
    this.allSKUList.forEach(x => {
      if (x.isSelected) {
        const contractPeriodSkuCostId = {} as ContractPeriodSkuCost;
        contractPeriodSkuCostId.skuCostId = x.skuCostId;
        this.selectedSKUIds.push(contractPeriodSkuCostId);
      }
    })
    {
      var requestPayLoad: UpdateContractPeriod = {
        contractId: this.contractDetails.contractId,
        //Local to UTC Date Conversion
        endDate: this.txcDateTimeService.getUtcDateTime(new Date(this.toDate?.year + "-" + (this.toDate?.month.toString().padStart(2, '0')) + "-" + this.toDate?.day.toString().padStart(2, '0') + " 23:59:59")),
        skuCosts: this.selectedSKUIds
      }
      this.contractService.updateContractPeriod(requestPayLoad).subscribe(
        (data: BaseResponse) => {
          if (data.success === true) {
            setTimeout(() => {
              let message = "Contract period updated successfully";
              this.toast.showSuccess(message);
            }, 2000);
            this.activeModal.close();
            this.navigateToContractDetails();
          }
        },
        (err: any) => {
          if (Array.isArray(err.error.data)) {
            if (err.error.data.length == 1) {
              this.isLoading$.next(false);
              const element = err.error.data[0];
              this.openPopup(element);
            }
            else {
              for (let index = 0; index < err.error.data.length; index++) {
                const element = err.error.data[index];
                this.isLoading$.next(false);
                this.toast.showDanger(element);
              }
            }
          }
          if (Array.isArray(err.error.data.skuCostValidationError)) {
            if (err.error.data.skuCostValidationError.length == 1) {
              this.isLoading$.next(false);
              const element = err.error.data.skuCostValidationError[0].errorMessage;
              this.openPopup(element);
            }
            else {
              for (let index = 0; index < err.error.data.skuCostValidationError.length; index++) {
                const element = err.error.data.skuCostValidationError[0].errorMessage;
                this.isLoading$.next(false);
                this.toast.showDanger(element);

              }
            }
          }
          if (Array.isArray(err.error.data.contractValidationError)) {
            if (err.error.data.contractValidationError.length == 1) {
              this.isLoading$.next(false);
              const element = err.error.data.contractValidationError[0].errorMessage;
              this.openPopup(element);
            }
            else {
              for (let index = 0; index < err.error.data.contractValidationError.length; index++) {
                const element = err.error.data.contractValidationError[index].errorMessage;
                this.isLoading$.next(false);
                this.toast.showDanger(element);
              }
            }
          }
        });
    }
  }

  //#region Date Events
  //This method accepts year,month and date. Returns date string which can be casted into date object.
  private getDateString(year: number, month: number, day: number): string {
    let y = ""; let m = ""; let d = "";
    if (year)
      y = year.toString();
    if (month)
      m = month.toString().length == 1 ? "0" + month.toString() : month.toString();
    if (day)
      d = day.toString().length == 1 ? "0" + day.toString() : day.toString();
    return y + "/" + m + "/" + d;
  }

  dateType(): void {
    this.f.period.setValue("");
  }

  isHovered(date: NgbDate) {
    return (
      this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate)
    );
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return (
      date.equals(this.fromDate) ||
      (this.toDate && date.equals(this.toDate)) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }

  addDisableClass(isDisabled: boolean): string {
    if (isDisabled) {
      return "trDisable";
    }
    return "";
  }
  //#endregion

  //#region  Modal Popup Event
  openPopup(message: string) {
    this.popupMessageString = message;
    this.popupModalRef = this.modalService.open(this.popupMessageModal, { centered: true });
  }

  closePopup(): void {
    if (this.popupModalRef) {
      this.popupModalRef.close();
    }
  }
  //#endregion

  navigateToContractDetails(): void {
    this._router.navigate(['merchants/contract/details/' + this.contractId],
      {
        queryParams: {
          merchantId: this.merchantID
        }
      }
    );
  }

  updateSKUState(eventcheck :any) 
  {
    this.allSKUList.forEach(x => {
          if(!x.isDisable)
          {
             x.isSelected=eventcheck.target.checked; 
          }
      })
  }

  //To check Master checkbox if all respective checkbox checked
  updateMasterCheckboxState() : void
  {
    this.allcheckboxchecked=true
    this.allSKUList.forEach(x => {
          if(!x.isSelected)
            this.allcheckboxchecked=false;
      })
  }
}

export interface ModalInputData {
  title: string,
  data: any,
  isFutureDate: boolean,
  merchantId: number
}

export interface SkuCostParameters {
  skuCostId: number,
  isSelected: boolean,
  isDisable: boolean,
  validStartDate: Date,
  validEndDate: Date,
  skuName: string,
  skuNumber: string,
  cost: Number,
  skuId: number,
  newValidStartDate: Date,
  newValidEndDate: Date,
  needRedErrorColor: boolean
}