import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
    const token = event.cookies.get('jwt');
    const protectedRoutes = ['']; //['/app', '/account'];

    if (protectedRoutes.includes(event.url.pathname) && !token) {
        const loginUrl = `${event.url.origin}/login`;
        return Response.redirect(loginUrl, 303);
    }

    return resolve(event);
};
