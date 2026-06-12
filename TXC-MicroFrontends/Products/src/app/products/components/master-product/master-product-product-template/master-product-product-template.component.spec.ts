import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterProductProductTemplateComponent } from './master-product-product-template.component';

describe('MasterProductProductTemplateComponent', () => {
  let component: MasterProductProductTemplateComponent;
  let fixture: ComponentFixture<MasterProductProductTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MasterProductProductTemplateComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(MasterProductProductTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
