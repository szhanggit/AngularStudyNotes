import { Injectable } from "@angular/core";
import { Product } from "./product.model";
import { StaticDataSource } from "./static.datasource";

@Injectable()
export class ProductRepository {
    private products: Product[] = [];
    private categories: (string|undefined)[] = [];

    constructor(private dataSource: StaticDataSource) {
        dataSource.getProducts().subscribe(data => {
            this.products = data;
            this.categories = data.map(p => p.category).filter((c, index, array) => array.indexOf(c) == index).sort();
        });
    }

    getProducts(category?: string): Product[] {
        return this.products.filter(p => category == "" || category == p.category);
    }

    getProduct(id: number): Product | undefined {
        let p = this.products.find(p => p.id == id);
        return p;
    }

    getCategories(): (string|undefined)[] {
        return this.categories;
    }
}