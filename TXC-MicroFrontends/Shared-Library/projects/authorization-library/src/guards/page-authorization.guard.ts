import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { firstValueFrom, skip } from 'rxjs';
import { AuthorizationLibraryService, MENU, ROUTEPATHS } from '../public-api';

@Injectable({
  providedIn: 'root'
})
export class PageAuthorizationGuard implements CanActivate {

  constructor(private authService: AuthorizationLibraryService) {}

  /**
   * check if user has the right to access the modele. if not, redirect to 401 unauthorized.
   */
   async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean>  {

      let userClaims = this.authService.userAuthClaim.getValue();
      if (!userClaims.user.userOid)
        userClaims = await firstValueFrom(this.authService.userAuthClaim.pipe(skip(1)));  // skip the default userAuthClaim if it is empty

      const paths = state.url.split('/');
      const isKeyMatchingPath = (key: string | undefined, path: string) => 
      key?.toLocaleLowerCase() === path?.toLocaleLowerCase();

      const menus = MENU.filter(m => 
          isKeyMatchingPath(m.key, paths[1]) || isKeyMatchingPath(m.key, paths[2])
      );

      if (menus.length > 0 && menus[0].id) {
          // check if user has the right to access the modele
          if((Array.isArray(userClaims.modules) && userClaims.modules.includes(menus[0].id))
          || (!Array.isArray(userClaims.modules) && userClaims.modules == menus[0].id)) {
          // check if url is in valid oepration's paths
          if (this.isPathValidWithOperations(state.url, userClaims.operations))
            return true;
        }
      }

      document.location.href = `/move/error/403`;
      return false;
  }

  isPathValidWithOperations(url: string, operations: number[]): boolean {
    // get paths from ROUTEPATHS only path is active and in the same moudule key
    const keyPath = url.split('/')[1] ?? '';
    const paths = ROUTEPATHS.filter(r => r.isActive && operations.includes(r.operationId) && r.key?.toLocaleLowerCase() == keyPath?.toLocaleLowerCase()).map(o => o.path);

    for(let path of paths) {
      path = '/' + keyPath + ((path == '')? '' : '/' + path);
      if (url == path)  // url exists in paths
        return true;
      else {
        const url_split = url.split('/');
        const path_split = path?.split('/');
        if (path_split?.length == url_split.length) {
          // compare two splited arrays to the last one.
          while(url_split.length > 0) {
            let url_shift = url_split.shift();
            let path_shift = path_split.shift();
            // delete params after '?'
            if (url_split.length == 0 && url_shift?.includes('?'))
              url_shift = url_shift.split('?')[0];
            // make sure no comparation with special param ':id'
            if (path_shift == ':id')
              path_shift = url_shift;
            // all path is the same => true
            if (path_shift == url_shift && url_split.length == 0) return true;
            // break to next path once find the diff
            if (path_shift != url_shift) break;
          }
        }
      }
    }
    return false;
  }
}
