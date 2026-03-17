# Sistema de Datos de Ejemplo (Placeholders) en Plantillas

## 🎯 Objetivo

Implementar un sistema inteligente de datos de ejemplo que:
1. ✅ **Muestre datos de ejemplo profesionales** en plantillas vacías
2. ✅ **Reemplace automáticamente** con datos reales del usuario
3. ✅ **Oculte secciones** cuando el usuario borra datos
4. ✅ **Indique visualmente** qué es placeholder vs dato real

---

## 📋 Cambios Implementados

### 1️⃣ **Nuevo Archivo: `placeholders.ts`**
**Ubicación:** `src/lib/data/placeholders.ts`

Este archivo contiene:

```typescript
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
```

#### 📝 **Datos de Ejemplo Profesionales**

```typescript
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
```

**Por qué estos datos:**
- ✅ Nombre completo y profesional
- ✅ Título real y descriptivo
- ✅ Empresa ficticia pero creíble
- ✅ Departamento específico
- ✅ Email formato profesional
- ✅ Teléfono con código de país
- ✅ Website sin protocolo (más limpio)
- ✅ Ubicación específica
- ✅ URLs de redes sociales completas
- ✅ Avatar neutral de API pública

---

### 2️⃣ **Funciones Helper**

#### `getValueOrPlaceholder()`
Devuelve valor real o placeholder según corresponda:

```typescript
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
```

**Ejemplo:**
```typescript
// Usuario NO ha llenado nombre
getValueOrPlaceholder(undefined, 'Ana María García', true)
// → 'Ana María García' (placeholder)

// Usuario llenó nombre
getValueOrPlaceholder('Juan Pérez', 'Ana María García', true)
// → 'Juan Pérez' (dato real)

// Usuario borró nombre
getValueOrPlaceholder('', 'Ana María García', true)
// → 'Ana María García' (placeholder de nuevo)
```

---

#### `shouldShowSection()`
Determina si mostrar una sección (tiene datos O placeholder activo):

```typescript
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
```

**Ejemplo:**
```typescript
// Usuario NO tiene website, pero placeholder está activo
shouldShowSection(undefined, true)
// → true (mostrar con placeholder)

// Usuario NO tiene website Y placeholder desactivado
shouldShowSection(undefined, false)
// → false (ocultar sección completa)

// Usuario TIENE website
shouldShowSection('www.empresa.com', true)
// → true (mostrar dato real)
```

---

#### `hasUserData()`
Detecta si el usuario ha empezado a llenar datos:

```typescript
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
```

**Uso:**
```typescript
const showPlaceholders = !hasUserData(data);

// Usuario nuevo (sin datos)
hasUserData({}) 
// → false → showPlaceholders = true

// Usuario con algún dato
hasUserData({ name: 'Juan' })
// → true → showPlaceholders = false
```

---

### 3️⃣ **Actualización de `signature.ts`**

**Antes:**
```typescript
const name = data.name || data.fullName || 'Tu nombre';
const title = data.title || data.position || 'Tu título profesional';
```

**Ahora:**
```typescript
import { placeholderData, getValueOrPlaceholder, hasUserData } from "../data/placeholders.js";

const showPlaceholders = !hasUserData(data);

const name = getValueOrPlaceholder(
  data.name || data.fullName, 
  placeholderData.name, 
  showPlaceholders
);

const title = getValueOrPlaceholder(
  data.title || data.position, 
  placeholderData.title, 
  showPlaceholders
);
```

---

### 4️⃣ **Estilo Visual de Placeholders**

Los placeholders tienen estilo diferenciado para que el usuario sepa que son ejemplos:

```typescript
const placeholderStyle = showPlaceholders 
  ? 'opacity: 0.7; font-style: italic;' 
  : '';
```

**En las plantillas:**
```html
<h3 style="color: ${primaryColor}; ${placeholderStyle}">${name}</h3>
```

**Resultado visual:**
- **Datos reales**: Opacidad 100%, normal
- **Placeholders**: Opacidad 70%, cursiva

---

## 🔄 Flujo de Funcionamiento

### **Escenario 1: Usuario Nuevo (Sin Datos)**

```
1. Usuario abre la app por primera vez
   ↓
2. hasUserData(data) → false
   ↓
3. showPlaceholders = true
   ↓
4. Plantilla muestra:
   - Nombre: "Ana María García" (cursiva, 70% opacidad)
   - Título: "Directora de Marketing Digital" (cursiva, 70% opacidad)
   - Email: "ana.garcia@techinnovations.com" (cursiva, 70% opacidad)
   - Imagen: Avatar de ejemplo
   - Redes sociales: URLs de ejemplo
```

### **Escenario 2: Usuario Llena Primer Campo**

```
1. Usuario escribe su nombre: "Juan Pérez"
   ↓
2. hasUserData(data) → true (porque data.name existe)
   ↓
3. showPlaceholders = false
   ↓
4. Plantilla muestra:
   - Nombre: "Juan Pérez" (normal, 100% opacidad)
   - Título: "" (vacío, sección oculta)
   - Email: "" (vacío, sección oculta)
   - Imagen: Ninguna
   - Redes sociales: Ninguna
```

### **Escenario 3: Usuario Llena Algunos Campos**

```
1. Usuario tiene:
   - Nombre: "Juan Pérez"
   - Email: "juan@empresa.com"
   - (Resto vacío)
   ↓
2. hasUserData(data) → true
   ↓
3. showPlaceholders = false
   ↓
4. getValueOrPlaceholder() para cada campo:
   - Nombre: "Juan Pérez" (hay dato real)
   - Título: "" (no hay dato, no hay placeholder)
   - Email: "juan@empresa.com" (hay dato real)
   - Teléfono: "" (no hay dato, no hay placeholder)
```

### **Escenario 4: Usuario Borra Todo**

```
1. Usuario borra todos los campos
   ↓
2. hasUserData(data) → false
   ↓
3. showPlaceholders = true (¡de nuevo!)
   ↓
4. Plantilla muestra datos de ejemplo completos
```

---

## 🎨 Ejemplo Visual

### **Vista Previa Inicial (Sin Datos)**

```
┌──────────────────────────────────────────────┐
│  [Avatar]  Ana María García                  │ ← Cursiva, 70% opacidad
│            Directora de Marketing Digital    │ ← Cursiva, 70% opacidad
│            Tech Innovations S.A.             │ ← Cursiva, 70% opacidad
│                                              │
│            📧 ana.garcia@techinnovations.com │ ← Cursiva, 70% opacidad
│            📱 +591 (3) 123-4567             │ ← Cursiva, 70% opacidad
│            🌐 www.techinnovations.com        │ ← Cursiva, 70% opacidad
│                                              │
│            [in] [X] [GitHub] [📷]           │ ← Cursiva, 70% opacidad
└──────────────────────────────────────────────┘
```

### **Vista Previa con Datos Reales**

```
┌──────────────────────────────────────────────┐
│  [Mi Foto] Juan Pérez                        │ ← Normal, 100% opacidad
│            Desarrollador Senior              │ ← Normal, 100% opacidad
│            Mi Empresa S.A.                   │ ← Normal, 100% opacidad
│                                              │
│            📧 juan@miempresa.com             │ ← Normal, 100% opacidad
│            📱 +591 123-4567                  │ ← Normal, 100% opacidad
│                                              │
│            [in] [GitHub]                     │ ← Normal, 100% opacidad
└──────────────────────────────────────────────┘
```

### **Vista Previa Parcial (Solo Nombre)**

```
┌──────────────────────────────────────────────┐
│            Juan Pérez                        │ ← Normal, 100% opacidad
│                                              │ ← Título no se muestra
│                                              │ ← Empresa no se muestra
│                                              │
│            (Sin datos de contacto)           │
└──────────────────────────────────────────────┘
```

---

## 📊 Comparación: Antes vs Ahora

| Aspecto | ❌ Antes | ✅ Ahora |
|---------|----------|----------|
| **Plantilla vacía** | "Tu nombre"<br>"Tu título profesional" | "Ana María García"<br>"Directora de Marketing Digital" |
| **Visual** | Texto genérico | Datos profesionales reales |
| **Indicador** | No se distingue | Cursiva + 70% opacidad |
| **Al llenar datos** | Reemplaza inmediatamente | Reemplaza + quita placeholder |
| **Al borrar datos** | Vuelve a "Tu nombre" | Sección desaparece (si hay otros datos) |
| **Imagen** | No hay | Avatar de ejemplo profesional |
| **Redes sociales** | No hay | URLs de ejemplo visibles |

---

## 🔧 Detalles Técnicos

### **Detección de Datos de Usuario**

```typescript
const hasUserData = (data: any): boolean => {
  return !!(
    data.name ||          // Nombre nuevo
    data.fullName ||      // Nombre legacy
    data.title ||         // Título nuevo
    data.position ||      // Título legacy
    data.email ||         // Email
    data.phone ||         // Teléfono
    data.company ||       // Empresa
    data.department ||    // Departamento
    data.website ||       // Website
    data.address ||       // Dirección
    data.linkedin ||      // LinkedIn
    data.twitter ||       // Twitter
    data.github ||        // GitHub
    data.instagram ||     // Instagram
    data.image?.url       // Imagen de perfil
  );
};
```

**Lógica:**
- Si **CUALQUIERA** de estos campos tiene valor → `hasUserData = true`
- Si **TODOS** están vacíos → `hasUserData = false`

---

### **Render Condicional en Plantillas**

**Antes:**
```typescript
${email !== 'tu.email@empresa.com' ? `<div>${email}</div>` : ''}
```

**Problema:** Comparaba con string hardcodeado

**Ahora:**
```typescript
${shouldShowSection(data.email, showPlaceholders) 
  ? `<div style="${placeholderStyle}">${email}</div>` 
  : ''
}
```

**Ventajas:**
- ✅ Función reutilizable
- ✅ Lógica centralizada
- ✅ Estilo de placeholder aplicado
- ✅ Más flexible

---

### **Imagen con Placeholder**

```typescript
const getImageHtml = (forDesktop = false) => {
  // Usar imagen del usuario o placeholder
  const imageUrl = data.image?.url || (showPlaceholders ? placeholderData.imageUrl : '');
  
  if (!imageUrl) return '';
  
  // ... generar HTML de imagen
  
  return `
    <div style="... ${showPlaceholders && !data.image?.url ? placeholderStyle : ''}">
      <img src="${imageUrl}" alt="Foto de perfil" ... />
    </div>
  `;
};
```

**Lógica:**
1. Si hay `data.image?.url` → Usar imagen del usuario
2. Si no hay imagen PERO `showPlaceholders = true` → Usar `placeholderData.imageUrl`
3. Si no hay imagen Y `showPlaceholders = false` → No mostrar nada
4. Si es placeholder → Aplicar `placeholderStyle`

---

## 🎯 Casos de Uso

### **Caso 1: Demo/Presentación**

**Escenario:** Mostrar la aplicación a un cliente sin datos

**Antes:** 
- ❌ Plantillas con "Tu nombre", "Tu email"
- ❌ Aspecto poco profesional

**Ahora:**
- ✅ Plantillas con datos realistas
- ✅ Se ve como firma real
- ✅ Cliente puede ver cómo se vería SU firma

---

### **Caso 2: Tutorial/Onboarding**

**Escenario:** Usuario nuevo aprende a usar la app

**Antes:**
- ❌ "Tu nombre" no es instructivo
- ❌ Usuario no sabe qué poner

**Ahora:**
- ✅ Ve ejemplo real: "Ana María García"
- ✅ Entiende formato esperado
- ✅ Puede usar como referencia

---

### **Caso 3: Testing/QA**

**Escenario:** Probar diferentes plantillas

**Antes:**
- ❌ Hay que llenar datos para cada prueba
- ❌ Tedioso y lento

**Ahora:**
- ✅ Datos de ejemplo pre-cargados
- ✅ Cambiar plantilla → Ver inmediatamente
- ✅ Más rápido probar diseños

---

## ⚙️ Configuración y Personalización

### **Cambiar Datos de Ejemplo**

Editar `src/lib/data/placeholders.ts`:

```typescript
export const placeholderData: PlaceholderData = {
  name: 'Carlos Rodríguez',  // ← Cambiar aquí
  title: 'CEO & Founder',    // ← Cambiar aquí
  company: 'StartupXYZ',      // ← Cambiar aquí
  // ...
};
```

### **Desactivar Placeholders Globalmente**

En `src/lib/utils/signature.ts`:

```typescript
// Siempre mostrar placeholders (incluso con datos)
const showPlaceholders = true;

// Nunca mostrar placeholders
const showPlaceholders = false;

// Lógica actual (solo si no hay datos)
const showPlaceholders = !hasUserData(data);
```

### **Cambiar Estilo de Placeholder**

```typescript
// Más sutil
const placeholderStyle = showPlaceholders 
  ? 'opacity: 0.5;' 
  : '';

// Más evidente
const placeholderStyle = showPlaceholders 
  ? 'opacity: 0.6; font-style: italic; color: #999;' 
  : '';

// Sin estilo (indistinguible)
const placeholderStyle = '';
```

---

## 🧪 Testing

### **Test 1: Plantilla Vacía**

```typescript
const data = {
  templateId: 'minimal-1',
  // Sin datos
};

const html = generateSignatureHTML(data);
// ✅ Debe contener "Ana María García"
// ✅ Debe tener opacity: 0.7
// ✅ Debe tener font-style: italic
```

### **Test 2: Con Datos Reales**

```typescript
const data = {
  name: 'Juan Pérez',
  email: 'juan@empresa.com',
  templateId: 'minimal-1'
};

const html = generateSignatureHTML(data);
// ✅ Debe contener "Juan Pérez" (no "Ana María García")
// ✅ NO debe tener opacity: 0.7
// ✅ NO debe tener font-style: italic
```

### **Test 3: Datos Parciales**

```typescript
const data = {
  name: 'Juan Pérez',
  // Sin email, teléfono, etc.
  templateId: 'minimal-1'
};

const html = generateSignatureHTML(data);
// ✅ Nombre: "Juan Pérez" (normal)
// ✅ Email: NO debe aparecer (ni placeholder)
// ✅ Teléfono: NO debe aparecer (ni placeholder)
```

---

## 📝 Notas Importantes

### ⚠️ **Advertencias**

1. **No es persistente**
   - Placeholders NO se guardan en localStorage
   - Solo son visuales en la vista previa
   - Al exportar, solo se exportan datos reales

2. **Imagen de ejemplo requiere internet**
   - URL: `https://i.pravatar.cc/150?img=5`
   - Si no hay internet, no se verá
   - Considerar usar imagen local en producción

3. **Redes sociales**
   - URLs de ejemplo son ficticias
   - Al hacer click, llevan a perfiles inexistentes
   - Solo para demostración visual

---

## 🚀 Mejoras Futuras

### **1. Múltiples Perfiles de Ejemplo**

```typescript
const exampleProfiles = [
  { name: 'Ana María García', title: 'Directora de Marketing' },
  { name: 'Carlos Rodríguez', title: 'CEO & Founder' },
  { name: 'Laura Sánchez', title: 'Diseñadora UX/UI' }
];

// Seleccionar aleatoriamente
const randomProfile = exampleProfiles[Math.floor(Math.random() * exampleProfiles.length)];
```

### **2. Personalización por Plantilla**

```typescript
const placeholdersByTemplate = {
  'minimal-1': { name: 'Ana García', title: 'Designer' },
  'professional-1': { name: 'Dr. Carlos López', title: 'CEO' },
  'creative-1': { name: 'Laura Art', title: 'Creative Director' }
};
```

### **3. Idioma**

```typescript
const placeholders = {
  es: { name: 'Ana María García', title: 'Directora de Marketing' },
  en: { name: 'John Smith', title: 'Marketing Director' },
  pt: { name: 'Ana Maria Garcia', title: 'Diretora de Marketing' }
};
```

### **4. Tooltip Informativo**

Agregar tooltips que digan "Dato de ejemplo - Reemplaza con tus datos"

---

## ✅ Resultado Final

### **Beneficios del Sistema**

✅ **Para el Usuario:**
- Ve ejemplos realistas
- Entiende qué poner en cada campo
- Puede probar plantillas sin llenar datos
- Feedback visual claro (cursiva + opacidad)

✅ **Para el Desarrollador:**
- Código más limpio y mantenible
- Lógica centralizada en `placeholders.ts`
- Fácil cambiar datos de ejemplo
- Reutilizable en toda la app

✅ **Para el Negocio:**
- Demos más profesionales
- Onboarding más intuitivo
- Mejor primera impresión
- Menos fricción para probar

---

**Versión:** 1.0  
**Fecha:** 7 de octubre de 2025  
**Estado:** ✅ SISTEMA DE PLACEHOLDERS IMPLEMENTADO

**Archivos Creados:**
- ✅ `src/lib/data/placeholders.ts`

**Archivos Modificados:**
- ✅ `src/lib/utils/signature.ts`

**Funcionalidad:**
- ✅ Datos de ejemplo profesionales
- ✅ Reemplazo automático con datos reales
- ✅ Indicador visual de placeholder
- ✅ Ocultamiento inteligente de secciones vacías
