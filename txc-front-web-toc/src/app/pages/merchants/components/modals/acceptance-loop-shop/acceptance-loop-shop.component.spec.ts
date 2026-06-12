import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptanceLoopShopComponent } from './acceptance-loop-shop.component';

describe('AcceptanceLoopShopComponent', () => {
  let component: AcceptanceLoopShopComponent;
  let fixture: ComponentFixture<AcceptanceLoopShopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcceptanceLoopShopComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcceptanceLoopShopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
