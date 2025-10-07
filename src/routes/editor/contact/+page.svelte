<script lang="ts">
  import { signatureData } from '$lib/stores/signature.js';
  import { markStepAsCompleted, getNextStep, getPreviousStep } from '$lib/stores/navigation';
  import { goto } from '$app/navigation';

  let formData = {
    email: $signatureData.email || '',
    phone: $signatureData.phone || '',
    website: $signatureData.website || '',
    address: $signatureData.address || ''
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
    markStepAsCompleted('contact');
    const nextStep = getNextStep('contact');
    if (nextStep) {
      goto(nextStep.path);
    }
  }

  function goBack() {
    updateSignatureData();
    const previousStep = getPreviousStep('contact');
    if (previousStep) {
      goto(previousStep.path);
    }
  }

  $: isFormValid = formData.email.trim();
  
  // Marcar paso como completado cuando el formulario sea válido
  $: if (isFormValid) {
    markStepAsCompleted('contact');
  }
</script>

<svelte:head>
  <title>Información de Contacto - Generador de Firmas</title>
</svelte:head>

<div class="max-w-4xl mx-auto">

  <!-- Formulario -->
  <div class="max-w-2xl mx-auto">
    <!-- Panel de Formulario -->
    <div class="bg-white text-gray-800 p-8 rounded-lg border border-gray-300 shadow-lg">
      <h2 class="text-xl font-semibold text-gray-800 mb-6">Datos de Contacto</h2>
      
      <div class="space-y-6">
        <!-- Email -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
            Email profesional *
          </label>
          <input
            type="email"
            id="email"
            bind:value={formData.email}
            placeholder="ana.garcia@empresa.com"
            class="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            required
          />
        </div>

        <!-- Teléfono -->
        <div>
          <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">
            Teléfono
          </label>
          <input
            type="tel"
            id="phone"
            bind:value={formData.phone}
            placeholder="+34 691 234 567"
            class="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>

        <!-- Sitio web -->
        <div>
          <label for="website" class="block text-sm font-medium text-gray-700 mb-2">
            Sitio web
          </label>
          <input
            type="url"
            id="website"
            bind:value={formData.website}
            placeholder="www.empresa.com"
            class="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>

        <!-- Dirección -->
        <div>
          <label for="address" class="block text-sm font-medium text-gray-700 mb-2">
            Dirección
          </label>
          <textarea
            id="address"
            bind:value={formData.address}
            placeholder="Madrid, España"
            rows="3"
            class="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
          ></textarea>
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
      Información Personal
    </button>

    <button
      on:click={continueToNextStep}
      disabled={!isFormValid}
      class="flex items-center px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-300"
    >
      Continuar
      <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
      </svg>
    </button>
  </div>
</div>