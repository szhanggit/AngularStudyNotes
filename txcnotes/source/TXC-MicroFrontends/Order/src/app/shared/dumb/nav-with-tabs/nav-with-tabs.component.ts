import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Tab } from '../../models/dumb-models/tab.model';

@Component({
  selector: 'app-nav-with-tabs',
  templateUrl: './nav-with-tabs.component.html',
  styleUrls: ['./nav-with-tabs.component.scss'],
})
export class NavWithTabsComponent implements OnInit {
  @Input() tabs: Tab[] = [];
  @Input() activeTab = 1;
  @Output() tabChange = new EventEmitter<number>();

  ngOnInit(): void {
    this.tabChange.emit(this.activeTab);
  }

  onNavChange(activeTab: number) {
    this.tabChange.emit(activeTab);
  }
}
