<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  
  const dispatch = createEventDispatcher();
  
  function handleShowEmailSimulator() {
    dispatch('showEmailSimulator');
  }
  
  function handleClearAllData() {
    dispatch('clearAllData');
  }
</script>

<header class="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 flex-shrink-0 shadow-sm">
  <div class="max-w-full mx-auto px-4 py-2">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <div class="bg-gradient-to-tr from-blue-700 to-indigo-600 text-white p-2.5 rounded-xl shadow-lg border border-white/20">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
          </svg>
        </div>
        <div>
          <h1 class="text-xl md:text-2xl font-black text-slate-800 tracking-tight">Firmas<span class="text-blue-600">Pro</span></h1>
          <p class="text-xs md:text-sm text-slate-500 font-medium tracking-wide flex items-center gap-1">Generador <span class="hidden md:inline">de firmas corporativas</span></p>
        </div>
      </div>
      <div class="flex items-center space-x-3">
        <button 
          class="flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl transition-all duration-300 text-sm font-semibold shadow-lg shadow-slate-800/20 hover:shadow-xl hover:-translate-y-0.5 group" 
          title="Ver en correo electrónico" 
          aria-label="Ver firma en simulador de correo electrónico"
          on:click={handleShowEmailSimulator}
        >
          <svg class="w-4 h-4 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
          </svg>
          <span class="hidden sm:inline">Simular Correo</span>
        </button>

        <button 
          class="flex items-center space-x-2 px-4 py-2 bg-slate-100/50 hover:bg-red-50 text-slate-600 hover:text-red-600 rounded-xl transition-all duration-300 text-sm font-semibold border border-slate-200 hover:border-red-200 shadow-sm group" 
          aria-label="Limpiar todos los datos"
          on:click={handleClearAllData}
        >
          <svg class="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
          </svg>
          <span>Limpiar Todo</span>
        </button>
      </div>
    </div>
  </div>
</header>
