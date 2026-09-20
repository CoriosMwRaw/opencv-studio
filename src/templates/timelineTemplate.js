// Plantilla 7: Timeline Ejecutivo (Cronología & Hitos Profesionales)
// Diseño contemporáneo con eje vertical de tiempo y 100% compatible con filtros ATS
const TimelineTemplate = {
  id: 'timeline',
  name: 'Timeline Ejecutivo (Cronología & Hitos)',
  description: 'Diseño corporativo contemporáneo con eje de tiempo vertical, hitos profesionales destacados, badges de especialidad y 100% de compatibilidad con filtros ATS.',
  render(data) {
    const lang = data.settings?.cvLanguage || (typeof currentLanguage !== 'undefined' ? currentLanguage : 'es');
    const isEn = lang === 'en';
    const L = (typeof getCVLabels === 'function') ? getCVLabels(lang) : {};

    const summaryTitle = L.summary || (isEn ? 'PROFESSIONAL PROFILE' : 'PERFIL PROFESIONAL');
    const expTitle = L.experience || (isEn ? 'CAREER TIMELINE' : 'TRAYECTORIA LABORAL');
    const eduTitle = L.education || (isEn ? 'ACADEMIC BACKGROUND' : 'FORMACIÓN ACADÉMICA');
    const skillsTitle = L.skills || (isEn ? 'CORE COMPETENCIES & STACK' : 'HABILIDADES & STACK TÉCNICO');
    const projTitle = L.projects || (isEn ? 'KEY DELIVERIES & PROJECTS' : 'PROYECTOS DESTACADOS');
    const certTitle = L.certifications || (isEn ? 'CREDENTIALS & CERTIFICATIONS' : 'CERTIFICACIONES PROFESIONALES');

    const p = data.personal || {};
    const s = data.skills || {};

    const photoHtml = (data.settings && data.settings.showPhoto && p.photoUrl)
      ? `<div class="tl-photo-box"><img src="${p.photoUrl}" class="tl-photo-img" alt="Foto"></div>`
      : '';

    const badgesHtml = (p.badges || []).map(b => `<span class="tl-badge">${b}</span>`).join('');

    const kpisHtml = (data.settings && data.settings.showKpis && (data.kpis || []).length > 0)
      ? `<section class="tl-kpi-row">
          ${data.kpis.map(k => `
            <div class="tl-kpi-card">
              <span class="tl-kpi-num">${k.number}</span>
              <span class="tl-kpi-lbl">${k.label}</span>
            </div>
          `).join('')}
        </section>`
      : '';

    const expHtml = (data.experience || []).map((e, idx) => `
      <div class="tl-event">
        <div class="tl-marker">
          <div class="tl-dot"></div>
          ${idx < data.experience.length - 1 ? '<div class="tl-line"></div>' : ''}
        </div>
        <div class="tl-content">
          <div class="tl-event-header">
            <div>
              <span class="tl-role">${e.role}</span>
              <span class="tl-company"> &nbsp;•&nbsp; ${e.company}${e.location ? ` (${e.location})` : ''}</span>
            </div>
            <span class="tl-date-badge">${e.period}</span>
          </div>
          <ul class="tl-bullet-list">
            ${(e.bullets || []).map(b => `<li>${b}</li>`).join('')}
          </ul>
        </div>
      </div>
    `).join('');

    const eduHtml = (data.education || []).map((ed, idx) => `
      <div class="tl-event">
        <div class="tl-marker">
          <div class="tl-dot tl-dot-edu"></div>
          ${idx < data.education.length - 1 ? '<div class="tl-line"></div>' : ''}
        </div>
        <div class="tl-content">
          <div class="tl-event-header">
            <div>
              <span class="tl-degree">${ed.degree}</span>
              <span class="tl-school"> &nbsp;•&nbsp; ${ed.school}</span>
            </div>
            <span class="tl-date-badge">${ed.period}</span>
          </div>
          ${ed.details ? `<p class="tl-edu-details">${ed.details}</p>` : ''}
        </div>
      </div>
    `).join('');

    const projHtml = (data.projects || []).map(pr => `
      <div class="tl-project-card">
        <div class="tl-project-head">
          <span class="tl-project-title">${pr.title}</span>
          ${pr.tech ? `<span class="tl-project-tech">${pr.tech}</span>` : ''}
        </div>
        <p class="tl-project-desc">${pr.description}</p>
        ${pr.link ? `<a href="${pr.link}" target="_blank" class="tl-project-link">🔗 ${pr.link}</a>` : ''}
      </div>
    `).join('');

    const certsHtml = (data.certifications || []).map(c => `
      <div class="tl-cert-chip">
        <span class="tl-cert-icon">📜</span>
        <div>
          <div class="tl-cert-name">${c.title}</div>
          <div class="tl-cert-meta">${c.issuer} ${c.year ? `(${c.year})` : ''}</div>
        </div>
      </div>
    `).join('');

    const contactItems = [
      p.location ? `📍 <span>${p.location}</span>` : null,
      p.phone ? `📱 <span>${p.phone}</span>` : null,
      p.email ? `✉️ <a href="mailto:${p.email}">${p.email}</a>` : null,
      p.linkedin ? `🔗 <a href="${p.linkedin}" target="_blank">LinkedIn</a>` : null,
      p.github ? `💻 <a href="${p.github}" target="_blank">GitHub</a>` : null,
      p.website ? `🌐 <a href="${p.website}" target="_blank">Portafolio</a>` : null
    ].filter(Boolean);

    const renderSkillTags = (arr) => (arr || []).map(t => `<span class="tl-skill-tag">${t}</span>`).join('');

    return `
      <div class="cv-document t-timeline theme-${data.settings?.colorTheme || 'oxford'}">
        <!-- Encabezado Ejecutivo Timeline -->
        <header class="tl-header">
          ${photoHtml}
          <div class="tl-header-main">
            <h1 class="tl-name">${p.fullName || (isEn ? 'YOUR FULL NAME' : 'TU NOMBRE COMPLETO')}</h1>
            <div class="tl-headline-box">
              <span class="tl-headline">${p.headline || (isEn ? 'EXECUTIVE TITLE' : 'TITULAR PROFESIONAL')}</span>
            </div>
            ${badgesHtml ? `<div class="tl-badges-row">${badgesHtml}</div>` : ''}
            <div class="tl-contact-strip">
              ${contactItems.map(c => `<div class="tl-contact-item">${c}</div>`).join('')}
            </div>
          </div>
        </header>

        ${kpisHtml}

        <!-- Resumen Profesional -->
        ${data.summary ? `
          <section class="tl-section">
            <h3 class="tl-sec-heading">${summaryTitle}</h3>
            <p class="tl-summary-text">${data.summary}</p>
          </section>
        ` : ''}

        <!-- Trayectoria Laboral (Eje Cronológico) -->
        <section class="tl-section">
          <h3 class="tl-sec-heading">${expTitle}</h3>
          <div class="tl-timeline-container">
            ${expHtml}
          </div>
        </section>

        <!-- Formación Académica (Eje Cronológico) -->
        <section class="tl-section">
          <h3 class="tl-sec-heading">${eduTitle}</h3>
          <div class="tl-timeline-container">
            ${eduHtml}
          </div>
        </section>

        <!-- Habilidades & Stack Técnico en Cuadrícula Modular -->
        <section class="tl-section">
          <h3 class="tl-sec-heading">${skillsTitle}</h3>
          <div class="tl-skills-grid">
            ${(s.languages || []).length ? `
              <div class="tl-skill-card">
                <div class="tl-skill-cat">${isEn ? 'Languages' : 'Lenguajes'}</div>
                <div class="tl-tags-box">${renderSkillTags(s.languages)}</div>
              </div>
            ` : ''}
            ${(s.databases || []).length ? `
              <div class="tl-skill-card">
                <div class="tl-skill-cat">${isEn ? 'Databases' : 'Bases de Datos'}</div>
                <div class="tl-tags-box">${renderSkillTags(s.databases)}</div>
              </div>
            ` : ''}
            ${(s.tools || []).length ? `
              <div class="tl-skill-card">
                <div class="tl-skill-cat">${isEn ? 'Tools & Systems' : 'Herramientas & Sistemas'}</div>
                <div class="tl-tags-box">${renderSkillTags(s.tools)}</div>
              </div>
            ` : ''}
            ${(s.softSkills || []).length ? `
              <div class="tl-skill-card">
                <div class="tl-skill-cat">${isEn ? 'Core Competencies' : 'Competencias Clave'}</div>
                <div class="tl-tags-box">${renderSkillTags(s.softSkills)}</div>
              </div>
            ` : ''}
          </div>
        </section>

        <!-- Proyectos Destacados -->
        ${(data.projects || []).length ? `
          <section class="tl-section">
            <h3 class="tl-sec-heading">${projTitle}</h3>
            <div class="tl-projects-list">
              ${projHtml}
            </div>
          </section>
        ` : ''}

        <!-- Certificaciones -->
        ${(data.certifications || []).length ? `
          <section class="tl-section">
            <h3 class="tl-sec-heading">${certTitle}</h3>
            <div class="tl-certs-grid">
              ${certsHtml}
            </div>
          </section>
        ` : ''}
      </div>
    `;
  }
};

if (typeof window !== 'undefined') {
  window.TimelineTemplate = TimelineTemplate;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TimelineTemplate;
}
