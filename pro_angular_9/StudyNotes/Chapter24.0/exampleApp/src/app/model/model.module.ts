import { NgModule } from "@angular/core";
//import { StaticDataSource } from "./static.datasource";
import { Model } from "./repository.model";
import { HttpClientModule } from "@angular/common/http";
import { RestDataSource, REST_URL } from "./rest.datasource";

@NgModule({
  imports: [HttpClientModule],
  //providers: [Model, StaticDataSource]
  providers: [Model, RestDataSource,
    { provide: REST_URL, useValue: `http://${location.hostname}:3500/products` }]
    //{ provide: REST_URL, useValue: `https://localhost:7002/api/products` }]
})
export class ModelModule { }
