import { Component, Input, OnInit } from '@angular/core';

// type
import { FAQItem } from './faq.model';

@Component({
  selector: 'app-widget-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {

  @Input() rawFAQ: FAQItem[] = [];
  constructor () { }

  ngOnInit(): void {
  }

}
