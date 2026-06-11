import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FileToBase64 } from './file-to-base64';

@Injectable({
  providedIn: 'root'
})
export class IdFileToBase64Service extends FileToBase64 {

}
