import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProductTemplateComponent } from './edit-product-template.component';

describe('EditProductTemplateComponent', () => {
  let component: EditProductTemplateComponent;
  let fixture: ComponentFixture<EditProductTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditProductTemplateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditProductTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
