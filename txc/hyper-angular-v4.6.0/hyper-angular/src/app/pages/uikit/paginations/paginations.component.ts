import { Component, OnInit } from '@angular/core';

// type
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';

@Component({
  selector: 'app-ui-paginations',
  templateUrl: './paginations.component.html',
  styleUrls: ['./paginations.component.scss']
})
export class PaginationsComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  page1: number = 2;
  page2: number = 2;
  page3: number = 2;
  page4: number = 2;
  page5: number = 2;
  page6: number = 2;
  page7: number = 2;
  page8: number = 2;
  page9: number = 2;

  customPage1: number = 3;
  customPage2: number = 3;

  advacedPage1: number = 2;
  advacedPage2: number = 2;
  advacedPage3: number = 2;

  isDisabled: boolean = true;
  FILTER_PAG_REGEX = /[^0-9]/g;

  constructor () { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Base UI', path: '/' }, { label: 'Pagination', path: '/', active: true }];
  }

  /**
   * togggles disable property of pagination control
   */
  toggleDisabled() {
    this.isDisabled = !this.isDisabled;
  }

  /**
   * @param current index 
   * @returns symbol for index
   */
  getPageSymbol(current: number) {
    return ['A', 'B', 'C', 'D', 'E', 'F', 'G'][current - 1];
  }

  // selects page
  selectPage(page: string) {
    this.customPage2 = parseInt(page, 10) || 1;
  }

  // formats input field 
  formatInput(input: HTMLInputElement) {
    input.value = input.value.replace(this.FILTER_PAG_REGEX, '');
  }



}
