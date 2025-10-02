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

  // Reactividad automática - actualiza el store cada vez que cambian los datos del formulario
  $: signatureData.update(data => ({
    ...data,
    ...formData
  }));

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
  
  // Marcar paso como completado cuando el formulario sea válido
  $: if (isFormValid) {
    markStepAsCompleted('personal');
  }
</script>

<svelte:head>
  <title>Información Personal - Generador de Firmas</title>
</svelte:head>

<div class="max-w-4xl mx-auto">
  <!-- Header -->
  <div class="text-center mb-8">
    <div class="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl mb-4 shadow-lg">
      <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
      </svg>
    </div>
    <h1 class="text-3xl font-bold text-gray-800 mb-2">Información Personal</h1>
    <p class="text-lg text-gray-600">Completa tus datos profesionales básicos</p>
  </div>

  <!-- Formulario -->
  <div class="max-w-2xl mx-auto">
    <!-- Panel de Formulario -->
    <div class="bg-white text-gray-800 p-8 rounded-lg border border-gray-300 shadow-lg">
      <h2 class="text-xl font-semibold text-gray-800 mb-6">Datos Básicos</h2>
      
      <div class="space-y-6">
        <!-- Nombre completo -->
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
            Nombre completo *
          </label>
          <input
            type="text"
            id="name"
            bind:value={formData.name}
            placeholder="Ej: Ana García Martínez"
            class="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <!-- Título profesional -->
        <div>
          <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
            Título o posición *
          </label>
          <input
            type="text"
            id="title"
            bind:value={formData.title}
            placeholder="Ej: Directora de Marketing Digital"
            class="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <!-- Empresa -->
        <div>
          <label for="company" class="block text-sm font-medium text-gray-700 mb-2">
            Empresa u organización *
          </label>
          <input
            type="text"
            id="company"
            bind:value={formData.company}
            placeholder="Ej: Innovación Tecnológica S.L."
            class="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <!-- Departamento (opcional) -->
        <div>
          <label for="department" class="block text-sm font-medium text-gray-700 mb-2">
            Departamento (opcional)
          </label>
          <input
            type="text"
            id="department"
            bind:value={formData.department}
            placeholder="Ej: Marketing y Comunicación"
            class="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  </div>

  <!-- Botones de navegación -->
  <div class="flex justify-between items-center mt-8 pt-6 border-t border-gray-300 max-w-2xl mx-auto">
    <button
      on:click={goBack}
      class="flex items-center px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
    >
      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
      </svg>
      Volver a Plantillas
    </button>

    <button
      on:click={continueToNextStep}
      disabled={!isFormValid}
      class="flex items-center px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-300"
    >
      Continuar
      <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
      </svg>
    </button>
  </div>
</div>