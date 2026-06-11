import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { jwtDecode } from "jwt-decode";
import { FormsModule } from '@angular/forms';
import { ModResOpModel } from "./mod-res-op.model";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'jwtdecode-app';
  jwt_decode = "";

  jwt = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI1MCIsIm5iZiI6MTU4NjEwNDQwOCwiaWF0IjoxNTg2MTA0NDA4LCJleHAiOjE1ODYxMDgwMDgsImp0aSI6IjhkZjAyMzVhLWY3ODctNDQ0NS1iMGVkLWUwNmZkNmYwNTlkZiIsInN1YiI6Imt0Yi11c2VyIiwidWlkIjoiNjIwMDEiLCJyb2xlIjoiYWRtaW4iLCJncmFudFJvbGUiOiJiYWxsemEifQ.MCDJ8IMBQF_98mCd7gO9-psC6gUuwJa5u_0QbTqRoZ7IbMT9NP03IF-9vggAjUxawFdDnwb8M3aycSezQYi-o_WOk3-U2oicJ7U4kgfJBIRdRvbqaiZ3RDee8nP9FuIDGGGeaaSQLDkh7025-xjblJaSyfTGzTbOKHyvuW-w50kVwG3SVD2f-2eOpwl4_xtRwOc-Q3RJr3FM0xfO2MuglaQJ8QQ0i98PYE6V0CIXaKu1bx0m5HEKUiUxBiPvMSuF41u6FaOufqIIf-IrIdvBfaAbFCX-LmBzTCgr4b1i8Y5Lnyyzmc6wUPeYxXGerxjiX4katpncj7X9pNKEfNIyQg";

  ngOnInit() {
    this.decodeJWT();
  }

  decodeJWT() {
    var token = this.jwt;
    var decoded = jwtDecode(token) as ModResOpModel;
    console.log(`aud is: ${decoded.aud}`);
    this.jwt_decode = JSON.stringify(decoded);
    console.log(this.jwt_decode);
  }

  changeOnTextArea(e: any) {
    console.log(e);
    this.jwt = e;
    this.decodeJWT();
  }
}
