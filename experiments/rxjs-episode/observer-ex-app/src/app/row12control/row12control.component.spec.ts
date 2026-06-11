import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Row12controlComponent } from './row12control.component';

describe('Row12controlComponent', () => {
  let component: Row12controlComponent;
  let fixture: ComponentFixture<Row12controlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Row12controlComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Row12controlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
