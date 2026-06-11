import { ExternalProperty } from './external-property';

export interface GetProductExternalPropertyResp {
    data: ExternalProperty[],
    message: string;
    success: boolean;
}