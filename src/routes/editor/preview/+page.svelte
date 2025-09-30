<script lang="ts">
  import { signatureData } from '$lib/stores/signature.js';
  import { markStepAsCompleted, getPreviousStep } from '$lib/stores/navigation';
  import { goto } from '$app/navigation';
  import { templates, availableColors } from '$lib/data/templates.js';

  let copySuccess = false;
  let downloadFormat = 'html';

  function goBack() {
    const previousStep = getPreviousStep('preview');
    if (previousStep) {
      goto(previousStep.path);
    }
  }

  function getSelectedTemplate() {
    return templates.find(t => t.id === $signatureData.templateId) || templates[0];
  }

  function getColorName(colorValue: string) {
    const color = availableColors.find(c => c.value === colorValue);
    return color ? color.name : 'Personalizado';
  }

  function generateSignatureHTML() {
    const template = getSelectedTemplate();
    const data = $signatureData;
    
    // Obtener los estilos de fuente
    const fontFamilies = {
      'modern': 'Arial, sans-serif',
      'classic': 'Georgia, serif', 
      'minimal': 'Courier, monospace'
    };
    
    const fontSizes = {
      'small': '14px',
      'medium': '16px',
      'large': '18px'
    };

    return `
<div style="font-family: ${fontFamilies[data.fontFamily] || fontFamilies.modern}; max-width: 400px;">
  <div style="margin-bottom: 10px;">
    <h3 style="color: ${data.primaryColor}; font-size: ${fontSizes[data.fontSize] || fontSizes.medium}; font-weight: bold; margin: 0 0 5px 0;">
      ${data.name || 'Tu Nombre'}
    </h3>
    <p style="color: ${data.accentColor}; font-size: ${fontSizes[data.fontSize] || fontSizes.medium}; font-weight: 500; margin: 0 0 3px 0;">
      ${data.title || 'Tu Título'}
    </p>
    <p style="color: #666; font-size: ${fontSizes[data.fontSize] || fontSizes.medium}; margin: 0 0 8px 0;">
      ${data.company || 'Tu Empresa'}${data.department ? ` - ${data.department}` : ''}
    </p>
  </div>
  
  <div style="height: 1px; width: 60px; background-color: ${data.accentColor}; margin: 10px 0;"></div>
  
  <div style="font-size: 14px; color: #666;">
    ${data.email ? `
    <div style="margin: 3px 0; display: flex; align-items: center;">
      <span style="color: ${data.primaryColor}; margin-right: 8px;">📧</span>
      <a href="mailto:${data.email}" style="color: #666; text-decoration: none;">${data.email}</a>
    </div>
    ` : ''}
    
    ${data.phone ? `
    <div style="margin: 3px 0; display: flex; align-items: center;">
      <span style="color: ${data.primaryColor}; margin-right: 8px;">📱</span>
      <span>${data.phone}</span>
    </div>
    ` : ''}
    
    ${data.website ? `
    <div style="margin: 3px 0; display: flex; align-items: center;">
      <span style="color: ${data.primaryColor}; margin-right: 8px;">🌐</span>
      <a href="${data.website.startsWith('http') ? data.website : 'https://' + data.website}" style="color: ${data.primaryColor}; text-decoration: none;">${data.website}</a>
    </div>
    ` : ''}
    
    ${data.address ? `
    <div style="margin: 3px 0; display: flex; align-items: center;">
      <span style="color: ${data.primaryColor}; margin-right: 8px;">📍</span>
      <span>${data.address}</span>
    </div>
    ` : ''}
  </div>
  
  ${data.linkedin || data.twitter || data.github || data.instagram ? `
  <div style="margin-top: 12px; padding-top: 8px; border-top: 1px solid #eee;">
    <div style="display: flex; gap: 8px;">
      ${data.linkedin ? `
      <a href="${data.linkedin}" style="display: inline-block; width: 24px; height: 24px; background-color: ${data.primaryColor}; border-radius: 4px; text-decoration: none; text-align: center; line-height: 24px; color: white; font-size: 12px;">in</a>
      ` : ''}
      
      ${data.twitter ? `
      <a href="${data.twitter}" style="display: inline-block; width: 24px; height: 24px; background-color: ${data.accentColor}; border-radius: 4px; text-decoration: none; text-align: center; line-height: 24px; color: white; font-size: 12px;">tw</a>
      ` : ''}
      
      ${data.github ? `
      <a href="${data.github}" style="display: inline-block; width: 24px; height: 24px; background-color: #333; border-radius: 4px; text-decoration: none; text-align: center; line-height: 24px; color: white; font-size: 12px;">gh</a>
      ` : ''}
      
      ${data.instagram ? `
      <a href="${data.instagram}" style="display: inline-block; width: 24px; height: 24px; background-color: #E4405F; border-radius: 4px; text-decoration: none; text-align: center; line-height: 24px; color: white; font-size: 12px;">ig</a>
      ` : ''}
    </div>
  </div>
  ` : ''}
</div>`;
  }

  async function copyToClipboard() {
    try {
      const html = generateSignatureHTML();
      await navigator.clipboard.writeText(html);
      copySuccess = true;
      setTimeout(() => copySuccess = false, 3000);
    } catch (err) {
      console.error('Error copiando al portapapeles:', err);
    }
  }

  function downloadSignature() {
    const html = generateSignatureHTML();
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mi-firma.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function startOver() {
    // Resetear datos y volver al inicio
    signatureData.set({
      templateId: '',
      name: '',
      title: '',
      company: '',
      department: '',
      email: '',
      phone: '',
      website: '',
      address: '',
      linkedin: '',
      twitter: '',
      github: '',
      instagram: '',
      facebook: '',
      youtube: '',
      primaryColor: '#3b82f6',
      accentColor: '#8b5cf6',
      fontSize: 'medium',
      fontFamily: 'modern'
    });
    goto('/');
  }

  // Marcar este paso como completado al cargar
  markStepAsCompleted('preview');
</script>

<svelte:head>
  <title>Vista Previa Final - Generador de Firmas</title>
</svelte:head>

<div class="max-w-6xl mx-auto">
  <!-- Header -->
  <div class="text-center mb-8">
    <div class="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl mb-4 shadow-lg shadow-green-500/25">
      <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
    </div>
    <h1 class="text-3xl font-bold gradient-text mb-2">¡Tu Firma Está Lista!</h1>
    <p class="text-lg text-slate-400">Revisa, copia o descarga tu firma personalizada</p>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
    <!-- Vista Previa Principal -->
    <div class="lg:col-span-2">
      <div class="dark-card p-8">
        <h2 class="text-xl font-semibold text-slate-200 mb-6">Vista Previa Final</h2>
        
        <!-- Firma renderizada -->
        <div class="bg-white p-8 rounded-lg border-2 border-dashed border-slate-300">
          {@html generateSignatureHTML()}
        </div>
        
        <!-- Instrucciones -->
        <div class="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <h3 class="text-sm font-medium text-blue-300 mb-2">📋 Cómo usar tu firma</h3>
          <div class="text-xs text-slate-400 space-y-1">
            <p>1. Copia el código HTML o descarga el archivo</p>
            <p>2. En tu cliente de email, ve a Configuración > Firma</p>
            <p>3. Pega el código en el editor HTML de firmas</p>
            <p>4. Guarda los cambios y ¡listo!</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Panel de Acciones -->
    <div class="space-y-6">
      <!-- Resumen de configuración -->
      <div class="dark-card p-6">
        <h3 class="text-lg font-semibold text-slate-200 mb-4">Configuración</h3>
        
        <div class="space-y-3 text-sm">
          <div class="flex justify-between">
            <span class="text-slate-400">Plantilla:</span>
            <span class="text-slate-200">{getSelectedTemplate().name}</span>
          </div>
          
          <div class="flex justify-between">
            <span class="text-slate-400">Color principal:</span>
            <div class="flex items-center space-x-2">
              <div class="w-4 h-4 rounded" style="background-color: {$signatureData.primaryColor}"></div>
              <span class="text-slate-200">{getColorName($signatureData.primaryColor)}</span>
            </div>
          </div>
          
          <div class="flex justify-between">
            <span class="text-slate-400">Color de acento:</span>
            <div class="flex items-center space-x-2">
              <div class="w-4 h-4 rounded" style="background-color: {$signatureData.accentColor}"></div>
              <span class="text-slate-200">{getColorName($signatureData.accentColor)}</span>
            </div>
          </div>
          
          <div class="flex justify-between">
            <span class="text-slate-400">Tamaño de fuente:</span>
            <span class="text-slate-200 capitalize">{$signatureData.fontSize}</span>
          </div>
          
          <div class="flex justify-between">
            <span class="text-slate-400">Estilo de fuente:</span>
            <span class="text-slate-200 capitalize">{$signatureData.fontFamily}</span>
          </div>
        </div>
      </div>

      <!-- Acciones -->
      <div class="dark-card p-6">
        <h3 class="text-lg font-semibold text-slate-200 mb-4">Descargar</h3>
        
        <div class="space-y-4">
          <!-- Copiar al portapapeles -->
          <button
            on:click={copyToClipboard}
            class="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-300"
          >
            {#if copySuccess}
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              ¡Copiado!
            {:else}
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
              </svg>
              Copiar HTML
            {/if}
          </button>
          
          <!-- Descargar archivo -->
          <button
            on:click={downloadSignature}
            class="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold rounded-lg transition-all duration-300"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            Descargar HTML
          </button>
        </div>
      </div>

      <!-- Clientes de email populares -->
      <div class="dark-card p-6">
        <h3 class="text-lg font-semibold text-slate-200 mb-4">Guías por Cliente</h3>
        
        <div class="space-y-2 text-sm">
          <a href="#" class="flex items-center justify-between p-2 hover:bg-slate-700/30 rounded">
            <span class="text-slate-300">Gmail</span>
            <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
            </svg>
          </a>
          
          <a href="#" class="flex items-center justify-between p-2 hover:bg-slate-700/30 rounded">
            <span class="text-slate-300">Outlook</span>
            <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
            </svg>
          </a>
          
          <a href="#" class="flex items-center justify-between p-2 hover:bg-slate-700/30 rounded">
            <span class="text-slate-300">Apple Mail</span>
            <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  </div>

  <!-- Botones de navegación -->
  <div class="flex justify-between items-center mt-8 pt-6 border-t border-slate-700">
    <button
      on:click={goBack}
      class="flex items-center px-6 py-3 text-slate-400 hover:text-white transition-colors"
    >
      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
      </svg>
      Personalización
    </button>

    <button
      on:click={startOver}
      class="flex items-center px-8 py-3 border border-slate-600 hover:border-slate-500 text-slate-300 hover:text-white font-semibold rounded-lg transition-all duration-300"
    >
      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
      </svg>
      Crear Nueva Firma
    </button>
  </div>
</div>