import { writable } from 'svelte/store';

export const isAuthenticated = writable(false);
export const user = writable(null);

export function setUser(data: any) {
    isAuthenticated.set(!!data);
    user.set(data);
}

export function clearUser() {
    isAuthenticated.set(false);
    user.set(null);
}
