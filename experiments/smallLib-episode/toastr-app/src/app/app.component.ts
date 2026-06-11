import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'toastr-app';
  constructor(private toastr: ToastrService){

  }

  showSuccess() {
    this.toastr.success('Hello world!', 'Toastr fun!');
  }
  
  showError() {
    this.toastr.error('Something went wrong.', 'Error');
  }

  showInfo() {
    this.toastr.info('Here is some information.', 'Info');
  }

  showWarning() {
    this.toastr.warning('This is a warning.', 'Warning');
  }
}
