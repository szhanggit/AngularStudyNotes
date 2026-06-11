import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SKUCreateComponent } from './sku-create.component';

describe('SkuCreateComponent', () => {
  let component: SKUCreateComponent;
  let fixture: ComponentFixture<SKUCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SKUCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SKUCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
