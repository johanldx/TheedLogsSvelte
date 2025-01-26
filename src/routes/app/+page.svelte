<script lang="ts">
    import { logout } from '$lib/auth';
    import { onMount } from 'svelte';
    import { Grid, html } from 'gridjs';
    import 'gridjs/dist/theme/mermaid.css';
    import { apiRequest } from '$lib/api';
    import { notifications } from '$lib/stores/notifications';

    let gridContainer: HTMLElement | null = null;
    let applications: { uid: number; name: string }[] = [];
    let selectedAppId: number | null = null;
    let gridInstance: Grid | null = null;

    onMount(async () => {
        await loadApplications();
    });

    async function loadApplications() {
        try {
            const jwt = getToken();
            const response = await apiRequest('/application', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });

            if (response.ok) {
                applications = await response.json();
            } else {
                notifications.add('error', 'Erreur lors du chargement des applications.');
            }
        } catch (err) {
            notifications.add('error', 'Erreur réseau lors du chargement des applications.');
        }
    }

    async function loadLogs() {
        if (!selectedAppId) return;

        try {
            const jwt = getToken();
            const response = await apiRequest(`/log/application/${selectedAppId}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });

            if (response.ok) {
                const logs = await response.json();
                displayLogs(logs);
            } else {
                notifications.add('error', 'Erreur lors du chargement des logs.');
            }
        } catch (err) {
            console.log(err);
            notifications.add('error', 'Erreur réseau lors du chargement des logs.');
        }
    }

    function displayLogs(logs: any[]) {
        const formattedLogs = logs
            .sort((a, b) => b.uid - a.uid)    
            .map(log => {
                const dateTime = new Date(log.timestamp).toLocaleString('fr-FR', {
                    dateStyle: 'short',
                    timeStyle: 'medium',
            });

            return {
                uid: log.uid,
                service: log.service,
                dateTime,
                level: log.level,
                message: log.message,
                application: `${log.application.name} (${log.application.uid})`,
            };
        });

        if (gridInstance) {
            gridInstance.destroy();
        }

        gridInstance = new Grid({
            columns: [
                'ID du Log',
                'Service',
                'Date',
                'Level',
                'Message',
            ],
            data: formattedLogs.map(log => [
                log.uid,
                log.service,
                log.dateTime,
                log.level,
                log.message,
            ]),
            pagination: true,
            sort: true,
            search: true,
            language: {
                search: {
                    placeholder: 'Rechercher...',
                },
                pagination: {
                    previous: 'Précédent',
                    next: 'Suivant',
                    showing: 'Affichage de',
                    results: () => 'résultats',
                    to: 'à',
                    of: 'sur'
                },
                noRecordsFound: 'Aucun log trouvé',
                error: 'Une erreur est survenue lors du chargement des données',
            },
        });

        if (gridContainer) {
            gridInstance.render(gridContainer);
        }
    }

    function getToken() {
        return document.cookie.replace(/(?:(?:^|.*;\s*)jwt\s*=\s*([^;]*).*$)|^.*$/, '$1');
    }

    function onApplicationChange(event: Event) {
        const selectElement = event.target as HTMLSelectElement;
        selectedAppId = selectElement.value ? parseInt(selectElement.value) : null;

        if (selectedAppId) {
            loadLogs();
        }
    }
</script>

<svelte:head>
    <title>Mes logs</title>
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

<div>
    <h1 class="font-semibold text-2xl mb-5">Mes logs</h1>
    
    <select
        id="selection"
        name="option"
        class="h-10 border p-2 xl:w-1/3 lg:w-1/2 w-full rounded-lg mb-4"
        on:change={onApplicationChange}
    >
        <option selected disabled value="">Sélectionner une application</option>
        {#each applications as app}
            <option value={app.uid}>{app.name}</option>
        {/each}
    </select>

    <div bind:this={gridContainer}></div>
</div>