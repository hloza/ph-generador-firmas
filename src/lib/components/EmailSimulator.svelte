<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { generateSignatureHTML } from '$lib/utils/signature.js';
  
  export let show: boolean;
  export let signatureData: any;
  export let viewMode: 'desktop' | 'mobile' = 'desktop';
  
  const dispatch = createEventDispatcher();
  
  function handleClose() {
    dispatch('close');
  }

  function setViewMode(mode: 'desktop' | 'mobile') {
    viewMode = mode;
  }
</script>

{#if show}
  <div class="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-300">
    <button 
      type="button"
      class="absolute inset-0 w-full h-full cursor-default" 
      aria-label="Cerrar modal" 
      on:click={handleClose}
    ></button>
    <div class="bg-white w-full h-full {viewMode === 'desktop' ? 'max-w-6xl' : 'max-w-md'} max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 relative z-10 flex flex-col">
      
      <!-- Header del Cliente de Correo -->
      <div class="bg-slate-100 border-b border-slate-300 p-4 flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
          </svg>
          <h2 class="text-lg font-semibold text-slate-800">Vista en Correo Electrónico</h2>
        </div>
        
        <!-- Botones Desktop/Móvil -->
        <div class="flex items-center space-x-2">
          <button 
            type="button"
            class="flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 {viewMode === 'desktop' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-300'}"
            on:click={() => setViewMode('desktop')}
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H9.2l-.9 2H9.2l.771-2z" clip-rule="evenodd"></path>
            </svg>
            <span class="text-sm font-medium">Escritorio</span>
          </button>
          
          <button 
            type="button"
            class="flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 {viewMode === 'mobile' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-300'}"
            on:click={() => setViewMode('mobile')}
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zM6 4a1 1 0 011-1h6a1 1 0 011 1v10a1 1 0 01-1 1H7a1 1 0 01-1-1V4zm2 12a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clip-rule="evenodd"></path>
            </svg>
            <span class="text-sm font-medium">Móvil</span>
          </button>
          
          <button 
            type="button"
            class="text-slate-500 hover:text-slate-700 p-2 rounded-full hover:bg-slate-200 ml-2"
            aria-label="Cerrar vista de correo"
            on:click={handleClose}
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Contenido del Email -->
      <div class="bg-slate-100 flex-1 overflow-auto p-4 md:p-8">
        <div class="max-w-3xl mx-auto shadow-sm">
          
          <!-- Header del Email -->
          <div class="bg-slate-50 border border-slate-200 rounded-t-lg p-4 mb-0">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shadow-sm">
                  <span class="text-white font-semibold text-sm">
                    {(signatureData?.name || signatureData?.fullName || 'Usuario').charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <div class="font-semibold text-gray-900">
                    {signatureData?.fullName || signatureData?.name || 'Nombre Usuario'}
                  </div>
                  <div class="text-sm text-gray-600">
                    {signatureData?.email || 'usuario@empresa.com'}
                  </div>
                </div>
              </div>
              <div class="text-sm text-gray-500">
                Hace 2 minutos
              </div>
            </div>
            
            <div class="text-sm text-gray-600 mb-2">
              <strong>Para:</strong> cliente@empresa.com
            </div>
            <div class="text-sm text-gray-600 mb-2">
              <strong>Asunto:</strong> Información importante sobre nuestros servicios
            </div>
          </div>

          <!-- Cuerpo del Email -->
          <div class="bg-white border-l border-r border-gray-200 p-6">
            <div class="prose max-w-none">
              <p class="text-gray-800 leading-relaxed mb-4">
                Estimado cliente,
              </p>
              <p class="text-gray-800 leading-relaxed mb-4">
                Espero que este mensaje le encuentre bien. Le escribo para informarle sobre las últimas novedades de nuestros servicios y cómo podemos ayudarle a alcanzar sus objetivos empresariales.
              </p>
              <p class="text-gray-800 leading-relaxed mb-4">
                Quedamos a su disposición para cualquier consulta que pueda tener.
              </p>
              <p class="text-gray-800 leading-relaxed mb-6">
                Saludos cordiales,
              </p>
            </div>

            <!-- Aquí se renderiza la firma -->
            <div class="border-t border-gray-200 pt-4">
              {@html generateSignatureHTML(signatureData, viewMode === 'mobile')}
            </div>
          </div>

          <!-- Footer del Email -->
          <div class="bg-gray-50 border border-t-0 border-gray-200 rounded-b-lg p-4">
            <div class="flex items-center justify-between text-xs text-gray-500">
              <div class="flex items-center space-x-4">
                <button type="button" aria-label="Responder al mensaje" class="hover:text-gray-800 transition-colors bg-white px-4 py-2 rounded-md border border-gray-200 font-medium shadow-sm">Responder</button>
                <button type="button" aria-label="Reenviar el mensaje" class="hover:text-gray-800 transition-colors bg-white px-4 py-2 rounded-md border border-gray-200 font-medium shadow-sm">Reenviar</button>
                <div class="h-4 w-px bg-gray-300"></div>
                <button type="button" aria-label="Archivar correo" class="hover:text-gray-800 transition-colors">Archivar</button>
              </div>
              <div>
                Gmail
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}
