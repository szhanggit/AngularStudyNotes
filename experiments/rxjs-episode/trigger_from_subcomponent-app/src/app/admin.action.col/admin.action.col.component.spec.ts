import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminActionColComponent } from './admin.action.col.component';

describe('AdminActionColComponent', () => {
  let component: AdminActionColComponent;
  let fixture: ComponentFixture<AdminActionColComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminActionColComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminActionColComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
