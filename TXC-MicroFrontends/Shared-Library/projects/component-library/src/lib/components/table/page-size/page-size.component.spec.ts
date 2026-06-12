import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageSizeLibComponent } from './page-size.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('PageSizeLibComponent', () => {
  let component: PageSizeLibComponent;
  let fixture: ComponentFixture<PageSizeLibComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageSizeLibComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageSizeLibComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
