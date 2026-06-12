import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchUpdateProductComponent } from './batch-update-product.component';

describe('BatchUpdateProductComponent', () => {
  let component: BatchUpdateProductComponent;
  let fixture: ComponentFixture<BatchUpdateProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BatchUpdateProductComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BatchUpdateProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
