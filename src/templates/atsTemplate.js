// Plantilla 3: ATS Minimalist Classic (100% compatible con lectores de robots)
const ATSTemplate = {
  id: 'ats',
  name: 'ATS Minimalista Clásico (Filtros Automáticos)',
  description: 'Diseño en una sola columna con jerarquía estándar y alto contraste, garantizando 100% de legibilidad en filtros ATS de grandes empresas.',
  render(data) {
    const lang = data.settings?.cvLanguage || (typeof currentLanguage !== 'undefined' ? currentLanguage : 'es');
    const isEn = lang === 'en';
    const L = (typeof getCVLabels === 'function') ? getCVLabels(lang) : {};

    const summaryTitle = L.summary || (isEn ? 'PROFESSIONAL SUMMARY' : 'RESUMEN PROFESIONAL');
    const skillsTitle = L.skills || (isEn ? 'TECHNICAL SKILLS & COMPETENCIES' : 'HABILIDADES Y COMPETENCIAS TÉCNICAS');
    const expTitle = L.experience || (isEn ? 'PROFESSIONAL EXPERIENCE' : 'EXPERIENCIA LABORAL');
    const projTitle = L.projects || (isEn ? 'KEY TECHNICAL PROJECTS' : 'PROYECTOS TÉCNICOS DESTACADOS');
    const eduTitle = L.education || (isEn ? 'EDUCATION' : 'EDUCACIÓN');
    const certTitle = L.certifications || (isEn ? 'CERTIFICATIONS' : 'CERTIFICACIONES');
    const phoneLabel = L.phone || (isEn ? 'Phone' : 'Tel');
    const locLabel = L.location || (isEn ? 'Location' : 'Ubicación');
    const langLabel = L.languages || (isEn ? 'Languages' : 'Lenguajes');
    const dbLabel = L.databases || (isEn ? 'Databases' : 'Bases de Datos');
    const toolsLabel = L.tools || (isEn ? 'Tools & Systems' : 'Herramientas & Sistemas');
    const softLabel = L.softSkills || (isEn ? 'Methodologies' : 'Metodologías');

    const p = data.personal || {};
    const s = data.skills || {};

    const contactItems = [
      p.phone ? `${phoneLabel}: ${p.phone}` : null,
      p.email ? `Email: ${p.email}` : null,
      p.location ? `${locLabel}: ${p.location}` : null,
      p.linkedin ? `<a href="${p.linkedin}">LinkedIn</a>` : null,
      p.github ? `<a href="${p.github}">GitHub</a>` : null
    ].filter(Boolean).join(' | ');

    const expHtml = (data.experience || []).map(e => `
      <div class="ats-entry">
        <div class="ats-entry-header">
          <strong>${e.role}</strong> — <em>${e.company}</em>
          <span class="ats-entry-date">${e.period}</span>
        </div>
        <ul class="ats-list">
          ${(e.bullets || []).map(b => `<li>${b}</li>`).join('')}
        </ul>
      </div>
    `).join('');

    const projHtml = (data.projects || []).map(pr => `
      <div class="ats-entry">
        <div class="ats-entry-header">
          <strong>${pr.title}</strong> ${pr.tech ? `[${pr.tech}]` : ''}
        </div>
        <p class="ats-text">${pr.description}</p>
      </div>
    `).join('');

    const eduHtml = (data.education || []).map(ed => `
      <div class="ats-entry">
        <div class="ats-entry-header">
          <strong>${ed.degree}</strong> — ${ed.school}
          <span class="ats-entry-date">${ed.period}</span>
        </div>
        ${ed.details ? `<div class="ats-text">${ed.details}</div>` : ''}
      </div>
    `).join('');

    return `
      <div class="cv-document t-ats">
        <header class="ats-header">
          <h1 class="ats-name">${p.fullName || (isEn ? 'FULL NAME' : 'NOMBRE COMPLETO')}</h1>
          <div class="ats-sub">${p.headline || (isEn ? 'PROFESSIONAL TITLE' : 'TITULAR PROFESIONAL')}</div>
          <div class="ats-contact">${contactItems}</div>
        </header>

        ${data.summary ? `
          <section class="ats-section">
            <h2 class="ats-title">${summaryTitle}</h2>
            <div class="ats-divider"></div>
            <p class="ats-text">${data.summary}</p>
          </section>
        ` : ''}

        <section class="ats-section">
          <h2 class="ats-title">${skillsTitle}</h2>
          <div class="ats-divider"></div>
          <p class="ats-text">
            ${(s.languages || []).length ? `<strong>${langLabel}:</strong> ${s.languages.join(', ')}<br>` : ''}
            ${(s.databases || []).length ? `<strong>${dbLabel}:</strong> ${s.databases.join(', ')}<br>` : ''}
            ${(s.tools || []).length ? `<strong>${toolsLabel}:</strong> ${s.tools.join(', ')}<br>` : ''}
            ${(s.softSkills || []).length ? `<strong>${softLabel}:</strong> ${s.softSkills.join(', ')}` : ''}
          </p>
        </section>

        <section class="ats-section">
          <h2 class="ats-title">${expTitle}</h2>
          <div class="ats-divider"></div>
          ${expHtml}
        </section>

        ${projHtml ? `
          <section class="ats-section">
            <h2 class="ats-title">${projTitle}</h2>
            <div class="ats-divider"></div>
            ${projHtml}
          </section>
        ` : ''}

        <section class="ats-section">
          <h2 class="ats-title">${eduTitle}</h2>
          <div class="ats-divider"></div>
          ${eduHtml}
        </section>

        ${(data.certifications || []).length ? `
          <section class="ats-section">
            <h2 class="ats-title">${certTitle}</h2>
            <div class="ats-divider"></div>
            <ul class="ats-list">
              ${data.certifications.map(c => `<li><strong>${c.title}</strong> — ${c.issuer} (${c.year})</li>`).join('')}
            </ul>
          </section>
        ` : ''}
      </div>
    `;
  }
};
