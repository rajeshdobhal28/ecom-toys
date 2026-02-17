export type ApiEndpoint = { url: string; method: string };

export type APIConfig = {
    [key: string]: ApiEndpoint
}

export const makeApiRequest = async (api: ApiEndpoint, data: Record<string, any>) => {
    const options: RequestInit = {
        method: api.method,
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    };

    if (api.method !== 'GET') {
        options.body = JSON.stringify(data);
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}${api.url}`, options);
    return response.json();
}

export const API: APIConfig = {
    GOOGLE_LOGIN: { url: '/api/auth/google', method: 'POST' },
    ME: { url: '/api/auth/me', method: 'GET' },
    LOGOUT: { url: '/api/auth/logout', method: 'POST' },
    GET_PRODUCTS: { url: '/api/products', method: 'GET' },
    GET_ORDERS: { url: '/api/orders', method: 'GET' },
}