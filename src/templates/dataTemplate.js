// Plantilla 2: Industrial & Data Analyst
const DataTemplate = {
  id: 'data',
  name: 'Industrial & Data Analyst (Operaciones / BI)',
  description: 'Destaca indicadores de desempeño, métricas de confiabilidad (MTTR/MTBF), optimización de costos y automatización.',
  render(data) {
    const lang = data.settings?.cvLanguage || (typeof currentLanguage !== 'undefined' ? currentLanguage : 'es');
    const isEn = lang === 'en';
    const L = (typeof getCVLabels === 'function') ? getCVLabels(lang) : {};

    const summaryTitle = L.summary || (isEn ? 'Professional Summary' : 'Resumen Profesional');
    const expTitle = L.experience || (isEn ? 'Professional Experience' : 'Experiencia Laboral');
    const projTitle = L.projects || (isEn ? 'Key Projects' : 'Proyectos de Optimización');
    const eduTitle = L.education || (isEn ? 'Education' : 'Formación Académica');
    const certTitle = L.certifications || (isEn ? 'Certifications' : 'Certificaciones');
    const skillsTitle = L.skills || (isEn ? 'Core Competencies & Tools' : 'Habilidades Clave & Herramientas');

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
              <h1 class="cv-name">${p.fullName || (isEn ? 'YOUR NAME' : 'TU NOMBRE')}</h1>
              <div class="cv-headline">${p.headline || (isEn ? 'DATA ANALYST & OPERATIONS' : 'ANALISTA DE DATOS & OPERACIONES')}</div>
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

        <div class="data-body-grid">
          <main class="data-main">
            ${data.summary ? `
              <section class="data-sec">
                <h3 class="data-sec-title">${summaryTitle}</h3>
                <p class="summary-text">${data.summary}</p>
              </section>
            ` : ''}

            <section class="data-sec">
              <h3 class="data-sec-title">${expTitle}</h3>
              ${expHtml}
            </section>

            ${(data.projects || []).length ? `
              <section class="data-sec">
                <h3 class="data-sec-title">${projTitle}</h3>
                ${data.projects.map(pr => `
                  <div class="proj-industrial-item">
                    <strong>${pr.title}</strong> ${pr.tech ? `<small>(${pr.tech})</small>` : ''}
                    <p>${pr.description}</p>
                  </div>
                `).join('')}
              </section>
            ` : ''}
          </main>

          <aside class="data-aside">
            <div class="data-sec">
              <h3 class="data-sec-title">${skillsTitle}</h3>
              <div class="data-chips">
                ${allSkills.map(sk => `<span class="data-chip">${sk}</span>`).join('')}
              </div>
            </div>

            <div class="data-sec">
              <h3 class="data-sec-title">${eduTitle}</h3>
              ${(data.education || []).map(ed => `
                <div class="data-edu-item">
                  <strong>${ed.degree}</strong>
                  <div>${ed.school}</div>
                  <small>${ed.period} ${ed.details ? `• ${ed.details}` : ''}</small>
                </div>
              `).join('')}
            </div>

            ${(data.certifications || []).length ? `
              <div class="data-sec">
                <h3 class="data-sec-title">${certTitle}</h3>
                ${data.certifications.map(c => `
                  <div class="data-edu-item">
                    <strong>${c.title}</strong>
                    <div>${c.issuer} (${c.year})</div>
                  </div>
                `).join('')}
              </div>
            ` : ''}
          </aside>
        </div>
      </div>
    `;
  }
};

if (typeof window !== 'undefined') {
  window.DataTemplate = DataTemplate;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DataTemplate;
}
