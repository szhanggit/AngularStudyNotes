import { DndDirective } from './dnd.directive';

describe('DndDirective: ', () => {
  let directive: DndDirective;

  beforeEach(() => {
    directive = new DndDirective();
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  describe('events', () => {
    it('dragover should preventDefault, stopPropagation and set fileOver to false', () => {
      // arrange
      const event = new DragEvent('dragover', {});

      // act
      directive.OnDragOver(event);

      // assert
      expect(directive.fileOver).toBeTrue();
    });

    it('dragleave should preventDefault, stopPropagation and set fileOver to false', () => {
      // arrange
      const event = new DragEvent('dragleave', {});

      // act
      directive.onDragLeave(event);

      // assert
      expect(directive.fileOver).toBeFalse();
    });

    it('drop should preventDefault, stopPropagation and set fileOver to false', () => {
      // arrange
      const fileDroppedSpy = spyOn(directive.fileDropped, 'emit');
      const file = new File([''], 'dummy.pdf');
      const fileDropEvent = {
        preventDefault: () => {},
        stopPropagation: () => {},
        dataTransfer: { files: [file, file, file] },
      };

      // act
      directive.onDrop(fileDropEvent);

      // assert
      expect(fileDroppedSpy).toHaveBeenCalled();
    });
  });
});
