import { redirect } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';

export const load = ({ locals }: Pick<RequestEvent, 'locals'>) => {
    if (!locals.user) {
        throw redirect(302, '/login'); // Redirige si l'utilisateur n'est pas connecté
    }

    return {
        user: locals.user, // Passe les infos utilisateur à la page
    };
};