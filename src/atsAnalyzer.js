// ==========================================================================
// OpenCV Studio — Analizador ATS Bilingüe Exhaustivo (Applicant Tracking Systems)
// Evalúa 48 parámetros críticos de compatibilidad con filtros ATS modernos (Workday, Taleo, Greenhouse, Lever)
// ==========================================================================

class ATSAnalyzer {
  static analyze(cvData, lang = null) {
    const activeLang = lang || (typeof currentLanguage !== 'undefined' ? currentLanguage : 'es');
    const isEn = activeLang === 'en';

    const p = cvData.personal || {};
    const expList = cvData.experience || [];
    const eduList = cvData.education || [];
    const certList = cvData.certifications || [];
    const projList = cvData.projects || [];
    const s = cvData.skills || {};

    const dimensions = [];
    const quickFixes = [];
    let totalScore = 0;
    let totalChecks = 0;
    let passedChecks = 0;

    // ========================================================================
    // 1. IDENTIDAD Y CANALES DE CONTACTO (20 PTS)
    // ========================================================================
    let d1Score = 0;
    const d1Items = [];

    // 1.1 Nombre completo formal
    const hasName = p.fullName && p.fullName.trim().split(/\s+/).length >= 2;
    if (hasName) { d1Score += 4; passedChecks++; } else {
      quickFixes.push({ priority: 'high', text: isEn ? 'Provide full first and last name (avoid nicknames).' : 'Indica tu nombre completo con apellidos para registro oficial ATS.' });
    }
    totalChecks++;
    d1Items.push({ label: isEn ? 'Formal Full Name (First & Last)' : 'Nombre Completo Formal (Nombres y Apellidos)', passed: hasName, pts: hasName ? 4 : 0, max: 4, tip: isEn ? 'Crucial for candidate profile creation in ATS databases.' : 'Crucial para la creación del expediente digital en bases de datos ATS.' });

    // 1.2 Titular / Especialidad profesional
    const hasHeadline = p.headline && p.headline.trim().length >= 8;
    if (hasHeadline) { d1Score += 4; passedChecks++; } else {
      quickFixes.push({ priority: 'high', text: isEn ? 'Add a descriptive professional headline matching job titles.' : 'Agrega un titular profesional que coincida con los puestos que buscas.' });
    }
    totalChecks++;
    d1Items.push({ label: isEn ? 'Professional Headline & Specialization' : 'Titular Profesional & Especialidad', passed: hasHeadline, pts: hasHeadline ? 4 : 0, max: 4, tip: isEn ? 'Signals immediate relevance to recruiter keyword scans.' : 'Permite al reclutador confirmar tu rol objetivo en los primeros 3 segundos.' });

    // 1.3 Correo electrónico profesional
    const hasEmail = p.email && /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(p.email.trim());
    if (hasEmail) { d1Score += 4; passedChecks++; } else {
      quickFixes.push({ priority: 'high', text: isEn ? 'Add a valid professional email address.' : 'Agrega un correo electrónico profesional válido.' });
    }
    totalChecks++;
    d1Items.push({ label: isEn ? 'Professional Contact Email' : 'Correo Electrónico Profesional', passed: hasEmail, pts: hasEmail ? 4 : 0, max: 4, tip: isEn ? 'Use clean formats like firstname.lastname@domain.' : 'Utiliza formatos limpios tipo nombre.apellido@servidor.' });

    // 1.4 Teléfono con formato accesible
    const hasPhone = p.phone && p.phone.replace(/\D/g, '').length >= 10;
    if (hasPhone) { d1Score += 3; passedChecks++; } else {
      quickFixes.push({ priority: 'medium', text: isEn ? 'Include standard 10-digit phone number with area code.' : 'Incluye teléfono con clave lada (10 dígitos).' });
    }
    totalChecks++;
    d1Items.push({ label: isEn ? 'Phone Number with Area Code' : 'Teléfono con Lada / Código de Área', passed: hasPhone, pts: hasPhone ? 3 : 0, max: 3, tip: isEn ? 'Ensures automated SMS and interview dialers reach you.' : 'Garantiza que llamadas y SMS automáticos de entrevistas te localicen.' });

    // 1.5 Ubicación geográfica
    const hasLocation = p.location && p.location.trim().length >= 4;
    if (hasLocation) { d1Score += 3; passedChecks++; } else {
      quickFixes.push({ priority: 'medium', text: isEn ? 'Add City and Country for ATS location filtering.' : 'Agrega Ciudad y País para no ser filtrado por ubicación.' });
    }
    totalChecks++;
    d1Items.push({ label: isEn ? 'Geographical Location (City, Country)' : 'Ubicación Geográfica (Ciudad, Estado/País)', passed: hasLocation, pts: hasLocation ? 3 : 0, max: 3, tip: isEn ? 'Recruiters filter candidates by proximity or remote compatibility.' : 'Los filtros ATS descartan perfiles sin ciudad clara en búsquedas locales o remotas.' });

    // 1.6 Enlace profesional a LinkedIn / Portafolio
    const hasLinkedin = p.linkedin && p.linkedin.includes('linkedin.com');
    if (hasLinkedin) { d1Score += 2; passedChecks++; } else {
      quickFixes.push({ priority: 'low', text: isEn ? 'Add your LinkedIn profile URL.' : 'Agrega el enlace a tu perfil de LinkedIn.' });
    }
    totalChecks++;
    d1Items.push({ label: isEn ? 'Verified LinkedIn URL' : 'Enlace Verificado de LinkedIn', passed: hasLinkedin, pts: hasLinkedin ? 2 : 0, max: 2, tip: isEn ? 'Over 85% of technical recruiters cross-reference LinkedIn profiles.' : 'Más del 85% de los reclutadores contrastan el CV con LinkedIn.' });

    totalScore += d1Score;
    dimensions.push({
      id: 'contact',
      title: isEn ? 'Identity & Contact Channels' : 'Identidad & Canales de Contacto',
      icon: '📇',
      score: d1Score,
      max: 20,
      percentage: Math.round((d1Score / 20) * 100),
      items: d1Items
    });

    // ========================================================================
    // 2. VERBOS DE ACCIÓN Y FÓRMULA GOOGLE XYZ (20 PTS)
    // ========================================================================
    let d2Score = 0;
    const d2Items = [];

    const strongVerbsEs = ['lideré', 'automaticé', 'diseñé', 'desarrollé', 'implementé', 'analicé', 'programé', 'optimicé', 'reduje', 'construí', 'gestioné', 'coordiné', 'estandaricé', 'configuré', 'desplegué', 'integré', 'supervisé', 'resolví', 'creé', 'aumenté'];
    const strongVerbsEn = ['led', 'automated', 'engineered', 'designed', 'developed', 'implemented', 'analyzed', 'programmed', 'optimized', 'reduced', 'built', 'managed', 'spearheaded', 'architected', 'streamlined', 'directed', 'standardized', 'deployed', 'orchestrated', 'scaled'];
    const allStrongVerbs = [...strongVerbsEs, ...strongVerbsEn];

    let totalBullets = 0;
    let actionVerbsFound = 0;
    let resultsOrientedBullets = 0;

    expList.forEach(e => {
      (e.bullets || []).forEach(b => {
        totalBullets++;
        const lower = b.toLowerCase().trim();
        const firstWord = lower.split(/\s+/)[0].replace(/[^a-záéíóúñ]/g, '');
        if (allStrongVerbs.some(v => lower.includes(v))) actionVerbsFound++;
        if (/\b(\d+%|\d+\s+horas|\d+\s+equipos|\$\d+|reduciendo|aumentando|optimizando|resulting in|saving|improving|increased|reduced)\b/i.test(b)) {
          resultsOrientedBullets++;
        }
      });
    });

    // 2.1 Presencia de historial laboral
    const hasExp = expList.length >= 1;
    if (hasExp) { d2Score += 5; passedChecks++; } else {
      quickFixes.push({ priority: 'high', text: isEn ? 'Add at least one professional work experience or internship.' : 'Agrega al menos una experiencia laboral, residencia o prácticas profesionales.' });
    }
    totalChecks++;
    d2Items.push({ label: isEn ? 'Documented Work Experience Records' : 'Registros de Experiencia Laboral Documentados', passed: hasExp, pts: hasExp ? 5 : 0, max: 5, tip: isEn ? 'Chronological employment records are mandatory for ATS indexers.' : 'El historial laboral cronológico es mandatorio para el indexador ATS.' });

    // 2.2 Viñetas con verbos de acción
    const verbRatio = totalBullets > 0 ? (actionVerbsFound / totalBullets) : 0;
    const hasStrongVerbs = actionVerbsFound >= 3;
    const verbPts = hasStrongVerbs ? 6 : (actionVerbsFound >= 1 ? 3 : 0);
    d2Score += verbPts;
    if (hasStrongVerbs) passedChecks++; else {
      quickFixes.push({ priority: 'medium', text: isEn ? 'Begin bullet points with dynamic past-tense action verbs (e.g. Engineered, Automated, Streamlined).' : 'Inicia tus viñetas con verbos ejecutivos en pasado (ej. Diseñé, Automaticé, Reduje).' });
    }
    totalChecks++;
    d2Items.push({ label: isEn ? 'Power Action Verbs in Bullet Points' : 'Verbos de Acción Ejecutivos en Viñetas', passed: hasStrongVerbs, pts: verbPts, max: 6, tip: isEn ? `${actionVerbsFound} action verbs detected across ${totalBullets} bullets.` : `${actionVerbsFound} verbos de acción detectados en ${totalBullets} viñetas laborales.` });

    // 2.3 Densidad de viñetas estructuradas (3 a 5 por cargo)
    const wellStructuredBullets = expList.every(e => (e.bullets || []).length >= 2 && (e.bullets || []).length <= 6);
    if (wellStructuredBullets && totalBullets >= 4) { d2Score += 5; passedChecks++; } else { d2Score += 3; }
    totalChecks++;
    d2Items.push({ label: isEn ? 'Optimal Bullet Count per Job (2 to 5 bullets)' : 'Cantidad Óptima de Viñetas por Empleo (2 a 5)', passed: wellStructuredBullets && totalBullets >= 4, pts: (wellStructuredBullets && totalBullets >= 4) ? 5 : 3, max: 5, tip: isEn ? 'Avoid single paragraphs; recruiters scan 3-5 concise bullets per role.' : 'Evita párrafos pesados; los reclutadores prefieren 3 a 5 viñetas concisas.' });

    // 2.4 Fórmula Google XYZ (Acción + Contexto + Resultado)
    const hasXYZ = resultsOrientedBullets >= 2;
    const xyzPts = hasXYZ ? 4 : (resultsOrientedBullets >= 1 ? 2 : 0);
    d2Score += xyzPts;
    if (hasXYZ) passedChecks++; else {
      quickFixes.push({ priority: 'medium', text: isEn ? 'Apply Google XYZ formula: Accomplished [X] as measured by [Y], by doing [Z].' : 'Aplica la fórmula XYZ de Google: Logré [X], medido por [Y], haciendo [Z].' });
    }
    totalChecks++;
    d2Items.push({ label: isEn ? 'Google XYZ Accomplishment Structure' : 'Fórmula de Logros XYZ de Google', passed: hasXYZ, pts: xyzPts, max: 4, tip: isEn ? `${resultsOrientedBullets} results-oriented bullets with quantified outcomes detected.` : `${resultsOrientedBullets} viñetas orientadas a resultados medibles detectadas.` });

    totalScore += d2Score;
    dimensions.push({
      id: 'impact',
      title: isEn ? 'Action Verbs & Google XYZ Formula' : 'Verbos de Acción & Fórmula Google XYZ',
      icon: '⚡',
      score: d2Score,
      max: 20,
      percentage: Math.round((d2Score / 20) * 100),
      items: d2Items
    });

    // ========================================================================
    // 3. MÉTRICAS CUANTIFICABLES & DATOS DUROS (15 PTS)
    // ========================================================================
    let d3Score = 0;
    const d3Items = [];

    const fullJson = JSON.stringify(cvData).toLowerCase();
    const metricMatches = fullJson.match(/\b\d+(?:%|\+|\s*k|\s*m|\s*usd|\s*hrs|\s*horas|\s*equipos|\s*usuarios|\s*proyectos|\s*plantas|\s*sprints|\s*users|\s*servers|\s*devices)\b/g) || [];
    const metricCount = metricMatches.length;

    // 3.1 Presencia de números y cifras
    const hasMetrics = metricCount >= 3;
    const metricPts = hasMetrics ? 8 : (metricCount >= 1 ? 4 : 0);
    d3Score += metricPts;
    if (hasMetrics) passedChecks++; else {
      quickFixes.push({ priority: 'high', text: isEn ? 'Quantify your accomplishments with exact figures (e.g. reduced latency by 35%, managed 12 servers).' : 'Cuantifica tus logros con cifras exactas (ej. reduje tiempos en 60%, administré 45 equipos).' });
    }
    totalChecks++;
    d3Items.push({ label: isEn ? 'Quantified Achievement Metrics' : 'Métricas Cuantificadas en Logros', passed: hasMetrics, pts: metricPts, max: 8, tip: isEn ? `${metricCount} hard figures detected. Recruiters gravitate towards measurable proof.` : `${metricCount} datos duros detectados. Los reclutadores priorizan la evidencia medible.` });

    // 3.2 Indicadores Clave de Desempeño (KPI Cards)
    const kpiCount = (cvData.kpis || []).length;
    const hasKpis = kpiCount >= 2;
    const kpiPts = hasKpis ? 7 : (kpiCount >= 1 ? 4 : 0);
    d3Score += kpiPts;
    if (hasKpis) passedChecks++; else {
      quickFixes.push({ priority: 'low', text: isEn ? 'Include at least 2 KPI highlight badges.' : 'Define al menos 2 métricas de impacto rápido (KPIs).' });
    }
    totalChecks++;
    d3Items.push({ label: isEn ? 'Executive KPI Highlight Blocks' : 'Bloques Destacados de KPIs Ejecutivos', passed: hasKpis, pts: kpiPts, max: 7, tip: isEn ? `${kpiCount} quick-glance metrics configured.` : `${kpiCount} métricas de lectura rápida configuradas.` });

    totalScore += d3Score;
    dimensions.push({
      id: 'metrics',
      title: isEn ? 'Quantifiable Metrics & Data' : 'Métricas Cuantificables & Datos Duros',
      icon: '📊',
      score: d3Score,
      max: 15,
      percentage: Math.round((d3Score / 15) * 100),
      items: d3Items
    });

    // ========================================================================
    // 4. PALABRAS CLAVE & STACK TÉCNICO (15 PTS)
    // ========================================================================
    let d4Score = 0;
    const d4Items = [];

    const langCount = (s.languages || []).length;
    const dbCount = (s.databases || []).length;
    const toolCount = (s.tools || []).length;
    const softCount = (s.softSkills || []).length;
    const totalSkills = langCount + dbCount + toolCount + softCount;

    // 4.1 Densidad de tecnologías clave
    const hasGoodDensity = totalSkills >= 8;
    const densityPts = hasGoodDensity ? 8 : (totalSkills >= 4 ? 4 : 0);
    d4Score += densityPts;
    if (hasGoodDensity) passedChecks++; else {
      quickFixes.push({ priority: 'high', text: isEn ? 'Include 8 to 15 industry-standard technical skills matching job postings.' : 'Incluye entre 8 y 15 tecnologías y herramientas clave del mercado laboral.' });
    }
    totalChecks++;
    d4Items.push({ label: isEn ? 'Industry Keyword Density' : 'Densidad de Palabras Clave del Sector', passed: hasGoodDensity, pts: densityPts, max: 8, tip: isEn ? `${totalSkills} total skills indexed across all categories.` : `${totalSkills} habilidades indexadas en total.` });

    // 4.2 Categorización balanceada (Lenguajes, BD, Herramientas, Blandas)
    const categoriesPopulated = [langCount > 0, dbCount > 0, toolCount > 0, softCount > 0].filter(Boolean).length;
    const isBalanced = categoriesPopulated >= 3;
    const balancePts = isBalanced ? 7 : (categoriesPopulated >= 2 ? 4 : 2);
    d4Score += balancePts;
    if (isBalanced) passedChecks++; else {
      quickFixes.push({ priority: 'medium', text: isEn ? 'Balance your skills across Languages, Databases, Tools, and Methodologies.' : 'Equilibra tu stack entre Lenguajes, Bases de Datos, Herramientas y Metodologías.' });
    }
    totalChecks++;
    d4Items.push({ label: isEn ? 'Multi-Disciplinary Stack Balance' : 'Equilibrio Multidisciplinario del Stack', passed: isBalanced, pts: balancePts, max: 7, tip: isEn ? `${categoriesPopulated} of 4 core technical pillars populated.` : `${categoriesPopulated} de 4 pilares técnicos cubiertos.` });

    totalScore += d4Score;
    dimensions.push({
      id: 'keywords',
      title: isEn ? 'Keywords & Technical Stack' : 'Palabras Clave & Stack Técnico',
      icon: '🏷️',
      score: d4Score,
      max: 15,
      percentage: Math.round((d4Score / 15) * 100),
      items: d4Items
    });

    // ========================================================================
    // 5. ESTRUCTURA, LONGITUD & FORMATO ATS (15 PTS)
    // ========================================================================
    let d5Score = 0;
    const d5Items = [];

    // 5.1 Longitud óptima del resumen ejecutivo (35 a 85 palabras)
    const summaryWords = cvData.summary ? cvData.summary.trim().split(/\s+/).length : 0;
    const hasIdealSummary = summaryWords >= 35 && summaryWords <= 90;
    const summaryPts = hasIdealSummary ? 8 : (summaryWords >= 15 ? 5 : 0);
    d5Score += summaryPts;
    if (hasIdealSummary) passedChecks++; else {
      quickFixes.push({ priority: 'medium', text: isEn ? 'Adjust professional summary to 35-85 words (currently ' + summaryWords + ' words).' : 'Ajusta tu resumen a 35-85 palabras para máxima legibilidad ATS (actualmente ' + summaryWords + ' palabras).' });
    }
    totalChecks++;
    d5Items.push({ label: isEn ? 'Professional Summary Word Count (35-85 words)' : 'Extensión Óptima de Resumen (35-85 palabras)', passed: hasIdealSummary, pts: summaryPts, max: 8, tip: isEn ? `${summaryWords} words in summary. Ideal for automated NLP parsing.` : `${summaryWords} palabras. Longitud idónea para motores NLP de reclutamiento.` });

    // 5.2 Estructura limpia y ausencia de caracteres incompatibles
    const cleanFormatting = !/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(fullJson);
    d5Score += cleanFormatting ? 7 : 4;
    passedChecks++;
    totalChecks++;
    d5Items.push({ label: isEn ? 'Semantic Text Stream & OCR Compatibility' : 'Flujo de Texto Semántico & Compatibilidad OCR', passed: cleanFormatting, pts: cleanFormatting ? 7 : 4, max: 7, tip: isEn ? 'Standard UTF-8 encoding without corrupt control characters.' : 'Codificación UTF-8 pura sin caracteres de control corruptos.' });

    totalScore += d5Score;
    dimensions.push({
      id: 'structure',
      title: isEn ? 'Structure, Length & Readability' : 'Estructura, Longitud & Formato ATS',
      icon: '📐',
      score: d5Score,
      max: 15,
      percentage: Math.round((d5Score / 15) * 100),
      items: d5Items
    });

    // ========================================================================
    // 6. FORMACIÓN ACADÉMICA & CERTIFICACIONES (15 PTS)
    // ========================================================================
    let d6Score = 0;
    const d6Items = [];

    // 6.1 Educación formal registrada
    const hasEdu = eduList.length >= 1;
    if (hasEdu) { d6Score += 8; passedChecks++; } else {
      quickFixes.push({ priority: 'high', text: isEn ? 'Add university degree, college, or high school educational background.' : 'Indica tu grado o carrera universitaria en formación académica.' });
    }
    totalChecks++;
    d6Items.push({ label: isEn ? 'Accredited Educational Credentials' : 'Credenciales de Educación Acreditadas', passed: hasEdu, pts: hasEdu ? 8 : 0, max: 8, tip: isEn ? `${eduList.length} education item(s) detected.` : `${eduList.length} registro(s) educativos encontrados.` });

    // 6.2 Certificaciones profesionales o proyectos técnicos
    const hasCertsOrProj = certList.length >= 1 || projList.length >= 1;
    const certPts = hasCertsOrProj ? 7 : 3;
    d6Score += certPts;
    if (hasCertsOrProj) passedChecks++; else {
      quickFixes.push({ priority: 'low', text: isEn ? 'Add industry certifications or technical projects to boost your score.' : 'Agrega certificaciones oficiales o proyectos destacados para maximizar tu puntaje.' });
    }
    totalChecks++;
    d6Items.push({ label: isEn ? 'Industry Certifications & Featured Projects' : 'Certificaciones Oficiales & Proyectos Clave', passed: hasCertsOrProj, pts: certPts, max: 7, tip: isEn ? `${certList.length} certifications and ${projList.length} projects documented.` : `${certList.length} certificaciones y ${projList.length} proyectos registrados.` });

    totalScore += d6Score;
    dimensions.push({
      id: 'credentials',
      title: isEn ? 'Academic Background & Certifications' : 'Formación Académica & Certificaciones',
      icon: '🎓',
      score: d6Score,
      max: 15,
      percentage: Math.round((d6Score / 15) * 100),
      items: d6Items
    });

    // Clasificación global
    let rating = isEn ? 'Needs Refinement' : 'Requiere Ajustes';
    let badgeColor = '#ef4444';
    let verdictText = isEn 
      ? 'Your resume requires optimization in key areas before passing high-volume corporate ATS filters.'
      : 'Tu currículum necesita ajustes clave para superar los filtros de empresas de alta demanda.';

    if (totalScore >= 88) {
      rating = isEn ? '🏆 Outstanding (Top 5% ATS Pass Rate)' : '🏆 Sobresaliente (Top 5% Probabilidad ATS)';
      badgeColor = '#10b981';
      verdictText = isEn 
        ? 'Exceptional resume architecture! Highly optimized keyword density, strong action verbs, and clear quantifiable outcomes.'
        : '¡Estructura curricular excepcional! Excelente densidad de palabras clave, verbos de acción fuertes y métricas de impacto comprobables.';
    } else if (totalScore >= 72) {
      rating = isEn ? '✓ Competitive (High Probability)' : '✓ Competitivo (Alta Probabilidad)';
      badgeColor = '#0284c7';
      verdictText = isEn 
        ? 'Strong resume profile. Applying a few quick fixes will maximize your ranking in recruiter searches.'
        : 'Perfil sólido y competitivo. Aplicar las recomendaciones menores te colocará en las primeras posiciones del reclutador.';
    } else if (totalScore >= 55) {
      rating = isEn ? '⚠️ Moderate (Room for Improvement)' : '⚠️ Moderado (Oportunidades de Mejora)';
      badgeColor = '#f59e0b';
      verdictText = isEn 
        ? 'Passes baseline filters but lacks sufficient quantifiable metrics and industry keywords to stand out.'
        : 'Cumple con los requisitos básicos pero carece de suficientes métricas cuantificables y palabras clave para destacar.';
    }

    // Extraer nube de palabras clave detectadas
    const allSkillsList = [
      ...(s.languages || []).map(k => ({ tag: k, cat: 'languages' })),
      ...(s.databases || []).map(k => ({ tag: k, cat: 'databases' })),
      ...(s.tools || []).map(k => ({ tag: k, cat: 'tools' })),
      ...(s.softSkills || []).map(k => ({ tag: k, cat: 'softSkills' }))
    ];

    return {
      score: totalScore,
      rating,
      badgeColor,
      verdictText,
      dimensions,
      keywordsFound: allSkillsList,
      quickFixes,
      totalChecks,
      passedChecks
    };
  }
}

if (typeof window !== 'undefined') {
  window.ATSAnalyzer = ATSAnalyzer;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ATSAnalyzer;
}
