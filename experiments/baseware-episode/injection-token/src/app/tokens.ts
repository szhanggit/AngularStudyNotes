import { Injectable, Inject, InjectionToken } from "@angular/core";
export const MY_TOKEN = new InjectionToken<string>('myToken');
/*export const MY_TOKEN = new InjectionToken<string>('MyToken', {
    providedIn: 'root',
    factory: () => 'Token Value'
  });*/

/*
  We can do that in one of three ways:

  by adding a factory function on the Injection Token definition (Will be available on Root Module Injector).
  by adding it to the providers array of the module that will use the Injection Token (Will be available on Root Module Injector)
  by adding it to the providers array of the component that will use the Injection Token (Will be available on Element Injector)  
*/
