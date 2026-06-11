import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewInventoryDetailsComponent } from './view-inventory-details.component';

describe('ViewInventoryDetailsComponent', () => {
  let component: ViewInventoryDetailsComponent;
  let fixture: ComponentFixture<ViewInventoryDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewInventoryDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewInventoryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
