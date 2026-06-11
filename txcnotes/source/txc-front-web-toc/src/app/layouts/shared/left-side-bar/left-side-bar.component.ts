import { Component, Input, OnInit, Renderer2 } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { filter, startWith } from 'rxjs';

// services
import { AuthenticationService } from 'src/app/core/service/auth.service';

// utility functions
import { findAllParent } from '../helper/utils';

// type
import { User } from 'src/app/core/models/auth.models';
import { MenuItem } from '../models/menu.model';

// data
import { MENU } from '../config/menu-meta';
import { EventService } from 'src/app/core/service/event.service';
import { LayoutEventType } from 'src/app/core/constants/events';

import jwt_decode from 'jwt-decode';
import { ModResOpModel, UserAuthClaim } from 'src/app/core/models/security/mod-res-op.model';
import { AuthService } from 'src/app/core/service/security/auth.service';

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
  userAuthClaim: UserAuthClaim;

  constructor (
    private router: Router,
    private eventService: EventService,
    private authSvc: AuthService) {
  }

  ngOnInit(): void {
    this.initMenu();

    this.router.events
    .pipe(
      filter((event) => event instanceof NavigationEnd),
      startWith(this.router))
    .subscribe((event: any) => {
      this._activateMenu(event.url.split("/")); //actiavtes menu
      this.hideMenu(); //hides leftbaron change of route
      this.fnFilterMenu();
    });

    // this.eventService.subscribe(LayoutEventType.CHANGE_TENANT_COUNTRY, (tenantCountry) => {
    //   this.selectedTenant = tenantCountry as string;
    // });
  }

  /**
   * initialize menuitems
   */
  initMenu(): void {
    
    this.authSvc.userAuthClaim.subscribe(data=>{
      this.userAuthClaim = data;
      
      this.fnFilterMenu();
    });
    //this.menuItems = MENU;
  }

  private fnFilterMenu(){
    const route = this.router.url.toLowerCase();
    const data = this.userAuthClaim;
    let isAdmin = parseInt(data.user.userType) === 2;
      let isAmm = route.indexOf('maintenance') >= 0;
      const ammId = 1; // this is a constant id in database this should not change
      console.log("is Amm",isAmm);
      if(Array.isArray(data.modules)){
        const mods= data.modules;

        if(isAmm)
          this.menuItems = MENU.filter(f=> f.id != 0 && f.id === ammId && f.id != undefined && f.id != null && mods.includes(f.id));
        else
          this.menuItems = MENU.filter(f=> f.id != 0 && f.id != ammId && f.id != undefined  && f.id != null && mods.includes(f.id));

        // if((isAmm) && (isAdmin))
        //   this.menuItems = MENU.filter(f=> f.id != 0 && f.id === ammId && f.id != undefined && f.id != null && mods.includes(f.id));
        // else
          // this.menuItems = MENU.filter(f=> f.id != 0 && f.id != undefined && f.id != ammId && f.id != null && mods.includes(f.id));
        
        //this.menuItems = MENU.filter(f=> f.id != 0 && f.id != undefined && f.id != null && mods.includes(f.id));
      }else{
        if(isAmm)
          this.menuItems = MENU.filter(f=> f.id != 0 && f.id != undefined && f.id === ammId  && f.id != null && f.id === data.modules);
        else
          this.menuItems = MENU.filter(f=> f.id != 0 && f.id != undefined && f.id != ammId && f.id != null && f.id === data.modules);

        // if((isAmm) && (isAdmin))
        //   this.menuItems = MENU.filter(f=> f.id != 0 && f.id === ammId && f.id != undefined && f.id != null && f.id === data.modules);
        // else
          // this.menuItems = MENU.filter(f=> f.id != 0 && f.id != undefined && f.id != ammId && f.id != null && f.id === data.modules);
        //this.menuItems = MENU.filter(f=> f.id != 0 && f.id != undefined && f.id != null && f.id === data.modules);
      }
      

      this.menuItems.forEach(f=>{
        let children = f.children as [];
        for(let c = children.length -1; c>=0; c--){

          if(!(Array.isArray(data.resources))){
            data.resources = [data.resources];
          }
          const inList = data.resources.filter(f=> children[c]["id"] == f);
          if(inList.length === 0){
            children.splice(c,1);
          }
        }
        f.children = children;
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

}
