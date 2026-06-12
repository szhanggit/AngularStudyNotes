import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ecommerce-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  paymentMethod: string = "paypal";
  constructor() { }

  ngOnInit(): void {
  }

}
