export interface Paginate<T> {
  data: T;
  totalCount: number;
}

export interface QueryPaginate {
  page: number;
  limit: number;
}
