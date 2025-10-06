<script lang="ts">
  import { goto } from '$app/navigation';
  import { signatureData, setImageData } from '$lib/stores/signature.js';
  import { markStepAsCompleted } from '$lib/stores/navigation.js';
  import { onMount } from 'svelte';

  let imagePreview = '';
  let imageShape: 'circle' | 'square' | 'rounded' = 'circle';
  let imageSize: 'small' | 'medium' | 'large' = 'medium';
  let imageUrl = '';
  let urlError = '';

  // Sincronizar con los datos del store cuando cambian
  $: if ($signatureData.image?.url && !imagePreview) {
    imagePreview = $signatureData.image.url;
    imageUrl = $signatureData.image.url;
    imageShape = $signatureData.image.shape || 'circle';
    imageSize = $signatureData.image.size || 'medium';
  }

  // Inicializar con datos existentes del store
  onMount(() => {
    if ($signatureData.image?.url) {
      imagePreview = $signatureData.image.url;
      imageUrl = $signatureData.image.url; // También actualizar el campo de URL
      imageShape = $signatureData.image.shape || 'circle';
      imageSize = $signatureData.image.size || 'medium';
    }
  });

  // Reactividad para actualizar datos cuando cambian las propiedades
  $: if (imagePreview) {
    updateImageData();
  }



  function updateImageData() {
    setImageData({
      url: imagePreview,
      shape: imageShape,
      size: imageSize
    });
    
    // Marcar paso como completado cuando hay imagen
    if (imagePreview) {
      markStepAsCompleted('image');
    }
  }

  function removeImage() {
    imagePreview = '';
    imageUrl = '';
    urlError = '';
    signatureData.update(data => ({
      ...data,
      image: undefined
    }));
  }

  function handleContinue() {
    if (imagePreview) {
      updateImageData();
      markStepAsCompleted('image');
    }
    goto('/editor/design');
  }

  function handleUrlSubmit() {
    if (!imageUrl.trim()) {
      urlError = 'Por favor ingresa una URL válida';
      return;
    }

    // Validación básica de URL
    try {
      new URL(imageUrl);
    } catch {
      urlError = 'La URL no es válida';
      return;
    }

    // Verificar que la URL termine en una extensión de imagen válida
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const urlLower = imageUrl.toLowerCase();
    const hasValidExtension = validExtensions.some(ext => urlLower.includes(ext));
    
    if (!hasValidExtension) {
      urlError = 'La URL debe apuntar a una imagen (jpg, png, gif, webp)';
      return;
    }

    urlError = '';
    imagePreview = imageUrl;
    updateImageData();
  }

  function clearUrlError() {
    urlError = '';
  }

  // Actualizar datos cuando cambien las opciones
  $: if (imagePreview && (imageShape || imageSize)) {
    updateImageData();
  }
</script>

<div class="space-y-6">
  <div class="text-center mb-8">
    <h2 class="text-2xl font-bold text-gray-800 mb-2">Agrega tu imagen o logo</h2>
    <p class="text-gray-600">Ingresa la URL de tu foto o logo para personalizar tu firma</p>
  </div>

  <!-- Formulario de URL -->
  <div class="space-y-4">
    {#if !imagePreview}
      <div class="bg-white rounded-lg p-6 border border-gray-300 shadow-sm">
        <div class="flex items-center justify-center mb-6">
          <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
        </div>
        
        <h3 class="text-lg font-semibold text-gray-800 mb-4 text-center">URL de la imagen</h3>
        <div class="space-y-4">
          <div>
            <label for="imageUrl" class="block text-sm font-medium text-gray-700 mb-2">
              Ingresa la URL de tu imagen
            </label>
            <input
              type="url"
              id="imageUrl"
              bind:value={imageUrl}
              on:input={clearUrlError}
              class="w-full px-4 py-3 bg-white border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://ejemplo.com/imagen.jpg"
            />
            {#if urlError}
              <p class="mt-2 text-sm text-red-600">{urlError}</p>
            {/if}
            <p class="mt-2 text-xs text-gray-500">
              Formatos: JPG, PNG, GIF, WebP
            </p>
          </div>
          
          <button
            type="button"
            class="w-full px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors font-medium"
            on:click={handleUrlSubmit}
          >
            Cargar imagen
          </button>
        </div>
      </div>
    {:else}
      <!-- Preview de la imagen -->
      <div class="bg-white rounded-lg p-6 border border-gray-300 shadow-sm">
        <div class="flex items-start justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-800">Vista previa</h3>
          <button 
            type="button"
            class="text-red-600 hover:text-red-700 transition-colors"
            on:click={removeImage}
            aria-label="Eliminar imagen"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
        
        <div class="flex justify-center mb-4">
          <img 
            src={imagePreview} 
            alt="Preview" 
            class="max-w-32 max-h-32 object-cover border-2 border-gray-300"
            class:rounded-full={imageShape === 'circle'}
            class:rounded-lg={imageShape === 'rounded'}
            class:rounded-none={imageShape === 'square'}
          />
        </div>
      </div>
    {/if}

    <!-- Opciones de personalización -->
    {#if imagePreview}
      <div class="space-y-4">
        <!-- Forma -->
        <div class="bg-white rounded-lg p-4 border border-gray-200">
          <fieldset>
            <legend class="block text-sm font-medium text-gray-800 mb-3">Forma</legend>
          <div class="space-y-2">
            <button
              type="button"
              class="w-full p-3 rounded-lg border-2 transition-colors flex items-center gap-3 hover:shadow-sm"
              class:border-blue-500={imageShape === 'circle'}
              class:bg-blue-50={imageShape === 'circle'}
              class:border-gray-300={imageShape !== 'circle'}
              class:bg-white={imageShape !== 'circle'}
              class:hover:bg-gray-50={imageShape !== 'circle'}
              on:click={() => imageShape = 'circle'}
            >
              <div class="w-8 h-8 bg-gray-400 rounded-full flex-shrink-0"></div>
              <span class="text-sm text-gray-700 font-medium">Circular</span>
            </button>
            
            <button
              type="button"
              class="w-full p-3 rounded-lg border-2 transition-colors flex items-center gap-3 hover:shadow-sm"
              class:border-blue-500={imageShape === 'rounded'}
              class:bg-blue-50={imageShape === 'rounded'}
              class:border-gray-300={imageShape !== 'rounded'}
              class:bg-white={imageShape !== 'rounded'}
              class:hover:bg-gray-50={imageShape !== 'rounded'}
              on:click={() => imageShape = 'rounded'}
            >
              <div class="w-8 h-8 bg-gray-400 rounded-lg flex-shrink-0"></div>
              <span class="text-sm text-gray-700 font-medium">Redondeada</span>
            </button>
            
            <button
              type="button"
              class="w-full p-3 rounded-lg border-2 transition-colors flex items-center gap-3 hover:shadow-sm"
              class:border-blue-500={imageShape === 'square'}
              class:bg-blue-50={imageShape === 'square'}
              class:border-gray-300={imageShape !== 'square'}
              class:bg-white={imageShape !== 'square'}
              class:hover:bg-gray-50={imageShape !== 'square'}
              on:click={() => imageShape = 'square'}
            >
              <div class="w-8 h-8 bg-gray-400 flex-shrink-0"></div>
              <span class="text-sm text-gray-700 font-medium">Cuadrada</span>
            </button>
          </div>
          </fieldset>
        </div>

        <!-- Tamaño -->
        <div class="bg-white rounded-lg p-4 border border-gray-200">
          <fieldset>
            <legend class="block text-sm font-medium text-gray-800 mb-3">Tamaño</legend>
          <div class="space-y-2">
            <label class="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
              <input 
                type="radio" 
                bind:group={imageSize} 
                value="small"
                class="w-4 h-4 text-blue-600 bg-white border-gray-300 focus:ring-blue-500"
              />
              <span class="text-gray-700">Pequeño (60px)</span>
            </label>
            
            <label class="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
              <input 
                type="radio" 
                bind:group={imageSize} 
                value="medium"
                class="w-4 h-4 text-blue-600 bg-white border-gray-300 focus:ring-blue-500"
              />
              <span class="text-gray-700">Mediano (80px)</span>
            </label>
            
            <label class="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
              <input 
                type="radio" 
                bind:group={imageSize} 
                value="large"
                class="w-4 h-4 text-blue-600 bg-white border-gray-300 focus:ring-blue-500"
              />
              <span class="text-gray-700">Grande (100px)</span>
            </label>
          </div>
          </fieldset>
        </div>
      </div>
    {/if}
  </div>

  <!-- Botones de navegación -->
  <div class="flex justify-between pt-6">
    <button 
      type="button"
      class="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors font-medium"
      on:click={() => goto('/editor/social')}
    >
      ← Anterior
    </button>
    
    <button 
      type="button"
      class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
      on:click={handleContinue}
    >
      {imagePreview ? 'Continuar' : 'Omitir'} →
    </button>
  </div>
</div>