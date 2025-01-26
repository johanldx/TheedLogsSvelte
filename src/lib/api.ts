export async function apiRequest(path: string, options: RequestInit = {}) {
    const BASE_URL = 'http://localhost:3000'; // Domaine de l'API backend

    return fetch(`${BASE_URL}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {}),
        },
    });
}