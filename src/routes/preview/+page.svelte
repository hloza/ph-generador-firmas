<script lang="ts">
  import SignaturePreview from '$lib/components/SignaturePreview.svelte';
</script>

<svelte:head>
  <title>Vista Previa de Firma</title>
  <meta name="description" content="Vista previa de tu firma de correo electrónico" />
</svelte:head>

<div class="section-header">
  <h2 class="text-2xl font-bold text-gray-900">Vista Previa</h2>
  <p class="text-gray-600 mt-2">Visualiza cómo se verá tu firma en diferentes dispositivos</p>
</div>

<div class="section-content">
  <SignaturePreview />
</div>