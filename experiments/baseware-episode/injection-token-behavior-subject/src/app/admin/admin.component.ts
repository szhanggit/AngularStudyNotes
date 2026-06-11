import { Component, OnInit, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs'; 
import { MY_SUBJECT_TOKEN } from '../tokens';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  constructor(@Inject(MY_SUBJECT_TOKEN) private myToken: BehaviorSubject<string>) { 
    myToken.subscribe((data) => {
      console.log("AdminComponent", data);
    });
    myToken.next("from AdminComponent");
  }

  ngOnInit(): void {
  }

}
