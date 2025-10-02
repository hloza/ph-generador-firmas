<script>
  import '../app.css';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { currentStep, stepsStore, setCurrentStep, canNavigateToStep } from '$lib/stores/navigation';
  import SignaturePreview from '$lib/components/SignaturePreview.svelte';
  import Toast from '$lib/components/Toast.svelte';
  import { showToast, signatureData, resetSignatureData } from '$lib/stores/signature.js';
  import { generateSignatureHTML } from '$lib/utils/signature.js';

  // Estado para el modal de email
  let showEmailModal = false;

  // Función para limpiar todos los datos
  function clearAllData() {
    if (confirm('¿Estás seguro de que quieres limpiar todos los datos? Esta acción no se puede deshacer.')) {
      resetSignatureData();
      showToast('success', '✅ Todos los datos han sido limpiados');
      goto('/');
    }
  }

  // Funciones para el simulador de email
  function showEmailSimulator() {
    showEmailModal = true;
    document.body.style.overflow = 'hidden';
  }

  function closeEmailSimulator() {
    showEmailModal = false;
    document.body.style.overflow = 'auto';
  }

  // Reactive statement para obtener la ruta actual
  $: currentRoute = $page.route.id;
  
  // Actualizar el paso actual basado en la ruta
  $: {
    if (currentRoute === '/') {
      setCurrentStep('template');
    } else if (currentRoute?.includes('/editor/personal')) {
      setCurrentStep('personal');
    } else if (currentRoute?.includes('/editor/contact')) {
      setCurrentStep('contact');
    } else if (currentRoute?.includes('/editor/social')) {
      setCurrentStep('social');
    } else if (currentRoute?.includes('/editor/image')) {
      setCurrentStep('image');
    } else if (currentRoute?.includes('/editor/design')) {
      setCurrentStep('design');
    } else if (currentRoute?.includes('/editor/preview')) {
      setCurrentStep('preview');
    }
  }

  function navigateToStep(stepPath) {
    // Encontrar el ID del paso basado en la ruta
    const targetStep = $stepsStore.find(step => step.path === stepPath);
    if (!targetStep) return;
    
    // Verificar si se puede navegar a este paso
    if (canNavigateToStep(targetStep.id, $stepsStore)) {
      goto(stepPath);
    } else {
      showToast('warning', `⚠️ Completa los pasos anteriores antes de continuar`);
    }
  }
</script>

<div class="bg-background text-foreground flex flex-col">
	<!-- Header mejorado -->
	<header class="glass-effect border-b border-gray-300 flex-shrink-0">
		<div class="max-w-full mx-auto px-4 py-2">
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-4">
					<div class="bg-primary text-primary-foreground p-3 rounded-lg shadow-lg">
						<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
						</svg>
					</div>
					<div>
						<h1 class="text-2xl font-bold text-foreground">Generador de Firmas</h1>
						<p class="text-sm text-muted-foreground">Crea firmas profesionales con estilo</p>
					</div>
				</div>
				<div class="flex items-center space-x-4">
					<button 
						class="flex items-center space-x-2 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium" 
						aria-label="Limpiar todos los datos"
						on:click={clearAllData}
					>
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
						</svg>
						<span>Limpiar Todo</span>
					</button>
				</div>
			</div>
		</div>
	</header>

	<div class="flex flex-1 max-w-full mx-auto p-3 gap-4 w-full">
		<!-- Sidebar expandido con contenido integrado - Columna izquierda -->
		<div style="width: 380px; flex-shrink: 0; height: calc(100vh - 80px); overflow-y: auto;">
			<div class="bg-card text-card-foreground p-4 rounded-lg border border-border shadow-lg">
				<div class="flex items-center justify-between mb-4">
					<h2 class="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Progreso</h2>
					<div class="flex items-center space-x-1 text-xs text-slate-400">
						<span class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
						<span>En línea</span>
					</div>
				</div>
				
				<!-- Barra de progreso general -->
				<div class="mb-4">
					<div class="flex justify-between text-sm text-slate-400 mb-2">
						<span>Completado</span>
						<span>{Math.round(($stepsStore.filter(s => s.completed).length / $stepsStore.length) * 100)}%</span>
					</div>
					<div class="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
						<div 
							class="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500 ease-out"
							style="width: {($stepsStore.filter(s => s.completed).length / $stepsStore.length) * 100}%"
						></div>
					</div>
				</div>

				<div class="space-y-3">
					{#each $stepsStore as step, index}
						<div class="step-container">
							<button 
								class="step-item w-full {$currentStep === step.id ? 'active' : ''} {step.completed ? 'completed' : ''} group relative overflow-hidden"
								on:click={() => navigateToStep(step.path)}
							>
								<!-- Indicador de conexión vertical -->
								{#if index < $stepsStore.length - 1}
									<div class="absolute left-6 top-14 w-0.5 h-6 {step.completed ? 'bg-green-400' : 'bg-slate-700'} transition-colors duration-300"></div>
								{/if}
								
								<div class="step-icon">
									{#if step.completed}
										<div class="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
											<svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
												<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
											</svg>
										</div>
									{:else if $currentStep === step.id}
										<div class="w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold animate-pulse">
											{index + 1}
										</div>
									{:else}
										<div class="w-5 h-5 bg-slate-700 border-2 border-slate-600 rounded-full flex items-center justify-center text-slate-400 text-sm group-hover:border-blue-400 group-hover:text-blue-400 transition-all duration-200">
											{index + 1}
										</div>
									{/if}
								</div>
								<div class="step-content">
									<h3 class="group-hover:text-white transition-colors duration-200">{step.title}</h3>
									<p class="group-hover:text-slate-300 transition-colors duration-200">{step.description}</p>
								</div>
								
								<!-- Indicador de expansión -->
								{#if $currentStep === step.id}
									<div class="step-expand-icon">
										<svg class="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
										</svg>
									</div>
								{/if}
							</button>
							
							<!-- Contenido expandido del paso actual -->
							{#if $currentStep === step.id}
								<div class="step-expanded-content">
									<slot />
								</div>
							{/if}
						</div>
					{/each}
				</div>
			</div>
		</div>

		<!-- Vista previa expandida - Columna derecha flexible -->
		<div style="flex: 1; min-width: 0; height: calc(100vh - 80px); overflow-y: auto;">
			<div class="bg-white text-gray-800 p-4 rounded-lg border border-gray-300 shadow-lg">
				<div class="flex items-center justify-between mb-3">
					<h3 class="text-xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">Vista Previa</h3>
					<div class="flex items-center space-x-2">
						<button 
							class="p-2 rounded-lg bg-purple-600 hover:bg-purple-700 transition-colors" 
							title="Ver en correo electrónico" 
							aria-label="Ver firma en simulador de correo electrónico"
							on:click={showEmailSimulator}
						>
							<svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
								<path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
							</svg>
						</button>
					</div>
				</div>
				
				<div class="relative">
					<div class="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl"></div>
					<div class="relative bg-gradient-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-sm rounded-2xl p-4 min-h-[200px] flex items-start justify-center border border-slate-600/30">
						<SignaturePreview />
					</div>
					
					<!-- Indicadores de estado -->
					<div class="absolute top-3 right-3 flex space-x-2">
						<div class="w-2 h-2 bg-green-400 rounded-full animate-pulse" title="Vista previa activa"></div>
						<div class="w-2 h-2 bg-blue-400 rounded-full" title="Sincronizado"></div>
					</div>
				</div>
				
				<!-- Consejos rápidos -->
				<div class="mt-6 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/20">
					<div class="flex items-start space-x-3">
						<svg class="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
						</svg>
						<div>
							<p class="text-sm font-medium text-blue-300">Consejo</p>
							<p class="text-xs text-slate-400 mt-1">Los cambios se reflejan automáticamente en la vista previa</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<!-- Modal de Simulador de Email -->
{#if showEmailModal}
  <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center" on:click={closeEmailSimulator}>
    <div class="bg-white w-full h-full max-w-7xl max-h-screen mx-4 my-4 rounded-lg shadow-2xl overflow-hidden" on:click|stopPropagation>
      
      <!-- Header del Cliente de Correo -->
      <div class="bg-gray-100 border-b border-gray-300 p-4 flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <svg class="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
          </svg>
          <h2 class="text-lg font-semibold text-gray-800">Cliente de Correo - Vista Previa</h2>
        </div>
        <button 
          class="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-200"
          on:click={closeEmailSimulator}
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Contenido del Email -->
      <div class="bg-white h-full overflow-auto p-8">
        <div class="max-w-4xl mx-auto">
          
          <!-- Header del Email -->
          <div class="bg-gray-50 border border-gray-200 rounded-t-lg p-4 mb-0">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <span class="text-white font-semibold text-sm">
                    {($signatureData.name || $signatureData.fullName || 'Usuario').charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <div class="font-semibold text-gray-900">
                    {$signatureData.name || $signatureData.fullName || 'Nombre Usuario'}
                  </div>
                  <div class="text-sm text-gray-600">
                    {$signatureData.email || 'usuario@empresa.com'}
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
              {@html generateSignatureHTML($signatureData)}
            </div>
          </div>

          <!-- Footer del Email -->
          <div class="bg-gray-50 border border-gray-200 rounded-b-lg p-4">
            <div class="flex items-center justify-between text-xs text-gray-500">
              <div class="flex items-center space-x-4">
                <button class="hover:text-gray-700">Responder</button>
                <button class="hover:text-gray-700">Reenviar</button>
                <button class="hover:text-gray-700">Archivar</button>
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

<!-- Componente de Toast -->
<Toast />

<style>
  :global(html) {
    /* altura removida para permitir contenido dinámico */
  }
  
  :global(body) {
    margin: 0;
    font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }

  /* Estilos mejorados para elementos interactivos */
  .step-item {
    @apply flex items-center p-4 rounded-xl text-left transition-all duration-300;
    gap: 1rem;
    @apply bg-slate-800/30 hover:bg-slate-700/50 border border-slate-700/30;
    @apply transform hover:translate-x-1 hover:shadow-lg hover:shadow-blue-500/10;
    backdrop-filter: blur(10px);
  }
  
  .step-item.active {
    @apply bg-gradient-to-r from-blue-600/40 to-purple-600/40 border-blue-400/60;
    @apply shadow-xl shadow-blue-500/25 transform translate-x-1;
    @apply ring-1 ring-blue-400/30;
  }
  
  .step-item.completed {
    @apply bg-gradient-to-r from-green-600/25 to-emerald-600/25 border-green-400/50;
    @apply shadow-lg shadow-green-500/15;
  }
  
  .step-icon {
    @apply w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold;
    @apply transition-all duration-300 flex-shrink-0;
  }
  
  .step-content {
    @apply flex-1 min-w-0;
  }
  
  .step-content h3 {
    @apply font-semibold text-slate-200 text-base mb-1 truncate;
  }
  
  .step-content p {
    @apply text-sm text-slate-400 leading-relaxed;
  }

  /* Contenedor del paso con contenido expandible */
  .step-container {
    @apply relative;
  }

  /* Icono de expansión */
  .step-expand-icon {
    @apply flex-shrink-0 transition-transform duration-300;
  }

  .step-item.active .step-expand-icon {
    @apply transform rotate-180;
  }

  /* Contenido expandido */
  .step-expanded-content {
    margin-top: 0.5rem;
    padding: 0.75rem;
    background-color: rgba(30, 41, 59, 0.2);
    border-radius: 0.75rem;
    border: 1px solid rgba(71, 85, 105, 0.3);
    backdrop-filter: blur(4px);
    max-height: 400px;
    overflow-y: auto;
    animation: slideInUp 0.6s ease-out forwards;
  }

  /* Estilo para el contenido de los pasos */
  .step-expanded-content :global(*) {
    color: inherit;
  }

  .step-expanded-content :global(.bg-white) {
    background-color: rgba(255, 255, 255, 0.95) !important;
    backdrop-filter: blur(10px);
  }

  /* Animaciones suaves */
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

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  .animate-slideInUp {
    animation: slideInUp 0.5s ease-out;
  }

  /* Mejores scrollbars */
  :global(::-webkit-scrollbar) {
    width: 6px;
  }

  :global(::-webkit-scrollbar-track) {
    background: rgb(30 41 59 / 0.5);
    border-radius: 3px;
  }

  :global(::-webkit-scrollbar-thumb) {
    background: linear-gradient(to bottom, rgb(59 130 246), rgb(147 51 234));
    border-radius: 3px;
  }

  :global(::-webkit-scrollbar-thumb:hover) {
    background: linear-gradient(to bottom, rgb(37 99 235), rgb(126 34 206));
  }
</style>