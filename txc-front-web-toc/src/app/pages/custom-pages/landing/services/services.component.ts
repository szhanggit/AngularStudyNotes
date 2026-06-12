import { Component, OnInit } from '@angular/core';

// data
import { SERVICES, Services } from './data';

@Component({
  selector: 'app-landing-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {

  services: Services[] = [];

  constructor () { }

  ngOnInit(): void {
    this.services = SERVICES;
  }

}
