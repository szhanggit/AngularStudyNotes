import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchOrderListComponent } from './batch-order-list.component';
import { NgbModal, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { UtilityService } from '../../services/utility.service';
import { of } from 'rxjs';
import { CreateBatchOrderModalComponent } from './create-batch-order-modal/create-batch-order-modal.component';
import { NavigationEnd, Router } from '@angular/router';

describe('BatchOrderListComponent', () => {
  let component: BatchOrderListComponent;
  let fixture: ComponentFixture<BatchOrderListComponent>;
  const utilityServiceSpy = jasmine.createSpyObj('UtilityService', [
    'transformedSourceValue',
    'filterCommonBatchTable',
    'listenToUploadSuccess',
    'listenToErrorMessage',
    'unsubscribeToastSubscriptions',
  ]);

  const modalServiceSpy = jasmine.createSpyObj('NgbModal', ['open']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BatchOrderListComponent],
      imports: [NgbNavModule],
      providers: [
        {
          provide: UtilityService,
          useValue: utilityServiceSpy,
        },
        { provide: NgbModal, useValue: modalServiceSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(BatchOrderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have actionButtons defined', () => {
    expect(component.actionButtons).toBeDefined();
  });

  it('should have a button with text "Create batch order"', () => {
    const button = component.actionButtons.find(
      (btn) => btn.buttonText === 'Create batch order'
    );
    expect(button).toBeDefined();
  });

  it('should call openModalWindow when buttonAction is executed', () => {
    const button = component.actionButtons.find(
      (btn) => btn.buttonText === 'Create batch order'
    );
    spyOn(component, 'openModalWindow');
    if (button) button.buttonAction();
    expect(component.openModalWindow).toHaveBeenCalled();
  });

  it('should have openModalWindow function', () => {
    expect(component.openModalWindow).toBeDefined();
  });

  it('should call listenToUploadSuccess on ngAfterViewInit', () => {
    component.ngAfterViewInit();
    expect(utilityServiceSpy.listenToUploadSuccess).toHaveBeenCalled();
  });


  it('should call modalService.open with correct parameters when openModalWindow is called', () => {
    component.openModalWindow();
    expect(modalServiceSpy.open).toHaveBeenCalledWith(
      CreateBatchOrderModalComponent,
      {
        size: 'md',
        backdrop: 'static',
        centered: true,
      }
    );
  });

  it('should set selectedView on handleSelectedViewChange', () => {
    component.selectedView = '';
    component.handleSelectedViewChange('Failed');
    expect(component.selectedView).toEqual('Failed');
  });

  it('should set selectedView to empty string on NavigationEnd', () => {
    const navigationEndEvent = new NavigationEnd(
      1,
      'http://localhost:4200/',
      'http://localhost:4200/'
    );
    const router = TestBed.inject(Router);
    spyOn(router.events, 'pipe').and.returnValue(of(navigationEndEvent));
    component.ngAfterViewInit();
    expect(component.selectedView).toEqual('');
  });
});
