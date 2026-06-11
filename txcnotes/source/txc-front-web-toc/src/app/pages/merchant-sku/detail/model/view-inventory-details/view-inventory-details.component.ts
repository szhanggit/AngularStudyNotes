import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-inventory-details',
  templateUrl: './view-inventory-details.component.html',
  styleUrls: ['./view-inventory-details.component.scss']
})
export class ViewInventoryDetailsComponent implements OnInit {

  // dummy data:
  voucherBatchList: any[] = [{ "batch_number": "20220406000001ABCDEF1", "supplier": "abc", "remaining_qty": "12", "import_qty": 15, "facevalue": "N", "cost": "222", "creator": "ae", "import_date": "4/5/2021 09:29:55 PM" }, { "batch_number": "20220406000002GHIJKL2", "supplier": "def", "remaining_qty": "13", "import_qty": 15, "facevalue": "Y", "cost": "223", "creator": "ae", "import_date": "4/6/2021 01:33:55 PM" }, { "batch_number": "20220406000002GHIJKL3", "supplier": "def", "remaining_qty": "13", "import_qty": 15, "facevalue": "Y", "cost": "223", "creator": "ae", "import_date": "4/6/2021 01:33:55 PM" }, { "batch_number": "20220406000002GHIJKL4", "supplier": "def", "remaining_qty": "13", "import_qty": 15, "facevalue": "Y", "cost": "223", "creator": "ae", "import_date": "4/6/2021 01:33:55 PM" }, { "batch_number": "20220406000002GHIJKL5", "supplier": "def", "remaining_qty": "13", "import_qty": 15, "facevalue": "Y", "cost": "223", "creator": "ae", "import_date": "4/6/2021 01:33:55 PM" }, { "batch_number": "20220406000002GHIJKL6", "supplier": "def", "remaining_qty": "13", "import_qty": 15, "facevalue": "Y", "cost": "223", "creator": "ae", "import_date": "4/6/2021 01:33:55 PM" }, { "batch_number": "20220406000002GHIJKL7", "supplier": "def", "remaining_qty": "13", "import_qty": 15, "facevalue": "Y", "cost": "223", "creator": "ae", "import_date": "4/6/2021 01:33:55 PM" }, { "batch_number": "20220406000002GHIJKL8", "supplier": "def", "remaining_qty": "13", "import_qty": 15, "facevalue": "Y", "cost": "223", "creator": "ae", "import_date": "4/6/2021 01:33:55 PM" }, { "batch_number": "20220406000002GHIJKL9", "supplier": "def", "remaining_qty": "13", "import_qty": 15, "facevalue": "Y", "cost": "223", "creator": "ae", "import_date": "4/6/2021 01:33:55 PM" }, { "batch_number": "20220406000002GHIJKL10", "supplier": "def", "remaining_qty": "13", "import_qty": 15, "facevalue": "Y", "cost": "223", "creator": "ae", "import_date": "4/6/2021 01:33:55 PM" }, { "batch_number": "20220406000002GHIJKL11", "supplier": "def", "remaining_qty": "13", "import_qty": 15, "facevalue": "Y", "cost": "223", "creator": "ae", "import_date": "4/6/2021 01:33:55 PM" }, { "batch_number": "20220406000002GHIJKL12", "supplier": "def", "remaining_qty": "13", "import_qty": 15, "facevalue": "Y", "cost": "223", "creator": "ae", "import_date": "4/6/2021 01:33:55 PM" }, { "batch_number": "20220406000002GHIJKL13", "supplier": "def", "remaining_qty": "13", "import_qty": 15, "facevalue": "Y", "cost": "223", "creator": "ae", "import_date": "4/6/2021 01:33:55 PM" }, { "batch_number": "20220406000002GHIJKL14", "supplier": "def", "remaining_qty": "13", "import_qty": 15, "facevalue": "Y", "cost": "223", "creator": "ae", "import_date": "4/6/2021 01:33:55 PM" }, { "batch_number": "20220406000002GHIJKL15", "supplier": "def", "remaining_qty": "13", "import_qty": 15, "facevalue": "Y", "cost": "223", "creator": "ae", "import_date": "4/6/2021 01:33:55 PM" }, { "batch_number": "20220406000002GHIJKL16", "supplier": "def", "remaining_qty": "13", "import_qty": 15, "facevalue": "Y", "cost": "223", "creator": "ae", "import_date": "4/6/2021 01:33:55 PM" }, { "batch_number": "20220406000002GHIXYZ17", "supplier": "def", "remaining_qty": "99", "import_qty": 100, "facevalue": "N", "cost": "999", "creator": "ae", "import_date": "4/21/2021 11:29:55 AM" }, { "batch_number": "20220406000002GHIXYZ18", "supplier": "def", "remaining_qty": "99", "import_qty": 100, "facevalue": "N", "cost": "999", "creator": "ae", "import_date": "4/21/2021 11:29:55 AM" }, { "batch_number": "20220406000002GHIXYZ19", "supplier": "def", "remaining_qty": "99", "import_qty": 100, "facevalue": "N", "cost": "999", "creator": "ae", "import_date": "4/21/2021 11:29:55 AM" }, { "batch_number": "20220406000002GHIXYZ20", "supplier": "def", "remaining_qty": "99", "import_qty": 100, "facevalue": "N", "cost": "999", "creator": "ae", "import_date": "4/21/2021 11:29:55 AM" }, { "batch_number": "20220406000002GHIXYZ21", "supplier": "def", "remaining_qty": "99", "import_qty": 100, "facevalue": "N", "cost": "999", "creator": "ae", "import_date": "4/21/2021 11:29:55 AM" }, { "batch_number": "20220406000002GHIXYZ22", "supplier": "def", "remaining_qty": "99", "import_qty": 100, "facevalue": "N", "cost": "999", "creator": "ae", "import_date": "4/21/2021 11:29:55 AM" }, { "batch_number": "20220406000002GHIXYZ23", "supplier": "def", "remaining_qty": "99", "import_qty": 100, "facevalue": "N", "cost": "999", "creator": "ae", "import_date": "4/21/2021 11:29:55 AM" }, { "batch_number": "20220406000002GHIXYZ24", "supplier": "def", "remaining_qty": "99", "import_qty": 100, "facevalue": "N", "cost": "999", "creator": "ae", "import_date": "4/21/2021 11:29:55 AM" }, { "batch_number": "20220406000002GHIXYZ25", "supplier": "def", "remaining_qty": "99", "import_qty": 100, "facevalue": "N", "cost": "999", "creator": "ae", "import_date": "4/21/2021 11:29:55 AM" }, { "batch_number": "20220406000002GHIXYZ26", "supplier": "def", "remaining_qty": "99", "import_qty": 100, "facevalue": "N", "cost": "999", "creator": "ae", "import_date": "4/21/2021 11:29:55 AM" }, { "batch_number": "20220406000002GHIXYZ27", "supplier": "def", "remaining_qty": "99", "import_qty": 100, "facevalue": "N", "cost": "999", "creator": "ae", "import_date": "4/21/2021 11:29:55 AM" }, { "batch_number": "20220406000002GHIXYZ28", "supplier": "def", "remaining_qty": "99", "import_qty": 100, "facevalue": "N", "cost": "999", "creator": "ae", "import_date": "4/21/2021 11:29:55 AM" }, { "batch_number": "20220406000002GHIXYZ29", "supplier": "def", "remaining_qty": "99", "import_qty": 100, "facevalue": "N", "cost": "999", "creator": "ae", "import_date": "4/21/2021 11:29:55 AM" }, { "batch_number": "20220406000002GHIXYZ30", "supplier": "def", "remaining_qty": "99", "import_qty": 100, "facevalue": "N", "cost": "999", "creator": "ae", "import_date": "4/21/2021 11:29:55 AM" }, { "batch_number": "20220406000002GHIXYZ31", "supplier": "def", "remaining_qty": "99", "import_qty": 100, "facevalue": "N", "cost": "999", "creator": "ae", "import_date": "4/21/2021 11:29:55 AM" }, { "batch_number": "20220406000002GHIXYZ32", "supplier": "def", "remaining_qty": "99", "import_qty": 100, "facevalue": "N", "cost": "999", "creator": "ae", "import_date": "4/21/2021 11:29:55 AM" }, { "batch_number": "20220406000002GHIXYZ33", "supplier": "def", "remaining_qty": "99", "import_qty": 100, "facevalue": "N", "cost": "999", "creator": "ae", "import_date": "4/21/2021 11:29:55 AM" }, { "batch_number": "20220406000002GHIXYZ34", "supplier": "def", "remaining_qty": "99", "import_qty": 100, "facevalue": "N", "cost": "999", "creator": "ae", "import_date": "4/21/2021 11:29:55 AM" }, { "batch_number": "20220406000002GHIXYZ35", "supplier": "def", "remaining_qty": "99", "import_qty": 100, "facevalue": "N", "cost": "999", "creator": "ae", "import_date": "4/21/2021 11:29:55 AM" }, { "batch_number": "20220406000002GHIXYZ36", "supplier": "def", "remaining_qty": "99", "import_qty": 100, "facevalue": "N", "cost": "999", "creator": "ae", "import_date": "4/21/2021 11:29:55 AM" }, { "batch_number": "20220406000002GHIXYZ37", "supplier": "def", "remaining_qty": "99", "import_qty": 100, "facevalue": "N", "cost": "999", "creator": "ae", "import_date": "4/21/2021 11:29:55 AM" }, { "batch_number": "20220406000002GHIXYZ38", "supplier": "def", "remaining_qty": "99", "import_qty": 100, "facevalue": "N", "cost": "999", "creator": "ae", "import_date": "4/21/2021 11:29:55 AM" }, { "batch_number": "20220406000002GHIXYZ39", "supplier": "def", "remaining_qty": "99", "import_qty": 100, "facevalue": "N", "cost": "999", "creator": "ae", "import_date": "4/21/2021 11:29:55 AM" }, { "batch_number": "20220406000002GHIXYZ40", "supplier": "def", "remaining_qty": "99", "import_qty": 100, "facevalue": "N", "cost": "999", "creator": "ae", "import_date": "4/21/2021 11:29:55 AM" }, { "batch_number": "20220406000002GHIXYZ41", "supplier": "def", "remaining_qty": "99", "import_qty": 100, "facevalue": "N", "cost": "999", "creator": "ae", "import_date": "4/21/2021 11:29:55 AM" }, { "batch_number": "20220406000002GHIXYZ42", "supplier": "def", "remaining_qty": "99", "import_qty": 100, "facevalue": "N", "cost": "999", "creator": "ae", "import_date": "4/21/2021 11:29:55 AM" }, { "batch_number": "20220406000002GHIXYZ43", "supplier": "def", "remaining_qty": "99", "import_qty": 100, "facevalue": "N", "cost": "999", "creator": "ae", "import_date": "4/21/2021 11:29:55 AM" }, { "batch_number": "20220406000002GHIXYZ44", "supplier": "def", "remaining_qty": "99", "import_qty": 100, "facevalue": "N", "cost": "999", "creator": "ae", "import_date": "4/21/2021 11:29:55 AM" }, { "batch_number": "20220406000002GHIXYZ45", "supplier": "def", "remaining_qty": "99", "import_qty": 100, "facevalue": "N", "cost": "999", "creator": "ae", "import_date": "4/21/2021 11:29:55 AM" }, { "batch_number": "20220406000002GHIXYZ46", "supplier": "def", "remaining_qty": "99", "import_qty": 100, "facevalue": "N", "cost": "999", "creator": "ae", "import_date": "4/21/2021 11:29:55 AM" }, { "batch_number": "20220406000002GHIXYZ47", "supplier": "def", "remaining_qty": "99", "import_qty": 100, "facevalue": "N", "cost": "999", "creator": "ae", "import_date": "4/21/2021 11:29:55 AM" }, { "batch_number": "20220406000002GHIXYZ48", "supplier": "def", "remaining_qty": "99", "import_qty": 100, "facevalue": "N", "cost": "999", "creator": "ae", "import_date": "4/21/2021 11:29:55 AM" }, { "batch_number": "20220406000002GHIXYZ49", "supplier": "def", "remaining_qty": "99", "import_qty": 100, "facevalue": "N", "cost": "999", "creator": "ae", "import_date": "4/21/2021 11:29:55 AM" }, { "batch_number": "20220406000002GHIXYZ50", "supplier": "def", "remaining_qty": "99", "import_qty": 100, "facevalue": "N", "cost": "999", "creator": "ae", "import_date": "4/21/2021 11:29:55 AM" }, { "batch_number": "20220406000002GHIXYZ51", "supplier": "def", "remaining_qty": "99", "import_qty": 100, "facevalue": "N", "cost": "999", "creator": "ae", "import_date": "4/21/2021 11:29:55 AM" }, { "batch_number": "20220406000002GHIXYZ52", "supplier": "def", "remaining_qty": "99", "import_qty": 100, "facevalue": "N", "cost": "999", "creator": "ae", "import_date": "4/21/2021 11:29:55 AM" }, { "batch_number": "20220406000002GHIXYZ53", "supplier": "def", "remaining_qty": "99", "import_qty": 100, "facevalue": "N", "cost": "999", "creator": "ae", "import_date": "4/21/2021 11:29:55 AM" }, { "batch_number": "20220406000002GHIXYZ54", "supplier": "def", "remaining_qty": "99", "import_qty": 100, "facevalue": "N", "cost": "999", "creator": "ae", "import_date": "4/21/2021 11:29:55 AM" }, { "batch_number": "20220406000002GHIXYZ55", "supplier": "def", "remaining_qty": "99", "import_qty": 100, "facevalue": "N", "cost": "999", "creator": "ae", "import_date": "4/21/2021 11:29:55 AM" }, { "batch_number": "20220406000002GHIXYZ56", "supplier": "def", "remaining_qty": "99", "import_qty": 100, "facevalue": "N", "cost": "999", "creator": "ae", "import_date": "4/21/2021 11:29:55 AM" }, { "batch_number": "20220406000002GHIXYZ57", "supplier": "def", "remaining_qty": "99", "import_qty": 100, "facevalue": "N", "cost": "999", "creator": "ae", "import_date": "4/21/2021 11:29:55 AM" }, { "batch_number": "20220406000002GHIXYZ58", "supplier": "def", "remaining_qty": "99", "import_qty": 100, "facevalue": "N", "cost": "999", "creator": "ae", "import_date": "4/21/2021 11:29:55 AM" }, { "batch_number": "20220406000002GHIXYZ59", "supplier": "def", "remaining_qty": "99", "import_qty": 100, "facevalue": "N", "cost": "999", "creator": "ae", "import_date": "4/21/2021 11:29:55 AM" }, { "batch_number": "20220406000002GHIXYZ60", "supplier": "def", "remaining_qty": "99", "import_qty": 100, "facevalue": "N", "cost": "999", "creator": "ae", "import_date": "4/21/2021 11:29:55 AM" }, { "batch_number": "20220406000002GHIXYZ61", "supplier": "def", "remaining_qty": "99", "import_qty": 100, "facevalue": "N", "cost": "999", "creator": "ae", "import_date": "4/21/2021 11:29:55 AM" }, { "batch_number": "20220406000002GHIXYZ62", "supplier": "def", "remaining_qty": "99", "import_qty": 100, "facevalue": "N", "cost": "999", "creator": "ae", "import_date": "11/21/2021 11:29:55 AM" }];
  dataCount: number = this.voucherBatchList.length;
  pageSize: number = 10; // how many entries to display per page
  maxPageCount: number = Math.ceil(this.dataCount / this.pageSize); // how many pages in total
  currentPage: number = 1;
  itemNumberStart: number = this.pageSize * (this.currentPage - 1); // item index start for this page
  itemNumberEnd: number = this.itemNumberStart + this.pageSize; // item index end for this page
  thisPageCount: number = 0;  

  constructor() { }

  ngOnInit(): void {
    if (this.itemNumberStart == 0) { // for first page, item index start is 0, but display 1
      this.itemNumberStart = 1;
    }
  }

  //#region for Pagination -- if call api once then handle pagination in FE, then use these methods. else, update variable values based on API response. 
  nextButtonClick() {
    if (this.currentPage >= this.maxPageCount) {
      return;
    }

    this.itemNumberStart += this.pageSize;
    this.itemNumberEnd += this.pageSize;

    this.thisPageCount = this.dataCount - (this.pageSize * this.currentPage);
    if (this.maxPageCount == this.currentPage + 1 && this.itemNumberEnd > this.thisPageCount) { // when max page is reached, and last page data count % pageSize != 0, calculate correct itemNumberEnd:
      this.itemNumberEnd = (this.pageSize * this.currentPage) + this.thisPageCount;
    }

    this.currentPage++;
  }

  previousButtonClick() {
    if (this.currentPage <= 1) {
      return;
    }
    
    if (this.maxPageCount == this.currentPage && this.itemNumberEnd != this.pageSize) { // when max page is reached, and last page data count % pageSize != 0, calculate correct itemNumberEnd:
      this.itemNumberEnd = (this.pageSize * this.currentPage);
    }

    this.itemNumberStart -= this.pageSize;
    this.itemNumberEnd -= this.pageSize;
    this.currentPage--;
  }

  pageNumberClick(p: number) {    
    this.currentPage = p;
    if (p > 1){
      p--;
      this.itemNumberStart = (this.pageSize * p);
      this.itemNumberEnd = this.pageSize + this.itemNumberStart;
      this.itemNumberStart++;
      this.thisPageCount = this.dataCount - (this.pageSize * this.currentPage);
      if (p+1 == this.maxPageCount) // when max page is reached, and last page data count % pageSize != 0, calculate correct itemNumberEnd:
      {
        this.itemNumberEnd = (this.pageSize * this.currentPage) + this.thisPageCount;
      }
    }
    else // first page
    {      
      this.itemNumberStart = 1;
      this.itemNumberEnd = this.pageSize + this.itemNumberStart - 1;
    }
  }
  //#endregion

}
