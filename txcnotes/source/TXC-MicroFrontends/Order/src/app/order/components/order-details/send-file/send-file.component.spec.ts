import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/shared/shared.module';
import { SendFileComponent } from './send-file.component';
import { AttachmentService } from 'src/app/order/services/attachment.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DownloadAndSendService } from 'src/app/order/services/download-and-send.service';
import { of, throwError } from 'rxjs';
import { NgbdToastGlobal } from '@txc-angular/component-library';

describe('SendFileComponent', () => {
  const activeModalSvcSpy = jasmine.createSpyObj('NgbActiveModal', ['dismiss']);
  const attachmentSvcSpy = jasmine.createSpyObj('AttachmentService', ['']);
  const sendFileSvcSpy = jasmine.createSpyObj('DownloadAndSendService', [
    'SendOrderVoucherExcel',
    'getClientContact',
  ]);
  const toastSpy = jasmine.createSpyObj('NgbdToastGlobal', [
    'showSuccess',
    'showDanger',
  ]);
  let component: SendFileComponent;
  let fixture: ComponentFixture<SendFileComponent>;

  const MockClientEmailData = [
    {
      clientId: 123,
      email: 'abc@gmail.com',
      name: 'abc',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        HttpClientTestingModule,
      ],
      providers: [
        { provide: NgbActiveModal, useValue: activeModalSvcSpy },
        {
          provide: AttachmentService,
          useValue: attachmentSvcSpy,
        },
        {
          provide: DownloadAndSendService,
          useValue: sendFileSvcSpy,
        },
      ],
      declarations: [SendFileComponent, NgbdToastGlobal],
    }).compileComponents();

    sendFileSvcSpy.SendOrderVoucherExcel.and.returnValue(
      of(MockClientEmailData)
    );
    sendFileSvcSpy.getClientContact.and.returnValue(
      of(MockClientEmailData)
    );
    fixture = TestBed.createComponent(SendFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.sendFileFormGroup).toBeDefined();
  });

  describe('onButtonClicked', () => {
    it('should dismiss active modal when param is false or empty', () => {
      // act
      component.onButtonClicked();

      // assert
      expect(activeModalSvcSpy.dismiss).toHaveBeenCalled();
    });

    it('should dismiss active modal when param is true', fakeAsync(() => {
      // arrange
      component.sendFileFormGroup
        .get('emailAddress')
        ?.setValue('abc@gmail.com');
      component.orderId = 1;
      sendFileSvcSpy.SendOrderVoucherExcel.and.returnValue(
        of({ success: true, message: '', data: {} })
      );
      // act
      component.onButtonClicked(true);
      tick();

      // assert
      expect(sendFileSvcSpy.SendOrderVoucherExcel).toHaveBeenCalled();
      expect(toastSpy.showSuccess).toBeDefined();
      expect(activeModalSvcSpy.dismiss).toHaveBeenCalled();
    }));
  });

  describe('fetchClientEmailList()', () => {
    it('should call getClientContact and return success', fakeAsync(() => {
      // arrange
      const updateEmailList = spyOn(component, 'updateEmailList');

      // act
      component.ngOnInit();
      component.fetchClientEmailList();
      tick();

      // assert
      expect(sendFileSvcSpy.getClientContact).toHaveBeenCalled();
      expect(updateEmailList).toHaveBeenCalled();
    }));

    it('should call getClientContact and return error', fakeAsync(() => {
      // arrange
      sendFileSvcSpy.getClientContact.and.returnValue(of(throwError('error')));
      // act
      component.fetchClientEmailList();
      tick();
      // assert
      expect(toastSpy.showDanger).toBeDefined();
    }));
  });
});
