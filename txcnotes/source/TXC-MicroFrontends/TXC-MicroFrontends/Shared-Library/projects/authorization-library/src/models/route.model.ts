export interface RouteModel {
  routeName?: string;
  key?: string;
  path?: string;
  isActive? : boolean;
  operationId: number;
  operationCode?: string;
  operationName?: string;
  resourceId?: number;
  resourceCode?: string;
  resourceName?: string;
  moduleId?: number;
  moduleCode?: string;
  moduleName?: string;
}
