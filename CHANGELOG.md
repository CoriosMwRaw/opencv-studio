# Historial de Cambios (Changelog) - OpenCV Studio

Todas las versiones notables de este proyecto se documentan en este archivo.

## [1.1.0] - 2026-09-19

### 🚀 Novedades y Mejoras Principales
- **Plantillas 100% Estilizadas y Profesionales**:
  - `Tech / Developer`: Diseño en 2 columnas con barra lateral para stack tecnológico, enlaces sociales y educación.
  - `Data Analyst`: Formato horizontal con panel superior de métricas/KPIs de alto impacto, desglose analítico y stack de BI/Data.
  - `ATS Minimalist`: Formato unicolumna estricto, libre de elementos decorativos confusos para filtros automáticos ATS corporativos.
  - `Modern Executive`: Encabezado visual contemporáneo con avatar integrado, tipografía ejecutiva y divisiones sutiles.
- **Selector de Paletas de Color en Tiempo Real**: 4 temas cromáticos (`navy`, `teal`, `indigo`, `graphite`) con persistencia por perfil.
- **Gestor Visual de Perfiles (Modal Integrado)**:
  - Creación, duplicación y eliminación de múltiples CVs sin depender de `prompt()` nativo del navegador.
  - Prevención de borrado accidental con confirmación explícita.
- **Control de Accordion Mejorado**:
  - Botones "Expandir todo" y "Colapsar todo".
  - Corrección del bug de flexbox (`flex-shrink: 0`) que aplastaba o bugeaba los formularios al minimizar.
- **Compresión Inteligente de Fotografías**:
  - Redimensionado automático vía HTML5 Canvas (320x320 @ 85% JPEG) al subir fotos de perfil, previniendo el desbordamiento de la cuota de `localStorage`.
- **Auditoría de Privacidad y Código Abierto**:
  - Eliminación completa de datos personales reales en las plantillas base.
  - Inclusión de 4 perfiles iniciales genéricos (Estudiante de Sistemas, Desarrollador Web, Analista de Datos y Perfil en Blanco).
  - Repositorio Git inicializado con licencia libre MIT.

### 🐛 Correcciones de Errores
- Corregido el colapso visual de los formularios en el panel izquierdo al abrir/cerrar secciones.
- Solucionado el problema con diálogos nativos bloqueados en entornos Electron aislados.
- Asegurada la migración limpia de caché a `v2` sin pérdida de estabilidad.

---

## [1.0.0] - 2026-09-19

### 🌟 Lanzamiento Inicial (MVP)
- Arquitectura de escritorio basada en Electron v33 y JavaScript Vanilla.
- Editor reactivo con vista previa en tiempo real.
- Motor de exportación directa a PDF e impresión A4/Carta.
- Analizador de compatibilidad ATS con cálculo de puntuación y recomendaciones.
- Soporte para exportación e importación de copias de seguridad en formato JSON.
- Empaquetado portable autónomo (`.exe`) sin necesidad de instalar Node.js.
