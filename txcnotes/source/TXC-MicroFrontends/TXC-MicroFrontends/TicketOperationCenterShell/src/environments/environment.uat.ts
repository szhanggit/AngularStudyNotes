export const environment = {
    production: false,
    landingUrl: "https://esg-txcloud-new-reverseproxy-preprod-asse-web-d.azurewebsites.net",
    apiUrl: "api-uat.txc.edenred.net/gateway/",
    tx2ApiEnv: 'uat-txcapi',
    isLocal: false,
    // put MFE PATH
    clientPath: 'http://esgmfeuatassestored.blob.core.windows.net/clients/remoteEntry.js',
    voucherPath: 'http://esgmfeuatassestored.blob.core.windows.net/voucher/remoteEntry.js',
    merchantPath: 'https://esgmfeuatassestored.blob.core.windows.net/merchants/remoteEntry.js',
    orderPath: 'https://esgmfeuatassestored.blob.core.windows.net/order/remoteEntry.js',
    productPath: 'https://esgmfeuatassestored.blob.core.windows.net/products/remoteEntry.js',
    systemPath: 'https://esgmfeuatassestored.blob.core.windows.net/system/remoteEntry.js',
    batchProcessorPath: 'https://esgmfeuatassestored.blob.core.windows.net/batch-processor/remoteEntry.js',
    // feature flag
    SHOW_FEATURE_ON_SIDE_BAR: false,
    adTenantId: '4c1d9e0f-5c27-4228-a35a-de7b4083ff7b',
    adClientId: 'f73534a1-2e1b-4d99-90e8-f2fe9e0aec18',
};
