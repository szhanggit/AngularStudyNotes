import { AfterViewInit, Component, Input, OnInit, Renderer2 } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';

// services
import { AuthenticationService } from 'src/app/core/service/auth.service';

// utility functions
import { findAllParent, findMenuItem } from '../helper/utils';

// type
import { User } from 'src/app/core/models/auth.models';
import { MenuItem } from '../models/menu.model';

// data
import { MENU } from '../config/menu-meta';



@Component({
  selector: 'app-left-side-bar',
  templateUrl: './left-side-bar.component.html',
  styleUrls: ['./left-side-bar.component.scss']
})
export class LeftSideBarComponent implements OnInit, AfterViewInit {

  @Input() navClasses: string | undefined;
  @Input() includeUserProfile: boolean = false;
  @Input() hideLogo: boolean = false;
  isInitialized: boolean = false;

  leftSidebarClass = 'sidebar-enable';
  activeMenuItems: string[] = [];

  loggedInUser: User | null = null;


  menuItems: MenuItem[] = [];

  constructor (
    private router: Router,
    private authService: AuthenticationService,
    private renderer: Renderer2) {
    router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {
        this._activateMenu(); //actiavtes menu
        this.hideMenu(); //hides leftbaron change of route
      }
    });
  }

  ngOnInit(): void {
    this.initMenu();
    this.loggedInUser = this.authService.currentUser();
  }

  /**
   * On view init - activating menuitems
   */
  ngAfterViewInit() {
    setTimeout(() => {
      this._activateMenu();
    });
  }

  /**
   * initialize menuitems
   */
  initMenu(): void {
    this.menuItems = MENU;
  }

  /**
   * activates menu
   */
  _activateMenu(): void {
    const div = document.getElementById('leftside-menu-container');
    let matchingMenuItem = null;

    if (div) {
      let items: any = div.getElementsByClassName('side-nav-link-ref');
      for (let i = 0; i < items.length; ++i) {
        if (window.location.pathname === items[i].pathname) {
          matchingMenuItem = items[i];
          break;
        }
      }

      if (matchingMenuItem) {
        const mid = matchingMenuItem.getAttribute('data-menu-key');
        const activeMt = findMenuItem(this.menuItems, mid);
        if (activeMt) {

          const matchingObjs = [activeMt['key'], ...findAllParent(this.menuItems, activeMt)];

          this.activeMenuItems = matchingObjs;

          this.menuItems.forEach((menu: MenuItem) => {
            menu.collapsed = !matchingObjs.includes(menu.key!);
          });
        }
      }
    }
  }

  /**
   * toggles open menu
   * @param menuItem clicked menuitem
   * @param collapse collpase instance
   */
  toggleMenuItem(menuItem: MenuItem, collapse: NgbCollapse): void {
    collapse.toggle();
    let openMenuItems: string[];
    if (!menuItem.collapsed) {
      openMenuItems = ([menuItem['key'], ...findAllParent(this.menuItems, menuItem)]);
      this.menuItems.forEach((menu: MenuItem) => {
        if (!openMenuItems.includes(menu.key!)) {
          menu.collapsed = true;
        }
      })
    }

  }


  /**
   * Returns true or false if given menu item has child or not
   * @param item menuItem
   */
  hasSubmenu(menu: MenuItem): boolean {
    return menu.children ? true : false;
  }


  /**
   * Hides the menubar
   */
  hideMenu() {
    document.body.classList.remove('sidebar-enable');
  }

}
