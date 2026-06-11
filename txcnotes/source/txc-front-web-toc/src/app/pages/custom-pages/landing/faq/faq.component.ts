import { Component, OnInit } from '@angular/core';

// type
import { FAQItem } from 'src/app/shared/widget/faq/faq.model';

@Component({
  selector: 'app-landing-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {

  FAQs: FAQItem[] = [];
  constructor () { }

  ngOnInit(): void {
    this.FAQs = [
      {
        id: 1,
        question: 'Can I use this template for my client?',
        answer: 'Yup, the marketplace license allows you to use this theme in any end products. For more information on licenses, please refere here.',
        titleClass: 'text-body',
        textClass: 'pb-1 text-muted',
      },
      {
        id: 2,
        question: 'Can this theme work with Wordpress?',
        answer: "No. This is a HTML template. It won't directly with wordpress, though you can convert this into wordpress compatible theme.",
        titleClass: 'text-body',
        textClass: 'pb-1 text-muted',
      },
      {
        id: 3,
        question: 'How do I get help with the theme?',
        answer: 'Use our dedicated support email (support@coderthemes.com) to send your issues or feedback. We are here to help anytime.',
        titleClass: 'text-body',
        textClass: 'pb-1 text-muted',
      },
      {
        id: 4,
        question: 'Will you regularly give updates of Hyper?',
        answer: 'Yes, We will update the Hyper regularly. All the future updates would be available without any cost.',
        titleClass: 'text-body',
        textClass: 'pb-1 text-muted',
      }
    ]
  }

}
