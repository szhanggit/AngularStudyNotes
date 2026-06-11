import { NgModule } from "@angular/core";
import { Model } from "./repository.model";
import { HttpClientModule, HttpClientJsonpModule } from "@angular/common/http";
import { RestDataSource, REST_URL } from "./rest.datasource";
import { ModelResolver } from "./model.resolver";

@NgModule({
    imports: [HttpClientModule, HttpClientJsonpModule],
    providers: [Model, RestDataSource, ModelResolver,
        { provide: REST_URL, useValue: "https://localhost:7002/api/products" }]
})
export class ModelModule { }
