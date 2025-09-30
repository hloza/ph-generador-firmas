<script lang="ts">
  import { signatureData } from '$lib/stores/signature.js';
  import { templates } from '$lib/data/templates.js';

  $: selectedTemplateId = $signatureData.templateId;
  $: selectedTemplate = selectedTemplateId ? templates.find(t => t.id === selectedTemplateId) : null;

  function getTemplatePreview(templateId: string): string {
    const previews: Record<string, string> = {
      'minimal-1': `
        <div class="bg-white rounded-2xl p-6 shadow-2xl border border-slate-200">
          <div class="space-y-4">
            <div class="border-b border-slate-200 pb-4">
              <h3 class="font-black text-slate-900 text-lg mb-2">Ana García Martínez</h3>
              <p class="text-blue-600 font-bold text-sm">Directora de Marketing Digital</p>
              <p class="text-slate-600 font-medium text-sm">Innovación Tecnológica S.L.</p>
            </div>
            <div class="grid grid-cols-1 gap-3 text-sm">
              <div class="flex items-center space-x-3 text-slate-700">
                <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                  </svg>
                </div>
                <span class="font-medium">ana.garcia@innovatech.es</span>
              </div>
              <div class="flex items-center space-x-3 text-slate-700">
                <div class="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                  <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                  </svg>
                </div>
                <span class="font-medium">+34 691 234 567</span>
              </div>
            </div>
          </div>
        </div>
      `,
      'professional-1': `
        <div class="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 shadow-2xl border-2 border-blue-200">
          <div class="flex items-start space-x-4">
            <div class="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
              </svg>
            </div>
            <div class="flex-1">
              <h3 class="font-black text-slate-900 text-lg mb-1">Carlos Mendoza</h3>
              <p class="text-blue-700 font-bold text-sm mb-2">Consultor Senior</p>
              <div class="flex items-center space-x-2 text-slate-600 text-sm">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                </svg>
                <span class="font-medium">carlos@consultoria.com</span>
              </div>
            </div>
          </div>
        </div>
      `,
      'minimal-2': `
        <div class="bg-gradient-to-r from-slate-100 to-slate-50 rounded-2xl p-6 shadow-xl border border-slate-300">
          <div class="space-y-3">
            <h3 class="font-black text-slate-900 text-lg">María López</h3>
            <p class="text-slate-700 font-bold text-sm">Diseñadora UX/UI</p>
            <div class="flex items-center space-x-2 text-slate-600 text-sm">
              <div class="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span class="font-medium">maria@design.co</span>
            </div>
          </div>
        </div>
      `,
      'creative-1': `
        <div class="bg-gradient-to-br from-purple-100 via-pink-50 to-orange-100 rounded-2xl p-6 shadow-2xl border border-purple-200">
          <div class="space-y-4">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM16 8a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1V9a1 1 0 00-1-1h-2z" clip-rule="evenodd"></path>
                </svg>
              </div>
              <div>
                <h3 class="font-black text-purple-900 text-lg">Alex Rivera</h3>
                <p class="text-pink-700 font-bold text-sm">Creative Director</p>
              </div>
            </div>
            <div class="text-slate-700 text-sm font-medium">alex@creative.studio</div>
          </div>
        </div>
      `
    };
    return previews[templateId] || previews['minimal-1'];
  }
</script>

<!-- Contenedor principal con diseño premium -->
<div class="h-full">
  {#if selectedTemplate}
    <!-- Vista previa con plantilla seleccionada -->
    <div class="space-y-6">
      <!-- Header del preview -->
      <div class="text-center space-y-3">
        <div class="inline-flex items-center space-x-3 bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30 rounded-full px-4 py-2 backdrop-blur-sm">
          <div class="w-3 h-3 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-500/50"></div>
          <span class="text-emerald-300 font-bold text-sm">Vista Previa</span>
        </div>
        <h3 class="text-2xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          {selectedTemplate.name}
        </h3>
        <p class="text-slate-400 text-sm">
          Categoría: <span class="text-cyan-300 font-medium">{selectedTemplate.category}</span>
        </p>
      </div>

      <!-- Simulación de email -->
      <div class="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
        <!-- Header del email simulado -->
        <div class="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
              </svg>
            </div>
            <div>
              <p class="text-white font-bold text-sm">Nuevo Email</p>
              <p class="text-slate-400 text-xs">Así se verá tu firma</p>
            </div>
          </div>
          <div class="flex space-x-2">
            <div class="w-3 h-3 bg-red-500 rounded-full"></div>
            <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div class="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
        </div>

        <!-- Contenido del email -->
        <div class="space-y-4 mb-6">
          <div class="text-slate-300 text-sm">
            <p class="mb-2">Hola equipo,</p>
            <p class="mb-2">Espero que tengan un excelente día. Adjunto encontrarán el reporte solicitado.</p>
            <p class="mb-4">Saludos cordiales,</p>
          </div>
        </div>

        <!-- Línea separadora -->
        <div class="border-t border-slate-700 mb-6"></div>

        <!-- Vista previa de la firma -->
        <div class="transform scale-90 origin-left">
          {@html getTemplatePreview(selectedTemplateId)}
        </div>
      </div>

      <!-- Información adicional -->
      <div class="text-center space-y-4">
        <div class="grid grid-cols-3 gap-4 text-center">
          <div class="bg-cyan-500/10 border border-cyan-500/30 rounded-2xl p-3 backdrop-blur-sm">
            <div class="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
              <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
            </div>
            <p class="text-cyan-300 text-xs font-bold">Responsive</p>
          </div>
          <div class="bg-purple-500/10 border border-purple-500/30 rounded-2xl p-3 backdrop-blur-sm">
            <div class="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
              <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM16 8a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1V9a1 1 0 00-1-1h-2z" clip-rule="evenodd"></path>
              </svg>
            </div>
            <p class="text-purple-300 text-xs font-bold">Profesional</p>
          </div>
          <div class="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-3 backdrop-blur-sm">
            <div class="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
              <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd"></path>
              </svg>
            </div>
            <p class="text-emerald-300 text-xs font-bold">Rápido</p>
          </div>
        </div>
      </div>
    </div>
  {:else}
    <!-- Estado sin selección -->
    <div class="flex flex-col items-center justify-center h-full text-center space-y-6">
      <!-- Icono central animado -->
      <div class="relative">
        <div class="w-24 h-24 bg-gradient-to-br from-slate-700/30 to-slate-800/30 rounded-full flex items-center justify-center border-4 border-dashed border-slate-600/50 backdrop-blur-sm">
          <svg class="w-12 h-12 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
          </svg>
        </div>
        <!-- Anillos animados -->
        <div class="absolute inset-0 w-24 h-24 border-2 border-slate-600/30 rounded-full animate-ping" style="animation-duration: 3s;"></div>
        <div class="absolute inset-2 w-20 h-20 border border-slate-500/20 rounded-full animate-ping" style="animation-duration: 2s; animation-delay: 1s;"></div>
      </div>

      <!-- Texto informativo -->
      <div class="space-y-3 max-w-sm">
        <h3 class="text-2xl font-bold text-slate-300">
          Vista Previa
        </h3>
        <p class="text-slate-400 leading-relaxed">
          Selecciona una plantilla del panel izquierdo para ver cómo se verá tu firma de email profesional
        </p>
      </div>

      <!-- Indicadores -->
      <div class="flex space-x-2">
        <div class="w-3 h-3 bg-slate-600 rounded-full animate-bounce" style="animation-delay: 0s;"></div>
        <div class="w-3 h-3 bg-slate-600 rounded-full animate-bounce" style="animation-delay: 0.2s;"></div>
        <div class="w-3 h-3 bg-slate-600 rounded-full animate-bounce" style="animation-delay: 0.4s;"></div>
      </div>
    </div>
  {/if}
</div>