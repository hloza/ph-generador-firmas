<script lang="ts">
  import { templates } from '$lib/data/templates.js';
  import { signatureData } from '$lib/stores/signature.js';
  import { goto } from '$app/navigation';
  import { markStepAsCompleted, getNextStep } from '$lib/stores/navigation';
  import { onMount } from 'svelte';

  // Variable reactiva para obtener el template seleccionado
  $: selectedTemplateId = $signatureData.templateId;
  $: selectedTemplate = selectedTemplateId ? templates.find(t => t.id === selectedTemplateId) : null;

  let isLoaded = false;

  onMount(() => {
    setTimeout(() => {
      isLoaded = true;
    }, 100);
  });

  function selectTemplate(templateId: string) {
    signatureData.update(data => ({
      ...data,
      templateId
    }));
  }

  function continueToNextStep() {
    if (selectedTemplateId) {
      markStepAsCompleted('template');
      const nextStep = getNextStep('template');
      if (nextStep) {
        goto(nextStep.path);
      }
    }
  }
</script>

<svelte:head>
  <title>Generador de Firmas de Email - Plantillas</title>
  <meta name="description" content="Selecciona una plantilla profesional para tu firma de correo electrónico" />
  <style>
    .template-card:hover .top-shine {
      background: linear-gradient(to right, transparent, rgba(6, 182, 212, 0.8), transparent) !important;
    }
    .template-card:hover .hover-overlay {
      opacity: 1 !important;
    }
    .template-card:hover .shine-effect {
      transform: translateX(100%) !important;
    }
    .template-card.selected .premium-border {
      opacity: 1 !important;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    @keyframes slideInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    .animate-slideInUp {
      animation: slideInUp 0.6s ease-out forwards;
    }
  </style>
</svelte:head>

<!-- Contenido principal con nueva paleta -->
<div class="relative min-h-screen" style="background: linear-gradient(135deg, #384B70 0%, #507687 100%);">
  <!-- Efectos de fondo sutiles -->
  <div class="absolute inset-0 overflow-hidden pointer-events-none">
    <!-- Orbes sutiles -->
    <div class="absolute top-20 right-20 w-64 h-64 rounded-full blur-3xl animate-pulse" style="background: rgba(252, 250, 238, 0.08); animation-duration: 6s;"></div>
    <div class="absolute bottom-20 left-20 w-48 h-48 rounded-full blur-3xl animate-pulse" style="background: rgba(184, 0, 31, 0.12); animation-duration: 8s;"></div>
    
    <!-- Partículas sutiles -->
    <div class="absolute top-32 left-16 w-1 h-1 rounded-full animate-bounce" style="background: rgba(252, 250, 238, 0.4); animation-delay: 0s; animation-duration: 4s;"></div>
    <div class="absolute top-64 right-32 w-1 h-1 rounded-full animate-bounce" style="background: rgba(184, 0, 31, 0.6); animation-delay: 2s; animation-duration: 5s;"></div>
    <div class="absolute bottom-40 left-1/3 w-1 h-1 rounded-full animate-bounce" style="background: rgba(252, 250, 238, 0.3); animation-delay: 1s; animation-duration: 3s;"></div>
  </div>
  
  <!-- Textura sutil -->
  <div class="absolute inset-0 opacity-5" style="background-image: radial-gradient(circle at 1px 1px, rgba(252, 250, 238, 0.1) 1px, transparent 0); background-size: 30px 30px;"></div>

<div class="max-w-7xl mx-auto px-6 py-12 relative z-10" class:animate-slideInUp={isLoaded}>
  <!-- Grid de plantillas -->  
  <div class="mb-20 relative">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each templates as template, index}
        <button 
          on:click={() => selectTemplate(template.id)}
          style="
            position: relative;
            overflow: hidden;
            border-radius: 12px;
            transition: all 0.3s ease;
            transform: {selectedTemplateId === template.id ? 'translateY(-2px)' : 'translateY(0)'};
            cursor: pointer;
            width: 100%;
            text-align: left;
            height: 120px;
            animation-delay: {index * 100}ms;
            background: #FCFAEE;
            border: 2px solid {selectedTemplateId === template.id ? '#B8001F' : 'rgba(56, 75, 112, 0.2)'};
            box-shadow: {selectedTemplateId === template.id ? '0 8px 25px rgba(184, 0, 31, 0.15)' : '0 4px 12px rgba(56, 75, 112, 0.08)'};
          "
          class="group template-card {selectedTemplateId === template.id ? 'selected' : ''}"
          on:mouseenter={(e) => {
            if (selectedTemplateId !== template.id) {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(80, 118, 135, 0.12)';
              e.currentTarget.style.borderColor = 'rgba(80, 118, 135, 0.4)';
            }
          }}
          on:mouseleave={(e) => {
            if (selectedTemplateId === template.id) {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(184, 0, 31, 0.15)';
              e.currentTarget.style.borderColor = '#B8001F';
            } else {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(56, 75, 112, 0.08)';
              e.currentTarget.style.borderColor = 'rgba(56, 75, 112, 0.2)';
            }
          }}
        >
          <!-- Contenido principal -->
          <div style="
            position: relative;
            padding: 16px;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            z-index: 10;
          ">
            <!-- Información central -->
            <div style="flex: 1; display: flex; flex-direction: column; gap: 8px;">
              <!-- Nombre -->
              <h3 style="
                font-size: 16px;
                font-weight: 700;
                color: {selectedTemplateId === template.id ? '#B8001F' : '#384B70'};
                transition: all 0.3s;
                line-height: 1.3;
                margin: 0;
              ">
                {template.name}
              </h3>
              
              <!-- Features simplificadas -->
              <div style="display: flex; flex-wrap: wrap; gap: 4px; margin-top: 4px;">
                <span style="
                  padding: 2px 6px;
                  background: {selectedTemplateId === template.id ? 'rgba(184, 0, 31, 0.1)' : 'rgba(80, 118, 135, 0.1)'};
                  color: {selectedTemplateId === template.id ? '#B8001F' : '#507687'};
                  font-size: 10px;
                  font-weight: 600;
                  border-radius: 8px;
                  border: 1px solid {selectedTemplateId === template.id ? 'rgba(184, 0, 31, 0.2)' : 'rgba(80, 118, 135, 0.2)'};
                ">
                  Profesional
                </span>
                <span style="
                  padding: 2px 6px;
                  background: {selectedTemplateId === template.id ? 'rgba(184, 0, 31, 0.1)' : 'rgba(80, 118, 135, 0.1)'};
                  color: {selectedTemplateId === template.id ? '#B8001F' : '#507687'};
                  font-size: 10px;
                  font-weight: 600;
                  border-radius: 8px;
                  border: 1px solid {selectedTemplateId === template.id ? 'rgba(184, 0, 31, 0.2)' : 'rgba(80, 118, 135, 0.2)'};
                ">
                  Responsive
                </span>
              </div>
            </div>
            
            <!-- Footer del card -->
            <div style="
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding-top: 8px;
              border-top: 1px solid {selectedTemplateId === template.id ? 'rgba(184, 0, 31, 0.2)' : 'rgba(56, 75, 112, 0.1)'};
              margin-top: 8px;
            ">
              <!-- Estado -->
              {#if selectedTemplateId === template.id}
                <div style="display: flex; align-items: center; gap: 6px;">
                  <div style="
                    width: 6px;
                    height: 6px;
                    background: #B8001F;
                    border-radius: 50%;
                    animation: pulse 2s infinite;
                  "></div>
                  <span style="color: #B8001F; font-size: 11px; font-weight: 600;">Seleccionada</span>
                </div>
              {:else}
                <span style="color: #507687; font-size: 11px;">
                  Clic para seleccionar
                </span>
              {/if}
              
              <!-- Indicador visual simple -->
              <div style="
                width: 20px;
                height: 20px;
                border-radius: 50%;
                border: 2px solid {selectedTemplateId === template.id ? '#B8001F' : 'rgba(80, 118, 135, 0.3)'};
                background: {selectedTemplateId === template.id ? '#B8001F' : 'transparent'};
                transition: all 0.3s;
                display: flex;
                align-items: center;
                justify-content: center;
              ">
                {#if selectedTemplateId === template.id}
                  <svg style="width: 10px; height: 10px; color: #FCFAEE;" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                {/if}
              </div>
            </div>
          </div>
        </button>
      {/each}
    </div>
    
    <!-- Información adicional -->
    <div class="text-center mt-16">
      <p class="text-slate-400 mb-6 text-lg">
        ¿No encuentras lo que buscas? 
        <button class="text-cyan-400 hover:text-cyan-300 underline decoration-cyan-400/50 underline-offset-4 transition-all duration-300 hover:decoration-cyan-300">
          Contáctanos para un diseño personalizado
        </button>
      </p>
      <div class="flex flex-wrap justify-center gap-8 text-sm text-slate-500">
        <span class="flex items-center space-x-2">
          <svg class="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
          </svg>
          <span>Compatible con todos los clientes de email</span>
        </span>
        <span class="flex items-center space-x-2">
          <svg class="w-5 h-5 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path>
          </svg>
          <span>Fácil de personalizar</span>
        </span>
        <span class="flex items-center space-x-2">
          <svg class="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd"></path>
          </svg>
          <span>Generación instantánea</span>
        </span>
      </div>
    </div>
  </div>

  <!-- Sección de confirmación premium -->
  {#if selectedTemplateId}
    <div class="text-center">
      <div class="inline-flex flex-col items-center space-y-8 max-w-2xl mx-auto">
        <!-- Confirmación elegante -->
        <div class="flex items-center space-x-6 bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/30 rounded-3xl px-8 py-6 backdrop-blur-xl shadow-2xl">
          <div class="w-16 h-16 bg-gradient-to-r from-emerald-400 to-green-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
            </svg>
          </div>
          <div class="text-left">
            <p class="text-emerald-300 font-bold text-xl">¡Excelente elección!</p>
            <p class="text-slate-300 text-sm mt-1">
              <span class="font-bold text-cyan-300">"{selectedTemplate?.name}"</span> - Vista previa disponible en el panel derecho
            </p>
          </div>
        </div>
        
        <!-- Botón continuar premium -->
        <button 
          on:click={continueToNextStep}
          class="group relative overflow-hidden bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 hover:from-cyan-500 hover:via-blue-500 hover:to-purple-500 text-white font-black py-6 px-12 rounded-3xl transition-all duration-700 shadow-2xl hover:shadow-cyan-500/40 transform hover:scale-110 hover:-translate-y-2"
        >
          <!-- Efectos de brillo múltiples -->
          <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
          <div class="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div class="relative flex items-center justify-center space-x-4">
            <svg class="w-8 h-8 group-hover:rotate-90 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
            <span class="text-2xl">Continuar con</span>
            <span class="text-2xl font-black bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">{selectedTemplate?.name}</span>
            <svg class="w-8 h-8 group-hover:translate-x-4 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
            </svg>
          </div>
        </button>
        
        <!-- Descripción elegante -->
        <div class="text-center space-y-4">
          <p class="text-slate-400 text-lg leading-relaxed max-w-lg">
            En el siguiente paso podrás personalizar la información de tu perfil profesional y hacer que tu firma sea única
          </p>
          <div class="flex justify-center space-x-6 text-sm text-slate-500">
            <span class="flex items-center space-x-2">
              <div class="w-2 h-2 bg-cyan-400 rounded-full"></div>
              <span>Paso 1 de 5</span>
            </span>
            <span class="flex items-center space-x-2">
              <div class="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span>2-3 minutos</span>
            </span>
            <span class="flex items-center space-x-2">
              <div class="w-2 h-2 bg-emerald-400 rounded-full"></div>
              <span>100% Gratis</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  {:else}
    <!-- Estado sin selección elegante -->
    <div class="text-center py-20">
      <div class="inline-flex flex-col items-center space-y-8 max-w-lg mx-auto">
        <div class="w-32 h-32 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-full flex items-center justify-center border-4 border-dashed border-slate-600/50 backdrop-blur-sm">
          <svg class="w-16 h-16 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
        </div>
        <div class="space-y-4">
          <h3 class="text-3xl font-black text-slate-200 mb-4">
            Selecciona una Plantilla
          </h3>
          <p class="text-slate-400 leading-relaxed text-lg">
            Elige una de nuestras plantillas profesionales para comenzar a crear tu firma de correo electrónico personalizada y destacar en cada conversación
          </p>
          <div class="flex justify-center space-x-2 mt-6">
            <div class="w-2 h-2 bg-slate-600 rounded-full animate-bounce" style="animation-delay: 0s;"></div>
            <div class="w-2 h-2 bg-slate-600 rounded-full animate-bounce" style="animation-delay: 0.2s;"></div>
            <div class="w-2 h-2 bg-slate-600 rounded-full animate-bounce" style="animation-delay: 0.4s;"></div>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>
</div>