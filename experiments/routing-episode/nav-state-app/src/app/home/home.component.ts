import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  goToDetail(): void {
    const stateData = { exampleData: 'Hello from HomeComponent' };
    this.router.navigate(['/detail'], { state: stateData });
  }

  navigateToDetails(event: MouseEvent, id: Number) {
    event.preventDefault();
    if (event.ctrlKey) {
      window.open(this.getUrl(), '_blank');
    } else {
      this.router.navigateByUrl(this.getUrl());
    }
  }

  getUrl(): string {
      return `/detail`;
  }

}
