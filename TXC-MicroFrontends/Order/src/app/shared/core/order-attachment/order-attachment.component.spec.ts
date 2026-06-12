import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderAttachmentComponent } from './order-attachment.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FileEvent } from '../../models/custom-file.model';
import { FileEventTypeEnum } from '../../enums/file-event-type.enum';

describe('OrderAttachmentComponent', () => {
  let component: OrderAttachmentComponent;
  let fixture: ComponentFixture<OrderAttachmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrderAttachmentComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderAttachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit fileEvent on emitFileEvent()', () => {
    // arrange
    const fileEvent: FileEvent = {
      customFiles: [new File([], 'test.xls')],
      eventType: FileEventTypeEnum.UPLOAD,
      index: 0,
    };
    const emitFileEventSpy = spyOn(component.fileEvent, 'emit');

    // act
    component.emitFileEvent(fileEvent);

    // assert
    expect(emitFileEventSpy).toHaveBeenCalledWith(fileEvent);
  });
});
