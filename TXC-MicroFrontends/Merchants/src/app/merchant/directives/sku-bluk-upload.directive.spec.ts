import { SkuBlukUploadDirective } from './sku-bluk-upload.directive';

describe('SkuBlukUploadDirective', () => {
  it('should create an instance', () => {
    let nullValue : any = {}
    const directive = new SkuBlukUploadDirective(nullValue,nullValue, nullValue, nullValue, nullValue, nullValue, nullValue);
    expect(directive).toBeTruthy();
  });
});
