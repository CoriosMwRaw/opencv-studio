// Plantilla 2: Industrial & Data Analyst
const DataTemplate = {
  id: 'data',
  name: 'Industrial & Data Analyst (Operaciones / BI)',
  description: 'Destaca indicadores de desempeño, métricas de confiabilidad (MTTR/MTBF), optimización de costos y automatización.',
  render(data) {
    const p = data.personal || {};
    const photoHtml = (data.settings && data.settings.showPhoto && p.photoUrl)
      ? `<div class="cv-photo-wrapper"><img src="${p.photoUrl}" class="cv-photo-img" alt="Foto"></div>`
      : '';

    const kpisHtml = (data.kpis || []).length > 0
      ? `<div class="kpi-banner-industrial">
          ${data.kpis.map(k => `
            <div class="kpi-block">
              <span class="kpi-val">${k.number}</span>
              <span class="kpi-desc">${k.label}</span>
            </div>
          `).join('')}
        </div>`
      : '';

    const expHtml = (data.experience || []).map(e => `
      <div class="exp-industrial-item">
        <div class="exp-ind-head">
          <span class="exp-ind-role">${e.role}</span>
          <span class="exp-ind-date">${e.period}</span>
        </div>
        <div class="exp-ind-company">${e.company} ${e.location ? `• ${e.location}` : ''}</div>
        <ul class="bullet-list">
          ${(e.bullets || []).map(b => `<li>${b}</li>`).join('')}
        </ul>
      </div>
    `).join('');

    const s = data.skills || {};
    const allSkills = [
      ...(s.tools || []),
      ...(s.databases || []),
      ...(s.languages || []),
      ...(s.softSkills || [])
    ];

    return `
      <div class="cv-document t-data theme-${data.settings?.colorTheme || 'teal'}">
        <header class="data-header">
          <div class="data-header-content">
            ${photoHtml}
            <div>
              <h1 class="cv-name">${p.fullName || 'TU NOMBRE'}</h1>
              <div class="cv-headline">${p.headline || 'ANALISTA DE DATOS & OPERACIONES'}</div>
              <div class="contact-inline">
                ${p.phone ? `<span>📞 ${p.phone}</span>` : ''}
                ${p.email ? `<span>✉️ ${p.email}</span>` : ''}
                ${p.location ? `<span>📍 ${p.location}</span>` : ''}
                ${p.linkedin ? `<span>🔗 <a href="${p.linkedin}" target="_blank">LinkedIn</a></span>` : ''}
              </div>
            </div>
          </div>
        </header>

        ${kpisHtml}

        <div class="data-body-container">
          <div class="data-main-col">
            ${data.summary ? `
              <section class="data-section">
                <h3 class="data-title">Perfil Ejecutivo & Operativo</h3>
                <p class="data-summary-text">${data.summary}</p>
              </section>
            ` : ''}

            <section class="data-section">
              <h3 class="data-title">Experiencia en Planta & Proyectos</h3>
              ${expHtml}
            </section>

            ${(data.projects || []).length ? `
              <section class="data-section">
                <h3 class="data-title">Sistemas & Herramientas Desarrolladas</h3>
                <div class="projects-grid">
                  ${data.projects.map(pr => `
                    <div class="project-card">
                      <div class="project-card-header">
                        <strong class="project-title">${pr.title}</strong>
                        <span class="project-tech">${pr.tech}</span>
                      </div>
                      <p class="project-desc">${pr.description}</p>
                    </div>
                  `).join('')}
                </div>
              </section>
            ` : ''}
          </div>

          <div class="data-side-col">
            <section class="data-section">
              <h3 class="data-title">Competencias Técnicas</h3>
              <div class="skill-badges-container">
                ${allSkills.map(sk => `<span class="tag-pill highlight">${sk}</span>`).join('')}
              </div>
            </section>

            <section class="data-section">
              <h3 class="data-title">Formación Académica</h3>
              ${(data.education || []).map(ed => `
                <div class="edu-item">
                  <div class="edu-degree">${ed.degree}</div>
                  <div class="edu-school">${ed.school}</div>
                  <div class="edu-meta">${ed.period}</div>
                </div>
              `).join('')}
            </section>

            ${(data.certifications || []).length ? `
              <section class="data-section">
                <h3 class="data-title">Certificaciones</h3>
                ${data.certifications.map(c => `
                  <div class="cert-item">
                    <div class="cert-title">${c.title}</div>
                    <div class="cert-meta">${c.issuer} (${c.year})</div>
                  </div>
                `).join('')}
              </section>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }
};
