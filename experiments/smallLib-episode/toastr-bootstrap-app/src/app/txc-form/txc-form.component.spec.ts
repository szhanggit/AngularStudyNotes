import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TxcFormComponent } from './txc-form.component';

describe('TxcFormComponent', () => {
  let component: TxcFormComponent;
  let fixture: ComponentFixture<TxcFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TxcFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TxcFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
