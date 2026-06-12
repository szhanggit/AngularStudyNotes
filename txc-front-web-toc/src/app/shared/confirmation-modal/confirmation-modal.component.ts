import { AfterContentInit, Component, OnInit } from '@angular/core';
import { ConfirmationModel } from 'src/app/core/models/common/confirmation-model';
import { ConfirmationService } from 'src/app/core/service/tools/confirmation.service';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss']
})
export class ConfirmationModalComponent implements OnInit, AfterContentInit {

  model!: ConfirmationModel;  
  constructor(private readonly confirmationSvc: ConfirmationService) { }
  ngAfterContentInit(): void {
    this.subscribeToConfirmation();
  }

  ngOnInit(): void {
    
  }

  btnCloseClick(){
    this.model.display = false;
  }
  btnNoClick(){
    this.model.display = false;
    this.model.answer = "no";
    this.confirmationSvc.confirm.next(this.model);
  }

  btnYesClick(){
    this.model.display = false;
    this.model.answer = "yes";
    this.confirmationSvc.confirm.next(this.model);
    
  }
  private subscribeToConfirmation(){
    this.confirmationSvc.getConfirmation((res:any)=>{
      if(res){
        this.model = res;
      }else{
          this.model = <ConfirmationModel>{
            title: ""
            , message: ""
            , display: false
            , answer: ""            
          }
        }
    });

    // this.confirmationSvc.getConfirmation()
    // .subscribe({
    //   next:res=> {
    //     if(res){
    //     this.model = res;
    //     console.log(res);
    //     }else{
    //       this.model = <ConfirmationModel>{
    //         title: ""
    //         , message: ""
    //         , display: false
    //         , answer: ""            
    //       }
    //     }
    //   }});
  }
}
