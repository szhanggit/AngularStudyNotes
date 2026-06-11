import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopOnLineComponent } from './shop-on-line.component';

describe('ShopOnLineComponent', () => {
  let component: ShopOnLineComponent;
  let fixture: ComponentFixture<ShopOnLineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShopOnLineComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShopOnLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
