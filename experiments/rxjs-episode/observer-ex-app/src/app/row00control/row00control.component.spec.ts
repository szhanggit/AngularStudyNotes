import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Row00controlComponent } from './row00control.component';

describe('Row00controlComponent', () => {
  let component: Row00controlComponent;
  let fixture: ComponentFixture<Row00controlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Row00controlComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Row00controlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
