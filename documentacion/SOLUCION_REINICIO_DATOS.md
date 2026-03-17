# Solución al Problema de Reinicio en Vista Previa

## 🐛 Problema Identificado

**Síntoma:** Los datos se reinician/limpian al navegar a la vista previa o al volver a la página principal.

**Causa Raíz:** La función `initializeData()` en `signature.ts` limpiaba el localStorage cuando detectaba que estabas en la página principal (`/`) sin parámetros URL, incluso si había datos en progreso.

## 🔍 Análisis del Problema

### Flujo Problemático (ANTES)

```
1. Usuario trabaja en firma → Datos guardados en localStorage
2. Usuario navega entre pasos → Todo funciona bien
3. Usuario vuelve a "/" (por cualquier razón) → ❌ PROBLEMA
4. initializeData() se ejecuta
5. Detecta: isHomePage = true, hasUrlParams = false
6. Ejecuta: localStorage.removeItem('signatureData')
7. Resultado: ❌ Todos los datos se pierden
```

### Escenarios de Activación

1. **Navegación manual a "/"**
   - Usuario hace click en logo/título
   - Navegación del navegador (atrás/adelante)
   - Actualización de página

2. **Redirección programática**
   - Después de completar todos los pasos
   - Error en navegación
   - `goto('/')` desde cualquier componente

3. **Recarga de página**
   - F5 o Ctrl+R cuando estás en "/"
   - Recarga automática en desarrollo

## ✅ Soluciones Implementadas

### 1. **Verificar localStorage Antes de Limpiar** ✅

**Archivo:** `src/lib/stores/signature.ts`

```typescript
function initializeData(): SignatureData {
  if (!browser) return initialSignatureData;
  
  const urlParams = new URLSearchParams(window.location.search);
  const hasUrlParams = urlParams.has('name') || 
                       urlParams.has('email') || 
                       urlParams.has('company') || 
                       urlParams.has('imageUrl'); // ← Agregado
  
  const isHomePage = window.location.pathname === '/';
  
  // ✅ NUEVO: Verificar si hay datos guardados
  const hasStoredData = localStorage.getItem('signatureData') !== null;
  
  // Solo limpiar si:
  // 1. Estamos en la página principal (/)
  // 2. NO hay parámetros URL
  // 3. NO hay datos guardados en localStorage ← PROTECCIÓN NUEVA
  if (isHomePage && !hasUrlParams && !hasStoredData) {
    localStorage.removeItem('signatureData');
    return initialSignatureData;
  }
  
  // Si hay datos guardados o parámetros URL, cargar normalmente
  return loadFromStorage();
}
```

**Beneficio:** Los datos existentes nunca se limpian accidentalmente.

### 2. **No Sobrescribir sin Parámetros URL** ✅

**Archivo:** `src/routes/+page.svelte`

```typescript
onMount(() => {
  const urlParams = $page.url.searchParams;
  
  // Solo procesar si HAY parámetros URL
  if (urlParams.size > 0) {
    // ... cargar datos de URL
  }
  // ✅ NUEVO: Si NO hay parámetros, NO hacer nada
  // Los datos del store se mantienen intactos
});
```

**Beneficio:** Visitar "/" sin parámetros no afecta los datos en progreso.

### 3. **Incluir imageUrl en Verificación** ✅

```typescript
const hasUrlParams = urlParams.has('name') || 
                     urlParams.has('email') || 
                     urlParams.has('company') ||
                     urlParams.has('imageUrl'); // ← Agregado
```

**Beneficio:** URLs compartidas con solo imagen también se detectan correctamente.

## 📊 Matriz de Protección

| Escenario | localStorage | URL Params | Resultado |
|-----------|--------------|------------|-----------|
| Primera visita | ❌ Vacío | ❌ No | ✅ Limpiar (correcto) |
| URL compartida | ❌ Vacío | ✅ Sí | ✅ Cargar de URL |
| Firma en progreso | ✅ Con datos | ❌ No | ✅ Mantener datos ← **ARREGLADO** |
| Volver de editor | ✅ Con datos | ❌ No | ✅ Mantener datos ← **ARREGLADO** |
| Recarga en "/" | ✅ Con datos | ❌ No | ✅ Mantener datos ← **ARREGLADO** |

## 🎯 Antes vs Después

### ❌ ANTES (Problema)

```
Escenario: Usuario completa información personal y contacto

1. Navega a /editor/personal → Datos OK ✅
2. Navega a /editor/contact → Datos OK ✅
3. Navega a /editor/preview → Datos OK ✅
4. Click en logo (va a /) → ❌ Datos BORRADOS
5. Usuario confundido → "¿Dónde están mis datos?"
```

### ✅ DESPUÉS (Solucionado)

```
Escenario: Usuario completa información personal y contacto

1. Navega a /editor/personal → Datos OK ✅
2. Navega a /editor/contact → Datos OK ✅
3. Navega a /editor/preview → Datos OK ✅
4. Click en logo (va a /) → ✅ Datos PRESERVADOS
5. Usuario ve sus datos intactos → ✅ Experiencia fluida
```

## 🧪 Tests de Verificación

### Test 1: Navegación Normal
```
1. Crear firma con datos
2. Navegar entre todos los pasos
3. Volver a página principal (/)
4. Verificar: Datos intactos ✅
```

### Test 2: Recarga de Página
```
1. Crear firma con datos
2. Estar en /editor/preview
3. Presionar F5
4. Verificar: Datos intactos ✅
```

### Test 3: URL Compartida
```
1. Abrir URL con parámetros
2. Datos se cargan ✅
3. Navegar a otros pasos
4. Volver a /
5. Verificar: Datos se mantienen ✅
```

### Test 4: Primera Visita Limpia
```
1. Abrir aplicación por primera vez
2. Sin localStorage, sin URL params
3. Verificar: Estado inicial limpio ✅
```

### Test 5: Botón "Limpiar Todo"
```
1. Crear firma con datos
2. Click en "Limpiar Todo"
3. Confirmar
4. Verificar: Datos limpiados correctamente ✅
```

## 🔧 Debugging

Si los datos se siguen perdiendo, agregar logs:

```typescript
// En signature.ts - initializeData()
console.log('🔍 Initialize Check:', {
  isHomePage,
  hasUrlParams,
  hasStoredData,
  willClear: isHomePage && !hasUrlParams && !hasStoredData
});

// En +page.svelte - onMount()
console.log('📄 Page Mount:', {
  hasUrlParams: urlParams.size > 0,
  currentData: $signatureData,
  localStorage: localStorage.getItem('signatureData')
});
```

## 🛡️ Protecciones Adicionales

### Protección contra limpieza accidental

```typescript
// La triple verificación garantiza que solo se limpia cuando REALMENTE es necesario
if (isHomePage && !hasUrlParams && !hasStoredData) {
  // SOLO aquí se limpia
}
```

### Auto-guardado en cada cambio

```typescript
// Ya implementado - suscripción automática
if (browser) {
  signatureData.subscribe(saveToStorage);
}
```

### Verificación de parámetros expandida

```typescript
// Incluye imageUrl para URLs de solo imagen
const hasUrlParams = urlParams.has('name') || 
                     urlParams.has('email') || 
                     urlParams.has('company') ||
                     urlParams.has('imageUrl');
```

## 📝 Casos Edge Resueltos

### Caso 1: Logo Click
**Problema:** Click en logo lleva a "/" y limpiaba datos  
**Solución:** ✅ Ahora preserva localStorage

### Caso 2: Navegación del navegador
**Problema:** Botón "Atrás" a "/" limpiaba datos  
**Solución:** ✅ Ahora preserva localStorage

### Caso 3: Recarga en página principal
**Problema:** F5 en "/" limpiaba datos  
**Solución:** ✅ Ahora preserva localStorage

### Caso 4: URL sin parámetros después de tener datos
**Problema:** Visitar "/" después de trabajar limpiaba todo  
**Solución:** ✅ Ahora preserva localStorage

## 🎓 Lecciones Aprendidas

### 1. **Nunca asumir que "/" = Estado Inicial**
```typescript
// ❌ MAL
if (isHomePage) {
  clearData();
}

// ✅ BIEN
if (isHomePage && !hasUrlParams && !hasStoredData) {
  clearData();
}
```

### 2. **Verificar múltiples fuentes de verdad**
- URL parameters
- localStorage
- Estado del store

### 3. **Ser conservador con limpieza de datos**
Mejor preservar datos innecesarios que perder trabajo del usuario.

## 🚀 Mejoras Futuras

### Opción A: Confirmación antes de limpiar
```typescript
function navigateToHome() {
  if (hasData($signatureData)) {
    if (confirm('¿Volver al inicio? Los datos se mantendrán guardados.')) {
      goto('/');
    }
  } else {
    goto('/');
  }
}
```

### Opción B: "Sesión" temporal
```typescript
// Marcar que hay una sesión activa
localStorage.setItem('hasActiveSession', 'true');

// Limpiar solo si no hay sesión
if (!localStorage.getItem('hasActiveSession')) {
  clearData();
}
```

### Opción C: Backup automático
```typescript
// Guardar backup antes de cualquier navegación
beforeNavigate(() => {
  localStorage.setItem('signatureDataBackup', JSON.stringify($signatureData));
});
```

## 📚 Referencias

- [SvelteKit Navigation](https://kit.svelte.dev/docs/modules#$app-navigation)
- [Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API)
- [Svelte Stores](https://svelte.dev/docs#run-time-svelte-store)

---

**Versión:** 3.1  
**Fecha:** 6 de octubre de 2025  
**Estado:** ✅ DATOS PERSISTENTES  

**Archivos Modificados:**
- ✅ `src/lib/stores/signature.ts` (verificación de localStorage)
- ✅ `src/routes/+page.svelte` (protección contra sobrescritura)

**Resultado:** Los datos nunca se pierden durante la navegación normal
