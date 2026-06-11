import { NgModule } from "@angular/core";
import { ProductRepository } from "./product.repository";
import { StaticDataSource } from "./static.datasource";
import { Cart } from "./cart.model";
import { Order } from "./order.model";
import { OrderRepository } from "./order.repository";
import { RestDataSource } from "./rest.datasource";
import { HttpClientModule } from "@angular/common/http";
import { AuthService } from "./auth.service";

@NgModule({
    imports: [HttpClientModule],
    providers: [ProductRepository, Cart,
                Order, OrderRepository, { provide: StaticDataSource, useClass: RestDataSource },
                RestDataSource, AuthService]
                /*when it needs to create an instance of a class with a StaticDataSource constructor parameter, it should
use a RestDataSource instead*/
})

export class ModelModule { }