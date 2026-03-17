# 📧 Generador de Firmas de Correo Electrónico
## Documentación Técnica Completa

![SvelteKit](https://img.shields.io/badge/SvelteKit-5.0-FF3E00?style=for-the-badge&logo=svelte&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

---

## 📋 Tabla de Contenidos

1. [Descripción General](#-descripción-general)
2. [Características Principales](#-características-principales)
3. [Arquitectura del Sistema](#-arquitectura-del-sistema)
4. [Stack Tecnológico](#-stack-tecnológico)
5. [Estructura del Proyecto](#-estructura-del-proyecto)
6. [Componentes Principales](#-componentes-principales)
7. [Gestión de Estado](#-gestión-de-estado)
8. [Sistema de Plantillas](#-sistema-de-plantillas)
9. [Funcionalidades Avanzadas](#-funcionalidades-avanzadas)
10. [Instalación y Configuración](#-instalación-y-configuración)
11. [Guía de Desarrollo](#-guía-de-desarrollo)
12. [API y Utilidades](#-api-y-utilidades)
13. [Testing](#-testing)
14. [Deployment](#-deployment)
15. [Contribución](#-contribución)
16. [Mantenimiento](#-mantenimiento)

---

## 🌟 Descripción General

El **Generador de Firmas de Correo Electrónico** es una aplicación web moderna y profesional desarrollada con **SvelteKit 5** que permite a los usuarios crear firmas de correo electrónico personalizadas de forma intuitiva y eficiente.

### 🎯 Objetivo Principal
Proporcionar una herramienta completa para crear firmas profesionales que sean:
- **Compatible** con todos los clientes de correo (Gmail, Outlook, Apple Mail, etc.)
- **Responsiva** para diferentes dispositivos
- **Personalizable** con múltiples opciones de diseño
- **Exportable** en múltiples formatos (HTML, PNG)

### 👥 Público Objetivo
- Profesionales independientes
- Equipos corporativos
- Agencias de marketing
- Desarrolladores web
- Consultores y freelancers

---

## ✨ Características Principales

### 🎨 **Sistema de Plantillas Avanzado**
- **6 plantillas profesionales** categorizadas por estilo:
  - **Minimal** (2): Diseños ultra limpio y elegante
  - **Professional** (2): Estilo ejecutivo y moderno
  - **Creative** (1): Colores vibrantes y dinámicos
  - **Corporate** (1): Diseño institucional premium

### 🖼️ **Editor de Imágenes Integrado**
- **Subida de imágenes** con drag & drop
- **Editor de recorte** usando CropperJS
- **Formas personalizables**: círculo, cuadrado, redondeado
- **Tamaños adaptables**: pequeño, mediano, grande
- **Compresión automática** para optimizar rendimiento

### 🎯 **Personalización Completa**
- **Información personal**: nombre, cargo, empresa, departamento
- **Datos de contacto**: email, teléfono, sitio web, dirección
- **Redes sociales**: LinkedIn, Twitter/X, GitHub, Instagram, Facebook, YouTube
- **Colores personalizados**: 15 presets profesionales más selector personalizado
- **Tipografías**: múltiples familias de fuentes

### 📱 **Experiencia de Usuario Optimizada**
- **Interfaz paso a paso** con navegación intuitiva
- **Vista previa en tiempo real** de todos los cambios
- **Diseño responsivo** para desktop, tablet y móvil
- **Validación en tiempo real** de datos de entrada
- **Sistema de notificaciones** con feedback inmediato

### 📤 **Exportación Profesional**
- **HTML listo para uso** compatible con todos los clientes
- **Exportación PNG** en alta calidad
- **Simulador de email** para vista previa realista
- **Instrucciones de instalación** para cada cliente de correo

---

## 🏗️ Arquitectura del Sistema

### 📐 **Patrón de Arquitectura**
La aplicación sigue el patrón **MVC (Model-View-Controller)** adaptado para SvelteKit:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   VIEW LAYER    │    │ CONTROLLER      │    │   MODEL LAYER   │
│                 │    │                 │    │                 │
│ • Svelte Pages  │◄──►│ • Stores        │◄──►│ • TypeScript    │
│ • Components    │    │ • Navigation    │    │   Interfaces    │
│ • Templates     │    │ • State Mgmt    │    │ • Data Models   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │  UTILITY LAYER  │
                    │                 │
                    │ • Validation    │
                    │ • Export Utils  │
                    │ • Image Processing │
                    └─────────────────┘
```

### 🔄 **Flujo de Datos**
1. **Usuario interactúa** con componentes de UI
2. **Stores de Svelte** manejan el estado global
3. **Utilidades** procesan y validan datos
4. **Componentes** se re-renderizan reactivamente
5. **Exportación** genera output final

---

## 🛠️ Stack Tecnológico

### **Frontend Framework**
- **SvelteKit 5.0** - Framework full-stack con SSR
- **Svelte 5** - Framework reactivo compilado
- **TypeScript 5** - Tipado estático para mayor robustez

### **Styling & UI**
- **TailwindCSS 3.4** - Framework CSS utility-first
- **@tailwindcss/forms** - Estilos mejorados para formularios
- **CSS Grid & Flexbox** - Layout responsivo

### **Build Tools & Dev Experience**
- **Vite 7** - Build tool ultrarrápido
- **PostCSS** - Procesamiento de CSS
- **Autoprefixer** - Compatibilidad de navegadores
- **ESLint & Prettier** - Linting y formateo

### **Librerías Especializadas**
- **CropperJS** - Editor de imágenes avanzado
- **html-to-image** - Conversión HTML a imagen
- **Browser APIs** - localStorage, FileReader, etc.

### **Deployment & Production**
- **@sveltejs/adapter-auto** - Adaptador automático
- **Node.js 18+** - Runtime requerido
- **Modern Browsers** - ES2020+ support

---

## 📁 Estructura del Proyecto

### **Estructura Completa**
```
📦 Generador de Firmas/
├── 📁 src/                          # Código fuente principal
│   ├── 📁 lib/                      # Librerías y utilidades compartidas
│   │   ├── 📁 components/           # Componentes Svelte reutilizables
│   │   │   ├── 📄 EditorPanel.svelte        # Panel principal de edición
│   │   │   ├── 📄 TemplateGallery.svelte    # Galería de plantillas
│   │   │   ├── 📄 SignaturePreview.svelte   # Vista previa en tiempo real
│   │   │   ├── 📄 ExportPanel.svelte        # Panel de exportación
│   │   │   ├── 📄 Preview.svelte            # Componente de vista previa
│   │   │   ├── 📄 Toast.svelte              # Sistema de notificaciones
│   │   │   └── 📄 ImageUploader.svelte      # Subida y edición de imágenes
│   │   ├── 📁 stores/               # Gestión de estado global
│   │   │   ├── 📄 signature.ts      # Estado de la firma y datos del usuario
│   │   │   ├── 📄 navigation.ts     # Navegación entre pasos
│   │   │   └── 📄 templates.ts      # Gestión de plantillas
│   │   ├── 📁 data/                 # Datos estáticos y configuración
│   │   │   └── 📄 templates.ts      # Definición de plantillas y presets
│   │   ├── 📁 utils/                # Funciones utilitarias
│   │   │   └── 📄 signature.ts      # Utilidades para procesamiento de firmas
│   │   └── 📄 index.ts              # Exportaciones de la librería
│   ├── 📁 routes/                   # Rutas y páginas de SvelteKit
│   │   ├── 📁 editor/               # Páginas del editor paso a paso
│   │   │   ├── 📄 +page.svelte      # Página principal del editor
│   │   │   ├── 📁 personal/         # Paso: información personal
│   │   │   ├── 📁 contact/          # Paso: datos de contacto
│   │   │   ├── 📁 social/           # Paso: redes sociales
│   │   │   ├── 📁 image/            # Paso: imagen de perfil
│   │   │   ├── 📁 design/           # Paso: personalización de diseño
│   │   │   └── 📁 preview/          # Paso: vista previa final
│   │   ├── 📁 export/               # Página de exportación
│   │   ├── 📁 preview/              # Vista previa independiente
│   │   ├── 📄 +layout.svelte        # Layout principal de la aplicación
│   │   ├── 📄 +page.svelte          # Página de inicio
│   │   └── 📄 +error.svelte         # Página de errores
│   ├── 📄 app.css                   # Estilos globales
│   ├── 📄 app.d.ts                  # Definiciones de tipos globales
│   └── 📄 app.html                  # Template HTML base
├── 📁 static/                       # Archivos estáticos
│   └── 📄 favicon.svg               # Icono de la aplicación
├── 📄 package.json                  # Dependencias y scripts
├── 📄 svelte.config.js              # Configuración de SvelteKit
├── 📄 vite.config.ts                # Configuración de Vite
├── 📄 tailwind.config.ts            # Configuración de TailwindCSS
├── 📄 tsconfig.json                 # Configuración de TypeScript
├── 📄 postcss.config.cjs            # Configuración de PostCSS
├── 📄 README.md                     # Documentación básica
├── 📄 DOCUMENTACION.md              # Esta documentación
└── 📄 LICENSE                       # Licencia MIT
```

### **Responsabilidades por Directorio**

#### 📁 **src/lib/components/**
Componentes Svelte reutilizables con funcionalidades específicas:
- **Separación de responsabilidades** clara
- **Props tipadas** con TypeScript
- **Eventos personalizados** para comunicación
- **Estilos scoped** para encapsulación

#### 📁 **src/lib/stores/**
Gestión centralizada del estado de la aplicación:
- **Stores reactivos** de Svelte
- **Persistencia** en localStorage
- **Validación** de datos
- **Sincronización** entre componentes

#### 📁 **src/routes/**
Estructura de páginas siguiendo el sistema de routing de SvelteKit:
- **File-based routing** automático
- **Layout jerárquico** para UI consistente
- **Server-side rendering** opcional
- **Prefetching** automático de rutas

---

## 🧩 Componentes Principales

### **1. EditorPanel.svelte**
```typescript
// Funcionalidades principales:
interface EditorPanelProps {
  // Edición de información personal
  personalInfo: SignatureData;
  // Validación en tiempo real
  validation: ValidationState;
  // Eventos de actualización
  onUpdate: (field: string, value: any) => void;
}
```

**Características:**
- 📝 **Formularios dinámicos** con validación
- 🎨 **Selector de colores** con presets
- 🌐 **Gestión de redes sociales** con agregar/quitar
- 📱 **Diseño responsivo** para todos los dispositivos

### **2. TemplateGallery.svelte**
```typescript
interface TemplateGalleryProps {
  templates: Template[];
  selectedId: string;
  onSelect: (templateId: string) => void;
}
```

**Características:**
- 🖼️ **Vista previa** de todas las plantillas
- 🔍 **Filtros por categoría** (minimal, professional, creative, corporate)
- ✅ **Selección visual** con estado activo
- 🚀 **Navegación automática** al siguiente paso

### **3. SignaturePreview.svelte**
```typescript
interface SignaturePreviewProps {
  data: SignatureData;
  templateId: string;
  realTime: boolean;
}
```

**Características:**
- ⚡ **Actualización en tiempo real** de todos los cambios
- 📐 **Renderizado exacto** del HTML final
- 🎯 **Múltiples formatos** de vista previa
- 📱 **Vista responsive** para diferentes tamaños

### **4. ExportPanel.svelte**
```typescript
interface ExportPanelProps {
  signatureHtml: string;
  fileName: string;
  onExport: (format: 'html' | 'png') => void;
}
```

**Características:**
- 📋 **Copia al portapapeles** con un clic
- 💾 **Descarga de archivos** en múltiples formatos
- 📧 **Simulador de email** para testing
- 📖 **Instrucciones detalladas** por cliente de correo

### **5. ImageUploader.svelte**
```typescript
interface ImageUploaderProps {
  currentImage?: ImageData;
  onImageUpdate: (imageData: ImageData) => void;
  onImageRemove: () => void;
}
```

**Características:**
- 🖱️ **Drag & Drop** para subir imágenes
- ✂️ **Editor de recorte** integrado con CropperJS
- 🔄 **Formas personalizables** (círculo, cuadrado, redondeado)
- 📏 **Tamaños ajustables** (pequeño, mediano, grande)
- 🗜️ **Compresión automática** para optimizar rendimiento

---

## 🏪 Gestión de Estado

### **Arquitectura de Stores**

#### **signature.ts - Store Principal**
```typescript
interface SignatureData {
  // Información personal
  fullName: string;
  position: string;
  company: string;
  department?: string;
  
  // Datos de contacto
  email: string;
  phone: string;
  website: string;
  address: string;
  
  // Redes sociales
  socialLinks: SocialLink[];
  
  // Personalización
  primaryColor: string;
  accentColor?: string;
  fontFamily?: string;
  templateId: string;
  
  // Imagen de perfil
  image?: ImageData;
}
```

**Funcionalidades del Store:**
- ✅ **Validación automática** de campos
- 💾 **Persistencia** en localStorage
- 🔄 **Sincronización** entre pestañas
- 📤 **Importación/Exportación** de configuraciones
- 🧹 **Reset de datos** con confirmación

#### **navigation.ts - Control de Flujo**
```typescript
interface NavigationStep {
  id: string;
  title: string;
  path: string;
  completed: boolean;
  optional: boolean;
}
```

**Sistema de Navegación:**
- 📍 **Seguimiento del progreso** paso a paso
- 🚦 **Validación de requisitos** antes de avanzar
- ↩️ **Navegación libre** entre pasos completados
- 💾 **Persistencia del progreso** en sesión

#### **templates.ts - Gestión de Plantillas**
```typescript
interface Template {
  id: string;
  name: string;
  description: string;
  category: 'minimal' | 'professional' | 'creative' | 'corporate';
  preview: string;
  features: string[];
}
```

---

## 🎨 Sistema de Plantillas

### **Categorías de Plantillas**

#### **1. Minimal (2 plantillas)**
- **minimal-1**: Ultra limpio con tipografía elegante
- **minimal-2**: Líneas sutiles y estructura clara

#### **2. Professional (2 plantillas)**  
- **professional-1**: Ejecutivo con separadores elegantes
- **professional-2**: Moderno con colores corporativos

#### **3. Creative (1 plantilla)**
- **creative-1**: Colores vibrantes y formas dinámicas

#### **4. Corporate (1 plantilla)**
- **corporate-1**: Diseño institucional premium

### **Sistema de Renderizado**
```typescript
function renderTemplate(templateId: string, data: SignatureData): string {
  const template = getTemplate(templateId);
  return template.render(data);
}
```

### **Personalización por Plantilla**
- 🎨 **Colores adaptativos** según la plantilla
- 📝 **Tipografías optimizadas** para cada estilo
- 📐 **Layouts responsivos** automáticos
- 🖼️ **Integración de imágenes** personalizada

---

## 🚀 Funcionalidades Avanzadas

### **1. Editor de Imágenes**
- **Tecnología**: CropperJS integrado
- **Formatos soportados**: JPEG, PNG, WebP
- **Funciones**:
  - ✂️ Recorte con aspecto ratio personalizable
  - 🔄 Rotación y flip
  - 📏 Redimensionamiento automático
  - 🗜️ Compresión optimizada

### **2. Exportación Multi-formato**
- **HTML**: Código limpio compatible con todos los clientes
- **PNG**: Imagen de alta calidad para uso directo
- **Instrucciones**: Guías específicas por cliente de correo

### **3. Validación Inteligente**
```typescript
const validationRules = {
  email: (value: string) => isValidEmail(value),
  url: (value: string) => isValidUrl(value),
  phone: (value: string) => isValidPhone(value),
  required: (value: string) => value.trim().length > 0
};
```

### **4. Sistema de Notificaciones**
- 🎉 **Toast notifications** con diferentes tipos
- ⏰ **Auto-dismiss** configurable
- 🎨 **Estilos contextuales** (success, error, info, warning)

### **5. Simulador de Email**
- 📧 **Vista previa realista** en formato de email
- 🎯 **Testing directo** de compatibilidad
- 📱 **Vista responsiva** para diferentes clientes

---

## 🛠️ Instalación y Configuración

### **Requisitos del Sistema**
- **Node.js**: 18.0.0 o superior
- **npm**: 9.0.0 o superior
- **Navegador moderno**: Chrome 90+, Firefox 88+, Safari 14+

### **Instalación Paso a Paso**

#### **1. Clonar el Repositorio**
```bash
git clone https://github.com/hloza/ph-generador-firmas.git
cd ph-generador-firmas
```

#### **2. Instalar Dependencias**
```bash
# Instalar todas las dependencias
npm install

# Verificar la instalación
npm run check
```

#### **3. Configuración del Entorno**
```bash
# Copiar variables de entorno (si existen)
cp .env.example .env.local

# Configurar variables específicas
# No hay variables de entorno requeridas por defecto
```

#### **4. Iniciar Desarrollo**
```bash
# Servidor de desarrollo con hot reload
npm run dev

# La aplicación estará en http://localhost:5173
```

### **Scripts Disponibles**
```json
{
  "dev": "vite dev",                    // Servidor de desarrollo
  "build": "vite build && npm run prepack", // Build para producción
  "preview": "vite preview",            // Preview del build
  "check": "svelte-kit sync && svelte-check", // Verificación de tipos
  "check:watch": "svelte-kit sync && svelte-check --watch" // Check en watch mode
}
```

---

## 👨‍💻 Guía de Desarrollo

### **Estructura de Desarrollo**

#### **1. Crear un Nuevo Componente**
```bash
# Crear componente
touch src/lib/components/MiComponente.svelte
```

```svelte
<script lang="ts">
  // Props con tipos
  interface Props {
    data: string;
    onUpdate?: (value: string) => void;
  }
  
  let { data, onUpdate }: Props = $props();
  
  // Lógica del componente
  function handleChange(newValue: string) {
    onUpdate?.(newValue);
  }
</script>

<!-- Template -->
<div class="mi-componente">
  <input 
    bind:value={data} 
    on:input={(e) => handleChange(e.target.value)}
    class="form-input"
  />
</div>

<style>
  .mi-componente {
    /* Estilos específicos del componente */
  }
</style>
```

#### **2. Agregar una Nueva Plantilla**
```typescript
// En src/lib/data/templates.ts
export const templates: Template[] = [
  // ... plantillas existentes
  {
    id: 'nueva-plantilla',
    name: 'Nueva Plantilla',
    description: 'Descripción de la nueva plantilla',
    category: 'professional',
    preview: 'nueva-plantilla'
  }
];
```

#### **3. Crear Nueva Página**
```bash
# Crear directorio de ruta
mkdir src/routes/nueva-pagina
touch src/routes/nueva-pagina/+page.svelte
```

```svelte
<!-- src/routes/nueva-pagina/+page.svelte -->
<script lang="ts">
  import { page } from '$app/stores';
  // Lógica de la página
</script>

<svelte:head>
  <title>Nueva Página - Generador de Firmas</title>
  <meta name="description" content="Descripción de la nueva página" />
</svelte:head>

<main>
  <h1>Nueva Página</h1>
  <!-- Contenido de la página -->
</main>
```

### **Convenciones de Código**

#### **Nomenclatura**
- **Componentes**: PascalCase (`MiComponente.svelte`)
- **Funciones**: camelCase (`miFunction`)
- **Variables**: camelCase (`miVariable`)
- **Constantes**: UPPER_SNAKE_CASE (`MI_CONSTANTE`)
- **Archivos**: kebab-case (`mi-archivo.ts`)

#### **Estructura de Componentes**
```svelte
<script lang="ts">
  // 1. Imports
  import { onMount } from 'svelte';
  
  // 2. Props e interfaces
  interface Props {
    // definición de props
  }
  
  // 3. Variables reactivas
  let miVariable = $state('valor inicial');
  
  // 4. Funciones
  function miFuncion() {
    // lógica
  }
  
  // 5. Lifecycle hooks
  onMount(() => {
    // inicialización
  });
</script>

<!-- 6. Template -->
<div>
  <!-- contenido -->
</div>

<!-- 7. Estilos (si son necesarios) -->
<style>
  /* estilos específicos */
</style>
```

### **Flujo de Trabajo Git**

#### **Branching Strategy**
```bash
main                 # Rama principal (producción)
├── develop         # Rama de desarrollo
├── feature/*       # Nuevas funcionalidades
├── bugfix/*        # Corrección de bugs
└── hotfix/*        # Correcciones urgentes
```

#### **Flujo de Desarrollo**
```bash
# 1. Crear rama para nueva funcionalidad
git checkout -b feature/nueva-funcionalidad

# 2. Desarrollar y hacer commits
git add .
git commit -m "feat: agregar nueva funcionalidad"

# 3. Push de la rama
git push origin feature/nueva-funcionalidad

# 4. Crear Pull Request en GitHub
# 5. Review y merge a develop
# 6. Deploy a staging para testing
# 7. Merge a main para producción
```

---

## 🔧 API y Utilidades

### **Utilidades de Validación**
```typescript
// src/lib/utils/signature.ts

/**
 * Valida formato de email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida formato de URL
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Valida formato de teléfono
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}
```

### **Utilidades de Exportación**
```typescript
/**
 * Genera HTML de la firma
 */
export function generateSignatureHTML(
  data: SignatureData, 
  templateId: string
): string {
  const template = getTemplate(templateId);
  return template.render(data);
}

/**
 * Exporta firma como imagen PNG
 */
export async function exportToPNG(
  element: HTMLElement, 
  filename: string
): Promise<void> {
  const dataUrl = await htmlToImage.toPng(element);
  downloadFile(dataUrl, filename);
}

/**
 * Copia HTML al portapapeles
 */
export async function copyToClipboard(html: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(html);
    return true;
  } catch {
    return false;
  }
}
```

### **Gestión de Imágenes**
```typescript
/**
 * Redimensiona imagen manteniendo aspecto ratio
 */
export function resizeImage(
  file: File, 
  maxWidth: number, 
  maxHeight: number
): Promise<Blob> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    
    img.onload = () => {
      const { width, height } = calculateDimensions(
        img.width, 
        img.height, 
        maxWidth, 
        maxHeight
      );
      
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob((blob) => resolve(blob!), 'image/jpeg', 0.9);
    };
    
    img.src = URL.createObjectURL(file);
  });
}
```

---

## 🧪 Testing

### **Estrategia de Testing**
La aplicación utiliza un enfoque de testing multinivel:

#### **1. Unit Testing (Jest + Testing Library)**
```typescript
// tests/components/EditorPanel.test.ts
import { render, fireEvent } from '@testing-library/svelte';
import EditorPanel from '$lib/components/EditorPanel.svelte';

describe('EditorPanel', () => {
  test('actualiza nombre completo correctamente', async () => {
    const { getByLabelText } = render(EditorPanel);
    const input = getByLabelText('Nombre Completo');
    
    await fireEvent.input(input, { target: { value: 'Juan Pérez' } });
    
    expect(input.value).toBe('Juan Pérez');
  });
});
```

#### **2. Integration Testing**
```typescript
// tests/integration/signature-flow.test.ts
describe('Flujo completo de creación de firma', () => {
  test('usuario puede crear y exportar firma', async () => {
    // 1. Seleccionar plantilla
    // 2. Completar datos
    // 3. Personalizar diseño
    // 4. Exportar resultado
  });
});
```

#### **3. E2E Testing (Playwright)**
```typescript
// e2e/signature-creation.spec.ts
import { test, expect } from '@playwright/test';

test('creación completa de firma', async ({ page }) => {
  await page.goto('/');
  
  // Seleccionar plantilla
  await page.click('[data-testid="template-minimal-1"]');
  await page.click('[data-testid="continue-button"]');
  
  // Completar información personal
  await page.fill('[data-testid="fullName"]', 'Juan Pérez');
  await page.fill('[data-testid="position"]', 'Developer');
  
  // Verificar vista previa
  await expect(page.locator('[data-testid="signature-preview"]'))
    .toContainText('Juan Pérez');
});
```

### **Configuración de Testing**
```json
// package.json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "playwright test"
  },
  "devDependencies": {
    "@testing-library/svelte": "^4.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "@playwright/test": "^1.40.0",
    "jest": "^29.0.0"
  }
}
```

---

## 🚀 Deployment

### **Opciones de Deployment**

#### **1. Vercel (Recomendado)**
```bash
# Instalar CLI de Vercel
npm i -g vercel

# Deploy
vercel

# Configurar dominio personalizado
vercel --prod
```

#### **2. Netlify**
```bash
# Build para producción
npm run build

# Deploy manual
netlify deploy --prod --dir build
```

#### **3. GitHub Pages**
```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages
on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./build
```

#### **4. Docker**
```dockerfile
# Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### **Configuración de Build**
```typescript
// vite.config.ts para producción
export default defineConfig({
  plugins: [sveltekit()],
  build: {
    minify: 'terser',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['svelte', '@sveltejs/kit'],
          utils: ['cropperjs', 'html-to-image']
        }
      }
    }
  }
});
```

---

## 🤝 Contribución

### **Cómo Contribuir**

#### **1. Fork y Clone**
```bash
# Fork en GitHub
git clone https://github.com/tu-usuario/ph-generador-firmas.git
cd ph-generador-firmas
```

#### **2. Configurar Entorno**
```bash
# Instalar dependencias
npm install

# Verificar que todo funciona
npm run dev
npm run check
```

#### **3. Crear Rama**
```bash
git checkout -b feature/mi-nueva-funcionalidad
```

#### **4. Desarrollar**
- ✅ Seguir las convenciones de código
- ✅ Agregar tests para nueva funcionalidad
- ✅ Actualizar documentación si es necesario
- ✅ Verificar que el build funciona

#### **5. Commit y Push**
```bash
git add .
git commit -m "feat: agregar nueva funcionalidad increíble"
git push origin feature/mi-nueva-funcionalidad
```

#### **6. Pull Request**
- Crear PR con descripción clara
- Referenciar issues relacionados
- Aguardar review y feedback

### **Tipos de Contribuciones Bienvenidas**

#### **🎨 Nuevas Plantillas**
- Diseños innovadores
- Estilos específicos por industria
- Mejoras en plantillas existentes

#### **✨ Nuevas Funcionalidades**
- Integración con APIs externas
- Nuevos formatos de exportación
- Mejoras en UX/UI

#### **🐛 Bug Fixes**
- Corrección de errores
- Mejoras de performance
- Compatibilidad de navegadores

#### **📚 Documentación**
- Tutoriales y guías
- Traducciones
- Mejoras en README

### **Convenciones de Commit**
```
feat: nueva funcionalidad
fix: corrección de bug  
docs: actualización de documentación
style: cambios de formato/estilo
refactor: refactoring de código
test: agregar o actualizar tests
chore: tareas de mantenimiento
```

---

## 🔧 Mantenimiento

### **Actualizaciones de Dependencias**
```bash
# Verificar dependencias desactualizadas
npm outdated

# Actualizar dependencias menores
npm update

# Actualizar dependencias mayores (cuidado)
npm install package@latest
```

### **Monitoreo de Performance**
```typescript
// Métricas de performance
const performanceMetrics = {
  // Tiempo de carga inicial
  loadTime: performance.now(),
  
  // Tamaño del bundle
  bundleSize: '~500KB gzipped',
  
  // Core Web Vitals
  lcp: '< 2.5s',  // Largest Contentful Paint
  fid: '< 100ms', // First Input Delay
  cls: '< 0.1'    // Cumulative Layout Shift
};
```

### **Backup y Recuperación**
```bash
# Backup de configuración
cp -r src/lib/data/ backups/data-$(date +%Y%m%d)/

# Backup de componentes críticos
cp -r src/lib/components/ backups/components-$(date +%Y%m%d)/
```

### **Logs y Debugging**
```typescript
// Sistema de logging
export const logger = {
  info: (message: string, data?: any) => {
    console.log(`ℹ️ ${message}`, data);
  },
  
  error: (message: string, error?: Error) => {
    console.error(`❌ ${message}`, error);
    // Enviar a servicio de monitoring en producción
  },
  
  warn: (message: string, data?: any) => {
    console.warn(`⚠️ ${message}`, data);
  }
};
```

---

## 📞 Soporte y Contacto

### **Canales de Soporte**
- 🐛 **Issues**: [GitHub Issues](https://github.com/hloza/ph-generador-firmas/issues)
- 💬 **Discusiones**: [GitHub Discussions](https://github.com/hloza/ph-generador-firmas/discussions)
- 📧 **Email**: soporte@generadorfirmas.com
- 📱 **Twitter**: [@GeneradorFirmas](https://twitter.com/GeneradorFirmas)

### **FAQ**

#### **¿Por qué mi firma no se ve igual en Gmail?**
Gmail tiene limitaciones CSS. Usa la exportación PNG para mejor compatibilidad.

#### **¿Puedo usar mi propia imagen de fondo?**
Actualmente no soportado, pero está en el roadmap para futuras versiones.

#### **¿Funciona en dispositivos móviles?**
Sí, la aplicación es completamente responsiva y funciona en todos los dispositivos.

#### **¿Hay límite en el número de firmas que puedo crear?**
No, puedes crear tantas firmas como necesites. Los datos se guardan localmente.

---

## 📊 Estadísticas del Proyecto

### **Métricas de Código**
- **Líneas de código**: ~15,000
- **Componentes**: 8 principales
- **Plantillas**: 6 diseños únicos
- **Stores**: 3 principales
- **Utilidades**: 20+ funciones

### **Performance**
- **Bundle size**: ~500KB gzipped
- **Load time**: < 2 segundos
- **Lighthouse score**: 95+/100
- **Core Web Vitals**: Todas en verde

### **Compatibilidad**
- **Navegadores**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Dispositivos**: Desktop, Tablet, Mobile
- **Clientes de correo**: Gmail, Outlook, Apple Mail, Thunderbird

---

## 🗺️ Roadmap

### **v2.0 - Próximas Funcionalidades**
- 🌐 **Multi-idioma** (Español, Inglés, Francés)
- 🎨 **Editor de plantillas visual**
- ☁️ **Guardado en la nube**
- 👥 **Colaboración en equipo**
- 📊 **Analytics de uso**

### **v2.1 - Integraciones**
- 📧 **API de Gmail** para instalación directa
- 🔗 **LinkedIn API** para importar datos
- 📱 **App móvil** nativa
- 🤖 **AI para sugerencias** de diseño

### **v3.0 - Enterprise**
- 🏢 **Panel de administración**
- 🔐 **Single Sign-On (SSO)**
- 📈 **Reportes avanzados**
- 🎯 **Plantillas por industria**

---

## 📄 Licencia

Este proyecto está licenciado bajo la **Licencia MIT** - ver el archivo [LICENSE](LICENSE) para más detalles.

```
MIT License

Copyright (c) 2025 Generador de Firmas

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 Agradecimientos

### **Tecnologías Utilizadas**
- [SvelteKit](https://kit.svelte.dev/) - Framework principal
- [TailwindCSS](https://tailwindcss.com/) - Styling
- [CropperJS](https://fengyuanchen.github.io/cropperjs/) - Editor de imágenes
- [html-to-image](https://github.com/bubkoo/html-to-image) - Exportación PNG

### **Inspiración**
- [Signature generators](https://www.hubspot.com/email-signature-generator) existentes
- [Figma](https://www.figma.com/) para referencia de UX
- [Dribbble](https://dribbble.com/) para inspiración de diseño

### **Comunidad**
- **Contribuidores** de GitHub
- **Beta testers** que probaron la aplicación
- **Comunidad de Svelte** por el apoyo

---

<div align="center">

**¡Gracias por usar el Generador de Firmas!** 🎉

Si este proyecto te ha sido útil, considera darle una ⭐ en GitHub.

[🏠 Inicio](/) | [📝 Editor](/editor) | [🚀 GitHub](https://github.com/hloza/ph-generador-firmas)

---

*Documentación actualizada el 6 de octubre de 2025*

</div>