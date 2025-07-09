# 🔄 Fusioneitor

<div align="center">

![Fusioneitor](https://img.shields.io/badge/Version-1.1.2-brightgreen?style=for-the-badge)
![Tauri](https://img.shields.io/badge/Tauri-2.0-blue?style=for-the-badge&logo=tauri)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?style=for-the-badge&logo=javascript)
![Rust](https://img.shields.io/badge/Rust-1.70+-orange?style=for-the-badge&logo=rust)

**Aplicación de escritorio multiplataforma para fusionar archivos de código en un solo documento**

*Desarrollado por Miguel Rendón*

</div>

---

## 📋 Descripción

**Fusioneitor** es una aplicación de escritorio desarrollada con **Tauri** que permite fusionar el contenido de múltiples archivos de código en un solo documento. Ideal para desarrolladores que necesitan consolidar proyectos, generar documentación de código, o preparar archivos para análisis de IA.

### ✨ Características Principales

- 🔄 **Fusión Inteligente**: Combina archivos manteniendo su estructura y formato
- 🎯 **Múltiples Formatos**: Exporta en TXT, JavaScript, SQL, HTML, CSS, JSON, XML, Markdown, Python y PHP
- 📁 **Selección de Carpetas**: Procesa carpetas completas de forma recursiva
- 🔀 **Reordenamiento**: Interfaz de arrastrar y soltar para organizar archivos
- 🎨 **Interfaz Moderna**: Diseño dark con glassmorphism y barra de título personalizada
- 🚀 **Multiplataforma**: Compatible con Windows, macOS y Linux
- ⚡ **Alto Rendimiento**: Construido con Rust para máxima eficiencia

## 🔧 Formatos Soportados

### Archivos de Entrada
```
txt, js, html, css, json, xml, md, py, php, sql, java, cpp, c, h, ts, jsx, tsx, 
vue, scss, sass, less, yml, yaml, ini, cfg, conf, log, csv, tsv, sh, bat, ps1, 
rb, go, rs, swift, kt, scala, pl, r, lua, dart, elm
```

### Formatos de Exportación
- **TXT** - Texto plano con separadores
- **JavaScript** - Con comentarios de separación
- **SQL** - Con comentarios de línea
- **HTML** - Con comentarios HTML
- **CSS** - Con comentarios de bloque
- **JSON** - Estructura válida combinada
- **XML** - Con comentarios XML
- **Markdown** - Con separadores horizontales
- **Python** - Con comentarios de hash
- **PHP** - Con comentarios de línea

## 🚀 Instalación y Uso

### Prerrequisitos

- **Node.js** 18+ 
- **Rust** 1.70+
- **Git**

### Instalación desde Código Fuente

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/fusioneitor.git
cd fusioneitor

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run tauri dev

# Construir para producción
npm run tauri build
```

### 📦 Uso de la Aplicación

1. **Seleccionar Carpeta**: Haz clic en "Seleccionar Carpeta" y elige la carpeta con tus archivos
2. **Revisar Archivos**: Ve los archivos detectados en la pestaña "Documentos"
3. **Reordenar** (Opcional): Usa la pestaña "Reordenar" para cambiar el orden de los archivos
4. **Elegir Formato**: Selecciona el formato de exportación deseado
5. **Exportar**: Haz clic en "Exportar" para descargar el archivo fusionado

## 🏗️ Arquitectura del Proyecto

```
Fusioneitor/
├── src/                          # Frontend (HTML/CSS/JS)
│   ├── index.html               # Interfaz principal
│   ├── styles.css               # Estilos con tema dark
│   ├── script.js                # Lógica de la aplicación
│   └── assets/                  # Recursos estáticos
├── src-tauri/                   # Backend (Rust)
│   ├── src/
│   │   ├── main.rs             # Punto de entrada
│   │   └── lib.rs              # Biblioteca principal
│   ├── Cargo.toml              # Dependencias de Rust
│   ├── tauri.conf.json         # Configuración de Tauri
│   ├── capabilities/           # Permisos de la aplicación
│   └── icons/                  # Iconos de la aplicación
└── package.json                # Configuración del proyecto
```

## 🎨 Características de la Interfaz

### Barra de Título Personalizada
- **Transparente** con efecto glassmorphism
- **Botones redondeados** con colores temáticos:
  - 🟡 Amarillo: Minimizar
  - 🟢 Verde: Maximizar/Restaurar  
  - 🔴 Rojo: Cerrar
- **Arrastre de ventana** desde cualquier parte de la barra

### Tema Dark Moderno
- **Gradientes dinámicos** con animaciones suaves
- **Efectos glassmorphism** en componentes
- **Transiciones fluidas** y micro-interacciones
- **Tipografía San Francisco** (estilo iOS)

## 🔨 Desarrollo

### Scripts Disponibles

```bash
# Desarrollo
npm run tauri dev

# Construcción
npm run tauri build

# Solo ejecutar Tauri CLI
npm run tauri
```

### Estructura de Clases JavaScript

```javascript
class FileFusionApp {
    constructor()                    // Inicialización
    initTitlebarControls()          // Controles de ventana personalizados
    handleFolderSelection()         // Procesamiento de carpetas
    exportFiles()                   // Exportación de archivos fusionados
    switchTab()                     // Navegación entre pestañas
    // ... más métodos
}
```

## 🛠️ Tecnologías Utilizadas

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Tauri** | 2.0 | Framework de aplicaciones de escritorio |
| **Rust** | 1.70+ | Backend de alto rendimiento |
| **JavaScript** | ES6+ | Lógica del frontend |
| **HTML5** | - | Estructura de la interfaz |
| **CSS3** | - | Estilos y animaciones |
| **Node.js** | 18+ | Herramientas de desarrollo |

## 🎯 Casos de Uso

- **Documentación de Proyectos**: Combinar todo el código en un documento
- **Análisis de IA**: Preparar código para procesamiento por LLMs
- **Code Reviews**: Generar archivos únicos para revisión
- **Backup de Código**: Crear snapshots de proyectos
- **Migración de Proyectos**: Consolidar código para transferencias

## 🔒 Permisos y Seguridad

La aplicación requiere los siguientes permisos:
- `core:default` - Funcionalidades básicas
- `opener:default` - Apertura de archivos
- `core:window:*` - Control de ventana personalizado

## 🐛 Debugging

Presiona **Ctrl+D** para mostrar información de debug en la consola.

## 📝 Changelog

### v1.1.2
- ✅ Barra de título personalizada transparente
- ✅ Botones de ventana redondeados con efectos
- ✅ Mejoras en la interfaz glassmorphism
- ✅ Optimización de rendimiento

### v1.1.1
- ✅ Interfaz de reordenamiento de archivos
- ✅ Soporte para múltiples formatos de exportación
- ✅ Detección automática de tipos de archivo

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

**Miguel Rendón** - *Desarrollador Principal*

---

<div align="center">

**¿Te gusta Fusioneitor? ¡Dale una ⭐ al repositorio!**

[Reportar Bug](../../issues) • [Solicitar Feature](../../issues) • [Documentación](../../wiki)

</div>
