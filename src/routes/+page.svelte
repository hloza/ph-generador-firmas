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

<!-- Contenido principal -->
<div class="relative min-h-screen gradient-bg">
  <!-- Efectos de fondo sutiles -->
  <div class="absolute inset-0 overflow-hidden pointer-events-none">
    <!-- Orbes sutiles -->
    <div class="absolute top-20 right-20 w-64 h-64 rounded-full blur-3xl animate-pulse opacity-10" style="background: var(--accent); animation-duration: 6s;"></div>
    <div class="absolute bottom-20 left-20 w-48 h-48 rounded-full blur-3xl animate-pulse opacity-10" style="background: var(--secondary); animation-duration: 8s;"></div>
  </div>

<div class="h-full px-6 py-6 relative z-10" class:animate-slideInUp={isLoaded}>
  <!-- Grid de plantillas -->  
  <div class="mb-8 relative">
    <div class="grid grid-cols-2 gap-4">
      {#each templates as template, index}
        <button 
          on:click={() => selectTemplate(template.id)}
          class="relative overflow-hidden rounded-lg transition-all duration-300 cursor-pointer w-full text-left border-2 {selectedTemplateId === template.id ? 'bg-accent/5 border-accent shadow-lg' : 'bg-card border-border shadow-sm hover:shadow-md hover:border-accent/50'}"
          style="
            height: 60px;
            animation-delay: {index * 100}ms;
            transform: {selectedTemplateId === template.id ? 'translateY(-1px)' : 'translateY(0)'};
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
            padding: 12px;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10;
          ">
            <!-- Solo el nombre -->
            <h3 class="text-sm font-semibold transition-all duration-300 text-center m-0 {selectedTemplateId === template.id ? 'text-accent' : 'text-card-foreground'}"
                style="line-height: 1.1;">
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
          class="bg-accent text-accent-foreground hover:bg-accent-foreground hover:text-accent border-2 border-accent px-8 py-4 rounded-lg font-semibold transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          Continuar con {selectedTemplate?.name}
        </button>
        

      </div>
    </div>
  {:else}
    <!-- Estado sin selección -->
    <div class="text-center py-16 px-5">
      <div class="max-w-md mx-auto">
        <div class="w-30 h-30 bg-muted/20 rounded-full flex items-center justify-center border-3 border-dashed border-muted-foreground/30 mx-auto mb-8">
          <svg class="w-12 h-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
        </div>
        <div>
          <h3 class="text-2xl font-bold text-foreground mb-4">
            Selecciona una Plantilla
          </h3>
          <p class="text-muted-foreground text-base leading-relaxed">
            Elige una plantilla profesional para comenzar a crear tu firma de correo electrónico
          </p>
        </div>
      </div>
    </div>
  {/if}
</div>
</div>