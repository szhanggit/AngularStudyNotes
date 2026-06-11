import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductCustomizationService {

  constructor() { }

  isTaiwan(country: string): boolean {
    return country === 'TW';
  }

  isIndia(country: string): boolean {
    return country === 'IN';
  }

  isSingapore(country: string): boolean {
    return country === 'SG';
  }

  isGR(country: string): boolean {
    return country === 'GR';
  }

  isGlobal(country: string): boolean {
    return country === 'GL';
  }
}
