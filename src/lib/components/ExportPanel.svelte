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

  // 1. Copiar HTML de la firma (con URL de imagen directa)
  async function copyHTML() {
    try {
      isProcessing = true;
      showToast('info', '🔄 Preparando HTML...');
      
      // Generar HTML con la URL de imagen directa (sin convertir a base64)
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

  // Función auxiliar para aplicar estilos inline y evitar problemas de CORS
  async function prepareElementForImage(element: HTMLElement): Promise<HTMLElement> {
    // Crear un clon del elemento
    const clone = element.cloneNode(true) as HTMLElement;
    
    // Aplicar font-family inline a todos los elementos de texto
    const textElements = clone.querySelectorAll('*');
    textElements.forEach((el: any) => {
      const computedStyle = window.getComputedStyle(el);
      const fontFamily = computedStyle.fontFamily;
      
      // Solo aplicar si el elemento tiene texto
      if (el.textContent && el.textContent.trim()) {
        el.style.fontFamily = fontFamily || 'Helvetica, Verdana, Arial, sans-serif';
      }
    });
    
    return clone;
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
          padding: '40px',
          margin: '0',
        },
        skipFonts: true, // Evitar errores de CORS con Google Fonts
        cacheBust: true, // Evitar problemas de caché
        useCORS: true,
        allowTaint: true,
        width: (previewElement as HTMLElement).scrollWidth + 80,
        height: (previewElement as HTMLElement).scrollHeight + 80,
        filter: (node: HTMLElement) => {
          // Filtrar elementos que puedan causar problemas
          if (node.tagName === 'STYLE') {
            const styleContent = node.textContent || '';
            // Excluir estilos de Google Fonts que causan CORS
            if (styleContent.includes('fonts.googleapis.com')) {
              return false;
            }
          }
          return true;
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
      
      // Generar HTML optimizado para tabla de correo
      const signatureHTML = generateEmailTableHTML(data);
      
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
              showToast('success', 'Firma copiada con formato de tabla');
            } else {
              // Último fallback: copiar solo HTML como texto
              const fallbackSuccess = await copyToClipboard(signatureHTML);
              if (fallbackSuccess) {
                showToast('success', 'Código HTML de firma copiado');
              } else {
                showToast('error', 'Error al copiar firma');
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
      showToast('error', 'Error al generar contenido con formato');
    } finally {
      isProcessing = false;
    }
  }

  // Función para generar HTML optimizado en formato tabla para correos
  function generateEmailTableHTML(data: any): string {
    const name = data.name || data.fullName || 'Tu nombre';
    const title = data.title || data.position || 'Tu título profesional';
    const company = data.company || 'Tu empresa';
    const department = data.department || '';
    const email = data.email || '';
    const phone = data.phone || '';
    const website = data.website || '';
    const address = data.address || '';
    const primaryColor = data.primaryColor || '#1e40af';
    
    // Generar imagen si existe
    const imageHTML = data.image?.url ? `
      <img src="${data.image.url}" 
           alt="Foto de perfil" 
           width="80" 
           height="80" 
           style="border-radius: ${data.image.shape === 'circle' ? '50%' : data.image.shape === 'rounded' ? '8px' : '0'}; 
                  object-fit: cover; 
                  border: 2px solid ${primaryColor}; 
                  display: block;
                  margin-bottom: 10px;" />
    ` : '';
    
    // Generar iconos de redes sociales
    const socialLinks = [];
    if (data.linkedin) {
      socialLinks.push(`<a href="https://linkedin.com/in/${data.linkedin}" style="margin-right: 8px;"><img src="https://cdn-icons-png.flaticon.com/32/174/174857.png" width="24" height="24" alt="LinkedIn" style="display: inline-block; vertical-align: middle;" /></a>`);
    }
    if (data.twitter) {
      socialLinks.push(`<a href="https://twitter.com/${data.twitter}" style="margin-right: 8px;"><img src="https://cdn-icons-png.flaticon.com/32/733/733579.png" width="24" height="24" alt="Twitter" style="display: inline-block; vertical-align: middle;" /></a>`);
    }
    if (data.github) {
      socialLinks.push(`<a href="https://github.com/${data.github}" style="margin-right: 8px;"><img src="https://cdn-icons-png.flaticon.com/32/733/733553.png" width="24" height="24" alt="GitHub" style="display: inline-block; vertical-align: middle;" /></a>`);
    }
    if (data.instagram) {
      socialLinks.push(`<a href="https://instagram.com/${data.instagram}" style="margin-right: 8px;"><img src="https://cdn-icons-png.flaticon.com/32/174/174855.png" width="24" height="24" alt="Instagram" style="display: inline-block; vertical-align: middle;" /></a>`);
    }
    
    const socialHTML = socialLinks.length > 0 ? `
      <tr>
        <td colspan="2" style="padding-top: 15px; padding-bottom: 5px; border-top: 2px solid ${primaryColor};">
          ${socialLinks.join('')}
        </td>
      </tr>
    ` : '';
    
    // Generar tabla HTML optimizada para correos
    return `
<table cellpadding="0" cellspacing="0" border="0" style="font-family: Helvetica, Verdana, Arial, sans-serif; font-size: 14px; line-height: 1.6; color: #333; max-width: 600px;">
  <tbody>
    ${imageHTML ? `
    <tr>
      <td colspan="2" style="padding-bottom: 15px;">
        ${imageHTML}
      </td>
    </tr>
    ` : ''}
    <tr>
      <td colspan="2" style="padding-bottom: 5px;">
        <strong style="font-size: 18px; color: ${primaryColor};">${name}</strong>
      </td>
    </tr>
    <tr>
      <td colspan="2" style="padding-bottom: 3px;">
        <span style="font-size: 15px; color: #555;">${title}</span>
      </td>
    </tr>
    <tr>
      <td colspan="2" style="padding-bottom: 15px;">
        <span style="font-size: 14px; color: #666;">${company}${department ? ` - ${department}` : ''}</span>
      </td>
    </tr>
    ${email ? `
    <tr>
      <td style="padding: 3px 0; width: 30px; vertical-align: top;">
        <img src="https://cdn-icons-png.flaticon.com/16/732/732200.png" width="16" height="16" alt="Email" style="display: block; margin-top: 2px;" />
      </td>
      <td style="padding: 3px 0;">
        <a href="mailto:${email}" style="color: ${primaryColor}; text-decoration: none;">${email}</a>
      </td>
    </tr>
    ` : ''}
    ${phone ? `
    <tr>
      <td style="padding: 3px 0; width: 30px; vertical-align: top;">
        <img src="https://cdn-icons-png.flaticon.com/16/724/724664.png" width="16" height="16" alt="Teléfono" style="display: block; margin-top: 2px;" />
      </td>
      <td style="padding: 3px 0;">
        <a href="tel:${phone.replace(/\s/g, '')}" style="color: #333; text-decoration: none;">${phone}</a>
      </td>
    </tr>
    ` : ''}
    ${website ? `
    <tr>
      <td style="padding: 3px 0; width: 30px; vertical-align: top;">
        <img src="https://cdn-icons-png.flaticon.com/16/1006/1006771.png" width="16" height="16" alt="Website" style="display: block; margin-top: 2px;" />
      </td>
      <td style="padding: 3px 0;">
        <a href="${website.startsWith('http') ? website : 'https://' + website}" style="color: ${primaryColor}; text-decoration: none;">${website}</a>
      </td>
    </tr>
    ` : ''}
    ${address ? `
    <tr>
      <td style="padding: 3px 0; width: 30px; vertical-align: top;">
        <img src="https://cdn-icons-png.flaticon.com/16/684/684908.png" width="16" height="16" alt="Dirección" style="display: block; margin-top: 2px;" />
      </td>
      <td style="padding: 3px 0;">
        <span style="color: #666;">${address}</span>
      </td>
    </tr>
    ` : ''}
    ${socialHTML}
  </tbody>
</table>
    `.trim();
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
        showToast('success', 'URL con datos copiada (incluyendo imagen)');
      } else {
        showToast('error', 'Error al copiar URL');
      }
    } catch (error) {
      console.error('Error generating prefilled URL:', error);
      showToast('error', 'Error al generar URL');
    } finally {
      isProcessing = false;
    }
  }
</script>

<div class="space-y-4">
  <!-- 4 Botones de Exportación -->
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
    
    <!-- 1. Copiar HTML -->
    <button
      class="group relative overflow-hidden text-white p-3 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      style="background-color: #9FD5D1;"
      on:mouseenter={(e) => e.currentTarget.style.backgroundColor = '#7ec9c4'}
      on:mouseleave={(e) => e.currentTarget.style.backgroundColor = '#9FD5D1'}
      on:click={copyHTML}
      disabled={isProcessing}
    >
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
          </svg>
        </div>
        <div class="text-left flex-1">
          <h3 class="font-bold text-sm">Copiar HTML</h3>
          <p class="text-xs opacity-90">
            Código para cliente de correo
          </p>
        </div>
      </div>
    </button>

    <!-- 2. Generar Imagen -->
    <button
      class="group relative overflow-hidden text-white p-3 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      style="background-color: #9FD5D1;"
      on:mouseenter={(e) => e.currentTarget.style.backgroundColor = '#7ec9c4'}
      on:mouseleave={(e) => e.currentTarget.style.backgroundColor = '#9FD5D1'}
      on:click={generateImage}
      disabled={isProcessing}
    >
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
        </div>
        <div class="text-left flex-1">
          <h3 class="font-bold text-sm">Generar Imagen</h3>
          <p class="text-xs opacity-90">
            Descarga como PNG
          </p>
        </div>
      </div>
    </button>

    <!-- 3. Copiar URL -->
    <button
      class="group relative overflow-hidden text-white p-3 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      style="background-color: #9FD5D1;"
      on:mouseenter={(e) => e.currentTarget.style.backgroundColor = '#7ec9c4'}
      on:mouseleave={(e) => e.currentTarget.style.backgroundColor = '#9FD5D1'}
      on:click={copyPrefilledURL}
      disabled={isProcessing}
    >
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
          </svg>
        </div>
        <div class="text-left flex-1">
          <h3 class="font-bold text-sm">Copiar URL</h3>
          <p class="text-xs opacity-90">
            Enlace con datos precargados
          </p>
        </div>
      </div>
    </button>

    <!-- 4. Copiar Texto Tabla -->
    <button
      class="group relative overflow-hidden text-white p-3 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      style="background-color: #9FD5D1;"
      on:mouseenter={(e) => e.currentTarget.style.backgroundColor = '#7ec9c4'}
      on:mouseleave={(e) => e.currentTarget.style.backgroundColor = '#9FD5D1'}
      on:click={copyPlainText}
      disabled={isProcessing}
    >
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
        </div>
        <div class="text-left flex-1">
          <h3 class="font-bold text-sm">Copiar Tabla</h3>
          <p class="text-xs opacity-90">
            Formato rico con imágenes
          </p>
        </div>
      </div>
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
  <div class="bg-gray-100 rounded-xl border mt-4" style="padding: 1rem;">
    <h3 class="font-semibold text-gray-900 mb-2 flex items-center">
      <svg class="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
        <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
      ¿Cómo usar cada opción?
    </h3>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
      <div>
        <strong class="text-blue-600">HTML:</strong> Para Gmail, Outlook, Apple Mail
      </div>
      <div>
        <strong class="text-emerald-600">Imagen:</strong> Para insertar en documentos
      </div>
      <div>
        <strong class="text-purple-600">URL:</strong> Enlace para compartir formulario
      </div>
      <div>
        <strong class="text-orange-600">Tabla:</strong> Formato rico con diseño
      </div>
    </div>
  </div>
</div>