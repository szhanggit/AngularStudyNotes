import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkuDraftListComponent } from './sku-draft-list.component';

describe('SkuDraftListComponent', () => {
  let component: SkuDraftListComponent;
  let fixture: ComponentFixture<SkuDraftListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SkuDraftListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkuDraftListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
