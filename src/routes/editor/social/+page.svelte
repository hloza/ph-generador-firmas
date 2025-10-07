<script lang="ts">
  import { signatureData } from '$lib/stores/signature.js';
  import { markStepAsCompleted, getNextStep, getPreviousStep } from '$lib/stores/navigation';
  import { goto } from '$app/navigation';

  let formData = {
    linkedin: $signatureData.linkedin || '',
    twitter: $signatureData.twitter || '',
    github: $signatureData.github || '',
    instagram: $signatureData.instagram || '',
    facebook: $signatureData.facebook || '',
    youtube: $signatureData.youtube || ''
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
    markStepAsCompleted('social');
    const nextStep = getNextStep('social');
    if (nextStep) {
      goto(nextStep.path);
    }
  }

  function goBack() {
    updateSignatureData();
    const previousStep = getPreviousStep('social');
    if (previousStep) {
      goto(previousStep.path);
    }
  }

  function skipStep() {
    markStepAsCompleted('social');
    const nextStep = getNextStep('social');
    if (nextStep) {
      goto(nextStep.path);
    }
  }

  $: hasAnySocial = Object.values(formData).some(value => value.trim() !== '');
  
  // Marcar paso como completado cuando hay al menos una red social
  $: if (hasAnySocial) {
    markStepAsCompleted('social');
  }

  $: hasAnySocial = Object.values(formData).some(value => value.trim());
</script>

<svelte:head>
  <title>Redes Sociales - Generador de Firmas</title>
</svelte:head>

<div class="max-w-4xl mx-auto">

  <!-- Formulario -->
  <div class="max-w-2xl">
    <div class="bg-white border border-gray-300 rounded-lg p-8">
      <h2 class="text-xl font-semibold text-gray-900 mb-6">Agrega tus Redes Sociales</h2>
      
      <div class="space-y-6">
        <!-- LinkedIn -->
        <div>
          <label for="linkedin" class="flex items-center text-sm font-medium text-gray-700 mb-2">
            <svg class="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            LinkedIn
          </label>
          <input
            type="url"
            id="linkedin"
            bind:value={formData.linkedin}
            placeholder="https://linkedin.com/in/tu-perfil"
            class="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>

        <!-- Twitter -->
        <div>
          <label for="twitter" class="flex items-center text-sm font-medium text-gray-700 mb-2">
            <svg class="w-5 h-5 mr-2 text-sky-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
            Twitter/X
          </label>
          <input
            type="url"
            id="twitter"
            bind:value={formData.twitter}
            placeholder="https://twitter.com/tu-usuario"
            class="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>

        <!-- GitHub -->
        <div>
          <label for="github" class="flex items-center text-sm font-medium text-gray-700 mb-2">
            <svg class="w-5 h-5 mr-2 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            GitHub
          </label>
          <input
            type="url"
            id="github"
            bind:value={formData.github}
            placeholder="https://github.com/tu-usuario"
            class="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>

        <!-- Instagram -->
        <div>
          <label for="instagram" class="flex items-center text-sm font-medium text-gray-700 mb-2">
            <svg class="w-5 h-5 mr-2 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            Instagram
          </label>
          <input
            type="url"
            id="instagram"
            bind:value={formData.instagram}
            placeholder="https://instagram.com/tu-usuario"
            class="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
      </div>

      <!-- Skip Option -->
      <div class="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h3 class="text-sm font-medium text-gray-700 mb-2">⚡ Paso Opcional</h3>
        <p class="text-xs text-gray-600 mb-3">
          Las redes sociales son opcionales. Puedes omitir este paso y agregar enlaces más tarde.
        </p>
        <button
          on:click={skipStep}
          class="text-sm text-emerald-600 hover:text-emerald-700 underline font-medium"
        >
          Omitir este paso →
        </button>
      </div>
    </div>
  </div>

  <!-- Botones de navegación -->
  <div class="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
    <button
      on:click={goBack}
      class="flex items-center px-6 py-3 text-gray-600 hover:text-gray-900 transition-colors"
    >
      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
      </svg>
      Información de Contacto
    </button>

    <button
      on:click={continueToNextStep}
      class="flex items-center px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-all duration-300"
    >
      Continuar
      <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
      </svg>
    </button>
  </div>
</div>