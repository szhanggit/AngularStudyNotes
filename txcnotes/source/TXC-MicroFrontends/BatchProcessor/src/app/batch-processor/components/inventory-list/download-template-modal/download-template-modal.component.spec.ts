import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadTemplateModalComponent } from './download-template-modal.component';
import { FormBuilder } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('DownloadTemplateModalComponent', () => {
  let component: DownloadTemplateModalComponent;
  let fixture: ComponentFixture<DownloadTemplateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DownloadTemplateModalComponent ],
      providers: [
        FormBuilder,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents();

    fixture = TestBed.createComponent(DownloadTemplateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
