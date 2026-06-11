import { Component, OnInit } from '@angular/core';

// type
import { MaintenanceQueryItem } from './maintenance.model';

@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.scss']
})
export class MaintenanceComponent implements OnInit {


  maintenanceQuery: MaintenanceQueryItem[] = [];

  today: number = Date.now();

  constructor () { }

  ngOnInit(): void {
    this.maintenanceQuery = [
      {
        id: 1,
        question: "Why is the Site Down?",
        answer: "There are many variations of passages of Lorem Ipsum available,but the majority have suffered alteration.",
        icon: "dripicons-jewel"
      },
      {
        id: 2,
        question: "What is the Downtime?",
        answer: "Contrary to popular belief, Lorem Ipsum is not simply random text.It has roots in a piece of classical but the majority.",
        icon: "dripicons-clock"
      },
      {
        id: 3,
        question: "Do you need Support?",
        answer: "if you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embar.",
        icon: "dripicons-question"
      }
    ]
  }

}
