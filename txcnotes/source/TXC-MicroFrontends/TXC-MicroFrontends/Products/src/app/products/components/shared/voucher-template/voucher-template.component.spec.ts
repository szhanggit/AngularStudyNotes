import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VoucherTemplateComponent } from './voucher-template.component';

describe('VoucherTemplateComponent', () => {
  let component: VoucherTemplateComponent;
  let fixture: ComponentFixture<VoucherTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoucherTemplateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoucherTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
