import { Injectable } from '@angular/core';
import { InMemoryDbService, RequestInfo } from 'angular-in-memory-web-api';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService implements InMemoryDbService {

  constructor() { }
   createDb(): {} | Observable<{}> | Promise<{}> {
    return{
      products:[
        {
          id: 1,
          name: 'Seaman Cap',
          description: 'Lorem ipsum . Voluptatem excepturi magnam nostrum dolore recusandae',
          price: 40
        },
        {
          id: 2,
          name: 'T-shirt',
          description: 'amet consectetur adipisicing elit.Lorem ipsum dolor sit ',
          price: 80
        }
      ]
    }
  }
}
