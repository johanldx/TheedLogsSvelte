import { setUser, clearUser } from './stores/auth';

export async function login(email: string, password: string): Promise<void> {
    const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        throw new Error("L'utilisateur ou le mot de passe est incorrect !");
    }

    const { token } = await response.json();
    document.cookie = `jwt=${token}; path=/; SameSite=Strict`; // Stocke uniquement le token
    setUser(null); // L'utilisateur sera récupéré via le handle
}

export function logout(): void {
    document.cookie = 'jwt=; Max-Age=0; path=/; SameSite=Strict'; // Supprime le cookie
    clearUser(); // Réinitialise l'état utilisateur
    window.location.href = '/login'; // Redirige vers la page de connexion
}
