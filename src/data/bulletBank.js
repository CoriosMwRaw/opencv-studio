// ==========================================================================
// OpenCV Studio — Banco de Frases de Impacto & Verbos de Acción Bilingüe
// Soporte Completo para Español (es) e Inglés (en) (Google XYZ Formula)
// ==========================================================================

const bulletBankData = {
  es: {
    desarrollo: {
      category: "Desarrollo de Software & Programación",
      items: [
        "Diseñé y programé una aplicación de [Tecnología] con arquitectura modular, reduciendo el tiempo de respuesta en un [X]%.",
        "Implementé APIs RESTful seguras con autenticación JWT para conectar el frontend con la base de datos [MySQL/SQL Server].",
        "Automaticé pruebas unitarias y flujos de integración continua (CI/CD) utilizando Git y GitHub Actions.",
        "Refactoricé código legado en [Java/C++], mejorando la legibilidad, escalabilidad y disminuyendo fallos de concurrencia.",
        "Desarrollé una interfaz de usuario intuitiva y responsiva con [HTML5/CSS3/JavaScript], logrando una navegación ágil en dispositivos móviles.",
        "Optimicé consultas SQL complejas e indexé tablas críticas, reduciendo el tiempo de carga de consultas masivas de [X] segundos a milisegundos."
      ]
    },
    datos: {
      category: "Análisis de Datos, BI & Automatización",
      items: [
        "Construí dashboards interactivos en [Excel/Power BI] para el monitoreo de KPIs operativos en tiempo real (MTTR, MTBF, OEE).",
        "Automaticé la extracción, transformación y carga (ETL) de datos operativos con macros en VBA o Python, ahorrando [X] horas semanales de captura manual.",
        "Ejecuté análisis Jack-Knife y diagramas de Pareto para identificar las fallas más recurrentes en maquinaria industrial, priorizando planes preventivos.",
        "Diseñé modelos de datos normalizados para garantizar la integridad, seguridad y trazabilidad de la información departamental.",
        "Generé reportes analíticos automatizados con visualizaciones claras para la toma de decisiones del equipo gerencial."
      ]
    },
    mantenimiento: {
      category: "Mantenimiento Industrial & Procesos",
      items: [
        "Gestioné el programa de mantenimiento preventivo y correctivo para una flota de [X] equipos industriales en planta.",
        "Lideré la digitalización de órdenes de trabajo (OT), logrando una operación 100% cero papel (paperless) y mejorando el tiempo de respuesta técnico.",
        "Implementé metodologías de mejora continua (Kaizen y 5S) para reducir tiempos muertos de maquinaria en piso de manufactura.",
        "Coordiné turnos de trabajo y medí indicadores de productividad y bonos de desempeño del personal técnico."
      ]
    },
    redes: {
      category: "Redes, Soporte & Sistemas",
      items: [
        "Configuré switches, routers y topologías de red en Cisco Packet Tracer, implementando segmentación por VLANs y protocolos de enrutamiento.",
        "Brindé soporte técnico preventivo y correctivo a más de [X] equipos de cómputo, impresoras industriales y terminales de punto de venta.",
        "Administré entornos en sistemas operativos Linux y Windows Server, configurando permisos de usuario y políticas de seguridad.",
        "Realicé cableado estructurado bajo normas TIA/EIA, garantizando la certificación y continuidad de la conectividad en oficinas y talleres."
      ]
    },
    estudiantes: {
      category: "Proyectos Académicos & Universitarios",
      items: [
        "Lideré el proyecto final de [Materia], coordinando un equipo de 4 integrantes bajo metodología ágil Scrum y entregando el software en tiempo.",
        "Diseñé un prototipo funcional de sistema de gestión escolar/comercial desde el levantamiento de requerimientos hasta el despliegue final.",
        "Investigué de manera autodidacta nuevas tecnologías ([Nombre Herramienta]) para implementarlas exitosamente en la resolución del problema planteado.",
        "Documenté técnicamente casos de uso, diagramas UML y manuales de usuario para facilitar el mantenimiento futuro del software."
      ]
    },
    verbos: [
      "Lideré", "Automaticé", "Diseñé", "Desarrollé", "Implementé", "Analicé", "Programé", 
      "Optimicé", "Reduje", "Estandaricé", "Coordiné", "Configuré", "Documenté", "Construí", "Capacité"
    ]
  },
  en: {
    desarrollo: {
      category: "Software Development & Engineering",
      items: [
        "Architected and developed a modular [Technology] application, slashing system response latency by [X]%.",
        "Engineered secure RESTful APIs with JWT authentication connecting client frontend with [MySQL/PostgreSQL] databases.",
        "Automated continuous integration and deployment (CI/CD) pipelines leveraging Git and GitHub Actions.",
        "Refactored legacy codebase in [Java/C++], boosting scalability, maintainability, and decreasing memory footprint by [X]%.",
        "Constructed responsive, accessible user interfaces using modern [React/HTML5/CSS3], improving cross-device user retention.",
        "Optimized complex SQL queries and indexed high-throughput database tables, reducing execution latency from [X]s to milliseconds."
      ]
    },
    datos: {
      category: "Data Analytics, BI & Automation",
      items: [
        "Built interactive executive dashboards in [Power BI/Tableau] monitoring critical real-time KPIs (MTTR, MTBF, OEE, Churn).",
        "Automated ETL data pipelines utilizing Python and SQL, eliminating [X] hours of redundant manual data entry each week.",
        "Conducted Pareto and statistical root-cause analyses identifying primary industrial downtime drivers to optimize preventive maintenance.",
        "Designed normalized relational schemas ensuring data integrity, traceability, and enterprise compliance across departments.",
        "Generated automated analytical reports providing actionable data visualizations for senior executive decision-making."
      ]
    },
    mantenimiento: {
      category: "Industrial Maintenance & Operations",
      items: [
        "Directed preventive and predictive maintenance programs across a fleet of [X] mission-critical manufacturing machines.",
        "Spearheaded enterprise digital paperless workflow transition, reducing technician response intervals by [X]%.",
        "Implemented Lean Manufacturing, Kaizen, and 5S standards, eliminating production bottlenecks and reducing unplanned line halts.",
        "Managed cross-functional technical teams, establishing KPIs, performance evaluations, and equipment uptime benchmarks."
      ]
    },
    redes: {
      category: "IT Support, Networks & Infrastructure",
      items: [
        "Configured switches, routers, and VLAN topologies in Cisco networking environments, ensuring secure segment routing.",
        "Provided tier-2/3 technical diagnostics and maintenance across [X]+ workstations, enterprise servers, and industrial peripherals.",
        "Administered hybrid Windows Server and Linux enterprise environments, managing Active Directory and access permissions.",
        "Executed structured cabling according to TIA/EIA standards, achieving 99.9% network reliability across campus facilities."
      ]
    },
    estudiantes: {
      category: "Academic & Engineering Projects",
      items: [
        "Led capstone project team of 4 engineers under Agile Scrum methodology, delivering production-ready software ahead of schedule.",
        "Engineered end-to-end full-stack prototype from requirements gathering through database design and final deployment.",
        "Researched and self-taught cutting-edge tools ([Tool Name]) to solve critical technical bottlenecks in the project.",
        "Authored comprehensive technical documentation, UML diagrams, and API specifications for future maintainers."
      ]
    },
    verbos: [
      "Led", "Automated", "Designed", "Developed", "Implemented", "Analyzed", "Programmed", 
      "Optimized", "Reduced", "Engineered", "Spearheaded", "Streamlined", "Architected", "Constructed", "Directed"
    ]
  }
};

function getBulletBank(lang) {
  const activeLang = lang || (typeof currentLanguage !== 'undefined' ? currentLanguage : 'es');
  return bulletBankData[activeLang] || bulletBankData['es'];
}

// Proxy transparente para retrocompatibilidad directa: bulletBank.desarrollo -> devuelve según el idioma activo
const bulletBank = new Proxy(bulletBankData, {
  get(target, prop) {
    if (prop === 'es' || prop === 'en') return target[prop];
    const activeLang = (typeof currentLanguage !== 'undefined' ? currentLanguage : 'es');
    const bank = target[activeLang] || target['es'];
    if (prop in bank) return bank[prop];
    return target[prop];
  }
});

if (typeof window !== 'undefined') {
  window.bulletBankData = bulletBankData;
  window.getBulletBank = getBulletBank;
  window.bulletBank = bulletBank;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    bulletBankData,
    getBulletBank,
    bulletBank
  };
}
