import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BootstrapExComponent } from './bootstrap-ex.component';

describe('BootstrapExComponent', () => {
  let component: BootstrapExComponent;
  let fixture: ComponentFixture<BootstrapExComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BootstrapExComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BootstrapExComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
