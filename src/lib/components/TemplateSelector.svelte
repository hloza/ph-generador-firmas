<script lang="ts">
  import { templates } from '$lib/data/templates.js';
  import { signatureData } from '$lib/stores/signature.js';
  import { markStepAsCompleted } from '$lib/stores/navigation.js';

  // Variable reactiva para obtener el template seleccionado
  $: selectedTemplateId = $signatureData.templateId;

  function selectTemplate(templateId: string) {
    signatureData.update(data => ({
      ...data,
      templateId
    }));
    markStepAsCompleted('template');
  }
</script>

<div class="flex flex-col gap-3 w-full">
  {#each templates as template}
    <button 
      type="button"
      on:click={() => selectTemplate(template.id)}
      class="group relative h-12 px-3 rounded-lg transition-all duration-300 cursor-pointer text-center flex items-center justify-center border-2 shadow-sm {selectedTemplateId === template.id ? 'bg-blue-600 border-blue-600 text-white shadow-md -translate-y-0.5' : 'bg-slate-50 border-slate-100 hover:border-blue-400 hover:bg-white text-slate-600 hover:text-blue-600'}"
    >
      <span class="text-[10px] font-bold uppercase tracking-tight">
        {template.name}
      </span>
      
      {#if selectedTemplateId === template.id}
        <div class="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-sm border border-blue-600 animate-fade-in">
          <svg class="w-2 h-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
          </svg>
        </div>
      {/if}
    </button>
  {/each}
</div>

<style>
  .animate-fade-in {
    animation: fadeIn 0.2s ease-out forwards;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: scale(0.8); }
    to { opacity: 1; transform: scale(1); }
  }
</style>
