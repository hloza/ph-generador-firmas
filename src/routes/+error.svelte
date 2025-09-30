<script>
  import { page } from '$app/stores';
</script>

<svelte:head>
  <title>Página no encontrada - Generador de Firmas</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
  <div class="text-center p-8">
    <div class="mb-6">
      <svg class="w-16 h-16 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.74-.881-6.54-2.64C6.18 11.66 7.2 11 8.5 11H15.5c1.3 0 2.32.66 2.95 1.36A7.962 7.962 0 0112 15z"></path>
      </svg>
    </div>
    <h1 class="text-4xl font-bold text-gray-900 mb-4">404</h1>
    <p class="text-xl text-gray-600 mb-8">Página no encontrada</p>
    <a 
      href="/" 
      class="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
    >
      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
      </svg>
      Ir al inicio
    </a>
  </div>
</div>