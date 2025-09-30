<script lang="ts">
  import { templates } from '$lib/data/templates.js';
  import { signatureData } from '$lib/stores/signature.js';
  import { goto } from '$app/navigation';
  import { markStepAsCompleted, getNextStep } from '$lib/stores/navigation';
  import type { Template } from '$lib/stores/signature.js';

  // Variables para el manejo de la selección
  
  // Variable reactiva para obtener el template seleccionado
  $: selectedTemplateId = $signatureData.templateId;

  // Mostrar todas las plantillas
  $: filteredTemplates = templates;

  function selectTemplate(templateId: string) {
    signatureData.update(data => ({
      ...data,
      templateId
    }));
  }



  function continueToNextStep() {
    if (selectedTemplateId) {
      markStepAsCompleted('template');
      const nextStep = getNextStep('template');
      if (nextStep) {
        goto(nextStep.path);
      }
    }
  }

  function getTemplatePreview(templateId: string): string {
    const previews: Record<string, string> = {
      // === PREVIEWS MINIMALISTAS ===
      'minimal-1': `
        <div class="p-4 bg-white border rounded-lg shadow-sm text-xs font-sans">
          <div class="space-y-2">
            <p class="font-bold text-gray-900 text-sm">Ana García Martínez</p>
            <p class="text-blue-600 font-medium">Directora de Marketing Digital</p>
            <p class="text-gray-600">Innovación Tecnológica S.L.</p>
            <div class="flex items-center space-x-3 text-gray-500 mt-3">
              <span>📧 ana.garcia@innovatech.es</span>
              <span>📱 +34 691 234 567</span>
            </div>
            <div class="flex space-x-2 mt-3">
              <div class="w-4 h-4 bg-blue-500 rounded"></div>
              <div class="w-4 h-4 bg-green-500 rounded"></div>
              <div class="w-4 h-4 bg-purple-500 rounded"></div>
            </div>
            <div class="w-12 h-px bg-gray-300 mt-3"></div>
          </div>
        </div>
      `,
      'minimal-2': `
        <div class="p-4 bg-white border rounded-lg text-xs font-sans">
          <div class="flex items-start space-x-3">
            <div class="w-3 h-12 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
            <div class="flex-1">
              <p class="font-bold text-gray-900 text-sm">Carlos López Ruiz</p>
              <p class="text-blue-600 font-medium">Senior Full Stack Developer</p>
              <p class="text-gray-600">TechSolutions Inc.</p>
              <div class="mt-2 space-y-1 text-gray-500">
                <p>✉️ carlos.lopez@techsolutions.com</p>
                <p>📞 +34 612 345 789 | 🌐 www.techsolutions.com</p>
                <p>📍 Madrid, España</p>
              </div>
              <div class="flex space-x-1 mt-2">
                <span class="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs">LinkedIn</span>
                <span class="bg-gray-100 text-gray-800 px-2 py-0.5 rounded text-xs">GitHub</span>
              </div>
            </div>
          </div>
        </div>
      `,
      'minimal-3': `
        <div class="p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs">
          <div class="text-center space-y-1">
            <p class="font-medium text-gray-900">María Silva</p>
            <p class="text-gray-600">Marketing</p>
            <div class="w-6 h-px bg-gray-300 mx-auto mt-2"></div>
          </div>
        </div>
      `,
      'minimal-4': `
        <div class="p-3 bg-white rounded-lg text-xs border-l-4 border-blue-400">
          <p class="font-semibold text-gray-900">Luis Mendez</p>
          <p class="text-blue-600 font-medium">Product Manager</p>
          <p class="text-gray-500 mt-1">luis@tech.co</p>
        </div>
      `,

      // === PREVIEWS PROFESIONALES ===
      'professional-1': `
        <div class="p-3 bg-white border-2 border-gray-100 rounded-lg shadow text-xs">
          <div class="border-l-3 border-blue-600 pl-3">
            <p class="font-bold text-gray-900">Elena Ruiz</p>
            <p class="text-blue-600 font-semibold">Senior Consultant</p>
            <p class="text-gray-600">elena@consulting.com</p>
            <p class="text-gray-500">+34 987 654 321</p>
          </div>
        </div>
      `,
      'professional-2': `
        <div class="p-3 bg-gradient-to-r from-white to-gray-50 border rounded-lg text-xs">
          <div class="flex justify-between items-start">
            <div>
              <p class="font-bold text-gray-900">David Chen</p>
              <p class="text-blue-700">Business Analyst</p>
            </div>
            <div class="w-3 h-3 bg-blue-600 rounded"></div>
          </div>
          <p class="text-gray-600 mt-1">david@business.com</p>
        </div>
      `,
      'professional-3': `
        <div class="p-3 bg-white border rounded-lg shadow-sm text-xs">
          <div class="grid grid-cols-3 gap-2">
            <div class="col-span-2">
              <p class="font-bold text-gray-900">Sofia Torres</p>
              <p class="text-blue-600">Finance Director</p>
              <p class="text-gray-500 text-xs">sofia@finance.co</p>
            </div>
            <div class="flex justify-end">
              <div class="w-4 h-4 bg-blue-100 rounded-full"></div>
            </div>
          </div>
        </div>
      `,
      'professional-4': `
        <div class="p-3 bg-white border-2 border-blue-200 rounded-lg text-xs">
          <div class="bg-blue-50 p-2 rounded mb-2">
            <p class="font-bold text-blue-900">Roberto Kim</p>
            <p class="text-blue-700">Executive VP</p>
          </div>
          <p class="text-gray-700">roberto@executive.com</p>
        </div>
      `,

      // === PREVIEWS CREATIVOS ===
      'creative-1': `
        <div class="p-3 bg-gradient-to-br from-purple-100 to-pink-100 border rounded-lg text-xs">
          <div class="flex items-center space-x-2">
            <div class="w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg"></div>
            <div>
              <p class="font-bold text-purple-800">Alex Rivera</p>
              <p class="text-pink-700">Creative Director</p>
              <p class="text-purple-600">alex@creative.studio</p>
            </div>
          </div>
        </div>
      `,
      'creative-2': `
        <div class="p-3 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border rounded-lg text-xs">
          <div class="relative">
            <div class="absolute top-0 right-0 w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
            <p class="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Maya Patel</p>
            <p class="text-purple-700">Brand Designer</p>
            <p class="text-gray-600">maya@design.co</p>
          </div>
        </div>
      `,
      'creative-3': `
        <div class="p-3 bg-white border-2 border-orange-200 rounded-lg text-xs relative overflow-hidden">
          <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-red-400"></div>
          <div class="pt-1">
            <p class="font-bold text-orange-800">Jordan Swift</p>
            <p class="text-red-600">Art Director</p>
            <p class="text-gray-600">jordan@artworks.com</p>
          </div>
        </div>
      `,
      'creative-4': `
        <div class="p-3 bg-gradient-to-br from-green-100 to-blue-100 border rounded-xl text-xs">
          <div class="flex items-start justify-between">
            <div>
              <p class="font-bold text-green-800">Sam Wilson</p>
              <p class="text-blue-700">Motion Designer</p>
            </div>
            <div class="w-3 h-3 bg-gradient-to-br from-green-400 to-blue-400 rounded-full"></div>
          </div>
          <p class="text-gray-700 mt-1">sam@motion.studio</p>
        </div>
      `,

      // === PREVIEWS CORPORATIVOS ===
      'corporate-1': `
        <div class="p-3 bg-white border-2 border-gray-300 rounded text-xs">
          <div class="text-center border-b border-gray-200 pb-2 mb-2">
            <div class="w-4 h-4 bg-gray-400 rounded mx-auto mb-1"></div>
            <p class="font-bold text-gray-900">Patricia Johnson</p>
            <p class="text-gray-700 font-semibold">CEO & Founder</p>
          </div>
          <p class="text-gray-600 text-center">patricia@corp.com</p>
        </div>
      `,
      'corporate-2': `
        <div class="p-3 bg-gray-50 border-2 border-gray-200 rounded text-xs">
          <div class="flex items-center space-x-3">
            <div class="w-4 h-4 bg-gray-600 rounded-sm"></div>
            <div>
              <p class="font-bold text-gray-900">Michael Brown</p>
              <p class="text-gray-700">Operations Director</p>
              <p class="text-gray-600">michael@operations.co</p>
            </div>
          </div>
        </div>
      `,
      'corporate-3': `
        <div class="p-3 bg-white border-l-4 border-gray-600 shadow text-xs">
          <div class="space-y-1">
            <p class="font-bold text-gray-900">Jennifer Davis</p>
            <p class="text-gray-700 font-medium">VP Strategic Planning</p>
            <p class="text-gray-600">jennifer@strategic.com</p>
            <div class="flex space-x-1 mt-2">
              <div class="w-1 h-1 bg-gray-400 rounded-full"></div>
              <div class="w-1 h-1 bg-gray-400 rounded-full"></div>
              <div class="w-1 h-1 bg-gray-400 rounded-full"></div>
            </div>
          </div>
        </div>
      `,
      'corporate-4': `
        <div class="p-3 bg-gradient-to-b from-gray-100 to-white border-2 border-gray-300 rounded text-xs">
          <div class="text-center">
            <div class="w-5 h-3 bg-gray-600 rounded mx-auto mb-2"></div>
            <p class="font-bold text-gray-900">Richard Clark</p>
            <p class="text-gray-800 font-semibold">Chairman</p>
            <p class="text-gray-600 mt-1">richard@board.com</p>
          </div>
        </div>
      `
    };

    return previews[templateId] || previews['minimal-1'];
  }
</script>

<div class="space-y-8">




  <!-- Lista simple de plantillas -->
  <div class="space-y-2">
    {#each filteredTemplates as template (template.id)}
      <button 
        class="w-full text-left dark-card p-4 hover:bg-slate-700/50 transition-colors {selectedTemplateId === template.id ? 'ring-2 ring-blue-400 border-blue-400 bg-blue-500/10' : ''}"
        on:click={() => selectTemplate(template.id)}
      >
        <div class="flex items-center justify-between">
          <h3 class="font-medium text-slate-200 group-hover:text-white">
            {template.name}
          </h3>
          {#if selectedTemplateId === template.id}
            <span class="text-blue-400 text-sm font-medium">✓ Seleccionada</span>
          {/if}
        </div>
      </button>
    {/each}
  </div>

  <!-- Vista previa de la plantilla seleccionada -->
  {#if selectedTemplateId}
    {@const selectedTemplate = templates.find(t => t.id === selectedTemplateId)}
    <div class="dark-card p-6 border-2 border-blue-500/30">
      <div class="text-center mb-4">
        <h3 class="text-lg font-semibold text-slate-200 mb-2">
          Vista Previa: {selectedTemplate?.name}
        </h3>
        <p class="text-slate-400">
          {selectedTemplate?.description}
        </p>
      </div>
      
      <!-- Preview de la plantilla -->
      <div class="bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg p-8 flex items-center justify-center">
        <div class="bg-white rounded-lg p-4 shadow-lg max-w-md w-full">
          {@html getTemplatePreview(selectedTemplateId)}
        </div>
      </div>
    </div>
  {/if}

  <!-- Botón de Continuar -->
  {#if selectedTemplateId}
    <div class="dark-card p-6 text-center border-2 border-blue-500/30">
      <div class="max-w-md mx-auto">
        <div class="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mx-auto mb-4">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-slate-200 mb-2">
          ¡Plantilla Seleccionada!
        </h3>
        <p class="text-slate-400 mb-6">
          Has elegido una excelente plantilla. Ahora vamos a personalizar tu información.
        </p>
        <button 
          on:click={continueToNextStep}
          class="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <div class="flex items-center justify-center space-x-2">
            <span class="text-lg">Continuar al Siguiente Paso</span>
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
            </svg>
          </div>
        </button>
      </div>
    </div>
  {/if}

  <!-- Footer informativo -->
  <div class="dark-card p-6 text-center">
    <div class="max-w-2xl mx-auto">
      <h3 class="text-lg font-semibold text-slate-200 mb-2">
        ¿Necesitas ayuda para elegir?
      </h3>
      <p class="text-slate-400 mb-4">
        Cada plantilla está diseñada para diferentes necesidades profesionales. 
        Las plantillas minimalistas son perfectas para freelancers, las profesionales para corporativos, 
        las creativas para diseñadores y las corporativas para ejecutivos.
      </p>
      <div class="flex flex-wrap justify-center gap-4 text-sm">
        <div class="flex items-center space-x-2 text-gray-700">
          <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
          </svg>
          <span>Completamente personalizable</span>
        </div>
        <div class="flex items-center space-x-2 text-gray-700">
          <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
          </svg>
          <span>Exportación múltiple</span>
        </div>
        <div class="flex items-center space-x-2 text-gray-700">
          <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
          </svg>
          <span>Vista previa en tiempo real</span>
        </div>
      </div>
    </div>
  </div>

</div>

<style>
  .filter-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.25rem;
    border-radius: 0.75rem;
    font-weight: 500;
    transition: all 0.2s ease;
    background: white;
    color: #6b7280;
    border: 2px solid #e5e7eb;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  }
  
  .filter-btn:hover {
    border-color: #3b82f6;
    color: #3b82f6;
    transform: translateY(-1px);
  }
  
  .filter-btn.active {
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    color: white;
    border-color: #3b82f6;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);
  }

  .card {
    position: relative;
    background: white;
    border-radius: 1rem;
    overflow: hidden;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    border: 2px solid transparent;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    will-change: transform;
  }

  .card:hover {
    transform: translateY(-6px) scale(1.02);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
    border-color: #3b82f6;
  }

  .card:hover::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.02), rgba(147, 51, 234, 0.02));
    pointer-events: none;
  }

  /* Animación de entrada para las tarjetas */
  .card {
    animation: cardFadeIn 0.6s ease-out forwards;
  }

  @keyframes cardFadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Mejora en los filtros */
  .filter-btn {
    position: relative;
    overflow: hidden;
  }

  .filter-btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }

  .filter-btn:hover::before {
    left: 100%;
  }


</style>