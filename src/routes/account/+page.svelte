<script lang="ts">
    import { onMount } from 'svelte';
    import { logout } from '$lib/auth';
    import { notifications } from '$lib/stores/notifications';
    import { apiRequest } from '$lib/api'; // Importation de la fonction API

    let user = {
        name: '',
        email: '',
        notification: '',
    };

    let oldPassword = '';
    let newPassword = '';
    let jwt = ''; // Stocke le token JWT de l'utilisateur

    // Charger les données utilisateur au chargement de la page
    onMount(async () => {
        try {
            jwt = document.cookie.replace(
                /(?:(?:^|.*;\s*)jwt\s*=\s*([^;]*).*$)|^.*$/,
                '$1'
            ); // Récupère le token JWT depuis les cookies

            const response = await apiRequest('/auth/me', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${jwt}`, // Ajoute le token JWT aux en-têtes
                },
            });

            if (response.ok) {
                user = await response.json();
            } else {
                notifications.add('error', 'Impossible de charger les données utilisateur.');
            }
        } catch (err) {
            notifications.add('error', 'Erreur lors du chargement des données utilisateur.');
        }
    });

    // Modifier les informations utilisateur
    async function updateAccount() {
        try {
            const response = await apiRequest('/auth/me', {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${jwt}`, // Ajoute le token JWT aux en-têtes
                },
                body: JSON.stringify({
                    name: user.name,
                    email: user.email,
                    notification: user.notification,
                }),
            });

            if (response.ok) {
                const data = await response.json();

                // Met à jour le token JWT si nécessaire
                if (data.token) {
                    jwt = data.token;
                    document.cookie = `jwt=${jwt}; path=/; SameSite=Strict`; // Met à jour le cookie JWT
                }

                notifications.add('success', 'Compte mis à jour avec succès.');
            } else {
                const errorData = await response.json();
                notifications.add('error', errorData.message || 'Erreur lors de la mise à jour du compte.');
            }
        } catch (err) {
            notifications.add('error', 'Erreur réseau lors de la mise à jour du compte.');
        }
    }

    // Changer le mot de passe
    async function changePassword() {
        try {
            const response = await apiRequest('/auth/change-password', {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${jwt}`, // Ajoute le token JWT aux en-têtes
                },
                body: JSON.stringify({
                    oldPassword,
                    newPassword,
                }),
            });

            if (response.ok) {
                notifications.add('success', 'Mot de passe modifié avec succès.');
                oldPassword = '';
                newPassword = '';
                logout();
            } else {
                const errorData = await response.json();
                notifications.add('error', errorData.message || 'Erreur lors du changement de mot de passe.');
            }
        } catch (err) {
            notifications.add('error', 'Erreur réseau lors du changement de mot de passe.');
        }
    }
</script>

<svelte:head>
    <title>Mon compte</title>
</svelte:head>

<header class="flex justify-between items-center mb-5">
    <div class="flex items-center">
        <a href="/" class="text-2xl font-bold text-green-theed">Logs <span class="text-primary">Theed</span></a>
        <img class="ml-1 w-5 h-5 object-contain" src="theed-eyes.png" alt="Theed eyes">
    </div>

    <nav>
        <a class="mr-5" href="app">Mes logs 📋</a>
        <a class="mr-5" href="manage">Mes applications ✒️</a>
        <a class="mr-5" href="account">Mon compte 👤</a>
        <button on:click={logout} class="bg-red-500 px-5 py-3 rounded text-gray-100">Déconnexion</button>
    </nav>
</header>

<div class="text-center">
    <h1 class="font-semibold text-2xl mb-5">Mon compte</h1>

    <!-- Formulaire de mise à jour du compte -->
    <form class="space-y-4" on:submit|preventDefault={updateAccount}>
        <input
            required
            type="text"
            bind:value={user.name}
            placeholder="Nom"
            class="border p-2 xl:w-1/3 lg:w-1/2 w-full rounded-lg"
        /> <br>
        <input
            required
            type="email"
            bind:value={user.email}
            placeholder="Email"
            class="border p-2 xl:w-1/3 lg:w-1/2 w-full rounded-lg"
        /> <br>
        <select
            id="selection"
            name="option"
            bind:value={user.notification}
            class="h-10 border p-2 xl:w-1/3 lg:w-1/2 w-full rounded-lg"
        >
            <option value="">Pas de notifications</option>
            <option value="DEBUG">DEBUG</option>
            <option value="INFO">INFO</option>
            <option value="WARN">WARN</option>
            <option value="ERROR">ERROR</option>
            <option value="FATAL">FATAL</option>
        </select> <br>
        <button type="submit" class="bg-primary px-5 py-2 rounded text-gray-100">Enregistrer</button>
    </form>

    <h2 class="font-semibold text-xl mt-10 mb-5">Changer de mot de passe</h2>

    <!-- Formulaire de changement de mot de passe -->
    <form class="space-y-4" on:submit|preventDefault={changePassword}>
        <input
            required
            type="password"
            bind:value={oldPassword}
            placeholder="Ancien mot de passe"
            class="border p-2 xl:w-1/3 lg:w-1/2 w-full rounded-lg"
        /> <br>
        <input
            required
            type="password"
            bind:value={newPassword}
            placeholder="Nouveau mot de passe"
            class="border p-2 xl:w-1/3 lg:w-1/2 w-full rounded-lg"
        /> <br>
        <button type="submit" class="bg-primary px-5 py-2 rounded text-gray-100">Enregistrer</button>
    </form>
</div>
