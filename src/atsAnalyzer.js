// Analizador de puntuación ATS (Applicant Tracking Systems) y sugerencias
class ATSAnalyzer {
  static analyze(cvData) {
    let score = 0;
    const checks = [];

    // 1. Datos de Contacto (20 pts)
    const p = cvData.personal || {};
    let contactPts = 0;
    if (p.fullName && p.fullName.trim().length > 3) contactPts += 5;
    if (p.email && p.email.includes('@')) contactPts += 5;
    if (p.phone && p.phone.trim().length >= 8) contactPts += 5;
    if (p.location && p.location.trim().length >= 3) contactPts += 3;
    if (p.linkedin && p.linkedin.includes('linkedin.com')) contactPts += 2;

    score += contactPts;
    checks.push({
      category: "Datos de Contacto",
      points: `${contactPts}/20`,
      passed: contactPts >= 18,
      tip: contactPts < 18 ? "Asegúrate de incluir Nombre completo, Teléfono, Correo profesional, Ciudad y LinkedIn." : "Excelente información de contacto."
    });

    // 2. Resumen Profesional / Headline (15 pts)
    let sumPts = 0;
    if (p.headline && p.headline.trim().length >= 10) sumPts += 5;
    if (cvData.summary) {
      const words = cvData.summary.trim().split(/\s+/).length;
      if (words >= 30 && words <= 90) sumPts += 10;
      else if (words > 10) sumPts += 5;
    }
    score += sumPts;
    checks.push({
      category: "Perfil Profesional",
      points: `${sumPts}/15`,
      passed: sumPts >= 12,
      tip: sumPts < 12 ? "El resumen profesional debe tener entre 35 y 85 palabras con tu especialidad y valor principal." : "Resumen claro y bien dimensionado."
    });

    // 3. Experiencia y Verbos de Acción (25 pts)
    let expPts = 0;
    const expList = cvData.experience || [];
    if (expList.length >= 1) {
      expPts += 10;
      let actionVerbsFound = 0;
      let totalBullets = 0;
      const strongVerbs = ['lideré', 'automaticé', 'diseñé', 'desarrollé', 'implementé', 'analicé', 'programé', 'optimicé', 'reduje', 'construí', 'gestioné'];

      expList.forEach(e => {
        (e.bullets || []).forEach(b => {
          totalBullets++;
          const lower = b.toLowerCase();
          if (strongVerbs.some(v => lower.includes(v))) actionVerbsFound++;
        });
      });

      if (actionVerbsFound >= 3) expPts += 10;
      else if (actionVerbsFound >= 1) expPts += 5;

      if (totalBullets >= 3) expPts += 5;
    }
    score += expPts;
    checks.push({
      category: "Experiencia & Verbos de Acción",
      points: `${expPts}/25`,
      passed: expPts >= 20,
      tip: expPts < 20 ? "Inicia cada viñeta laboral con un verbo de acción fuerte en pasado (ej. Diseñé, Automaticé, Reduje)." : "Viñetas de impacto con verbos dinámicos."
    });

    // 4. Métricas y Números Cuantificables (15 pts)
    let numPts = 0;
    const allText = JSON.stringify(cvData).toLowerCase();
    const numbersMatch = allText.match(/\b\d+(%|\+| equipos| plantas| horas| usuarios| k)?\b/g) || [];
    if (numbersMatch.length >= 4) numPts = 15;
    else if (numbersMatch.length >= 2) numPts = 10;
    else if (numbersMatch.length >= 1) numPts = 5;

    score += numPts;
    checks.push({
      category: "Métricas Cuantificables",
      points: `${numPts}/15`,
      passed: numPts >= 10,
      tip: numPts < 10 ? "Agrega cifras concretas a tus logros (ej. '192 equipos', '100% digital', 'ahorro de 4 horas'). Los reclutadores buscan números." : "Logros cuantificables demostrados."
    });

    // 5. Stack Técnico & Habilidades Clave (15 pts)
    let skillPts = 0;
    const s = cvData.skills || {};
    const totalSkills = (s.languages || []).length + (s.databases || []).length + (s.tools || []).length;
    if (totalSkills >= 8) skillPts = 15;
    else if (totalSkills >= 4) skillPts = 10;
    else if (totalSkills > 0) skillPts = 5;

    score += skillPts;
    checks.push({
      category: "Palabras Clave (Stack Técnico)",
      points: `${skillPts}/15`,
      passed: skillPts >= 12,
      tip: skillPts < 12 ? "Agrega al menos 8 a 12 tecnologías y herramientas clave para pasar los filtros de palabras clave ATS." : "Excelente densidad de palabras clave técnicas."
    });

    // 6. Educación y Estudios (10 pts)
    let eduPts = 0;
    const eduList = cvData.education || [];
    if (eduList.length >= 1) {
      eduPts = 10;
    }
    score += eduPts;
    checks.push({
      category: "Educación",
      points: `${eduPts}/10`,
      passed: eduPts === 10,
      tip: eduPts === 0 ? "Falta indicar la carrera, universidad o institución educativa." : "Apartado educativo completo."
    });

    // Diagnóstico global
    let rating = "Requiere Mejoras";
    let badgeColor = "#ef4444";
    if (score >= 85) {
      rating = "¡Excelente (Alta Probabilidad ATS)!";
      badgeColor = "#10b981";
    } else if (score >= 70) {
      rating = "Bueno (Competitivo)";
      badgeColor = "#3b82f6";
    } else if (score >= 50) {
      rating = "Aceptable (Puede Mejorar)";
      badgeColor = "#f59e0b";
    }

    return {
      score,
      rating,
      badgeColor,
      checks
    };
  }
}
