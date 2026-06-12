import { CostCalculationPipe } from "./cost-calculation.pipe";

describe('CostCalculation Pipe', () => {
  it('return without decimal places', () => {
    const pipe = new CostCalculationPipe();
    const res = pipe.transform(100,45);
    expect(res).toBe(45);
  });
  it('return value up to 2 decimal places', () => {
    const pipe = new CostCalculationPipe();
    const res = pipe.transform(235,45);
    expect(res).toBe('105.75');
  });
});
