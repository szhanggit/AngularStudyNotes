import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SKUFormComponent } from './sku-form.component';

describe('SKUFormComponent', () => {
  let component: SKUFormComponent;
  let fixture: ComponentFixture<SKUFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SKUFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SKUFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
