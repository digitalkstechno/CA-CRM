const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

function getCookie(name: string): string | null {
  if (typeof window === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

function getToken(): string | null {
  return getCookie('vault_token');
}

async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || 'API request failed');
  }

  return response.json();
}

export const api = {
  get: (endpoint: string) => fetchApi(endpoint),
  post: (endpoint: string, body: unknown, isFormData = false) => {
    if (isFormData) {
      return fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        body: body as FormData,
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      }).then(res => {
        if (!res.ok) {
          return res.json().then(err => { throw new Error(err.message || 'API request failed'); });
        }
        return res.json();
      });
    }
    return fetchApi(endpoint, { 
      method: 'POST', 
      body: JSON.stringify(body)
    });
  },
  put: (endpoint: string, body: unknown, isFormData = false) => {
    if (isFormData) {
      return fetch(`${API_URL}${endpoint}`, {
        method: 'PUT',
        body: body as FormData,
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      }).then(res => {
        if (!res.ok) {
          return res.json().then(err => { throw new Error(err.message || 'API request failed'); });
        }
        return res.json();
      });
    }
    return fetchApi(endpoint, { method: 'PUT', body: JSON.stringify(body) });
  },
  delete: (endpoint: string) => fetchApi(endpoint, { method: 'DELETE' }),
};