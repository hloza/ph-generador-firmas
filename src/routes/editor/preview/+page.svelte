<script lang="ts">
  import { signatureData } from '$lib/stores/signature.js';
  import { markStepAsCompleted, getPreviousStep } from '$lib/stores/navigation';
  import { goto } from '$app/navigation';
  import ExportPanel from '$lib/components/ExportPanel.svelte';
  import SignaturePreview from '$lib/components/SignaturePreview.svelte';

  function goBack() {
    const previousStep = getPreviousStep('preview');
    if (previousStep) {
      goto(previousStep.path);
    }
  }

  // Marcar este paso como completado al cargar
  markStepAsCompleted('preview');
</script>

<svelte:head>
  <title>Revisar y Descargar Firma - Paso 7</title>
  <meta name="description" content="Revisa tu firma y descárgala en diferentes formatos" />
</svelte:head>

<div class="section-header">
  <h2 class="text-2xl font-bold text-gray-900">✅ Revisar y Descargar Firma</h2>
</div>

<div class="section-content">
  <div class="max-w-4xl mx-auto">
    <!-- Panel de Exportación -->
    <div class="space-y-4">
      <ExportPanel />
      
      <!-- Botón para volver -->
      <div class="flex justify-center pt-4">
        <button
          class="btn-secondary flex items-center gap-2"
          on:click={goBack}
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
          Volver al paso anterior
        </button>
      </div>
    </div>
  </div>
</div>