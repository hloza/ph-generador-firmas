# Generador de Firmas de Correo Electrónico

Aplicación web profesional para crear firmas de correo electrónico personalizadas con diseño moderno y responsivo construida con SvelteKit 5.

## Características Principales

### Editor Visual Completo
- Dashboard intuitivo con navegación paso a paso
- Vista previa en tiempo real para desktop y móvil
- Edición directa de contenido
- Plantillas profesionales prediseñadas

### Gestión de Imágenes
- Subida de imágenes con drag & drop
- Herramientas de recorte integradas
- Múltiples formas disponibles (circular, cuadrada, redondeada)
- Vista previa inmediata

### Personalización Avanzada
- Selector de colores con paleta profesional
- Integración con redes sociales principales
- Campos completamente editables
- Diseño responsivo automático

### Exportación Múltiple
- Copia de HTML optimizado para clientes de email
- Descarga en formatos PNG y SVG
- Generación de URLs para compartir
- Instrucciones para Gmail, Outlook y Apple Mail

## Instalación y Configuración

### Prerrequisitos
- Node.js 18 o superior
- npm o yarn

### Desarrollo

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo
npm run dev

# Compilar para producción
npm run build

# Vista previa de producción
npm run preview
```

## Tecnologías Utilizadas

### Framework Principal
- **SvelteKit 5** - Framework moderno para aplicaciones web
- **TypeScript** - Tipado estático para mayor robustez
- **Vite** - Herramienta de build rápida y eficiente

### Estilos y Diseño
- **TailwindCSS** - Framework CSS utility-first
- **PostCSS** - Procesamiento avanzado de CSS
- **Diseño Responsivo** - Compatible con todos los dispositivos

### Funcionalidades Avanzadas
- **Gestión de Estado** - Stores reactivos de Svelte
- **Exportación HTML** - Código optimizado para clientes de email
- **Vista Previa** - Renderizado en tiempo real

## Estructura del Proyecto

```
src/
├── lib/
│   ├── components/          # Componentes reutilizables
│   │   ├── TemplateGallery.svelte
│   │   ├── EditorPanel.svelte
│   │   ├── Preview.svelte
│   │   ├── ImageUploader.svelte
│   │   └── ExportPanel.svelte
│   ├── stores/              # Estados globales
│   │   ├── signature.ts
│   │   ├── navigation.ts
│   │   └── templates.ts
│   ├── utils/               # Utilidades
│   │   └── signature.ts
│   └── data/                # Datos de plantillas
│       └── templates.ts
├── routes/                  # Sistema de rutas
│   ├── +layout.svelte      # Layout principal
│   ├── +page.svelte        # Página de inicio
│   ├── editor/             # Páginas del editor
│   └── export/             # Página de exportación
└── static/                 # Archivos estáticos
```

## Guía de Uso

### Selección de Plantilla
- Navega por las plantillas disponibles
- Cada plantilla incluye vista previa
- Selecciona haciendo clic en la plantilla deseada

### Editor de Contenido
- Completa información personal y profesional
- Agrega imagen de perfil (opcional)
- Configura enlaces a redes sociales
- Personaliza colores y diseño

### Vista Previa y Exportación
- Revisa el resultado en tiempo real
- Exporta en múltiples formatos
- Obtén código HTML optimizado
- Instrucciones para integración

## Scripts de Desarrollo

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build para producción
npm run preview      # Vista previa de producción
npm run check        # Verificación de TypeScript
npm run lint         # Análisis de código
npm run format       # Formateo automático
```

## Configuración de Producción

### Build Optimizado
```bash
npm run build
```

### Despliegue
Los archivos compilados se generan en `/build` y están listos para despliegue en cualquier servidor web estático.

### Variables de Entorno
Crear archivo `.env` para configuraciones específicas:
```
PUBLIC_APP_NAME=Generador de Firmas
PUBLIC_VERSION=1.0.0
```

## Paleta de Colores

- **Primario**: #384B70 (Azul Profesional)
- **Secundario**: #507687 (Azul Grisáceo) 
- **Fondo**: #FCFAEE (Crema Suave)
- **Acento**: #B8001F (Rojo Corporativo)

## Contribuciones

1. Fork del repositorio
2. Crear branch para nueva funcionalidad
3. Realizar cambios y commits
4. Enviar pull request con descripción detallada

## Licencia

MIT License - consultar archivo LICENSE para detalles completos.

## Soporte

Para reportar problemas o solicitar funcionalidades, crear un issue en el repositorio.
