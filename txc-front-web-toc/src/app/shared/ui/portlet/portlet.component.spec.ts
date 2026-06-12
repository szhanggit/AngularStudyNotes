import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortletComponent } from './portlet.component';

describe('PortletComponent', () => {
  let component: PortletComponent;
  let fixture: ComponentFixture<PortletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PortletComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PortletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
