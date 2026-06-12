import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterProductProductTemplatePreviewComponent } from './master-product-product-template-preview.component';

describe('MasterProductProductTemplatePreviewComponent', () => {
  let component: MasterProductProductTemplatePreviewComponent;
  let fixture: ComponentFixture<MasterProductProductTemplatePreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterProductProductTemplatePreviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasterProductProductTemplatePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
