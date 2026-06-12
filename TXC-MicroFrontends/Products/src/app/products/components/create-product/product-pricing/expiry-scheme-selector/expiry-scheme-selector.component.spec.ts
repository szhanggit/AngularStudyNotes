import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpirySchemeSelectorComponent } from './expiry-scheme-selector.component';

describe('ExpirySchemeSelectorComponent', () => {
  let component: ExpirySchemeSelectorComponent;
  let fixture: ComponentFixture<ExpirySchemeSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpirySchemeSelectorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpirySchemeSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
