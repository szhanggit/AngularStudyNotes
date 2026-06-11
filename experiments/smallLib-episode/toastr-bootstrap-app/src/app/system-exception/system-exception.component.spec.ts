import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemExceptionComponent } from './system-exception.component';

describe('SystemExceptionComponent', () => {
  let component: SystemExceptionComponent;
  let fixture: ComponentFixture<SystemExceptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SystemExceptionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SystemExceptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
