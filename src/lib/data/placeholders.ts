// Datos de ejemplo para mostrar en las plantillas

export interface PlaceholderData {
  name: string;
  title: string;
  company: string;
  department: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  linkedin: string;
  twitter: string;
  github: string;
  instagram: string;
  imageUrl: string;
}

// Datos de ejemplo profesionales
export const placeholderData: PlaceholderData = {
  name: 'Ana María García',
  title: 'Directora de Marketing Digital',
  company: 'Tech Innovations S.A.',
  department: 'Marketing y Comunicaciones',
  email: 'ana.garcia@techinnovations.com',
  phone: '+591 (3) 123-4567',
  website: 'www.techinnovations.com',
  address: 'Tarija, Bolivia',
  linkedin: 'https://linkedin.com/in/ana-garcia',
  twitter: 'https://twitter.com/anagarcia',
  github: 'https://github.com/anagarcia',
  instagram: 'https://instagram.com/anagarcia',
  imageUrl: 'https://i.pravatar.cc/150?img=5' // Avatar de ejemplo
};

// Función para obtener valor real o placeholder
export function getValueOrPlaceholder(
  realValue: string | undefined,
  placeholderValue: string,
  showPlaceholder: boolean = true
): string {
  // Si hay valor real, usarlo
  if (realValue && realValue.trim() !== '') {
    return realValue;
  }
  
  // Si no hay valor pero se permite placeholder, mostrarlo
  if (showPlaceholder) {
    return placeholderValue;
  }
  
  // No mostrar nada
  return '';
}

// Función para determinar si mostrar una sección (tiene datos reales O placeholder activo)
export function shouldShowSection(
  realValue: string | undefined,
  showPlaceholder: boolean = true
): boolean {
  // Mostrar si tiene valor real
  if (realValue && realValue.trim() !== '') {
    return true;
  }
  
  // Mostrar si placeholder está activo
  return showPlaceholder;
}

// Función para agregar clase de placeholder visual
export function getPlaceholderClass(
  realValue: string | undefined,
  showPlaceholder: boolean = true
): string {
  // Si hay valor real, no agregar clase
  if (realValue && realValue.trim() !== '') {
    return '';
  }
  
  // Si es placeholder, agregar clase para estilo visual
  if (showPlaceholder) {
    return 'opacity-60 italic';
  }
  
  return '';
}

// Función para determinar si el usuario ha empezado a llenar datos
export function hasUserData(data: any): boolean {
  return !!(
    data.name ||
    data.fullName ||
    data.title ||
    data.position ||
    data.email ||
    data.phone ||
    data.company ||
    data.department ||
    data.website ||
    data.address ||
    data.linkedin ||
    data.twitter ||
    data.github ||
    data.instagram ||
    data.image?.url
  );
}
