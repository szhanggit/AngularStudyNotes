import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatemerchantComponent } from './createmerchant.component';

describe('CreatemerchantComponent', () => {
  let component: CreatemerchantComponent;
  let fixture: ComponentFixture<CreatemerchantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatemerchantComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatemerchantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
