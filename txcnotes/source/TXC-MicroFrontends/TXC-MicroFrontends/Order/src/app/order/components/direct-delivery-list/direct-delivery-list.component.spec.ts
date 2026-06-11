import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectDeliveryListComponent } from './direct-delivery-list.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('DirectDeliveryListComponent', () => {
  let component: DirectDeliveryListComponent;
  let fixture: ComponentFixture<DirectDeliveryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DirectDeliveryListComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(DirectDeliveryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
