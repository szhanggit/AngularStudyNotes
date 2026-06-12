import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateTagComponent } from './template-tag.component';

describe('TemplateTagComponent', () => {
  let component: TemplateTagComponent;
  let fixture: ComponentFixture<TemplateTagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TemplateTagComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemplateTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
