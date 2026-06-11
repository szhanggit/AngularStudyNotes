export interface GraphqlCollectionSegment<T> {
    totalCount?: number,
    items?: T[],
    pageInfo?: GraphqlCollectionSegmentInfo
}

export interface GraphqlCollectionSegmentInfo {
    hasNextPage?: boolean,
    hasPreviousPage?: boolean
}