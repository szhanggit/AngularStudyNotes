import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div>
      <button [class]='ClassesToApply'>Click Me</button>
      <button class='colorClass' [class]='ClassesToApply'>Click Me</button>
      <button class='colorClass' [class.boldClass]='ApplyBoldClass'>Click Me</button>
      <button class='colorClass' [class.boldClass]='!ApplyBoldClass'>Click Me</button>
      <button class='colorClass italicClass boldClass' [class.boldClass]='ApplyBoldClass'>Click Me</button>
      <button class='colorClass' [ngClass]='AddCSSClasses()'>Click Me</button>
    </div>
  `
})
export class AppComponent {
  ClassesToApply : string = 'italicClass boldClass';
  ApplyBoldClass : boolean = true;
  ApplyItalicsClass: boolean = true;
    AddCSSClasses() {
        let Cssclasses = {
            boldClass: this.ApplyBoldClass,
            italicsClass: this.ApplyItalicsClass
        };
        return Cssclasses;
    }
}
