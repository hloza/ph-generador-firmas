<script lang="ts">
  import { signatureData } from '$lib/stores/signature.js';
  import { templates } from '$lib/data/templates.js';

  $: selectedTemplateId = $signatureData.templateId;
  $: selectedTemplate = selectedTemplateId ? templates.find(t => t.id === selectedTemplateId) : null;

  function getTemplatePreview(templateId: string): string {
    const previews: Record<string, string> = {
      'minimal-1': `
        <div class="p-3 bg-white border rounded-lg shadow-sm text-xs font-sans">
          <div class="space-y-2">
            <p class="font-bold text-gray-900 text-sm">Ana García Martínez</p>
            <p class="text-blue-600 font-medium">Directora de Marketing Digital</p>
            <p class="text-gray-600">Innovación Tecnológica S.L.</p>
            <div class="flex items-center space-x-3 text-gray-500 mt-3">
              <span>📧 ana.garcia@innovatech.es</span>
              <span>📱 +34 691 234 567</span>
            </div>
          </div>
        </div>
      `,
      'professional-1': `
        <div class="p-3 bg-white border-2 border-blue-200 rounded text-xs">
          <div class="flex items-start space-x-3">
            <div class="w-4 h-4 bg-blue-600 rounded-full flex-shrink-0 mt-1"></div>
            <div>
              <p class="font-bold text-gray-900">Carlos Mendoza</p>
              <p class="text-blue-700 font-semibold">Consultor Senior</p>
              <p class="text-gray-600">carlos@consultoria.com</p>
            </div>
          </div>
        </div>
      `,
      'minimal-2': `
        <div class="p-3 bg-gray-50 border rounded text-xs">
          <p class="font-bold text-gray-900">María López</p>
          <p class="text-gray-700">Diseñadora UX/UI</p>
          <p class="text-gray-600">maria@design.co</p>
        </div>
      `,
      'creative-1': `
        <div class="p-3 bg-gradient-to-r from-purple-100 to-pink-100 border rounded text-xs">
          <p class="font-bold text-purple-800">Alex Rivera</p>
          <p class="text-pink-700">Creative Director</p>
          <p class="text-gray-700">alex@creative.studio</p>
        </div>
      `
    };
    return previews[templateId] || previews['minimal-1'];
  }
</script>

{#if selectedTemplate}
  <div class="text-center">
    <div class="bg-white rounded-lg p-4 shadow-lg">
      {@html getTemplatePreview(selectedTemplateId)}
    </div>
    <p class="text-slate-400 text-sm mt-3">{selectedTemplate.name}</p>
    <p class="text-slate-500 text-xs">{selectedTemplate.category}</p>
  </div>
{:else}
  <div class="text-center text-slate-400">
    <svg class="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
    </svg>
    <p>Selecciona una plantilla para ver la vista previa</p>
  </div>
{/if}