import { Injectable } from '@angular/core';
import { AuthorizationLibraryService } from '@txc-angular/authorization-library';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientPermissionService {

  constructor(private readonly _authLibService: AuthorizationLibraryService) { }

  // getter for client viewer flag
  public get isClientViewer(): boolean {
    return this._authLibService.getElementOperationFlag([environment.client_view_op_id, environment.client_create_op_id]);
  }

  // getter for client editor flag
  public get isClientEditor(): boolean {
    return this._authLibService.getElementOperationFlag([environment.client_create_op_id]);
  }
}
