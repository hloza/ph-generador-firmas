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
  primaryColor: string;
  templateId: string;
  // Campos de personalización
  name?: string;
  title?: string;
  department?: string;
  linkedin?: string;
  twitter?: string;
  github?: string;
  instagram?: string;
  accentColor?: string;
  fontFamily?: string;
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
  fullName: '',
  position: '',
  email: '',
  phone: '',
  website: '',
  address: '',
  company: '',
  socialLinks: [
    { platform: 'linkedin', url: '', enabled: false },
    { platform: 'twitter', url: '', enabled: false },
    { platform: 'github', url: '', enabled: false },
    { platform: 'instagram', url: '', enabled: false },
    { platform: 'facebook', url: '', enabled: false },
    { platform: 'youtube', url: '', enabled: false }
  ],
  primaryColor: '#0ea5e9',
  templateId: 'minimal-1',
  // Valores por defecto para personalización
  name: '',
  title: '',
  department: '',
  linkedin: '',
  twitter: '',
  github: '',
  instagram: '',
  accentColor: '#8b5cf6',
  fontFamily: 'modern'
};

// Función para cargar datos del localStorage o desde URL
function loadFromStorage(): SignatureData {
  if (!browser) return initialSignatureData;
  
  // Primero intentar cargar desde URL params
  try {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('name') || urlParams.has('email') || urlParams.has('company')) {
      const urlData: Partial<SignatureData> = {};
      
      // Cargar todos los parámetros posibles de la URL
      if (urlParams.get('name')) urlData.name = urlParams.get('name')!;
      if (urlParams.get('fullName')) urlData.fullName = urlParams.get('fullName')!;
      if (urlParams.get('title')) urlData.title = urlParams.get('title')!;
      if (urlParams.get('position')) urlData.position = urlParams.get('position')!;
      if (urlParams.get('company')) urlData.company = urlParams.get('company')!;
      if (urlParams.get('department')) urlData.department = urlParams.get('department')!;
      if (urlParams.get('email')) urlData.email = urlParams.get('email')!;
      if (urlParams.get('phone')) urlData.phone = urlParams.get('phone')!;
      if (urlParams.get('website')) urlData.website = urlParams.get('website')!;
      if (urlParams.get('address')) urlData.address = urlParams.get('address')!;
      if (urlParams.get('linkedin')) urlData.linkedin = urlParams.get('linkedin')!;
      if (urlParams.get('twitter')) urlData.twitter = urlParams.get('twitter')!;
      if (urlParams.get('github')) urlData.github = urlParams.get('github')!;
      if (urlParams.get('instagram')) urlData.instagram = urlParams.get('instagram')!;
      if (urlParams.get('templateId')) urlData.templateId = urlParams.get('templateId')!;
      
      // Lógica de imagen eliminada
      
      return { ...initialSignatureData, ...urlData };
    }
  } catch (error) {
    console.error('Error loading from URL:', error);
  }
  
  // Luego intentar cargar desde localStorage
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

// Función para limpiar datos si es necesario
function initializeData(): SignatureData {
  if (!browser) return initialSignatureData;
  
  const urlParams = new URLSearchParams(window.location.search);
  const hasUrlParams = urlParams.has('name') || urlParams.has('email') || urlParams.has('company');
  const isHomePage = window.location.pathname === '/';
  
  // Si es la página principal y no hay parámetros URL, limpiar localStorage y usar datos vacíos
  if (isHomePage && !hasUrlParams) {
    localStorage.removeItem('signatureData');
    return initialSignatureData;
  }
  
  // Si hay parámetros URL o no es la página principal, cargar normalmente
  return loadFromStorage();
}

// Stores principales
export const signatureData = writable<SignatureData>(initializeData());
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

// Función de imagen eliminada