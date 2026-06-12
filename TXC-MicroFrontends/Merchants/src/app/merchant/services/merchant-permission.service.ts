import { Injectable } from '@angular/core';
import { AuthorizationLibraryService } from '@txc-angular/authorization-library';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MerchantPermissionService {

  constructor(private readonly _authLibService: AuthorizationLibraryService) { }

  // getter for merchant viewer flag
  public get isMerchantViewer(): boolean {
    return this._authLibService.getElementOperationFlag([environment.merchant_view_op_id, environment.merchant_create_op_id]);
  }

  // getter for merchant editor flag
  public get isMerchantEditor(): boolean {
    return this._authLibService.getElementOperationFlag([environment.merchant_create_op_id]);
  }
}
