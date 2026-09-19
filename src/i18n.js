// ==========================================================================
// OpenCV Studio — Módulo de Internacionalización (i18n)
// Soporte Completo para Español (es) e Inglés (en)
// ==========================================================================

let currentLanguage = (typeof localStorage !== 'undefined' && localStorage.getItem('opencv_language')) || 'es';

const translations = {
  es: {
    // Barra Superior
    'topbar.badge': '100% Libre & Offline',
    'topbar.profile': 'Perfil:',
    'topbar.profileMgr': 'Administrar Perfiles',
    'topbar.extract': '📥 Extraer de CV',
    'topbar.ats': '✨ Analizar ATS',
    'topbar.backup': '💾 Respaldar',
    'topbar.load': '📂 Cargar',
    'topbar.pdf': '🖨️ Exportar a PDF',
    'topbar.fullscreen': 'Alternar Pantalla Completa (F11)',
    'topbar.coffee': '☕ Invítame un café',

    // Editor Lateral
    'editor.title': 'Editor de Contenido',
    'editor.expandAll': 'Expandir Todo',
    'editor.collapseAll': 'Colapsar Todo',

    // Acordeones
    'acc.personal': '👤 1. Datos Personales & Contacto',
    'acc.summary': '📝 2. Perfil / Resumen Profesional',
    'acc.kpis': '📊 3. Métricas de Impacto (KPIs Rápidos)',
    'acc.experience': '💼 4. Experiencia Laboral',
    'acc.projects': '🚀 5. Proyectos Técnicos Destacados',
    'acc.education': '🎓 6. Formación Educativa',
    'acc.skills': '🛠️ 7. Habilidades Técnicas & Stack',
    'acc.certifications': '📜 8. Certificaciones & Cursos',
    'acc.settings': '🎨 9. Plantilla & Personalización',

    // Campos Personales
    'field.fullName': 'Nombre Completo',
    'field.headline': 'Titular Profesional (ej. Desarrollador Full Stack | Ing. de Software)',
    'field.phone': 'Teléfono / WhatsApp',
    'field.email': 'Correo Electrónico Profesional',
    'field.location': 'Ubicación (Ciudad, País)',
    'field.linkedin': 'Enlace a Perfil de LinkedIn',
    'field.github': 'Enlace a GitHub o Portafolio',
    'field.badges': 'Insignias de Especialidad (una por línea)',
    'field.photo': 'Fotografía de Perfil',
    'field.uploadPhoto': '📷 Subir / Cambiar Fotografía',
    'field.showPhoto': 'Mostrar fotografía en el currículum',
    'field.showKpis': 'Mostrar barra de métricas clave (KPIs)',

    // Resumen Profesional
    'field.summary': 'Resumen Profesional (30-90 palabras recomendadas para ATS)',
    'field.summaryHelp': 'Describe tu especialidad, principales fortalezas y el valor que aportas a la empresa.',

    // Botones de Adición
    'btn.addKpi': '➕ Agregar Métrica de Impacto',
    'btn.addExperience': '➕ Agregar Puesto Laboral',
    'btn.addProject': '➕ Agregar Proyecto',
    'btn.addEducation': '➕ Agregar Estudio',
    'btn.addCert': '➕ Agregar Certificación',
    'btn.phraseBank': '💡 Banco de Frases',

    // Experiencia
    'exp.role': 'Puesto o Rol',
    'exp.company': 'Empresa / Institución',
    'exp.period': 'Período (ej. Ago 2023 - Presente)',
    'exp.location': 'Ubicación',
    'exp.bullets': 'Logros y Responsabilidades (uno por línea)',

    // Proyectos
    'proj.title': 'Título del Proyecto',
    'proj.tech': 'Tecnologías (ej. React • Node.js • PostgreSQL)',
    'proj.link': 'Enlace / Repositorio (Opcional)',
    'proj.desc': 'Descripción del Proyecto y Solución Diseñada',

    // Educación
    'edu.degree': 'Grado / Carrera / Título',
    'edu.school': 'Institución Educativa / Universidad',
    'edu.period': 'Período (ej. 2021 - 2025)',
    'edu.details': 'Detalles Adicionales (Promedio, Especialidad, Mención)',

    // Habilidades
    'skills.languages': 'Lenguajes de Programación (separados por coma)',
    'skills.databases': 'Bases de Datos & SQL',
    'skills.tools': 'Herramientas, Frameworks & BI',
    'skills.soft': 'Competencias & Metodologías Clave (ej. Scrum, Kaizen)',

    // Personalización
    'settings.template': 'Plantilla del CV',
    'settings.theme': 'Paleta de Color',
    'settings.lang': 'Idioma de Encabezados del CV',

    // Toolbar de Previsualización
    'preview.title': 'VISTA PREVIA EN VIVO',
    'preview.atsNotice': '✓ 100% Compatible con Filtros ATS & Descargable en PDF',
    'preview.fit': 'Ajustar',

    // Banco de Frases
    'bank.modalTitle': '💡 Banco de Frases de Impacto & Verbos de Acción',
    'bank.searchPlaceholder': '🔍 Buscar frases clave (ej. SQL, automatización, dashboards, Scrum, Kaizen)...',
    'bank.allCategories': 'Todas las categorías',
    'bank.dev': 'Desarrollo de Software & Programación',
    'bank.data': 'Análisis de Datos, BI & Automatización',
    'bank.maint': 'Mantenimiento Industrial & Procesos',
    'bank.net': 'Redes, Soporte & Sistemas',
    'bank.student': 'Proyectos Universitarios & Académicos',
    'bank.verbs': '⚡ Verbos de Acción ATS',
    'bank.verbsTitle': 'Verbos de Acción Recomendados para ATS (clic para iniciar frase):',
    'bank.usePhrase': '➕ Usar frase',
    'bank.noResults': 'No encontramos frases que coincidan con tu búsqueda.',
    'bank.close': 'Cerrar',

    // Analizador ATS
    'ats.title': '✨ Diagnóstico de Compatibilidad ATS',
    'ats.desc': 'Puntuación estimada de aprobación ante filtros automáticos de recursos humanos (ATS) y reclutadores técnicos.',
    'ats.understand': 'Entendido',

    // Modal Perfiles
    'profiles.title': '⚙️ Administrar Perfiles de Currículum',
    'profiles.desc': 'Gestiona perfiles para diferentes compañeros o crea variantes especializadas para cada postulación.',
    'profiles.createNew': '➕ Crear Nuevo Perfil',
    'profiles.nameInput': 'Nombre del Perfil o Compañero',
    'profiles.initialTemplate': 'Plantilla Inicial',
    'profiles.createBtn': 'Crear y Abrir Perfil',
    'profiles.close': 'Cerrar',

    // Modal Café
    'coffee.title': '☕ Apoya el Proyecto OpenCV Studio',
    'coffee.heroTitle': '100% Libre, Offline y Gratuito de por vida',
    'coffee.heroDesc': 'OpenCV Studio nació para que tú y tus compañeros nunca tengan que pagar suscripciones abusivas por crear y descargar su CV. Si esta herramienta te ayudó a conseguir empleo o te ahorró tiempo, ¡tu apoyo voluntario permite seguir manteniéndola y mejorándola!',
    'coffee.buyMeBtn': '☕ Invítame un café en Buy Me a Coffee',
    'coffee.clabeTitle': 'Transferencia Interbancaria SPEI (México)',
    'coffee.clabeDesc': 'Sin comisiones desde cualquier aplicación bancaria mexicana:',
    'coffee.bank': 'Banco / Institución:',
    'coffee.beneficiary': 'Beneficiario:',
    'coffee.clabe': 'CLABE Interbancaria:',
    'coffee.copyBtn': '📋 Copiar CLABE',
    'coffee.close': 'Cerrar',

    // Extractor
    'extractor.title': '📥 Extractor Inteligente de CV Existente',
    'extractor.subtitle': 'Carga tu CV previo en PDF o pega su contenido para extraer tus datos de forma automática con IA y OCR offline.',
    'extractor.btnPdf': '📂 Seleccionar Archivo PDF o Texto',
    'extractor.pastePrompt': 'O pega aquí el texto completo de tu currículum anterior:',
    'extractor.btnProcess': '🔍 Analizar y Extraer Información',
    'extractor.confirmTitle': '¿Deseas crear un nuevo perfil con estos datos?',
    'extractor.saveBtn': '✓ Guardar como Nuevo Perfil',
    'extractor.cancel': 'Cancelar'
  },

  en: {
    // Topbar
    'topbar.badge': '100% Free & Offline',
    'topbar.profile': 'Profile:',
    'topbar.profileMgr': 'Manage Profiles',
    'topbar.extract': '📥 Extract from CV',
    'topbar.ats': '✨ ATS Check',
    'topbar.backup': '💾 Backup',
    'topbar.load': '📂 Load',
    'topbar.pdf': '🖨️ Export PDF',
    'topbar.fullscreen': 'Toggle Full Screen (F11)',
    'topbar.coffee': '☕ Buy Me a Coffee',

    // Sidebar Editor
    'editor.title': 'Content Editor',
    'editor.expandAll': 'Expand All',
    'editor.collapseAll': 'Collapse All',

    // Accordions
    'acc.personal': '👤 1. Personal Details & Contact',
    'acc.summary': '📝 2. Professional Summary',
    'acc.kpis': '📊 3. Impact Metrics (Quick KPIs)',
    'acc.experience': '💼 4. Work Experience',
    'acc.projects': '🚀 5. Featured Technical Projects',
    'acc.education': '🎓 6. Education',
    'acc.skills': '🛠️ 7. Technical Skills & Stack',
    'acc.certifications': '📜 8. Certifications & Courses',
    'acc.settings': '🎨 9. Template & Customization',

    // Personal Fields
    'field.fullName': 'Full Name',
    'field.headline': 'Professional Title (e.g. Full Stack Developer | Software Engineer)',
    'field.phone': 'Phone / WhatsApp',
    'field.email': 'Professional Email',
    'field.location': 'Location (City, Country)',
    'field.linkedin': 'LinkedIn Profile URL',
    'field.github': 'GitHub or Portfolio URL',
    'field.badges': 'Specialty Badges (one per line)',
    'field.photo': 'Profile Photo',
    'field.uploadPhoto': '📷 Upload / Change Photo',
    'field.showPhoto': 'Show photo on resume',
    'field.showKpis': 'Show key impact metrics bar (KPIs)',

    // Summary
    'field.summary': 'Professional Summary (30-90 words recommended for ATS)',
    'field.summaryHelp': 'Highlight your core expertise, key technical achievements, and target value proposition.',

    // Addition Buttons
    'btn.addKpi': '➕ Add Impact Metric',
    'btn.addExperience': '➕ Add Work Experience',
    'btn.addProject': '➕ Add Project',
    'btn.addEducation': '➕ Add Education',
    'btn.addCert': '➕ Add Certification',
    'btn.phraseBank': '💡 Bullet Bank',

    // Experience
    'exp.role': 'Job Title / Role',
    'exp.company': 'Company / Institution',
    'exp.period': 'Period (e.g. Aug 2023 - Present)',
    'exp.location': 'Location',
    'exp.bullets': 'Key Achievements & Responsibilities (one per line)',

    // Projects
    'proj.title': 'Project Title',
    'proj.tech': 'Technologies (e.g. React • Node.js • PostgreSQL)',
    'proj.link': 'Link / Repository URL (Optional)',
    'proj.desc': 'Project Overview, Problem Solved & Outcome',

    // Education
    'edu.degree': 'Degree / Field of Study',
    'edu.school': 'Institution / University',
    'edu.period': 'Period (e.g. 2021 - 2025)',
    'edu.details': 'Additional Details (GPA, Honors, Focus Area)',

    // Skills
    'skills.languages': 'Programming Languages (comma-separated)',
    'skills.databases': 'Databases & SQL',
    'skills.tools': 'Frameworks, Tools & BI',
    'skills.soft': 'Core Methodologies & Competencies (e.g. Scrum, Lean)',

    // Settings
    'settings.template': 'Resume Template',
    'settings.theme': 'Color Theme',
    'settings.lang': 'Resume Section Headings Language',

    // Preview Toolbar
    'preview.title': 'LIVE PREVIEW',
    'preview.atsNotice': '✓ 100% ATS-Compliant & Downloadable in PDF',
    'preview.fit': 'Fit',

    // Bullet Bank
    'bank.modalTitle': '💡 High-Impact Achievement Bank & Action Verbs',
    'bank.searchPlaceholder': '🔍 Search keywords (e.g. SQL, automation, dashboards, Scrum, APIs)...',
    'bank.allCategories': 'All Categories',
    'bank.dev': 'Software Development & Engineering',
    'bank.data': 'Data Analytics, BI & Automation',
    'bank.maint': 'Industrial Maintenance & Operations',
    'bank.net': 'IT Support, Networks & Infrastructure',
    'bank.student': 'Academic & Engineering Projects',
    'bank.verbs': '⚡ ATS Action Verbs',
    'bank.verbsTitle': 'Top Action Verbs for ATS (click to start bullet):',
    'bank.usePhrase': '➕ Use phrase',
    'bank.noResults': 'No bullet points matched your search query.',
    'bank.close': 'Close',

    // ATS Analyzer
    'ats.title': '✨ ATS Compatibility Diagnostic',
    'ats.desc': 'Estimated score evaluating recruiter ATS algorithms (Workday, Taleo, Greenhouse, Lever).',
    'ats.understand': 'Got It',

    // Profiles Modal
    'profiles.title': '⚙️ Manage Resume Profiles',
    'profiles.desc': 'Organize profiles for different colleagues or tailor tailored CV variations for specific job applications.',
    'profiles.createNew': '➕ Create New Profile',
    'profiles.nameInput': 'Profile or Colleague Name',
    'profiles.initialTemplate': 'Initial Template',
    'profiles.createBtn': 'Create & Open Profile',
    'profiles.close': 'Close',

    // Coffee Modal
    'coffee.title': '☕ Support OpenCV Studio',
    'coffee.heroTitle': '100% Free, Offline & Open Forever',
    'coffee.heroDesc': 'OpenCV Studio was created so you and your peers never have to pay predatory subscriptions just to build and download an executive CV. If this tool helped you land interviews or saved you time, your voluntary support helps keep it thriving!',
    'coffee.buyMeBtn': '☕ Buy Me a Coffee on BuyMeACoffee',
    'coffee.clabeTitle': 'Direct Wire Transfer SPEI (Mexico)',
    'coffee.clabeDesc': 'Zero fees from any online banking app in Mexico:',
    'coffee.bank': 'Bank / Entity:',
    'coffee.beneficiary': 'Beneficiary:',
    'coffee.clabe': 'CLABE Number:',
    'coffee.copyBtn': '📋 Copy CLABE',
    'coffee.close': 'Close',

    // Extractor
    'extractor.title': '📥 Intelligent CV Extractor',
    'extractor.subtitle': 'Upload your previous CV in PDF or paste its text to automatically parse your data with AI and offline OCR.',
    'extractor.btnPdf': '📂 Select PDF File or Text Document',
    'extractor.pastePrompt': 'Or paste your entire previous CV text here:',
    'extractor.btnProcess': '🔍 Analyze & Extract Information',
    'extractor.confirmTitle': 'Would you like to create a new profile with this extracted data?',
    'extractor.saveBtn': '✓ Save as New Profile',
    'extractor.cancel': 'Cancel'
  }
};

// Encabezados de Sección Universales para Plantillas de CV
const cvSectionLabels = {
  es: {
    summary: 'RESUMEN PROFESIONAL',
    skills: 'HABILIDADES TÉCNICAS & COMPETENCIAS',
    techStack: 'Stack Técnico',
    experience: 'EXPERIENCIA LABORAL',
    projects: 'PROYECTOS TÉCNICOS DESTACADOS',
    education: 'EDUCACIÓN',
    certifications: 'CERTIFICACIONES',
    contact: 'CONTACTO',
    languages: 'Lenguajes',
    databases: 'Bases de Datos',
    tools: 'Herramientas & BI',
    softSkills: 'Competencias Clave',
    present: 'Presente',
    phone: 'Tel',
    location: 'Ubicación'
  },
  en: {
    summary: 'PROFESSIONAL SUMMARY',
    skills: 'TECHNICAL SKILLS & COMPETENCIES',
    techStack: 'Technical Stack',
    experience: 'PROFESSIONAL EXPERIENCE',
    projects: 'KEY TECHNICAL PROJECTS',
    education: 'EDUCATION',
    certifications: 'CERTIFICATIONS',
    contact: 'CONTACT',
    languages: 'Languages',
    databases: 'Databases',
    tools: 'Tools & Technologies',
    softSkills: 'Core Competencies',
    present: 'Present',
    phone: 'Phone',
    location: 'Location'
  }
};

function t(key, lang = currentLanguage) {
  const dict = translations[lang] || translations['es'];
  return dict[key] || translations['es'][key] || key;
}

function getCVLabels(lang = currentLanguage) {
  return cvSectionLabels[lang] || cvSectionLabels['es'];
}

function getCurrentLanguage() {
  return currentLanguage;
}

function setLanguage(lang) {
  if (lang !== 'es' && lang !== 'en') lang = 'es';
  currentLanguage = lang;
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('opencv_language', lang);
  }
  applyTranslations();
}

function applyTranslations(lang = currentLanguage) {
  // Traducir todos los elementos con atributo data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const text = t(key, lang);
    if (text) el.textContent = text;
  });

  // Traducir placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    const text = t(key, lang);
    if (text) el.placeholder = text;
  });

  // Traducir títulos y tooltips
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.getAttribute('data-i18n-title');
    const text = t(key, lang);
    if (text) el.title = text;
  });

  // Actualizar botones de selector de idioma
  const btnEs = document.getElementById('btnLangEs');
  const btnEn = document.getElementById('btnLangEn');
  if (btnEs && btnEn) {
    if (lang === 'es') {
      btnEs.classList.add('active');
      btnEn.classList.remove('active');
    } else {
      btnEn.classList.add('active');
      btnEs.classList.remove('active');
    }
  }

  // Notificar al controlador para actualizar previsualización si está disponible
  if (typeof updatePreview === 'function') {
    updatePreview();
  }
}

// Exportar en window para Electron y navegador
if (typeof window !== 'undefined') {
  window.i18n = {
    t,
    getCVLabels,
    getCurrentLanguage,
    setLanguage,
    applyTranslations,
    translations,
    cvSectionLabels
  };
  window.t = t;
  window.getCVLabels = getCVLabels;
  window.currentLanguage = currentLanguage;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    t,
    getCVLabels,
    getCurrentLanguage,
    setLanguage,
    applyTranslations,
    translations,
    cvSectionLabels
  };
}
