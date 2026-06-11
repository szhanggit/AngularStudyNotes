import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpRequest, HttpEvent, HttpEventType } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-system-exception',
  templateUrl: './system-exception.component.html',
  styleUrls: ['./system-exception.component.css']
})
export class SystemExceptionComponent implements OnInit {

  constructor(private readonly httpClient: HttpClient) { }

  ngOnInit(): void {
  }

  triggerHttpRequest(){
    this.get().subscribe({
      next: data => {},
      error: e => console.log(e),
      complete: () => {console.log('Completed!');}
    });
  }

  get(): Observable<any> 
  {
    return this.httpClient.get<any>(`https://localhost:5001/api/Students/byId?id=1`);
  }

}
