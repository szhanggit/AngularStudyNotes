import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

import { ViewFormAccordionComponent } from './view-form-accordion.component';

describe('ViewFormAccordionComponent', () => {
  let component: ViewFormAccordionComponent;
  let fixture: ComponentFixture<ViewFormAccordionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewFormAccordionComponent],
      imports: [NgbCollapseModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewFormAccordionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onShowChildProductChanged()', () => {
    it('should emit showChildProduct', () => {
      // arrange
      const showChildProductSpy = spyOn(component.showChildProduct, 'emit');

      // act
      component.onShowChildProductChanged();

      // assert
      expect(showChildProductSpy).toHaveBeenCalled();
    });
  });

  describe('onEdit()', () => {
    it('should emit editClicked', () => {
      // arrange
      const editClickedSpy = spyOn(component.editClicked, 'emit');

      // act
      component.onEdit();

      // assert
      expect(editClickedSpy).toHaveBeenCalled();
    });
  });
});
