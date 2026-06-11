import { Component, OnInit } from '@angular/core';
import { MasterService } from '../../service/master.service';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgxMaskDirective],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  title = 'standalone';

  constructor(private service:MasterService){

  }
  ngOnInit(): void {
     this.service.Getall().subscribe(item=>{
      console.log(item);
     })
  }
}
