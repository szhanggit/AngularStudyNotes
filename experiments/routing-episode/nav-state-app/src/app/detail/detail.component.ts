import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit, AfterViewInit {
  stateData: any;
  constructor(private readonly _router: Router, private readonly _route: ActivatedRoute) {
    _route.params.subscribe(() => {
      const navigation = this._router.getCurrentNavigation();  
      this.stateData = navigation?.extras.state;
      //const action = JSON.parse(JSON.stringify(this.stateData)).exampleData;
    });
  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    console.log(`State information is: ${history.state.exampleData}`);
  }

}
