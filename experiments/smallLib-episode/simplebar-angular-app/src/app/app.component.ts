import { Component } from '@angular/core';
import { MenuItem } from './models/menu.model';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
// utility functions
import { findAllParent } from './helper/utils';
import { User } from './models/auth.model';
import { MENU } from './models/menu-data.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'simplebar-angular-app';
  items = Array.from({ length: 50 }, (_, i) => `Item ${i + 1}`);
  options = { autoHide: false, scrollbarMinSize: 100 };
  activeMenuItems: string[] = [];
  selectedTenant!: string;
  menuItems: MenuItem[] = [];
  loggedInUser: User | null = null;

  constructor(){}

  ngOnInit(): void {
    //this.authSvc.userAuthClaim.subscribe(data=>{
      //this.userAuthClaim = data;
      
      this.fnFilterMenu();
    //});
  }

  private fnFilterMenu(){
    //const route = this.router.url.toLowerCase();

    this.menuItems = MENU.filter(f=> f.id != 0 && f.id != undefined && f.id != null);

    this.menuItems.forEach(f=>{
      let children = f.children as [];

      f.children = children;
    });
  }

  /**
   * activates menu
   */
  /*_activateMenu(matchingMenuItem: string[]): void {
    this.activeMenuItems = matchingMenuItem;

    this.menuItems.forEach((menu: MenuItem) => {
      menu.collapsed = !matchingMenuItem.includes(menu.key!);
    });
  }*/

  /**
   * toggles open menu
   * @param menuItem clicked menuitem
   * @param collapse collpase instance
   */
  toggleMenuItem(menuItem: MenuItem, collapse: NgbCollapse): void {
    collapse.toggle();          //It is for toggling menu item. Just this line.
    let openMenuItems: string[];      
    if (!menuItem.collapsed) {  //一个展开，其它自动合起。
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
