# 📄 OpenCV Studio

> **Crea currículums profesionales de alto impacto, optimizados para filtros ATS, 100% gratis, offline y sin suscripciones abusivas.**

![OpenCV Studio License](https://img.shields.io/badge/License-MIT-emerald.svg)
![Electron Version](https://img.shields.io/badge/Electron-v33-blue.svg)
![Platform](https://img.shields.io/badge/Platform-Windows%20x64-indigo.svg)
![Privacy](https://img.shields.io/badge/Privacy-100%25%20Offline%20Local-success.svg)
[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-Donate-yellow.svg)](https://buymeacoffee.com/coriosmwraw)

---

## 💡 ¿Por qué OpenCV Studio?

La mayoría de las plataformas en línea para crear currículums permiten diseñar tu CV pero cobran suscripciones mensuales costosas justo al momento de exportar el PDF. 

**OpenCV Studio** nació como un proyecto de código abierto para estudiantes universitarios y profesionistas que necesitan:
- ✅ **100% Gratuito y Libre de por vida** (Licencia MIT).
- ✅ **Completamente Offline**: Tus datos nunca salen de tu computadora. Privacidad total.
- ✅ **Extractor Inteligente de CV Existente**: Pega el texto de tu currículum actual (de PDF, Word o LinkedIn) y el sistema estructurará tus datos automáticamente sin tener que reescribir todo desde cero.
- ✅ **Vista Previa en Tiempo Real**: Editas en el panel izquierdo y ves los cambios al instante en el lienzo de impresión.
- ✅ **Optimizado para ATS**: Puntuación algorítmica y recomendaciones para superar filtros automáticos de contratación.
- ✅ **4 Plantillas Profesionales**: Tech Developer, Data Analyst con KPIs, ATS Minimalista y Ejecutivo Moderno.
- ✅ **Gestión Multiperfil**: Diseña distintos CVs para diferentes vacantes (puedes duplicar, clonar y respaldar).
- ✅ **Exportación a PDF en 1 Clic**: Formato exacto listo para enviar a reclutadores.
- ✅ **Respaldo JSON**: Exporta e importa tus datos en cualquier equipo sin perder configuraciones.

---

## 🎨 Plantillas Disponibles

| Plantilla | Enfoque Principal | Características |
| :--- | :--- | :--- |
| **Tech & Developer** | Programadores, SysAdmins, DevOps | Barra lateral con stack tecnológico, badges de nivel, enlaces a GitHub/LinkedIn y proyectos. |
| **Data & BI Analyst** | Analistas de Datos, Científicos de Datos, BI | Panel superior de métricas cuantitativas (KPIs), tablas analíticas y desglose de herramientas. |
| **ATS Minimalist** | Postulaciones corporativas estándar | Diseño unicolumna ultra limpio sin distracciones gráficas para maximizar legibilidad en parsers ATS. |
| **Modern Executive** | Gestión, Administración, Creativos | Encabezado contemporáneo con avatar redondeado, tipografía refinada y equilibrio visual. |

*Todas las plantillas admiten 4 esquemas cromáticos (Navy, Teal, Indigo y Grafito).*

---

## 🚀 Instalación y Uso Rápido

### Opción 1: Descarga Portable (Recomendada para Usuarios)
1. Descarga el archivo `OpenCV_Studio_Windows_x64.zip`.
2. Descomprímelo en la carpeta de tu preferencia.
3. Haz doble clic en **`OpenCV Studio.exe`** (o en `Iniciar_Aplicacion.bat`).
4. ¡Listo! La aplicación abrirá al instante sin necesidad de instalar nada más.

---

### Opción 2: Para Desarrolladores (Modo Código Fuente)
Si deseas colaborar, clonar o modificar la aplicación:

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/opencv-studio.git
cd opencv-studio

# 2. Instalar dependencias
npm install

# 3. Iniciar en modo desarrollo
npm start

# 4. Compilar binario nativo (.exe para Windows)
npm run build
```

---

## 🔒 Privacidad y Almacenamiento

- Los perfiles se guardan de forma local en tu equipo utilizando `localStorage` encriptado/aislado en el entorno de la aplicación.
- Las imágenes subidas se comprimen automáticamente en el navegador a 320x320 píxeles para optimizar el rendimiento y evitar problemas de almacenamiento.
- Puedes exportar tu perfil a un archivo `.json` en cualquier momento para tener una copia de seguridad o transferirlo a otra computadora.

---

## 🛠️ Tecnologías Empleadas

- **Entorno de Escritorio**: [Electron v33](https://www.electronjs.org/)
- **Interfaz de Usuario**: HTML5 semántico, CSS3 moderno (CSS Grid, Flexbox, Variables CSS, Print Media Queries)
- **Lógica y Reactividad**: JavaScript Vanilla (ES6+) modular y reactivo sin frameworks pesados
- **Compresión Gráfica**: HTML5 Canvas API
- **Iconografía**: [Font Awesome 6 (SVG/Webfonts)](https://fontawesome.com/)

---

## ☕ Apoya el Proyecto (Invítame un café)

**OpenCV Studio** es y será siempre **100% gratuito, offline y de código abierto**. Si esta aplicación te sirvió para ahorrar dinero, mejorar tu currículum o conseguir empleo, puedes apoyar el desarrollo y mantenimiento del proyecto de forma voluntaria:

- 💛 **Digital Internacional:** [buymeacoffee.com/coriosmwraw](https://buymeacoffee.com/coriosmwraw) *(Aportación segura con tarjeta o PayPal)*
- 🏦 **Transferencia Directa SPEI (México - Sin comisiones):**
  - **Banco:** Nu México (Nu)
  - **CLABE Interbancaria:** `638180010128388591`
  - **Beneficiario:** César Alberto López Martínez

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Si tienes sugerencias de nuevas plantillas, mejoras en el motor de puntuación ATS o correcciones:
1. Haz un Fork del proyecto.
2. Crea una rama para tu feature (`git checkout -b feature/NuevaPlantilla`).
3. Haz commit de tus cambios (`git commit -m 'feat: Agrega nueva plantilla Académica'`).
4. Haz push a la rama (`git push origin feature/NuevaPlantilla`).
5. Abre un Pull Request.

---

## 📜 Licencia

Distribuido bajo la Licencia **MIT**. Consulta el archivo [`LICENSE`](LICENSE) para más detalles.

Desarrollado con ❤️ para la comunidad de estudiantes y profesionistas.
