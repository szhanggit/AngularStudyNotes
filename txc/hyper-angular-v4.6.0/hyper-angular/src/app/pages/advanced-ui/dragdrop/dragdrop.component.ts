import { Component, OnInit } from '@angular/core';

// type
import { SortableOptions } from 'sortablejs';
import { BreadcrumbItem } from '../../../shared/page-title/page-title.model';
import { ColoredCard, PersonCard } from './dragdrop.model';

@Component({
  selector: 'app-advaced-ui-dragdrop',
  templateUrl: './dragdrop.component.html',
  styleUrls: ['./dragdrop.component.scss']
})
export class DragdropComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  coloredCards: ColoredCard[] = [];
  personList1: PersonCard[] = [];
  personList2: PersonCard[] = [];
  personList3: PersonCard[] = [];
  personList4: PersonCard[] = [];
  options1: SortableOptions = {};
  options2: SortableOptions = {};

  constructor () { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Extended UI', path: '/' }, { label: 'Drag and Drop', path: '/', active: true }];
    this.coloredCards = [
      {
        id: 1,
        color: 'primary'
      },
      {
        id: 2,
        color: 'secondary',
      },
      {
        id: 3,
        color: 'success'
      },
      {
        id: 4,
        color: 'info'
      },
      {
        id: 5,
        color: 'warning'
      },
      {
        id: 6,
        color: 'danger'
      }];

    this.personList1 = [
      { avatar: 'assets/images/users/avatar-1.jpg', name: 'Louis K. Bond', title: 'Founder' },
      { avatar: 'assets/images/users/avatar-2.jpg', name: 'Dennis N. Cloutier', title: 'VP Product' },
      { avatar: 'assets/images/users/avatar-3.jpg', name: 'Susan J. Sander', title: 'Web Designer' }
    ];

    this.personList2 = [
      { avatar: 'assets/images/users/avatar-4.jpg', name: 'James M. Short', title: 'Web Developer' },
      { avatar: 'assets/images/users/avatar-5.jpg', name: 'Gabriel J. Snyder', title: 'Business Analyst' },
      { avatar: 'assets/images/users/avatar-6.jpg', name: 'Louie C. Mason', title: 'Human Resource' }
    ];

    this.personList3 = [
      { avatar: 'assets/images/users/avatar-1.jpg', name: 'Louis K. Bond', title: 'Founder' },
      { avatar: 'assets/images/users/avatar-2.jpg', name: 'Dennis N. Cloutier', title: 'VP Product' },
      { avatar: 'assets/images/users/avatar-3.jpg', name: 'Susan J. Sander', title: 'Web Designer' }
    ];

    this.personList4 = [
      { avatar: 'assets/images/users/avatar-4.jpg', name: 'James M. Short', title: 'Web Developer' },
      { avatar: 'assets/images/users/avatar-5.jpg', name: 'Gabriel J. Snyder', title: 'Business Analyst' },
      { avatar: 'assets/images/users/avatar-6.jpg', name: 'Louie C. Mason', title: 'Human Resource' }
    ];

    this.options1 = {
      group: 'container1'
    }

    this.options2 = {
      group: 'container2',
      handle: '.dragula-handle',
    }

  }


}
