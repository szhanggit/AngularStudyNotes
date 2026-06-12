import { Component, Input, OnChanges, OnInit, Renderer2 } from '@angular/core';
import { EventService } from 'src/app/core/service/event.service';

// type
import { LayoutEventType } from 'src/app/core/constants/events';

// layout constants
import { LayoutColor, LayoutType, LayoutWidth, SideBarTheme, SideBarWidth } from '../models/layout.model';

@Component({
  selector: 'app-right-side-bar',
  templateUrl: './right-side-bar.component.html',
  styleUrls: ['./right-side-bar.component.scss']
})
export class RightSideBarComponent implements OnInit, OnChanges {

  private isShowing: boolean = false;
  public disableSidebarWidth: boolean = false;

  // layout config
  @Input() layoutType!: LayoutType;
  @Input() layoutWidth!: LayoutWidth;
  @Input() leftSidebarTheme!: SideBarTheme;
  @Input() leftSidebarWidth!: SideBarWidth;
  @Input() layoutColor!: LayoutColor;


  rightSidebarClass = 'end-bar-enabled';

  constructor (
    private renderer: Renderer2,
    private eventService: EventService
  ) {
    // listen to event and open/hide the right sidebar

    // show
    this.eventService.subscribe(LayoutEventType.SHOW_RIGHT_SIDEBAR, () => {
      this.show();
    });

    // hide
    this.eventService.subscribe(LayoutEventType.HIDE_RIGHT_SIDEBAR, () => {
      this.hide();
    });
  }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    if (this.isShowing) {
      this.renderer.addClass(document.body, this.rightSidebarClass);
    } else {
      this.renderer.removeClass(document.body, this.rightSidebarClass);
    }
    if (window.innerWidth <= 1024 && this.layoutType === 'full') {
      this.disableSidebarWidth = true;
    }
    else {
      this.disableSidebarWidth = false;
    }
  }

  /**
   * Toggle the sidebar
   */
  toggleRightSideBar(): void {
    if (document.body.classList.contains(this.rightSidebarClass)) {
      this.renderer.removeClass(document.body, this.rightSidebarClass);
    } else {
      this.renderer.addClass(document.body, this.rightSidebarClass);
    }
  }

  /**
   * Shows the sidebar
   */
  show(): void {
    setTimeout(() => {
      this.isShowing = true;
      this.renderer.addClass(document.body, this.rightSidebarClass);
    }, 100);
  }

  /**
   * Hide the sidebar
   */
  hide(): void {
    if (document.body.classList.contains(this.rightSidebarClass)) {
      this.renderer.removeClass(document.body, this.rightSidebarClass);
      this.isShowing = false;
    }
  }

  /**
   * Change the given layout
   * @param layout layout name
  */
  changeLayout(layout: string): void {
    this.layoutType = layout as LayoutType;
    this.eventService.broadcast(LayoutEventType.CHANGE_LAYOUT, this.layoutType);
  }

  /**
   * Change the color
   * @param layout color type
   */
  changeColorScheme(color: string): void {
    this.layoutColor = color as LayoutColor;
    this.eventService.broadcast(LayoutEventType.CHANGE_LAYOUT_COLOR, this.layoutColor);
  }

  /**
 * Change the width
 * @param layout width type
 */
  changeLayoutWidth(width: string): void {
    this.layoutWidth = width as LayoutWidth;
    this.eventService.broadcast(LayoutEventType.CHANGE_LAYOUT_WIDTH, this.layoutWidth);
  }

  /**
   * Change the side bar theme
   * @param theme name
   */
  changeLeftSidebarTheme(theme: string): void {
    this.leftSidebarTheme = theme as SideBarTheme;
    this.eventService.broadcast(LayoutEventType.CHANGE_LEFT_SIDEBAR_THEME, this.leftSidebarTheme);
  }

  /**
   * Change the side bar width
   * @param type type of sidebar
   */
  changeLeftSidebarType(type: string): void {
    this.leftSidebarWidth = type as SideBarWidth;
    this.eventService.broadcast(LayoutEventType.CHANGE_LEFT_SIDEBAR_TYPE, this.leftSidebarWidth);
  }

  /**
   * Reset everything
   */
  reset(): void {
    this.changeLayout(LayoutType.LAYOUT_VERTICAL);
    this.changeColorScheme(LayoutColor.LAYOUT_COLOR_LIGHT);
    this.changeLayoutWidth(LayoutWidth.LAYOUT_WIDTH_FLUID);
    this.changeLeftSidebarType(SideBarWidth.SIDEBAR_WIDTH_FIXED);
    this.changeLeftSidebarTheme(SideBarTheme.SIDEBAR_THEME_DEFAULT);
  }

}
