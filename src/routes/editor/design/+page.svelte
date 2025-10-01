<script lang="ts">
  import { signatureData } from '$lib/stores/signature.js';
  import { markStepAsCompleted, getNextStep, getPreviousStep } from '$lib/stores/navigation.js';
  import { goto } from '$app/navigation';
  import { colorPresets } from '$lib/data/templates.js';

  let formData = {
    primaryColor: $signatureData.primaryColor || '#3b82f6',
    accentColor: $signatureData.accentColor || '#8b5cf6',
    fontFamily: $signatureData.fontFamily || 'modern'
  };

  // Reactividad automática - actualiza el store cada vez que cambian los datos del formulario
  $: signatureData.update(data => ({
    ...data,
    ...formData
  }));



  const fontFamilies = [
    { value: 'modern', label: 'Moderno', preview: 'font-sans', css: 'Arial, sans-serif' },
    { value: 'classic', label: 'Clásico', preview: 'font-serif', css: 'Georgia, serif' },
    { value: 'minimal', label: 'Minimalista', preview: 'font-mono', css: 'Courier, monospace' }
  ];

  function updateSignatureData() {
    signatureData.update(data => ({
      ...data,
      ...formData
    }));
  }

  function continueToNextStep() {
    updateSignatureData();
    markStepAsCompleted('design');
    const nextStep = getNextStep('design');
    if (nextStep) {
      goto(nextStep.path);
    }
  }

  function goBack() {
    updateSignatureData();
    const previousStep = getPreviousStep('design');
    if (previousStep) {
      goto(previousStep.path);
    }
  }

  // Actualizar en tiempo real
  $: {
    updateSignatureData();
  }
</script>

<svelte:head>
  <title>Personalización - Generador de Firmas</title>
</svelte:head>

<div class="max-w-4xl mx-auto">
  <!-- Header -->
  <div class="mb-8">
    <h1 class="text-3xl font-bold text-white mb-3">
      🎨 Personalización de Diseño
    </h1>
    <p class="text-slate-300 text-lg leading-relaxed">
      Ajusta los colores y tipografía de tu firma. La vista previa se actualiza automáticamente en la columna derecha.
    </p>
  </div>

  <!-- Formulario -->
  <div class="max-w-2xl">
    <div class="bg-white border border-gray-300 rounded-lg p-8">
      <h2 class="text-xl font-semibold text-gray-900 mb-6">Personalización de Diseño</h2>
      
      <div class="space-y-8">
        <!-- Colores -->
        <div>
          <h3 class="text-lg font-semibold text-gray-800 mb-4">Colores</h3>
        
          <!-- Color Principal -->
          <div class="mb-6">
            <div id="primary-color-label" class="block text-sm font-medium text-gray-700 mb-3">
              Color Principal
            </div>
            <div class="grid grid-cols-5 gap-3" aria-labelledby="primary-color-label">
              {#each colorPresets as color}
                <button
                  class="w-12 h-12 rounded-lg border-2 transition-all duration-200 {formData.primaryColor === color.value ? 'border-emerald-500 scale-110 shadow-lg' : 'border-gray-300 hover:border-gray-400'}"
                  style="background-color: {color.value}"
                  on:click={() => formData.primaryColor = color.value}
                  title={color.name}
                  aria-label="Seleccionar color principal {color.name}"
                ></button>
              {/each}
            </div>
            <p class="text-xs text-gray-500 mt-2">Se usa para elementos principales como títulos y enlaces</p>
          </div>

          <!-- Color de Acento -->
          <div>
            <div id="accent-color-label" class="block text-sm font-medium text-gray-700 mb-3">
              Color de Acento
            </div>
            <div class="grid grid-cols-5 gap-3" aria-labelledby="accent-color-label">
              {#each colorPresets as color}
                <button
                  class="w-12 h-12 rounded-lg border-2 transition-all duration-200 {formData.accentColor === color.value ? 'border-emerald-500 scale-110 shadow-lg' : 'border-gray-300 hover:border-gray-400'}"
                  style="background-color: {color.value}"
                  on:click={() => formData.accentColor = color.value}
                  title={color.name}
                  aria-label="Seleccionar color de acento {color.name}"
                ></button>
              {/each}
            </div>
            <p class="text-xs text-gray-500 mt-2">Se usa para detalles decorativos y separadores</p>
          </div>
        </div>

        <!-- Tipografía -->
        <div>
          <h3 class="text-lg font-semibold text-gray-800 mb-4">Tipografía</h3>
        


          <!-- Familia de Fuente -->
          <div>
            <div id="font-family-label" class="block text-sm font-medium text-gray-700 mb-3">
              Estilo de Fuente
            </div>
            <div class="space-y-2" aria-labelledby="font-family-label">
              {#each fontFamilies as font}
                <button
                  class="w-full p-3 text-left border rounded-lg transition-all duration-200 {formData.fontFamily === font.value ? 'border-emerald-500 bg-emerald-50' : 'border-gray-300 hover:border-gray-400'}"
                  on:click={() => formData.fontFamily = font.value}
                >
                  <div class="flex items-center justify-between">
                    <span class="text-gray-900">{font.label}</span>
                    <span class="text-gray-400 text-sm {font.preview}" style="font-family: {font.css}">
                      Ana García
                    </span>
                  </div>
                </button>
              {/each}
            </div>
          </div>
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
        Redes Sociales
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
</div>