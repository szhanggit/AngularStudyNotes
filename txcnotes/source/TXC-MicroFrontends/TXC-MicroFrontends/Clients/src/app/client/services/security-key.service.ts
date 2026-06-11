import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SecurityKeyService {
  charMaps = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
numberOnlyMaps = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

confusionDictionary =
  [{ key: '0', value: '0' }, { key: '1', value: '1' }, { key: '2', value: '2' }, { key: '3', value: '3' }, { key: '4', value: '4' }, { key: '5', value: '5' }, { key: '6', value: '6' }, { key: '7', value: '7' }, { key: '8', value: '8' }, { key: '9', value: '9' }, { key: 'A', value: '0' }
    , { key: 'B', value: '5' }, { key: 'C', value: '4' }, { key: 'D', value: '4' }, { key: 'E', value: '1' }, { key: 'F', value: '9' }, { key: 'G', value: '4' }, { key: 'H', value: '6' }, { key: 'I', value: '5' }, { key: 'J', value: '9' }, { key: 'K', value: '4' }, { key: 'L', value: '8' }, { key: 'M', value: '2' }, { key: 'N', value: '8' }, { key: 'O', value: '7' }, { key: 'P', value: '7' }, { key: 'Q', value: '3' }, { key: 'R', value: '9' }, { key: 'S', value: '3' }
    , { key: 'T', value: '3' }, { key: 'U', value: '7' }, { key: 'V', value: '7' }, { key: 'W', value: '7' }, { key: 'X', value: '6' }, { key: 'Y', value: '3' }, { key: 'Z', value: '3' }];

numberOnlyConfusionDictionary =
  [{ key: '0', value: '0' }, { key: '1', value: '1' }, { key: '2', value: '2' }, { key: '3', value: '3' }, { key: '4', value: '4' }, { key: '5', value: '5' }, { key: '6', value: '6' }, { key: '7', value: '7' }, { key: '8', value: '8' }, { key: '9', value: '9' }];

matrix = [
  [0, 3, 1, 7, 5, 9, 8, 6, 4, 2],
  [7, 0, 9, 2, 1, 5, 4, 8, 6, 3],
  [4, 2, 0, 6, 8, 7, 1, 3, 5, 9],
  [1, 7, 5, 0, 9, 8, 3, 4, 2, 6],
  [6, 1, 2, 3, 0, 4, 5, 9, 7, 8],
  [3, 6, 7, 4, 2, 0, 9, 5, 8, 1],
  [5, 8, 6, 9, 7, 2, 0, 1, 3, 4],
  [8, 9, 4, 5, 3, 6, 2, 0, 1, 7],
  [9, 4, 3, 8, 6, 1, 7, 2, 0, 5],
  [2, 5, 8, 1, 4, 3, 6, 7, 9, 0]
];
constructor() { }

generateSecurityKey(length: number, isNumberOnly = false): string {
  let securityKey = '';
  const charPosition = isNumberOnly ? 8: 16;

  if (length > 0) {
    while (length-- > 0) {
      if (isNumberOnly) {
        securityKey += this.numberOnlyMaps[Math.floor(Math.random() * charPosition)];
      }
      else {
        securityKey += this.charMaps[Math.floor(Math.random() * charPosition)];
      }
    }
  }

  let confusedVoucherNumber = '';

  for (const key of securityKey) {
    if (isNumberOnly) {
      confusedVoucherNumber += this.numberOnlyConfusionDictionary.find(x => x.key === key)?.value;
    } else {
      confusedVoucherNumber += this.confusionDictionary.find(x => x.key === key)?.value;
    }
  }

  return securityKey + this.calculateCheckSum(confusedVoucherNumber);
}

calculateCheckSum(number: string): number {
  let interim = 0;

  for (const n of number) {
    interim = this.matrix[interim][parseInt(n)];
  }

  return interim;
}
}
