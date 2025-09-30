import type { Template } from '../stores/signature.js';

export const templates: Template[] = [
  // === PLANTILLAS MINIMALISTAS ===
  {
    id: 'minimal-1',
    name: 'Minimal Clean',
    description: 'Diseño ultra limpio con tipografía elegante y espaciado perfecto',
    preview: 'minimal-1',
    category: 'minimal'
  },
  {
    id: 'minimal-2',
    name: 'Minimal Lines',
    description: 'Minimalista con líneas de separación sutiles y estructura clara',
    preview: 'minimal-2',
    category: 'minimal'
  },
  {
    id: 'minimal-3',
    name: 'Minimal Edge',
    description: 'Bordes suaves con información esencial y diseño despejado',
    preview: 'minimal-3',
    category: 'minimal'
  },
  {
    id: 'minimal-4',
    name: 'Minimal Focus',
    description: 'Enfoque en el contenido con máxima legibilidad',
    preview: 'minimal-4',
    category: 'minimal'
  },

  // === PLANTILLAS PROFESIONALES ===
  {
    id: 'professional-1',
    name: 'Professional Executive',
    description: 'Diseño ejecutivo con separadores elegantes y jerarquía visual',
    preview: 'professional-1',
    category: 'professional'
  },
  {
    id: 'professional-2',
    name: 'Professional Modern',
    description: 'Estilo moderno con estructura equilibrada y colores corporativos',
    preview: 'professional-2',
    category: 'professional'
  },
  {
    id: 'professional-3',
    name: 'Professional Business',
    description: 'Formato de tarjeta de negocio digital con información organizada',
    preview: 'professional-3',
    category: 'professional'
  },
  {
    id: 'professional-4',
    name: 'Professional Elite',
    description: 'Diseño premium con elementos sofisticados y acabados pulidos',
    preview: 'professional-4',
    category: 'professional'
  },

  // === PLANTILLAS CREATIVAS ===
  {
    id: 'creative-1',
    name: 'Creative Bold',
    description: 'Colores vibrantes con formas geométricas y diseño dinámico',
    preview: 'creative-1',
    category: 'creative'
  },
  {
    id: 'creative-2',
    name: 'Creative Flow',
    description: 'Elementos fluidos con gradientes suaves y movimiento visual',
    preview: 'creative-2',
    category: 'creative'
  },
  {
    id: 'creative-3',
    name: 'Creative Splash',
    description: 'Diseño artístico con acentos coloridos y tipografía expresiva',
    preview: 'creative-3',
    category: 'creative'
  },
  {
    id: 'creative-4',
    name: 'Creative Studio',
    description: 'Estilo de estudio creativo con elementos únicos y personalidad',
    preview: 'creative-4',
    category: 'creative'
  },

  // === PLANTILLAS CORPORATIVAS ===
  {
    id: 'corporate-1',
    name: 'Corporate Premium',
    description: 'Diseño corporativo de alta gama con elementos institucionales',
    preview: 'corporate-1',
    category: 'corporate'
  },
  {
    id: 'corporate-2',
    name: 'Corporate Classic',
    description: 'Estilo tradicional empresarial con estructura formal',
    preview: 'corporate-2',
    category: 'corporate'
  },
  {
    id: 'corporate-3',
    name: 'Corporate Edge',
    description: 'Corporativo moderno con líneas definidas y presencia sólida',
    preview: 'corporate-3',
    category: 'corporate'
  },
  {
    id: 'corporate-4',
    name: 'Corporate Authority',
    description: 'Máxima autoridad visual con elementos de liderazgo',
    preview: 'corporate-4',
    category: 'corporate'
  }
];

export const colorPresets = [
  // Colores profesionales
  { name: 'Azul Corporativo', value: '#0ea5e9' },
  { name: 'Verde Empresarial', value: '#10b981' },
  { name: 'Púrpura Elegante', value: '#8b5cf6' },
  { name: 'Gris Ejecutivo', value: '#6b7280' },
  { name: 'Índigo Premium', value: '#6366f1' },
  
  // Colores vibrantes
  { name: 'Rosa Dinámico', value: '#ec4899' },
  { name: 'Naranja Energético', value: '#f97316' },
  { name: 'Rojo Impactante', value: '#ef4444' },
  { name: 'Esmeralda Brillante', value: '#059669' },
  { name: 'Ámbar Cálido', value: '#d97706' },
  
  // Colores sofisticados
  { name: 'Azul Marino', value: '#1e40af' },
  { name: 'Verde Bosque', value: '#065f46' },
  { name: 'Púrpura Real', value: '#7c3aed' },
  { name: 'Coral Suave', value: '#f87171' },
  { name: 'Turquesa', value: '#06b6d4' }
];

export const socialPlatforms = [
  { 
    platform: 'linkedin' as const, 
    label: 'LinkedIn', 
    icon: 'linkedin',
    color: '#0077b5',
    placeholder: 'https://linkedin.com/in/tu-perfil'
  },
  { 
    platform: 'twitter' as const, 
    label: 'Twitter/X', 
    icon: 'twitter',
    color: '#000000',
    placeholder: 'https://x.com/tu-usuario'
  },
  { 
    platform: 'github' as const, 
    label: 'GitHub', 
    icon: 'github',
    color: '#333333',
    placeholder: 'https://github.com/tu-usuario'
  },
  { 
    platform: 'instagram' as const, 
    label: 'Instagram', 
    icon: 'instagram',
    color: '#e4405f',
    placeholder: 'https://instagram.com/tu-usuario'
  },
  { 
    platform: 'facebook' as const, 
    label: 'Facebook', 
    icon: 'facebook',
    color: '#1877f2',
    placeholder: 'https://facebook.com/tu-perfil'
  },
  { 
    platform: 'youtube' as const, 
    label: 'YouTube', 
    icon: 'youtube',
    color: '#ff0000',
    placeholder: 'https://youtube.com/c/tu-canal'
  },
  { 
    platform: 'behance' as const, 
    label: 'Behance', 
    icon: 'behance',
    color: '#1769ff',
    placeholder: 'https://behance.net/tu-portfolio'
  },
  { 
    platform: 'dribbble' as const, 
    label: 'Dribbble', 
    icon: 'dribbble',
    color: '#ea4c89',
    placeholder: 'https://dribbble.com/tu-usuario'
  },
  { 
    platform: 'website' as const, 
    label: 'Sitio Web', 
    icon: 'website',
    color: '#6b7280',
    placeholder: 'https://tu-sitio-web.com'
  }
];