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
  <p class="text-gray-600 mt-2">Tu firma está lista. Elige cómo quieres exportarla:</p>
</div>

<div class="section-content">
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <!-- Panel de Exportación -->
    <div class="space-y-6">
      <ExportPanel />
      
      <!-- Botón para volver -->
      <div class="flex justify-center">
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
    
    <!-- Vista Previa Final -->
    <div class="space-y-6">
      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
          </svg>
          Vista Previa Final
        </h3>
        <div class="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <SignaturePreview />
        </div>
      </div>
    </div>
  </div>
</div>