# 🌟 Sistema de Partículas - Fusionador de Archivos

## Descripción

Sistema elegante de partículas flotantes en tonos verdes que se mueven suavemente por el fondo de la aplicación, creando un efecto visual sutil y moderno sin interferir con la funcionalidad principal.

## Características

- ✨ **25 partículas** que se mueven suavemente
- 🎨 **Colores verdes** que complementan el tema de la aplicación
- 🌊 **Efectos de blur y resplandor** para mayor elegancia
- 💫 **Animación de pulsación** sutil
- 🔄 **Regeneración automática** de partículas
- ⚡ **Optimizado para rendimiento** (pausa cuando la ventana no es visible)
- 📱 **Responsive** y compatible con pantallas retina

## Archivos Creados

### `particles.js`
Lógica principal del sistema de partículas. Incluye:
- Clase `ParticleSystem` completa
- Manejo de animaciones con `requestAnimationFrame`
- Optimizaciones de rendimiento
- Efectos visuales (blur, resplandor, pulsación)

### `particles.css`
Estilos específicos para el canvas de partículas:
- Posicionamiento fijo en el fondo
- Animaciones de aparición
- Optimizaciones de rendimiento CSS
- Modo de mezcla `screen` para mejor integración

### `particles-config.js`
Configuración personalizable del sistema:
- Ajustes de cantidad, velocidad, tamaño
- Presets predefinidos (subtle, normal, intense, minimal)
- Funciones para cambiar configuración en tiempo real

## Personalización

### Cambiar la Intensidad
```javascript
// En la consola del navegador:
applyParticlePreset('subtle');    // Efecto sutil
applyParticlePreset('normal');    // Efecto normal (por defecto)
applyParticlePreset('intense');   // Efecto más intenso
applyParticlePreset('minimal');   // Efecto mínimo
```

### Configuración Personalizada
```javascript
// Personalizar manualmente:
updateParticleConfig({
    maxParticles: 15,           // Menos partículas
    globalOpacity: 0.4,         // Más transparente
    speedMultiplier: 0.5,       // Movimiento más lento
    enablePulse: false          // Sin efecto de pulsación
});
```

### Colores Personalizados
```javascript
updateParticleConfig({
    customColors: [
        'rgba(74, 222, 128, 0.8)',   // Verde principal
        'rgba(34, 197, 94, 0.6)',    // Verde oscuro
        'rgba(110, 231, 183, 0.5)'   // Verde claro
    ]
});
```

## Controles Disponibles

- **Pausar/Reanudar**: Se pausa automáticamente cuando la ventana pierde el foco
- **Destruir**: `window.particleSystem.destroy()` para eliminar completamente
- **Reiniciar**: `window.particleSystem = new ParticleSystem()` para reiniciar

## Rendimiento

El sistema está optimizado para:
- ✅ Uso mínimo de CPU
- ✅ Pausa automática en pestañas inactivas
- ✅ Soporte para pantallas de alta densidad
- ✅ Animaciones suaves a 60fps
- ✅ Limpieza automática de memoria

## Integración

Las partículas están completamente integradas con el tema de la aplicación:
- Usan los mismos colores verdes del esquema de colores
- Se posicionan detrás de toda la UI (z-index: -1)
- No interfieren con la interacción del usuario
- Se adaptan automáticamente al tamaño de la ventana

## Comandos de Debug

```javascript
// Ver configuración actual
console.log(window.ParticleConfig);

// Ver instancia del sistema
console.log(window.particleSystem);

// Información de partículas
console.log(window.particleSystem.particles.length);
```
