import { writable } from 'svelte/store';

// Store para manejar la vista previa de plantillas
export const templatePreview = writable<string | null>(null);

// Store para controlar si mostrar las plantillas en el sidebar
export const showTemplatesInSidebar = writable<boolean>(false);