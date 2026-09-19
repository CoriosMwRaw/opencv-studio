// ==========================================================================
// OpenCV Studio — Módulo de Internacionalización (i18n)
// Soporte Completo al 100% para Español (es) e Inglés (en)
// ==========================================================================

let currentLanguage = (typeof localStorage !== 'undefined' && localStorage.getItem('opencv_language')) || 'es';

const translations = {
  es: {
    // Topbar
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
    'editor.title': '📝 Editor de Contenido',
    'editor.expandAll': '▼ Expandir',
    'editor.collapseAll': '▲ Colapsar',

    // Acordeones
    'acc.personal': 'Datos Personales y Contacto',
    'acc.summary': 'Perfil / Resumen Profesional',
    'acc.kpis': 'Métricas de Impacto (KPIs Rápidos)',
    'acc.experience': 'Experiencia Laboral',
    'acc.projects': 'Proyectos Técnicos Destacados',
    'acc.education': 'Formación Educativa',
    'acc.skills': 'Habilidades Técnicas & Stack',
    'acc.certifications': 'Certificaciones & Cursos',
    'acc.settings': 'Plantilla & Personalización',

    // Campos Personales
    'field.fullName': 'Nombre Completo',
    'field.fullNamePlaceholder': 'Nombre completo',
    'field.headline': 'Titular Profesional / Especialidad',
    'field.headlinePlaceholder': 'ej. Ingeniero de Software Junior',
    'field.phone': 'Teléfono / WhatsApp',
    'field.phonePlaceholder': 'ej. (55) 1234 5678',
    'field.email': 'Correo Electrónico',
    'field.emailPlaceholder': 'ej. correo@ejemplo.com',
    'field.location': 'Ubicación (Ciudad, Estado / País)',
    'field.locationPlaceholder': 'ej. Guadalajara, Jal., México',
    'field.linkedin': 'LinkedIn (URL o usuario)',
    'field.linkedinPlaceholder': 'https://linkedin.com/in/...',
    'field.github': 'GitHub / Portafolio Web',
    'field.githubPlaceholder': 'https://github.com/...',
    'field.badges': 'Insignias / Destacados Rápidos (uno por línea)',
    'field.badgesPlaceholder': 'ej. 🎓 7mo Semestre de Ingeniería en Sistemas\n💻 Desarrollo Web Fullstack & APIs\n🚀 Proyectos de Alto Impacto',
    'field.photo': 'Fotografía de Perfil',
    'field.uploadPhoto': '📷 Subir / Cambiar Foto',
    'field.photoCompressed': '(Auto-comprimida a 320px)',
    'field.showPhoto': 'Mostrar Foto en CV',
    'field.summary': 'Resumen Ejecutivo (35 - 85 palabras recomendadas para ATS)',
    'field.summaryPlaceholder': 'Escribe un breve resumen de tu trayectoria y competencias clave...',
    'field.summaryHelp': 'Describe tu especialidad, principales fortalezas y el valor que aportas a la empresa.',
    'field.kpiSubtitle': 'Cifras destacadas (proyectos, horas, rendimiento)',
    'field.showKpis': 'Activar Barra de KPIs',

    // Botones de Adición
    'btn.addKpi': '+ Añadir Métrica (KPI)',
    'btn.addExperience': '+ Añadir Puesto Laboral',
    'btn.addProject': '+ Añadir Proyecto',
    'btn.addEducation': '+ Añadir Formación',
    'btn.addCert': '+ Añadir Certificación',
    'btn.phraseBank': '💡 Banco de Frases',

    // Experiencia Laboral Dinámica
    'exp.role': 'Puesto o Rol',
    'exp.rolePlaceholder': 'ej. Desarrollador Frontend',
    'exp.company': 'Empresa / Institución',
    'exp.companyPlaceholder': 'ej. Tech Solutions',
    'exp.period': 'Período',
    'exp.periodPlaceholder': 'ej. Ago 2023 - Presente',
    'exp.location': 'Ubicación',
    'exp.locationPlaceholder': 'ej. Remoto / Híbrido',
    'exp.bullets': 'Logros y Responsabilidades (uno por línea)',
    'exp.delete': 'Eliminar puesto',
    'exp.newRole': 'Nuevo Puesto',
    'exp.defaultCompany': 'Empresa',
    'exp.defaultBullet': 'Diseñé e implementé una solución logrando optimizar el proceso en un X%.',

    // Proyectos Dinámicos
    'proj.title': 'Título del Proyecto',
    'proj.titlePlaceholder': 'ej. Plataforma E-Commerce',
    'proj.tech': 'Tecnologías',
    'proj.techPlaceholder': 'ej. React • Node.js • PostgreSQL',
    'proj.link': 'Enlace / Repositorio (Opcional)',
    'proj.linkPlaceholder': 'https://github.com/...',
    'proj.desc': 'Descripción del Proyecto',
    'proj.descPlaceholder': 'Descripción concisa del problema resuelto y tecnologías aplicadas.',
    'proj.delete': 'Eliminar proyecto',
    'proj.newTitle': 'Nuevo Proyecto',

    // Educación Dinámica
    'edu.degree': 'Grado / Título',
    'edu.degreePlaceholder': 'ej. Ingeniería en Sistemas Computacionales',
    'edu.school': 'Escuela / Universidad',
    'edu.schoolPlaceholder': 'ej. Universidad Tecnológica',
    'edu.period': 'Período / Semestre',
    'edu.periodPlaceholder': 'ej. 2021 – 2025',
    'edu.details': 'Detalles Adicionales',
    'edu.detailsPlaceholder': 'Promedio: 95/100, Especialidad en Software',
    'edu.delete': 'Eliminar formación',
    'edu.newDegree': 'Carrera / Bachillerato',
    'edu.defaultSchool': 'Institución Educativa',

    // KPIs Dinámicos
    'kpi.numberPlaceholder': 'Cifra (4+)',
    'kpi.labelPlaceholder': 'Etiqueta (ej. Proyectos Entregados)',
    'kpi.delete': 'Eliminar métrica',

    // Certificaciones Dinámicas
    'cert.titlePlaceholder': 'Título del Certificado o Especialidad',
    'cert.issuerPlaceholder': 'Institución / Plataforma (ej. Platzi, Cisco, Oracle)',
    'cert.yearPlaceholder': 'Año',
    'cert.delete': 'Eliminar certificación',

    // Habilidades
    'skills.languages': 'Lenguajes de Programación (separados por coma)',
    'skills.languagesPlaceholder': 'Java, Python, C++, JavaScript, PHP',
    'skills.databases': 'Bases de Datos & SQL (separados por coma)',
    'skills.databasesPlaceholder': 'MySQL, SQL Server, PostgreSQL, SQLite',
    'skills.tools': 'Herramientas, BI & Sistemas (separados por coma)',
    'skills.toolsPlaceholder': 'Git, Docker, Linux, Excel Avanzado, Power BI',
    'skills.soft': 'Habilidades Blandas / Metodologías',
    'skills.softPlaceholder': 'Scrum, Aprendizaje Autodidacta, Trabajo en Equipo',

    // Configuración & Plantillas
    'settings.template': 'Plantilla:',
    'settings.theme': 'Color:',
    'settings.lang': 'Idioma CV:',
    'tmpl.tech': '💻 Tech & Desarrollador (Sistemas)',
    'tmpl.data': '📊 Industrial & Data Analyst (Operaciones)',
    'tmpl.ats': '🤖 ATS Minimalista Clásico (Filtros)',
    'tmpl.modern': '👔 Moderna Ejecutiva (Doble Columna)',
    'theme.navy': 'Azul Ejecutivo / Tech',
    'theme.teal': 'Esmeralda Data / BI',
    'theme.indigo': 'Índigo Moderno',
    'theme.graphite': 'Grafito Minimalista',
    'preview.title': 'VISTA PREVIA EN VIVO',
    'preview.atsNotice': '✓ 100% Compatible con Filtros ATS & Descargable en PDF',
    'preview.fit': 'Ajustar',

    // Banco de Frases
    'bank.modalTitle': '💡 Banco de Frases de Impacto & Verbos de Acción',
    'bank.targetSubtitle': 'Seleccionando frase para tu experiencia',
    'bank.searchPlaceholder': '🔍 Buscar frases clave (ej. SQL, automatización, dashboards, Scrum, Kaizen)...',
    'bank.allCategories': 'Todas las categorías',
    'bank.catDev': 'Desarrollo de Software',
    'bank.catData': 'Análisis de Datos & BI',
    'bank.catMaint': 'Mantenimiento Industrial',
    'bank.catNet': 'Redes & Soporte TI',
    'bank.catStudent': 'Proyectos Universitarios',
    'bank.catVerbs': '⚡ Verbos de Acción ATS',
    'bank.instructions': 'Haz clic en cualquier frase o verbo para insertarlo directamente en los logros de este puesto de trabajo.',
    'bank.verbsTitle': 'Verbos de Acción Recomendados para ATS (clic para iniciar frase):',
    'bank.usePhrase': '➕ Usar frase',
    'bank.noResults': 'No encontramos frases que coincidan con tu búsqueda.',
    'bank.phrasesCount': 'frases',
    'bank.close': 'Cerrar',

    // Analizador ATS
    'ats.title': '✨ Diagnóstico de Compatibilidad ATS',
    'ats.desc': 'Puntuación estimada de aprobación ante filtros automáticos de recursos humanos (ATS) y reclutadores técnicos.',
    'ats.evaluating': 'Evaluando...',
    'ats.understand': 'Entendido',

    // Modal Perfiles
    'profiles.title': '⚙️ Administrar Perfiles de Currículum',
    'profiles.desc': 'Gestiona perfiles para diferentes compañeros o crea variantes especializadas para cada postulación.',
    'profiles.createNew': '➕ Crear Nuevo Perfil',
    'profiles.nameInput': 'Nombre del Perfil o Compañero',
    'profiles.namePlaceholder': 'ej. María González (Prácticas)',
    'profiles.initialTemplate': 'Plantilla Inicial',
    'profiles.createBtn': 'Crear y Abrir Perfil',
    'profiles.activeBadge': 'Activo',
    'profiles.headlineLabel': 'Titular:',
    'profiles.templateLabel': 'Plantilla:',
    'profiles.useBtn': 'Usar',
    'profiles.duplicateBtn': '📑 Duplicar',
    'profiles.deleteBtn': '🗑️ Eliminar',
    'profiles.close': 'Cerrar',

    // Modal Café & Donación
    'coffee.title': '☕ Apoya el Proyecto OpenCV Studio',
    'coffee.heroTitle': '100% Libre, Offline y Gratuito de por vida',
    'coffee.heroDesc': 'OpenCV Studio nació para que tú y tus compañeros nunca tengan que pagar suscripciones abusivas por crear y descargar su CV. Si esta herramienta te ayudó a conseguir empleo o te ahorró tiempo, ¡tu apoyo voluntario permite seguir manteniéndola y mejorándola!',
    'coffee.buyMeTitle': '💛 Donación Digital Internacional',
    'coffee.paymentMethods': 'Tarjeta / PayPal',
    'coffee.buyMeDesc': 'Invítame un café directamente a través de Buy Me a Coffee de forma rápida y segura:',
    'coffee.buyMeBtn': '☕ Donar un café en BuyMeACoffee.com',
    'coffee.clabeTitle': '🏦 Transferencia Directa SPEI (México)',
    'coffee.noFees': 'Sin comisiones',
    'coffee.clabeDesc': 'Si estás en México, puedes aportar mediante transferencia directa desde cualquier aplicación bancaria:',
    'coffee.bankLabel': 'Banco / Institución:',
    'coffee.beneficiaryLabel': 'Beneficiario:',
    'coffee.clabeLabel': 'CLABE Interbancaria:',
    'coffee.copyBtn': '📋 Copiar CLABE',
    'coffee.close': 'Cerrar',

    // Extractor de CVs
    'extractor.title': '📥 Extraer Información de CV Existente',
    'extractor.subtitle': '¿Ya tienes tu currículum en PDF, Word o LinkedIn? No empieces desde cero: sube tu PDF directamente, o pega el texto y nuestro analizador inteligente organizará tu información en un nuevo perfil de OpenCV Studio.',
    'extractor.pastePrompt': 'Pega el texto o carga tu archivo:',
    'extractor.btnPdf': '📄 Cargar CV en PDF',
    'extractor.btnOther': '📁 Otro (.txt / .json)',
    'extractor.pastePlaceholder': 'Selecciona todo el texto de tu CV actual (Ctrl+A y luego Ctrl+C en tu PDF o Word) y pégalo aquí con Ctrl+V...',
    'extractor.btnProcess': '⚡ Analizar y Detectar Campos',
    'extractor.btnClear': 'Limpiar',
    'extractor.summaryTitle': '✨ Resumen de Información Detectada:',
    'extractor.nameLabel': 'Nombre del Perfil a Crear',
    'extractor.namePlaceholder': 'Nombre para este perfil',
    'extractor.templateLabel': 'Plantilla Deseada',
    'extractor.saveBtn': '✅ Crear y Abrir este Perfil en el Editor',
    'extractor.close': 'Cerrar',
    'extractor.eduDetected': 'Educación: {n} detectada(s)',
    'extractor.skillsExtracted': 'Habilidades: {n} extraída(s)',
    'extractor.projDetected': 'Proyectos: {n} detectado(s)',
    'extractor.langDetected': 'Idiomas: {n} detectado(s)',
    'extractor.positionsFound': 'Puestos encontrados:',

    // Diálogos del Sistema
    'dialog.cancel': 'Cancelar',
    'dialog.ok': 'Entendido',
    'dialog.confirm': 'Aceptar',
    'dialog.yesDelete': 'Sí, Eliminar',
    'dialog.notice': 'Aviso',
    'dialog.profileCreated': 'Perfil creado:',
    'dialog.candidate': 'Candidato:',
    'dialog.headline': 'Titular:',
    'dialog.activeTemplate': 'Plantilla activa:'
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
    'topbar.pdf': '🖨️ Export to PDF',
    'topbar.fullscreen': 'Toggle Full Screen (F11)',
    'topbar.coffee': '☕ Buy Me a Coffee',

    // Sidebar Editor
    'editor.title': '📝 Content Editor',
    'editor.expandAll': '▼ Expand All',
    'editor.collapseAll': '▲ Collapse All',

    // Accordions
    'acc.personal': 'Personal Details & Contact',
    'acc.summary': 'Professional Profile & Summary',
    'acc.kpis': 'Impact Metrics (Quick KPIs)',
    'acc.experience': 'Work Experience',
    'acc.projects': 'Featured Technical Projects',
    'acc.education': 'Education',
    'acc.skills': 'Technical Skills & Stack',
    'acc.certifications': 'Certifications & Courses',
    'acc.settings': 'Template & Customization',

    // Personal Fields
    'field.fullName': 'Full Name',
    'field.fullNamePlaceholder': 'Full name',
    'field.headline': 'Professional Title / Specialty',
    'field.headlinePlaceholder': 'e.g. Junior Software Engineer',
    'field.phone': 'Phone / WhatsApp',
    'field.phonePlaceholder': 'e.g. +1 (555) 123-4567',
    'field.email': 'Email Address',
    'field.emailPlaceholder': 'e.g. email@example.com',
    'field.location': 'Location (City, State / Country)',
    'field.locationPlaceholder': 'e.g. San Francisco, CA, USA',
    'field.linkedin': 'LinkedIn (URL or username)',
    'field.linkedinPlaceholder': 'https://linkedin.com/in/...',
    'field.github': 'GitHub / Web Portfolio',
    'field.githubPlaceholder': 'https://github.com/...',
    'field.badges': 'Badges / Key Highlights (one per line)',
    'field.badgesPlaceholder': 'e.g. 🎓 B.S. in Computer Science\n💻 Fullstack Web Development & APIs\n🚀 High-Impact Engineering Projects',
    'field.photo': 'Profile Photo',
    'field.uploadPhoto': '📷 Upload / Change Photo',
    'field.photoCompressed': '(Auto-compressed to 320px)',
    'field.showPhoto': 'Show Photo on Resume',
    'field.summary': 'Executive Summary (35 - 85 words recommended for ATS)',
    'field.summaryPlaceholder': 'Write a concise summary highlighting your expertise and target value proposition...',
    'field.summaryHelp': 'Highlight your core expertise, key technical achievements, and target value proposition.',
    'field.kpiSubtitle': 'Key figures (projects, hours, performance metrics)',
    'field.showKpis': 'Enable KPI Bar',

    // Addition Buttons
    'btn.addKpi': '+ Add Metric (KPI)',
    'btn.addExperience': '+ Add Work Experience',
    'btn.addProject': '+ Add Project',
    'btn.addEducation': '+ Add Education',
    'btn.addCert': '+ Add Certification',
    'btn.phraseBank': '💡 Bullet Bank',

    // Dynamic Work Experience
    'exp.role': 'Job Title / Role',
    'exp.rolePlaceholder': 'e.g. Frontend Developer',
    'exp.company': 'Company / Institution',
    'exp.companyPlaceholder': 'e.g. Tech Solutions',
    'exp.period': 'Period',
    'exp.periodPlaceholder': 'e.g. Aug 2023 - Present',
    'exp.location': 'Location',
    'exp.locationPlaceholder': 'e.g. Remote / Hybrid',
    'exp.bullets': 'Key Achievements & Responsibilities (one per line)',
    'exp.delete': 'Delete position',
    'exp.newRole': 'New Position',
    'exp.defaultCompany': 'Company',
    'exp.defaultBullet': 'Engineered and deployed a solution optimizing system workflow by X%.',

    // Dynamic Projects
    'proj.title': 'Project Title',
    'proj.titlePlaceholder': 'e.g. E-Commerce Platform',
    'proj.tech': 'Technologies',
    'proj.techPlaceholder': 'e.g. React • Node.js • PostgreSQL',
    'proj.link': 'Link / Repository (Optional)',
    'proj.linkPlaceholder': 'https://github.com/...',
    'proj.desc': 'Project Description',
    'proj.descPlaceholder': 'Concise description of the problem solved and architecture built.',
    'proj.delete': 'Delete project',
    'proj.newTitle': 'New Project',

    // Dynamic Education
    'edu.degree': 'Degree / Field of Study',
    'edu.degreePlaceholder': 'e.g. B.S. in Computer Science',
    'edu.school': 'School / University',
    'edu.schoolPlaceholder': 'e.g. State University',
    'edu.period': 'Period / Graduation Year',
    'edu.periodPlaceholder': 'e.g. 2021 – 2025',
    'edu.details': 'Additional Details',
    'edu.detailsPlaceholder': 'GPA: 3.8/4.0, Focus in Artificial Intelligence',
    'edu.delete': 'Delete education',
    'edu.newDegree': 'Degree / Program',
    'edu.defaultSchool': 'Educational Institution',

    // Dynamic KPIs
    'kpi.numberPlaceholder': 'Figure (4+)',
    'kpi.labelPlaceholder': 'Label (e.g. Completed Projects)',
    'kpi.delete': 'Delete metric',

    // Dynamic Certifications
    'cert.titlePlaceholder': 'Certificate Title or Specialization',
    'cert.issuerPlaceholder': 'Issuer / Platform (e.g. AWS, Cisco, Coursera)',
    'cert.yearPlaceholder': 'Year',
    'cert.delete': 'Delete certification',

    // Skills
    'skills.languages': 'Programming Languages (comma-separated)',
    'skills.languagesPlaceholder': 'Python, TypeScript, Go, Java, C++',
    'skills.databases': 'Databases & SQL (comma-separated)',
    'skills.databasesPlaceholder': 'PostgreSQL, MySQL, MongoDB, Redis',
    'skills.tools': 'Tools, BI & Frameworks (comma-separated)',
    'skills.toolsPlaceholder': 'Docker, Kubernetes, Git, AWS, Power BI',
    'skills.soft': 'Core Competencies & Methodologies',
    'skills.softPlaceholder': 'Scrum, Agile, Problem Solving, Leadership',

    // Settings & Templates
    'settings.template': 'Template:',
    'settings.theme': 'Color:',
    'settings.lang': 'Resume Language:',
    'tmpl.tech': '💻 Tech & Software Developer (IT)',
    'tmpl.data': '📊 Industrial & Data Analyst (BI/Ops)',
    'tmpl.ats': '🤖 Classic Minimalist ATS (Robots)',
    'tmpl.modern': '👔 Modern Executive (Two Columns)',
    'theme.navy': 'Navy Executive / Tech',
    'theme.teal': 'Teal Data / BI',
    'theme.indigo': 'Modern Indigo',
    'theme.graphite': 'Minimal Graphite',
    'preview.title': 'LIVE PREVIEW',
    'preview.atsNotice': '✓ 100% ATS-Compliant & Downloadable in PDF',
    'preview.fit': 'Fit',

    // Bullet Bank
    'bank.modalTitle': '💡 High-Impact Bullet Bank & Action Verbs',
    'bank.targetSubtitle': 'Selecting bullet for your experience',
    'bank.searchPlaceholder': '🔍 Search keywords (e.g. SQL, automation, dashboards, Scrum, APIs)...',
    'bank.allCategories': 'All Categories',
    'bank.catDev': 'Software Development',
    'bank.catData': 'Data Analytics & BI',
    'bank.catMaint': 'Industrial Maintenance',
    'bank.catNet': 'IT Networks & Support',
    'bank.catStudent': 'Academic Projects',
    'bank.catVerbs': '⚡ ATS Action Verbs',
    'bank.instructions': 'Click any phrase or verb to insert it directly into this position achievements.',
    'bank.verbsTitle': 'Recommended Action Verbs for ATS (click to start bullet):',
    'bank.usePhrase': '➕ Use phrase',
    'bank.noResults': 'No bullets matched your search query.',
    'bank.phrasesCount': 'bullets',
    'bank.close': 'Close',

    // ATS Analyzer
    'ats.title': '✨ ATS Compatibility Diagnostic',
    'ats.desc': 'Estimated pass rate evaluating recruiter applicant tracking systems (ATS) and technical screenings.',
    'ats.evaluating': 'Evaluating...',
    'ats.understand': 'Got It',

    // Profiles Modal
    'profiles.title': '⚙️ Manage Resume Profiles',
    'profiles.desc': 'Organize profiles for colleagues or tailor targeted CV variations for specific job applications.',
    'profiles.createNew': '➕ Create New Profile',
    'profiles.nameInput': 'Profile or Colleague Name',
    'profiles.namePlaceholder': 'e.g. Jane Doe (Tech Lead)',
    'profiles.initialTemplate': 'Initial Template',
    'profiles.createBtn': 'Create & Open Profile',
    'profiles.activeBadge': 'Active',
    'profiles.headlineLabel': 'Headline:',
    'profiles.templateLabel': 'Template:',
    'profiles.useBtn': 'Use',
    'profiles.duplicateBtn': '📑 Duplicate',
    'profiles.deleteBtn': '🗑️ Delete',
    'profiles.close': 'Close',

    // Coffee / Donation Modal
    'coffee.title': '☕ Support OpenCV Studio',
    'coffee.heroTitle': '100% Free, Offline & Open Forever',
    'coffee.heroDesc': 'OpenCV Studio was created so you and your peers never have to pay predatory subscriptions just to build and download an executive CV. If this tool helped you land interviews or saved you time, your voluntary support helps keep it thriving!',
    'coffee.buyMeTitle': '💛 International Digital Support',
    'coffee.paymentMethods': 'Credit Card / PayPal',
    'coffee.buyMeDesc': 'Buy me a coffee directly through Buy Me a Coffee quickly and securely:',
    'coffee.buyMeBtn': '☕ Buy Me a Coffee on BuyMeACoffee.com',
    'coffee.clabeTitle': '🏦 Direct Wire Transfer SPEI (Mexico)',
    'coffee.noFees': 'Zero fees',
    'coffee.clabeDesc': 'If you are in Mexico, you can donate via direct bank transfer from any banking app:',
    'coffee.bankLabel': 'Bank / Institution:',
    'coffee.beneficiaryLabel': 'Beneficiary:',
    'coffee.clabeLabel': 'CLABE Number:',
    'coffee.copyBtn': '📋 Copy CLABE',
    'coffee.close': 'Close',

    // CV Extractor
    'extractor.title': '📥 Extract Information from Existing CV',
    'extractor.subtitle': 'Already have your resume in PDF, Word, or LinkedIn? Do not start from scratch: upload your PDF directly, or paste the text and our smart engine will structure your data into a fresh OpenCV Studio profile.',
    'extractor.pastePrompt': 'Paste text or upload your file:',
    'extractor.btnPdf': '📄 Load PDF Resume',
    'extractor.btnOther': '📁 Other (.txt / .json)',
    'extractor.pastePlaceholder': 'Select all text from your current CV (Ctrl+A then Ctrl+C) and paste it here with Ctrl+V...',
    'extractor.btnProcess': '⚡ Analyze & Extract Fields',
    'extractor.btnClear': 'Clear',
    'extractor.summaryTitle': '✨ Detected Information Summary:',
    'extractor.nameLabel': 'Profile Name to Create',
    'extractor.namePlaceholder': 'Name for this profile',
    'extractor.templateLabel': 'Desired Template',
    'extractor.saveBtn': '✅ Create & Open this Profile in Editor',
    'extractor.close': 'Close',
    'extractor.eduDetected': 'Education: {n} detected',
    'extractor.skillsExtracted': 'Skills: {n} extracted',
    'extractor.projDetected': 'Projects: {n} detected',
    'extractor.langDetected': 'Languages: {n} detected',
    'extractor.positionsFound': 'Positions found:',

    // System Dialogs
    'dialog.cancel': 'Cancel',
    'dialog.ok': 'Got It',
    'dialog.confirm': 'Confirm',
    'dialog.yesDelete': 'Yes, Delete',
    'dialog.notice': 'Notice',
    'dialog.profileCreated': 'Profile created:',
    'dialog.candidate': 'Candidate:',
    'dialog.headline': 'Headline:',
    'dialog.activeTemplate': 'Active template:'
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
    education: 'FORMACIÓN ACADÉMICA',
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
  return dict[key] || (translations['es'] && translations['es'][key]) || key;
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
  // 1. Traducir todos los elementos con atributo data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const text = t(key, lang);
    if (text) el.textContent = text;
  });

  // 2. Traducir placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    const text = t(key, lang);
    if (text) el.placeholder = text;
  });

  // 3. Traducir títulos y tooltips
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.getAttribute('data-i18n-title');
    const text = t(key, lang);
    if (text) el.title = text;
  });

  // 4. Actualizar botones de selector de idioma
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

  // 5. Actualizar atributo lang del documento html
  if (document.documentElement) {
    document.documentElement.lang = lang;
  }

  // 6. Actualizar selector de idioma de plantilla si existe
  const selectCvLang = document.getElementById('select_cv_lang');
  if (selectCvLang) {
    selectCvLang.value = lang;
  }

  // 7. Notificar al controlador para actualizar previsualización SOLO si currentProfile está cargado
  if (typeof updatePreview === 'function' && typeof currentProfile !== 'undefined' && currentProfile) {
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
