import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TlActionsColumnComponent } from './tl-actions-column.component';

describe('TlActionsColumnComponent', () => {
  let component: TlActionsColumnComponent;
  let fixture: ComponentFixture<TlActionsColumnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TlActionsColumnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TlActionsColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
