// Plantilla 1: Tech & Software Developer
const TechTemplate = {
  id: 'tech',
  name: 'Tech & Desarrollador (Sistemas / Software)',
  description: 'Optimizada para desarrolladores, programadores e ingenieros de software, destacando proyectos, GitHub y stack técnico.',
  render(data) {
    const p = data.personal || {};
    const photoHtml = (data.settings && data.settings.showPhoto && p.photoUrl)
      ? `<div class="cv-photo-wrapper"><img src="${p.photoUrl}" class="cv-photo-img" alt="Foto"></div>`
      : '';

    const badgesHtml = (p.badges || []).map(b => `<span class="h-badge">${b}</span>`).join('');
    
    const kpisHtml = (data.settings && data.settings.showKpis && (data.kpis || []).length > 0)
      ? `<section class="kpi-bar">
          ${data.kpis.map(k => `
            <div class="kpi-card">
              <div class="kpi-number">${k.number}</div>
              <div class="kpi-label">${k.label}</div>
            </div>
          `).join('')}
        </section>`
      : '';

    const expHtml = (data.experience || []).map(e => `
      <div class="job-card">
        <div class="job-header">
          <span class="job-role">${e.role}</span>
          <span class="job-period">${e.period}</span>
        </div>
        <div class="job-company">${e.company} ${e.location ? `• ${e.location}` : ''}</div>
        <ul class="bullet-list">
          ${(e.bullets || []).map(b => `<li>${b}</li>`).join('')}
        </ul>
      </div>
    `).join('');

    const projectsHtml = (data.projects || []).map(pr => `
      <div class="project-card">
        <div class="project-card-header">
          <span class="project-title">${pr.title}</span>
          ${pr.tech ? `<span class="project-tech">${pr.tech}</span>` : ''}
        </div>
        <p class="project-desc">${pr.description}</p>
        ${pr.link ? `<div class="project-link"><a href="${pr.link}" target="_blank">🔗 ${pr.link}</a></div>` : ''}
      </div>
    `).join('');

    const eduHtml = (data.education || []).map(ed => `
      <div class="edu-item">
        <div class="edu-degree">${ed.degree}</div>
        <div class="edu-school">${ed.school}</div>
        <div class="edu-meta">${ed.period} ${ed.details ? `| ${ed.details}` : ''}</div>
      </div>
    `).join('');

    const certsHtml = (data.certifications || []).map(c => `
      <div class="cert-item">
        <div class="cert-title">${c.title}</div>
        <div class="cert-meta">${c.issuer} ${c.year ? `(${c.year})` : ''}</div>
      </div>
    `).join('');

    const s = data.skills || {};
    const renderTags = (arr, highlight = false) => (arr || []).map(t => `<span class="tag-pill ${highlight ? 'highlight' : ''}">${t}</span>`).join('');

    return `
      <div class="cv-document t-tech theme-${data.settings?.colorTheme || 'navy'}">
        <header class="cv-header">
          ${photoHtml}
          <div class="header-main">
            <h1 class="cv-name">${p.fullName || 'TU NOMBRE'}</h1>
            <div class="cv-headline">${p.headline || 'TITULAR PROFESIONAL'}</div>
            ${badgesHtml ? `<div class="header-badges">${badgesHtml}</div>` : ''}
          </div>
        </header>

        <div class="contact-strip">
          ${p.phone ? `<div class="contact-item">📞 <span>${p.phone}</span></div>` : ''}
          ${p.email ? `<div class="contact-item">✉️ <span>${p.email}</span></div>` : ''}
          ${p.location ? `<div class="contact-item">📍 <span>${p.location}</span></div>` : ''}
          ${p.linkedin ? `<div class="contact-item">🔗 <a href="${p.linkedin}" target="_blank">LinkedIn</a></div>` : ''}
          ${p.github ? `<div class="contact-item">💻 <a href="${p.github}" target="_blank">GitHub</a></div>` : ''}
        </div>

        ${kpisHtml}

        <div class="cv-layout">
          <aside class="sidebar">
            <div class="sec-group">
              <h3 class="sec-title">Stack Técnico</h3>
              ${(s.languages || []).length ? `<div class="side-group-title">Lenguajes</div><div class="skill-badges-container">${renderTags(s.languages, true)}</div>` : ''}
              ${(s.databases || []).length ? `<div class="side-group-title">Bases de Datos</div><div class="skill-badges-container">${renderTags(s.databases, true)}</div>` : ''}
              ${(s.tools || []).length ? `<div class="side-group-title">Herramientas & BI</div><div class="skill-badges-container">${renderTags(s.tools)}</div>` : ''}
              ${(s.softSkills || []).length ? `<div class="side-group-title">Habilidades Blandas</div><div class="skill-badges-container">${renderTags(s.softSkills)}</div>` : ''}
            </div>

            <div class="sec-group">
              <h3 class="sec-title">Educación</h3>
              ${eduHtml}
            </div>

            ${certsHtml ? `
              <div class="sec-group">
                <h3 class="sec-title">Certificaciones</h3>
                ${certsHtml}
              </div>
            ` : ''}
          </aside>

          <main class="main-content">
            ${data.summary ? `
              <section class="cv-section">
                <h3 class="sec-title">Perfil Profesional</h3>
                <div class="summary-box">${data.summary}</div>
              </section>
            ` : ''}

            <section class="cv-section">
              <h3 class="sec-title">Experiencia Laboral</h3>
              <div class="timeline">${expHtml}</div>
            </section>

            ${projectsHtml ? `
              <section class="cv-section">
                <h3 class="sec-title">Proyectos Destacados</h3>
                <div class="projects-grid">${projectsHtml}</div>
              </section>
            ` : ''}
          </main>
        </div>
      </div>
    `;
  }
};
