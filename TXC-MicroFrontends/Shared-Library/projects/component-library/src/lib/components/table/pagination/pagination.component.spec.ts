import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginationLibComponent } from './pagination.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

describe('PaginationLibComponent', () => {
  let component: PaginationLibComponent;
  let fixture: ComponentFixture<PaginationLibComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaginationLibComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginationLibComponent);
    component = fixture.componentInstance;
    component.total$ = of(10);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('itemStart()', () => {
    it('should return 1', () => {
      // act
      component.page = 1;
      const actualItemStart = component.itemStart;

      // assert
      expect(actualItemStart).toBe(1);
    });

    it('should compute for other pages', () => {
      // act
      component.page = 2;
      component.pageSize = 10;
      component.total = 20;
      const actualItemStart = component.itemStart;

      // assert
      expect(actualItemStart).toBe(11);
    });
  });

  describe('itemEnd()', () => {
    it('should return 1', () => {
      // act
      component.page = 1;
      component.pageSize = 10;
      component.total = 20;
      const actualItemEnd = component.itemEnd;

      // assert
      expect(actualItemEnd).toBe(10);
    });

    it('should compute for other pages', () => {
      // act
      component.page = 2;
      component.pageSize = 10;
      component.total = 20;
      const actualItemStart = component.itemEnd;

      // assert
      expect(actualItemStart).toBe(20);
    });
  });

  describe('onPageChange()', () => {
    it('should change current page and emit pagechange', () => {
      // arrange
      const pageChangeSpy = spyOn(component.pageChange, 'emit');

      // act
      component.onPageChange(2);

      // assert
      expect(component.page).toBe(2);
      expect(pageChangeSpy).toHaveBeenCalled();
    });
  });
});
