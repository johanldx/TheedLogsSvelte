export async function login(email: string, password: string): Promise<void> {
    const response = await fetch('https://votre-api.com/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
        const { token } = await response.json();
        document.cookie = `jwt=${token}; path=/; HttpOnly`;
    } else {
        throw new Error('Échec de la connexion');
    }
}

export function logout(): void {
    document.cookie = 'jwt=; Max-Age=0; path=/';
    window.location.href = '/';
}
