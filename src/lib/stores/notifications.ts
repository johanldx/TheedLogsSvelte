import { writable } from 'svelte/store';

export type NotificationType = 'success' | 'warning' | 'error';

export interface Notification {
    id: number;
    type: NotificationType;
    message: string;
}

function createNotificationStore() {
    const { subscribe, update } = writable<Notification[]>([]);

    function add(type: NotificationType, message: string, duration = 3000) {
        const id = Date.now(); // Génère un ID unique basé sur la date
        update((notifications) => [...notifications, { id, type, message }]);

        // Supprime automatiquement la notification après la durée spécifiée
        setTimeout(() => {
            remove(id);
        }, duration);
    }

    function remove(id: number) {
        update((notifications) => notifications.filter((n) => n.id !== id));
    }

    return {
        subscribe,
        add,
        remove,
    };
}

export const notifications = createNotificationStore();
