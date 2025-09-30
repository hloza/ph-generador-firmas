<script lang="ts">
  import { toastMessages } from '$lib/stores/signature.js';
  import { fade, fly } from 'svelte/transition';

  function getIconForType(type: string) {
    switch (type) {
      case 'success':
        return `
          <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        `;
      case 'error':
        return `
          <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        `;
      case 'info':
      default:
        return `
          <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        `;
    }
  }

  function getColorClassesForType(type: string) {
    switch (type) {
      case 'success':
        return 'border-green-200 bg-green-50 text-green-800';
      case 'error':
        return 'border-red-200 bg-red-50 text-red-800';
      case 'info':
      default:
        return 'border-blue-200 bg-blue-50 text-blue-800';
    }
  }

  function removeToast(id: string) {
    toastMessages.update(messages => messages.filter(m => m.id !== id));
  }
</script>

{#if $toastMessages.length > 0}
  <div class="fixed top-4 right-4 z-50 space-y-2" role="region" aria-label="Notificaciones">
    {#each $toastMessages as toast (toast.id)}
      <div
        class="flex items-center p-4 rounded-lg border shadow-lg max-w-sm {getColorClassesForType(toast.type)}"
        transition:fly="{{ x: 300, duration: 300 }}"
        role="alert"
        aria-live="polite"
      >
        <div class="flex-shrink-0">
          {@html getIconForType(toast.type)}
        </div>
        
        <div class="ml-3 flex-1">
          <p class="text-sm font-medium">
            {toast.message}
          </p>
        </div>
        
        <button
          class="ml-4 inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition-colors duration-200"
          on:click={() => removeToast(toast.id)}
          aria-label="Cerrar notificación"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    {/each}
  </div>
{/if}