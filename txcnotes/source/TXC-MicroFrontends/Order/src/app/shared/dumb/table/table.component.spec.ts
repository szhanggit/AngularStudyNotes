import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableComponent } from './table.component';
import { TableButtonType } from '../../enums/table-button-type.enum';

describe('TableComponent', () => {
  let component: TableComponent;
  let fixture: ComponentFixture<TableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TableComponent);
    component = fixture.componentInstance;
    component.tableModel = {
      tableHeaders: [],
      tableRows: [],
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('buttonType()', () => {
    it('should return TableButtonType', () => {
      // assert
      expect(component.buttonType).toBe(TableButtonType);
    });
  });

  describe('onDeleteClicked()', () => {
    it('should splice and emit deleteClicked', () => {
      // arrange
      const deleteClickedSpy = spyOn(component.deleteClicked, 'emit');
      component.tableModel = {
        tableHeaders: [],
        tableRows: [{} as any],
      };

      // act
      component.onDeleteClicked({} as any, 0);

      // assert
      expect(component.tableModel.tableRows.length).toBe(0);
      expect(deleteClickedSpy).toHaveBeenCalled();
    });
  });

  describe('onEditClicked()', () => {
    it('should emit editClicked', () => {
      // arrange
      const editClickedSpy = spyOn(component.editClicked, 'emit');

      // act
      component.onEditClicked({} as any, 0);

      // assert
      expect(editClickedSpy).toHaveBeenCalled();
    });
  });
});
