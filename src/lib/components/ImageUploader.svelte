<script lang="ts">
  import { signatureData, signatureStore, showToast } from '$lib/stores/signature.js';
  import { fileToBase64 } from '$lib/utils/signature.js';
  import { onMount } from 'svelte';

  let fileInput: HTMLInputElement;
  let dragActive = false;
  let cropping = false;
  let cropperElement: HTMLElement;
  let cropperInstance: any = null;

  onMount(async () => {
    // Importar Cropper.js dinámicamente
    if (typeof window !== 'undefined') {
      const Cropper = (await import('cropperjs')).default;
      
      // Configurar el cropper cuando se necesite
      window.initCropper = (imageElement: HTMLImageElement) => {
        if (cropperInstance) {
          cropperInstance.destroy();
        }
        
        cropperInstance = new Cropper(imageElement, {
          aspectRatio: 1,
          viewMode: 1,
          autoCropArea: 1,
          responsive: true,
          restore: false,
          checkCrossOrigin: false,
          checkOrientation: false,
          modal: true,
          guides: true,
          center: true,
          highlight: false,
          cropBoxMovable: true,
          cropBoxResizable: true,
          toggleDragModeOnDblclick: false,
        });
      };
    }
  });

  function handleFileSelect(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      processFile(file);
    }
  }

  function handleDrop(event: DragEvent) {
    event.preventDefault();
    dragActive = false;
    
    const file = event.dataTransfer?.files[0];
    if (file) {
      processFile(file);
    }
  }

  function handleDragOver(event: DragEvent) {
    event.preventDefault();
    dragActive = true;
  }

  function handleDragLeave() {
    dragActive = false;
  }

  async function processFile(file: File) {
    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      showToast('error', 'Por favor, selecciona un archivo de imagen válido');
      return;
    }

    // Validar tamaño (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast('error', 'La imagen es demasiado grande. Máximo 5MB');
      return;
    }

    try {
      const base64 = await fileToBase64(file);
      
      // Mostrar modal de recorte
      cropping = true;
      
      // Esperar a que el modal se renderice
      setTimeout(() => {
        const img = document.getElementById('cropperImage') as HTMLImageElement;
        if (img && window.initCropper) {
          img.src = base64;
          img.onload = () => {
            window.initCropper(img);
          };
        }
      }, 100);
      
    } catch (error) {
      console.error('Error processing file:', error);
      showToast('error', 'Error al procesar la imagen');
    }
  }

  function confirmCrop() {
    if (cropperInstance) {
      const canvas = cropperInstance.getCroppedCanvas({
        width: 200,
        height: 200,
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high',
      });
      
      const croppedImage = canvas.toDataURL('image/jpeg', 0.9);
      signatureStore.updateField('profileImage', croppedImage);
      
      cropping = false;
      cropperInstance.destroy();
      cropperInstance = null;
      
      showToast('success', 'Imagen actualizada correctamente');
    }
  }

  function cancelCrop() {
    if (cropperInstance) {
      cropperInstance.destroy();
      cropperInstance = null;
    }
    cropping = false;
  }

  function removeImage() {
    signatureStore.updateField('profileImage', null);
    showToast('info', 'Imagen eliminada');
  }

  function openFileDialog() {
    fileInput?.click();
  }
</script>

<div class="space-y-4">
  <!-- Input oculto para archivos -->
  <input
    bind:this={fileInput}
    type="file"
    accept="image/*"
    class="hidden"
    on:change={handleFileSelect}
  />

  {#if $signatureData.profileImage}
    <!-- Imagen actual -->
    <div class="flex items-center space-x-4">
      <div class="flex-shrink-0">
        <img
          src={$signatureData.profileImage}
          alt="Imagen de perfil"
          class="w-20 h-20 object-cover border border-gray-300
                 {$signatureData.imageShape === 'circle' ? 'rounded-full' : ''}
                 {$signatureData.imageShape === 'rounded' ? 'rounded-lg' : ''}
                 {$signatureData.imageShape === 'square' ? 'rounded-none' : ''}"
        />
      </div>
      <div class="flex-1">
        <h4 class="text-sm font-medium text-gray-900">Imagen actual</h4>
        <p class="text-sm text-gray-600">Imagen cargada y lista para usar</p>
        <div class="mt-2 flex space-x-2">
          <button
            class="btn-secondary text-sm py-1 px-3"
            on:click={openFileDialog}
          >
            Cambiar
          </button>
          <button
            class="text-red-600 hover:text-red-800 text-sm py-1 px-3"
            on:click={removeImage}
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  {:else}
    <!-- Área de carga -->
    <div
      class="border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200
             {dragActive ? 'border-primary-400 bg-primary-50' : 'border-gray-300 hover:border-gray-400'}"
      on:drop={handleDrop}
      on:dragover={handleDragOver}
      on:dragleave={handleDragLeave}
      role="button"
      tabindex="0"
      on:click={openFileDialog}
      on:keydown={(e) => e.key === 'Enter' && openFileDialog()}
    >
      <svg 
        class="mx-auto h-12 w-12 text-gray-400 mb-4" 
        stroke="currentColor" 
        fill="none" 
        viewBox="0 0 48 48"
      >
        <path 
          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" 
          stroke-width="2" 
          stroke-linecap="round" 
          stroke-linejoin="round" 
        />
      </svg>
      
      <h3 class="text-lg font-medium text-gray-900 mb-2">
        Subir imagen de perfil
      </h3>
      <p class="text-sm text-gray-600 mb-4">
        Arrastra una imagen aquí o haz clic para seleccionar
      </p>
      <button class="btn-primary">
        Seleccionar imagen
      </button>
      <p class="text-xs text-gray-500 mt-2">
        PNG, JPG, GIF hasta 5MB
      </p>
    </div>
  {/if}
</div>

<!-- Modal de recorte -->
{#if cropping}
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
      <!-- Header -->
      <div class="p-6 border-b">
        <h3 class="text-lg font-semibold text-gray-900">Recortar imagen</h3>
        <p class="text-sm text-gray-600 mt-1">
          Ajusta el área de recorte para tu imagen de perfil
        </p>
      </div>

      <!-- Contenido del cropper -->
      <div class="p-6">
        <div class="max-h-96 overflow-hidden">
          <img
            id="cropperImage"
            alt="Imagen a recortar"
            class="max-w-full h-auto"
          />
        </div>
      </div>

      <!-- Footer -->
      <div class="p-6 border-t flex justify-end space-x-3">
        <button
          class="btn-secondary px-4 py-2"
          on:click={cancelCrop}
        >
          Cancelar
        </button>
        <button
          class="btn-primary px-4 py-2"
          on:click={confirmCrop}
        >
          Aplicar recorte
        </button>
      </div>
    </div>
  </div>
{/if}

<svelte:head>
  <link rel="stylesheet" href="https://fengyuanchen.github.io/cropperjs/css/cropper.css" />
</svelte:head>