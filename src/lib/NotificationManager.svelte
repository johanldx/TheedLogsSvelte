<script lang="ts">
    import { notifications } from '$lib/stores/notifications';
    import type { Notification } from '$lib/stores/notifications';

    export let position: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right' = 'bottom-right';

    const positionClasses = {
        'bottom-left': 'bottom-5 left-5',
        'bottom-right': 'bottom-5 right-5',
        'top-left': 'top-5 left-5',
        'top-right': 'top-5 right-5',
    };
</script>

<div class="fixed z-50 space-y-3 {positionClasses[position]}">
    {#each $notifications as { id, type, message }}
        <div
            class="text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-3"
            class:bg-green-500={type === 'success'}
            class:bg-yellow-500={type === 'warning'}
            class:bg-red-500={type === 'error'}
        >
            <!-- Icône selon le type -->
            {#if type === 'success'}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                </svg>
            {:else if type === 'warning'}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                </svg>        
            {:else if type === 'error'}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                </svg>
            {/if}

            <span>{message}</span>
        </div>
    {/each}
</div>
