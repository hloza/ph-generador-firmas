<script lang="ts">
  import { signatureData, showToast } from '$lib/stores/signature.js';
  import { generateSignatureHTML, copyToClipboard, downloadFile, formatFileName } from '$lib/utils/signature.js';
  import { onMount } from 'svelte';

  let isExporting = false;
  let generatedURL = '';
  let htmlToImage: any = null;

  onMount(async () => {
    // Importar html-to-image dinámicamente
    if (typeof window !== 'undefined') {
      htmlToImage = await import('html-to-image');
    }
  });

  async function copyHTML() {
    try {
      const html = generateSignatureHTML($signatureData);
      const success = await copyToClipboard(html);
      
      if (success) {
        showToast('success', 'HTML copiado al portapapeles');
      } else {
        showToast('error', 'Error al copiar HTML');
      }
    } catch (error) {
      console.error('Error copying HTML:', error);
      showToast('error', 'Error al generar HTML');
    }
  }

  async function downloadPNG() {
    if (!htmlToImage) {
      showToast('error', 'Error: Funcionalidad de imagen no disponible');
      return;
    }

    try {
      isExporting = true;
      
      // Crear elemento temporal con la firma
      const tempElement = document.createElement('div');
      tempElement.innerHTML = generateSignatureHTML($signatureData);
      tempElement.style.cssText = `
        position: absolute;
        top: -9999px;
        left: -9999px;
        width: 600px;
        padding: 20px;
        background: white;
        font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      `;
      
      document.body.appendChild(tempElement);
      
      // Generar imagen
      const dataUrl = await htmlToImage.toPng(tempElement, {
        width: 640,
        height: 400,
        backgroundColor: 'white',
        pixelRatio: 2,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left',
        }
      });
      
      // Limpiar elemento temporal
      document.body.removeChild(tempElement);
      
      // Descargar imagen
      const link = document.createElement('a');
      link.download = `firma-${formatFileName($signatureData.fullName)}.png`;
      link.href = dataUrl;
      link.click();
      
      showToast('success', 'Imagen PNG descargada correctamente');
      
    } catch (error) {
      console.error('Error generating PNG:', error);
      showToast('error', 'Error al generar imagen PNG');
    } finally {
      isExporting = false;
    }
  }

  async function downloadSVG() {
    if (!htmlToImage) {
      showToast('error', 'Error: Funcionalidad de imagen no disponible');
      return;
    }

    try {
      isExporting = true;
      
      // Crear elemento temporal con la firma
      const tempElement = document.createElement('div');
      tempElement.innerHTML = generateSignatureHTML($signatureData);
      tempElement.style.cssText = `
        position: absolute;
        top: -9999px;
        left: -9999px;
        width: 600px;
        padding: 20px;
        background: white;
        font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      `;
      
      document.body.appendChild(tempElement);
      
      // Generar SVG
      const dataUrl = await htmlToImage.toSvg(tempElement, {
        width: 640,
        height: 400,
        backgroundColor: 'white',
      });
      
      // Limpiar elemento temporal
      document.body.removeChild(tempElement);
      
      // Descargar SVG
      const link = document.createElement('a');
      link.download = `firma-${formatFileName($signatureData.fullName)}.svg`;
      link.href = dataUrl;
      link.click();
      
      showToast('success', 'Imagen SVG descargada correctamente');
      
    } catch (error) {
      console.error('Error generating SVG:', error);
      showToast('error', 'Error al generar imagen SVG');
    } finally {
      isExporting = false;
    }
  }

  async function generateURL() {
    try {
      // En un proyecto real, esto enviaría los datos a un servidor
      // Por ahora, simulamos la generación de URL
      const signatureId = Math.random().toString(36).substr(2, 9);
      const baseUrl = window.location.origin;
      generatedURL = `${baseUrl}/signature/${signatureId}`;
      
      // Simular guardado en servidor (en un proyecto real)
      localStorage.setItem(`signature_${signatureId}`, JSON.stringify($signatureData));
      
      showToast('success', 'URL generada correctamente');
    } catch (error) {
      console.error('Error generating URL:', error);
      showToast('error', 'Error al generar URL');
    }
  }

  async function copyURL() {
    if (!generatedURL) {
      await generateURL();
    }
    
    const success = await copyToClipboard(generatedURL);
    
    if (success) {
      showToast('success', 'URL copiada al portapapeles');
    } else {
      showToast('error', 'Error al copiar URL');
    }
  }

  function downloadHTML() {
    try {
      const html = generateSignatureHTML($signatureData);
      const fullHTML = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Firma de ${$signatureData.fullName}</title>
</head>
<body style="margin: 0; padding: 20px; background-color: #f9fafb; font-family: Arial, sans-serif;">
    ${html}
</body>
</html>
      `;
      
      downloadFile(
        fullHTML,
        `firma-${formatFileName($signatureData.fullName)}.html`,
        'text/html'
      );
      
      showToast('success', 'Archivo HTML descargado correctamente');
    } catch (error) {
      console.error('Error downloading HTML:', error);
      showToast('error', 'Error al descargar HTML');
    }
  }

  // Información sobre compatibilidad
  const emailClients = [
    { name: 'Gmail', compatible: true, note: 'Totalmente compatible' },
    { name: 'Outlook', compatible: true, note: 'Compatible con limitaciones de CSS' },
    { name: 'Apple Mail', compatible: true, note: 'Totalmente compatible' },
    { name: 'Thunderbird', compatible: true, note: 'Compatible' },
    { name: 'Yahoo Mail', compatible: false, note: 'Compatibilidad limitada' },
  ];
</script>

<div class="space-y-8">
  <!-- Header -->
  <div>
    <h2 class="text-2xl font-bold text-gray-900 mb-2">Exportar Firma</h2>
    <p class="text-gray-600">Descarga o copia tu firma en diferentes formatos</p>
  </div>

  <!-- Opciones de exportación -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    
    <!-- Copiar HTML -->
    <div class="card p-6">
      <div class="flex items-start space-x-4">
        <div class="flex-shrink-0">
          <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
            </svg>
          </div>
        </div>
        <div class="flex-1">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Copiar HTML</h3>
          <p class="text-sm text-gray-600 mb-4">
            Copia el código HTML optimizado para clientes de correo electrónico
          </p>
          <button
            class="btn-primary w-full"
            on:click={copyHTML}
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
            </svg>
            Copiar HTML
          </button>
        </div>
      </div>
    </div>

    <!-- Descargar HTML -->
    <div class="card p-6">
      <div class="flex items-start space-x-4">
        <div class="flex-shrink-0">
          <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
        </div>
        <div class="flex-1">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Descargar HTML</h3>
          <p class="text-sm text-gray-600 mb-4">
            Descarga un archivo HTML completo listo para usar
          </p>
          <button
            class="btn-secondary w-full"
            on:click={downloadHTML}
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M7 13h10v8a2 2 0 01-2 2H9a2 2 0 01-2-2v-8z"></path>
            </svg>
            Descargar HTML
          </button>
        </div>
      </div>
    </div>

    <!-- Descargar PNG -->
    <div class="card p-6">
      <div class="flex items-start space-x-4">
        <div class="flex-shrink-0">
          <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          </div>
        </div>
        <div class="flex-1">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Imagen PNG</h3>
          <p class="text-sm text-gray-600 mb-4">
            Descarga tu firma como imagen PNG de alta calidad
          </p>
          <button
            class="btn-secondary w-full"
            on:click={downloadPNG}
            disabled={isExporting}
          >
            {#if isExporting}
              <svg class="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generando...
            {:else}
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              Descargar PNG
            {/if}
          </button>
        </div>
      </div>
    </div>

    <!-- Generar URL -->
    <div class="card p-6">
      <div class="flex items-start space-x-4">
        <div class="flex-shrink-0">
          <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
            <svg class="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
            </svg>
          </div>
        </div>
        <div class="flex-1">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Generar URL</h3>
          <p class="text-sm text-gray-600 mb-4">
            Crea un enlace único para compartir tu firma online
          </p>
          
          {#if generatedURL}
            <div class="mb-3 p-3 bg-gray-50 rounded-lg">
              <p class="text-xs text-gray-500 mb-1">URL generada:</p>
              <p class="text-sm font-mono text-gray-700 break-all">{generatedURL}</p>
            </div>
            <button
              class="btn-primary w-full"
              on:click={copyURL}
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
              </svg>
              Copiar URL
            </button>
          {:else}
            <button
              class="btn-secondary w-full"
              on:click={generateURL}
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
              </svg>
              Generar URL
            </button>
          {/if}
        </div>
      </div>
    </div>
  </div>

  <!-- Compatibilidad -->
  <div class="card p-6">
    <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
      <svg class="w-4 h-4 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      Compatibilidad con Clientes de Email
    </h3>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {#each emailClients as client}
        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div class="flex items-center space-x-3">
            <div class="w-2 h-2 rounded-full {client.compatible ? 'bg-green-500' : 'bg-yellow-500'}"></div>
            <span class="font-medium text-gray-900">{client.name}</span>
          </div>
          <span class="text-xs text-gray-600">{client.note}</span>
        </div>
      {/each}
    </div>
    
    <div class="mt-4 p-4 bg-blue-50 rounded-lg">
      <h4 class="font-medium text-blue-900 mb-2">💡 Instrucciones de uso:</h4>
      <ul class="text-sm text-blue-800 space-y-1">
        <li>• <strong>Gmail/Outlook:</strong> Copia el HTML y pégalo en la configuración de firma</li>
        <li>• <strong>Apple Mail:</strong> Arrastra la imagen PNG directamente a la configuración</li>
        <li>• <strong>Otros clientes:</strong> Usa el archivo HTML descargado como referencia</li>
      </ul>
    </div>
  </div>

  <!-- Instrucciones detalladas -->
  <div class="card p-6">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">📋 Cómo usar tu firma</h3>
    
    <div class="space-y-6">
      <div>
        <h4 class="font-medium text-gray-900 mb-2">En Gmail:</h4>
        <ol class="text-sm text-gray-600 space-y-1 ml-4 list-decimal">
          <li>Ve a Configuración → Ver toda la configuración</li>
          <li>Busca la sección "Firma"</li>
          <li>Copia y pega el HTML generado</li>
          <li>Guarda los cambios</li>
        </ol>
      </div>
      
      <div>
        <h4 class="font-medium text-gray-900 mb-2">En Outlook:</h4>
        <ol class="text-sm text-gray-600 space-y-1 ml-4 list-decimal">
          <li>Ve a Archivo → Opciones → Correo</li>
          <li>Haz clic en "Firmas..."</li>
          <li>Crea una nueva firma y pega el HTML</li>
          <li>Aplica la firma a tus cuentas</li>
        </ol>
      </div>
      
      <div>
        <h4 class="font-medium text-gray-900 mb-2">En Apple Mail:</h4>
        <ol class="text-sm text-gray-600 space-y-1 ml-4 list-decimal">
          <li>Ve a Mail → Preferencias → Firmas</li>
          <li>Arrastra la imagen PNG a la firma</li>
          <li>O pega el HTML directamente</li>
        </ol>
      </div>
    </div>
  </div>
</div>