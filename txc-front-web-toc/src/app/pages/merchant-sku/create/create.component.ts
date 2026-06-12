import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError, debounceTime, distinctUntilChanged, map, Observable, of, OperatorFunction, switchMap, tap } from 'rxjs';
import { MerchantSkuService } from '../services/merchant-sku.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CreateComponent implements OnInit {
  states : any = ['Edenred Demo Corp', 'ABC Ltd', 'Axis', 'Accentiv'];

  searching = false;
  searchFailed = false;
  formatter = (result: any) => { 
    console.log(result);
    return result.name.toUpperCase()
  };

  // search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
  //   text$.pipe(
  //     debounceTime(200),
  //     distinctUntilChanged(),
  //     map(term => term === '' ? []
  //       : this.states.filter((v :any) => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
  //   )

  search: OperatorFunction<string, readonly {id : any, name : any}[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.searching = true),
      switchMap(term =>
        this._merchantSkuService.search(term).pipe(
          tap(() => this.searchFailed = false),
          catchError(() => {
            this.searchFailed = true;
            return of([]);
          }))
      ),
      tap(() => this.searching = false)
    )

  form: FormGroup;

  isFormInvalid : boolean= false;

  constructor(public formBuilder: FormBuilder, 
    private _merchantSkuService: MerchantSkuService,
    private modalService: NgbModal) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      merchant: ['', [Validators.required]],
      merchantSKU: ['', [Validators.required]],
      merchantSKUName: ['', [Validators.required]],
      skuMOQ : [''],
      defaultCost: [0],
      costs: new FormArray([
        this.formBuilder.group({
          //defaultCost: ['0'],
          costValue: ['', Validators.required]
        })
     ]),
     replenishmentQuantity:[''],
     instockLowWatermark : [''],
     instockHighWatermark:[''],
     cacheLowWatermark : [''],
     cacheHighWatermark : ['']
    });
  }

  get costs(): FormArray { 
    //console.log(this.form.get('costs') as FormArray);
    return this.form.get('costs') as FormArray; 
  }

  formGroupCtrl(fb : any) : FormGroup{
return fb as FormGroup;
  }

  addCost() { 
    this.costs.push(this.formBuilder.group({      
      costValue: ['', Validators.required]
    })); 
  }

  deleteCost(index: number) {
    if(this.form.value.defaultCost > index){
      this.form.patchValue({defaultCost: this.form.value.defaultCost - 1});
    }
    this.costs.removeAt(index);
  }

  onSubmit(content : any){
    console.log(this.form);
    this.isFormInvalid =  this.form.status == "INVALID";
    if(!this.isFormInvalid){
      console.log("Output form :- ", this.form.value);
      this.modalService.open(content,{size : 'sm'}).result.then((result) => {
        //this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });;
    }
    
  }

  changeDefaultValue(e : any) {
    console.log(e.target.value);
    this.form.patchValue({defaultCost: e.target.value})
  }
  

}
