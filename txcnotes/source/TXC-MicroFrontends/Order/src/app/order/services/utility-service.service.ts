import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilityServiceService {

  constructor() { }

  isEqual<T extends object>(a: T[], b: T[]): boolean {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      const prodA = a[i];
      const prodB = b[i];
      for (const key of Object.keys(prodA)) {
        if ((prodA as any)[key] !== (prodB as any)[key]) {
          return false;
        }
      }
    }
    return true;
  }
}
