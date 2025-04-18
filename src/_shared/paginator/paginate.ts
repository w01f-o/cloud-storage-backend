export interface PaginatedResult<T> {
  list: T[];
  meta: {
    total: number;
    lastPage: number;
    currentPage: number;
    perPage: number;
    prev: number | null;
    next: number | null;
  };
}

type ModelArgs = {
  where?: unknown;
  orderBy?: unknown;
  include?: unknown;
  select?: unknown;
};

export type PaginateOptions = {
  page?: number | string;
  perPage?: number | string;
};
export type PaginateFunction = <TList, TArgs extends ModelArgs>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  model: any,
  args?: TArgs,
  options?: PaginateOptions
) => Promise<PaginatedResult<TList>>;

export const paginator = (
  defaultOptions: PaginateOptions
): PaginateFunction => {
  return async <TList, TArgs extends ModelArgs>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    model: any,
    args: TArgs = {} as TArgs,
    options: PaginateOptions
  ): Promise<PaginatedResult<TList>> => {
    const page = Number(options?.page || defaultOptions?.page) || 1;
    const perPage = Number(options?.perPage || defaultOptions?.perPage) || 10;

    const skip = page > 0 ? perPage * (page - 1) : 0;

    const [total, list] = await Promise.all([
      model.count({ where: args.where }),
      model.findMany({
        ...args,
        take: perPage,
        skip,
      }),
    ]);

    const lastPage = Math.ceil(total / perPage);

    return {
      list,
      meta: {
        total,
        lastPage,
        currentPage: page,
        perPage,
        prev: page > 1 ? page - 1 : null,
        next: page < lastPage ? page + 1 : null,
      },
    };
  };
};

export const defaultPaginator = paginator({
  page: 1,
  perPage: 30,
});
