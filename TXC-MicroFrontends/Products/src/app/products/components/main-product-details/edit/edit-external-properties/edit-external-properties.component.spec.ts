import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditExternalPropertiesComponent } from './edit-external-properties.component';

describe('EditExternalPropertiesComponent', () => {
  let component: EditExternalPropertiesComponent;
  let fixture: ComponentFixture<EditExternalPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditExternalPropertiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditExternalPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
