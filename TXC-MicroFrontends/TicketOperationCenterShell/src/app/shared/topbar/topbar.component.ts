import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

// models
import { User } from '../models/user.model';
import { ProfileOptionItem } from '../models/profileoption.model';
import { BusinessUnitSelectComponent } from 'src/app/business-unit/components/business-unit-select/business-unit-select.component';
import { TenantService } from 'src/app/business-unit/services/tenant.service';

import { AuthorizationLibraryService } from '@txc-angular/authorization-library';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})

export class TopbarComponent implements OnInit {
  @Input() hideLogo: boolean = true;
  @Input() cssClasses: string = '';
  @Input() layoutType: string = '';

  landingUrl = "";
  loggedInUser: User | null = null;
  topnavCollapsed: boolean = false;

  userName: string | null = null;
  displayedRole: string | null = null;
  email: string | null = null;
  fullName: string | null = null;
  tenantName: string | null = null;

  profileOptions: ProfileOptionItem[] = [];

  canAccessManagement: boolean = false;

  // output events
  @Output() settingsButtonClicked = new EventEmitter<boolean>();
  @Output() mobileMenuButtonClicked = new EventEmitter();

  constructor(
    public router: Router,
    private modalService: NgbModal,
    private authService: AuthorizationLibraryService,
    private tenantService: TenantService) {

    tenantService.currentTenant$.subscribe(tenant => {
      this.tenantName = tenant;
    });
  }

  switchBu() {
    this.modalService.open(BusinessUnitSelectComponent, {
      centered: true,
      size: 'md',
      backdrop: 'static'
    });
  }

  accessManagement() {
    document.location.href = `${environment.landingUrl}/#/maintenance`;
  }

  logout() {
    localStorage.clear();
    this.authService.logout(environment.landingUrl);
  }

  ngOnInit(): void {
    this.authService.userAuthClaim.subscribe((d) => {
      this.email = d.user.email;
      this.userName = d.user.userName;
      this.displayedRole = d.user.displayedRole;
      this.fullName = d.user.fullName;
      // initialize if user has access management right or not
      if (Array.isArray(d.modules))
        this.canAccessManagement = d.modules.includes(1); // module_id 1 means Administration in [tb_m_module]
      else
        this.canAccessManagement = d.modules == 1; // module_id 1 means Administration in [tb_m_module]
    });
    this.tenantName = this.tenantService.GetTenantFromLocalStorage()?.name!;
    this._fetchProfileOptions();
  }

  /**
   * Fetches profile options
   */
  _fetchProfileOptions(): void {
    this.profileOptions = [
      {
        label: 'Logout',
        icon: 'mdi mdi-logout',
        redirectTo: '/account/logout',
      }
    ];
  }

  /**
   * Toggles the right sidebar
   */
  toggleRightSidebar() {
    this.settingsButtonClicked.emit();
  }

  /*
  * Toggle left sidebar width - condensed
  */

  toggleSidebarWidth(): void {
    document.body.classList.toggle('hide-menu');
    document.body.classList.toggle('sidebar-enable');
  }



  /**
   * Toggle the menu bar when having mobile screen
   */
  toggleMobileMenu(event: any): void {
    this.topnavCollapsed = !this.topnavCollapsed;
    event.preventDefault();
    this.mobileMenuButtonClicked.emit();
  }


  onOptionClick(event: any, route?: string): void {
    if (route) {
      if (route === '.') {
        event.preventDefault();
      } else {
        this.router.navigateByUrl(route);
      }
    }


  }

}

