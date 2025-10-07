<script lang="ts">
  import ExportPanel from '$lib/components/ExportPanel.svelte';
  import SignaturePreview from '$lib/components/SignaturePreview.svelte';
</script>

<svelte:head>
  <title>Exportar Firma - Descarga tu firma</title>
  <meta name="description" content="Exporta tu firma de correo electrónico en diferentes formatos" />
</svelte:head>

<div class="section-header">
  <h2 class="text-2xl font-bold text-gray-900">Exportar Firma</h2>
  <p class="text-gray-600 mt-2">Descarga tu firma en el formato que prefieras</p>
</div>

<div class="section-content">
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <!-- Panel de Exportación -->
    <div class="space-y-6">
      <ExportPanel />
    </div>
    
    <!-- Vista Previa Final -->
    <div class="space-y-6">
      <div class="bg-gray-50 rounded-xl p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Vista Previa Final</h3>
        <SignaturePreview />
      </div>
    </div>
  </div>
</div>