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
    summary: "Estudiante entusiasta de 7mo semestre de Ingeniería en Sistemas Computacionales con sólida formación técnica en arquitectura de software, modelado de bases de datos relacionales y desarrollo web. Orientado a la resolución analítica de problemas mediante código limpio y buenas prácticas de ingeniería. Apasionado por aprender nuevas tecnologías de manera autodidacta y colaborar en equipos multidisciplinarios.",
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
          "Ejecuté pruebas unitarias y pruebas de integración para asegurar la confiabilidad y prevenir regresiones en producción."
        ]
      },
      {
        id: "exp_2",
        role: "Asistente Técnico de TI & Soporte de Sistemas",
        company: "Laboratorio de Cómputo Universitario",
        period: "Agosto 2023 – Diciembre 2024",
        location: "Campus Universitario",
        bullets: [
          "Brindé mantenimiento preventivo y correctivo a más de 45 equipos de cómputo en red, optimizando los tiempos de actividad del aula.",
          "Configuré políticas de acceso, cuentas de usuario y segmentación básica de red en entornos Windows y distribuciones Linux (Ubuntu).",
          "Capacité a docentes y alumnos en el uso de plataformas educativas y software de desarrollo (IDEs, servidores locales)."
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
        tech: "PHP • JavaScript • HTML5 / CSS3 • Bootstrap • SQLite",
        link: "https://github.com/usuario-ejemplo/pos-sistema",
        description: "Sistema responsivo con catálogo de productos, control de stock en tiempo real, corte de caja y alertas de reabastecimiento automático."
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
        details: "Titulado con honores. Bases sólidas en algoritmos y redes."
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
    summary: "Desarrolladora Web Fullstack con pasión por construir aplicaciones web modernas, intuitivas y de alto rendimiento. Especializada en React para el frontend y Node.js/Express para servicios backend, con amplia experiencia en diseño y consumo de APIs RESTful y gestión de bases de datos relacionales y NoSQL. Enfoque en código modular, pruebas automatizadas y estándares de accesibilidad web.",
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
          "Desarrollé interfaces de usuario interactivas con React, TypeScript y Tailwind CSS, reduciendo el tiempo de carga en un 35%.",
          "Implementé manejo de estado global con Redux Toolkit y consumo de endpoints mediante React Query.",
          "Garanticé diseño adaptable para más de 15 tipos de resoluciones de pantalla y compatibilidad total entre navegadores."
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
        degree: "Licenciatura / Ingeniería en Tecnologías de Información",
        school: "Universidad Tecnológica",
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
    summary: "Analista de Datos con enfoque en transformar grandes volúmenes de información dispersa en tableros dinámicos e insights estratégicos para la dirección. Experto en modelado de datos en Power BI (DAX), extracción y limpieza mediante SQL y Power Query, y automatización de reportes operativos. Habilidad comprobada para colaborar con áreas de ventas, operaciones y finanzas para identificar oportunidades de ahorro y optimización.",
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
        location: "Planta Industrial",
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
        degree: "Ingeniería Industrial / Sistemas Computacionales",
        school: "Instituto Tecnológico",
        period: "2020 – 2024",
        details: "Graduado con mención en Optimización de Procesos y Estadística."
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
      template: "ats",
      colorTheme: "navy",
      showPhoto: false,
      showKpis: false,
      fontFamily: "Plus Jakarta Sans"
    }
  }
};
