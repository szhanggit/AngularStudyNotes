import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

// type
import { PortletCards } from 'src/app/pages/uikit/cards/card.model';

@Component({
  selector: 'app-ui-portlet',
  templateUrl: './portlet.component.html',
  styleUrls: ['./portlet.component.scss']
})
export class PortletComponent implements OnInit {

  @Input() card!: PortletCards;
  isCollapsed: boolean = false;
  refreshRequsted: boolean = false;

  @Output() closePortletCard = new EventEmitter<any>();

  constructor () { }

  ngOnInit(): void {
  }

  /**
   * closes portlet card
   */
  closeCard(): void {
    this.closePortletCard.emit(this.card);
  }

  /**
   * refresh card content
   */
  refreshContent(): void {
    this.refreshRequsted = true;
    setTimeout(() => {
      this.refreshRequsted = false;
    }, 1000);
  }

}
