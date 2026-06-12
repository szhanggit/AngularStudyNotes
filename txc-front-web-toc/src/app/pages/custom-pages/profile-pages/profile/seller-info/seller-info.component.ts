import { Component, Input, OnInit } from '@angular/core';

// types
import { User } from 'src/app/core/models/auth.models';

@Component({
  selector: 'app-profile-seller-info',
  templateUrl: './seller-info.component.html',
  styleUrls: ['./seller-info.component.scss']
})
export class SellerInfoComponent implements OnInit {


  @Input() loggedInUser: User | null = null;
  constructor () { }

  ngOnInit(): void {
  }


}
