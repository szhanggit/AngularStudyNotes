import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../../core/service/auth.service';

// type
import { User } from '.././../../../core/models/auth.models';
import { BreadcrumbItem } from '../../../../shared/page-title/page-title.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  loggedInUser: User | null = null;

  constructor (private authService: AuthenticationService) { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Pages', path: '/' }, { label: 'Profile', path: '/', active: true }];
    this.loggedInUser = this.authService.currentUser();

  }




}
