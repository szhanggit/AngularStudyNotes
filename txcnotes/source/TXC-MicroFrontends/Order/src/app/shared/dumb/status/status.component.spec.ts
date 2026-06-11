import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusComponent } from './status.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { StringSplitByCapitalLetterPipe } from 'src/app/order/pipes/string-split-by-capital-letter.pipe';

describe('StatusComponent', () => {
  let component: StatusComponent;
  let fixture: ComponentFixture<StatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StatusComponent, StringSplitByCapitalLetterPipe],
      providers: [StringSplitByCapitalLetterPipe],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(StatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
