import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { EventService } from 'src/app/core/service/event.service';

// type
import { LayoutEventType } from 'src/app/core/constants/events';

//  layout constants
import { LayoutColor, LayoutWidth, SideBarTheme, SideBarWidth } from '../../shared/models/layout.model';

@Component({
  selector: 'app-vertical-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, AfterViewInit, OnChanges {


  @Input() layoutWidth!: LayoutWidth;
  @Input() sidebarTheme!: SideBarTheme;
  @Input() sidebarType!: SideBarWidth;
  @Input() layoutColor!: LayoutColor;

  reRender: boolean = true;
  constructor (
    private eventService: EventService
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    document.body.setAttribute('data-layout', 'vertical');
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
   * controls re-rendering
   */
  _setRerender = () => {
    this.reRender = false;
    setTimeout(() => {
      this.reRender = true;
    }, 0.05);
  }

  /**
   * changes layout related options
   */
  changeLayoutConfig(): void {
    // boxed vs fluid
    document.body.setAttribute('data-layout-mode', this.layoutWidth);

    // layout color
    document.body.setAttribute('data-layout-color', this.layoutColor);

    // left sidebar theme
    document.body.setAttribute('data-leftbar-theme', this.sidebarTheme);

    // left sidebar type
    document.body.setAttribute('data-leftbar-compact-mode', this.sidebarType);

  }

  /**
  * on settings button clicked from topbar
  */
  onSettingsButtonClicked() {
    this.eventService.broadcast(LayoutEventType.SHOW_RIGHT_SIDEBAR, true);
  }

  /**
 * On mobile toggle button clicked
 */
  onToggleMobileMenu() {
    document.body.classList.toggle('sidebar-enable');
  }


}
