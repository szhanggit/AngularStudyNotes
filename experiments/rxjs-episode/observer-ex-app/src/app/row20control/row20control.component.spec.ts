import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Row20controlComponent } from './row20control.component';

describe('Row20controlComponent', () => {
  let component: Row20controlComponent;
  let fixture: ComponentFixture<Row20controlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Row20controlComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Row20controlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
