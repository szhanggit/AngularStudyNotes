import { Component, Input } from '@angular/core';

// global interface
declare global {
  interface Window {
    jsVectorMap?: any;
  }
}


@Component({
  selector: 'app-widget-vectormap',
  templateUrl: './vectormap.component.html',
  styleUrls: ['./vectormap.component.scss'],
  providers: []
})
export class VectormapComponent {

  @Input() width: string = '';
  @Input() height: string = '';
  @Input() options: any = {};
  @Input() type: string = "";
  @Input() mapId: string = "map";

  constructor () {

  }

  /**
   * generates vecotor map
   */
  ngAfterViewInit(): void {
    const map = new window.jsVectorMap({
      selector: '#' + this.mapId,
      map: this.type,
      ...this.options
    })
  }

}
