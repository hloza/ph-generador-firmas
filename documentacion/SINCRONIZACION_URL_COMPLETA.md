# Sincronización de Datos desde URL - Puntos de Carga

## 🔄 Problema Resuelto

**Síntoma:** Los datos de la URL (especialmente la imagen) no se cargaban automáticamente en la vista previa al abrir un enlace compartido.

**Causa:** Los parámetros de URL se procesaban en 3 lugares diferentes y la imagen solo se procesaba en 1 de ellos (signature.ts) pero no en los otros 2.

## 📍 Puntos de Procesamiento de URL

### 1. **signature.ts** (Store - Inicialización Global) ✅
**Ubicación:** `src/lib/stores/signature.ts`  
**Función:** `loadFromStorage()`  
**Momento:** Al inicializar el store (antes de montar componentes)

```typescript
// Líneas 86-109
const urlParams = new URLSearchParams(window.location.search);

// Cargar parámetros de imagen (AGREGADO)
if (urlParams.get('imageUrl')) {
  urlData.image = {
    url: urlParams.get('imageUrl')!,
    shape: (urlParams.get('imageShape') as 'circle' | 'square' | 'rounded') || 'circle',
    size: (urlParams.get('imageSize') as 'small' | 'medium' | 'large') || 'medium'
  };
}

// También carga colores y fuente
if (urlParams.get('primaryColor')) urlData.primaryColor = urlParams.get('primaryColor')!;
if (urlParams.get('accentColor')) urlData.accentColor = urlParams.get('accentColor')!;
if (urlParams.get('fontFamily')) urlData.fontFamily = urlParams.get('fontFamily')!;
```

**Estado:** ✅ Actualizado - Procesa imagen correctamente

---

### 2. **+page.svelte** (Página Principal - Templates) ✅
**Ubicación:** `src/routes/+page.svelte`  
**Función:** `onMount()`  
**Momento:** Al cargar la página de selección de plantillas

```typescript
// Líneas 17-48
onMount(() => {
  const urlParams = $page.url.searchParams;
  
  // ... otros parámetros ...
  
  // Cargar datos de imagen desde URL (AGREGADO)
  if (urlParams.get('imageUrl')) {
    prefilledData.image = {
      url: urlParams.get('imageUrl')!,
      shape: (urlParams.get('imageShape') as 'circle' | 'square' | 'rounded') || 'circle',
      size: (urlParams.get('imageSize') as 'small' | 'medium' | 'large') || 'medium'
    };
  }
  
  // Actualizar store
  signatureData.update(data => ({
    ...data,
    ...prefilledData
  }));
});
```

**Estado:** ✅ Actualizado - Ahora procesa imagen

---

### 3. **editor/image/+page.svelte** (Editor de Imagen) ✅
**Ubicación:** `src/routes/editor/image/+page.svelte`  
**Función:** Declaración reactiva + `onMount()`  
**Momento:** Al cargar la página del editor de imagen

```typescript
// NUEVO: Declaración reactiva para sincronizar con el store
$: if ($signatureData.image?.url && !imagePreview) {
  imagePreview = $signatureData.image.url;
  imageUrl = $signatureData.image.url;
  imageShape = $signatureData.image.shape || 'circle';
  imageSize = $signatureData.image.size || 'medium';
}

// onMount para inicialización
onMount(() => {
  if ($signatureData.image?.url) {
    imagePreview = $signatureData.image.url;
    imageUrl = $signatureData.image.url;
    imageShape = $signatureData.image.shape || 'circle';
    imageSize = $signatureData.image.size || 'medium';
  }
});
```

**Estado:** ✅ Actualizado - Doble sincronización (reactiva + onMount)

---

## 🎯 Flujo Completo de Carga

### Escenario: Usuario abre URL con parámetros

```
URL: https://tusitio.com/?name=Juan&imageUrl=https://ejemplo.com/foto.jpg&imageShape=circle

1. ⚡ INMEDIATO (signature.ts - loadFromStorage)
   └─> Store se inicializa con datos de URL
   └─> $signatureData.image = { url, shape, size }

2. 🏠 PÁGINA PRINCIPAL (+page.svelte - onMount)
   └─> Lee parámetros de URL
   └─> Actualiza store con image data (redundante pero asegura sincronización)
   └─> SignaturePreview se actualiza reactivamente

3. 📝 EDITOR DE IMAGEN (editor/image/+page.svelte)
   └─> Declaración reactiva detecta $signatureData.image
   └─> Actualiza variables locales (imagePreview, imageUrl, imageShape, imageSize)
   └─> onMount también sincroniza por si acaso
   └─> Vista previa muestra la imagen
```

## ✅ Verificaciones de Sincronización

### Test 1: Cargar URL con Imagen
```
URL: ?imageUrl=https://example.com/photo.jpg&imageShape=rounded&imageSize=large

✅ Store inicializado con imagen
✅ Vista previa muestra imagen
✅ Editor muestra URL en el campo
✅ Forma seleccionada: rounded
✅ Tamaño seleccionado: large
```

### Test 2: Navegación Entre Pasos
```
1. Abrir URL con imagen
2. Ir a paso de información personal
3. Volver a paso de imagen

✅ Imagen persiste en preview
✅ Datos no se pierden
✅ Formulario mantiene valores
```

### Test 3: Sin Parámetros de Imagen
```
URL: ?name=Juan&email=juan@mail.com

✅ Store se inicializa sin imagen
✅ Editor muestra campos vacíos
✅ Vista previa sin foto
✅ No hay errores
```

## 🔧 Mejoras Implementadas

### Antes (❌ Problema)
```typescript
// Solo en signature.ts
if (urlParams.get('imageUrl')) {
  urlData.image = { ... };
}

// +page.svelte NO procesaba imagen ❌
// editor/image/+page.svelte solo onMount (tardío) ❌
```

**Resultado:** Imagen no aparecía en vista previa inmediatamente

### Después (✅ Solución)
```typescript
// signature.ts ✅
if (urlParams.get('imageUrl')) {
  urlData.image = { ... };
}

// +page.svelte ✅ (NUEVO)
if (urlParams.get('imageUrl')) {
  prefilledData.image = { ... };
}

// editor/image/+page.svelte ✅ (MEJORADO)
// Declaración reactiva + onMount
$: if ($signatureData.image?.url && !imagePreview) { ... }
onMount(() => { ... });
```

**Resultado:** Imagen aparece inmediatamente en todos lados

## 📊 Matriz de Sincronización

| Componente | Lee URL | Actualiza Store | Es Reactivo | Estado |
|------------|---------|-----------------|-------------|--------|
| signature.ts | ✅ | ✅ | N/A | ✅ OK |
| +page.svelte | ✅ | ✅ | ✅ | ✅ OK |
| editor/image/+page.svelte | ❌ | ✅ | ✅ | ✅ OK |
| SignaturePreview.svelte | ❌ | ❌ | ✅ | ✅ OK |

## 🎓 Lecciones Aprendidas

### 1. **Múltiples Puntos de Entrada**
Los parámetros de URL pueden procesarse en diferentes momentos del ciclo de vida de la app. Es crucial procesarlos en TODOS los puntos de entrada.

### 2. **Reactividad de Svelte**
```typescript
// ✅ Bueno: Declaración reactiva
$: if ($signatureData.image?.url && !imagePreview) {
  imagePreview = $signatureData.image.url;
}

// ⚠️ Limitado: Solo onMount (puede ser tarde)
onMount(() => {
  imagePreview = $signatureData.image?.url;
});
```

### 3. **Redundancia Defensiva**
Es mejor procesar los parámetros de URL en múltiples lugares (con verificaciones) que perderlos por asumir que ya se procesaron en otro lado.

## 🐛 Depuración

Si la imagen no se carga, verificar:

```typescript
// 1. Console en signature.ts
console.log('URL Params:', urlParams.toString());
console.log('Image Data:', urlData.image);

// 2. Console en +page.svelte
console.log('Prefilled Data:', prefilledData);

// 3. Console en editor/image/+page.svelte
console.log('Store Image:', $signatureData.image);
console.log('Local Preview:', imagePreview);

// 4. Verificar en DevTools
// Application > Storage > signatureData
```

## 📝 Checklist de Implementación

Al agregar nuevos parámetros de URL en el futuro:

- [ ] Agregar en `signature.ts` - `loadFromStorage()`
- [ ] Agregar en `+page.svelte` - `onMount()`
- [ ] Agregar en `ExportPanel.svelte` - `copyPrefilledURL()`
- [ ] Verificar reactividad en componentes editores
- [ ] Probar navegación entre pasos
- [ ] Documentar en README

---

**Versión:** 2.1  
**Fecha:** 6 de octubre de 2025  
**Estado:** ✅ COMPLETAMENTE SINCRONIZADO  
**Archivos Modificados:**
- ✅ `src/lib/stores/signature.ts`
- ✅ `src/routes/+page.svelte`
- ✅ `src/routes/editor/image/+page.svelte`
