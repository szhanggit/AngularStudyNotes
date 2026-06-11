import { Component, KeyValueDiffers, KeyValueDiffer, DoCheck } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements DoCheck{
  product = { id: 1, name: 'Product A', category: 'Category 1' };
  productDiffer: KeyValueDiffer<string, any>;
  changes: string[] = [];

  constructor(private differs: KeyValueDiffers) {
    this.productDiffer = this.differs.find(this.product).create();
  }

  ngDoCheck() {
    const changes = this.productDiffer.diff(this.product);
    if (changes) {
      this.changes = [];
      changes.forEachChangedItem(item => {
        this.changes.push(`Changed: ${item.key} from ${item.previousValue} to ${item.currentValue}`);
      });
      changes.forEachAddedItem(item => {
        this.changes.push(`Added: ${item.key} with value ${item.currentValue}`);
      });
      changes.forEachRemovedItem(item => {
        this.changes.push(`Removed: ${item.key} (was ${item.previousValue})`);
      });
    }
  }

  updateProduct() {
    this.product.name = 'Product B';
    this.product.category = 'Category 2';
  }
}
