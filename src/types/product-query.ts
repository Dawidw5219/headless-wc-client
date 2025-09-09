export type HWCProductQuery = {
  search?: string;
  category?: string;
  page?: number;
  perPage?: number;
  sort?: string;
  order?: "asc" | "desc";
};
