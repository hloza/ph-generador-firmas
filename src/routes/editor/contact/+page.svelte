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
</script>

<svelte:head>
  <title>Información de Contacto - Generador de Firmas</title>
</svelte:head>

<div class="max-w-4xl mx-auto">
  <!-- Header -->
  <div class="text-center mb-8">
    <div class="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl mb-4 shadow-lg shadow-emerald-500/25">
      <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
      </svg>
    </div>
    <h1 class="text-3xl font-bold gradient-text mb-2">Información de Contacto</h1>
    <p class="text-lg text-slate-400">Agrega tus datos de contacto profesional</p>
  </div>

  <!-- Formulario -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <!-- Panel de Formulario -->
    <div class="dark-card p-8">
      <h2 class="text-xl font-semibold text-slate-200 mb-6">Datos de Contacto</h2>
      
      <div class="space-y-6">
        <!-- Email -->
        <div>
          <label for="email" class="block text-sm font-medium text-slate-300 mb-2">
            Email profesional *
          </label>
          <input
            type="email"
            id="email"
            bind:value={formData.email}
            placeholder="ana.garcia@empresa.com"
            class="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            required
          />
        </div>

        <!-- Teléfono -->
        <div>
          <label for="phone" class="block text-sm font-medium text-slate-300 mb-2">
            Teléfono
          </label>
          <input
            type="tel"
            id="phone"
            bind:value={formData.phone}
            placeholder="+34 691 234 567"
            class="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>

        <!-- Sitio web -->
        <div>
          <label for="website" class="block text-sm font-medium text-slate-300 mb-2">
            Sitio web
          </label>
          <input
            type="url"
            id="website"
            bind:value={formData.website}
            placeholder="www.empresa.com"
            class="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>

        <!-- Dirección -->
        <div>
          <label for="address" class="block text-sm font-medium text-slate-300 mb-2">
            Dirección
          </label>
          <textarea
            id="address"
            bind:value={formData.address}
            placeholder="Madrid, España"
            rows="3"
            class="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
          ></textarea>
        </div>
      </div>

      <!-- Tips -->
      <div class="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
        <h3 class="text-sm font-medium text-emerald-300 mb-2">💡 Consejos</h3>
        <ul class="text-xs text-slate-400 space-y-1">
          <li>• Usa un email profesional que revises regularmente</li>
          <li>• Incluye código de país en tu teléfono si trabajas internacionalmente</li>
          <li>• El sitio web puede ser tu portfolio, LinkedIn o web corporativa</li>
        </ul>
      </div>
    </div>

    <!-- Vista Previa -->
    <div class="dark-card p-8">
      <h2 class="text-xl font-semibold text-slate-200 mb-6">Vista Previa</h2>
      
      <div class="preview-section">
        <div class="bg-white p-6 rounded-lg">
          <div class="space-y-2">
            <h3 class="text-lg font-bold text-gray-900">
              {$signatureData.name || 'Tu Nombre'}
            </h3>
            <p class="text-blue-600 font-medium">
              {$signatureData.title || 'Tu Título'}
            </p>
            <p class="text-gray-600">
              {$signatureData.company || 'Tu Empresa'}
            </p>
            
            <div class="mt-4 space-y-1 text-sm text-gray-600">
              {#if formData.email}
                <div class="flex items-center space-x-2">
                  <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                  <span>{formData.email}</span>
                </div>
              {/if}
              
              {#if formData.phone}
                <div class="flex items-center space-x-2">
                  <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                  <span>{formData.phone}</span>
                </div>
              {/if}
              
              {#if formData.website}
                <div class="flex items-center space-x-2">
                  <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
                  </svg>
                  <span>{formData.website}</span>
                </div>
              {/if}
              
              {#if formData.address}
                <div class="flex items-center space-x-2">
                  <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  <span>{formData.address}</span>
                </div>
              {/if}
            </div>
          </div>
        </div>
        
        <div class="mt-4 text-sm text-slate-400">
          <p>Vista previa con tu información de contacto. El diseño final se basará en tu plantilla seleccionada.</p>
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
      Información Personal
    </button>

    <button
      on:click={continueToNextStep}
      disabled={!isFormValid}
      class="flex items-center px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-300"
    >
      Continuar
      <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
      </svg>
    </button>
  </div>
</div>