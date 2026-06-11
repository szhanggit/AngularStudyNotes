import { TxcDateTimePipe } from "./txcdatetime.pipe";

describe('txcDateTimeService', () => {
  it('create an instance', () => {
    const pipe = new TxcDateTimePipe();
    expect(pipe).toBeTruthy();
  });
});
