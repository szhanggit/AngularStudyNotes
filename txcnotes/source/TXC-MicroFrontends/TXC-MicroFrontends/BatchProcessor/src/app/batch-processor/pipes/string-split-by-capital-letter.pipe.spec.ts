import { StringSplitByCapitalLetterPipe } from './string-split-by-capital-letter.pipe';

describe('ReplaceWithYourComponent: ', () => {
    const pipe = new StringSplitByCapitalLetterPipe();

    it('should transform value', () => {
        // arrange
        const expectedValue = 'Hello World';

        // act
        const actualValue = pipe.transform('HelloWorld');

        // assert
        expect(actualValue).toBe(expectedValue);
    });

});
