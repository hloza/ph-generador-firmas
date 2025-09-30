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
            height: 80px;
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
            align-items: center;
            justify-content: center;
            z-index: 10;
          ">
            <!-- Solo el nombre -->
            <h3 style="
              font-size: 16px;
              font-weight: 600;
              color: {selectedTemplateId === template.id ? '#B8001F' : '#384B70'};
              transition: all 0.3s ease;
              line-height: 1.2;
              margin: 0;
              text-align: center;
            ">
              {template.name}
            </h3>
          </div>
        </button>
      {/each}
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
        
        <!-- Botón continuar simplificado -->
        <button 
          on:click={continueToNextStep}
          style="
            background: #B8001F;
            color: #FCFAEE;
            border: 2px solid #B8001F;
            padding: 16px 32px;
            border-radius: 12px;
            font-size: 16px;
            font-weight: 600;
            transition: all 0.3s ease;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(184, 0, 31, 0.2);
          "
          on:mouseenter={(e) => {
            e.currentTarget.style.background = '#FCFAEE';
            e.currentTarget.style.color = '#B8001F';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(184, 0, 31, 0.3)';
          }}
          on:mouseleave={(e) => {
            e.currentTarget.style.background = '#B8001F';
            e.currentTarget.style.color = '#FCFAEE';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(184, 0, 31, 0.2)';
          }}
        >
          Continuar con {selectedTemplate?.name}
        </button>
        

      </div>
    </div>
  {:else}
    <!-- Estado sin selección -->
    <div style="text-align: center; padding: 60px 20px;">
      <div style="max-width: 500px; margin: 0 auto;">
        <div style="
          width: 120px;
          height: 120px;
          background: rgba(252, 250, 238, 0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 3px dashed rgba(252, 250, 238, 0.3);
          margin: 0 auto 32px auto;
        ">
          <svg style="width: 48px; height: 48px; color: #FCFAEE;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
        </div>
        <div>
          <h3 style="
            font-size: 28px;
            font-weight: 700;
            color: #FCFAEE;
            margin-bottom: 16px;
          ">
            Selecciona una Plantilla
          </h3>
          <p style="
            color: rgba(252, 250, 238, 0.8);
            font-size: 16px;
            line-height: 1.6;
            margin: 0;
          ">
            Elige una plantilla profesional para comenzar a crear tu firma de correo electrónico
          </p>
        </div>
      </div>
    </div>
  {/if}
</div>
</div>