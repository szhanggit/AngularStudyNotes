import { NgxSliderModule, Options } from '@angular-slider/ngx-slider';
import { Component } from '@angular/core';

@Component({
  selector: 'app-slider',
  standalone: true,
  imports: [NgxSliderModule],
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.css'
})
export class SliderComponent {

  value=40;
  options:Options={
    floor:0,
    ceil:200
  }

  value1=40;
  highvalue1=100;
  options1:Options={
    floor:0,
    ceil:200
  }

  value2=40;
  options2:Options={
    floor:0,
    ceil:200,
    vertical:true
  }

  value3: number = 5;
  options3: Options = {
    showTicksValues: true,
    stepsArray: [
      { value: 1, legend: "Very poor" },
      { value: 2 },
      { value: 3, legend: "Fair" },
      { value: 4 },
      { value: 5, legend: "Average" },
      { value: 6 },
      { value: 7, legend: "Good" },
      { value: 8 },
      { value: 9, legend: "Excellent" }
    ]
  };

}
