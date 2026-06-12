import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
  <div>
    <span [innerHTML] = 'Title' ></span>   
  </div>
  <div>
    <img src = {{ImagePath}} />
  </div>
  <div>
    <img [src] = 'ImagePath' />
  </div>
  <div>
    <img src = 'https://dotnettutorials.net{{ImageShortPath}}' />
  </div>
  <div>
    <button [disabled] = 'IsDisabledClick'>Click Here</button>
  </div>  
  <div>
    <button disabled = {{IsDisabledClick}}>Click Here</button>
  </div>    
  <div>
      {{MaliciousData}}           
  </div>
  <div 
    [innerHTML] = 'MaliciousData'>         
  </div>
  `
})
export class AppComponent {
  Title : string = 'Welcome to Angular Tutorials';
  ImagePath : string = "https://dotnettutorials.net/wp-content/uploads/2019/09/cropped-dotnettutorials.png";
  ImageShortPath : string = "/wp-content/uploads/2019/09/cropped-dotnettutorials.png";
  IsDisabledClick : boolean = false;
  MaliciousData : string = "Hello <script>alert('your application is hacked')</script>";
}
