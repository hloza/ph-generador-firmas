<script lang="ts">
  import { signatureData, signatureStore, showToast } from '$lib/stores/signature.js';
  import { colorPresets, socialPlatforms } from '$lib/data/templates.js';
  import { isValidEmail, isValidUrl } from '$lib/utils/signature.js';
  import ImageUploader from './ImageUploader.svelte';

  let colorPickerOpen = false;
  let socialLinksExpanded = false;

  function handleFieldUpdate(field: string, value: any) {
    signatureStore.updateField(field as any, value);
  }

  function handleSocialLinkUpdate(platform: any, field: string, value: any) {
    const updates = { [field]: value };
    signatureStore.updateSocialLink(platform, updates);
  }

  function addSocialLink() {
    const availablePlatforms = socialPlatforms.filter(p => 
      !$signatureData.socialLinks.some(link => link.platform === p.platform)
    );
    
    if (availablePlatforms.length > 0) {
      signatureStore.addSocialLink(availablePlatforms[0].platform);
      socialLinksExpanded = true;
    } else {
      showToast('info', 'Ya has agregado todas las redes sociales disponibles');
    }
  }

  function removeSocialLink(platform: any) {
    signatureStore.removeSocialLink(platform);
  }

  $: enabledSocialLinks = $signatureData.socialLinks.filter(link => link.enabled);
  $: availableSocialPlatforms = socialPlatforms.filter(p => 
    !$signatureData.socialLinks.some(link => link.platform === p.platform)
  );
</script>

<div class="space-y-8">
  <!-- Header -->
  <div>
    <h2 class="text-2xl font-bold text-gray-900 mb-2">Editor de Firma</h2>
    <p class="text-gray-600">Personaliza los datos de tu firma profesional</p>
  </div>

  <!-- Información personal -->
  <div class="card p-6">
    <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
      <svg class="w-4 h-4 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
      </svg>
      Información Personal
    </h3>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label for="fullName" class="block text-sm font-medium text-gray-700 mb-2">
          Nombre Completo *
        </label>
        <input
          id="fullName"
          type="text"
          class="form-input"
          bind:value={$signatureData.fullName}
          on:input={(e) => handleFieldUpdate('fullName', e.target.value)}
          placeholder="Juan Pérez García"
        />
      </div>

      <div>
        <label for="position" class="block text-sm font-medium text-gray-700 mb-2">
          Cargo/Posición *
        </label>
        <input
          id="position"
          type="text"
          class="form-input"
          bind:value={$signatureData.position}
          on:input={(e) => handleFieldUpdate('position', e.target.value)}
          placeholder="Desarrollador Full Stack"
        />
      </div>

      <div>
        <label for="company" class="block text-sm font-medium text-gray-700 mb-2">
          Empresa
        </label>
        <input
          id="company"
          type="text"
          class="form-input"
          bind:value={$signatureData.company}
          on:input={(e) => handleFieldUpdate('company', e.target.value)}
          placeholder="Tech Solutions S.L."
        />
      </div>

      <div>
        <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
          Email *
        </label>
        <input
          id="email"
          type="email"
          class="form-input {!isValidEmail($signatureData.email) && $signatureData.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}"
          bind:value={$signatureData.email}
          on:input={(e) => handleFieldUpdate('email', e.target.value)}
          placeholder="juan@ejemplo.com"
        />
        {#if !isValidEmail($signatureData.email) && $signatureData.email}
          <p class="mt-1 text-sm text-red-600">Por favor, introduce un email válido</p>
        {/if}
      </div>

      <div>
        <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">
          Teléfono
        </label>
        <input
          id="phone"
          type="tel"
          class="form-input"
          bind:value={$signatureData.phone}
          on:input={(e) => handleFieldUpdate('phone', e.target.value)}
          placeholder="+34 600 123 456"
        />
      </div>

      <div>
        <label for="website" class="block text-sm font-medium text-gray-700 mb-2">
          Sitio Web
        </label>
        <input
          id="website"
          type="url"
          class="form-input {!isValidUrl($signatureData.website) && $signatureData.website ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}"
          bind:value={$signatureData.website}
          on:input={(e) => handleFieldUpdate('website', e.target.value)}
          placeholder="https://tudominio.com"
        />
        {#if !isValidUrl($signatureData.website) && $signatureData.website}
          <p class="mt-1 text-sm text-red-600">Por favor, introduce una URL válida</p>
        {/if}
      </div>

      <div class="md:col-span-2">
        <label for="address" class="block text-sm font-medium text-gray-700 mb-2">
          Dirección
        </label>
        <input
          id="address"
          type="text"
          class="form-input"
          bind:value={$signatureData.address}
          on:input={(e) => handleFieldUpdate('address', e.target.value)}
          placeholder="Madrid, España"
        />
      </div>
    </div>
  </div>

  <!-- Imagen de perfil -->
  <div class="card p-6">
    <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
      <svg class="w-4 h-4 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
      </svg>
      Imagen de Perfil
    </h3>

    <ImageUploader />

    <!-- Selector de forma -->
    <div class="mt-4">
      <fieldset>
        <legend class="block text-sm font-medium text-gray-700 mb-2">
          Forma de la imagen
        </legend>
      <div class="flex space-x-4">
        <label class="flex items-center">
          <input
            type="radio"
            bind:group={$signatureData.imageShape}
            value="circle"
            on:change={() => handleFieldUpdate('imageShape', 'circle')}
            class="form-radio h-4 w-4 text-primary-600"
          />
          <span class="ml-2 text-sm text-gray-700">Circular</span>
        </label>
        <label class="flex items-center">
          <input
            type="radio"
            bind:group={$signatureData.imageShape}
            value="rounded"
            on:change={() => handleFieldUpdate('imageShape', 'rounded')}
            class="form-radio h-4 w-4 text-primary-600"
          />
          <span class="ml-2 text-sm text-gray-700">Redondeada</span>
        </label>
        <label class="flex items-center">
          <input
            type="radio"
            bind:group={$signatureData.imageShape}
            value="square"
            on:change={() => handleFieldUpdate('imageShape', 'square')}
            class="form-radio h-4 w-4 text-primary-600"
          />
          <span class="ml-2 text-sm text-gray-700">Cuadrada</span>
        </label>
      </div>
      </fieldset>
    </div>
  </div>

  <!-- Color principal -->
  <div class="card p-6">
    <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
      <svg class="w-4 h-4 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"></path>
      </svg>
      Color Principal
    </h3>

    <div class="space-y-4">
      <!-- Presets de colores -->
      <div>
        <p class="block text-sm font-medium text-gray-700 mb-2">
          Colores predefinidos
        </p>
        <div class="grid grid-cols-5 gap-3">
          {#each colorPresets as preset}
            <button
              class="w-10 h-10 rounded-lg border-2 transition-all duration-200 hover:scale-110
                     {$signatureData.primaryColor === preset.value ? 'border-gray-400 shadow-lg' : 'border-gray-200'}"
              style="background-color: {preset.value}"
              title={preset.name}
              on:click={() => handleFieldUpdate('primaryColor', preset.value)}
            >
              {#if $signatureData.primaryColor === preset.value}
                <svg class="w-4 h-4 text-white mx-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                </svg>
              {/if}
            </button>
          {/each}
        </div>
      </div>

      <!-- Selector de color personalizado -->
      <div>
        <label for="customColor" class="block text-sm font-medium text-gray-700 mb-2">
          Color personalizado
        </label>
        <div class="flex items-center space-x-3">
          <input
            id="customColor"
            type="color"
            class="h-10 w-16 border border-gray-300 rounded cursor-pointer"
            bind:value={$signatureData.primaryColor}
            on:input={(e) => handleFieldUpdate('primaryColor', e.target.value)}
          />
          <input
            type="text"
            class="flex-1 form-input"
            bind:value={$signatureData.primaryColor}
            on:input={(e) => handleFieldUpdate('primaryColor', e.target.value)}
            placeholder="#0ea5e9"
          />
        </div>
      </div>

      <!-- Vista previa del color -->
      <div class="p-4 rounded-lg border" style="background-color: {$signatureData.primaryColor}20; border-color: {$signatureData.primaryColor}40">
        <p style="color: {$signatureData.primaryColor}" class="font-semibold">
          Vista previa del color seleccionado
        </p>
      </div>
    </div>
  </div>

  <!-- Redes sociales -->
  <div class="card p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900 flex items-center">
        <svg class="w-4 h-4 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c-5 0-9-4-9-9s4-9 9-9"></path>
        </svg>
        Redes Sociales
      </h3>
      <button
        class="btn-secondary text-sm"
        on:click={() => socialLinksExpanded = !socialLinksExpanded}
      >
        {socialLinksExpanded ? 'Ocultar' : 'Mostrar'}
      </button>
    </div>

    {#if socialLinksExpanded}
      <div class="space-y-4">
        {#each $signatureData.socialLinks as link, index (link.platform)}
          {@const platform = socialPlatforms.find(p => p.platform === link.platform)}
          {#if platform}
            <div class="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div class="flex items-center space-x-3 flex-shrink-0">
                <div 
                  class="w-6 h-6 rounded flex items-center justify-center text-white text-sm"
                  style="background-color: {platform.color}"
                >
                  {platform.label.charAt(0)}
                </div>
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    bind:checked={link.enabled}
                    on:change={(e) => handleSocialLinkUpdate(link.platform, 'enabled', e.target.checked)}
                    class="form-checkbox h-4 w-4 text-primary-600"
                  />
                  <span class="ml-2 text-sm font-medium text-gray-700">{platform.label}</span>
                </label>
              </div>
              
              <input
                type="url"
                class="flex-1 form-input"
                bind:value={link.url}
                on:input={(e) => handleSocialLinkUpdate(link.platform, 'url', e.target.value)}
                placeholder={platform.placeholder}
                disabled={!link.enabled}
              />
              
              <button
                class="text-red-600 hover:text-red-800 p-1"
                on:click={() => removeSocialLink(link.platform)}
                aria-label="Eliminar red social {platform.label}"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </div>
          {/if}
        {/each}

        {#if availableSocialPlatforms.length > 0}
          <button
            class="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-primary-400 hover:text-primary-600 transition-colors duration-200"
            on:click={addSocialLink}
          >
            <svg class="w-4 h-4 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Agregar red social
          </button>
        {/if}
      </div>
    {:else}
      <p class="text-sm text-gray-600">
        {enabledSocialLinks.length} red{enabledSocialLinks.length !== 1 ? 'es' : ''} social{enabledSocialLinks.length !== 1 ? 'es' : ''} configurada{enabledSocialLinks.length !== 1 ? 's' : ''}
      </p>
    {/if}
  </div>

  <!-- Botones de acción -->
  <div class="flex justify-between pt-6 border-t">
    <button
      class="btn-secondary px-6 py-3"
      on:click={() => signatureStore.reset()}
    >
      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
      </svg>
      Resetear
    </button>
  </div>
</div>