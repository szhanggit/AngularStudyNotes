import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { ImageCategory } from 'src/app/core/enums/image-category';
import { MediaDto, GetImageResponseModel } from 'src/app/core/models/media/get-image-list-response-model';
import { GetMediaListQueryModel } from 'src/app/core/models/media/get-media-list-query-model';
import { ConfigService } from 'src/app/core/service/config.service';
import { ImageUploadService } from 'src/app/core/service/media/image-upload.service';
import { MediaService } from 'src/app/core/service/media/media.service';

@Component({
  selector: 'app-image-list',
  templateUrl: './image-list.component.html',
  styleUrls: ['./image-list.component.scss']
})
export class ImageListComponent implements OnInit {

  originalFileName: string;
  editingFileExtension:string;
  editingFileName: string;
  editingFile : boolean[] = [];
  replace:boolean;
  list: MediaDto[] = [];
  type: ImageCategory = ImageCategory.CLIENT;
  file: string;
  searchKeyword: string = "";
  mediaDto: MediaDto;
  constructor(private readonly mediaSvc: MediaService
    , private readonly imageUploadSvc: ImageUploadService
    , private readonly toastr: ToastrService
    , private readonly configSvc : ConfigService) {
      // this.configSvc.currentUrl.next(this.configSvc.config.apiUrl.media);
    }

  ngOnInit(): void {
    this.getList();
  }


  onChangeSearch(){
    if(this.searchKeyword.replace(' ','') === ""){
      this.getList();
    }
  }

  checkIfEditing(mediaId: number){
    if(!this.editingFile){
      return true;
    }
    return this.editingFile && mediaId === this.mediaDto.mediaId
  }

  onCancelEditClick(index:number){
    this.mediaDto.fileName = this.originalFileName;
    this.editingFile[index] = false;
  }
  onChangeFileName(index:number){
    const model = {
      "mediaId": this.mediaDto.mediaId
      , "fileName": this.editingFileName
    }

    setTimeout(()=>{
      if(!this.editingFile){
        return;
      }
      this.mediaSvc.updateFileName(model, (res:any)=>{
        this.toastr.success("File has been successfully renamed","Success");
        this.mediaDto.fileName = this.editingFileName + '.' + this.editingFileExtension;
      });
      this.editingFile[index] = false;
    },200);

  }

  onEditFileClick(item:MediaDto, index: number){
    this.originalFileName = item.fileName;
    this.mediaDto = item;
    const splitedFile = item.fileName.split('.');
    this.editingFileName = splitedFile[0];
    this.editingFileExtension = splitedFile[1];
    this.editingFile[index] = true;

  }

  replaceImage(item: MediaDto){
    this.mediaDto = item;
    this.replace = true;



  }

  onClickNav(category:number){
    this.type = category;
    this.getList();
  }

  getList(){
    this.mediaSvc.getImages(<GetMediaListQueryModel>{
      searchKeyword: this.searchKeyword
      , type : this.type
      , pageNumber: 1
      , rowCount: 20
    },(d:GetImageResponseModel)=>{
      this.list  = d.data.mediaDtos;
      this.editingFile = this.list.map(m=> {return false;});
    });
  }

  onFileChanged(fileInput:any){
    this.editingFile.forEach(fe=> fe = false);
    const files = fileInput.target.files;

    if(files.length === 0){
      return;
    }

    var observer: Observable<any>;
    if(this.replace){
      observer = this.replaceFile(files);
    }else{
      observer = this.uploadNewFile(files);
    }

    const subscriber = observer.subscribe({
      next:res=>{
        this.toastr.success("File uploaded successfully", "Success");
        this.getList();
      }, error:e=>{
        subscriber.unsubscribe();
      }, complete: ()=>{
        subscriber.unsubscribe();
      }
    })
  }

  private uploadNewFile(files: FileList){
    const formData = new FormData();
    formData.append('Type', this.type.toString());
    formData.append('Image', files[0]);
    return this.imageUploadSvc.uploadImage(formData);
  }

  private replaceFile(files: FileList){
    const formData = new FormData();
    formData.append('MediaId',this.mediaDto.mediaId.toString());
    formData.append('BlobName', this.mediaDto.blobName);
    formData.append('Image', files[0]);
    return this.imageUploadSvc.replaceImage(formData);
  }
}
