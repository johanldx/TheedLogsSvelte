<script lang="ts">
    import { notifications } from '$lib/stores/notifications';
    import { login } from '$lib/auth';

    let email = '';
    let password = '';

    async function handleSubmit() {
        try {
            await login(email, password);

            notifications.add('success', 'Connexion réussie !');
            window.location.href = '/app';
        } catch (err) {
            notifications.add('error', err instanceof Error ? err.message : 'Une erreur inconnue est survenue.');
            password = '';
        }
    }
</script>

<svelte:head>
    <title>Connexion</title>
</svelte:head>

<div class="text-center">
    <a href="/"><img class="m-auto w-10 object-contain mb-5" src="theed-eyes.png" alt="Theed Eyes"></a>
    <h1 class="font-semibold text-2xl mb-5">Se connecter</h1>

    <form on:submit|preventDefault={handleSubmit} class="space-y-4">
        <input required type="email" bind:value={email} placeholder="Email" class="border p-2 xl:w-1/3 lg:w-1/2 w-full rounded-lg" /> <br>
        <input required type="password" bind:value={password} placeholder="Mot de passe" class="border p-2 xl:w-1/3 lg:w-1/2 w-full rounded-lg" /> <br>
        <button type="submit" class="bg-primary px-5 py-2 rounded text-gray-100">Se connecter</button>
    </form>
</div>
