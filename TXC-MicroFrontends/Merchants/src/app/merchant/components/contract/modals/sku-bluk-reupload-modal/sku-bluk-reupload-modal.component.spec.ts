import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkuBlukReuploadModalComponent } from './sku-bluk-reupload-modal.component';

describe('SkuBlukReuploadModalComponent', () => {
  let component: SkuBlukReuploadModalComponent;
  let fixture: ComponentFixture<SkuBlukReuploadModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SkuBlukReuploadModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkuBlukReuploadModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
