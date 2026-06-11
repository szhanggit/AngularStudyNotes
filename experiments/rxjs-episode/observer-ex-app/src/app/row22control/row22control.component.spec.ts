import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Row22controlComponent } from './row22control.component';

describe('Row22controlComponent', () => {
  let component: Row22controlComponent;
  let fixture: ComponentFixture<Row22controlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Row22controlComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Row22controlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
