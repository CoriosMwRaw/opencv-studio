# Historial de Cambios (Changelog) - OpenCV Studio

Todas las versiones notables de este proyecto se documentan en este archivo.

## [1.2.0] - 2026-09-19

### 🚀 Novedades y Características Principales
- **📥 Extractor Inteligente de CVs Existentes (`cvParser.js`)**:
  - **Soporte nativo para extracción directa desde archivos PDF** (`pdf-parse`), sin necesidad de copiar y pegar manualmente.
  - Motor de análisis heurístico de texto para procesar currículums en texto plano copiados desde PDFs, documentos de Word o perfiles de LinkedIn.
  - Reconocimiento estructurado de datos de contacto (email, teléfono, ubicación, LinkedIn, GitHub y sitios web).
  - Segmentación automática de secciones (Resumen/Síntesis, Experiencia Laboral, Formación Académica, Habilidades e Idiomas).
  - Extracción detallada de puestos, empresas, períodos y viñetas de logros.
  - Soporte de importación directa para formatos JSON Resume y respaldos de OpenCV Studio.
  - Vista previa interactiva de entidades detectadas antes de generar el nuevo perfil.
- **☕ Módulo de Donaciones Comunitarias ("Invítame un café")**:
  - Integración de enlace seguro a **Buy Me a Coffee** ([buymeacoffee.com/coriosmwraw](https://buymeacoffee.com/coriosmwraw)) para donaciones internacionales con tarjeta o PayPal.
  - Integración de opción de transferencia bancaria directa (SPEI) en México con cuenta **Nu México** (CLABE: `638180010128388591`) a nombre de **CoriosMwRaw**.
  - Botón de copiado de CLABE en 1 clic con confirmación visual interactiva.
- **🎨 Mejoras Visuales en el Editor y Barra Superior**:
  - Rediseño de las tarjetas de *Certificaciones y Cursos* para eliminar compresión y truncamiento de texto.
  - Ampliación del área de texto de insignias y diseño ordenado para el selector de fotografía de perfil.
  - Botones de agregar y eliminar métricas KPIs individuales.
  - Añadido botón de café con diseño ámbar de alto contraste y modal de soporte amigable.
  - Añadido botón de acceso rápido para extracción de CVs existentes.

---

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
