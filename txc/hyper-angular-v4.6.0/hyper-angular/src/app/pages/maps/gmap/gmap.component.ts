import { Component, OnInit } from '@angular/core';

// type
import { BreadcrumbItem } from '../../../shared/page-title/page-title.model';

// data
import { DARKSTYLES, LIGHTSTYLES } from './data';

type MapConfig = {
  lat: number;
  lng: number;
  title?: string;
  markers?: MapConfig[];
  styles?: any[];
}

@Component({
  selector: 'app-maps-googlemap',
  templateUrl: './gmap.component.html',
  styleUrls: ['./gmap.component.scss']
})
export class GmapComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  gmapConfig1!: MapConfig;
  gmapConfig2!: MapConfig;
  gmapConfig3!: MapConfig;
  gmapConfig4!: MapConfig;

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Maps', path: '/' }, { label: 'Google Maps', path: '/', active: true }];

    this.initMapConfig();
  }

  /**
   * initialize map configuration
   */
  initMapConfig(): void {
    this.gmapConfig1 = {
      lat: 51.678418,
      lng: 7.809007
    }

    this.gmapConfig2 = {
      lat: 51.678418,
      lng: 7.809007,
      markers: [
        {
          lat: 51.668418,
          lng: 7.809007,
          title: 'Lima'
        },
        {
          lat: 51.568418,
          lng: 7.829007,
          title: 'Marker with InfoWindow'
        }
      ]
    }

    this.gmapConfig3 = {
      lat: 51.678418,
      lng: 7.809007,
      styles: LIGHTSTYLES
    }

    this.gmapConfig4 = {
      lat: 51.678418,
      lng: 7.809007,
      styles: DARKSTYLES
    }
  }

  mapReady(map: any) {
    map.setOptions({
      zoomControl: "true",
      zoomControlOptions: {
        position: google.maps.ControlPosition.TOP_LEFT
      }
    });
  }

}
