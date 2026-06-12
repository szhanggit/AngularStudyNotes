import { Tenant } from "../models/tenant";

const TENANTS: Tenant[] = [
    {
        id: 2,
        name: 'IN',
        currentUTCOffset: null
    },
    {
        id: 5,
        name: 'GR',
        currentUTCOffset: null
    },
    {
        id: 6,
        name: 'SG',
        currentUTCOffset: null
    },
    {
        id: 7,
        name: 'TW',
        currentUTCOffset: null
    },
    {
        id: 9,
        name: 'GL',
        currentUTCOffset: null
    }
]

const TENANT_KEY_LOCAL_STORAGE = "tenant";

export { TENANTS, TENANT_KEY_LOCAL_STORAGE };