import { Component, OnInit } from '@angular/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-navbasicex',
  templateUrl: './navbasicex.component.html',
  standalone: true,
  imports: [NgbNavModule],
  styleUrls: ['./navbasicex.component.css']
})
export class NavbasicexComponent implements OnInit {
  active = 1;
  constructor() { }

  ngOnInit(): void {
  }

}
