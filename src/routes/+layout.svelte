<script>
  import '../app.css';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { currentStep, stepsStore, setCurrentStep } from '$lib/stores/navigation';
  import SignaturePreview from '$lib/components/SignaturePreview.svelte';

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
    } else if (currentRoute?.includes('/editor/design')) {
      setCurrentStep('design');
    } else if (currentRoute?.includes('/editor/preview')) {
      setCurrentStep('preview');
    }
  }

  function navigateToStep(stepPath) {
    goto(stepPath);
  }
</script>

<div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
	<!-- Header mejorado -->
	<header class="glass-effect border-b border-slate-700/30 flex-shrink-0 backdrop-blur-xl bg-slate-900/80">
		<div class="max-w-7xl mx-auto px-6 py-5">
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-4">
					<div class="bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 p-3 rounded-2xl neon-glow shadow-lg transform hover:scale-105 transition-transform duration-200">
						<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
						</svg>
					</div>
					<div>
						<h1 class="text-2xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">Generador de Firmas</h1>
						<p class="text-sm text-slate-300 font-medium">Crea firmas profesionales con estilo</p>
					</div>
				</div>
				<div class="flex items-center space-x-4">
					<button class="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-700/50" aria-label="Cambiar tema">
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
						</svg>
					</button>
					<button class="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors">
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
						</svg>
						<span class="text-sm">Ayuda</span>
					</button>
				</div>
			</div>
		</div>
	</header>

	<div class="flex flex-1 max-w-full mx-auto p-6 gap-6 w-full overflow-hidden">
		<!-- Sidebar mejorado con mejor UI - Columna izquierda -->
		<div style="width: 350px; flex-shrink: 0; height: calc(100vh - 120px); overflow-y: auto;">
			<nav class="dark-card p-6 shadow-2xl border border-slate-700/50" style="height: 100%;">
				<div class="flex items-center justify-between mb-8">
					<h2 class="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Progreso</h2>
					<div class="flex items-center space-x-1 text-xs text-slate-400">
						<span class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
						<span>En línea</span>
					</div>
				</div>
				
				<!-- Barra de progreso general -->
				<div class="mb-8">
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
						</button>
					{/each}
				</div>
			</nav>
		</div>

		<!-- Área de contenido principal y vista previa -->
		<div class="flex gap-6" style="flex: 1; min-width: 0;">
			<!-- Contenido principal - Columna central -->
			<div style="width: 350px; flex-shrink: 0; height: calc(100vh - 120px); overflow-y: auto;">
				<div class="dark-card p-6" style="height: 100%; min-height: calc(100vh - 120px);">
					<slot />
				</div>
			</div>

			<!-- Vista previa mejorada - Columna derecha flexible -->
			<div style="flex: 1; min-width: 0; height: calc(100vh - 120px); overflow-y: auto;">
				<div class="dark-card p-6 shadow-2xl border border-slate-700/50" style="height: 100%; min-height: calc(100vh - 120px);">
					<div class="flex items-center justify-between mb-6">
						<h3 class="text-xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">Vista Previa</h3>
						<div class="flex items-center space-x-2">
							<button class="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors" title="Actualizar">
								<svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
								</svg>
							</button>
							<button class="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors" title="Pantalla completa">
								<svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path>
								</svg>
							</button>
						</div>
					</div>
					
					<div class="relative">
						<div class="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl"></div>
						<div class="relative bg-gradient-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-sm rounded-2xl p-6 min-h-[400px] flex items-center justify-center border border-slate-600/30">
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
</div>

<style>
  :global(html) {
    height: 100%;
  }
  
  :global(body) {
    height: 100%;
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