<script lang="ts">
  import { signatureData } from '$lib/stores/signature.js';
  import { markStepAsCompleted, getNextStep, getPreviousStep } from '$lib/stores/navigation';
  import { goto } from '$app/navigation';
  import { availableColors } from '$lib/data/templates.js';

  let formData = {
    primaryColor: $signatureData.primaryColor || '#3b82f6',
    accentColor: $signatureData.accentColor || '#8b5cf6',
    fontSize: $signatureData.fontSize || 'medium',
    fontFamily: $signatureData.fontFamily || 'modern'
  };

  const fontSizes = [
    { value: 'small', label: 'Pequeño', preview: 'text-sm' },
    { value: 'medium', label: 'Mediano', preview: 'text-base' },
    { value: 'large', label: 'Grande', preview: 'text-lg' }
  ];

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
  <div class="text-center mb-8">
    <div class="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl mb-4 shadow-lg shadow-orange-500/25">
      <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4 4 4 0 004-4V5z"/>
      </svg>
    </div>
    <h1 class="text-3xl font-bold gradient-text mb-2">Personalización de Diseño</h1>
    <p class="text-lg text-slate-400">Ajusta los colores y tipografía de tu firma</p>
  </div>

  <!-- Formulario -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <!-- Panel de Personalización -->
    <div class="space-y-8">
      <!-- Colores -->
      <div class="dark-card p-8">
        <h2 class="text-xl font-semibold text-slate-200 mb-6">Colores</h2>
        
        <!-- Color Principal -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-slate-300 mb-3">
            Color Principal
          </label>
          <div class="grid grid-cols-5 gap-3">
            {#each availableColors as color}
              <button
                class="w-12 h-12 rounded-lg border-2 transition-all duration-200 {formData.primaryColor === color.value ? 'border-white scale-110 shadow-lg' : 'border-slate-600 hover:border-slate-400'}"
                style="background-color: {color.value}"
                on:click={() => formData.primaryColor = color.value}
                title={color.name}
              ></button>
            {/each}
          </div>
          <p class="text-xs text-slate-400 mt-2">Se usa para elementos principales como títulos y enlaces</p>
        </div>

        <!-- Color de Acento -->
        <div>
          <label class="block text-sm font-medium text-slate-300 mb-3">
            Color de Acento
          </label>
          <div class="grid grid-cols-5 gap-3">
            {#each availableColors as color}
              <button
                class="w-12 h-12 rounded-lg border-2 transition-all duration-200 {formData.accentColor === color.value ? 'border-white scale-110 shadow-lg' : 'border-slate-600 hover:border-slate-400'}"
                style="background-color: {color.value}"
                on:click={() => formData.accentColor = color.value}
                title={color.name}
              ></button>
            {/each}
          </div>
          <p class="text-xs text-slate-400 mt-2">Se usa para detalles decorativos y separadores</p>
        </div>
      </div>

      <!-- Tipografía -->
      <div class="dark-card p-8">
        <h2 class="text-xl font-semibold text-slate-200 mb-6">Tipografía</h2>
        
        <!-- Tamaño de Fuente -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-slate-300 mb-3">
            Tamaño de Fuente
          </label>
          <div class="space-y-2">
            {#each fontSizes as size}
              <button
                class="w-full p-3 text-left border rounded-lg transition-all duration-200 {formData.fontSize === size.value ? 'border-orange-500 bg-orange-500/10' : 'border-slate-600 hover:border-slate-500'}"
                on:click={() => formData.fontSize = size.value}
              >
                <div class="flex items-center justify-between">
                  <span class="text-slate-200 {size.preview}">{size.label}</span>
                  <span class="text-slate-400 text-sm">Ejemplo de texto</span>
                </div>
              </button>
            {/each}
          </div>
        </div>

        <!-- Familia de Fuente -->
        <div>
          <label class="block text-sm font-medium text-slate-300 mb-3">
            Estilo de Fuente
          </label>
          <div class="space-y-2">
            {#each fontFamilies as font}
              <button
                class="w-full p-3 text-left border rounded-lg transition-all duration-200 {formData.fontFamily === font.value ? 'border-orange-500 bg-orange-500/10' : 'border-slate-600 hover:border-slate-500'}"
                on:click={() => formData.fontFamily = font.value}
              >
                <div class="flex items-center justify-between">
                  <span class="text-slate-200">{font.label}</span>
                  <span class="text-slate-400 text-sm {font.preview}" style="font-family: {font.css}">
                    Ana García
                  </span>
                </div>
              </button>
            {/each}
          </div>
        </div>
      </div>
    </div>

    <!-- Vista Previa -->
    <div class="dark-card p-8">
      <h2 class="text-xl font-semibold text-slate-200 mb-6">Vista Previa en Tiempo Real</h2>
      
      <div class="preview-section">
        <div class="bg-white p-6 rounded-lg" style="font-family: {fontFamilies.find(f => f.value === formData.fontFamily)?.css}">
          <div class="space-y-2">
            <h3 
              class="font-bold {fontSizes.find(s => s.value === formData.fontSize)?.preview === 'text-sm' ? 'text-base' : fontSizes.find(s => s.value === formData.fontSize)?.preview === 'text-base' ? 'text-lg' : 'text-xl'}"
              style="color: {formData.primaryColor}"
            >
              {$signatureData.name || 'Ana García Martínez'}
            </h3>
            <p 
              class="font-medium {fontSizes.find(s => s.value === formData.fontSize)?.preview}"
              style="color: {formData.accentColor}"
            >
              {$signatureData.title || 'Directora de Marketing Digital'}
            </p>
            <p class="text-gray-600 {fontSizes.find(s => s.value === formData.fontSize)?.preview}">
              {$signatureData.company || 'Innovación Tecnológica S.L.'}
            </p>
            
            <!-- Separador decorativo -->
            <div class="my-3">
              <div class="h-px w-16" style="background-color: {formData.accentColor}"></div>
            </div>
            
            <div class="space-y-1 text-sm text-gray-600">
              {#if $signatureData.email}
                <div class="flex items-center space-x-2">
                  <svg class="w-4 h-4" style="color: {formData.primaryColor}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                  <span>{$signatureData.email}</span>
                </div>
              {/if}
              
              {#if $signatureData.phone}
                <div class="flex items-center space-x-2">
                  <svg class="w-4 h-4" style="color: {formData.primaryColor}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                  <span>{$signatureData.phone}</span>
                </div>
              {/if}
              
              {#if $signatureData.website}
                <div class="flex items-center space-x-2">
                  <svg class="w-4 h-4" style="color: {formData.primaryColor}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m-9 9a9 9 0 019-9"/>
                  </svg>
                  <span style="color: {formData.primaryColor}">{$signatureData.website}</span>
                </div>
              {/if}
            </div>

            <!-- Redes sociales si existen -->
            {#if $signatureData.linkedin || $signatureData.twitter || $signatureData.github}
              <div class="mt-4 pt-3 border-t border-gray-200">
                <div class="flex space-x-2">
                  {#if $signatureData.linkedin}
                    <div class="w-6 h-6 rounded flex items-center justify-center" style="background-color: {formData.primaryColor}">
                      <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </div>
                  {/if}
                  
                  {#if $signatureData.twitter}
                    <div class="w-6 h-6 rounded flex items-center justify-center" style="background-color: {formData.accentColor}">
                      <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                    </div>
                  {/if}
                  
                  {#if $signatureData.github}
                    <div class="w-6 h-6 rounded flex items-center justify-center bg-gray-700">
                      <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    </div>
                  {/if}
                </div>
              </div>
            {/if}
          </div>
        </div>
        
        <div class="mt-4 text-sm text-slate-400">
          <p>Los cambios se aplican en tiempo real. Esta es una vista previa de cómo se verá tu firma personalizada.</p>
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
      Redes Sociales
    </button>

    <button
      on:click={continueToNextStep}
      class="flex items-center px-8 py-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold rounded-lg transition-all duration-300"
    >
      Continuar
      <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
      </svg>
    </button>
  </div>
</div>