# 📧 Generador de Firmas de Correo Electrónico

> Aplicación web profesional para crear firmas de correo electrónico personalizadas con diseño moderno y responsivo construida con **SvelteKit 5**.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![SvelteKit](https://img.shields.io/badge/SvelteKit-5.0-orange.svg)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-blue.svg)

## ✨ Características Principales

### 🎨 Editor Visual Completo
- **Dashboard intuitivo** con navegación paso a paso
- **Vista previa en tiempo real** para desktop y móvil
- **Edición directa** de todos los elementos
- **6 plantillas profesionales** prediseñadas:
  - Minimal Clean (2 variantes)
  - Professional Modern (2 variantes) 
  - Creative Bold
  - Corporate Classic

### 🖼️ Gestión de Imágenes Avanzada
- **Subida con drag & drop** - Arrastra y suelta imágenes
- **Herramientas de recorte** integradas con CropperJS
- **Múltiples formas**: circular, cuadrada, redondeada
- **Tamaños configurables**: pequeño, mediano, grande
- **Vista previa inmediata** con optimización automática

### 🎯 Personalización Total
- **Selector de colores** con paleta profesional
- **Integración completa** con redes sociales (LinkedIn, Twitter, Instagram, Facebook, YouTube, etc.)
- **Campos completamente editables**: nombre, cargo, empresa, teléfono, email, dirección
- **Diseño responsivo automático** - Se adapta a cualquier dispositivo

### 📤 Exportación Múltiple
- **Copia HTML optimizada** para todos los clientes de email
- **Descarga en PNG** con alta calidad
- **Código limpio** compatible con Gmail, Outlook, Apple Mail
- **Vista previa dual** - Desktop y móvil simultáneas

## 🚀 Instalación y Ejecución

### Prerrequisitos
- **Node.js** 18.0 o superior
- **npm** 9.0 o superior (incluido con Node.js)

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/hloza/ph-generador-firmas.git
cd ph-generador-firmas
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Iniciar servidor de desarrollo**
```bash
npm run dev
```

4. **Abrir en el navegador**
```bash
# La aplicación estará disponible en:
http://localhost:5173
```

### Scripts Disponibles

```bash
npm run dev          # 🔥 Servidor de desarrollo con hot reload
npm run build        # 📦 Build optimizado para producción
npm run preview      # 👀 Vista previa del build de producción
npm run check        # ✅ Verificación de TypeScript y Svelte
npm run prepare      # 🔧 Preparación de SvelteKit
```

## 🛠️ Tecnologías Utilizadas

### Framework y Core
- **SvelteKit 5** - Framework moderno con SSR y routing
- **TypeScript** - Tipado estático para código robusto
- **Vite 7** - Build tool ultra-rápido con HMR

### Estilos y UI
- **TailwindCSS 3.4** - Framework CSS utility-first
- **PostCSS** - Procesamiento avanzado de CSS
- **Lucide Svelte** - Iconografía moderna y consistente

### Funcionalidades Avanzadas
- **CropperJS** - Editor de imágenes profesional
- **html-to-image** - Conversión HTML a imagen de alta calidad
- **Svelte Stores** - Gestión de estado reactiva
- **Responsive Design** - Adaptable a todos los dispositivos

## 📁 Estructura del Proyecto

```
firmas/
├── 📄 README.md                    # Documentación principal
├── 📄 package.json                 # Dependencias y scripts
├── 📄 postcss.config.cjs           # Configuración PostCSS
├── 📄 tailwind.config.ts           # Configuración TailwindCSS
├── 📄 svelte.config.js             # Configuración SvelteKit
├── 📄 vite.config.ts               # Configuración Vite
├── 📄 tsconfig.json                # Configuración TypeScript
├── 📂 src/
│   ├── 📄 app.html                 # Template HTML base
│   ├── 📄 app.css                  # Estilos globales
│   ├── 📂 lib/
│   │   ├── 📂 components/          # Componentes reutilizables
│   │   │   ├── 🧩 TemplateGallery.svelte    # Galería de plantillas
│   │   │   ├── 🧩 EditorPanel.svelte        # Panel de edición
│   │   │   ├── 🧩 SignaturePreview.svelte   # Vista previa de firmas
│   │   │   ├── 🧩 ImageUploader.svelte      # Subida y recorte de imágenes
│   │   │   ├── 🧩 ExportPanel.svelte        # Panel de exportación
│   │   │   └── 🧩 Toast.svelte              # Notificaciones
│   │   ├── 📂 stores/              # Estados globales reactivos
│   │   │   ├── 📄 signature.ts     # Estado de la firma
│   │   │   ├── 📄 navigation.ts    # Estado de navegación
│   │   │   └── 📄 templates.ts     # Estado de plantillas
│   │   ├── 📂 utils/               # Utilidades
│   │   │   └── 📄 signature.ts     # Funciones de firma
│   │   └── 📂 data/                # Datos estáticos
│   │       └── 📄 templates.ts     # Definición de plantillas
│   └── 📂 routes/                  # Sistema de rutas SvelteKit
│       ├── 📄 +layout.svelte       # Layout principal
│       ├── 📄 +page.svelte         # Página de inicio
│       ├── 📂 editor/              # Rutas del editor
│       │   ├── 📄 +page.svelte     # Dashboard del editor
│       │   ├── 📂 personal/        # Información personal
│       │   ├── 📂 contact/         # Información de contacto
│       │   ├── 📂 social/          # Redes sociales
│       │   ├── 📂 image/           # Gestión de imágenes
│       │   ├── 📂 design/          # Personalización visual
│       │   └── 📂 preview/         # Vista previa final
│       ├── 📂 export/              # Exportación
│       └── 📂 preview/             # Vista previa standalone
└── 📂 static/                      # Archivos estáticos
    └── 📄 favicon.svg              # Favicon
```

## 📋 Guía de Uso Paso a Paso

### 1️⃣ Selección de Plantilla
1. **Accede a la galería** - Navega por las 6 plantillas disponibles
2. **Vista previa instantánea** - Cada plantilla muestra un preview
3. **Selecciona tu favorita** - Haz clic en la plantilla deseada
4. **Avanza al editor** - Botón "Continuar al Editor"

### 2️⃣ Información Personal
- ✏️ **Nombre completo** - Tu nombre y apellidos
- 💼 **Cargo/Posición** - Tu título profesional
- 🏢 **Empresa** - Nombre de tu organización
- 📧 **Email principal** - Dirección de contacto

### 3️⃣ Información de Contacto
- 📱 **Teléfono** - Número de contacto directo
- 🌐 **Sitio web** - URL de tu página personal o empresarial
- 📍 **Dirección** - Ubicación física (opcional)

### 4️⃣ Redes Sociales
- 🔗 **LinkedIn** - Perfil profesional
- 🐦 **Twitter/X** - Cuenta social
- 📷 **Instagram** - Perfil visual
- 📘 **Facebook** - Página personal/empresarial
- 🎥 **YouTube** - Canal de video
- 💼 **GitHub** - Perfil de desarrollador

### 5️⃣ Imagen de Perfil
- 📤 **Subir imagen** - Drag & drop o selección manual
- ✂️ **Recortar imagen** - Herramienta integrada de recorte
- 🔄 **Forma de imagen**: Circular, cuadrada, redondeada
- 📏 **Tamaño**: Pequeño (80px), mediano (100px), grande (120px)

### 6️⃣ Personalización Visual
- 🎨 **Color primario** - Tema principal de la firma
- 🌈 **Color de acento** - Color secundario para destacar
- 👀 **Vista previa dual** - Desktop y móvil simultáneas

### 7️⃣ Exportación Final
- 📋 **Copiar HTML** - Código optimizado para email
- 💾 **Descargar PNG** - Imagen de alta calidad
- 📧 **Instrucciones** - Guía para Gmail, Outlook, Apple Mail

## 🚀 Despliegue en Producción

### Build Optimizado
```bash
# Crear build de producción
npm run build

# Los archivos se generan en: ./build/
```

### Opciones de Despliegue
- **Vercel** - Despliegue automático desde Git
- **Netlify** - Hosting estático con CI/CD
- **GitHub Pages** - Hosting gratuito de GitHub
- **Servidor propio** - Nginx, Apache, etc.

### Variables de Entorno (Opcional)
```bash
# .env
PUBLIC_APP_NAME="Generador de Firmas"
PUBLIC_VERSION="2.0.0"
PUBLIC_CONTACT_EMAIL="soporte@tudominio.com"
```

## 🎨 Paleta de Colores

| Color | Hex | Uso |
|-------|-----|-----|
| 🔵 **Azul Primario** | `#3b82f6` | Elementos principales, enlaces |
| 🟣 **Púrpura Secundario** | `#a855f7` | Acentos, botones secundarios |
| ⚫ **Fondo Oscuro** | `#0f172a` | Modo oscuro, texto principal |
| ⚪ **Fondo Claro** | `#f8fafc` | Modo claro, superficies |
| 🔘 **Gris Neutro** | `#64748b` | Texto secundario, bordes |

## 🐛 Solución de Problemas

### Errores Comunes

**❌ Error: "Cannot apply unknown utility class"**
- ✅ **Solución**: Limpiar caché con `rm -rf .svelte-kit node_modules/.vite`

**❌ Puerto 5173 en uso**
- ✅ **Solución**: Vite automáticamente encuentra otro puerto disponible

**❌ Imagen no se recorta correctamente**
- ✅ **Solución**: Actualizar a la última versión - problema resuelto

### Logs y Debugging
```bash
# Ver logs detallados
npm run dev -- --verbose

# Verificar configuración
npm run check
```

## 🤝 Contribuciones

### Proceso de Contribución
1. 🍴 **Fork** del repositorio
2. 🌿 **Crear branch** para nueva funcionalidad
   ```bash
   git checkout -b feature/nueva-funcionalidad
   ```
3. ✏️ **Realizar cambios** y commits descriptivos
4. 📤 **Push** a tu fork
5. 📝 **Pull Request** con descripción detallada

### Estándares de Código
- **TypeScript** para tipado fuerte
- **Prettier** para formateo consistente
- **ESLint** para calidad de código
- **README actualizado** para nuevas features

## 📄 Licencia

**MIT License** - Ver archivo [LICENSE](LICENSE) para detalles completos.

## 🆘 Soporte y Contacto

- 🐛 **Reportar Bugs**: [Issues de GitHub](https://github.com/hloza/ph-generador-firmas/issues)
- 💡 **Solicitar Features**: [Discussions](https://github.com/hloza/ph-generador-firmas/discussions)
- 📧 **Contacto Directo**: Crear issue en el repositorio

---

**⭐ Si te resulta útil, no olvides dar una estrella al repositorio!**
