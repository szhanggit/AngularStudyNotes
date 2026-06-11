import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FileManagementService } from '../file-management.service';

@Component({
  selector: 'app-upimg',
  templateUrl: './upimg.component.html',
  styleUrls: ['./upimg.component.css']
})
export class UpimgComponent implements OnInit {
  detailsFormGroup: FormGroup;
  logo: string = "";

  get f() {
    return this.detailsFormGroup.controls;
  }
  constructor(
    private readonly _formBuilder: FormBuilder,
    private readonly _fileManagementSvc: FileManagementService) { 
    this.detailsFormGroup = this._formBuilder.group({
      logo: new FormControl({ value: '', disabled: false })
    });
  }

  ngOnInit(): void {
  }

  onFileChange(fileInput: any): void {
    if ((fileInput.target.files) && (fileInput.target.files[0])) {
      this._fileManagementSvc.converToBase64(fileInput.target.files[0] as File, (d: string) => {
        this.logo = d;
        this.f["logo"].setValue(d);
        this.detailsFormGroup.markAsDirty();
      });
    }
  }
}
