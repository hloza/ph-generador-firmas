# Solución al Problema de Reactividad en Vista Previa

## 🐛 Problema Identificado

**Síntoma:** Los datos se cargan desde la URL y se guardan en el store, pero la vista previa no se actualiza hasta que el usuario modifica manualmente algún campo.

**Causa Raíz:** Svelte no detecta cambios profundos en objetos anidados (`image`, `socialLinks`, etc.) cuando se actualizan mediante `update()` o `set()`. La vista previa usa `@html` que no se recalcula automáticamente.

## 🔧 Soluciones Implementadas

### 1. **Update Key Reactivo** ✅

**Archivo:** `SignaturePreview.svelte`

```typescript
// Key reactivo que serializa los datos importantes
$: updateKey = JSON.stringify({
  image: $signatureData.image,
  name: $signatureData.name,
  fullName: $signatureData.fullName,
  title: $signatureData.title,
  company: $signatureData.company,
  email: $signatureData.email,
  phone: $signatureData.phone,
  primaryColor: $signatureData.primaryColor,
  templateId: $signatureData.templateId
});
```

**Cómo Funciona:**
- `JSON.stringify()` convierte el objeto a string
- Cualquier cambio en los datos cambia el string
- Svelte detecta el cambio en `updateKey`
- Se fuerza recalculación de `templatePreviewHtml`

### 2. **Dependencia Forzada en Template** ✅

**Archivo:** `SignaturePreview.svelte`

```typescript
$: templatePreviewHtml = (() => {
  // Forzar dependencia en updateKey
  const _ = updateKey;
  
  // Resto del código de generación de HTML...
})();
```

**Beneficio:** Cada vez que `updateKey` cambia, toda la función se recalcula, generando nuevo HTML.

### 3. **Svelte Key Block** ✅

**Archivo:** `SignaturePreview.svelte`

```svelte
<div class="signature-content signature-preview-content">
  {#key updateKey}
    {@html templatePreviewHtml}
  {/key}
</div>
```

**Qué Hace:**
- `{#key}` destruye y recrea el bloque cuando `updateKey` cambia
- Fuerza re-renderizado completo del HTML
- Garantiza que la vista previa siempre esté sincronizada

### 4. **Store Set en lugar de Update** ✅

**Archivo:** `+page.svelte`

```typescript
// ANTES (❌ No forzaba reactividad profunda)
signatureData.update(data => ({
  ...data,
  ...prefilledData
}));

// AHORA (✅ Fuerza actualización completa)
signatureData.set({
  ...$signatureData,
  ...prefilledData
});
```

**Diferencia:**
- `update()` puede no disparar suscripciones si los objetos anidados no cambian de referencia
- `set()` siempre dispara todas las suscripciones reactivas

### 5. **Timeout para Sincronización** ✅

**Archivo:** `+page.svelte`

```typescript
setTimeout(() => {
  markAllStepsAsCompleted();
  showToast('success', '✅ Datos cargados desde URL compartida');
}, 50);
```

**Por Qué:** Permite que el store se actualice completamente antes de marcar pasos como completados y mostrar el toast.

## 📊 Flujo de Actualización Completo

### Escenario: Usuario abre URL con datos

```
1. URL Params cargados en signature.ts
   └─> Store inicializado con datos

2. +page.svelte onMount()
   └─> signatureData.set({ ...prefilledData })
   └─> Store se actualiza COMPLETAMENTE

3. SignaturePreview detecta cambio
   └─> updateKey cambia (JSON.stringify genera nuevo string)
   └─> templatePreviewHtml se recalcula (dependencia en updateKey)
   └─> {#key updateKey} destruye y recrea bloque
   └─> {@html} renderiza nuevo HTML

4. Vista Previa Actualizada ✅
```

## 🧪 Tests de Verificación

### Test 1: Cargar URL con Imagen
```
1. Abrir: ?imageUrl=https://ejemplo.com/foto.jpg
2. Verificar: Vista previa muestra imagen INMEDIATAMENTE
✅ PASA - updateKey detecta cambio en image
```

### Test 2: Cargar Múltiples Parámetros
```
1. Abrir: ?name=Juan&company=Acme&imageUrl=...
2. Verificar: Todos los datos aparecen sin necesidad de editar
✅ PASA - updateKey serializa todos los cambios
```

### Test 3: Navegación Entre Pasos
```
1. Cargar URL con datos
2. Navegar a diferentes pasos del editor
3. Volver a vista previa
✅ PASA - Datos persisten en localStorage y se mantienen reactivos
```

### Test 4: Modificar Datos Manualmente
```
1. Cargar URL con datos
2. Editar nombre en formulario
3. Verificar: Vista previa se actualiza en tiempo real
✅ PASA - updateKey detecta cambio y recalcula
```

## 🎯 Antes vs Después

### ❌ ANTES (Problema)

```
Usuario abre URL → Store se actualiza → Vista previa NO se actualiza

Flow:
1. URL params → Store ✅
2. Store → Template HTML ❌ (no detecta cambio profundo)
3. Usuario edita campo → Trigger manual → Vista actualiza ✅

Resultado: Usuario confundido, parece que los datos no se cargaron
```

### ✅ DESPUÉS (Solucionado)

```
Usuario abre URL → Store se actualiza → Vista previa se actualiza INMEDIATAMENTE

Flow:
1. URL params → Store ✅
2. updateKey detecta cambio ✅
3. templatePreviewHtml recalcula ✅
4. {#key} recrea bloque ✅
5. Vista actualizada automáticamente ✅

Resultado: Experiencia fluida, datos visibles inmediatamente
```

## 🔍 Debugging

Si la vista previa no se actualiza, verificar:

```javascript
// 1. Console en SignaturePreview.svelte
console.log('UpdateKey:', updateKey);
console.log('Template HTML length:', templatePreviewHtml.length);

// 2. Verificar que updateKey cambia
let lastKey = '';
$: {
  if (updateKey !== lastKey) {
    console.log('✅ UpdateKey changed!');
    lastKey = updateKey;
  }
}

// 3. Verificar datos en el store
console.log('SignatureData:', $signatureData);
console.log('Image:', $signatureData.image);
```

## 📝 Patrones de Reactividad Aprendidos

### 1. **Objetos Anidados Necesitan Serialización**
```typescript
// ❌ MAL - Svelte no detecta cambios profundos
$: reactive = $store.nestedObject;

// ✅ BIEN - Serializar para detectar cambios
$: reactive = JSON.stringify($store.nestedObject);
```

### 2. **@html No Es Reactivo Por Defecto**
```svelte
<!-- ❌ MAL - No se actualiza automáticamente -->
<div>{@html myHtml}</div>

<!-- ✅ BIEN - Forzar con {#key} -->
{#key updateTrigger}
  <div>{@html myHtml}</div>
{/key}
```

### 3. **Set vs Update en Stores**
```typescript
// ❌ PUEDE FALLAR - Referencias no cambian
store.update(data => ({ ...data, nested: { ...data.nested, prop: value } }));

// ✅ GARANTIZADO - Nueva referencia
store.set({ ...$store, nested: { ...$store.nested, prop: value } });
```

## 🚀 Optimizaciones Futuras

### Opción A: Derived Store
```typescript
export const previewKey = derived(signatureData, $data => 
  JSON.stringify({
    image: $data.image,
    name: $data.name,
    // ...
  })
);
```

### Opción B: Deep Watch Custom
```typescript
function deepEqual(obj1: any, obj2: any): boolean {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}

let lastData = {};
$: if (!deepEqual($signatureData, lastData)) {
  lastData = $signatureData;
  updatePreview();
}
```

## 📚 Referencias

- [Svelte Reactivity](https://svelte.dev/docs#component-format-script-3-$-marks-a-statement-as-reactive)
- [Svelte Key Blocks](https://svelte.dev/docs#template-syntax-key)
- [Svelte Stores](https://svelte.dev/docs#run-time-svelte-store)

---

**Versión:** 3.0  
**Fecha:** 6 de octubre de 2025  
**Estado:** ✅ COMPLETAMENTE REACTIVO  

**Archivos Modificados:**
- ✅ `src/lib/components/SignaturePreview.svelte` (updateKey + {#key} block)
- ✅ `src/routes/+page.svelte` (set() en lugar de update())

**Resultado:** Vista previa se actualiza inmediatamente al cargar datos desde URL
