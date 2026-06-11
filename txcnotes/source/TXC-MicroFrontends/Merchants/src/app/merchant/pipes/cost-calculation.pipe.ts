import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'costCalculation',
})
export class CostCalculationPipe implements PipeTransform {
  transform(face_value: number, cost_percent: number) {
    if(cost_percent){
        if(!face_value) face_value = 1; 
        let value = (cost_percent / 100) * face_value;
        let res = ((value - Math.floor(value)) !== 0) ? value.toFixed(2) : value;
        return res;
    }
    return 0;
  }
}
