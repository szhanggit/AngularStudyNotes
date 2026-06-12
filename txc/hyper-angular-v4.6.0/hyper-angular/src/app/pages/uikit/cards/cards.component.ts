import { Component, OnInit } from '@angular/core';

// type
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { Variant } from '../shared/uikit.model';
import { PortletCards, StrechedLinkCard } from './card.model';


@Component({
  selector: 'app-ui-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss']
})
export class CardsComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  coloredCards: Variant[] = [];
  borderedCards: Variant[] = [];
  strechedLinkCards: StrechedLinkCard[] = [];
  cardWithImages: string[] = [];
  portletCards: PortletCards[] = [];


  constructor () { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Base UI', path: '/' }, { label: 'Cards', path: '/', active: true }];

    this.coloredCards = [
      {
        name: 'Primary',
        color: 'primary',
      },
      {
        name: 'Success',
        color: 'success',
      },
      {
        name: 'Info',
        color: 'info',
      },
      {
        name: 'Warning',
        color: 'warning',
      },
      {
        name: 'Danger',
        color: 'danger',
      }

    ];
    this.borderedCards = [
      {
        name: 'Secondary',
        color: 'secondary',
      },
      {
        name: 'Info',
        color: 'info',
      },
      {
        name: 'Success',
        color: 'success',
      }

    ];
    this.strechedLinkCards = [
      {
        image: 'assets/images/small/small-2.jpg',
        color: 'primary'
      },
      {
        image: 'assets/images/small/small-3.jpg',
        color: 'success'
      },
      {
        image: 'assets/images/small/small-4.jpg',
        color: 'info'
      },
      {
        image: 'assets/images/small/small-1.jpg',
        color: 'primary'
      }
    ];
    this.cardWithImages = ['assets/images/small/small-1.jpg', 'assets/images/small/small-2.jpg', 'assets/images/small/small-3.jpg'];

    this.portletCards = [
      {
        id: 1
      },
      {
        id: 2,
        bgColor: 'primary',
        textColor: 'white'
      },
      {
        id: 3,
        bgColor: 'success',
        textColor: 'white'
      }
    ];
  }

  /**
   * removes portlet card from screen
   * @param card portlet card
   */
  removePortletCard(card: PortletCards): void {
    this.portletCards.splice(this.portletCards.indexOf(card), 1);
  }

}
