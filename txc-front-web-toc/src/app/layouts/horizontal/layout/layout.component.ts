import { AfterViewInit, Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { EventService } from 'src/app/core/service/event.service';
// type
import { LayoutEventType } from 'src/app/core/constants/events';

//  layout constants
import { LayoutColor, LayoutWidth } from '../../shared/models/layout.model';

@Component({
  selector: 'app-horizontal-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, AfterViewInit {

  @Input() layoutWidth!: LayoutWidth;
  @Input() layoutColor!: LayoutColor;
  @Input() configuredDemo: string = '';

  topbarCssClasses: string = '';
  topnavTheme: string = '';
  topnavContainerClasses: string = '';
  showMobileMenu: boolean = false;
  reRender: boolean = true;

  constructor (private eventService: EventService) { }

  ngOnInit(): void {
    // css classes based on theme demo
    this.topbarCssClasses = this.configuredDemo === 'creative' ? 'topnav-navbar topnav-navbar-dark' : 'topnav-navbar';
    this.topnavTheme = this.configuredDemo === 'creative' ? 'light' : 'dark';
    this.topnavContainerClasses = this.configuredDemo === 'creative' ? 'shadow-sm' : '';
  }


  /**
   * performs re-rendering
   */
  _setRerender = () => {
    this.reRender = false;
    setTimeout(() => {
      this.reRender = true;
    }, 0.05);
  }

  /**
   * On view init - activating horizontal layout
  */
  ngAfterViewInit() {
    document.body.setAttribute('data-layout', 'topnav');
    document.body.removeAttribute('data-leftbar-theme');
    document.body.removeAttribute('data-leftbar-compact-mode');
  }


  /**
   * changes layout configurations 
   */
  ngOnChanges(changes: SimpleChanges) {
    this.changeLayoutConfig();
    if (changes["layoutWidth"]) {
      this._setRerender();
    }
  }


  /**
  * changes layout related options
  */
  changeLayoutConfig(): void {
    // boxed vs fluid
    document.body.setAttribute('data-layout-mode', this.layoutWidth);

    // layout color
    document.body.setAttribute('data-layout-color', this.layoutColor);
  }

  /**
   * On settings button clicked from topbar
   */
  onSettingsButtonClicked() {
    this.eventService.broadcast(LayoutEventType.SHOW_RIGHT_SIDEBAR, true);
  }

  /**
   * On mobile toggle button clicked
   */
  onToggleMobileMenu() {
    this.showMobileMenu = !this.showMobileMenu;
  }

}
