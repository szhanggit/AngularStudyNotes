import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// directive
import { NgbSortableHeaderDirective } from './sortable.directive';

// components
import { AdvancedTableComponent } from './advanced-table.component';



@NgModule({
  declarations: [
    NgbSortableHeaderDirective,
    AdvancedTableComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
  ],
  exports: [AdvancedTableComponent]
})
export class AdvancedTableModule { }
