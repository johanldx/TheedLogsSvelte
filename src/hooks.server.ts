import type { Handle } from '@sveltejs/kit';
import { apiRequest } from '$lib/api';

const PROTECTED_ROUTES = ['/app', '/account', '/documentation', '/manage'];

export const handle: Handle = async ({ event, resolve }) => {
    const token = event.cookies.get('jwt');

    if (token) {
        try {
            const response = await apiRequest('/auth/me', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                event.locals.user = await response.json(); // Stocke les infos utilisateur
            } else {
                event.locals.user = null;
                event.cookies.delete('jwt', { path: '/' }); // Supprime le token si invalide
            }
        } catch {
            event.locals.user = null;
            event.cookies.delete('jwt', { path: '/' }); // Supprime le token en cas d'erreur
        }
    } else {
        event.locals.user = null;
    }

    // Utilise une URL absolue pour les redirections
    const origin = event.url.origin;

    if (PROTECTED_ROUTES.includes(event.url.pathname) && !event.locals.user) {
        return Response.redirect(`${origin}/login`, 303); // Redirige vers /login
    }

    if (event.url.pathname === '/login' && event.locals.user) {
        return Response.redirect(`${origin}/app`, 303); // Redirige vers /app
    }

    return resolve(event);
};
