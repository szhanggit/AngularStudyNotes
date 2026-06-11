import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-categorycount',
  templateUrl: './categorycount.component.html',
  styleUrls: ['./categorycount.component.css']
})
export class CategorycountComponent implements OnInit {

  constructor(activeRoute: ActivatedRoute, private router: Router) { 
    activeRoute.pathFromRoot.forEach(route => route.params.subscribe(params => {  //Can be used for child components. eg: nest a component in form.
      let name = params["name"] || null;
      let category = params["category"] || null;
      let price = params["price"] || 0;
      console.log(`Optional parameters 3: name ${name??''}, category ${category??''}, price ${price??0.0}`);
    })); 
  }

  ngOnInit(): void {
  }

}
