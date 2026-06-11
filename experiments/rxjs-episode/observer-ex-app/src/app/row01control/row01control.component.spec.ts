import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Row01controlComponent } from './row01control.component';

describe('Row01controlComponent', () => {
  let component: Row01controlComponent;
  let fixture: ComponentFixture<Row01controlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Row01controlComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Row01controlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
