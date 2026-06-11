import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  constructor(activeRoute: ActivatedRoute, private router: Router) { 
    let u = activeRoute.snapshot.url;
    console.log(`url is: ${u}`);
    let p = activeRoute.snapshot.url[activeRoute.snapshot.url.length-1].path;
    console.log(`path is: ${p}`);
    let id = activeRoute.snapshot.params["id"];
    //activeRoute.snapshot.queryParamMap.get('tenantName');
    console.log(`id is: ${id}`);

    let name = activeRoute.snapshot.params["name"];
    let category = activeRoute.snapshot.params["category"];
    let price = activeRoute.snapshot.params["price"];
    console.log(`Optional parameters: name ${name??''}, category ${category??''}, price ${price??0.0}`);

    activeRoute.params.subscribe(params => {
      let name = params["name"] || null;
      let category = params["category"] || null;
      let price = params["price"] || 10;
      console.log(`Optional parameters 2: name ${name??''}, category ${category??''}, price ${price??0.0}`);
    });

    activeRoute.pathFromRoot.forEach(route => route.params.subscribe(params => {  //Can be used for child components. eg: nest a component in form.
      let name = params["name"] || null;
      let category = params["category"] || null;
      let price = params["price"] || 30;
      console.log(`Optional parameters 3: name ${name??''}, category ${category??''}, price ${price??0.0}`);
    }));  
  }

  ngOnInit(): void {
  }

  back() {
    this.router.navigateByUrl("/table");
  }
/*
goToAbout(): void {
  this.router.navigate(['/about'], { queryParams: { ref: 'home' }, fragment: 'top' });
}
  This would navigate to /about?ref=home#top.


      this._router.navigate(['merchant-list/'],
      {
        queryParams: {
          tenantName: 'TW',
        },
        state: {
          action: 'created',
          merchantName: this.f.name.value
        }
      });


*/
/*
This state data is not part of the URL and is instead stored in the history entry.
*/
}
