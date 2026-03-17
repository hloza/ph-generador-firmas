<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  
  export let currentStep: string;
  export let stepsStore: any[];
  
  const dispatch = createEventDispatcher();
  
  function navigateToStep(path: string) {
    dispatch('navigateToStep', { path });
  }

  $: completedSteps = stepsStore.filter(s => s.completed).length;
  $: progressPercentage = Math.round((completedSteps / stepsStore.length) * 100);
</script>

<div class="w-full md:w-[35%] lg:w-[30%] flex-shrink-0 md:h-[calc(100vh-100px)] md:overflow-y-auto hidden-scrollbar">
  <div class="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-xl shadow-slate-200/40">
    <div class="flex items-center justify-between mb-5">
      <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2">
        <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
        </svg>
        Pasos de Configuración
      </h2>
    </div>
    
    <!-- Barra de progreso general -->
    <div class="mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
      <div class="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
        <span>Progreso</span>
        <span class="text-blue-600">{progressPercentage}%</span>
      </div>
      <div class="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden ring-1 ring-inset ring-slate-900/5">
        <div 
          class="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-700 ease-out relative overflow-hidden"
          style="width: {progressPercentage}%"
        >
          <div class="absolute inset-0 bg-white/20 w-full animate-shimmer"></div>
        </div>
      </div>
    </div>

    <div class="space-y-3">
      {#each stepsStore as step, index}
        <div class="step-container">
          <button 
            class="step-item w-full {currentStep === step.id ? 'active' : ''} {step.completed ? 'completed' : ''} group relative overflow-hidden"
            on:click={() => navigateToStep(step.path)}
          >
            <!-- Indicador de conexión vertical -->
            {#if index < stepsStore.length - 1}
              <div class="absolute left-6 top-14 w-0.5 h-6 {step.completed ? 'bg-blue-400' : 'bg-gray-300'} transition-colors duration-300"></div>
            {/if}
            
            <div class="step-icon">
              {#if step.completed}
                <div class="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center shadow-sm">
                  <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                </div>
              {:else if currentStep === step.id}
                <div class="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md">
                  {index + 1}
                </div>
              {:else}
                <div class="w-5 h-5 bg-gray-200 border-2 border-gray-300 rounded-full flex items-center justify-center text-gray-600 text-sm group-hover:border-blue-500 group-hover:text-blue-600 transition-all duration-200">
                  {index + 1}
                </div>
              {/if}
            </div>
            <div class="step-content">
              <h3 class="group-hover:text-white transition-colors duration-200">{step.title}</h3>
              <p class="group-hover:text-slate-300 transition-colors duration-200">{step.description}</p>
            </div>
            
            <!-- Indicador de expansión -->
            {#if currentStep === step.id}
              <div class="step-expand-icon">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            {/if}
          </button>
          
          <!-- Contenido expandido del paso actual -->
          {#if currentStep === step.id}
            <div class="step-expanded-content">
              <slot />
            </div>
          {/if}
        </div>
      {/each}
    </div>
  </div>
</div>

<style lang="postcss">
  .hidden-scrollbar {
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  .hidden-scrollbar::-webkit-scrollbar {
    display: none;
  }

  .step-container {
    @apply relative;
  }

  .step-item {
    @apply flex items-center p-4 rounded-xl text-left transition-all duration-300;
    gap: 1rem;
    @apply bg-white border border-gray-200;
    @apply transform hover:translate-x-1 hover:shadow-lg;
    @apply hover:bg-blue-50 hover:border-blue-400;
    backdrop-filter: blur(10px);
  }
  
  .step-item:hover .step-content h3 {
    @apply text-blue-700;
  }
  
  .step-item:hover .step-content p {
    @apply text-blue-600;
  }
  
  .step-item.active {
    @apply bg-blue-600 border-blue-600;
    @apply shadow-xl transform translate-x-1;
    @apply ring-2 ring-blue-400;
  }
  
  .step-item.completed {
    @apply bg-blue-50 border-blue-300;
    @apply shadow-md;
    @apply hover:bg-blue-100 hover:border-blue-400;
  }
  
  .step-icon {
    @apply w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold;
    @apply transition-all duration-300 flex-shrink-0;
  }
  
  .step-content {
    @apply flex-1 min-w-0;
  }
  
  .step-content h3 {
    @apply font-semibold text-gray-800 text-base mb-1 truncate;
  }
  
  .step-content p {
    @apply text-sm text-gray-600 leading-relaxed;
  }
  
  .step-item.active .step-content h3 {
    @apply text-white font-bold;
  }
  
  .step-item.active .step-content p {
    @apply text-blue-50;
  }
  
  .step-item.completed .step-content h3 {
    @apply text-green-900 font-semibold;
  }
  
  .step-item.completed .step-content p {
    @apply text-green-800;
  }

  .step-expand-icon {
    @apply flex-shrink-0 transition-transform duration-300;
  }

  .step-item.active .step-expand-icon {
    @apply transform rotate-180;
  }

  .step-expanded-content {
    margin-top: 0.5rem;
    padding: 0.75rem;
    background-color: #f8fafc;
    border-radius: 0.75rem;
    border: 1px solid #cbd5e1;
    backdrop-filter: blur(4px);
    max-height: 400px;
    overflow-y: auto;
    animation: slideInUp 0.6s ease-out forwards;
  }

  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes shimmer {
    100% {
      transform: translateX(100%);
    }
  }
  .animate-shimmer {
    transform: translateX(-100%);
    animation: shimmer 2s infinite;
  }
</style>
