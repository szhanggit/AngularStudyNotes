export const environment = {
  production: true,
  landingUrl: "https://esg-txcloud-reverseproxy-asse-web-p.azurewebsites.net",
  apiUrl: "api-prod.txc.edenred.net/gateway/",
  tx2ApiEnv: 'txcapi',
  isLocal: false,
  // put MFE PATH
  clientPath: 'https://esgmfeprodassestorep.blob.core.windows.net/clients/remoteEntry.js',
  voucherPath: 'https://esgmfeprodassestorep.blob.core.windows.net/voucher/remoteEntry.js',
  merchantPath: 'https://esgmfeprodassestorep.blob.core.windows.net/merchants/remoteEntry.js',
  orderPath: 'https://esgmfeprodassestorep.blob.core.windows.net/order/remoteEntry.js',
  productPath: 'https://esgmfeprodassestorep.blob.core.windows.net/products/remoteEntry.js',
  systemPath: 'https://esgmfeprodassestorep.blob.core.windows.net/system/remoteEntry.js',
  batchProcessorPath: 'https://esgmfeprodassestorep.blob.core.windows.net/batch-processor/remoteEntry.js',
  // feature flag
  SHOW_FEATURE_ON_SIDE_BAR: false,
  adTenantId: '4c1d9e0f-5c27-4228-a35a-de7b4083ff7b',
  adClientId: 'ef015fdb-9eb1-4711-a8f0-be46f5fa0bfc',
};
