import { AfterContentInit, Component, ComponentFactoryResolver, EventEmitter, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { ModalInformationModel } from 'src/app/core/models/common/modal-information-model';
import { ModalService } from 'src/app/core/service/tools/modal.service';


@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit, AfterContentInit {

  @Output()
  onClickActionButton: EventEmitter<boolean> = new EventEmitter(false);

  @ViewChild('modalContainer',{static:false, read: ViewContainerRef}) modalContainer!: ViewContainerRef;
  modalInfoModel!:ModalInformationModel;
  constructor(private modalSvc:ModalService
    , private readonly resolver: ComponentFactoryResolver) { }
  ngAfterContentInit(): void {

    this.subscribeToOnClose();
    this.subscribeToOnCancel();
    this.modalSvc.getModalInfo().subscribe({
      next: res=>{
        this.modalInfoModel = res;

        if(res.display){
          const componentFactory = this.resolver.resolveComponentFactory(this.modalInfoModel.component);

          this.modalContainer.clear();
          this.modalContainer.createComponent(componentFactory);
        }
      }
    });
  }

  ngOnInit(): void {
  }
  private subscribeToOnCancel(){
    this.modalSvc.onCancel().subscribe({next:res=>{
      if(res){
        this.modalInfoModel.data = null;
        this.hideModal();
      }
    }})
  }
  private subscribeToOnClose(){
    this.modalSvc.onClose().subscribe({next:res=>{
        if(res){
          this.hideModal()
        }
      } 
    });
  }

  private hideModal(){
    this.modalInfoModel.display = false;    
    this.modalSvc.modalInfo.next(this.modalInfoModel);
    this.modalContainer.clear();
    
  }

  // btnSaveClick(){
  //   this.modalSvc.save.next(true);
  // }

  // btnCloseClick(){
  //   this.hideModal();
  // }
  // btnCancelClick(){
  //   this.modalSvc.cancel.next(true);
  //   this.hideModal();
  // }

}
