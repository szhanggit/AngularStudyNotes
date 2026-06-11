const HEADER_LOADING_INDICATOR = "loading-indicator"

const EXCLUDED_PATH_NAMES = [
    "/.auth/me", 
    "/.auth/logout", 
    "/gateway/api/auth", 
    "/gateway/api/Auth/init-matrix",
    "/gateway/api/Tnt/Tenant/TenantListMinimal",
    "/gateway/api/Contract/UploadSku",
]

export { HEADER_LOADING_INDICATOR, EXCLUDED_PATH_NAMES };
