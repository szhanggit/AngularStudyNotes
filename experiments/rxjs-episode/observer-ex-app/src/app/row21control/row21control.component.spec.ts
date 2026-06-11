import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Row21controlComponent } from './row21control.component';

describe('Row21controlComponent', () => {
  let component: Row21controlComponent;
  let fixture: ComponentFixture<Row21controlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Row21controlComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Row21controlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
