export class MerchantAddress {
    detailAddressLine: string;
    district: string;
    cityId: number;
    stateOrProvinceId: number;
    postcode: string;
    countryId: number;

    constructor(value: MerchantAddress) {
        this.detailAddressLine = value.detailAddressLine;
        this.district = value.district;
        this.cityId = value.cityId;
        this.stateOrProvinceId = value.stateOrProvinceId;
        this.postcode = value.postcode;
        this.countryId = value.countryId;
    }
}