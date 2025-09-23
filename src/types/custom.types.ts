
export type TSortOption = {
    [key: string]: 'ascending' | 'descending',
}

export type TPagination = {
    currentPage: number,
    pageSize: number,
    totalData: number,
    totalPages: number,
}

export type TApiErrorResponse = {
    success: boolean,
    message: string,
    statusCode: number,
}

export type TApiSuccessResponse<T = any | null> = {
    success: boolean,
    message: string,
    data: T,
    meta?: TPagination,
    statusCode: number,
}

export interface ICustomError extends Error {
    response: {
        data: TApiErrorResponse,
    }
}