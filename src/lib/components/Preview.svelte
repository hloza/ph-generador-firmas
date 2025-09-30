<script lang="ts">
  import { signatureData, isDesktopPreview, signatureStore } from '$lib/stores/signature.js';
  import { generateSignatureHTML } from '$lib/utils/signature.js';

  let previewElement: HTMLElement;
  let editingField: string | null = null;
  let editingValue: string = '';

  // Función para iniciar edición inline
  function startEditing(field: string, currentValue: string) {
    editingField = field;
    editingValue = currentValue;
  }

  // Función para confirmar edición
  function confirmEdit() {
    if (editingField) {
      signatureStore.updateField(editingField as any, editingValue);
      editingField = null;
    }
  }

  // Función para cancelar edición
  function cancelEdit() {
    editingField = null;
    editingValue = '';
  }

  // Manejar teclas en edición
  function handleEditKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      confirmEdit();
    } else if (event.key === 'Escape') {
      cancelEdit();
    }
  }

  // Plantillas de renderizado
  function renderMinimalTemplate(data: typeof $signatureData): string {
    const socialLinksHTML = data.socialLinks
      .filter(link => link.enabled && link.url)
      .map(link => {
        const iconMap = {
          linkedin: '💼',
          twitter: '🐦',
          github: '💻',
          instagram: '📷',
          facebook: '👥',
          youtube: '🎥'
        };
        
        return `
          <a href="${link.url}" style="text-decoration: none; margin-right: 6px; display: inline-block;">
            <span style="
              display: inline-block;
              width: 20px;
              height: 20px;
              background-color: ${data.primaryColor};
              color: white;
              text-align: center;
              line-height: 20px;
              border-radius: 3px;
              font-size: 10px;
            ">${iconMap[link.platform]}</span>
          </a>
        `;
      })
      .join('');

    const imageHTML = data.profileImage ? `
      <div style="margin-right: 16px; flex-shrink: 0;">
        <img src="${data.profileImage}" alt="${data.fullName}" style="
          width: 64px;
          height: 64px;
          object-fit: cover;
          ${data.imageShape === 'circle' ? 'border-radius: 50%;' : ''}
          ${data.imageShape === 'rounded' ? 'border-radius: 6px;' : ''}
          ${data.imageShape === 'square' ? 'border-radius: 0;' : ''}
        " />
      </div>
    ` : '';

    return `
      <div style="
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        padding: 20px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      ">
        <div style="display: flex; align-items: flex-start;">
          ${imageHTML}
          <div style="flex: 1;">
            <div style="margin-bottom: 12px;">
              <h2 style="
                margin: 0 0 4px 0;
                font-size: 18px;
                font-weight: 600;
                color: ${data.primaryColor};
                line-height: 1.2;
              " class="editable" data-field="fullName">${data.fullName}</h2>
              <p style="
                margin: 0 0 2px 0;
                font-size: 14px;
                color: #6b7280;
                line-height: 1.3;
              " class="editable" data-field="position">${data.position}</p>
              ${data.company ? `<p style="
                margin: 0;
                font-size: 14px;
                color: #6b7280;
                line-height: 1.3;
              " class="editable" data-field="company">${data.company}</p>` : ''}
            </div>
            
            <div style="
              padding-top: 12px;
              border-top: 1px solid #e5e7eb;
              font-size: 13px;
              line-height: 1.5;
            ">
              ${data.email ? `
                <div style="margin-bottom: 3px;">
                  <a href="mailto:${data.email}" style="color: #374151; text-decoration: none;">
                    📧 <span class="editable" data-field="email">${data.email}</span>
                  </a>
                </div>
              ` : ''}
              ${data.phone ? `
                <div style="margin-bottom: 3px; color: #374151;">
                  📞 <span class="editable" data-field="phone">${data.phone}</span>
                </div>
              ` : ''}
              ${data.website ? `
                <div style="margin-bottom: 3px;">
                  <a href="${data.website}" style="color: ${data.primaryColor}; text-decoration: none;">
                    🌐 <span class="editable" data-field="website">${data.website}</span>
                  </a>
                </div>
              ` : ''}
              ${data.address ? `
                <div style="margin-bottom: 6px; color: #374151;">
                  📍 <span class="editable" data-field="address">${data.address}</span>
                </div>
              ` : ''}
              ${socialLinksHTML ? `
                <div style="margin-top: 8px;">
                  ${socialLinksHTML}
                </div>
              ` : ''}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderProfessionalTemplate(data: typeof $signatureData): string {
    const socialLinksHTML = data.socialLinks
      .filter(link => link.enabled && link.url)
      .map(link => {
        const iconMap = {
          linkedin: 'in',
          twitter: 'tw',
          github: 'gh',
          instagram: 'ig',
          facebook: 'fb',
          youtube: 'yt'
        };
        
        return `
          <a href="${link.url}" style="
            text-decoration: none;
            margin-right: 8px;
            display: inline-block;
            background-color: ${data.primaryColor};
            color: white;
            padding: 4px 6px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: 600;
            text-transform: uppercase;
          ">${iconMap[link.platform]}</a>
        `;
      })
      .join('');

    const imageHTML = data.profileImage ? `
      <div style="margin-right: 20px; flex-shrink: 0;">
        <img src="${data.profileImage}" alt="${data.fullName}" style="
          width: 80px;
          height: 80px;
          object-fit: cover;
          ${data.imageShape === 'circle' ? 'border-radius: 50%;' : ''}
          ${data.imageShape === 'rounded' ? 'border-radius: 8px;' : ''}
          ${data.imageShape === 'square' ? 'border-radius: 0;' : ''}
          border: 3px solid ${data.primaryColor};
        " />
      </div>
    ` : '';

    return `
      <div style="
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        padding: 24px;
        background: white;
        border-radius: 10px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        border-left: 4px solid ${data.primaryColor};
      ">
        <div style="display: flex; align-items: flex-start;">
          ${imageHTML}
          <div style="flex: 1;">
            <div style="margin-bottom: 16px;">
              <h2 style="
                margin: 0 0 6px 0;
                font-size: 20px;
                font-weight: 700;
                color: #1f2937;
                line-height: 1.2;
              " class="editable" data-field="fullName">${data.fullName}</h2>
              <p style="
                margin: 0 0 4px 0;
                font-size: 16px;
                color: ${data.primaryColor};
                font-weight: 600;
                line-height: 1.3;
              " class="editable" data-field="position">${data.position}</p>
              ${data.company ? `<p style="
                margin: 0;
                font-size: 14px;
                color: #6b7280;
                line-height: 1.3;
              " class="editable" data-field="company">${data.company}</p>` : ''}
            </div>
            
            <div style="
              padding-top: 16px;
              border-top: 2px solid #e5e7eb;
              font-size: 14px;
              line-height: 1.6;
            ">
              ${data.email ? `
                <div style="margin-bottom: 4px; display: flex; align-items: center;">
                  <span style="
                    display: inline-block;
                    width: 20px;
                    text-align: center;
                    margin-right: 8px;
                    color: ${data.primaryColor};
                  ">📧</span>
                  <a href="mailto:${data.email}" style="color: #374151; text-decoration: none;">
                    <span class="editable" data-field="email">${data.email}</span>
                  </a>
                </div>
              ` : ''}
              ${data.phone ? `
                <div style="margin-bottom: 4px; display: flex; align-items: center; color: #374151;">
                  <span style="
                    display: inline-block;
                    width: 20px;
                    text-align: center;
                    margin-right: 8px;
                    color: ${data.primaryColor};
                  ">📞</span>
                  <span class="editable" data-field="phone">${data.phone}</span>
                </div>
              ` : ''}
              ${data.website ? `
                <div style="margin-bottom: 4px; display: flex; align-items: center;">
                  <span style="
                    display: inline-block;
                    width: 20px;
                    text-align: center;
                    margin-right: 8px;
                    color: ${data.primaryColor};
                  ">🌐</span>
                  <a href="${data.website}" style="color: ${data.primaryColor}; text-decoration: none;">
                    <span class="editable" data-field="website">${data.website}</span>
                  </a>
                </div>
              ` : ''}
              ${data.address ? `
                <div style="margin-bottom: 8px; display: flex; align-items: center; color: #374151;">
                  <span style="
                    display: inline-block;
                    width: 20px;
                    text-align: center;
                    margin-right: 8px;
                    color: ${data.primaryColor};
                  ">📍</span>
                  <span class="editable" data-field="address">${data.address}</span>
                </div>
              ` : ''}
              ${socialLinksHTML ? `
                <div style="margin-top: 12px; padding-top: 8px; border-top: 1px solid #f3f4f6;">
                  ${socialLinksHTML}
                </div>
              ` : ''}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function getTemplateHTML(data: typeof $signatureData): string {
    switch (data.templateId) {
      case 'professional-1':
      case 'professional-2':
        return renderProfessionalTemplate(data);
      case 'minimal-1':
      case 'minimal-2':
      default:
        return renderMinimalTemplate(data);
    }
  }

  // Función para enfocar el input
  function focusOnMount(node: HTMLElement) {
    node.focus();
    return {
      destroy() {
        // cleanup if needed
      }
    };
  }

  // Manejar clicks para edición inline
  function handlePreviewClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const editableElement = target.closest('.editable') as HTMLElement;
    
    if (editableElement) {
      const field = editableElement.dataset.field;
      const currentValue = editableElement.textContent || '';
      
      if (field) {
        startEditing(field, currentValue);
      }
    }
  }

  $: templateHTML = getTemplateHTML($signatureData);
</script>

<div class="space-y-4">
  <!-- Toggle Desktop/Mobile -->
  <div class="flex items-center justify-between">
    <h3 class="text-lg font-semibold text-gray-900">Vista Previa</h3>
    <div class="flex items-center space-x-3">
      <span class="text-sm text-gray-600">Vista:</span>
      <div class="flex items-center bg-gray-100 rounded-lg p-1">
        <button
          class="flex items-center px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200
                 {$isDesktopPreview ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}"
          on:click={() => isDesktopPreview.set(true)}
        >
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
          </svg>
          Desktop
        </button>
        <button
          class="flex items-center px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200
                 {!$isDesktopPreview ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}"
          on:click={() => isDesktopPreview.set(false)}
        >
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a1 1 0 001-1v-1a1 1 0 00-1-1H8a1 1 0 00-1 1v1a1 1 0 001 1zM7 10a5 5 0 1110 0v6a1 1 0 01-1 1H8a1 1 0 01-1-1v-6z"></path>
          </svg>
          Mobile
        </button>
      </div>
    </div>
  </div>

  <!-- Contenedor de preview -->
  <div class="min-h-[400px] flex items-center justify-center bg-gray-50 rounded-xl p-6">
    <div 
      class="transition-all duration-300 ease-in-out
             {$isDesktopPreview ? 'desktop-preview w-full max-w-2xl' : 'mobile-preview'}"
    >
      <!-- Contenido de la firma -->
      <div 
        bind:this={previewElement}
        class="signature-content"
        on:click={handlePreviewClick}
        role="presentation"
      >
        {@html templateHTML}
      </div>

      <!-- Overlay de edición inline -->
      {#if editingField}
        <div class="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50 p-4">
          <div class="bg-white rounded-lg p-6 max-w-md w-full">
            <h4 class="text-lg font-semibold text-gray-900 mb-4">
              Editar {editingField === 'fullName' ? 'Nombre' : ''}
              {editingField === 'position' ? 'Cargo' : ''}
              {editingField === 'company' ? 'Empresa' : ''}
              {editingField === 'email' ? 'Email' : ''}
              {editingField === 'phone' ? 'Teléfono' : ''}
              {editingField === 'website' ? 'Sitio Web' : ''}
              {editingField === 'address' ? 'Dirección' : ''}
            </h4>
            
            <input
              type="text"
              class="form-input mb-4"
              bind:value={editingValue}
              on:keydown={handleEditKeydown}
              placeholder="Introduce el nuevo valor..."
              use:focusOnMount
            />
            
            <div class="flex justify-end space-x-3">
              <button
                class="btn-secondary px-4 py-2"
                on:click={cancelEdit}
              >
                Cancelar
              </button>
              <button
                class="btn-primary px-4 py-2"
                on:click={confirmEdit}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      {/if}
    </div>
  </div>

  <!-- Información de edición inline -->
  <div class="text-center">
    <p class="text-sm text-gray-600">
      💡 <span class="font-medium">Tip:</span> Haz clic sobre cualquier texto en la vista previa para editarlo directamente
    </p>
  </div>
</div>

<style>
  :global(.signature-content .editable) {
    cursor: pointer;
    border-radius: 4px;
    transition: all 0.2s ease;
    padding: 2px 4px;
    margin: -2px -4px;
  }

  :global(.signature-content .editable:hover) {
    background-color: rgba(59, 130, 246, 0.1);
    outline: 1px solid rgba(59, 130, 246, 0.3);
  }

  .desktop-preview {
    width: 100%;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    overflow: hidden;
  }

  .mobile-preview {
    width: 375px;
    max-width: 100%;
    margin: 0 auto;
    background: white;
    border-radius: 24px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
    overflow: hidden;
    padding: 20px;
  }

  .mobile-preview::before {
    content: '';
    display: block;
    width: 40px;
    height: 4px;
    background: #d1d5db;
    border-radius: 2px;
    margin: 0 auto 16px;
  }
</style>