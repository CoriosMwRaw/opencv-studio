// Plantilla 3: ATS Minimalist Classic (100% compatible con lectores de robots)
const ATSTemplate = {
  id: 'ats',
  name: 'ATS Minimalista Clásico (Filtros Automáticos)',
  description: 'Diseño en una sola columna con jerarquía estándar y alto contraste, garantizando 100% de legibilidad en filtros ATS de grandes empresas.',
  render(data) {
    const p = data.personal || {};
    const s = data.skills || {};

    const contactItems = [
      p.phone ? `Tel: ${p.phone}` : null,
      p.email ? `Email: ${p.email}` : null,
      p.location ? `Ubicación: ${p.location}` : null,
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
          <h1 class="ats-name">${p.fullName || 'NOMBRE COMPLETO'}</h1>
          <div class="ats-sub">${p.headline || 'TITULAR PROFESIONAL'}</div>
          <div class="ats-contact">${contactItems}</div>
        </header>

        ${data.summary ? `
          <section class="ats-section">
            <h2 class="ats-title">RESUMEN PROFESIONAL</h2>
            <div class="ats-divider"></div>
            <p class="ats-text">${data.summary}</p>
          </section>
        ` : ''}

        <section class="ats-section">
          <h2 class="ats-title">HABILIDADES Y COMPETENCIAS TÉCNICAS</h2>
          <div class="ats-divider"></div>
          <p class="ats-text">
            ${(s.languages || []).length ? `<strong>Lenguajes:</strong> ${s.languages.join(', ')}<br>` : ''}
            ${(s.databases || []).length ? `<strong>Bases de Datos:</strong> ${s.databases.join(', ')}<br>` : ''}
            ${(s.tools || []).length ? `<strong>Herramientas & Sistemas:</strong> ${s.tools.join(', ')}<br>` : ''}
            ${(s.softSkills || []).length ? `<strong>Metodologías:</strong> ${s.softSkills.join(', ')}` : ''}
          </p>
        </section>

        <section class="ats-section">
          <h2 class="ats-title">EXPERIENCIA LABORAL</h2>
          <div class="ats-divider"></div>
          ${expHtml}
        </section>

        ${projHtml ? `
          <section class="ats-section">
            <h2 class="ats-title">PROYECTOS TÉCNICOS DESTACADOS</h2>
            <div class="ats-divider"></div>
            ${projHtml}
          </section>
        ` : ''}

        <section class="ats-section">
          <h2 class="ats-title">EDUCACIÓN</h2>
          <div class="ats-divider"></div>
          ${eduHtml}
        </section>

        ${(data.certifications || []).length ? `
          <section class="ats-section">
            <h2 class="ats-title">CERTIFICACIONES</h2>
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
