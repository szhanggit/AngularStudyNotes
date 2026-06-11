import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopOnStoreComponent } from './shop-on-store.component';

describe('ShopOnStoreComponent', () => {
  let component: ShopOnStoreComponent;
  let fixture: ComponentFixture<ShopOnStoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShopOnStoreComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShopOnStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
