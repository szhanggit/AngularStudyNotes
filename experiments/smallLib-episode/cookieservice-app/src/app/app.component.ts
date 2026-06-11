import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [CookieService]
})
export class AppComponent {
  title = 'cookieservice-app';

  constructor(private cookieService: CookieService){

  }

  ngOnInit(): void {
    // Set a cookie
    this.cookieService.set('TestCookie', 'Hello, World!');

    // Get the cookie
    const myCookie = this.cookieService.get('TestCookie');
    console.log('TestCookie:', myCookie);

    // Check if a cookie exists
    const cookieExists = this.cookieService.check('TestCookie');
    console.log('TestCookie exists:', cookieExists);

    // Delete the cookie
    this.cookieService.delete('TestCookie');

    // Confirm deletion
    const cookieDeleted = this.cookieService.check('TestCookie');
    console.log('TestCookie exists after deletion:', cookieDeleted);
  }

  setCookie(): void{
    this.cookieService.set('TestCookie', 'Hello, World!');
    console.log('Set Cookie.');
  }

  getCookie(): void{
    const myCookie = this.cookieService.get('TestCookie');
    console.log(`Get Cookie: ${myCookie}`);
  }

  deleteCookie(): void{
    this.cookieService.delete('TestCookie');
    const cookieDeleted = this.cookieService.check('TestCookie');
    console.log('TestCookie exists after deletion:', cookieDeleted);
  }
}
