import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Row10controlComponent } from './row10control.component';

describe('Row10controlComponent', () => {
  let component: Row10controlComponent;
  let fixture: ComponentFixture<Row10controlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Row10controlComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Row10controlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
