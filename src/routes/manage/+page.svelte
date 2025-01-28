<script lang="ts">
    import { logout } from '$lib/auth';
    import { onMount } from 'svelte';
    import { Grid, html } from 'gridjs';
    import 'gridjs/dist/theme/mermaid.css';
    import { apiRequest } from '$lib/api';
    import { notifications } from '$lib/stores/notifications';
    export let data: { user: { uid: number; name: string; email: string } | null };

    let gridContainer: HTMLElement | null = null;
    let newAppName = '';
    let organization_uid: number | null = null;
    let gridInstance: Grid | null = null;

    let isEditModalOpen = false;
    let isDeleteModalOpen = false;
    let selectedAppId: number | null = null;
    let editAppName = '';
    let deleteAppName = '';

    onMount(() => {
        organization_uid = data.user?.uid ?? null;

        if (organization_uid) {
            loadApplications();
        } else {
            notifications.add('error', "Impossible de récupérer l'UID de l'organisation.");
        }

        window.openEditModal = openEditModal;
        window.openDeleteModal = openDeleteModal;
    });

    async function submitApp(event: Event) {
        event.preventDefault();

        if (!organization_uid) {
            notifications.add('error', "Impossible de soumettre l'application : UID de l'organisation introuvable.");
            return;
        }

        const jwt = getToken();

        try {
            const response = await apiRequest('/application', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
                body: JSON.stringify({
                    name: newAppName,
                    organization_uid,
                }),
            });

            if (response.ok) {
                notifications.add('success', 'Application créée avec succès !');
                newAppName = '';
                await loadApplications();
            } else {
                const errorData = await response.json();
                notifications.add('error', errorData.message || 'Erreur lors de la création de l’application.');
            }
        } catch (err) {
            notifications.add('error', 'Erreur réseau lors de la création de l’application.');
        }
    }

    async function loadApplications() {
        const jwt = getToken();

        try {
            const response = await apiRequest('/application', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });

            if (response.ok) {
                const applications = await response.json();

                if (gridInstance) {
                    gridInstance.destroy();
                }

                gridInstance = new Grid({
                    columns: [
                        'ID de l’application',
                        'Nom de l’application',
                        'Organisation',
                        {
                            name: 'Actions',
                            formatter: (_, row) => html(`
                                <button class="bg-primary text-white px-2 py-1 rounded" onclick="openEditModal(${row.cells[0].data}, '${row.cells[1].data}')">Modifier</button>
                                <button class="bg-red-500 text-white px-2 py-1 rounded" onclick="openDeleteModal(${row.cells[0].data}, '${row.cells[1].data}')">Supprimer</button>
                            `),
                        },
                    ],
                    data: applications.map((app: { name: string; uid: number, organization: string }) => [
                        app.uid,    
                        app.name,
                        app.organization.name,
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
                        noRecordsFound: 'Aucun enregistrement trouvé',
                        error: 'Une erreur est survenue lors du chargement des données',
                    },
                });

                if (gridContainer) {
                    gridInstance.render(gridContainer);
                }
            } else {
                notifications.add('error', 'Erreur lors du chargement des applications.');
            }
        } catch (err) {
            notifications.add('error', 'Erreur réseau lors du chargement des applications.');
        }
    }

    async function saveAppChanges() {
        if (!selectedAppId) return;

        const jwt = getToken();

        try {
            const response = await apiRequest(`/application/${selectedAppId}`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
                body: JSON.stringify({ name: editAppName }),
            });

            if (response.ok) {
                notifications.add('success', 'Application modifiée avec succès !');
                closeEditModal();
                await loadApplications();
            } else {
                const errorData = await response.json();
                notifications.add('error', errorData.message || 'Erreur lors de la modification de l’application.');
            }
        } catch (err) {
            notifications.add('error', 'Erreur réseau lors de la modification de l’application.');
        }
    }

    async function deleteApp() {
        if (!selectedAppId) return;

        const jwt = getToken();

        try {
            const response = await apiRequest(`/application/${selectedAppId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });

            if (response.ok) {
                notifications.add('success', 'Application supprimée avec succès !');
                closeDeleteModal();
                await loadApplications();
            } else {
                const errorData = await response.json();
                notifications.add('error', errorData.message || 'Erreur lors de la suppression de l’application.');
            }
        } catch (err) {
            notifications.add('error', 'Erreur réseau lors de la suppression de l’application.');
        }
    }

    function openEditModal(appId: number, appName: string) {
        selectedAppId = appId;
        editAppName = appName;
        isEditModalOpen = true;
    }

    function closeEditModal() {
        isEditModalOpen = false;
        selectedAppId = null;
        editAppName = '';
    }

    function openDeleteModal(appId: number, appName: string) {
        selectedAppId = appId;
        deleteAppName = appName;
        isDeleteModalOpen = true;
    }

    function closeDeleteModal() {
        isDeleteModalOpen = false;
        selectedAppId = null;
    }

    function getToken() {
        return document.cookie.replace(/(?:(?:^|.*;\s*)jwt\s*=\s*([^;]*).*$)|^.*$/, '$1');
    }
</script>

<svelte:head>
    <title>Mes applications</title>
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
    <h1 class="font-semibold text-2xl mb-5">Mes applications</h1>

    <form class="space-y-4 mb-5" on:submit={submitApp}>
        <input
            required
            type="text"
            bind:value={newAppName}
            placeholder="Nouvelle application"
            class="border p-2 xl:w-1/3 lg:w-1/2 w-full rounded-lg"
        />
        <button type="submit" class="bg-primary px-5 py-2 rounded text-gray-100">Enregistrer</button>
    </form>

    <div bind:this={gridContainer}></div>
</div>

<div class="modal fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50" class:visible={isEditModalOpen}>
    <div class="modal-content bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h2 class="text-lg font-semibold mb-4">Modifier l'application</h2>
        <input
            type="text"
            bind:value={editAppName}
            placeholder="Nom de l'application"
            class="border p-3 rounded-lg w-full mb-4"
        />
        <div class="flex justify-center space-x-3">
            <button on:click={saveAppChanges} class="bg-primary text-white px-4 py-2 rounded">Enregistrer</button>
            <button on:click={closeEditModal} class="bg-gray-200 text-gray-800 px-4 py-2 rounded">Annuler</button>
        </div>
    </div>
</div>

<div class="modal fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50" class:visible={isDeleteModalOpen}>
    <div class="modal-content bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h2 class="text-lg font-semibold mb-4">Supprimer l'application {deleteAppName}</h2>
        <p class="text-gray-700 mb-6">Êtes-vous sûr de vouloir supprimer l'application {deleteAppName} ? Cette action est irréversible.</p>
        <div class="flex justify-center space-x-3">
            <button on:click={deleteApp} class="bg-red-500 text-white px-4 py-2 rounded">Oui</button>
            <button on:click={closeDeleteModal} class="bg-gray-200 text-gray-800 px-4 py-2 rounded">Non</button>
        </div>
    </div>
</div>

<style>
    .modal {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        justify-content: center;
        align-items: center;
    }

    .modal.visible {
        display: flex;
    }

    .modal-content {
        background: white;
        padding: 20px;
        border-radius: 8px;
        text-align: center;
        min-width: 300px;
    }
</style>