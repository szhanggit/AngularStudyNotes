import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { EmailTemplateStateService } from './email-template-state.service';
import { TemplateService } from '../template.service';
import { of } from 'rxjs';

describe('EmailTemplateStateService', () => {
  let store: any = {};
  const TW_Tenant = {
    tenantId: 7,
    name: 'TW',
  };

  const GL_TENANT = {
    tenantId: 9,
    name: 'GL',
  };

  let service: EmailTemplateStateService;
  const templateServiceSpy = jasmine.createSpyObj('TemplateService', [
    'getTemplatesList',
  ]);

  // mock local storage
  const mockLocalStorage = {
    getItem: (key: string): string => {
      return key in store ? store[key] : null;
    },
    setItem: (key: string, value: string) => {
      store[key] = `${value}`;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: TemplateService,
          useValue: templateServiceSpy,
        },
      ],
    });
    spyOn(localStorage, 'getItem').and.callFake(mockLocalStorage.getItem);
    spyOn(localStorage, 'setItem').and.callFake(mockLocalStorage.setItem);
    spyOn(localStorage, 'removeItem').and.callFake(mockLocalStorage.removeItem);
    spyOn(localStorage, 'clear').and.callFake(mockLocalStorage.clear);
    service = TestBed.inject(EmailTemplateStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getTemplateList in NON-GL', fakeAsync(() => {
    // arrange
    localStorage.setItem('tenant', JSON.stringify(TW_Tenant));

    // act
    templateServiceSpy.getTemplatesList.and.returnValue(of([]));
    service.setEmailTemplates().subscribe((templates) => {
      // assert
      expect(templateServiceSpy.getTemplatesList).toHaveBeenCalled();
    });
    tick();
  }));

  it('should call getTemplateList in GL', fakeAsync(() => {
    // arrange
    localStorage.setItem('tenant', JSON.stringify(GL_TENANT));

    // act
    templateServiceSpy.getTemplatesList.and.returnValue(of([]));
    service.setEmailTemplates().subscribe(() => {
      // assert
      expect(templateServiceSpy.getTemplatesList).toHaveBeenCalled();
    });
    tick();
  }));
});
