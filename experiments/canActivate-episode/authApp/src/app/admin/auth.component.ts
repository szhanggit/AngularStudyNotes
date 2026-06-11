import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AuthService } from "../model/auth.service";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  public username: string = "sa";
  public password: string = "secret";
  public errorMessage: string = "";
  constructor(private router: Router, private auth: AuthService) { }

  ngOnInit(): void {
  }

  clickEvent(){
    this.auth.authenticate(this.username, this.password).subscribe(response => {
      console.log("Response is: " + response);
      if (response) {
          this.router.navigateByUrl("/admin");
      }
      this.errorMessage = "Authentication Failed";
  })
  }

}
