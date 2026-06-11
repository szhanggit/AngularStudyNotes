import { Component, OnInit } from '@angular/core';

// type
import { FAQItem } from 'src/app/shared/widget/faq/faq.model';
import { BreadcrumbItem } from '../../../../shared/page-title/page-title.model';

// data
import { rawFAQs } from './data';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {

  rawFAQ: FAQItem[] = [];
  pageTitle: BreadcrumbItem[] = [];

  constructor () { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Pages', path: '/' }, { label: 'FAQ', path: '/', active: true }];
    this.rawFAQ = rawFAQs;
  }

}
