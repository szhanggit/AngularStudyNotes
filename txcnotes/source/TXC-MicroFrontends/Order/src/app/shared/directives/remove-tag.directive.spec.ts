import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { RemoveTagDirective } from './remove-tag.directive';

@Component({
  template: `<input type="text" appRemoveTag />`,
})
class TestComponent {}

describe('RemoveTagDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let inputElement: DebugElement;
  let directive: RemoveTagDirective;
  const testData = [
    {
      key: 'Backspace',
      expected: {
        caretPos: 5,
        newValue: 'test ',
      },
    },
    {
      key: 'Delete',
      expected: {
        caretPos: 5,
        newValue: 'test ',
      },
    },
    {
      key: '1',
      expected: {
        caretPos: 13,
      },
    },
  ];
  const value = 'test {BARCODE}';

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, RemoveTagDirective],
    });

    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    inputElement = fixture.debugElement.query(By.css('input'));
    inputElement.nativeElement.value = value;
    inputElement.nativeElement.selectionStart = 13;
    inputElement.nativeElement.selectionEnd = 14;
    directive = inputElement.injector.get(RemoveTagDirective);
    directive.previousValue = value;
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  testData.forEach((data) => {
    it(`should emit updatedValue on ${data.key}| keyup event`, () => {
      // arrange
      spyOn(directive.updatedValue, 'emit');
      const keyboardEvent = new KeyboardEvent('keyup', { key: data.key });

      // act
      inputElement.nativeElement.dispatchEvent(keyboardEvent);

      // assert
      expect(directive.updatedValue.emit).toHaveBeenCalledWith(data.expected);
    });
  });

  it('should emit updatedValue on mouseup event', () => {
    // arrange
    spyOn(directive.updatedValue, 'emit');
    const mouseEvent = new MouseEvent('mouseup');

    // act
    inputElement.nativeElement.dispatchEvent(mouseEvent);


    // assert
    expect(directive.updatedValue.emit).toHaveBeenCalled();
  });
});
