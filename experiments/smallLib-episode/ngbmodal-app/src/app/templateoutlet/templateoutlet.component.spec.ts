import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateoutletComponent } from './templateoutlet.component';

describe('TemplateoutletComponent', () => {
  let component: TemplateoutletComponent;
  let fixture: ComponentFixture<TemplateoutletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TemplateoutletComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemplateoutletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
