import {
  ComponentFixture,
  TestBed,
  inject,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { EditDeliveryContentComponent } from './edit-delivery-content.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Subject, of } from 'rxjs';
import { ProductTemplateStateService } from '../../services/state-service/product-template-state.service';
import { FormEmitterService } from 'src/app/shared/dumb/form/form-emitter.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  TagTypeEnum,
  TemplateTypeEnum,
} from 'src/app/shared/enums/template.enum';
import { TemplateNameListStateService } from '../../services/state-service/template-name-state.service';
import { TemplateService } from '../../services/template.service';
import { OrderModeEnum } from '../../enums/order-mode.enum';

describe('EditDeliveryContentComponent', () => {
  const templateSvcSpy = jasmine.createSpyObj('TemplateService', [
    'getTemplateFullDetails',
    'getTemplateTagsByVersionId',
    'getTemplateDetails',
  ]);

  const templateStateSvcSpy = jasmine.createSpyObj(
    'ProductTemplateStateService',
    ['setProductTemplatesByProductVersionId'],
    {
      productTemplates$: of({
        currentProductId: 1,
        orderTemplateId: 1,
        productTemplates: [
          {
            productId: 1,
            voucherTemplate: {
              templateId: 1,
              templateVersionId: 56,
              type: 1,
              defaultTemplateVersion: {
                templateId: 1,
                templateVersionId: 56,
                type: 1,
                templateTags: [
                  { tagId: 1, type: TagTypeEnum.Text },
                  { tagId: 61, type: TagTypeEnum.HTMLText },
                  { tagId: 62, type: TagTypeEnum.Image },
                  { tagId: 63, type: TagTypeEnum.RadioGroup },
                  { tagId: 64, type: TagTypeEnum.RichText },
                ],
                templateTagValue: [
                  { tagId: 1, value: 2 },
                  { tagId: 61, value: null },
                  { tagId: 62, value: null },
                  { tagId: 63, value: null },
                  { tagId: 64, value: null },
                ],
              },
              templateVersions: [
                {
                  templateId: 1,
                  templateVersionId: 56,
                  type: 1,
                  templateTags: [
                    { tagId: 1, type: TagTypeEnum.Text },
                    { tagId: 61, type: TagTypeEnum.HTMLText },
                    { tagId: 62, type: TagTypeEnum.Image },
                    { tagId: 63, type: TagTypeEnum.RadioGroup },
                    { tagId: 64, type: TagTypeEnum.RichText },
                  ],
                  templateTagValue: [
                    { tagId: 1, value: 2 },
                    { tagId: 61, value: null },
                    { tagId: 62, value: null },
                    { tagId: 63, value: null },
                    { tagId: 64, value: null },
                  ],
                },
              ],
              templateVersionLanguages: [
                {
                  value: 56,
                  label: 'Chinese',
                },
              ],
            },
            tempVoucherTemplate: {
              templateId: 1,
              templateVersionId: 56,
              type: 1,
              defaultTemplateVersion: {
                templateId: 1,
                templateVersionId: 56,
                type: 1,
                templateTags: [
                  {
                    tagId: 1,
                    type: TagTypeEnum.Text,
                    displayName: 'emailSubject',
                  },
                  {
                    tagId: 61,
                    type: TagTypeEnum.HTMLText,
                    displayName: 'greetings',
                  },
                  { tagId: 62, type: TagTypeEnum.Image },
                  { tagId: 63, type: TagTypeEnum.RadioGroup },
                  { tagId: 64, type: TagTypeEnum.RichText },
                ],
                templateTagValue: [
                  { tagId: 1, value: null },
                  { tagId: 61, value: null },
                  { tagId: 62, value: null },
                  { tagId: 63, value: null },
                  { tagId: 64, value: null },
                ],
              },
              templateVersions: [
                {
                  templateId: 1,
                  templateVersionId: 56,
                  type: 1,
                  templateTags: [
                    { tagId: 1, type: TagTypeEnum.Text },
                    { tagId: 61, type: TagTypeEnum.HTMLText },
                    { tagId: 62, type: TagTypeEnum.Image },
                    { tagId: 63, type: TagTypeEnum.RadioGroup },
                  ],
                  templateTagValue: [
                    { tagId: 1, value: 2 },
                    { tagId: 61, value: null },
                    { tagId: 62, value: null },
                    { tagId: 63, value: null },
                  ],
                },
                {
                  templateId: 1,
                  templateVersionId: 4,
                  type: 1,
                  templateTags: [
                    { tagId: 1, type: TagTypeEnum.Text },
                    { tagId: 61, type: TagTypeEnum.HTMLText },
                    { tagId: 62, type: TagTypeEnum.Image },
                    { tagId: 63, type: TagTypeEnum.RadioGroup },
                  ],
                  templateTagValue: [
                    { tagId: 1, value: 2 },
                    { tagId: 61, value: null },
                    { tagId: 62, value: null },
                    { tagId: 63, value: null },
                  ],
                },
                {
                  templateId: 1,
                  templateVersionId: 44,
                  type: 1,
                  templateTags: [],
                  templateTagValue: [
                    { tagId: 1, value: 2 },
                    { tagId: 61, value: null },
                    { tagId: 62, value: null },
                    { tagId: 63, value: null },
                  ],
                },
              ],
              templateVersionLanguages: [
                {
                  value: 56,
                  label: 'Chinese',
                },
              ],
            },
            smsTemplate: {
              templateId: 2,
              templateVersionId: 22,
              type: 2,
              defaultTemplateVersion: {
                templateId: 2,
                templateVersionId: 56,
                type: 2,
                templateTags: [
                  { tagId: 1, type: TagTypeEnum.Text },
                  { tagId: 61, type: TagTypeEnum.HTMLText },
                  { tagId: 62, type: TagTypeEnum.Image },
                  { tagId: 63, type: TagTypeEnum.RadioGroup },
                  { tagId: 64, type: TagTypeEnum.RichText },
                ],
                templateTagValue: [
                  { tagId: 1, value: 2 },
                  { tagId: 61, value: null },
                  { tagId: 62, value: null },
                  { tagId: 63, value: null },
                  { tagId: 64, value: null },
                ],
              },
              templateVersions: [
                {
                  templateId: 2,
                  templateVersionId: 56,
                  type: 2,
                  content1: 'Test1',
                  content2: 'Test2',
                  content3: 'Test3',
                  templateTags: [
                    { tagId: 1, type: TagTypeEnum.Text },
                    { tagId: 61, type: TagTypeEnum.HTMLText },
                    { tagId: 62, type: TagTypeEnum.Image },
                    { tagId: 63, type: TagTypeEnum.RadioGroup },
                  ],
                  templateTagValue: [
                    { tagId: 1, value: 2 },
                    { tagId: 61, value: null },
                    { tagId: 62, value: null },
                    { tagId: 63, value: null },
                  ],
                },
              ],
              templateVersionLanguages: [
                {
                  value: 56,
                  label: 'Chinese',
                },
              ],
            },
            tempSmsTemplate: {
              templateId: 2,
              templateVersionId: 22,
              type: 2,
              defaultTemplateVersion: {
                templateId: 2,
                templateVersionId: 56,
                type: 2,
                templateTags: [
                  {
                    tagId: 1,
                    type: TagTypeEnum.Text,
                    displayName: 'smsgreetings',
                  },
                  { tagId: 61, type: TagTypeEnum.HTMLText },
                  { tagId: 62, type: TagTypeEnum.Image },
                  { tagId: 63, type: TagTypeEnum.RadioGroup },
                  { tagId: 64, type: TagTypeEnum.RichText },
                ],
                templateTagValue: [
                  { tagId: 1, value: null },
                  { tagId: 61, value: null },
                  { tagId: 62, value: null },
                  { tagId: 63, value: null },
                  { tagId: 64, value: null },
                ],
              },
              templateVersions: [
                {
                  templateId: 2,
                  templateVersionId: 56,
                  type: 2,
                  content1: 'Test1',
                  content2: 'Test2',
                  content3: 'Test3',
                  templateTags: [
                    { tagId: 1, type: TagTypeEnum.Text },
                    { tagId: 61, type: TagTypeEnum.HTMLText },
                    { tagId: 62, type: TagTypeEnum.Image },
                    { tagId: 63, type: TagTypeEnum.RadioGroup },
                  ],
                  templateTagValue: [
                    { tagId: 1, value: 2 },
                    { tagId: 61, value: null },
                    { tagId: 62, value: null },
                    { tagId: 63, value: null },
                  ],
                },
                {
                  templateId: 2,
                  templateVersionId: 4,
                  type: 2,
                  templateTags: [
                    { tagId: 1, type: TagTypeEnum.Text },
                    { tagId: 61, type: TagTypeEnum.HTMLText },
                    { tagId: 62, type: TagTypeEnum.Image },
                    { tagId: 63, type: TagTypeEnum.RadioGroup },
                  ],
                  templateTagValue: [
                    { tagId: 1, value: 2 },
                    { tagId: 61, value: null },
                    { tagId: 62, value: null },
                    { tagId: 63, value: null },
                  ],
                },
                {
                  templateId: 2,
                  templateVersionId: 44,
                  type: 2,
                  templateTags: [],
                  templateTagValue: [
                    { tagId: 1, value: 2 },
                    { tagId: 61, value: null },
                    { tagId: 62, value: null },
                    { tagId: 63, value: null },
                  ],
                },
              ],
              templateVersionLanguages: [
                {
                  value: 56,
                  label: 'Chinese',
                },
              ],
            },
          },
        ],
      }),
    }
  );
  const templateNameListStateServiceSpy = jasmine.createSpyObj(
    'TemplateNameListStateService',
    ['setSelectedEmailTemplateNameState', 'setSelectedSMSTemplateNameState'],
    {
      selectedEmailTemplateList$: of({
        keyword: 'test',
        templateList: [{ templateName: 'test' }],
      }),
      selectedSMSTemplateList$: of({
        keyword: 'test',
        templateList: [{ templateName: 'test' }],
      }),
    }
  );
  const formEmitterSvcSpy = jasmine.createSpyObj('FormEmitterService', [], {
    emitEvent: new Subject(),
  });
  const modalSvcSpy = jasmine.createSpyObj('NgbModal', ['open']);

  let softSaveSpy = jasmine.createSpy();
  let component: EditDeliveryContentComponent;
  let fixture: ComponentFixture<EditDeliveryContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditDeliveryContentComponent],
      imports: [HttpClientTestingModule],
      providers: [
        FormBuilder,
        {
          provide: ProductTemplateStateService,
          useValue: templateStateSvcSpy,
        },
        {
          provide: FormEmitterService,
          useValue: formEmitterSvcSpy,
        },
        {
          provide: NgbModal,
          useValue: modalSvcSpy,
        },
        {
          provide: TemplateNameListStateService,
          useValue: templateNameListStateServiceSpy,
        },
        {
          provide: TemplateService,
          useValue: templateSvcSpy,
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(inject([FormBuilder], (fb: FormBuilder) => {
    fixture = TestBed.createComponent(EditDeliveryContentComponent);
    component = fixture.componentInstance;
    component.productVersionId = 1;

    /* This is where we can simulate / test our component
       and pass in a value for formGroup where it would've otherwise
       required it from the parent
    */
    component.deliveryDetailsFormGroup = fb.group({
      emailTemplate: '',
      emailSubject: 'ES',
      emailGreeting: 'EG',
      msgEncoding: '',
      smsGreeting: 'SG',
    });

    component.orderTemplateId = 1;
    fixture.detectChanges();
  }));

  it('should create', fakeAsync(() => {
    // act
    tick(200);

    // assert
    expect(component).toBeTruthy();
    expect(component.voucherPageFormGroup).toBeDefined();
  }));

  describe('initForm', () => {
    it('should initForm without voucherPageForm and smsPageForm', fakeAsync(() => {
      // arrange
      (component.voucherPageFormGroup as unknown) = undefined;
      (component.smsFormGroup as unknown) = undefined;

      // act
      component.initForm();
      tick(200);

      // assert
      expect(component).toBeTruthy();
      expect(component.voucherPageFormGroup).toBeDefined();
      expect(component.smsFormGroup).toBeDefined();
    }));

    it('should initForm with defined formGroups', fakeAsync(() => {
      // arrange
      component.definePageDesign(TemplateTypeEnum.Email);
      component.definePageDesign(TemplateTypeEnum.SMS);

      // act
      component.initForm();
      tick(200);

      // assert
      expect(component).toBeTruthy();
      expect(component.voucherPageFormGroup).toBeDefined();
      expect(component.smsFormGroup).toBeDefined();
    }));

    it('should initForm with defined formGroups after searching', fakeAsync(() => {
      // arrange
      component.definePageDesign(TemplateTypeEnum.Email);
      component.definePageDesign(TemplateTypeEnum.SMS);
      component.fromSearching = true;

      // act
      component.initForm();
      tick(200);

      // assert
      expect(component).toBeTruthy();
      expect(component.voucherPageFormGroup).toBeDefined();
      expect(component.smsFormGroup).toBeDefined();
    }));
  });

  describe('TITLE()', () => {
    it('should return Edit Voucher Page', () => {
      // arrange
      component.selectedOrderMode = {
        key: OrderModeEnum.IndirectNonAPI,
        value: '',
      };

      // act
      const result = component.TITLE;

      // assert
      expect(result).toBe('Edit Voucher Page');
    });

    it('should return Edit Delivery Content', () => {
      // arrange
      component.selectedOrderMode = {
        key: OrderModeEnum.DirectNonAPI,
        value: '',
      };

      // act
      const result = component.TITLE;

      // assert
      expect(result).toBe('Edit Delivery Content');
    });
  });

  it('should check for endButtons state', () => {
    // arrange
    const currentState = component.endButtons.find(
      (button) => button.label.toLowerCase() === 'save'
    )!.disabled;

    // act
    component.voucherPageFormGroup.patchValue({
      voucherTemplate: {},
      templateVersionId: null,
    });

    // assert
    expect(currentState).toBe(true);
  });

  describe('should set the temp voucher template state', () => {
    it('to undefined if invalid template', fakeAsync(() => {
      // arrange
      templateSvcSpy.getTemplateFullDetails.and.returnValue(of(null));
      tick();

      // act
      component.voucherPageFormGroup.patchValue({
        voucherTemplate: 'test',
      });
      tick(200);

      // assert
      expect(
        templateStateSvcSpy.setProductTemplatesByProductVersionId
      ).toHaveBeenCalledWith(
        component.productVersionId,
        component.orderTemplateId,
        component.currentVoucherTemplate,
        undefined,
        component.currentSMSTemplate,
        component.tempSMSTemplate,
        true
      );
    }));

    it('to new value if valid template', fakeAsync(() => {
      // arrange
      templateSvcSpy.getTemplateFullDetails.and.returnValue(
        of({ templateVersionId: 23 })
      );
      const newTemplate = { templateVersionId: 23 };
      tick();

      // act
      component.voucherPageFormGroup.patchValue({
        voucherTemplate: newTemplate,
      });
      tick(200);

      // assert
      expect(
        templateStateSvcSpy.setProductTemplatesByProductVersionId
      ).toHaveBeenCalledWith(
        component.productVersionId,
        component.orderTemplateId,
        component.currentVoucherTemplate,
        newTemplate,
        component.currentSMSTemplate,
        component.tempSMSTemplate,
        true
      );
    }));
  });

  describe('should set the temp sms template state', () => {
    it('to undefined if invalid template', fakeAsync(() => {
      // arrange
      templateSvcSpy.getTemplateFullDetails.and.returnValue(of(null));
      tick();

      // act
      component.smsFormGroup.patchValue({
        voucherTemplate: 'test',
      });
      tick(200);

      // assert
      expect(
        templateStateSvcSpy.setProductTemplatesByProductVersionId
      ).toHaveBeenCalledWith(
        component.productVersionId,
        component.orderTemplateId,
        component.currentVoucherTemplate,
        component.tempVoucherTemplate,
        component.currentSMSTemplate,
        undefined,
        true
      );
    }));

    it('to new value if valid template', fakeAsync(() => {
      // arrange
      templateSvcSpy.getTemplateFullDetails.and.returnValue(
        of({ templateVersionId: 23 })
      );
      const newTemplate = { templateVersionId: 23 };
      tick();

      // act
      component.smsFormGroup.patchValue({
        voucherTemplate: newTemplate,
      });
      tick(200);

      // assert
      expect(
        templateStateSvcSpy.setProductTemplatesByProductVersionId
      ).toHaveBeenCalledWith(
        component.productVersionId,
        component.orderTemplateId,
        component.currentVoucherTemplate,
        component.tempVoucherTemplate,
        component.currentSMSTemplate,
        newTemplate,
        true
      );
    }));
  });

  describe('version change', () => {
    it('for Email with tags', fakeAsync(() => {
      // arrange
      templateSvcSpy.getTemplateTagsByVersionId.and.returnValue(
        of([{ type: TagTypeEnum.Text }])
      );
      tick();

      // act
      component.voucherPageFormGroup.patchValue({
        templateVersionId: 4,
      });
      tick(200);

      // assert
      expect(
        templateStateSvcSpy.setProductTemplatesByProductVersionId
      ).toHaveBeenCalledWith(
        component.productVersionId,
        component.orderTemplateId,
        component.currentVoucherTemplate,
        component.tempVoucherTemplate,
        component.currentSMSTemplate,
        component.tempSMSTemplate,
        true,
        4
      );
    }));

    it('for Email without tags', fakeAsync(() => {
      // arrange
      templateSvcSpy.getTemplateTagsByVersionId.and.returnValue(
        of([{ type: TagTypeEnum.Text }])
      );
      tick();

      // act
      component.voucherPageFormGroup.patchValue({
        templateVersionId: 44,
      });
      tick(200);

      // assert
      expect(
        templateStateSvcSpy.setProductTemplatesByProductVersionId
      ).toHaveBeenCalledWith(
        component.productVersionId,
        component.orderTemplateId,
        component.currentVoucherTemplate,
        component.tempVoucherTemplate,
        component.currentSMSTemplate,
        component.tempSMSTemplate,
        true,
        44
      );
    }));

    it('for Email without version', fakeAsync(() => {
      // arrange
      templateSvcSpy.getTemplateTagsByVersionId.and.returnValue(
        of([{ type: TagTypeEnum.Text }])
      );
      tick();

      // act
      component.voucherPageFormGroup.patchValue({
        templateVersionId: 444,
      });
      tick(200);

      // assert
      expect(
        templateStateSvcSpy.setProductTemplatesByProductVersionId
      ).toHaveBeenCalledWith(
        component.productVersionId,
        component.orderTemplateId,
        component.currentVoucherTemplate,
        component.tempVoucherTemplate,
        component.currentSMSTemplate,
        component.tempSMSTemplate,
        true,
        444
      );
    }));

    it('for SMS with tags', fakeAsync(() => {
      // arrange
      templateSvcSpy.getTemplateTagsByVersionId.and.returnValue(
        of([{ type: TagTypeEnum.Text }])
      );
      tick();

      // act
      component.smsFormGroup.patchValue({
        templateVersionId: 4,
      });
      tick(200);

      // assert
      expect(
        templateStateSvcSpy.setProductTemplatesByProductVersionId
      ).toHaveBeenCalledWith(
        component.productVersionId,
        component.orderTemplateId,
        component.currentVoucherTemplate,
        component.tempVoucherTemplate,
        component.currentSMSTemplate,
        component.tempSMSTemplate,
        true,
        undefined,
        4
      );
    }));

    it('for SMS without tags', fakeAsync(() => {
      // arrange
      templateSvcSpy.getTemplateTagsByVersionId.and.returnValue(
        of([{ type: TagTypeEnum.Text }])
      );
      tick();

      // act
      component.smsFormGroup.patchValue({
        templateVersionId: 44,
      });
      tick(200);

      // assert
      expect(
        templateStateSvcSpy.setProductTemplatesByProductVersionId
      ).toHaveBeenCalledWith(
        component.productVersionId,
        component.orderTemplateId,
        component.currentVoucherTemplate,
        component.tempVoucherTemplate,
        component.currentSMSTemplate,
        component.tempSMSTemplate,
        true,
        undefined,
        44
      );
    }));

    it('for SMS without version', fakeAsync(() => {
      // arrange
      templateSvcSpy.getTemplateTagsByVersionId.and.returnValue(
        of([{ type: TagTypeEnum.Text }])
      );
      tick();

      // act
      component.smsFormGroup.patchValue({
        templateVersionId: 444,
      });
      tick(200);

      // assert
      expect(
        templateStateSvcSpy.setProductTemplatesByProductVersionId
      ).toHaveBeenCalledWith(
        component.productVersionId,
        component.orderTemplateId,
        component.currentVoucherTemplate,
        component.tempVoucherTemplate,
        component.currentSMSTemplate,
        component.tempSMSTemplate,
        true,
        undefined,
        444
      );
    }));
  });

  describe('preview', () => {
    it('should listen to preview click for Email', fakeAsync(() => {
      // arrange
      tick(200);
      component.activeTab = TemplateTypeEnum.Email;

      templateSvcSpy.getTemplateDetails.and.returnValue(
        of([
          {
            templateId: 1,
            templateVersionId: 1,
            type: 1,
          },
        ])
      );
      modalSvcSpy.open.and.returnValue({
        result: Promise.resolve(),
        componentInstance: {
          selectedQuotation: {},
          applyTagValues: () => {
            return;
          },
        },
      });

      // act
      formEmitterSvcSpy.emitEvent.next('voucherTemplate');
      tick(500);

      // assert
      expect(modalSvcSpy.open).toHaveBeenCalled();
    }));

    it('should listen to preview click for SMS', fakeAsync(() => {
      // arrange
      tick(200);
      component.activeTab = TemplateTypeEnum.SMS;

      templateSvcSpy.getTemplateDetails.and.returnValue(
        of([
          {
            templateId: 1,
            templateVersionId: 1,
            type: 2,
          },
        ])
      );
      modalSvcSpy.open.and.returnValue({
        result: Promise.resolve(),
        componentInstance: {
          selectedQuotation: {},
          applyTagValues: () => {
            return;
          },
        },
      });

      // act
      formEmitterSvcSpy.emitEvent.next('voucherTemplate');
      tick(500);

      // assert
      expect(modalSvcSpy.open).toHaveBeenCalled();
    }));

    it('should listen to preview click for SMS', fakeAsync(() => {
      // arrange
      tick(200);
      component.activeTab = TemplateTypeEnum.SMS;

      templateSvcSpy.getTemplateDetails.and.returnValue(of([]));
      modalSvcSpy.open.and.returnValue({
        result: Promise.resolve(),
        componentInstance: {
          selectedQuotation: {},
          applyTagValues: () => {
            return;
          },
        },
      });

      // act
      formEmitterSvcSpy.emitEvent.next('voucherTemplate123');
      tick(200);

      // assert
      expect(modalSvcSpy.open).toHaveBeenCalled();
    }));
  });

  describe('default values', () => {
    it('should apply default values for Email', fakeAsync(() => {
      // arrange
      tick(200);
      const expectedEmailSubject = 'ES';
      const expectedEmailGreeting = 'EG';
      const emailSubjectControl = component.voucherPageFormGroup.get('1');
      const emailGreetingControl = component.voucherPageFormGroup.get('61');

      // assert
      expect(emailSubjectControl?.value).toBe(expectedEmailSubject);
      expect(emailGreetingControl?.value).toBe(expectedEmailGreeting);
    }));

    it('should apply default values for SMS', fakeAsync(() => {
      // arrange
      tick(200);
      const expectedSMSGreeting = 'SG';
      const emailGreetingControl = component.smsFormGroup.get('1');

      // assert
      expect(emailGreetingControl?.value).toBe(expectedSMSGreeting);
    }));
  });

  describe('should call onEndButtonClicked', () => {
    it('and when value is save, should save current template selected', () => {
      // act
      component.onEndButtonClicked('save');

      // assert
      expect(
        templateStateSvcSpy.setProductTemplatesByProductVersionId
      ).toHaveBeenCalledWith(
        component.productVersionId,
        component.orderTemplateId,
        component.tempVoucherTemplate,
        component.tempVoucherTemplate,
        component.tempSMSTemplate,
        component.tempSMSTemplate,
        true,
        undefined,
        undefined
      );
    });

    it('and when value is save, should save default undefined if the values is nullable', () => {
      // arrange
      component.orderTemplateId = null;
      component.activeTab = TemplateTypeEnum.SMS;
      component.currentVoucherTemplate = null;
      component.tempVoucherTemplate = undefined;
      component.currentSMSTemplate = null;
      component.tempSMSTemplate = undefined;

      // act
      component.onEndButtonClicked('save');

      // assert
      expect(
        templateStateSvcSpy.setProductTemplatesByProductVersionId
      ).toHaveBeenCalledWith(
        component.productVersionId,
        component.orderTemplateId,
        component.tempVoucherTemplate,
        component.tempVoucherTemplate,
        component.tempSMSTemplate,
        component.tempSMSTemplate,
        true,
        undefined,
        undefined
      );
    });

    it('and when value is not save, should not save the current template selected', () => {
      // act
      component.onEndButtonClicked('cancel');

      // assert
      expect(
        templateStateSvcSpy.setProductTemplatesByProductVersionId
      ).toHaveBeenCalledWith(
        component.productVersionId,
        component.orderTemplateId,
        component.currentVoucherTemplate,
        component.currentVoucherTemplate,
        component.currentSMSTemplate,
        component.currentSMSTemplate,
        true,
        undefined,
        undefined
      );
    });

    it('and when value is cancel, should save default undefined if the values is nullable', () => {
      // arrange
      component.activeTab = TemplateTypeEnum.SMS;
      component.currentVoucherTemplate = null;
      component.tempVoucherTemplate = undefined;
      component.currentSMSTemplate = null;
      component.tempSMSTemplate = undefined;

      // act
      component.onEndButtonClicked('cancel');

      // assert
      expect(
        templateStateSvcSpy.setProductTemplatesByProductVersionId
      ).toHaveBeenCalledWith(
        component.productVersionId,
        component.orderTemplateId,
        component.tempVoucherTemplate,
        component.tempVoucherTemplate,
        component.tempSMSTemplate,
        component.tempSMSTemplate,
        true,
        undefined,
        undefined
      );
    });
  });

  describe('onTabChange', () => {
    beforeEach(() => {
      softSaveSpy = spyOn(component, 'softSave');
    });

    it('should not call softSave', () => {
      // arrange
      component.activeTab = TemplateTypeEnum.Email;

      // act
      component.onTabChange(TemplateTypeEnum.SMS);

      // assert
      expect(softSaveSpy).not.toHaveBeenCalled();
    });

    it('should call softSave', () => {
      // arrange
      component.firstLoad = false;
      component.activeTab = TemplateTypeEnum.SMS;

      // act
      component.onTabChange(TemplateTypeEnum.Email);

      // assert
      expect(softSaveSpy).toHaveBeenCalled();
    });

    it('should call softSave with null values', () => {
      // arrange
      component.currentVoucherTemplate = null;
      component.currentSMSTemplate = null;
      component.tempVoucherTemplate = undefined;
      component.tempSMSTemplate = undefined;

      component.firstLoad = false;
      component.activeTab = TemplateTypeEnum.SMS;

      // act
      component.onTabChange(TemplateTypeEnum.Email);

      // assert
      expect(softSaveSpy).toHaveBeenCalled();
    });
  });

  describe('softSave', () => {
    describe('Voucher', () => {
      it('should replace', () => {
        // arrange
        (component.tempVoucherTemplate as any).productTemplateVersion = [
          {
            templateVersionId: 56,
          },
          {
            templateVersionId: 66,
          },
        ];
        const mapTagValueListSpy = spyOn(component, 'mapTagValueList');

        // act
        component.softSave(TemplateTypeEnum.Email, 66);

        // assert
        expect(mapTagValueListSpy).toHaveBeenCalled();
      });

      it('should add', () => {
        // arrange
        (component.tempVoucherTemplate as any).productTemplateVersion = [
          {
            templateVersionId: 56,
          },
          {
            templateVersionId: 66,
          },
        ];
        const mapTagValueListSpy = spyOn(component, 'mapTagValueList');

        // act
        component.softSave(TemplateTypeEnum.Email, 76);

        // assert
        expect(mapTagValueListSpy).toHaveBeenCalled();
      });
    });
    describe('SMS', () => {
      it('should replace', () => {
        // arrange
        (component.tempSMSTemplate as any).productTemplateVersion = [
          {
            templateVersionId: 56,
          },
          {
            templateVersionId: 66,
          },
        ];
        const mapTagValueListSpy = spyOn(component, 'mapTagValueList');

        // act
        component.softSave(TemplateTypeEnum.SMS, 66);

        // assert
        expect(mapTagValueListSpy).toHaveBeenCalled();
      });

      it('should add', () => {
        // arrange
        (component.tempSMSTemplate as any).productTemplateVersion = [
          {
            templateVersionId: 56,
          },
          {
            templateVersionId: 66,
          },
        ];
        const mapTagValueListSpy = spyOn(component, 'mapTagValueList');

        // act
        component.softSave(TemplateTypeEnum.SMS, 76);

        // assert
        expect(mapTagValueListSpy).toHaveBeenCalled();
      });

      describe('on create mode', () => {
        beforeEach(() => {
          component.orderTemplateId = null;
        });

        it('should replace', () => {
          // arrange
          (component.tempSMSTemplate as any).productTemplateVersion = [
            {
              templateVersionId: 56,
            },
            {
              templateVersionId: 66,
            },
          ];
          const mapTagValueListSpy = spyOn(component, 'mapTagValueList');

          // act
          component.softSave(TemplateTypeEnum.SMS, 66);

          // assert
          expect(mapTagValueListSpy).toHaveBeenCalled();
        });

        it('should add', () => {
          // arrange
          (component.tempSMSTemplate as any).productTemplateVersion = [
            {
              templateVersionId: 56,
            },
            {
              templateVersionId: 66,
            },
          ];
          const mapTagValueListSpy = spyOn(component, 'mapTagValueList');

          // act
          component.softSave(TemplateTypeEnum.SMS, 76);

          // assert
          expect(mapTagValueListSpy).toHaveBeenCalled();
        });

        it('should add if there is no product template version', () => {
          // arrange
          (component.tempSMSTemplate as any).productTemplateVersion = [];
          const mapTagValueListSpy = spyOn(component, 'mapTagValueList');

          // act
          component.softSave(TemplateTypeEnum.SMS, 76);

          // assert
          expect(mapTagValueListSpy).toHaveBeenCalled();
        });
      });
    });
  });

  describe('Edit Template Parts()', () => {
    beforeEach(() => {
      (component.tempSMSTemplate as any) = {
        productTemplateVersion: [
          {
            templateVersionId: 56,
            content1: 'Test1',
            content2: 'Test2',
            content3: 'Test3',
          },
        ],
      };
    });

    describe('setPartControl()', () => {
      const partControlTestData = [
        {
          title: 'empty content2 and content3',
          part: 1,
          expected: {
            content1: 'Test1',
            content2: '',
            content3: '',
          },
        },
        {
          title: 'empty content3',
          part: 2,
          expected: {
            content1: 'Test1',
            content2: 'Test2',
            content3: '',
          },
        },
        {
          title: 'not empty any',
          part: 3,
          expected: {
            content1: 'Test1',
            content2: 'Test2',
            content3: 'Test3',
          },
        },
      ];

      partControlTestData.forEach((test) => {
        it(`should ${test.title} when ${test.part} is selected`, () => {
          // act
          component.setPartControl(test.part);

          // assert
          const getTemplate = (component.tempSMSTemplate as any)
            .productTemplateVersion[0];
          expect(getTemplate.content1).toBe(test.expected.content1);
          expect(getTemplate.content2).toBe(test.expected.content2);
          expect(getTemplate.content3).toBe(test.expected.content3);
        });
      });

      partControlTestData.forEach((test) => {
        it(`should ${test.title} when ${test.part} is selected and there is no content existing`, () => {
          // arrange
          (component.tempSMSTemplate as any) = {
            productTemplateVersion: [
              {
                templateVersionId: 56,
                content1: undefined,
                content2: undefined,
                content3: undefined,
              },
            ],
          };

          // act
          component.setPartControl(test.part);

          // assert
          const getTemplate = (component.tempSMSTemplate as any)
            .productTemplateVersion[0];
          expect(getTemplate.content1).toBe('');
          expect(getTemplate.content2).toBe('');
          expect(getTemplate.content3).toBe('');
        });
      });
    });

    describe('listenToTagCategoryChange()', () => {
      it('should listen to tagCategory 0', () => {
        // assert
        component.tagCategory?.setValue(0);
        // expect
        expect(component.filteredTags).toBe(component.smsTags);
      });

      it('should listen to tagCategory 1', () => {
        // arrange
        const expectedTags = component.smsTags?.filter(
          (tag) => tag.category === 1
        );

        // assert
        component.tagCategory?.setValue(1);

        // expect
        expect(component.filteredTags).toEqual(expectedTags);
      });
    });
  });
});
