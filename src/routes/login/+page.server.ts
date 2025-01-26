import { redirect } from '@sveltejs/kit';

export const load = ({ locals }: { locals: { user?: any } }) => {
    if (locals.user) {
        throw redirect(302, '/app'); // Redirige vers /app si déjà connecté
    }
};
