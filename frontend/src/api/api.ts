export type ApiEndpoint = { url: string; method: string };

export type APIConfig = {
  [key: string]: ApiEndpoint;
};

export const makeApiRequest = async (
  api: ApiEndpoint,
  data: Record<string, any>
) => {
  const options: RequestInit = {
    method: api.method,
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  };

  let url = `${process.env.NEXT_PUBLIC_BASE_URL}${api.url}`;

  if (api.method !== 'GET') {
    options.body = JSON.stringify(data);
  } else if (data && Object.keys(data).length > 0) {
    const params = new URLSearchParams(data as any);
    url += `?${params.toString()}`;
  }

  const response = await fetch(url, options);

  // If we receive a 401, globally redirect to login, EXCEPT for the /auth/me check 
  // which is expected to return 401 when a guest visits public pages.
  if (response.status === 401 && api.url !== API.ME.url) {
    if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }

  return response.json();
};

export const API: APIConfig = {
  GOOGLE_LOGIN: { url: '/api/auth/google', method: 'POST' },
  ME: { url: '/api/auth/me', method: 'GET' },
  LOGOUT: { url: '/api/auth/logout', method: 'POST' },
  GET_PRODUCTS: { url: '/api/products', method: 'GET' },
  GET_TRENDING_PRODUCTS: { url: '/api/products/trending', method: 'GET' },
  GET_ORDERS: { url: '/api/orders', method: 'GET' },
  CREATE_ORDER: { url: '/api/orders', method: 'POST' },
  GET_CART: { url: '/api/cart', method: 'GET' },
  UPDATE_CART: { url: '/api/cart', method: 'PUT' },
  GET_PRODUCT_REVIEWS: { url: '/api/reviews/product', method: 'GET' }, // Append ID manually
  GET_USER_REVIEWS: { url: '/api/reviews/user', method: 'GET' },
  UPSERT_REVIEW: { url: '/api/reviews', method: 'POST' },
  GET_ADDRESSES: { url: '/api/addresses', method: 'GET' },
  ADD_ADDRESS: { url: '/api/addresses', method: 'POST' },
  UPDATE_ADDRESS: { url: '/api/addresses', method: 'PUT' },
  DELETE_ADDRESS: { url: '/api/addresses', method: 'DELETE' },
  SET_DEFAULT_ADDRESS: { url: '/api/addresses', method: 'PUT' }, // append id/default
  SUBMIT_CONTACT: { url: '/api/contact', method: 'POST' },
};
