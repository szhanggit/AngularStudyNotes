// import { ComponentFixture, TestBed, inject } from '@angular/core/testing';

// import { SmsDesignComponent } from './sms-design.component';
// import { FormBuilder } from '@angular/forms';
// import { NO_ERRORS_SCHEMA } from '@angular/core';
// import { FormEmitterService } from 'src/app/shared/dumb/form/form-emitter.service';
// import { Subject } from 'rxjs';
// import { TemplateService } from 'src/app/order/services/template.service';

// xdescribe('SmsDesignComponent', () => {
//   let component: SmsDesignComponent;
//   let fixture: ComponentFixture<SmsDesignComponent>;
//   let formEmitterService: jasmine.SpyObj<FormEmitterService>;
//   let templateService: jasmine.SpyObj<TemplateService>;

//   class TemplateServiceStub {
//     templatePreviewSingle() {}
//     mapSmsTags() {}
//     getTemplateTagsByVersionId() {
//       return [
//         {
//           displayName: 'MERCHANT_LOGO',
//           applyToHtmlTemplate: true,
//           applyToTextTemplate: true,
//           category: 3,
//           defaultValue: '',
//           description: 'MERCHANT_LOGO',
//           reflectionType: null,
//           scopeLevel: 0,
//           tagId: 5,
//           tagName: '{MERCHANT_LOGO}',
//           type: 1,
//           isSelected: false,
//         },
//       ];
//     }

//     templateList = [
//       {
//         templateId: 239,
//         type: 2,
//         subject1: null,
//         subject2: null,
//         subject3: null,
//         content1:
//           '{SMS_GREETINGS} Ticket Xpress即享券: {PRODUCT_NAME}序號: {VOUCHER_NUMBER}使用期限:{END_DATE}止{ShortUrl}{ShortUrlAuthCode}',
//         content2: '',
//         content3: '',
//         isCurrentVersion: true,
//         attachmentTemplateVersionId: null,
//         templateName: 'TEST_TX電子禮券基本版 (含過期日)',
//         templateVersionId: 4,
//         version: 56,
//         defaultLanguage: 66,
//         languageId: 66,
//       },
//     ];
//   }

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       declarations: [SmsDesignComponent],
//       providers: [
//         FormBuilder,
//         {
//           provide: FormEmitterService,
//           useValue: jasmine.createSpyObj('FormEmitterService', [], {
//             emitEvent: new Subject<string>(),
//           }),
//         },
//         {
//           provide: TemplateService,
//           useClass: TemplateServiceStub,
//         },
//       ],
//       schemas: [NO_ERRORS_SCHEMA],
//     }).compileComponents();
//   });

//   beforeEach(inject([FormBuilder], (fb: FormBuilder) => {
//     fixture = TestBed.createComponent(SmsDesignComponent);
//     component = fixture.componentInstance;

//     /* This is where we can simulate / test our component
//        and pass in a value for formGroup where it would've otherwise
//        required it from the parent
//     */
//     component.smsDesignFormGroup = fb.group({
//       smsVoucherTemplate: {
//         content1: 'test content1',
//         content2: 'test content2',
//         content3: 'test content3',
//       },
//       productName: '',
//       language: '',
//       applyLanguage: '',
//       smsGreetings: '',
//       templatePart: fb.group({
//         templatePart: 1,
//         parts: fb.array([fb.control('')]),
//         tagCategory: 0,
//       }),
//     });
//     component.deliveryDetailsFormGroup = fb.group({
//       emailTemplate: '',
//       emailSubject: '',
//       emailGreeting: '',
//       msgEncoding: '',
//       smsGreeting: '',
//     });

//     formEmitterService = TestBed.inject(
//       FormEmitterService
//     ) as jasmine.SpyObj<FormEmitterService>;

//     templateService = TestBed.inject(
//       TemplateService
//     ) as jasmine.SpyObj<TemplateService>;

//     fixture.detectChanges();
//   }));

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should initialize sms design fields', () => {
//     // assert
//     expect(component.smsDesignFieldsDefinition).toBeDefined();
//     expect(component.templateList).toBeDefined();
//     expect(component.templateParts).toBeDefined();
//     expect(component.tagCategories).toBeDefined();
//     expect(component.smsTags).toBeDefined();
//     expect(component.filteredTags).toEqual(component.smsTags);
//   });

//   describe('listenToPreviewClick()', () => {
//     it('should call templatePreviewSingle', () => {
//       // arrange
//       const formControl = 'smsVoucherTemplate';
//       const templatePreviewSingleSpy = spyOn(
//         templateService,
//         'templatePreviewSingle'
//       );
      
//       // act
//       formEmitterService.emitEvent.next(formControl);

//       // assert
//       expect(templatePreviewSingleSpy).toHaveBeenCalled();
//     });

//     it('should not call templatePreviewSingle', () => {
//       // arrange
//       const formControl = 'smsVoucherTemplate';
//       const templatePreviewSingleSpy = spyOn(
//         templateService,
//         'templatePreviewSingle'
//       );
//       component.smsVoucherTemplate?.setValue(null);

//       // act
//       formEmitterService.emitEvent.next(formControl);

//       // assert
//       expect(templatePreviewSingleSpy).not.toHaveBeenCalled();
//     });
//   });

//   it('should call setPartControl on listenToTemplatePartChange()', () => {
//     // arrange
//     const templatePart = 3;
//     const setPartControlSpy = spyOn(component, 'setPartControl');

//     // act
//     component.templatePart?.setValue(templatePart);

//     // assert
//     expect(setPartControlSpy).toHaveBeenCalledOnceWith(templatePart);
//   });

//   describe('setPartControl()', () => {
//     it('should push form control to parts from array if templatePart !== parts length', () => {
//       // arrange
//       const parts = 2;
//       component.templatePart?.setValue(parts);

//       // act
//       component.setPartControl(parts);

//       // assert
//       expect(component.parts.controls.length).toEqual(parts);
//     });

//     it('should assign empty string if template.content is falsy', () => {
//       // arrange
//       component.smsVoucherTemplate?.setValue({
//         content1: undefined,
//         content2: undefined,
//         content3: undefined,
//       });
//       const parts = 3;
//       const expected = '';
//       component.templatePart?.setValue(parts);

//       // act
//       component.setPartControl(parts);

//       // assert
//       expect(component.parts.controls[0]?.value).toEqual(expected);
//       expect(component.parts.controls[1]?.value).toEqual(expected);
//       expect(component.parts.controls[2]?.value).toEqual(expected);
//     });
//   });

//   describe('should assign sms tags to filteredTags and clear selected tag on listenToTagCategoryChange()', () => {
//     it('should assign all sms tags', () => {
//       // arrange
//       const tagCategory = 0;

//       // act
//       component.tagCategory?.setValue(tagCategory);

//       // assert
//       expect(component.filteredTags).toEqual(component.smsTags);
//       expect(component.selectedTagValue).toBeFalsy();
//     });

//     it('should assign sms tags based on category', () => {
//       // arrange
//       const tagCategory = 3;
//       const expected = [
//         {
//           displayName: 'MERCHANT_LOGO',
//           applyToHtmlTemplate: true,
//           applyToTextTemplate: true,
//           category: 3,
//           defaultValue: '',
//           description: 'MERCHANT_LOGO',
//           reflectionType: null,
//           scopeLevel: 0,
//           tagId: 5,
//           tagName: '{MERCHANT_LOGO}',
//           type: 1,
//           isSelected: false,
//         },
//       ];

//       // act
//       component.tagCategory?.setValue(tagCategory);

//       // assert
//       expect(component.filteredTags).toEqual(expected);
//       expect(component.selectedTagValue).toBeFalsy();
//     });
//   });

//   describe('listenToVoucherTemplateChange()', () => {
//     it('should hide fields when voucher template is null', () => {
//       // arrange
//       const hideFieldsSpy = spyOn(component, 'hideFields');

//       // act
//       component.smsVoucherTemplate?.setValue(null);

//       // assert
//       expect(hideFieldsSpy).toHaveBeenCalledWith(false);
//     });

//     it('should set template values when voucher template is null', () => {
//       // arrange
//       const template = {
//         content1: 'test content1',
//         content2: 'test content2',
//         content3: 'test content3',
//         templateVersionId: 1,
//       };

//       // act
//       component.smsVoucherTemplate?.setValue(template);

//       // assert
//       expect(component.language?.value).toEqual(template.templateVersionId);
//       expect(component.parts.controls[0]?.value).toEqual(template.content1);
//     });
//   });

//   describe('onInsertTag()', () => {
//     it('should append tag on previous value', () => {
//       // arrange
//       component.selectedPartIndex = 0;
//       component.textAreaCaretPos = 0;
//       component.selectedTagValue = '{TEST_TAG}';
//       const expected = 'test content1{TEST_TAG}';

//       // act
//       component.onInsertTag();

//       // assert
//       expect(
//         component.parts.controls[component.selectedPartIndex]?.value
//       ).toEqual(expected);
//     });

//     it('should insert tag caret position', () => {
//       // arrange
//       component.selectedPartIndex = 0;
//       component.textAreaCaretPos = 4;
//       component.selectedTagValue = '{TEST_TAG}';
//       const expected = 'test{TEST_TAG} content1';

//       // act
//       component.onInsertTag();

//       // assert
//       expect(
//         component.parts.controls[component.selectedPartIndex]?.value
//       ).toEqual(expected);
//     });
//   });

//   it('should assign selectedPartIndex onFocus()', () => {
//     // arrange
//     const expected = 1;

//     // act
//     component.onFocus(1);

//     // assert
//     expect(component.selectedPartIndex).toEqual(expected);
//   });

//   it('should set parts updated value on updatedValueFromDirective()', () => {
//     // assert
//     const expected = {
//       caretPos: 0,
//       newValue: 'test',
//     };
//     const index = 0;

//     // act
//     component.updatedValueFromDirective(expected, index);

//     // assert
//     expect(component.parts.controls[index]?.value).toEqual(expected.newValue);
//     expect(component.textAreaCaretPos).toEqual(expected.caretPos);
//   });

//   it('should assign selectedTagValue onTagSelect', () => {
//     // arrange
//     const tag = {
//       displayName: 'STORE_URL',
//       applyToHtmlTemplate: true,
//       applyToTextTemplate: true,
//       category: 2,
//       defaultValue: '',
//       description: 'STORE_URL',
//       reflectionType: null,
//       scopeLevel: 0,
//       tagId: 4,
//       tagName: '{STORE_URL}',
//       type: 1,
//       isSelected: true,
//     };

//     // act
//     component.onTagSelect(tag);

//     // assert
//     expect(component.selectedTagValue).toEqual(tag.tagName);
//   });
// });
