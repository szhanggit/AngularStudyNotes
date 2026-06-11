import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BootstrapTXCComponent } from './bootstrap-txc.component';

describe('BootstrapTXCComponent', () => {
  let component: BootstrapTXCComponent;
  let fixture: ComponentFixture<BootstrapTXCComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BootstrapTXCComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BootstrapTXCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
