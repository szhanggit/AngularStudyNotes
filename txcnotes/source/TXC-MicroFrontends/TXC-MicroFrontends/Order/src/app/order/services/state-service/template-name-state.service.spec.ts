import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { TemplateNameListStateService } from './template-name-state.service';
import { TemplateService } from '../template.service';

describe('TemplateNameStateService', () => {
  const templateServiceSpy = jasmine.createSpyObj(['getTemplatesList']);
  let service: TemplateNameListStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: TemplateService, useValue: templateServiceSpy }],
    });
    service = TestBed.inject(TemplateNameListStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('setSelectedTemplateNameState()', () => {
    it('should call getTemplatesList', () => {
      // arrange
      templateServiceSpy.getTemplatesList.and.returnValue(of([]));
      // act
      service.setSelectedTemplateNameState('test', 'sms');

      // assert
      expect(templateServiceSpy.getTemplatesList).toHaveBeenCalled();
    });

    it('should call getTemplatesList with empty', () => {
      // arrange
      templateServiceSpy.getTemplatesList.and.returnValue(of([]));
      // act
      service.setSelectedTemplateNameState();

      // assert
      expect(templateServiceSpy.getTemplatesList).toHaveBeenCalled();
    });
  });

  describe('setSelectedEmailTemplateNameState()', () => {
    it('should call getTemplatesList', () => {
      // arrange
      templateServiceSpy.getTemplatesList.and.returnValue(of([]));
      // act
      service.setSelectedEmailTemplateNameState('test');

      // assert
      expect(templateServiceSpy.getTemplatesList).toHaveBeenCalled();
    });

    it('should call getTemplatesListith empty', () => {
      // arrange
      templateServiceSpy.getTemplatesList.and.returnValue(of([]));
      // act
      service.setSelectedEmailTemplateNameState();

      // assert
      expect(templateServiceSpy.getTemplatesList).toHaveBeenCalled();
    });
  });

  describe('setSelectedSMSTemplateNameState()', () => {
    it('should call getTemplatesList', () => {
      // arrange
      templateServiceSpy.getTemplatesList.and.returnValue(of([]));
      // act
      service.setSelectedSMSTemplateNameState('test');

      // assert
      expect(templateServiceSpy.getTemplatesList).toHaveBeenCalled();
    });

    it('should call getTemplatesList with empty', () => {
      // arrange
      templateServiceSpy.getTemplatesList.and.returnValue(of([]));
      // act
      service.setSelectedSMSTemplateNameState();

      // assert
      expect(templateServiceSpy.getTemplatesList).toHaveBeenCalled();
    });
  });
});
