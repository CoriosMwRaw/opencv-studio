// Plantilla 6: Compact Executive (Elegante de 1 Página)
// Diseñada para condensar eficientemente toda la experiencia en 1 sola hoja carta sin saturación
const CompactTemplate = {
  id: 'compact',
  name: 'Elegante Compacta (1 Página sin Saturación)',
  description: 'Diseño optimizado para condensar la trayectoria en una sola página con máxima legibilidad, estructura limpia y 100% de compatibilidad ATS.',
  render(data) {
    const lang = data.settings?.cvLanguage || (typeof currentLanguage !== 'undefined' ? currentLanguage : 'es');
    const isEn = lang === 'en';
    const L = (typeof getCVLabels === 'function') ? getCVLabels(lang) : {};

    const summaryTitle = L.summary || (isEn ? 'SUMMARY' : 'PERFIL');
    const expTitle = L.experience || (isEn ? 'EXPERIENCE' : 'EXPERIENCIA');
    const eduTitle = L.education || (isEn ? 'EDUCATION' : 'EDUCACIÓN');
    const skillsTitle = L.skills || (isEn ? 'SKILLS' : 'HABILIDADES');
    const projTitle = L.projects || (isEn ? 'PROJECTS' : 'PROYECTOS');
    const certTitle = L.certifications || (isEn ? 'CERTIFICATIONS' : 'CERTIFICACIONES');

    const p = data.personal || {};
    const s = data.skills || {};

    const contactItems = [
      p.location || null,
      p.phone || null,
      p.email ? `<a href="mailto:${p.email}">${p.email}</a>` : null,
      p.linkedin ? `<a href="${p.linkedin}" target="_blank">LinkedIn</a>` : null,
      p.github ? `<a href="${p.github}" target="_blank">GitHub</a>` : null
    ].filter(Boolean).join(' &nbsp;•&nbsp; ');

    const expHtml = (data.experience || []).map(e => `
      <div class="compact-job">
        <div class="compact-head">
          <span class="compact-role"><strong>${e.role}</strong> — ${e.company}${e.location ? ` (${e.location})` : ''}</span>
          <span class="compact-date">${e.period}</span>
        </div>
        <ul class="compact-list">
          ${(e.bullets || []).map(b => `<li>${b}</li>`).join('')}
        </ul>
      </div>
    `).join('');

    const eduHtml = (data.education || []).map(ed => `
      <div class="compact-edu-row">
        <div><strong>${ed.degree}</strong> &nbsp;—&nbsp; ${ed.school}</div>
        <span class="compact-date">${ed.period}</span>
      </div>
      ${ed.details ? `<div class="compact-subtext">${ed.details}</div>` : ''}
    `).join('');

    const projHtml = (data.projects || []).map(pr => `
      <div class="compact-proj">
        <div class="compact-head">
          <span><strong>${pr.title}</strong> ${pr.tech ? `<em>[${pr.tech}]</em>` : ''}</span>
          ${pr.link ? `<a href="${pr.link}" target="_blank" class="compact-link">🔗 Enlace</a>` : ''}
        </div>
        <p class="compact-desc">${pr.description}</p>
      </div>
    `).join('');

    const allSkills = [
      (s.languages || []).length ? `<strong>${isEn ? 'Languages' : 'Lenguajes'}:</strong> ${s.languages.join(', ')}` : null,
      (s.databases || []).length ? `<strong>${isEn ? 'Databases' : 'Bases de Datos'}:</strong> ${s.databases.join(', ')}` : null,
      (s.tools || []).length ? `<strong>${isEn ? 'Tools' : 'Herramientas'}:</strong> ${s.tools.join(', ')}` : null,
      (s.softSkills || []).length ? `<strong>${isEn ? 'Skills' : 'Habilidades'}:</strong> ${s.softSkills.join(', ')}` : null
    ].filter(Boolean);

    return `
      <div class="cv-document t-compact theme-${data.settings?.colorTheme || 'oxford'}">
        <header class="compact-header">
          <h1 class="compact-name">${p.fullName || (isEn ? 'FULL NAME' : 'NOMBRE COMPLETO')}</h1>
          ${p.headline ? `<div class="compact-headline">${p.headline}</div>` : ''}
          <div class="compact-contact">${contactItems}</div>
        </header>

        ${data.summary ? `
          <section class="compact-sec">
            <h3 class="compact-sec-title">${summaryTitle}</h3>
            <p class="compact-summary-text">${data.summary}</p>
          </section>
        ` : ''}

        <section class="compact-sec">
          <h3 class="compact-sec-title">${expTitle}</h3>
          ${expHtml}
        </section>

        ${(data.projects || []).length ? `
          <section class="compact-sec">
            <h3 class="compact-sec-title">${projTitle}</h3>
            ${projHtml}
          </section>
        ` : ''}

        <section class="compact-sec">
          <h3 class="compact-sec-title">${eduTitle}</h3>
          ${eduHtml}
        </section>

        ${allSkills.length ? `
          <section class="compact-sec">
            <h3 class="compact-sec-title">${skillsTitle}</h3>
            <div class="compact-skills-text">
              ${allSkills.join(' &nbsp;|&nbsp; ')}
            </div>
          </section>
        ` : ''}

        ${(data.certifications || []).length ? `
          <section class="compact-sec">
            <h3 class="compact-sec-title">${certTitle}</h3>
            <div class="compact-certs-text">
              ${data.certifications.map(c => `<span>• <strong>${c.title}</strong> (${c.issuer}, ${c.year || ''})</span>`).join(' ')}
            </div>
          </section>
        ` : ''}
      </div>
    `;
  }
};

if (typeof window !== 'undefined') {
  window.CompactTemplate = CompactTemplate;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CompactTemplate;
}
