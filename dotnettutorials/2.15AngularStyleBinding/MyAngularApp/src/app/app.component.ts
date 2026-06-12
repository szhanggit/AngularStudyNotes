import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  IsBold: boolean = true;
  FontSize: number = 40;
  IsItalic: boolean = true;

  AddCSSStyles() {
    let CssStyles = {
        'font-weight': this.IsBold ? 'bold' : 'normal',
        'font-style': this.IsItalic ? 'italic' : 'normal',
        'font-size.px': this.FontSize
    };
    return CssStyles;
  }
}
