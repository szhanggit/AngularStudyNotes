import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopBatchUploadComponent } from './shop-batch-upload.component';

describe('ShopBatchUploadComponent', () => {
  let component: ShopBatchUploadComponent;
  let fixture: ComponentFixture<ShopBatchUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShopBatchUploadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopBatchUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
