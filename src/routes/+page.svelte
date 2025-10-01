<script lang="ts">
  import { templates } from '$lib/data/templates.js';
  import { signatureData, showToast } from '$lib/stores/signature.js';
  import { goto } from '$app/navigation';
  import { markStepAsCompleted, getNextStep } from '$lib/stores/navigation';
  import { onMount } from 'svelte';
  import { page } from '$app/stores';

  // Variable reactiva para obtener el template seleccionado
  $: selectedTemplateId = $signatureData.templateId;
  $: selectedTemplate = selectedTemplateId ? templates.find(t => t.id === selectedTemplateId) : null;

  let isLoaded = false;

  onMount(() => {
    // Cargar datos desde URL parameters si están disponibles
    const urlParams = $page.url.searchParams;
    
    if (urlParams.size > 0) {
      const prefilledData: any = {};
      
      // Mapear parámetros URL a datos de la firma
      if (urlParams.get('name')) prefilledData.name = urlParams.get('name');
      if (urlParams.get('title')) prefilledData.title = urlParams.get('title');
      if (urlParams.get('company')) prefilledData.company = urlParams.get('company');
      if (urlParams.get('department')) prefilledData.department = urlParams.get('department');
      if (urlParams.get('email')) prefilledData.email = urlParams.get('email');
      if (urlParams.get('phone')) prefilledData.phone = urlParams.get('phone');
      if (urlParams.get('website')) prefilledData.website = urlParams.get('website');
      if (urlParams.get('address')) prefilledData.address = urlParams.get('address');
      if (urlParams.get('primaryColor')) prefilledData.primaryColor = urlParams.get('primaryColor');
      if (urlParams.get('accentColor')) prefilledData.accentColor = urlParams.get('accentColor');
      if (urlParams.get('fontFamily')) prefilledData.fontFamily = urlParams.get('fontFamily');
      if (urlParams.get('templateId')) prefilledData.templateId = urlParams.get('templateId');
      if (urlParams.get('linkedin')) prefilledData.linkedin = urlParams.get('linkedin');
      if (urlParams.get('twitter')) prefilledData.twitter = urlParams.get('twitter');
      if (urlParams.get('github')) prefilledData.github = urlParams.get('github');
      if (urlParams.get('instagram')) prefilledData.instagram = urlParams.get('instagram');
      
      // También mapear campos legacy
      if (urlParams.get('name') && !prefilledData.fullName) prefilledData.fullName = urlParams.get('name');
      if (urlParams.get('title') && !prefilledData.position) prefilledData.position = urlParams.get('title');
      
      // Actualizar el store con los datos precargados
      if (Object.keys(prefilledData).length > 0) {
        signatureData.update(data => ({
          ...data,
          ...prefilledData
        }));
        
        showToast('success', '✅ Datos cargados desde URL compartida');
      }
    }
    
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
  <div class="mb-6 relative">
    <div class="grid grid-cols-3 gap-3">
      {#each templates as template, index}
        <button 
          on:click={() => selectTemplate(template.id)}
          class="relative overflow-hidden rounded-lg transition-all duration-300 cursor-pointer w-full text-left border-2 template-card {selectedTemplateId === template.id ? 'bg-red-50 border-red-500 shadow-lg selected' : 'bg-white border-gray-300 shadow-sm hover:shadow-md hover:border-red-200'}"
          style="
            height: 50px;
            animation-delay: {index * 100}ms;
            transform: {selectedTemplateId === template.id ? 'translateY(-1px)' : 'translateY(0)'};
          "
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
            padding: 8px;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10;
          ">
            <!-- Solo el nombre -->
            <h3 class="text-xs font-semibold transition-all duration-300 text-center m-0 {selectedTemplateId === template.id ? 'text-accent' : 'text-card-foreground'}"
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
    <div class="text-center mt-4">
      <div class="inline-flex flex-col items-center space-y-4 max-w-xs mx-auto">

        
        <!-- Botón continuar mejorado -->
        <div class="w-full max-w-sm">
          <button 
            on:click={continueToNextStep}
            class="w-full bg-accent text-accent-foreground hover:bg-accent-foreground hover:text-accent border-2 border-accent px-4 py-3 rounded-lg font-semibold transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm"
          >
            <div class="flex items-center justify-center gap-2">
              <span>Continuar</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </div>
          </button>
        </div>
        

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