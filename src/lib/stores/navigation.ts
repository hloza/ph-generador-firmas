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
    title: 'Imagen/Logo',
    description: 'Agrega tu foto o logo personal',
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