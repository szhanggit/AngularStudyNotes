import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadBatchComponent } from './upload-batch.component';
import { FormBuilder } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('UploadBatchComponent', () => {
  let component: UploadBatchComponent;
  let fixture: ComponentFixture<UploadBatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UploadBatchComponent],
      providers: [FormBuilder],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(UploadBatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
