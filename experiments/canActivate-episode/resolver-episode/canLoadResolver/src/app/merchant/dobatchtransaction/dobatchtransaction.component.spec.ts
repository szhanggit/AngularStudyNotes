import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DobatchtransactionComponent } from './dobatchtransaction.component';

describe('DobatchtransactionComponent', () => {
  let component: DobatchtransactionComponent;
  let fixture: ComponentFixture<DobatchtransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DobatchtransactionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DobatchtransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
