declare global {
	namespace App {
		interface Locals {
			user: {
				uid: number;
				name: string;
				email: string;
				notification: string;
				active: boolean;
				administrator: boolean;
			} | null; // `null` si l'utilisateur n'est pas connecté
		}
	}
}

export {};
