import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateListTableComponent } from './template-list-table.component';

describe('TemplateListTableComponent', () => {
  let component: TemplateListTableComponent;
  let fixture: ComponentFixture<TemplateListTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TemplateListTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemplateListTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
