# 🧠 Documentación de Código (Nivel Interno)

Esta guía complementa `DOCUMENTACION.md` y profundiza en la implementación interna del generador de firmas: diseño de componentes, stores, flujo de datos, decisiones técnicas y puntos de extensión.

---

## 🗺️ Visión General del Flujo

```
Usuario -> Componentes (UI) -> Stores (estado global) -> Utilidades (generación HTML / validación) -> Vista Previa / Exportación
```

1. El usuario interactúa con formularios y controles (componentes Svelte).
2. Los valores se almacenan / actualizan en los stores (`signatureData`, navegación, toasts).
3. Las utilidades transforman esos datos en HTML listo para email (`generateSignatureHTML`).
4. La vista previa reactiva y los paneles de exportación renderizan el resultado.

---

## 📂 Estructura Técnica con Propósito

| Ruta | Propósito principal |
|------|---------------------|
| `src/lib/components/` | Presentación + interacción modular |
| `src/lib/stores/` | Estado global reactivo + persistencia |
| `src/lib/utils/` | Funciones puras reutilizables (HTML, validación, formato) |
| `src/lib/data/` | Catálogo de plantillas y presets |
| `src/routes/` | Páginas (wizard) + layout general |

---

## 🧩 Componentes (UI)

> Los componentes están diseñados con principios: single-responsibility, desacoplados del fetch (todo es local), y comunicación unidireccional a través de stores.

### `TemplateGallery.svelte`
- Lista todas las plantillas (`templates` de `data/templates.ts`).
- Seleccionar una actualiza `signatureData.templateId`.
- Muestra categoría, nombre y descripción.
- Punto de extensión: añadir filtro por categoría o búsqueda.

### `EditorPanel.svelte`
- Formulario principal de edición.
- Usa `signatureStore.updateField` / `updateSocialLink` para mutaciones atómicas.
- Secciones plegables (colores, redes sociales, imagen, tipografías).
- Optimización: evita estados locales duplicados; usa reactividad directa (`$signatureData`).

### `Preview.svelte`
- Vista previa editable inline (edición rápida de campos clicables).
- Permite cambiar directamente nombre, cargo, etc. sin abrir paneles.
- Usa `generateSignatureHTML` para el HTML final y, además, maneja estados de edición local (`editingField`).

### `SignaturePreview.svelte`
- Simulador enriquecido (modo desktop / mobile toggle).
- Recrea un entorno de email falso (encabezado, cuerpo, borde, etc.).
- Construye HTML adaptado al modo, pero reutiliza la lógica de datos.

### `ExportPanel.svelte`
- Ofrece acciones: copiar HTML, descargar, copiar fragmentos.
- Usa `copyToClipboard` y `formatFileName`.
- Encapsula la lógica de retroalimentación (toast de éxito).

### `Toast.svelte`
- Renderiza una cola de notificaciones (`toastMessages`).
- Auto-dismiss configurable.

### (Imagen) `ImageUploader.svelte` *(referenciado pero no listado en árbol actual)*
- Se asume gestiona drag & drop + recorte (CropperJS) + normalización.
- Almacena `{ url, size, shape }` en `signatureData.image`.

---

## 🗃️ Stores (Estado Global)

### `signature.ts`
Responsable del modelo de firma y utilidades relacionadas.

#### Interfaces Clave
```ts
interface SocialLink { platform: 'linkedin' | 'twitter' | 'instagram' | 'facebook' | 'github' | 'youtube'; url: string; enabled: boolean; }
interface ImageData { url: string; shape: 'circle' | 'square' | 'rounded'; size: 'small' | 'medium' | 'large'; }
interface SignatureData { fullName: string; position: string; /* ... */ templateId: string; primaryColor: string; accentColor?: string; fontFamily?: string; image?: ImageData; }
```

#### Estado Inicial
- Pre-carga redes sociales deshabilitadas.
- Template inicial: `minimal-1`.
- Color base seguro (`#0ea5e9`).

#### Persistencia
- `loadFromStorage()` intenta hidratar desde `localStorage` (solo en navegador: controlado con `browser`).
- `saveToStorage(data)` serializa en cambios importantes (optimizable con debounce si creciera la frecuencia de escritura).

#### Actualización Atómica
```ts
signatureStore.updateField(field, value) // Evita recreación innecesaria de objeto anidado
signatureStore.updateSocialLink(platform, updates)
signatureStore.addSocialLink(platform)
signatureStore.removeSocialLink(platform)
```

#### Toasts
`showToast(type, message)` inserta un mensaje y programa su eliminación; diseño de cola simple FIFO.

### `navigation.ts`
Define el flujo tipo wizard.

```ts
steps = [ { id: 'template', path: '/' }, { id: 'personal', path: '/editor/personal' }, ... ]
```

Funciones (implícitas):
- `canNavigateToStep(stepId)` (derivada en layout) para validar orden.
- `setCurrentStep(id)` sincroniza UI + breadcrumb.

---

## 🧪 Lógica de Generación de Firmas (`utils/signature.ts`)

### `generateSignatureHTML(data: SignatureData): string`
Función pura (sin efectos) que:
1. Extrae campos con fallback legibles.
2. Normaliza colores, tipografía y meta.
3. Construye helpers internos:
   - `getImageHtml(forDesktop)` → bloque consistente de imagen adaptable (size + shape + shadow + borde temático).
   - `getSocialIcons()` → lista dinámica solo con perfiles no vacíos.
4. Mapa `templates` (objeto literal) indexado por `templateId`.
5. Devuelve la cadena HTML final (inline-styles para máxima compatibilidad).

Diseños soportados: `minimal-1`, `minimal-2`, `professional-1`, `professional-2`, `creative-1`, `corporate-1`.

#### Decisiones Clave
- Inline styles > CSS externo (requerimiento de clientes de correo).
- Uso controlado de tablas solo en `professional-1` para layout semántico de atributos.
- Gradientes y sombras suaves degradan aceptablemente en clientes antiguos.

#### Posibles Mejoras
- Parametrizar estilos comunes para reducir repetición (plantillas derivadas).
- Motor de plantillas separado (ej: `renderTemplate(templateId, context)`).
- Sanitización estricta de inputs (actualmente asumidos seguros). 

### Otras Utilidades
```ts
copyToClipboard(text) // Usa Clipboard API + fallback (textarea oculto)
formatFileName(base, ext) // Slug + fecha YYYY-MM-DD
```

---

## 🔁 Reactividad en Svelte

Ejemplo típico en componentes:
```svelte
$: selectedTemplateId = $signatureData.templateId;
$: html = generateSignatureHTML($signatureData);
```
Cada mutación del store vuelve a evaluar los statements marcados con `$:`.

Patrón usado: evitar watchers complejos → lógica pura dentro de declaraciones reactivas.

---

## 🌐 Routing (Wizard)

| Paso | Ruta | Propósito |
|------|------|----------|
| template | `/` | Selección de diseño |
| personal | `/editor/personal` | Datos base |
| contact | `/editor/contact` | Email / Teléfono / Web |
| social | `/editor/social` | Redes activas |
| image | `/editor/image` | Fotografía y forma |
| design | `/editor/design` | Colores / tipografía |
| preview | `/editor/preview` | Vista consolidada |
| export | `/export` | Generar salida |

Control central en `+layout.svelte` que observa `$page.route.id` y ajusta `currentStep`.

---

## 🧱 Decisiones de Diseño Técnicas

| Área | Decisión | Justificación |
|------|----------|---------------|
| Estilos | Tailwind + Inline email | Equilibrio: Tailwind para UI app, inline para email final |
| Estado | Svelte stores planos | Simplicidad y reactividad inmediata |
| Persistencia | localStorage manual | Control explícito + sin dependencias |
| Tipografías | Nombres lógicos (modern/classic/minimal) | Mapeables a fuentes seguras de sistema |
| Imágenes | URL base64 / externa | Facilita copiar HTML portátil |
| Social Icons | Icons8 CDN | Rapidez + variedad (podría cachearse/localizarse) |

---

## 🧩 Extensión / Hooks Futuros

| Mejora | Descripción | Complejidad |
|--------|-------------|-------------|
| Motor de Plantillas Dinámicas | Registrar plantillas en runtime (plugins) | Media |
| Export PDF | Usar html-to-image + jsPDF | Media |
| Multi Idioma (i18n) | Integrar `@sveltekit/i18n` o traducciones simples | Media |
| Validación Avanzada | Librería (zod) para schema `SignatureData` | Baja |
| Theming Persistente | Guardar conjuntos de colores personalizados | Baja |
| Importación JSON | Permitir cargar una firma guardada | Baja |

---

## 🧪 Estrategia de Testing (Sugerida)

Aunque aún no implementado:
1. Unit: `generateSignatureHTML` (snapshot + condiciones condicionales).
2. Store: mutaciones (`addSocialLink`, `updateField`).
3. E2E: flujo completo (seleccionar plantilla → exportar).
4. Accesibilidad: roles / etiquetas en campos clave.

---

## 🔐 Consideraciones de Seguridad

- Sanitizar URLs (evitar `javascript:`). 
- Limitar tamaño de imagen (peso máximo para no saturar email).
- Evitar inyección HTML en campos de texto (reemplazar `<` `>` al generar, si se habilita entrada libre del usuario con riesgo).

---

## ⚙️ Rendimiento

- Componentes ligeros (sin render redundante gracias a stores segmentados).
- Cadenas HTML generadas bajo demanda (no se cachean, pero costo es bajo).
- Oportunidad: memoizar resultado mientras no cambien dependencias críticas (colores, campos visibles, plantilla, imagen).

---

## 🛠️ Ejemplo de Integración Nueva Plantilla

```ts
// 1. Añadir en data/templates.ts
{ id: 'minimal-3', name: 'Minimal Compact', description: 'Versión condensada', preview: 'minimal-3', category: 'minimal' }

// 2. Añadir bloque en map templates dentro de generateSignatureHTML
'minimal-3': `
  <div style="${fontStyle} ..."> ... </div>
`

// 3. (Opcional) Vista previa específica si se usa preview dinámico extendido
```

Checklist:
- Evitar estilos externos.
- Usar sólo propiedades soportadas por clientes de correo (sin `flex` si se busca compatibilidad Outlook clásica; actualmente se prioriza modernidad sobre 100% legacy).

---

## 🧾 Licencia y Créditos

- MIT License.
- Iconos obtenidos de Icons8 (CDN público) — considerar política de atribución si se comercializa.

---

## ✅ Resumen Final

El proyecto aplica un enfoque claro: simplicidad estructural, componentes desacoplados y un motor compacto de plantillas HTML con inline styles para alta compatibilidad. La separación entre datos (stores), representación (componentes) y generación final (utilidades) facilita la evolución modular (nuevos formatos / plantillas / validaciones) sin refactorizaciones profundas.

---

¿Necesitas ahora una guía para añadir tests automáticos o convertir plantillas a un sistema declarativo? Pídelo y lo preparo.
