<script lang="ts">
	import '../app.css';
	import NotificationManager from '$lib/NotificationManager.svelte';
	import { page } from '$app/stores';
	
	let { children } = $props();
</script>

{#if $page.url.pathname === '/'}
	<div class="bg-primary text-white w-full fixed top-0 left-0 z-50 px-4 py-3">
		<p class="text-center text-sm font-medium">✨ Tarif spécial pour les étudiants de l'ESGI : 4,99€ /mois </p>
	</div>
	<div class="pt-[2rem]">
		{@render children()}
	</div>
{:else}
	<div>
		{@render children()}
	</div>
{/if}

<NotificationManager position="bottom-left" />