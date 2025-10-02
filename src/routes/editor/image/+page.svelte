<script lang="ts">
  import { goto } from '$app/navigation';
  import { signatureData, setImageData } from '$lib/stores/signature.js';
  import { markStepAsCompleted } from '$lib/stores/navigation.js';
  import { onMount } from 'svelte';

  let fileInput: HTMLInputElement;
  let dragActive = false;
  let imagePreview = '';
  let imageShape: 'circle' | 'square' | 'rounded' = 'circle';
  let imageSize: 'small' | 'medium' | 'large' = 'medium';
  let imageUrl = '';
  let urlError = '';
  let showUrlInput = false;

  // Inicializar con datos existentes
  onMount(() => {
    if ($signatureData.image?.url) {
      imagePreview = $signatureData.image.url;
      imageShape = $signatureData.image.shape || 'circle';
      imageSize = $signatureData.image.size || 'medium';
    }
  });

  // Reactividad para actualizar datos cuando cambian las propiedades
  $: if (imagePreview) {
    updateImageData();
  }

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
    if (file && file.type.startsWith('image/')) {
      processFile(file);
    }
  }

  function processFile(file: File) {
    if (file.size > 2 * 1024 * 1024) { // 2MB
      alert('La imagen debe ser menor a 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview = e.target?.result as string;
      updateImageData();
    };
    reader.readAsDataURL(file);
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
    showUrlInput = false;
    setImageData(null);
    if (fileInput) {
      fileInput.value = '';
    }
  }

  function handleContinue() {
    if (imagePreview) {
      updateImageData();
      markStepAsCompleted('image');
    }
    goto('/editor/design');
  }

  function handleDragOver(event: DragEvent) {
    event.preventDefault();
    dragActive = true;
  }

  function handleDragLeave() {
    dragActive = false;
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
    showUrlInput = false;
    updateImageData();
  }

  function toggleUrlInput() {
    showUrlInput = !showUrlInput;
    if (showUrlInput) {
      imageUrl = '';
      urlError = '';
    }
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
    <h2 class="text-2xl font-bold text-slate-100 mb-2">Agrega tu imagen o logo</h2>
    <p class="text-slate-400">Sube una foto personal o logo de tu empresa para personalizar tu firma</p>
  </div>

  <!-- Área de subida de archivos -->
  <div class="space-y-4">
    {#if !imagePreview}
      <div 
        class="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center transition-colors duration-300"
        class:border-blue-400={dragActive}
        class:bg-slate-800={dragActive}
        on:drop={handleDrop}
        on:dragover={handleDragOver}
        on:dragleave={handleDragLeave}
        role="button"
        tabindex="0"
      >
        <div class="space-y-4">
          <div class="w-16 h-16 mx-auto bg-slate-700 rounded-full flex items-center justify-center">
            <svg class="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          
          <div>
            <p class="text-slate-300 mb-4">Arrastra tu imagen aquí o</p>
            <div class="flex flex-col gap-3">
              <button 
                type="button"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                on:click={() => fileInput.click()}
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Seleccionar archivo
              </button>
              
              <div class="text-slate-400 text-sm">o</div>
              
              <button 
                type="button"
                class="inline-flex items-center px-4 py-2 border border-slate-600 text-sm font-medium rounded-md text-slate-300 bg-transparent hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                on:click={toggleUrlInput}
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                {showUrlInput ? 'Cancelar URL' : 'Usar URL de imagen'}
              </button>
            </div>
          </div>
          
          <p class="text-xs text-slate-500">
            PNG, JPG, GIF hasta 2MB
          </p>
        </div>
      </div>

      <!-- Formulario de URL -->
      {#if showUrlInput}
        <div class="bg-slate-800 rounded-lg p-6 border border-slate-600">
          <h3 class="text-lg font-semibold text-slate-200 mb-4">Ingresar URL de imagen</h3>
          <div class="space-y-4">
            <div>
              <label for="imageUrl" class="block text-sm font-medium text-slate-300 mb-2">
                URL de la imagen
              </label>
              <input
                type="url"
                id="imageUrl"
                bind:value={imageUrl}
                on:input={clearUrlError}
                class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-slate-200 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://ejemplo.com/imagen.jpg"
              />
              {#if urlError}
                <p class="mt-2 text-sm text-red-400">{urlError}</p>
              {/if}
            </div>
            
            <div class="flex gap-3">
              <button
                type="button"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                on:click={handleUrlSubmit}
              >
                Cargar imagen
              </button>
              <button
                type="button"
                class="px-4 py-2 bg-slate-600 text-slate-200 rounded-md hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-colors"
                on:click={toggleUrlInput}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      {/if}
    {:else}
      <!-- Preview de la imagen -->
      <div class="bg-slate-800 rounded-lg p-6">
        <div class="flex items-start justify-between mb-4">
          <h3 class="text-lg font-semibold text-slate-200">Vista previa</h3>
          <button 
            type="button"
            class="text-red-400 hover:text-red-300 transition-colors"
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
            class="max-w-32 max-h-32 object-cover border-2 border-slate-600"
            class:rounded-full={imageShape === 'circle'}
            class:rounded-lg={imageShape === 'rounded'}
            class:rounded-none={imageShape === 'square'}
          />
        </div>
      </div>
    {/if}

    <!-- Opciones de personalización -->
    {#if imagePreview}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Forma -->
        <div class="bg-slate-800 rounded-lg p-4">
          <fieldset>
            <legend class="block text-sm font-medium text-slate-200 mb-3">Forma</legend>
          <div class="grid grid-cols-3 gap-2">
            <button
              type="button"
              class="p-3 rounded-lg border transition-colors"
              class:border-blue-500={imageShape === 'circle'}
              class:bg-blue-900={imageShape === 'circle'}
              class:border-slate-600={imageShape !== 'circle'}
              class:bg-slate-700={imageShape !== 'circle'}
              on:click={() => imageShape = 'circle'}
            >
              <div class="w-8 h-8 bg-slate-400 rounded-full mx-auto"></div>
              <p class="text-xs text-slate-300 mt-1">Circular</p>
            </button>
            
            <button
              type="button"
              class="p-3 rounded-lg border transition-colors"
              class:border-blue-500={imageShape === 'rounded'}
              class:bg-blue-900={imageShape === 'rounded'}
              class:border-slate-600={imageShape !== 'rounded'}
              class:bg-slate-700={imageShape !== 'rounded'}
              on:click={() => imageShape = 'rounded'}
            >
              <div class="w-8 h-8 bg-slate-400 rounded-lg mx-auto"></div>
              <p class="text-xs text-slate-300 mt-1">Redondeada</p>
            </button>
            
            <button
              type="button"
              class="p-3 rounded-lg border transition-colors"
              class:border-blue-500={imageShape === 'square'}
              class:bg-blue-900={imageShape === 'square'}
              class:border-slate-600={imageShape !== 'square'}
              class:bg-slate-700={imageShape !== 'square'}
              on:click={() => imageShape = 'square'}
            >
              <div class="w-8 h-8 bg-slate-400 mx-auto"></div>
              <p class="text-xs text-slate-300 mt-1">Cuadrada</p>
            </button>
          </div>
          </fieldset>
        </div>

        <!-- Tamaño -->
        <div class="bg-slate-800 rounded-lg p-4">
          <fieldset>
            <legend class="block text-sm font-medium text-slate-200 mb-3">Tamaño</legend>
          <div class="space-y-2">
            <label class="flex items-center space-x-3">
              <input 
                type="radio" 
                bind:group={imageSize} 
                value="small"
                class="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 focus:ring-blue-500"
              />
              <span class="text-slate-300">Pequeño (60px)</span>
            </label>
            
            <label class="flex items-center space-x-3">
              <input 
                type="radio" 
                bind:group={imageSize} 
                value="medium"
                class="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 focus:ring-blue-500"
              />
              <span class="text-slate-300">Mediano (80px)</span>
            </label>
            
            <label class="flex items-center space-x-3">
              <input 
                type="radio" 
                bind:group={imageSize} 
                value="large"
                class="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 focus:ring-blue-500"
              />
              <span class="text-slate-300">Grande (100px)</span>
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
      class="px-6 py-2 text-slate-400 hover:text-slate-200 transition-colors"
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

<input 
  type="file" 
  accept="image/*" 
  class="hidden" 
  bind:this={fileInput}
  on:change={handleFileSelect}
/>