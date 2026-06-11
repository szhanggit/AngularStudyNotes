export const environment = {
  production: false,
  landingUrl: "https://esg-txcloud-new-reverseproxy-dev-asse-web-d.azurewebsites.net",
  apiUrl: "api-dev.txc.edenred.net/gateway/",
  tx2ApiEnv: 'staging-txcapi',
  isLocal: false,
  // put MFE PATH
  clientPath: 'https://esgmfedevassestored.blob.core.windows.net/clients/remoteEntry.js',
  voucherPath: 'https://esgmfedevassestored.blob.core.windows.net/voucher/remoteEntry.js',
  merchantPath: 'https://esgmfedevassestored.blob.core.windows.net/merchants/remoteEntry.js',
  orderPath: 'https://esgmfedevassestored.blob.core.windows.net/order/remoteEntry.js',
  productPath: 'https://esgmfedevassestored.blob.core.windows.net/products/remoteEntry.js',
  systemPath: 'https://esgmfedevassestored.blob.core.windows.net/system/remoteEntry.js',
  batchProcessorPath: 'https://esgmfedevassestored.blob.core.windows.net/batch-processor/remoteEntry.js',
  // feature flag
  SHOW_FEATURE_ON_SIDE_BAR: true,
  adTenantId: '4c1d9e0f-5c27-4228-a35a-de7b4083ff7b',
  adClientId: '3318dca3-65d0-449d-8eb4-8700f567d0dd',
};
