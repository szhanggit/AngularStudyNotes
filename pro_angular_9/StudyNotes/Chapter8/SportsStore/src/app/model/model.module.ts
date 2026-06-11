import { NgModule } from "@angular/core";
import { ProductRepository } from "./product.repository";
import { StaticDataSource } from "./static.datasource";
import { Cart } from "./cart.model";
import { Order } from "./order.model";
import { OrderRepository } from "./order.repository";
import { RestDataSource } from "./rest.datasource";
import { HttpClientModule } from "@angular/common/http";

@NgModule({
    imports: [HttpClientModule],
    providers: [ProductRepository, Cart,
                Order, OrderRepository, { provide: StaticDataSource, useClass: RestDataSource }]
                /*when it needs to create an instance of a class with a StaticDataSource constructor parameter, it should
use a RestDataSource instead P163. Since both objects define the same methods, the dynamic JavaScript type system means that the substitution is seemless.*/
})

export class ModelModule { }