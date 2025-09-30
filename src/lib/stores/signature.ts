import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Tipos de datos
export interface SocialLink {
  platform: 'linkedin' | 'twitter' | 'instagram' | 'facebook' | 'github' | 'youtube';
  url: string;
  enabled: boolean;
}

export interface SignatureData {
  fullName: string;
  position: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  company: string;
  socialLinks: SocialLink[];
  profileImage: string | null;
  imageShape: 'circle' | 'square' | 'rounded';
  primaryColor: string;
  templateId: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  preview: string;
  category: 'minimal' | 'professional' | 'creative' | 'corporate';
}

// Estado inicial
const initialSignatureData: SignatureData = {
  fullName: 'Juan Pérez',
  position: 'Desarrollador Full Stack',
  email: 'juan.perez@ejemplo.com',
  phone: '+34 600 123 456',
  website: 'https://juanperez.dev',
  address: 'Madrid, España',
  company: 'Tech Solutions S.L.',
  socialLinks: [
    { platform: 'linkedin', url: 'https://linkedin.com/in/juanperez', enabled: true },
    { platform: 'twitter', url: 'https://twitter.com/juanperez', enabled: false },
    { platform: 'github', url: 'https://github.com/juanperez', enabled: true },
    { platform: 'instagram', url: '', enabled: false },
    { platform: 'facebook', url: '', enabled: false },
    { platform: 'youtube', url: '', enabled: false }
  ],
  profileImage: null,
  imageShape: 'circle',
  primaryColor: '#0ea5e9',
  templateId: 'minimal-1'
};

// Función para cargar datos del localStorage
function loadFromStorage(): SignatureData {
  if (!browser) return initialSignatureData;
  
  try {
    const stored = localStorage.getItem('signatureData');
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...initialSignatureData, ...parsed };
    }
  } catch (error) {
    console.error('Error loading from localStorage:', error);
  }
  
  return initialSignatureData;
}

// Stores principales
export const signatureData = writable<SignatureData>(loadFromStorage());
export const currentStep = writable<'template' | 'editor' | 'export'>('template');
export const isDesktopPreview = writable<boolean>(true);
export const isLoading = writable<boolean>(false);

// Store para notificaciones toast
export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
  duration?: number;
}

export const toastMessages = writable<ToastMessage[]>([]);

// Función para mostrar toast
export function showToast(type: ToastMessage['type'], message: string, duration = 3000) {
  const id = Math.random().toString(36).substr(2, 9);
  const toast: ToastMessage = { id, type, message, duration };
  
  toastMessages.update(messages => [...messages, toast]);
  
  setTimeout(() => {
    toastMessages.update(messages => messages.filter(m => m.id !== id));
  }, duration);
}

// Función para guardar en localStorage
export function saveToStorage(data: SignatureData) {
  if (!browser) return;
  
  try {
    localStorage.setItem('signatureData', JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

// Suscripción automática para guardar cambios
if (browser) {
  signatureData.subscribe(saveToStorage);
}

// Funciones de utilidad para el store
export const signatureStore = {
  // Actualizar campo específico
  updateField: (field: keyof SignatureData, value: any) => {
    signatureData.update(data => ({
      ...data,
      [field]: value
    }));
  },

  // Actualizar enlace social
  updateSocialLink: (platform: SocialLink['platform'], updates: Partial<SocialLink>) => {
    signatureData.update(data => ({
      ...data,
      socialLinks: data.socialLinks.map(link =>
        link.platform === platform ? { ...link, ...updates } : link
      )
    }));
  },

  // Agregar nuevo enlace social
  addSocialLink: (platform: SocialLink['platform']) => {
    signatureData.update(data => ({
      ...data,
      socialLinks: [...data.socialLinks, {
        platform,
        url: '',
        enabled: true
      }]
    }));
  },

  // Eliminar enlace social
  removeSocialLink: (platform: SocialLink['platform']) => {
    signatureData.update(data => ({
      ...data,
      socialLinks: data.socialLinks.filter(link => link.platform !== platform)
    }));
  },

  // Resetear datos
  reset: () => {
    signatureData.set(initialSignatureData);
    showToast('info', 'Datos reseteados correctamente');
  },

  // Cargar plantilla
  loadTemplate: (templateId: string) => {
    signatureData.update(data => ({
      ...data,
      templateId
    }));
    showToast('success', 'Plantilla cargada correctamente');
  }
};