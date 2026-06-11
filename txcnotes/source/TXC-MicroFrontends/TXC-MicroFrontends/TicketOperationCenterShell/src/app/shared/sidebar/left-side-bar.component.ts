import { Component, Input, OnInit, Renderer2 } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { filter, startWith } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthorizationLibraryService } from '@txc-angular/authorization-library';
import { findAllParent } from '../services/helper.utils'; // utility functions
import { User } from '../models/user.model';
import { MENU, MenuItem } from '@txc-angular/authorization-library';
import { TenantService } from 'src/app/business-unit/services/tenant.service';
import { AmmModuleEnum, VoucherChildrenKeysEnum } from '../enum/amm.enum';
import { ChildrenMenu } from '../models/childmenu.model';
// import jwt_decode from 'jwt-decode';
// import { ModResOpModel } from 'src/app/core/models/security/mod-res-op.model';

@Component({
  selector: 'app-left-side-bar',
  templateUrl: './left-side-bar.component.html',
  styleUrls: ['./left-side-bar.component.scss']
})
export class LeftSideBarComponent implements OnInit {

  @Input() navClasses: string | undefined;
  @Input() includeUserProfile: boolean = false;
  @Input() hideLogo: boolean = false;

  selectedTenant!: string;
  isInitialized: boolean = false;

  leftSidebarClass = 'sidebar-enable';
  activeMenuItems: string[] = [];

  loggedInUser: User | null = null;


  menuItems: MenuItem[] = [];

  parentWithFeatureFlags: AmmModuleEnum[] = [
    AmmModuleEnum.Order,
    AmmModuleEnum.Client,
    AmmModuleEnum.Voucher,
    AmmModuleEnum.System
  ]

  childWithFeatureFlags: VoucherChildrenKeysEnum[] = [
    VoucherChildrenKeysEnum.BatchInventoryList
  ]

  constructor(
    private router: Router,
    private readonly authService: AuthorizationLibraryService,
    private readonly tenantService: TenantService) {
  }

  ngOnInit(): void {
    this.initMenu();
    const tenantFromLocalStorage = localStorage.getItem('tenant');

    if (tenantFromLocalStorage) {
      this.selectedTenant = JSON.parse(tenantFromLocalStorage).name;
    }

    this.tenantService.currentTenant$.subscribe(currentTenant => {
      this.selectedTenant = currentTenant;
    });

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        startWith(this.router))
      .subscribe((event: any) => {
        this._activateMenu(event.url.split("/")); //actiavtes menu
        this.hideMenu(); //hides leftbaron change of route
      });
  }

  /**
   * initialize menuitems
   */
  initMenu(): void {
    this.authService.userAuthClaim.subscribe(userClaim => {
      //Added for testing perpose on staging. Will removed after testing.
      //console.log("MENU", MENU);
      //console.log(userClaim)
      this.menuItems = [];
      for (const menu of MENU) {
        if (Array.isArray(userClaim.modules)) {       // if there are more than 1 modules in claims
          for (const module of userClaim.modules) {
            if (menu.id! == module) {
              menu.children = menu.children.filter((f: ChildrenMenu) => {
                if (f.operationId) {
                  return userClaim.operations.includes(f.operationId) && userClaim.resources.includes(f.id!);
                } else {
                  return userClaim.resources.includes(f.id!);
                }
              }); // get menu.children only if the resourse exists
              this.menuItems.push(menu);
            }
          }
        }
        else if (menu.id! == userClaim.modules) {     // if there is only a module in claims and the menu's id is equal to it.
          menu.children = menu.children.filter((f: any) => userClaim.resources.includes(f.id));      // get menu.children only if the resourse exists
          this.menuItems.push(menu);
        }
      }
    });
  }

  /**
   * activates menu
   */
  _activateMenu(matchingMenuItem: string[]): void {
    this.activeMenuItems = matchingMenuItem;

    this.menuItems.forEach((menu: MenuItem) => {
      menu.collapsed = !matchingMenuItem.includes(menu.key!);
    });
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

  hasResources(menu: any) {
    if (menu.code.substring(0, 1) !== 'R') { return };
    return this.authService.hasResource(+(menu.code.substring(2, 4)));
  }

  isCurrentFeature(menu: MenuItem): boolean {
    if (
      this.parentWithFeatureFlags.includes(menu.id as AmmModuleEnum) ||
      this.childWithFeatureFlags.includes(menu.key as VoucherChildrenKeysEnum)
    ) {
      return environment.SHOW_FEATURE_ON_SIDE_BAR;
    }
    return true;
  }
}
