import { writable } from 'svelte/store';

export interface Step {
  id: string;
  title: string;
  description: string;
  path: string;
  completed: boolean;
}

export const steps: Step[] = [
  {
    id: 'template',
    title: 'Plantilla',
    description: 'Elige tu diseño favorito',
    path: '/',
    completed: false
  },
  {
    id: 'personal',
    title: 'Información Personal',
    description: 'Completa tus datos básicos',
    path: '/editor/personal',
    completed: false
  },
  {
    id: 'contact',
    title: 'Contacto',
    description: 'Agrega tu información de contacto',
    path: '/editor/contact',
    completed: false
  },
  {
    id: 'social',
    title: 'Redes Sociales',
    description: 'Conecta tus perfiles sociales',
    path: '/editor/social',
    completed: false
  },
  {
    id: 'image',
    title: 'Imagen de Perfil',
    description: 'Sube tu foto profesional',
    path: '/editor/image',
    completed: false
  },
  {
    id: 'design',
    title: 'Personalización',
    description: 'Ajusta colores y estilos',
    path: '/editor/design',
    completed: false
  },
  {
    id: 'preview',
    title: 'Vista Previa',
    description: 'Revisa y descarga tu firma',
    path: '/editor/preview',
    completed: false
  }
];

export const currentStep = writable<string>('template');
export const stepsStore = writable<Step[]>(steps);

export function setCurrentStep(stepId: string) {
  currentStep.set(stepId);
}

export function markStepAsCompleted(stepId: string) {
  stepsStore.update(steps => {
    return steps.map(step => 
      step.id === stepId 
        ? { ...step, completed: true }
        : step
    );
  });
}

export function getNextStep(currentStepId: string): Step | null {
  const currentIndex = steps.findIndex(step => step.id === currentStepId);
  return currentIndex < steps.length - 1 ? steps[currentIndex + 1] : null;
}

export function getPreviousStep(currentStepId: string): Step | null {
  const currentIndex = steps.findIndex(step => step.id === currentStepId);
  return currentIndex > 0 ? steps[currentIndex - 1] : null;
}

export function canNavigateToStep(targetStepId: string, completedSteps: Step[]): boolean {
  const targetIndex = steps.findIndex(step => step.id === targetStepId);
  if (targetIndex === -1) return false;
  
  // Siempre se puede navegar al primer paso
  if (targetIndex === 0) return true;
  
  // Se puede navegar a un paso si:
  // 1. El paso ya está completado (navegación libre)
  // 2. Todos los pasos anteriores están completados (navegación secuencial)
  const targetStep = completedSteps.find(step => step.id === targetStepId);
  if (targetStep?.completed) return true;
  
  // Verificar que todos los pasos anteriores estén completados
  for (let i = 0; i < targetIndex; i++) {
    const previousStep = completedSteps.find(step => step.id === steps[i].id);
    if (!previousStep?.completed) return false;
  }
  
  return true;
}

export function markAllStepsAsCompleted() {
  stepsStore.update(steps => {
    return steps.map(step => ({ ...step, completed: true }));
  });
}

// Función para resetear todos los pasos (limpiar progreso)
export function resetAllSteps() {
  stepsStore.update(steps => {
    return steps.map(step => ({ ...step, completed: false }));
  });
  currentStep.set('template');
}