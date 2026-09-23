export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export class PaginatedResult<T> {
  data: T[];
  meta: PaginationMeta;

  constructor(data: T[], total: number, page: number, limit: number) {
    this.data = data;
    this.meta = {
      page,
      limit,
      total,
      totalPages: limit > 0 ? Math.ceil(total / limit) : 0,
    };
  }
}
