// Plantilla 4: Modern Executive (Doble Columna con Foto y Estilo Contemporáneo)
const ModernTemplate = {
  id: 'modern',
  name: 'Moderna Ejecutiva (Doble Columna con Foto)',
  description: 'Estética contemporánea con barra lateral izquierda en contraste, ideal para roles ejecutivos, consultoría y empresas innovadoras.',
  render(data) {
    const p = data.personal || {};
    const photoHtml = (data.settings && data.settings.showPhoto && p.photoUrl)
      ? `<div class="modern-photo-box"><img src="${p.photoUrl}" class="modern-photo-img" alt="Foto"></div>`
      : '';

    const s = data.skills || {};

    return `
      <div class="cv-document t-modern theme-${data.settings?.colorTheme || 'indigo'}">
        <aside class="modern-left-col">
          ${photoHtml}
          
          <div class="modern-left-sec">
            <h4 class="modern-side-title">Contacto</h4>
            <ul class="modern-contact-list">
              ${p.phone ? `<li>📱 ${p.phone}</li>` : ''}
              ${p.email ? `<li>✉️ ${p.email}</li>` : ''}
              ${p.location ? `<li>📍 ${p.location}</li>` : ''}
              ${p.linkedin ? `<li>🔗 <a href="${p.linkedin}">LinkedIn</a></li>` : ''}
              ${p.github ? `<li>💻 <a href="${p.github}">GitHub</a></li>` : ''}
            </ul>
          </div>

          <div class="modern-left-sec">
            <h4 class="modern-side-title">Habilidades</h4>
            <div class="modern-tags-cloud">
              ${[...(s.languages || []), ...(s.databases || []), ...(s.tools || [])].map(t => `<span class="modern-tag">${t}</span>`).join('')}
            </div>
          </div>

          <div class="modern-left-sec">
            <h4 class="modern-side-title">Educación</h4>
            ${(data.education || []).map(ed => `
              <div class="modern-edu-block">
                <strong>${ed.degree}</strong>
                <p>${ed.school}</p>
                <small>${ed.period}</small>
              </div>
            `).join('')}
          </div>

          ${(data.certifications || []).length ? `
            <div class="modern-left-sec">
              <h4 class="modern-side-title">Certificados</h4>
              ${data.certifications.map(c => `
                <div class="modern-edu-block">
                  <strong>${c.title}</strong>
                  <p>${c.issuer} (${c.year})</p>
                </div>
              `).join('')}
            </div>
          ` : ''}
        </aside>

        <main class="modern-right-col">
          <header class="modern-header">
            <h1 class="modern-name">${p.fullName || 'TU NOMBRE'}</h1>
            <div class="modern-title">${p.headline || 'PUESTO O PROFESIÓN'}</div>
          </header>

          ${data.summary ? `
            <section class="modern-sec">
              <h3 class="modern-sec-heading">Perfil Profesional</h3>
              <p class="modern-text">${data.summary}</p>
            </section>
          ` : ''}

          <section class="modern-sec">
            <h3 class="modern-sec-heading">Experiencia Laboral</h3>
            <div class="modern-timeline">
              ${(data.experience || []).map(e => `
                <div class="modern-job">
                  <div class="modern-job-header">
                    <h4 class="modern-job-role">${e.role}</h4>
                    <span class="modern-job-date">${e.period}</span>
                  </div>
                  <div class="modern-job-company">${e.company}</div>
                  <ul class="bullet-list">
                    ${(e.bullets || []).map(b => `<li>${b}</li>`).join('')}
                  </ul>
                </div>
              `).join('')}
            </div>
          </section>

          ${(data.projects || []).length ? `
            <section class="modern-sec">
              <h3 class="modern-sec-heading">Proyectos Destacados</h3>
              ${data.projects.map(pr => `
                <div class="modern-proj-card">
                  <div class="modern-job-header">
                    <h4 class="modern-job-role">${pr.title}</h4>
                    ${pr.tech ? `<span class="modern-tag-mini">${pr.tech}</span>` : ''}
                  </div>
                  <p class="modern-text">${pr.description}</p>
                </div>
              `).join('')}
            </section>
          ` : ''}
        </main>
      </div>
    `;
  }
};
