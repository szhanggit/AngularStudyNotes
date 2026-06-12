import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonTableFilterComponent } from './common-table-filter.component';
import { FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { UtilityService } from '../../services/utility.service';
import { SourcePipe } from '../../pipes/source.pipe';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SearchByEnum } from '../../enums/search-by.enum';
import { BatchDomainsEnum } from '../../enums/batch-domains.enum';
import { AttachmentService } from '@txc-angular/component-library';
import { HttpClient } from '@angular/common/http';

describe('CommonTableFilterComponent', () => {
  const httpSpy = jasmine.createSpyObj('HttpClient', ['post', 'get', 'delete']);
  let component: CommonTableFilterComponent;
  let fixture: ComponentFixture<CommonTableFilterComponent>;
  const utilityServiceSpy = jasmine.createSpyObj('UtilityService', ['']);
  let attachmentServiceSpy: jasmine.SpyObj<AttachmentService>;

  beforeEach(async () => {
    attachmentServiceSpy = jasmine.createSpyObj('AttachmentService', [
      'downloadSample',
    ]);

    await TestBed.configureTestingModule({
      declarations: [CommonTableFilterComponent],
      providers: [
        FormBuilder,
        DatePipe,
        SourcePipe,
        { provide: UtilityService, usevalue: utilityServiceSpy },
        { provide: HttpClient, useValue: httpSpy },
        { provide: AttachmentService, useValue: attachmentServiceSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CommonTableFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call setSearchPlaceholder() on ngOnInit() if OrderItemView', () => {
    component.batchDomain = BatchDomainsEnum.OrderItemView;
    const setSearchPlaceholderSpy = spyOn(component, 'setSearchPlaceholder');
    component.ngOnInit();
    expect(setSearchPlaceholderSpy).toHaveBeenCalled();
  });

  it('should emit constructed filters onSerchBatch()', () => {
    const filters = {
      searchBy: null,
      searchInput: '',
      createdOn: [{ _d: '2023/11/11' }, { _d: '2023/11/20' }],
      errorReason: '',
      source: '',
      client: null,
      batchStatus: '',
    };
    const filtersEventSpy = spyOn(component.filtersEvent, 'emit');
    component.filtersFormGroup.setValue(filters);

    component.onSearchBatch();

    expect(filtersEventSpy).toHaveBeenCalled();
  });

  it('should reset search term', () => {
    const expected = '';

    component.resetSearch();

    expect(expected).toEqual(component.searchTerm);
  });
  
  describe('setSearchPlaceholder()', () => {
    it('should return Enter exact sku code to search', () => {
      const expected = 'Enter exact sku code to search';

      component.setSearchPlaceholder(SearchByEnum.SkuCode);

      expect(expected).toEqual(component.searchPlaceholder);
    });

    it('should return Enter any text to search', () => {
      const expected = 'Enter any text to search';

      component.setSearchPlaceholder(SearchByEnum.ProductName);

      expect(expected).toEqual(component.searchPlaceholder);
    });
  });
});
