import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-cptheme',
  templateUrl: './cptheme.component.html',
  styleUrls: ['./cptheme.component.sass']
})
export class CpthemeComponent implements AfterViewInit {

	@ViewChild('name')
	private elName = {} as ElementRef;
	@ViewChild('city')
	private elCity = {} as ElementRef;

	ngAfterViewInit() {
		this.elName.nativeElement.style.backgroundColor = 'cyan';
		this.elName.nativeElement.style.color = 'red';
		this.elCity.nativeElement.style.backgroundColor = 'cyan';
		this.elCity.nativeElement.style.color = 'red';
	}

}
