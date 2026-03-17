<script lang="ts">
  import { templates } from '$lib/data/templates.js';
  import { signatureData, showToast, clearAllAppData } from '$lib/stores/signature.js';
  import { goto } from '$app/navigation';
  import { markStepAsCompleted, getNextStep, markAllStepsAsCompleted } from '$lib/stores/navigation.js';
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { browser } from '$app/environment';

  // Variable reactiva para obtener el template seleccionado
  $: selectedTemplateId = $signatureData.templateId;
  $: selectedTemplate = selectedTemplateId ? templates.find(t => t.id === selectedTemplateId) : null;

  let isLoaded = false;

  onMount(() => {
    // Verificar si es una recarga de página (F5 o Ctrl+R)
    if (browser && performance.navigation.type === 1) {
      // Es una recarga - limpiar TODOS los datos
      console.log('🔄 Recarga detectada - limpiando todos los datos...');
      clearAllAppData();
      
      // Forzar recarga completa sin cache
      window.location.href = window.location.origin + '/?cleaned=' + Date.now();
      return; // Salir temprano para evitar procesamiento adicional
    }
    
    // Cargar datos desde URL parameters si están disponibles
    const urlParams = $page.url.searchParams;
    
    // Verificar si venimos de una limpieza
    if (urlParams.has('cleaned') || urlParams.has('nocache')) {
      console.log('✅ Página limpiada - estado inicial');
      // Limpiar el parámetro de la URL
      window.history.replaceState({}, '', '/');
      isLoaded = true;
      return;
    }
    
    // Solo procesar parámetros URL si realmente hay parámetros nuevos
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
      
      // Cargar datos de imagen desde URL
      if (urlParams.get('imageUrl')) {
        prefilledData.image = {
          url: urlParams.get('imageUrl')!,
          shape: (urlParams.get('imageShape') as 'circle' | 'square' | 'rounded') || 'circle',
          size: (urlParams.get('imageSize') as 'small' | 'medium' | 'large') || 'medium'
        };
      }
      
      // También mapear campos legacy
      if (urlParams.get('name') && !prefilledData.fullName) prefilledData.fullName = urlParams.get('name');
      if (urlParams.get('title') && !prefilledData.position) prefilledData.position = urlParams.get('title');
      
      // Actualizar el store con los datos precargados SOLO si hay datos nuevos
      if (Object.keys(prefilledData).length > 0) {
        // Forzar una actualización completa del store
        signatureData.set({
          ...$signatureData,
          ...prefilledData
        });
        
        // Esperar un tick para que el store se actualice
        setTimeout(() => {
          // Marcar todos los pasos como completados cuando se cargan datos desde URL
          markAllStepsAsCompleted();
          
          showToast('success', '✅ Datos cargados desde URL compartida');
        }, 50);
      }
    }
    // Si NO hay parámetros URL o ya terminamos de procesarlos, redirigir a personal
    setTimeout(() => {
      goto('/editor/personal', { replaceState: true });
    }, 100);
  });
</script>

<svelte:head>
  <title>Generador de Firmas de Email - Cargando...</title>
</svelte:head>

<!-- Estado de carga invisible u opcional -->
<div class="flex items-center justify-center h-full min-h-[50vh]">
  <div class="animate-pulse flex flex-col items-center">
    <div class="h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    <span class="mt-4 text-slate-500 text-sm font-medium">Preparando editor...</span>
  </div>
</div>