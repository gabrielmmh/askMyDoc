const API_URL = process.env.NEXT_PUBLIC_API_URL;

export class ApiError extends Error {
    constructor(
        public status: number,
        message: string
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

interface FetchOptions extends RequestInit {
    signal?: AbortSignal;
}

export const api = {
    async fetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
        const res = await fetch(`${API_URL}${path}`, {
            credentials: 'include',
            ...options,
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new ApiError(res.status, errorText || `HTTP ${res.status}`);
        }

        return res.json();
    },

    async post<T>(path: string, data?: unknown, options: FetchOptions = {}): Promise<T> {
        return this.fetch<T>(path, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            body: data ? JSON.stringify(data) : undefined,
            ...options,
        });
    },

    async postForm<T>(path: string, formData: FormData, options: FetchOptions = {}): Promise<T> {
        return this.fetch<T>(path, {
            method: 'POST',
            body: formData,
            ...options,
        });
    },

    async delete<T>(path: string, options: FetchOptions = {}): Promise<T> {
        return this.fetch<T>(path, {
            method: 'DELETE',
            ...options,
        });
    },

    async get<T>(path: string, options: FetchOptions = {}): Promise<T> {
        return this.fetch<T>(path, {
            method: 'GET',
            ...options,
        });
    },
};

export default api;
