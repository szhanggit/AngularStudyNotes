import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

// services
import { AuthenticationService } from 'src/app/core/service/auth.service';
import { EventService } from 'src/app/core/service/event.service';

// types
import { LayoutEventType } from 'src/app/core/constants/events';
import { User } from 'src/app/core/models/auth.models';
import { AppsItem } from '../../shared/models/apps.model';
import { Language } from '../../shared/models/language.model';
import { NotificationItem } from '../../shared/models/notification.model';
import { ProfileOptionItem } from '../../shared/models/profileoption.model';
import { SearchResultItem, SearchUserItem } from '../../shared/models/search.model';

// layout constants
import { LayoutType, SideBarWidth } from '../models/layout.model';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {


  @Input() hideLogo: boolean = false;
  @Input() cssClasses: string = '';
  @Input() layoutType: string = '';

  notificationList: NotificationItem[] = [];
  languages: Language[] = [];
  apps: AppsItem[] = [];
  profileOptions: ProfileOptionItem[] = [];
  selectedLanguage?: Language;
  searchResults: SearchResultItem[] = [];
  searchUsers: SearchUserItem[] = [];
  loggedInUser: User | null = null;
  topnavCollapsed: boolean = false;

  // output events
  @Output() settingsButtonClicked = new EventEmitter<boolean>();
  @Output() mobileMenuButtonClicked = new EventEmitter();
  constructor (
    private authService: AuthenticationService,
    private eventService: EventService,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.loggedInUser = this.authService.currentUser()
    // get notifications
    this._fetchNotifications();
    // get supported languages
    this._fetchLanguages();
    // get apps
    this._fetchApps();
    // get profile menu options
    this._fetchProfileOptions();
    // get search results
    this._fetchSearchData();
  }


  /**
   * Fetches notifications
   */
  _fetchNotifications(): void {
    this.notificationList = [
      {
        day: 'Today',
        messages: [
          {
            id: 1,
            title: 'Datacorp',
            text: 'Caleb Flakelar commented on Admin',
            time: '1 min ago',
            icon: 'mdi mdi-comment-account-outline',
            variant: 'primary',
            isRead: false,
          },
          {
            id: 2,
            title: 'Admin',
            text: 'New user registered.',
            time: '1 hours ago',
            icon: 'mdi mdi-account-plus',
            variant: 'info',
            isRead: true,
          },
        ],
      },
      {
        day: 'Yesterday',
        messages: [
          {
            id: 1,
            title: 'Cristina Pride',
            text: 'Hi, How are you? What about our next meeting',
            time: '1 day ago',
            avatar: 'assets/images/users/avatar-2.jpg',
            isRead: true,
          },
        ],
      },
      {
        day: '30 Dec 2021',
        messages: [
          {
            id: 1,
            title: 'Datacorp',
            text: 'Caleb Flakelar commented on Admin',
            icon: 'mdi mdi-comment-account-outline',
            variant: 'primary',
            isRead: true,
          },
          {
            id: 2,
            title: 'Karen Robinson',
            text: 'Wow ! this admin looks good and awesome design',
            avatar: 'assets/images/users/avatar-4.jpg',
            isRead: true,
          },
        ],
      },
    ];
  }

  /**
   * Fetches supported languages
   */
  _fetchLanguages(): void {
    this.languages = [{
      id: 1,
      name: 'English',
      flag: 'assets/images/flags/us.jpg',
    },
    {
      id: 2,
      name: 'German',
      flag: 'assets/images/flags/germany.jpg',
    },
    {
      id: 3,
      name: 'Italian',
      flag: 'assets/images/flags/italy.jpg',
    },
    {
      id: 4,
      name: 'Spanish',
      flag: 'assets/images/flags/spain.jpg',
    },
    {
      id: 5,
      name: 'Russian',
      flag: 'assets/images/flags/russia.jpg',
    }];
    this.selectedLanguage = this.languages[0];
  }

  /**
   * Fetches brands
   */
  _fetchApps(): void {
    this.apps = [{
      id: 1,
      name: 'Slack',
      logo: 'assets/images/brands/slack.png',
    },
    {
      id: 2,
      name: 'Github',
      logo: 'assets/images/brands/github.png',
    },
    {
      id: 3,
      name: 'Dribbble',
      logo: 'assets/images/brands/dribbble.png',
    },
    {
      id: 4,
      name: 'Bitbucket',
      logo: 'assets/images/brands/bitbucket.png',
    },
    {
      id: 5,
      name: 'Dropbox',
      logo: 'assets/images/brands/dropbox.png',
    },
    {
      id: 6,
      name: 'G Suite',
      logo: 'assets/images/brands/g-suite.png',
    }];
  }

  /**
   * Fetches profile options
   */
  _fetchProfileOptions(): void {
    this.profileOptions = [
      {
        label: 'My Account',
        icon: 'mdi mdi-account-circle',
        redirectTo: '.',
      },
      {
        label: 'Settings',
        icon: 'mdi mdi-account-edit',
        redirectTo: '.',
      },
      {
        label: 'Support',
        icon: 'mdi mdi-lifebuoy',
        redirectTo: '.',
      },
      {
        label: 'Lock Screen',
        icon: 'mdi mdi-lock-outline',
        redirectTo: '/account/lock-screen',
      },
      {
        label: 'Logout',
        icon: 'mdi mdi-logout',
        redirectTo: '/account/logout',
      },
    ];
  }




  /**
   * Fetches search results
   */
  _fetchSearchData(): void {
    this.searchResults = [{
      id: 1,
      text: 'Analytics Report',
      icon: 'uil-notes',
    },
    {
      id: 2,
      text: 'How can I help you?',
      icon: 'uil-life-ring',
    },
    {
      id: 3,
      text: 'User profile settings',
      icon: 'uil-cog',
    }];
    this.searchUsers = [{
      id: 1,
      name: 'Erwin Brown',
      position: 'UI Designer',
      profile: 'assets/images/users/avatar-2.jpg'
    },
    {
      id: 2,
      name: 'Jacob Deo',
      position: 'Developer',
      profile: 'assets/images/users/avatar-5.jpg'
    }]

  }


  /**
  * Change the language
  * @param language selected language from dropdown
  */
  changeLanguage(language: Language) {
    this.selectedLanguage = language;
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
    switch (this.layoutType) {
      case LayoutType.LAYOUT_VERTICAL:
        if (document.body.hasAttribute('data-leftbar-compact-mode') && document.body.getAttribute('data-leftbar-compact-mode') === 'condensed') {
          // document.body.removeAttribute('data-leftbar-compact-mode');
          this.eventService.broadcast(LayoutEventType.CHANGE_LEFT_SIDEBAR_TYPE, SideBarWidth.SIDEBAR_WIDTH_FIXED);
        } else {
          // document.body.setAttribute('data-leftbar-compact-mode', 'condensed');
          this.eventService.broadcast(LayoutEventType.CHANGE_LEFT_SIDEBAR_TYPE, SideBarWidth.SIDEBAR_WIDTH_CONDENSED);
        }
        break;

      case LayoutType.LAYOUT_FULL:
        document.body.classList.toggle('hide-menu');
        document.body.classList.toggle('sidebar-enable');
    }

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
