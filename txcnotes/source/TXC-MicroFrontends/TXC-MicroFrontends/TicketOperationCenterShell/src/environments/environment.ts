// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  landingUrl:
    'https://esg-txcloud-new-reverseproxy-dev-asse-web-d.azurewebsites.net',
  apiUrl: 'api-staging.txc.edenred.net/gateway/',
  tx2ApiEnv: 'staging-txcapi',
  isLocal: true,
  // put MFE PATH
  clientPath: 'http://localhost:4204/remoteEntry.js',
  voucherPath: 'http://localhost:4203/remoteEntry.js',
  merchantPath: 'http://localhost:4202/remoteEntry.js',
  orderPath: 'http://localhost:4205/remoteEntry.js',
  productPath: 'http://localhost:4201/remoteEntry.js',
  systemPath: 'http://localhost:4206/remoteEntry.js',
  batchProcessorPath: 'http://localhost:4207/remoteEntry.js',
   // feature flag
  SHOW_FEATURE_ON_SIDE_BAR: true,
  adTenantId: '4c1d9e0f-5c27-4228-a35a-de7b4083ff7b',
  adClientId: '3318dca3-65d0-449d-8eb4-8700f567d0dd',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
