// ==========================================================================
// OpenCV Studio - Perfiles y Plantillas de Ejemplo (Open Source)
// ==========================================================================

const sampleProfiles = {
  "estudiante_sistemas": {
    id: "estudiante_sistemas",
    name: "Estudiante de Ingeniería en Sistemas / TI",
    personal: {
      fullName: "ALEJANDRO NAVARRO RÍOS",
      headline: "ESTUDIANTE DE INGENIERÍA EN SISTEMAS | DESARROLLADOR DE SOFTWARE JUNIOR",
      phone: "(55) 4123 4567",
      email: "alejandro.navarro@email.com",
      location: "Guadalajara, Jalisco, México",
      linkedin: "https://linkedin.com/in/usuario-ejemplo",
      github: "https://github.com/usuario-ejemplo",
      website: "",
      photoUrl: "assets/default_avatar.svg",
      badges: [
        "🎓 7mo Semestre de Ingeniería en Sistemas",
        "💻 Desarrollo Web Fullstack & APIs",
        "🚀 Proyectos Universitarios Prácticos",
        "🤝 Metodologías Ágiles (Scrum)"
      ]
    },
    summary: "Estudiante entusiasta de 7mo semestre de Ingeniería en Sistemas Computacionales con sólida formación técnica en arquitectura de software, bases de datos y desarrollo web. Orientado a la resolución analítica de problemas mediante código limpio y buenas prácticas. Apasionado por aprender tecnologías modernas y colaborar en equipos multidisciplinarios.",
    kpis: [
      { number: "4+", label: "Proyectos de Software Completados" },
      { number: "3+", label: "Bases de Datos Relacionales" },
      { number: "100%", label: "Compromiso y Aprendizaje Rápido" },
      { number: "B2", label: "Nivel de Inglés Técnico" }
    ],
    experience: [
      {
        id: "exp_1",
        role: "Practicante / Desarrollador de Software en Residencia",
        company: "TechNova Soluciones Digitales",
        period: "Enero 2025 – Presente",
        location: "Guadalajara, Jal.",
        bullets: [
          "Diseñé y programé módulos de registro, autenticación y consulta de clientes utilizando Java, Spring Boot y MySQL bajo arquitectura MVC.",
          "Automaticé procesos de exportación de reportes y facturación en formatos PDF y Excel, reduciendo el tiempo de generación en un 60%.",
          "Colaboré activamente en sprints semanales bajo metodología Scrum, documentando endpoints con Swagger y versionando código con Git/GitHub.",
          "Ejecuté pruebas unitarias e integración para asegurar confiabilidad y prevenir regresiones en entornos de staging."
        ]
      },
      {
        id: "exp_2",
        role: "Asistente Técnico de TI & Soporte de Sistemas",
        company: "Laboratorio de Cómputo Universitario",
        period: "Agosto 2023 – Diciembre 2024",
        location: "Campus Universitario",
        bullets: [
          "Brindé soporte preventivo y correctivo a más de 45 equipos de cómputo en red, optimizando los tiempos de disponibilidad del aula.",
          "Configuré políticas de acceso, cuentas de usuario y segmentación básica de red en entornos Windows y Linux (Ubuntu).",
          "Asesoré a docentes y alumnos en la configuración de entornos de programación y software especializado."
        ]
      }
    ],
    projects: [
      {
        id: "proj_1",
        title: "Sistema Integral de Control Escolar y Calificaciones",
        tech: "Java • MySQL • Hibernate • NetBeans",
        link: "https://github.com/usuario-ejemplo/control-escolar",
        description: "Aplicación de escritorio con roles de acceso (Administrador, Docente, Alumno), cálculo automático de promedios, generación de boletas y reportería estadística."
      },
      {
        id: "proj_2",
        title: "Plataforma Web de Punto de Venta e Inventarios",
        tech: "PHP • JavaScript • HTML5 / CSS3 • SQLite",
        link: "https://github.com/usuario-ejemplo/pos-sistema",
        description: "Sistema responsivo con catálogo de productos, control de stock en tiempo real, corte de caja y alertas automáticas de reabastecimiento."
      }
    ],
    education: [
      {
        id: "edu_1",
        degree: "Ingeniería en Sistemas Computacionales",
        school: "Instituto Tecnológico / Universidad Tecnológica",
        period: "2022 – 2026 (En Curso)",
        details: "Especialidad en Desarrollo de Software y Tecnologías Web. Promedio destacado."
      },
      {
        id: "edu_2",
        degree: "Bachillerato Técnico en Informática / Programación",
        school: "Colegio de Educación Profesional Técnica",
        period: "2019 – 2022",
        details: "Titulado con honores. Bases sólidas en algoritmos y redes de datos."
      }
    ],
    skills: {
      languages: ["Java", "JavaScript", "Python", "PHP", "C++", "HTML5 / CSS3", "VBA"],
      databases: ["MySQL", "SQL Server", "PostgreSQL", "SQLite", "Modelado E-R"],
      tools: ["Git & GitHub", "VS Code", "NetBeans", "Postman", "Linux", "Excel Avanzado"],
      softSkills: ["Aprendizaje Autodidacta", "Pensamiento Analítico", "Trabajo en Equipo", "Metodologías Ágiles", "Resolución de Problemas"]
    },
    certifications: [
      { title: "Especialización en Desarrollo Backend con Java", issuer: "Oracle / Platzi", year: "2024" },
      { title: "Fundamentos de Redes y Conectividad", issuer: "Cisco Networking Academy", year: "2023" }
    ],
    settings: {
      template: "tech",
      colorTheme: "navy",
      showPhoto: true,
      showKpis: true,
      fontFamily: "Plus Jakarta Sans"
    }
  },

  "harvard_executive": {
    id: "harvard_executive",
    name: "Líder de Proyectos & Gestión de Negocios (Harvard Classic)",
    personal: {
      fullName: "EDUARDO MONTERO VILLARREAL",
      headline: "PROJECT MANAGER & CONSULTOR DE NEGOCIOS | MBA • SCRUM MASTER • LEAN",
      phone: "(55) 7654 3210",
      email: "eduardo.montero@consulting.com",
      location: "Ciudad de México / Híbrido",
      linkedin: "https://linkedin.com/in/eduardo-montero-pm",
      github: "https://github.com/eduardo-montero",
      website: "",
      photoUrl: "assets/default_avatar.svg",
      badges: [
        "🎯 Certificado PMP® & Scrum Master",
        "💼 +6 Años Liderando Equipos de Alto Rendimiento",
        "📈 Optimización de Procesos & Metodología OKR",
        "🌐 Gestión de Proyectos Regionales LATAM"
      ]
    },
    summary: "Project Manager y Consultor Estratégico con más de 6 años de experiencia liderando iniciativas de transformación digital, optimización operativa y entrega ágil de productos tecnológicos en empresas de servicios financieros y consultoría. Experto en alineación entre objetivos de negocio y ejecución técnica mediante marcos Scrum, Kanban y PMBOK. Capacidad probada para gestionar presupuestos superiores a $1.2M USD y coordinar equipos multidisciplinarios remotos.",
    kpis: [
      { number: "95%", label: "Entregas en Tiempo y Presupuesto" },
      { number: "$1.4M", label: "Presupuesto Administrado Anual" },
      { number: "+22%", label: "Incremento en Productividad de Sprints" },
      { number: "C1", label: "Nivel de Inglés Avanzado (Negocios)" }
    ],
    experience: [
      {
        id: "exp_h1",
        role: "Senior Project Manager & Consultor de Negocios",
        company: "Vanguardia Estratégica Consultores",
        period: "Marzo 2022 – Presente",
        location: "Ciudad de México",
        bullets: [
          "Lideré la implementación de una plataforma omnicanal de atención al cliente para una institución bancaria regional, reduciendo tiempos de respuesta en un 38%.",
          "Gestioné un portafolio de 5 proyectos simultáneos coordinando a 24 profesionales entre desarrolladores, diseñadores UX y analistas de negocio.",
          "Establecí marcos de gobernanza ágil (Scrum de Scrums) y tableros de control ejecutivos en Jira y Power BI, elevando la visibilidad del avance al comité directivo.",
          "Negocié contratos de servicios con proveedores tecnológicos clave, logrando un ahorro de costos operativos anuales de $85,000 USD."
        ]
      },
      {
        id: "exp_h2",
        role: "Project Manager Jr. & Analista de Procesos",
        company: "Grupo Financiero Atlas",
        period: "Enero 2019 – Febrero 2022",
        location: "Ciudad de México",
        bullets: [
          "Diseñé y documenté flujos de trabajo operativos bajo estándar BPMN para automatizar procesos de validación de créditos comerciales.",
          "Facilité ceremonias ágiles (Daily, Sprint Planning, Retrospectivas) para 2 squads de ingeniería de software con entregas quincenales continuas.",
          "Capacité a más de 120 usuarios internos en la adopción de nuevas herramientas de colaboración en la nube."
        ]
      }
    ],
    projects: [
      {
        id: "proj_h1",
        title: "Automatización de Conciliación Financiera y Gobierno de Datos",
        tech: "Power BI • Python • SQL • Azure Cloud",
        link: "",
        description: "Iniciativa estratégica que reemplazó reportes manuales en hojas de cálculo por una arquitectura de datos automatizada con controles de auditoría Sarbanes-Oxley (SOX)."
      }
    ],
    education: [
      {
        id: "edu_h1",
        degree: "Maestría en Administración de Negocios (MBA)",
        school: "Instituto Panamericano de Alta Dirección de Empresa (IPADE)",
        period: "2020 – 2022",
        details: "Concentración en Estrategia Corporativa y Gestión de Operaciones. Graduado con mención de excelencia."
      },
      {
        id: "edu_h2",
        degree: "Licenciatura en Administración y Dirección de Empresas",
        school: "Universidad Nacional Autónoma de México (UNAM)",
        period: "2014 – 2018",
        details: "Titulado con honores. Presidente de la Sociedad de Alumnos de la Facultad de Contaduría y Administración."
      }
    ],
    skills: {
      languages: ["Español (Nativo)", "Inglés (C1 Avanzado)", "Portugués (Intermedio)"],
      databases: ["SQL para Negocios", "Power Query", "Data Warehouse"],
      tools: ["Jira Software", "Confluence", "Microsoft Project", "SAP ERP", "Power BI", "Tableau", "Miro"],
      softSkills: ["Liderazgo Estratégico", "Negociación con C-Level", "Gestión del Cambio", "Resolución de Conflictos", "Comunicación Ejecutiva"]
    },
    certifications: [
      { title: "Project Management Professional (PMP®)", issuer: "Project Management Institute (PMI)", year: "2023" },
      { title: "Professional Scrum Master I (PSM I)", issuer: "Scrum.org", year: "2022" },
      { title: "Lean Six Sigma Green Belt", issuer: "International Six Sigma Institute", year: "2021" }
    ],
    settings: {
      template: "harvard",
      colorTheme: "crimson",
      showPhoto: false,
      showKpis: true,
      fontFamily: "Times New Roman"
    }
  },

  "desarrollador_web": {
    id: "desarrollador_web",
    name: "Desarrollador Web Fullstack (Frontend / Backend)",
    personal: {
      fullName: "VALERIA MENDOZA SOTO",
      headline: "DESARROLLADORA WEB FULLSTACK | REACT • NODE.JS • SQL",
      phone: "(33) 9876 5432",
      email: "valeria.mendoza@email.com",
      location: "Zapopan, Jalisco, México",
      linkedin: "https://linkedin.com/in/valeria-dev",
      github: "https://github.com/valeria-dev",
      website: "https://valeria-portfolio.dev",
      photoUrl: "assets/default_avatar.svg",
      badges: [
        "⚛️ React & Node.js Developer",
        "🌐 APIs RESTful & Cloud Ready",
        "⚡ Rendimiento & UI/UX Moderna",
        "📱 Diseño Responsivo & Accesible"
      ]
    },
    summary: "Desarrolladora Web Fullstack con pasión por construir aplicaciones web modernas, intuitivas y de alto rendimiento. Especializada en React para el frontend y Node.js/Express para servicios backend, con amplia experiencia en diseño y consumo de APIs RESTful y bases de datos relacionales y NoSQL. Enfoque en código limpio, pruebas automatizadas y accesibilidad web.",
    kpis: [
      { number: "10+", label: "Aplicaciones Web Desplegadas" },
      { number: "98%", label: "Puntuación Lighthouse en Performance" },
      { number: "2 Años", label: "Experiencia en Proyectos Ágiles" },
      { number: "Avanzado", label: "Nivel de Inglés Profesional" }
    ],
    experience: [
      {
        id: "exp_web_1",
        role: "Desarrolladora Web Frontend Junior",
        company: "PixelForge Studio",
        period: "Julio 2024 – Presente",
        location: "Remoto / Híbrido",
        bullets: [
          "Desarrollé interfaces interactivas con React, TypeScript y Tailwind CSS, reduciendo el tiempo de carga en un 35%.",
          "Implementé manejo de estado global con Redux Toolkit y consumo de endpoints mediante React Query.",
          "Garanticé diseño adaptable para múltiples resoluciones y compatibilidad total entre navegadores modernos."
        ]
      }
    ],
    projects: [
      {
        id: "proj_web_1",
        title: "E-Commerce Plataforma de Reservaciones y Pagos",
        tech: "React • Node.js • Express • PostgreSQL • Stripe API",
        link: "https://github.com/valeria-dev/ecommerce-app",
        description: "Tienda en línea completa con pasarela de pagos segura, carrito de compras reactivo, panel de administración para productos y facturación automática."
      }
    ],
    education: [
      {
        id: "edu_web_1",
        degree: "Licenciatura en Tecnologías de Información",
        school: "Universidad de Guadalajara (UdeG)",
        period: "2021 – 2025",
        details: "Especialidad en Ingeniería Web y Experiencia de Usuario."
      }
    ],
    skills: {
      languages: ["JavaScript (ES6+)", "TypeScript", "HTML5", "CSS3 / Sass", "SQL", "Python"],
      databases: ["PostgreSQL", "MongoDB", "MySQL", "Firebase"],
      tools: ["React", "Node.js", "Express", "Tailwind CSS", "Git", "Docker", "Figma"],
      softSkills: ["Comunicación Efectiva", "Atención al Detalle", "Creatividad", "Trabajo Remoto"]
    },
    certifications: [
      { title: "Meta Certified Frontend Developer", issuer: "Coursera / Meta", year: "2024" }
    ],
    settings: {
      template: "modern",
      colorTheme: "indigo",
      showPhoto: true,
      showKpis: true,
      fontFamily: "Plus Jakarta Sans"
    }
  },

  "analista_datos": {
    id: "analista_datos",
    name: "Analista de Datos & Business Intelligence (BI)",
    personal: {
      fullName: "CARLOS EDUARDO SILVA",
      headline: "ANALISTA DE DATOS & BUSINESS INTELLIGENCE | POWER BI • SQL • EXCEL AVANZADO",
      phone: "(81) 1234 8765",
      email: "carlos.silva.bi@email.com",
      location: "Monterrey, Nuevo León / Remoto",
      linkedin: "https://linkedin.com/in/carlos-silva-data",
      github: "https://github.com/carlos-silva-data",
      website: "",
      photoUrl: "assets/default_avatar.svg",
      badges: [
        "📊 Power BI & Dashboards KPIs",
        "🔍 Consultas Complejas SQL",
        "📈 Modelado Estadístico & ETL",
        "⚙️ Automatización de Reportes"
      ]
    },
    summary: "Analista de Datos con enfoque en transformar grandes volúmenes de información en tableros dinámicos e insights estratégicos para la toma de decisiones. Experto en modelado de datos en Power BI (DAX), extracción y limpieza mediante SQL y automatización de reportes operativos.",
    kpis: [
      { number: "25+", label: "Dashboards Ejecutivos Creados" },
      { number: "40 hrs", label: "Ahorro Mensual en Captura Manual" },
      { number: "3 Plantas", label: "Monitoreo Operativo Centralizado" },
      { number: "+2 Años", label: "Experiencia en Analítica y BI" }
    ],
    experience: [
      {
        id: "exp_data_1",
        role: "Analista de Datos y Operaciones",
        company: "Grupo Industrial Vanguardia",
        period: "Septiembre 2023 – Presente",
        location: "Monterrey, N.L.",
        bullets: [
          "Diseñé y automaticé tableros de control en Power BI para el seguimiento en tiempo real de indicadores clave de producción y mermas.",
          "Escribí consultas SQL avanzadas para extracción, limpieza y transformación (ETL) de datos provenientes de sistemas ERP.",
          "Implementé análisis de causa raíz y diagramas de Pareto para reducir fallas operativas recurrentes en un 18%."
        ]
      }
    ],
    projects: [
      {
        id: "proj_data_1",
        title: "Tablero Central de Control de Confiabilidad y Productividad",
        tech: "Power BI • DAX • SQL Server • Excel Macros",
        link: "",
        description: "Dashboard interactivo para gerencia con alertas automáticas de desviación presupuestal, proyección de metas y seguimiento por departamento."
      }
    ],
    education: [
      {
        id: "edu_data_1",
        degree: "Ingeniería Industrial y de Sistemas",
        school: "Tecnológico de Monterrey (ITESM)",
        period: "2020 – 2024",
        details: "Graduado con mención en Optimización de Procesos y Analítica."
      }
    ],
    skills: {
      languages: ["SQL", "Python (Pandas / Matplotlib)", "DAX", "VBA / Macros"],
      databases: ["SQL Server", "MySQL", "PostgreSQL"],
      tools: ["Power BI", "Excel Avanzado", "Power Query", "Tableau", "Git"],
      softSkills: ["Pensamiento Crítico", "Narrativa de Datos (Storytelling)", "Orientación a Negocio"]
    },
    certifications: [
      { title: "Microsoft Certified: Power BI Data Analyst Associate (PL-300)", issuer: "Microsoft", year: "2024" }
    ],
    settings: {
      template: "data",
      colorTheme: "teal",
      showPhoto: false,
      showKpis: true,
      fontFamily: "Plus Jakarta Sans"
    }
  },

  "perfil_en_blanco": {
    id: "perfil_en_blanco",
    name: "Plantilla en Blanco (Crear desde cero)",
    personal: {
      fullName: "TU NOMBRE COMPLETO",
      headline: "TU PROFESIÓN O TITULAR LABORAL",
      phone: "Teléfono / WhatsApp",
      email: "correo@ejemplo.com",
      location: "Ciudad, Estado, País",
      linkedin: "",
      github: "",
      website: "",
      photoUrl: "assets/default_avatar.svg",
      badges: []
    },
    summary: "Escribe aquí tu perfil profesional destacando tus fortalezas, años de experiencia o estudios, y qué valor aportas a la empresa.",
    kpis: [],
    experience: [],
    projects: [],
    education: [],
    skills: {
      languages: [],
      databases: [],
      tools: [],
      softSkills: []
    },
    certifications: [],
    settings: {
      template: "harvard",
      colorTheme: "crimson",
      showPhoto: false,
      showKpis: false,
      fontFamily: "Times New Roman"
    }
  }
};

if (typeof window !== 'undefined') {
  window.sampleProfiles = sampleProfiles;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = sampleProfiles;
}
