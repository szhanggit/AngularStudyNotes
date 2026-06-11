import { Component, Input } from '@angular/core';

@Component({
  selector: 'lib-no-data',
  template: `
    <div class="row">
      <div class="col-12 text-center">
        <svg-controller class="mt-2" svgName="no-result"></svg-controller>
      </div>
      <div class="col-12 text-center">
        {{ message }}
      </div>
    </div>
  `
})
export class NoDataLibComponent {
  @Input() message = 'No data to display';
}
