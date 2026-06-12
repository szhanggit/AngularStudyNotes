export interface Address {
    id?: number;
    detailAddressLine: string;
    district?: string;
    cityId?: number;
    stateOrProvinceId?: number;
    postcode?: string;
    countryId?: number;
    longitude?: number;
    latitude?: number;
    status?: number;
}