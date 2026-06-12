import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { EventService } from '../../core/service/event.service';

// type
import { LayoutEventType } from '../../core/constants/events';

// layout constants
import {
  LayoutType, LayoutWidth, SideBarTheme, SideBarWidth, LayoutColor
} from '../shared/models/layout.model';

// utility function
import { getLayoutConfig } from '../shared/helper/utils';

@Component({
  selector: 'app-private-layout',
  templateUrl: './private-layout.component.html',
  styleUrls: ['./private-layout.component.scss']
})
export class PrivateLayoutComponent implements OnInit {


  // layout related config
  layoutType!: LayoutType;
  layoutWidth!: LayoutWidth;
  leftSidebarTheme!: SideBarTheme;
  leftSidebarWidth!: SideBarWidth;
  layoutColor!: LayoutColor;
  configuredDemo!: string;

  constructor (private eventService: EventService) {
  }

  ngOnInit(): void {
    // default settings
    this.configuredDemo = environment.demo;

    // tslint:disable-next-line: max-line-length
    this.layoutType = this.configuredDemo === 'creative' ? LayoutType.LAYOUT_HORIZONTAL : (this.configuredDemo === 'modern' ? LayoutType.LAYOUT_DETACHED : LayoutType.LAYOUT_VERTICAL);
    let config = getLayoutConfig(this.layoutType);
    this.layoutWidth = config.layoutWidth;
    this.leftSidebarTheme = config.leftbarTheme;
    this.leftSidebarWidth = config.leftbarWidth;
    this.layoutColor = config.layoutColor;


    // listen to event and change the layout, theme, etc
    this.eventService.subscribe(LayoutEventType.CHANGE_LAYOUT, (layout) => {
      this.layoutType = layout as LayoutType;
    });

    this.eventService.subscribe(LayoutEventType.CHANGE_LAYOUT_COLOR, (color) => {
      this.layoutColor = color as LayoutColor;
    });

    this.eventService.subscribe(LayoutEventType.CHANGE_LAYOUT_WIDTH, (width) => {
      setTimeout(() => {
        this.layoutWidth = width as LayoutWidth;
        if (this.layoutWidth === LayoutWidth.LAYOUT_WIDTH_BOXED) {
          this.eventService.broadcast(LayoutEventType.CHANGE_LEFT_SIDEBAR_TYPE, SideBarWidth.SIDEBAR_WIDTH_CONDENSED)
        } else {
          this.eventService.broadcast(LayoutEventType.CHANGE_LEFT_SIDEBAR_TYPE, SideBarWidth.SIDEBAR_WIDTH_FIXED)
        }
      }, 20);
    });

    this.eventService.subscribe(LayoutEventType.CHANGE_LEFT_SIDEBAR_THEME, (theme) => {
      this.leftSidebarTheme = theme as SideBarTheme;
    });

    this.eventService.subscribe(LayoutEventType.CHANGE_LEFT_SIDEBAR_TYPE, (type) => {
      this.leftSidebarWidth = type as SideBarWidth;
    });

    this.updateDimensions();

    // window.addEventListener('resize', this.updateDimensions);
  }

  ngAfterViewInit() {
    document.body.classList.remove('authentication-bg');
  }

  /**
   * changes left sidebar type based on screen dimensions
   */
  updateDimensions(): void {
    if (window.innerWidth >= 768 && window.innerWidth <= 1028) {
      this.eventService.broadcast(LayoutEventType.CHANGE_LEFT_SIDEBAR_TYPE, SideBarWidth.SIDEBAR_WIDTH_CONDENSED);
    }
    else if (window.innerWidth > 1028) {
      this.eventService.broadcast(LayoutEventType.CHANGE_LEFT_SIDEBAR_TYPE, SideBarWidth.SIDEBAR_WIDTH_FIXED);
    }
  }

  /**
   * Check if the vertical layout is requested
   */
  isVerticalLayoutRequested() {
    return this.layoutType === LayoutType.LAYOUT_VERTICAL;
  }


  /**
   * Check if the horizontal layout is requested
   */
  isHorizontalLayoutRequested() {
    return this.layoutType === LayoutType.LAYOUT_HORIZONTAL;
  }

  /**
   * Check if the detached layout is requested
   */
  isDetachedLayoutRequested() {
    return this.layoutType === LayoutType.LAYOUT_DETACHED;
  }

  /**
   * Check if full layout is requested
   */
  isFullLayoutRequested(): boolean {
    return this.layoutType === LayoutType.LAYOUT_FULL;
  }


}
