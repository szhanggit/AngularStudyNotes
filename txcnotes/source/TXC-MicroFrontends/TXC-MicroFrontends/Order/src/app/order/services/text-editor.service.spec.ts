import { TestBed } from '@angular/core/testing';

import { TextEditorService } from './text-editor.service';

describe('TextEditorService', () => {
  let service: TextEditorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TextEditorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('convertHtmlToPlainText()', () => {
  
    it('should return empty', () => {
      // arrange
      const expectedString = '';

      // act
      const actualString = service.convertHtmlToPlainText('');

      // assert
      expect(actualString).toBe(expectedString);
    });

    it('should convert text', () => {
      // arrange
      const expectedString = 'test';

      // act
      const actualString = service.convertHtmlToPlainText('   test   ');

      // assert
      expect(actualString).toBe(expectedString);
    });

    it('should convert text and change li to bullet', () => {
      // arrange
      const expectedString = `${service.PATTERN.BULLET}test`;

      // act
      const actualString = service.convertHtmlToPlainText('<li>test</li>');

      // assert
      expect(actualString).toEqual(expectedString);
    });

    it('should convert text and remove links', () => {
      // arrange
      const expectedString = `test`;

      // act
      const actualString = service.convertHtmlToPlainText('<a href="">test</a>');

      // assert
      expect(actualString).toEqual(expectedString);
    });
  
  });
  
});
