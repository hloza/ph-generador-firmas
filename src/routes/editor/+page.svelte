<script lang="ts">
  import EditorPanel from '$lib/components/EditorPanel.svelte';
  import Preview from '$lib/components/Preview.svelte';
</script>

<svelte:head>
  <title>Editor de Firmas - Personaliza tu firma</title>
  <meta name="description" content="Personaliza tu firma de correo electrónico con nuestro editor visual" />
</svelte:head>

<div class="p-6 min-h-screen">
  <div class="max-w-7xl mx-auto">
    <!-- Header mejorado -->
    <div class="dark-card p-8 mb-6 text-center">
      <div class="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl mb-4 shadow-lg shadow-blue-500/25">
        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
        </svg>
      </div>
      <h1 class="text-3xl font-bold gradient-text mb-2">Editor de Firmas</h1>
      <p class="text-lg text-slate-400">Personaliza tu información y ve una vista previa en tiempo real</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Panel de Edición -->
      <div class="space-y-6">
        <EditorPanel />
      </div>
      
      <!-- Vista Previa -->
      <div class="space-y-6">
        <Preview />
      </div>
    </div>
  </div>
</div>