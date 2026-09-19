// Plantilla 4: Modern Executive (Doble Columna con Foto y Estilo Contemporáneo)
const ModernTemplate = {
  id: 'modern',
  name: 'Moderna Ejecutiva (Doble Columna con Foto)',
  description: 'Estética contemporánea con barra lateral izquierda en contraste, ideal para roles ejecutivos, consultoría y empresas innovadoras.',
  render(data) {
    const lang = data.settings?.cvLanguage || (typeof currentLanguage !== 'undefined' ? currentLanguage : 'es');
    const isEn = lang === 'en';
    const L = (typeof getCVLabels === 'function') ? getCVLabels(lang) : {};

    const contactTitle = L.contact || (isEn ? 'Contact' : 'Contacto');
    const skillsTitle = L.skills || (isEn ? 'Skills' : 'Habilidades');
    const eduTitle = L.education || (isEn ? 'Education' : 'Educación');
    const certTitle = L.certifications || (isEn ? 'Certifications' : 'Certificados');
    const summaryTitle = L.summary || (isEn ? 'Professional Profile' : 'Perfil Profesional');
    const expTitle = L.experience || (isEn ? 'Work Experience' : 'Experiencia Laboral');
    const projTitle = L.projects || (isEn ? 'Featured Projects' : 'Proyectos Destacados');

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
            <h4 class="modern-side-title">${contactTitle}</h4>
            <ul class="modern-contact-list">
              ${p.phone ? `<li>📱 ${p.phone}</li>` : ''}
              ${p.email ? `<li>✉️ ${p.email}</li>` : ''}
              ${p.location ? `<li>📍 ${p.location}</li>` : ''}
              ${p.linkedin ? `<li>🔗 <a href="${p.linkedin}">LinkedIn</a></li>` : ''}
              ${p.github ? `<li>💻 <a href="${p.github}">GitHub</a></li>` : ''}
            </ul>
          </div>

          <div class="modern-left-sec">
            <h4 class="modern-side-title">${skillsTitle}</h4>
            <div class="modern-tags-cloud">
              ${[...(s.languages || []), ...(s.databases || []), ...(s.tools || [])].map(t => `<span class="modern-tag">${t}</span>`).join('')}
            </div>
          </div>

          <div class="modern-left-sec">
            <h4 class="modern-side-title">${eduTitle}</h4>
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
              <h4 class="modern-side-title">${certTitle}</h4>
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
            <h1 class="modern-name">${p.fullName || (isEn ? 'YOUR NAME' : 'TU NOMBRE')}</h1>
            <div class="modern-headline">${p.headline || (isEn ? 'PROFESSIONAL EXECUTIVE' : 'TITULAR PROFESIONAL')}</div>
          </header>

          ${data.summary ? `
            <section class="modern-main-sec">
              <h3 class="modern-sec-heading">${summaryTitle}</h3>
              <p class="modern-summary">${data.summary}</p>
            </section>
          ` : ''}

          <section class="modern-main-sec">
            <h3 class="modern-sec-heading">${expTitle}</h3>
            ${(data.experience || []).map(e => `
              <div class="modern-job-item">
                <div class="modern-job-header">
                  <strong>${e.role}</strong>
                  <span class="modern-job-period">${e.period}</span>
                </div>
                <div class="modern-job-company">${e.company} ${e.location ? `• ${e.location}` : ''}</div>
                <ul class="modern-bullets">
                  ${(e.bullets || []).map(b => `<li>${b}</li>`).join('')}
                </ul>
              </div>
            `).join('')}
          </section>

          ${(data.projects || []).length ? `
            <section class="modern-main-sec">
              <h3 class="modern-sec-heading">${projTitle}</h3>
              ${data.projects.map(pr => `
                <div class="modern-proj-item">
                  <div style="font-weight:700; color:#0f172a;">${pr.title}</div>
                  <small style="color:#64748b;">${pr.tech || ''}</small>
                  <p style="margin-top:3px; font-size:11.5px; color:#334155;">${pr.description}</p>
                </div>
              `).join('')}
            </section>
          ` : ''}
        </main>
      </div>
    `;
  }
};
