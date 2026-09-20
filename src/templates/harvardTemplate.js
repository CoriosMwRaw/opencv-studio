// Plantilla 5: Harvard Classic (Ivy League / Academic & Corporate ATS Puro)
// Basada en el formato oficial de Harvard College / Harvard Business School
const HarvardTemplate = {
  id: 'harvard',
  name: 'Harvard Classic (Ivy League ATS Puro)',
  description: 'Formato estándar de Harvard: monocolumna elegante, encabezados con divisor sutil, fechas justificadas a la derecha y 100% de compatibilidad con filtros ATS.',
  render(data) {
    const lang = data.settings?.cvLanguage || (typeof currentLanguage !== 'undefined' ? currentLanguage : 'es');
    const isEn = lang === 'en';
    const L = (typeof getCVLabels === 'function') ? getCVLabels(lang) : {};

    const eduTitle = L.education || (isEn ? 'EDUCATION' : 'EDUCACIÓN');
    const expTitle = L.experience || (isEn ? 'PROFESSIONAL EXPERIENCE' : 'EXPERIENCIA LABORAL');
    const projTitle = L.projects || (isEn ? 'ACADEMIC & TECHNICAL PROJECTS' : 'PROYECTOS TÉCNICOS DESTACADOS');
    const skillsTitle = L.skills || (isEn ? 'SKILLS & COMPETENCIES' : 'HABILIDADES Y COMPETENCIAS');
    const certTitle = L.certifications || (isEn ? 'CERTIFICATIONS' : 'CERTIFICACIONES');
    const summaryTitle = L.summary || (isEn ? 'PROFESSIONAL SUMMARY' : 'RESUMEN PROFESIONAL');

    const p = data.personal || {};
    const s = data.skills || {};

    // Línea de contacto estilo Harvard unificada
    const contactParts = [
      p.location ? p.location : null,
      p.phone ? p.phone : null,
      p.email ? `<a href="mailto:${p.email}">${p.email}</a>` : null,
      p.linkedin ? `<a href="${p.linkedin}" target="_blank">LinkedIn</a>` : null,
      p.github ? `<a href="${p.github}" target="_blank">GitHub</a>` : null
    ].filter(Boolean);

    const contactLine = contactParts.join(' &nbsp;•&nbsp; ');

    // Educación con formato Harvard (en Harvard la educación suele ir arriba o destacada)
    const eduHtml = (data.education || []).map(ed => `
      <div class="harvard-entry">
        <div class="harvard-entry-row">
          <span class="harvard-org">${ed.school}</span>
          <span class="harvard-loc-date">${ed.period}</span>
        </div>
        <div class="harvard-entry-row harvard-subrow">
          <span class="harvard-role">${ed.degree}</span>
        </div>
        ${ed.details ? `<div class="harvard-note">${ed.details}</div>` : ''}
      </div>
    `).join('');

    // Experiencia laboral con formato Harvard
    const expHtml = (data.experience || []).map(e => `
      <div class="harvard-entry">
        <div class="harvard-entry-row">
          <span class="harvard-org">${e.company}</span>
          <span class="harvard-loc-date">${e.location ? `${e.location} &nbsp;|&nbsp; ` : ''}${e.period}</span>
        </div>
        <div class="harvard-entry-row harvard-subrow">
          <span class="harvard-role">${e.role}</span>
        </div>
        <ul class="harvard-bullet-list">
          ${(e.bullets || []).map(b => `<li>${b}</li>`).join('')}
        </ul>
      </div>
    `).join('');

    // Proyectos destacados
    const projHtml = (data.projects || []).map(pr => `
      <div class="harvard-entry">
        <div class="harvard-entry-row">
          <span class="harvard-org">${pr.title}</span>
          <span class="harvard-loc-date">${pr.tech ? `<em>${pr.tech}</em>` : ''}</span>
        </div>
        <p class="harvard-desc">${pr.description}</p>
        ${pr.link ? `<div class="harvard-link"><a href="${pr.link}" target="_blank">${pr.link}</a></div>` : ''}
      </div>
    `).join('');

    // Habilidades categorizadas estilo Harvard (texto continuo estructurado)
    const skillsList = [
      (s.languages || []).length ? `<strong>${isEn ? 'Languages' : 'Lenguajes'}:</strong> ${s.languages.join(', ')}` : null,
      (s.databases || []).length ? `<strong>${isEn ? 'Databases' : 'Bases de Datos'}:</strong> ${s.databases.join(', ')}` : null,
      (s.tools || []).length ? `<strong>${isEn ? 'Tools & Frameworks' : 'Herramientas y Entornos'}:</strong> ${s.tools.join(', ')}` : null,
      (s.softSkills || []).length ? `<strong>${isEn ? 'Core Competencies' : 'Competencias Clave'}:</strong> ${s.softSkills.join(', ')}` : null
    ].filter(Boolean);

    // Certificaciones
    const certsHtml = (data.certifications || []).map(c => `
      <li class="harvard-cert-item">
        <strong>${c.title}</strong> &nbsp;—&nbsp; ${c.issuer} ${c.year ? `(${c.year})` : ''}
      </li>
    `).join('');

    return `
      <div class="cv-document t-harvard theme-${data.settings?.colorTheme || 'crimson'}">
        <!-- Encabezado Harvard Clásico Centrado -->
        <header class="harvard-header">
          <h1 class="harvard-name">${p.fullName || (isEn ? 'YOUR FULL NAME' : 'TU NOMBRE COMPLETO')}</h1>
          ${p.headline ? `<div class="harvard-headline">${p.headline}</div>` : ''}
          ${contactLine ? `<div class="harvard-contact">${contactLine}</div>` : ''}
        </header>

        <!-- Resumen Ejecutivo (si existe) -->
        ${data.summary ? `
          <section class="harvard-section">
            <h2 class="harvard-sec-title">${summaryTitle}</h2>
            <div class="harvard-rule"></div>
            <p class="harvard-summary-text">${data.summary}</p>
          </section>
        ` : ''}

        <!-- Educación -->
        <section class="harvard-section">
          <h2 class="harvard-sec-title">${eduTitle}</h2>
          <div class="harvard-rule"></div>
          ${eduHtml}
        </section>

        <!-- Experiencia Laboral -->
        <section class="harvard-section">
          <h2 class="harvard-sec-title">${expTitle}</h2>
          <div class="harvard-rule"></div>
          ${expHtml}
        </section>

        <!-- Proyectos Técnicos / Académicos -->
        ${(data.projects || []).length ? `
          <section class="harvard-section">
            <h2 class="harvard-sec-title">${projTitle}</h2>
            <div class="harvard-rule"></div>
            ${projHtml}
          </section>
        ` : ''}

        <!-- Habilidades Técnicas y Competencias -->
        ${skillsList.length ? `
          <section class="harvard-section">
            <h2 class="harvard-sec-title">${skillsTitle}</h2>
            <div class="harvard-rule"></div>
            <div class="harvard-skills-block">
              ${skillsList.map(item => `<div class="harvard-skill-line">${item}</div>`).join('')}
            </div>
          </section>
        ` : ''}

        <!-- Certificaciones -->
        ${(data.certifications || []).length ? `
          <section class="harvard-section">
            <h2 class="harvard-sec-title">${certTitle}</h2>
            <div class="harvard-rule"></div>
            <ul class="harvard-bullet-list">
              ${certsHtml}
            </ul>
          </section>
        ` : ''}
      </div>
    `;
  }
};

if (typeof window !== 'undefined') {
  window.HarvardTemplate = HarvardTemplate;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = HarvardTemplate;
}
