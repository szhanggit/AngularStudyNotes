export const environment = {
    production: false,
    landingUrl: "https://esg-txcloud-new-reverseproxy-uat-asse-web-d.azurewebsites.net",
    apiUrl: "api-txcuat.txc.edenred.net/gateway/",
    tx2ApiEnv: 'txcuat-txcapi',
    isLocal: false,
    // put MFE PATH
    clientPath: 'http://esgmfetxcuatassestored.blob.core.windows.net/clients/remoteEntry.js',
    voucherPath: 'http://esgmfetxcuatassestored.blob.core.windows.net/voucher/remoteEntry.js',
    merchantPath: 'https://esgmfetxcuatassestored.blob.core.windows.net/merchants/remoteEntry.js',
    orderPath: 'https://esgmfetxcuatassestored.blob.core.windows.net/order/remoteEntry.js',
    productPath: 'https://esgmfetxcuatassestored.blob.core.windows.net/products/remoteEntry.js',
    systemPath: 'https://esgmfetxcuatassestored.blob.core.windows.net/system/remoteEntry.js',
    batchProcessorPath: 'https://esgmfetxcuatassestored.blob.core.windows.net/batch-processor/remoteEntry.js',
    // feature flag
    SHOW_FEATURE_ON_SIDE_BAR: false,
    adTenantId: '4c1d9e0f-5c27-4228-a35a-de7b4083ff7b',
    adClientId: '98d474b2-afd1-4685-b594-b91fd05662af',
};
