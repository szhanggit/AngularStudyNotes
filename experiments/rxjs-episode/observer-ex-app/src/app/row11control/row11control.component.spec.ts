import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Row11controlComponent } from './row11control.component';

describe('Row11controlComponent', () => {
  let component: Row11controlComponent;
  let fixture: ComponentFixture<Row11controlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Row11controlComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Row11controlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
