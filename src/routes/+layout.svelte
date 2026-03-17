<script lang="ts">
  import '../app.css';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { currentStep, stepsStore, setCurrentStep, canNavigateToStep, resetAllSteps } from '$lib/stores/navigation.js';
  import SignaturePreview from '$lib/components/SignaturePreview.svelte';
  import TemplateSelector from '$lib/components/TemplateSelector.svelte';
  import Toast from '$lib/components/Toast.svelte';
  import Header from '$lib/components/Header.svelte';
  import Sidebar from '$lib/components/Sidebar.svelte';
  import EmailSimulator from '$lib/components/EmailSimulator.svelte';
  import { showToast, signatureData, clearAllAppData, preventBackNavigation } from '$lib/stores/signature.js';
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';

  let showEmailModal = false;
  let emailViewMode: 'desktop' | 'mobile' = 'desktop';

  onMount(() => {
    if (browser) {
      const navEntry = performance.getEntriesByType('navigation')[0];
      const isPageReload = performance.navigation?.type === 1 || (navEntry as PerformanceNavigationTiming)?.type === 'reload';
      
      if (isPageReload) {
        localStorage.removeItem('signatureData');
        resetAllSteps();
        signatureData.set({
          fullName: '',
          position: '',
          email: '',
          phone: '',
          website: '',
          address: '',
          company: '',
          socialLinks: [
            { platform: 'linkedin', url: '', enabled: false },
            { platform: 'twitter', url: '', enabled: false },
            { platform: 'github', url: '', enabled: false },
            { platform: 'instagram', url: '', enabled: false },
            { platform: 'facebook', url: '', enabled: false },
            { platform: 'youtube', url: '', enabled: false }
          ],
          primaryColor: '#1e40af',
          templateId: 'minimal-1',
          name: '',
          title: '',
          department: '',
          linkedin: '',
          twitter: '',
          github: '',
          instagram: '',
          accentColor: '#d97706',
          fontFamily: 'modern'
        });
        
        if (window.location.pathname !== '/') {
          goto('/');
        }
      }
    }
  });

  function clearAllData() {
    if (confirm('¿Estás seguro de que quieres limpiar todos los datos? Esta acción limpiará todo: localStorage, cache, cookies y datos guardados. No podrás volver atrás.')) {
      clearAllAppData();
      resetAllSteps();
      preventBackNavigation();
      showToast('success', '✅ Todos los datos han sido limpiados completamente');
      goto('/').then(() => {
        setTimeout(() => {
          window.location.href = window.location.origin + '/?nocache=' + Date.now();
        }, 100);
      });
    }
  }

  function showEmailSimulator() {
    showEmailModal = true;
    emailViewMode = 'desktop';
    document.body.style.overflow = 'hidden';
  }

  function closeEmailSimulator() {
    showEmailModal = false;
    document.body.style.overflow = 'auto';
  }

  $: currentRoute = $page.route.id;
  
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

  function handleNavigateToStep(event: CustomEvent<{path: string}>) {
    const { path } = event.detail;
    const targetStep = $stepsStore.find(step => step.path === path);
    if (!targetStep) return;
    
    if (canNavigateToStep(targetStep.id, $stepsStore)) {
      goto(path);
    } else {
      showToast('info', `⚠️ Completa los pasos anteriores antes de continuar`);
    }
  }
</script>

<div class="bg-slate-50 text-slate-800 flex flex-col min-h-screen">
  <Header 
    on:showEmailSimulator={showEmailSimulator} 
    on:clearAllData={clearAllData} 
  />

  <main class="flex-1 flex flex-col max-w-[1600px] mx-auto p-4 md:p-6 gap-6 w-full animate-fade-in overflow-hidden">
    <div class="flex flex-col lg:flex-row flex-1 gap-6 w-full overflow-hidden">
      
      <Sidebar 
        currentStep={$currentStep} 
        stepsStore={$stepsStore} 
        on:navigateToStep={handleNavigateToStep}
      >
        <slot />
      </Sidebar>

      <!-- Contenedor Central y Derecho -->
      <div class="flex-1 flex flex-col md:flex-row gap-6 overflow-hidden">
        <!-- Vista Previa (Centro) -->
        <div class="flex-1 md:h-[calc(100vh-100px)] md:overflow-y-auto hidden-scrollbar">
          <div class="relative sticky top-0">
            <div class="absolute inset-0 bg-gradient-to-tr from-slate-50 to-indigo-50/30 rounded-2xl lg:rounded-[3rem]"></div>
            <div class="relative bg-white/40 backdrop-blur-xl rounded-2xl lg:rounded-[3rem] p-4 md:p-12 min-h-[450px] flex items-center justify-center border border-white/60 group">
              <SignaturePreview />
            </div>
          </div>
        </div>

        <!-- Plantillas (Derecha) -->
        <div class="w-full md:w-56 lg:w-64 flex-shrink-0 md:h-[calc(100vh-100px)] md:overflow-y-auto hidden-scrollbar">
          <div class="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-xl shadow-slate-200/40">
            <h3 class="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"></path>
              </svg>
              Plantillas
            </h3>
            <TemplateSelector />
          </div>
        </div>
      </div>
    </div>
  </main>
</div>

<EmailSimulator 
  show={showEmailModal} 
  signatureData={$signatureData} 
  viewMode={emailViewMode}
  on:close={closeEmailSimulator}
/>

<Toast />

<style lang="postcss">
  :global(body) {
    margin: 0;
    font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }

  .hidden-scrollbar {
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  .hidden-scrollbar::-webkit-scrollbar {
    display: none;
  }
  
  .animate-fade-in {
    animation: fadeIn 0.4s ease-out forwards;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  :global(::-webkit-scrollbar) {
    width: 6px;
    height: 6px;
  }

  :global(::-webkit-scrollbar-thumb) {
    background: #cbd5e1;
    border-radius: 4px;
  }

  :global(::-webkit-scrollbar-thumb:hover) {
    background: #94a3b8;
  }
</style>