<script lang="ts">
  import { signatureData } from '$lib/stores/signature.js';
  import { markStepAsCompleted, getNextStep, getPreviousStep } from '$lib/stores/navigation';
  import { goto } from '$app/navigation';

  let formData = {
    name: $signatureData.name || '',
    title: $signatureData.title || '',
    company: $signatureData.company || '',
    department: $signatureData.department || ''
  };

  function updateSignatureData() {
    signatureData.update(data => ({
      ...data,
      ...formData
    }));
  }

  function continueToNextStep() {
    updateSignatureData();
    markStepAsCompleted('personal');
    const nextStep = getNextStep('personal');
    if (nextStep) {
      goto(nextStep.path);
    }
  }

  function goBack() {
    updateSignatureData();
    const previousStep = getPreviousStep('personal');
    if (previousStep) {
      goto(previousStep.path);
    }
  }

  $: isFormValid = formData.name.trim() && formData.title.trim() && formData.company.trim();
</script>

<svelte:head>
  <title>Información Personal - Generador de Firmas</title>
</svelte:head>

<div class="max-w-4xl mx-auto">
  <!-- Header -->
  <div class="text-center mb-8">
    <div class="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl mb-4 shadow-lg shadow-blue-500/25">
      <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
      </svg>
    </div>
    <h1 class="text-3xl font-bold gradient-text mb-2">Información Personal</h1>
    <p class="text-lg text-slate-400">Completa tus datos profesionales básicos</p>
  </div>

  <!-- Formulario -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <!-- Panel de Formulario -->
    <div class="dark-card p-8">
      <h2 class="text-xl font-semibold text-slate-200 mb-6">Datos Básicos</h2>
      
      <div class="space-y-6">
        <!-- Nombre completo -->
        <div>
          <label for="name" class="block text-sm font-medium text-slate-300 mb-2">
            Nombre completo *
          </label>
          <input
            type="text"
            id="name"
            bind:value={formData.name}
            placeholder="Ej: Ana García Martínez"
            class="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <!-- Título profesional -->
        <div>
          <label for="title" class="block text-sm font-medium text-slate-300 mb-2">
            Título o posición *
          </label>
          <input
            type="text"
            id="title"
            bind:value={formData.title}
            placeholder="Ej: Directora de Marketing Digital"
            class="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <!-- Empresa -->
        <div>
          <label for="company" class="block text-sm font-medium text-slate-300 mb-2">
            Empresa u organización *
          </label>
          <input
            type="text"
            id="company"
            bind:value={formData.company}
            placeholder="Ej: Innovación Tecnológica S.L."
            class="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <!-- Departamento (opcional) -->
        <div>
          <label for="department" class="block text-sm font-medium text-slate-300 mb-2">
            Departamento (opcional)
          </label>
          <input
            type="text"
            id="department"
            bind:value={formData.department}
            placeholder="Ej: Marketing y Comunicación"
            class="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>

    <!-- Vista Previa -->
    <div class="dark-card p-8">
      <h2 class="text-xl font-semibold text-slate-200 mb-6">Vista Previa</h2>
      
      <div class="preview-section">
        <div class="bg-white p-6 rounded-lg">
          <div class="space-y-2">
            <h3 class="text-lg font-bold text-gray-900">
              {formData.name || 'Tu nombre aparecerá aquí'}
            </h3>
            <p class="text-blue-600 font-medium">
              {formData.title || 'Tu título profesional'}
            </p>
            <p class="text-gray-600">
              {formData.company || 'Tu empresa'}
              {formData.department ? ` - ${formData.department}` : ''}
            </p>
          </div>
        </div>
        
        <div class="mt-4 text-sm text-slate-400">
          <p>Esta es una vista previa básica. El diseño final dependerá de la plantilla que seleccionaste.</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Botones de navegación -->
  <div class="flex justify-between items-center mt-8 pt-6 border-t border-slate-700">
    <button
      on:click={goBack}
      class="flex items-center px-6 py-3 text-slate-400 hover:text-white transition-colors"
    >
      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
      </svg>
      Volver a Plantillas
    </button>

    <button
      on:click={continueToNextStep}
      disabled={!isFormValid}
      class="flex items-center px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-300"
    >
      Continuar
      <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
      </svg>
    </button>
  </div>
</div>