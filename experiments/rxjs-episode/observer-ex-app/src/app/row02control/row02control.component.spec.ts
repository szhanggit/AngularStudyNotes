import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Row02controlComponent } from './row02control.component';

describe('Row02controlComponent', () => {
  let component: Row02controlComponent;
  let fixture: ComponentFixture<Row02controlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Row02controlComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Row02controlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
