<script lang="ts">
  import { signatureData, showToast } from '$lib/stores/signature.js';
  import { generateSignatureHTML, copyToClipboard, formatFileName } from '$lib/utils/signature.js';
  import { onMount } from 'svelte';
  import { base } from '$app/paths';

  let isProcessing = false;
  let htmlToImage: any = null;

  onMount(async () => {
    // Importar html-to-image dinámicamente para generar imágenes
    if (typeof window !== 'undefined') {
      htmlToImage = await import('html-to-image');
    }
  });

  // 1. Copiar HTML de la firma (incluyendo imagen embebida)
  async function copyHTML() {
    try {
      isProcessing = true;
      showToast('info', '🔄 Preparando HTML con imagen...');
      
      // Crear una copia de los datos para incluir la imagen
      const dataWithImage = { ...$signatureData };
      
      // Si hay imagen, asegurar que la URL esté incluida
      if ($signatureData.image?.url) {
        dataWithImage.profileImage = $signatureData.image.url;
      }
      
      let html = generateSignatureHTML(dataWithImage);
      
      // Si hay imagen, convertirla a base64 e incluirla en el HTML
      if ($signatureData.image?.url && !$signatureData.image.url.startsWith('data:')) {
        try {
          const response = await fetch($signatureData.image.url);
          const blob = await response.blob();
          const base64 = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
          });
          
          // Reemplazar la URL de la imagen con la versión base64
          html = html.replace($signatureData.image.url, base64);
        } catch (imgError) {
          console.warn('No se pudo convertir la imagen a base64, usando URL original:', imgError);
        }
      }
      
      const success = await copyToClipboard(html);
      
      if (success) {
        showToast('success', '✅ HTML copiado al portapapeles (con imagen)');
      } else {
        showToast('error', '❌ Error al copiar HTML');
      }
    } catch (error) {
      console.error('Error copying HTML:', error);
      showToast('error', '❌ Error al generar HTML');
    } finally {
      isProcessing = false;
    }
  }

  // 2. Generar y descargar imagen de la firma
  async function generateImage() {
    if (!htmlToImage) {
      showToast('error', '❌ Error: Funcionalidad de imagen no disponible');
      return;
    }

    try {
      isProcessing = true;
      showToast('info', '🔄 Generando imagen...');
      
      // Buscar el elemento de preview existente
      const previewElement = document.querySelector('.signature-preview-content');
      if (!previewElement) {
        showToast('error', '❌ No se encontró la vista previa de la firma');
        return;
      }
      
      // Esperar para que se carguen las imágenes
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Asegurar que todas las imágenes estén cargadas
      const images = previewElement.querySelectorAll('img');
      await Promise.all(Array.from(images).map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise(resolve => {
          img.onload = resolve;
          img.onerror = resolve;
        });
      }));
      
      // Generar imagen PNG usando el elemento real
      const dataUrl = await htmlToImage.toPng(previewElement as HTMLElement, {
        backgroundColor: 'white',
        pixelRatio: 2,
        style: {
          padding: '20px',
          margin: '0',
        },
        skipFonts: false,
        useCORS: true,
        allowTaint: true,
        fetchRequestInit: {
          mode: 'cors'
        }
      });
      
      // Descargar imagen
      const link = document.createElement('a');
      const fileName = $signatureData.name || $signatureData.fullName || 'firma';
      link.download = `firma-${formatFileName(fileName)}.png`;
      link.href = dataUrl;
      link.click();
      
      showToast('success', '🖼️ Imagen generada y descargada');
      
    } catch (error) {
      console.error('Error generating image:', error);
      showToast('error', '❌ Error al generar imagen');
    } finally {
      isProcessing = false;
    }
  }

  // 3. Copiar firma con formato de plantilla (HTML rico con imágenes e iconos)
  async function copyPlainText() {
    try {
      isProcessing = true;
      showToast('info', '🎨 Preparando firma con formato...');
      
      const data = $signatureData;
      
      // Importar la función generateSignatureHTML para mantener consistencia con la plantilla
      const { generateSignatureHTML } = await import('$lib/utils/signature.js');
      
      // Generar HTML usando la misma función que las exportaciones (mantiene formato de plantilla)
      const signatureHTML = generateSignatureHTML(data);
      
      // Crear un contenedor temporal invisible para el contenido HTML
      const tempContainer = document.createElement('div');
      tempContainer.innerHTML = signatureHTML;
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '-9999px';
      tempContainer.style.width = 'auto';
      tempContainer.style.height = 'auto';
      tempContainer.style.visibility = 'hidden';
      document.body.appendChild(tempContainer);
      
      try {
        // Usar la API moderna del portapapeles para contenido rico
        if (navigator.clipboard && navigator.clipboard.write) {
          // Crear tanto texto plano como HTML rico
          const textContent = tempContainer.innerText || tempContainer.textContent || '';
          const htmlContent = signatureHTML;
          
          const clipboardItems = [
            new ClipboardItem({
              'text/html': new Blob([htmlContent], { type: 'text/html' }),
              'text/plain': new Blob([textContent], { type: 'text/plain' })
            })
          ];
          
          await navigator.clipboard.write(clipboardItems);
          showToast('success', '✨ Firma copiada con formato completo (imágenes e iconos incluidos)');
        } else {
          // Fallback para navegadores más antiguos
          const range = document.createRange();
          range.selectNodeContents(tempContainer);
          
          const selection = window.getSelection();
          if (selection) {
            selection.removeAllRanges();
            selection.addRange(range);
            
            const success = document.execCommand('copy');
            selection.removeAllRanges();
            
            if (success) {
              showToast('success', '✨ Firma copiada con formato de plantilla');
            } else {
              // Último fallback: copiar solo HTML como texto
              const fallbackSuccess = await copyToClipboard(signatureHTML);
              if (fallbackSuccess) {
                showToast('success', '📄 Código HTML de firma copiado');
              } else {
                showToast('error', '❌ Error al copiar firma');
              }
            }
          }
        }
      } finally {
        // Limpiar elemento temporal
        document.body.removeChild(tempContainer);
      }
    } catch (error) {
      console.error('Error copying rich content:', error);
      showToast('error', '❌ Error al generar contenido con formato');
    } finally {
      isProcessing = false;
    }
  }

  // 4. Generar URL con parámetros GET para rellenar el formulario
  async function copyPrefilledURL() {
    try {
      isProcessing = true;
      
      const data = $signatureData;
      const params = new URLSearchParams();
      
      // Agregar todos los parámetros disponibles
      if (data.name || data.fullName) params.set('name', data.name || data.fullName);
      if (data.title || data.position) params.set('title', data.title || data.position);
      if (data.company) params.set('company', data.company);
      if (data.department) params.set('department', data.department);
      if (data.email) params.set('email', data.email);
      if (data.phone) params.set('phone', data.phone);
      if (data.website) params.set('website', data.website);
      if (data.address) params.set('address', data.address);
      if (data.primaryColor) params.set('primaryColor', data.primaryColor);
      if (data.accentColor) params.set('accentColor', data.accentColor);
      if (data.fontFamily) params.set('fontFamily', data.fontFamily);
      if (data.templateId) params.set('templateId', data.templateId);
      if (data.linkedin) params.set('linkedin', data.linkedin);
      if (data.twitter) params.set('twitter', data.twitter);
      if (data.github) params.set('github', data.github);
      if (data.instagram) params.set('instagram', data.instagram);
      
      // Incluir URL de imagen si existe
      if (data.image?.url) params.set('imageUrl', data.image.url);
      if (data.image?.shape) params.set('imageShape', data.image.shape);
      if (data.image?.size) params.set('imageSize', data.image.size);
      
      const currentURL = window.location.origin + base;
      const prefilledURL = `${currentURL}?${params.toString()}`;
      
      const success = await copyToClipboard(prefilledURL);
      
      if (success) {
        showToast('success', '🔗 URL con datos copiada (incluyendo imagen)');
      } else {
        showToast('error', '❌ Error al copiar URL');
      }
    } catch (error) {
      console.error('Error generating prefilled URL:', error);
      showToast('error', '❌ Error al generar URL');
    } finally {
      isProcessing = false;
    }
  }
</script>

<div class="space-y-6">
  <!-- Header -->
  <div class="text-center">
    <h2 class="text-2xl font-bold text-gray-900 mb-2">
      🎯 Revisar y Descargar Firma
    </h2>
    <p class="text-gray-600">
      Elige cómo quieres exportar tu firma profesional
    </p>
  </div>

  <!-- 4 Botones de Exportación -->
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
    
    <!-- 1. Copiar HTML -->
    <button
      class="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      on:click={copyHTML}
      disabled={isProcessing}
    >
      <div class="flex flex-col items-center space-y-2">
        <div class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
          </svg>
        </div>
        <div class="text-center">
          <h3 class="font-semibold text-sm">Copiar HTML</h3>
          <p class="text-xs text-blue-100">
            Código para cliente de correo
          </p>
        </div>
      </div>
      <div class="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
    </button>

    <!-- 2. Generar Imagen -->
    <button
      class="group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white p-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      on:click={generateImage}
      disabled={isProcessing}
    >
      <div class="flex flex-col items-center space-y-2">
        <div class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
        </div>
        <div class="text-center">
          <h3 class="font-semibold text-sm">Generar Imagen</h3>
          <p class="text-xs text-emerald-100">
            Descarga como PNG de alta calidad
          </p>
        </div>
      </div>
      <div class="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
    </button>

    <!-- 3. Copiar con Formato -->
    <button
      class="group relative overflow-hidden bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white p-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      on:click={copyPlainText}
      disabled={isProcessing}
    >
      <div class="flex flex-col items-center space-y-2">
        <div class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
            <path fill-rule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 001 1h8a1 1 0 001-1V3a2 2 0 012 2v6h-2V5H6v6H4V5z" clip-rule="evenodd"/>
            <path d="M6 13a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2v-8zm2 2v6h8v-6H8z"/>
            <path d="M8 17a1 1 0 011-1h6a1 1 0 110 2H9a1 1 0 01-1-1zm1 2a1 1 0 100 2h3a1 1 0 100-2H9z"/>
          </svg>
        </div>
        <div class="text-center">
          <h3 class="font-semibold text-sm">Copiar con Formato</h3>
          <p class="text-xs text-purple-100">
            Con imágenes e iconos
          </p>
        </div>
      </div>
      <div class="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
    </button>

    <!-- 4. Copiar URL con Datos -->
    <button
      class="group relative overflow-hidden bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white p-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      on:click={copyPrefilledURL}
      disabled={isProcessing}
    >
      <div class="flex flex-col items-center space-y-2">
        <div class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
          </svg>
        </div>
        <div class="text-center">
          <h3 class="font-semibold text-sm">Copiar URL</h3>
          <p class="text-xs text-amber-100">
            Enlace para compartir datos
          </p>
        </div>
      </div>
      <div class="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
    </button>
  </div>

  <!-- Estado de procesamiento -->
  {#if isProcessing}
    <div class="flex items-center justify-center py-8">
      <div class="flex items-center space-x-3">
        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
        <span class="text-gray-600 font-medium">Procesando...</span>
      </div>
    </div>
  {/if}

  <!-- Información adicional -->
  <div class="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border mt-4" style="padding: 1rem;">
    <h3 class="font-semibold text-gray-900 mb-2 flex items-center">
      <svg class="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
        <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
      ¿Cómo usar cada opción?
    </h3>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
      <div>
        <strong class="text-blue-600">📋 HTML:</strong> Para Gmail, Outlook, Apple Mail
      </div>
      <div>
        <strong class="text-emerald-600">🖼️ Imagen:</strong> Para insertar en documentos
      </div>
      <div>
        <strong class="text-purple-600">📄 Texto:</strong> Para Word, Google Docs
      </div>
      <div>
        <strong class="text-amber-600">🔗 URL:</strong> Para compartir configuración
      </div>
    </div>
  </div>
</div>