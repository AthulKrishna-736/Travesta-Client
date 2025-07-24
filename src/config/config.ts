
export const env = {
    SERVER_URL: import.meta.env.VITE_BASE_URL,
    SOCKET_URL: import.meta.env.VITE_SOCKET_URL,
    GOOGLE_ID: import.meta.env.VITE_CLIENT_ID,
    STRIPE_SECRET: import.meta.env.VITE_STRIPE_SECRET,
}

export enum HttpStatusCode {
    OK = 200,
    CREATED = 201,
    NO_CONTENT = 204,

    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    CONFLICT = 409,
    TOO_MANY_REQUESTS = 429,

    INTERNAL_SERVER_ERROR = 500,
    NOT_IMPLEMENTED = 501,
    SERVICE_UNAVAILABLE = 503,
}
