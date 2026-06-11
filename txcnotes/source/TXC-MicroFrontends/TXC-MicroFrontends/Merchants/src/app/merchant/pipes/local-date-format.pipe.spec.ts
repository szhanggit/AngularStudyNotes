import { LocalDateFormatPipe } from './local-date-format.pipe';

xdescribe('LocalDateFormatPipe', () => {
  it('create an instance', () => {
    const pipe = new LocalDateFormatPipe('', '');
    expect(pipe).toBeTruthy();
  });
});
