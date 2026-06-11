import { Component } from "@angular/core";
import { Product } from "../model/product.model";
import { ProductRepository } from "../model/product.repository";

@Component({
    selector: "store",
    templateUrl: "store.component.html"
})

export class StoreComponent {
    public selectedCategory?: string = "";
    public productsPerPage: number = 4;
    public selectedPage: number = 1;

    constructor(private repository: ProductRepository) { }

    get products(): (Product|undefined)[] {
        //return this.repository.getProducts(this.selectedCategory);
        let skipItemNum = (this.selectedPage - 1) * this.productsPerPage
        return this.repository.getProducts(this.selectedCategory).slice(skipItemNum, skipItemNum + this.productsPerPage);
    }

    get categories(): (string|undefined)[] {
        return this.repository.getCategories();
    }

    changeCategory(newCategory?: string) {
        this.selectedCategory = newCategory;
    }

    changePage(newPage: number) {
        this.selectedPage = newPage;
    }

    changePageSize(e: any) {        
        let newSize = e.value;
        this.productsPerPage = Number(newSize);
        this.changePage(1);
    }

    get pageNumbers(): number[] {
        return Array(this.pageCount).fill(0).map((x, i) => i + 1);
    }

    get pageCount(): number {
        return Math.ceil(this.repository.getProducts(this.selectedCategory).length / this.productsPerPage)
    }
}