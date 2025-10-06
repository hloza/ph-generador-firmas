# 📧 Generador de Firmas de Correo Electrónico

> Aplicación web profesional para crear firmas de correo personalizadas con **SvelteKit 5** y **TailwindCSS**.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![SvelteKit](https://img.shields.io/badge/SvelteKit-5.0-orange.svg)

## ✨ Características

- 🎨 **6 plantillas profesionales** con vista previa en tiempo real
- 🖼️ **Editor de imágenes** con recorte y múltiples formas
- 🎯 **Personalización completa** de colores, textos y redes sociales
- 📱 **Diseño responsivo** para desktop y móvil
- 📤 **Exportación HTML/PNG** compatible con Gmail, Outlook, Apple Mail

## 🚀 Inicio Rápido

### Instalación

```bash
# Clonar repositorio
git clone https://github.com/hloza/ph-generador-firmas.git
cd ph-generador-firmas

# Instalar dependencias
npm install

# Iniciar desarrollo
npm run dev
```

La aplicación estará disponible en **http://localhost:5173**

### Comandos Disponibles

```bash
npm run dev       # Servidor de desarrollo
npm run build     # Build para producción
npm run preview   # Preview del build
```

## 🛠️ Stack Tecnológico

- **SvelteKit 5** - Framework con SSR
- **TypeScript** - Tipado estático
- **TailwindCSS 3.4** - Estilos utility-first
- **Vite 7** - Build tool rápido
- **CropperJS** - Editor de imágenes
- **html-to-image** - Exportación PNG

## 📁 Estructura

```
src/
├── lib/
│   ├── components/       # Componentes Svelte
│   ├── stores/          # Estados globales
│   ├── utils/           # Utilidades
│   └── data/            # Plantillas
└── routes/              # Páginas SvelteKit
    ├── editor/          # Editor de firmas
    └── export/          # Exportación
```

## 📋 Uso

1. **Selecciona plantilla** - Elige entre 6 diseños profesionales
2. **Completa datos** - Nombre, cargo, contacto, redes sociales
3. **Sube imagen** - Opcional, con editor de recorte
4. **Personaliza** - Ajusta colores y diseño
5. **Exporta** - Copia HTML o descarga PNG

## 🤝 Contribuir

```bash
# Fork del repositorio
git checkout -b feature/nueva-funcionalidad
git commit -m "Descripción del cambio"
git push origin feature/nueva-funcionalidad
# Crear Pull Request
```

## 📄 Licencia

MIT License - Ver [LICENSE](LICENSE)

---

**Repositorio**: [hloza/ph-generador-firmas](https://github.com/hloza/ph-generador-firmas)
