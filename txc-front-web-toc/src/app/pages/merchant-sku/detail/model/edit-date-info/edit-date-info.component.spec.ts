import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDateInfoComponent } from './edit-date-info.component';

describe('EditDateInfoComponent', () => {
  let component: EditDateInfoComponent;
  let fixture: ComponentFixture<EditDateInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditDateInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDateInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
