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

  // 1. Copiar HTML de la firma
  async function copyHTML() {
    try {
      isProcessing = true;
      const html = generateSignatureHTML($signatureData);
      const success = await copyToClipboard(html);
      
      if (success) {
        showToast('success', '✅ HTML copiado al portapapeles');
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
      
      // Generar imagen PNG
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
      link.download = `firma-${formatFileName($signatureData.fullName || 'signature')}.png`;
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

  // 3. Copiar texto plano de la firma
  async function copyPlainText() {
    try {
      isProcessing = true;
      
      const data = $signatureData;
      const name = data.name || data.fullName || 'Tu nombre';
      const title = data.title || data.position || 'Tu cargo';
      const company = data.company || 'Tu empresa';
      const department = data.department ? ` | ${data.department}` : '';
      const email = data.email || 'tu.email@empresa.com';
      const phone = data.phone || '+34 xxx xxx xxx';
      const website = data.website || '';
      const address = data.address || '';
      
      let plainText = `${name}\n${title}\n${company}${department}\n\n`;
      
      if (email !== 'tu.email@empresa.com') plainText += `📧 ${email}\n`;
      if (phone !== '+34 xxx xxx xxx') plainText += `📱 ${phone}\n`;
      if (website) plainText += `🌐 ${website}\n`;
      if (address) plainText += `📍 ${address}\n`;
      
      // Agregar redes sociales si están configuradas
      if (data.linkedin) plainText += `LinkedIn: ${data.linkedin}\n`;
      if (data.twitter) plainText += `Twitter: ${data.twitter}\n`;
      if (data.github) plainText += `GitHub: ${data.github}\n`;
      if (data.instagram) plainText += `Instagram: ${data.instagram}\n`;
      
      const success = await copyToClipboard(plainText);
      
      if (success) {
        showToast('success', '📄 Texto plano copiado');
      } else {
        showToast('error', '❌ Error al copiar texto');
      }
    } catch (error) {
      console.error('Error copying plain text:', error);
      showToast('error', '❌ Error al generar texto plano');
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
      
      const currentURL = window.location.origin + base;
      const prefilledURL = `${currentURL}?${params.toString()}`;
      
      const success = await copyToClipboard(prefilledURL);
      
      if (success) {
        showToast('success', '🔗 URL con datos copiada');
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
      class="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      on:click={copyHTML}
      disabled={isProcessing}
    >
      <div class="flex flex-col items-center space-y-3">
        <div class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
          </svg>
        </div>
        <div class="text-center">
          <h3 class="font-semibold text-lg">Copiar HTML</h3>
          <p class="text-sm text-blue-100">
            Copia el código para pegarlo en tu cliente de correo
          </p>
        </div>
      </div>
      <div class="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
    </button>

    <!-- 2. Generar Imagen -->
    <button
      class="group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white p-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      on:click={generateImage}
      disabled={isProcessing}
    >
      <div class="flex flex-col items-center space-y-3">
        <div class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
        </div>
        <div class="text-center">
          <h3 class="font-semibold text-lg">Generar Imagen</h3>
          <p class="text-sm text-emerald-100">
            Descarga tu firma como imagen PNG de alta calidad
          </p>
        </div>
      </div>
      <div class="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
    </button>

    <!-- 3. Copiar Texto Plano -->
    <button
      class="group relative overflow-hidden bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white p-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      on:click={copyPlainText}
      disabled={isProcessing}
    >
      <div class="flex flex-col items-center space-y-3">
        <div class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
        </div>
        <div class="text-center">
          <h3 class="font-semibold text-lg">Copiar Texto</h3>
          <p class="text-sm text-purple-100">
            Copia en formato de texto plano para documentos
          </p>
        </div>
      </div>
      <div class="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
    </button>

    <!-- 4. Copiar URL con Datos -->
    <button
      class="group relative overflow-hidden bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white p-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      on:click={copyPrefilledURL}
      disabled={isProcessing}
    >
      <div class="flex flex-col items-center space-y-3">
        <div class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
          </svg>
        </div>
        <div class="text-center">
          <h3 class="font-semibold text-lg">Copiar URL</h3>
          <p class="text-sm text-amber-100">
            Genera enlace para compartir y rellenar datos automáticamente
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
  <div class="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border">
    <h3 class="font-semibold text-gray-900 mb-3 flex items-center">
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