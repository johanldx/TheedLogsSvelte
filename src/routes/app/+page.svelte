<script lang="ts">
    import { onMount } from 'svelte';
    import { Grid } from 'gridjs';
    import 'gridjs/dist/theme/mermaid.css'; // Styles de Grid.js

    let gridContainer: HTMLElement | null = null;

    // Les données pour le tableau
    const data = [
        ['John', 'Doe', 30],
        ['Jane', 'Smith', 28],
        ['Alice', 'Johnson', 35],
    ];

    onMount(() => {
        if (gridContainer) {
            // Initialisation de Grid.js
            new Grid({
                columns: ['Prénom', 'Nom', 'Âge'],
                data: data,
                pagination: true,
                sort: true,
                search: true,
            }).render(gridContainer);
        }
    });
</script>

<header class="flex justify-between mb-5">
    <div class="flex">
        <a href="/" class="text-2xl font-bold text-green-theed">Logs <span class="text-primary">Theed</span></a>
        <img class="ml-1 w-5 object-contain" src="theed-eyes.png" alt="Theed eyes">
    </div>

    <nav>
        <a class="mr-5" href="account">Mon compte 👤</a>
        <a href="/app" class="bg-red-500 px-5 py-3 rounded text-gray-100">Déconnexion</a>
    </nav>
</header>

<div>
    <div bind:this={gridContainer}></div>
</div>