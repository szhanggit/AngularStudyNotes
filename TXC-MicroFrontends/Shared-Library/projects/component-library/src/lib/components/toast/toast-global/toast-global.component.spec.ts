import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgbdToastGlobal } from './toast-global.component';

describe('NgbdToastGlobal', () => {
  let component: NgbdToastGlobal;
  let fixture: ComponentFixture<NgbdToastGlobal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgbdToastGlobal ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgbdToastGlobal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
