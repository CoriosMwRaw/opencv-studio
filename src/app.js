// ==========================================================================
// OpenCV Studio - Controlador Principal
// ==========================================================================

const storage = new CVStorage();
let currentProfile = null;
let currentZoom = 1.0;
let activeTargetBulletInput = null;
let activeTargetBulletExpIndex = null;
let currentBulletBankFilterText = '';
let currentBulletBankCategory = 'all';

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Registro de Plantillas disponibles
const templates = {
  tech: TechTemplate,
  harvard: HarvardTemplate,
  timeline: TimelineTemplate,
  data: DataTemplate,
  modern: ModernTemplate,
  compact: CompactTemplate
};

// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', () => {
  initProfileSelector();
  loadCurrentProfile();
  if (typeof applyTranslations === 'function') {
    applyTranslations(currentLanguage);
  }
  setupEventListeners();
  updatePreview();
});

// Inicializar Selector de Perfiles
function initProfileSelector() {
  const select = document.getElementById('profileSelect');
  if (!select) return;
  select.innerHTML = '';
  const profiles = storage.getAllProfiles();
  const activeId = storage.getActiveProfileId();

  Object.values(profiles).forEach(prof => {
    const opt = document.createElement('option');
    opt.value = prof.id;
    opt.textContent = prof.name || prof.personal?.fullName || 'Perfil';
    if (prof.id === activeId) opt.selected = true;
    select.appendChild(opt);
  });

  // Acceso directo a administración/eliminación desde el selector
  const sep = document.createElement('option');
  sep.disabled = true;
  sep.textContent = '──────────';
  select.appendChild(sep);

  const optManage = document.createElement('option');
  optManage.value = '__manage__';
  optManage.textContent = '⚙️ Administrar / Eliminar...';
  select.appendChild(optManage);
}

// Cargar Datos del Perfil Activo en el Formulario
function loadCurrentProfile() {
  currentProfile = storage.getActiveProfile();

  if (!currentProfile.settings) {
    currentProfile.settings = { template: 'tech', colorTheme: 'navy', showPhoto: true, showKpis: true, cvLanguage: currentLanguage };
  }
  if (!currentProfile.settings.cvLanguage) {
    currentProfile.settings.cvLanguage = (typeof currentLanguage !== 'undefined' ? currentLanguage : 'es');
  }
  const cvLangSelect = document.getElementById('select_cv_lang');
  if (cvLangSelect) {
    cvLangSelect.value = currentProfile.settings.cvLanguage;
  }

  // Normalizar experiencia para garantizar que exp.bullets siempre exista
  if (Array.isArray(currentProfile.experience)) {
    currentProfile.experience.forEach(exp => {
      if (!Array.isArray(exp.bullets)) {
        exp.bullets = Array.isArray(exp.achievements) ? [...exp.achievements] : [];
      }
      exp.achievements = exp.bullets;
    });
  }

  // 1. Datos Personales
  const p = currentProfile.personal || {};
  document.getElementById('in_fullName').value = p.fullName || '';
  document.getElementById('in_headline').value = p.headline || '';
  document.getElementById('in_phone').value = p.phone || '';
  document.getElementById('in_email').value = p.email || '';
  document.getElementById('in_location').value = p.location || '';
  document.getElementById('in_linkedin').value = p.linkedin || '';
  document.getElementById('in_github').value = p.github || '';

  // Badges
  document.getElementById('in_badges').value = (p.badges || []).join('\n');

  // Foto
  document.getElementById('opt_showPhoto').checked = !!currentProfile.settings.showPhoto;

  // 2. Resumen
  document.getElementById('in_summary').value = currentProfile.summary || '';

  // 3. Opciones de Plantilla y Color
  document.getElementById('select_template').value = currentProfile.settings.template || 'tech';
  document.getElementById('select_theme').value = currentProfile.settings.colorTheme || 'navy';
  document.getElementById('opt_showKpis').checked = currentProfile.settings.showKpis !== false;

  // 4. Renderizar Listas Dinámicas
  renderKpisEditor();
  renderExperienceEditor();
  renderProjectsEditor();
  renderEducationEditor();
  renderSkillsEditor();
  renderCertificationsEditor();
}

// Escuchadores de Eventos
function setupEventListeners() {
  // Cambio de Perfil
  document.getElementById('profileSelect').addEventListener('change', (e) => {
    if (e.target.value === '__manage__') {
      initProfileSelector();
      openProfileManager();
      return;
    }
    storage.setActiveProfile(e.target.value);
    loadCurrentProfile();
    updatePreview();
  });

  // Inputs con auto-guardado en tiempo real
  const basicInputs = ['in_fullName', 'in_headline', 'in_phone', 'in_email', 'in_location', 'in_linkedin', 'in_github', 'in_summary'];
  basicInputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', () => {
        syncFormData();
        updatePreview();
      });
    }
  });

  // Badges
  document.getElementById('in_badges').addEventListener('input', (e) => {
    currentProfile.personal.badges = e.target.value.split('\n').map(b => b.trim()).filter(Boolean);
    persistAndRefresh();
  });

  // Checkboxes
  document.getElementById('opt_showPhoto').addEventListener('change', (e) => {
    currentProfile.settings.showPhoto = e.target.checked;
    persistAndRefresh();
  });

  document.getElementById('opt_showKpis').addEventListener('change', (e) => {
    currentProfile.settings.showKpis = e.target.checked;
    persistAndRefresh();
  });

  // Selectores de plantilla, tema e idioma
  document.getElementById('select_template').addEventListener('change', (e) => {
    currentProfile.settings.template = e.target.value;
    persistAndRefresh();
  });

  document.getElementById('select_theme').addEventListener('change', (e) => {
    currentProfile.settings.colorTheme = e.target.value;
    persistAndRefresh();
  });

  const cvLangEl = document.getElementById('select_cv_lang');
  if (cvLangEl) {
    cvLangEl.addEventListener('change', (e) => {
      changeCvLanguage(e.target.value);
    });
  }

  // Carga de Foto
  document.getElementById('photoFileInput').addEventListener('change', handlePhotoUpload);

  // Acordeones: toggle limpio y controlado
  document.querySelectorAll('.acc-header').forEach(header => {
    header.addEventListener('click', (ev) => {
      ev.stopPropagation();
      const card = header.closest('.acc-card');
      if (card) {
        card.classList.toggle('open');
      }
    });
  });

  // Escuchar eventos de pantalla completa (Electron y Web)
  if (window.electronAPI && window.electronAPI.onFullScreenChanged) {
    window.electronAPI.onFullScreenChanged((isFull) => {
      updateFullScreenButtonUI(isFull);
    });
  }

  document.addEventListener('fullscreenchange', () => {
    updateFullScreenButtonUI(!!document.fullscreenElement);
  });
}

function expandAllAccordions() {
  document.querySelectorAll('.acc-card').forEach(c => c.classList.add('open'));
}

function collapseAllAccordions() {
  document.querySelectorAll('.acc-card').forEach(c => c.classList.remove('open'));
}

// Sincronizar datos del formulario al objeto en memoria
function syncFormData() {
  currentProfile.personal.fullName = document.getElementById('in_fullName').value;
  currentProfile.personal.headline = document.getElementById('in_headline').value;
  currentProfile.personal.phone = document.getElementById('in_phone').value;
  currentProfile.personal.email = document.getElementById('in_email').value;
  currentProfile.personal.location = document.getElementById('in_location').value;
  currentProfile.personal.linkedin = document.getElementById('in_linkedin').value;
  currentProfile.personal.github = document.getElementById('in_github').value;
  currentProfile.summary = document.getElementById('in_summary').value;

  storage.saveActiveProfile(currentProfile);
}

function persistAndRefresh() {
  storage.saveActiveProfile(currentProfile);
  updatePreview();
}

// Actualizar Previsualización en Tiempo Real
function updatePreview() {
  if (!currentProfile) return;
  const canvas = document.getElementById('cvPaperTarget');
  if (!canvas) return;
  const templateId = (currentProfile.settings && currentProfile.settings.template) || 'tech';
  const templateObj = templates[templateId] || templates['tech'];
  if (!templateObj) return;

  canvas.innerHTML = templateObj.render(currentProfile);
}

// -------------------------------------------------------------
// RENDERIZADORES DINÁMICOS DEL EDITOR
// -------------------------------------------------------------

// Experiencia Laboral
function renderExperienceEditor() {
  const container = document.getElementById('experienceList');
  if (!container) return;
  container.innerHTML = '';
  const lang = (typeof currentLanguage !== 'undefined' ? currentLanguage : 'es');
  const isEn = lang === 'en';

  ((currentProfile && currentProfile.experience) || []).forEach((exp, idx) => {
    const item = document.createElement('div');
    item.className = 'item-box';
    item.id = `item_exp_${idx}`;
    const defaultRole = t('exp.newRole', lang);
    const roleLabel = t('exp.role', lang);
    const companyLabel = t('exp.company', lang);
    const periodLabel = t('exp.period', lang);
    const locationLabel = t('exp.location', lang);
    const bulletsLabel = t('exp.bullets', lang);
    const phraseBankBtn = t('btn.phraseBank', lang);
    const deleteTitle = t('exp.delete', lang);

    item.innerHTML = `
      <div class="item-box-header" onclick="toggleItemCollapse('item_exp_${idx}')">
        <span class="item-box-title">
          <span>💼 #${idx + 1}: ${escapeHtml(exp.role || defaultRole)}</span>
        </span>
        <div style="display:flex; gap:6px; align-items:center;">
          <span style="font-size:11px; color:#94a3b8;">▼</span>
          <button class="app-btn app-btn-danger app-btn-icon" onclick="event.stopPropagation(); deleteExperience(${idx})" title="${deleteTitle}">🗑️</button>
        </div>
      </div>
      <div class="item-box-body">
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">${roleLabel}</label>
            <input type="text" class="form-input" value="${escapeHtml(exp.role || '')}" oninput="updateExpField(${idx}, 'role', this.value)" placeholder="${t('exp.rolePlaceholder', lang)}">
          </div>
          <div class="form-group">
            <label class="form-label">${companyLabel}</label>
            <input type="text" class="form-input" value="${escapeHtml(exp.company || '')}" oninput="updateExpField(${idx}, 'company', this.value)" placeholder="${t('exp.companyPlaceholder', lang)}">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">${periodLabel}</label>
            <input type="text" class="form-input" value="${escapeHtml(exp.period || '')}" oninput="updateExpField(${idx}, 'period', this.value)" placeholder="${t('exp.periodPlaceholder', lang)}">
          </div>
          <div class="form-group">
            <label class="form-label">${locationLabel}</label>
            <input type="text" class="form-input" value="${escapeHtml(exp.location || '')}" oninput="updateExpField(${idx}, 'location', this.value)" placeholder="${t('exp.locationPlaceholder', lang)}">
          </div>
        </div>
        <div class="form-group">
          <div class="form-label">
            <span>${bulletsLabel}</span>
            <button class="app-btn app-btn-outline" style="padding: 2px 7px; font-size: 11px;" onclick="openBulletBankForExp(${idx})">${phraseBankBtn}</button>
          </div>
          <textarea class="form-textarea" rows="4" id="exp_bullets_${idx}" oninput="updateExpBullets(${idx}, this.value)">${escapeHtml((exp.bullets || []).join('\n'))}</textarea>
        </div>
      </div>
    `;
    container.appendChild(item);
  });
}

function toggleItemCollapse(id) {
  const el = document.getElementById(id);
  if (el) el.classList.toggle('collapsed');
}

function addExperience() {
  if (!currentProfile.experience) currentProfile.experience = [];
  currentProfile.experience.push({
    id: 'exp_' + Date.now(),
    role: 'Nuevo Puesto',
    company: 'Empresa',
    period: '2024 – Presente',
    location: '',
    bullets: ['Diseñé e implementé una solución logrando optimizar el proceso en un X%.']
  });
  persistAndRefresh();
  renderExperienceEditor();
}

function updateExpField(idx, field, value) {
  currentProfile.experience[idx][field] = value;
  persistAndRefresh();
}

function updateExpBullets(idx, text) {
  currentProfile.experience[idx].bullets = text.split('\n').map(b => b.trim()).filter(Boolean);
  persistAndRefresh();
}

async function deleteExperience(idx) {
  const exp = currentProfile.experience[idx];
  const roleName = exp ? exp.role : 'puesto laboral';
  const ok = await showAppConfirm('Eliminar Puesto Laboral', `¿Deseas eliminar "${roleName}" de tu currículum?`, {
    type: 'danger',
    icon: '🗑️',
    confirmText: 'Sí, Eliminar',
    cancelText: 'Cancelar'
  });
  if (ok) {
    currentProfile.experience.splice(idx, 1);
    persistAndRefresh();
    renderExperienceEditor();
    showToastNotification('Puesto laboral eliminado', 'info');
  }
}

// Proyectos
function renderProjectsEditor() {
  const container = document.getElementById('projectsList');
  if (!container) return;
  container.innerHTML = '';
  const lang = (typeof currentLanguage !== 'undefined' ? currentLanguage : 'es');

  ((currentProfile && currentProfile.projects) || []).forEach((pr, idx) => {
    const item = document.createElement('div');
    item.className = 'item-box';
    item.id = `item_proj_${idx}`;
    const defaultTitle = t('proj.newTitle', lang);
    const titleLabel = t('proj.title', lang);
    const techLabel = t('proj.tech', lang);
    const linkLabel = t('proj.link', lang);
    const descLabel = t('proj.desc', lang);
    const deleteTitle = t('proj.delete', lang);

    item.innerHTML = `
      <div class="item-box-header" onclick="toggleItemCollapse('item_proj_${idx}')">
        <span class="item-box-title">
          <span>🚀 #${idx + 1}: ${escapeHtml(pr.title || defaultTitle)}</span>
        </span>
        <div style="display:flex; gap:6px; align-items:center;">
          <span style="font-size:11px; color:#94a3b8;">▼</span>
          <button class="app-btn app-btn-danger app-btn-icon" onclick="event.stopPropagation(); deleteProject(${idx})" title="${deleteTitle}">🗑️</button>
        </div>
      </div>
      <div class="item-box-body">
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">${titleLabel}</label>
            <input type="text" class="form-input" value="${escapeHtml(pr.title || '')}" oninput="updateProjField(${idx}, 'title', this.value)" placeholder="${t('proj.titlePlaceholder', lang)}">
          </div>
          <div class="form-group">
            <label class="form-label">${techLabel}</label>
            <input type="text" class="form-input" value="${escapeHtml(pr.tech || '')}" oninput="updateProjField(${idx}, 'tech', this.value)" placeholder="${t('proj.techPlaceholder', lang)}">
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">${linkLabel}</label>
          <input type="text" class="form-input" value="${escapeHtml(pr.link || '')}" oninput="updateProjField(${idx}, 'link', this.value)" placeholder="${t('proj.linkPlaceholder', lang)}">
        </div>
        <div class="form-group">
          <label class="form-label">${descLabel}</label>
          <textarea class="form-textarea" rows="2" oninput="updateProjField(${idx}, 'description', this.value)" placeholder="${t('proj.descPlaceholder', lang)}">${escapeHtml(pr.description || '')}</textarea>
        </div>
      </div>
    `;
    container.appendChild(item);
  });
}

function addProject() {
  if (!currentProfile.projects) currentProfile.projects = [];
  currentProfile.projects.push({
    id: 'proj_' + Date.now(),
    title: 'Nuevo Proyecto',
    tech: 'Tecnologías',
    link: '',
    description: 'Descripción concisa del problema resuelto y tecnologías aplicadas.'
  });
  persistAndRefresh();
  renderProjectsEditor();
}

function updateProjField(idx, field, value) {
  currentProfile.projects[idx][field] = value;
  persistAndRefresh();
}

async function deleteProject(idx) {
  const pr = currentProfile.projects[idx];
  const prTitle = pr ? pr.title : 'proyecto';
  const ok = await showAppConfirm('Eliminar Proyecto', `¿Deseas eliminar "${prTitle}" de tu currículum?`, {
    type: 'danger',
    icon: '🗑️',
    confirmText: 'Sí, Eliminar',
    cancelText: 'Cancelar'
  });
  if (ok) {
    currentProfile.projects.splice(idx, 1);
    persistAndRefresh();
    renderProjectsEditor();
    showToastNotification('Proyecto eliminado', 'info');
  }
}

// Educación
function renderEducationEditor() {
  const container = document.getElementById('educationList');
  if (!container) return;
  container.innerHTML = '';
  const lang = (typeof currentLanguage !== 'undefined' ? currentLanguage : 'es');

  ((currentProfile && currentProfile.education) || []).forEach((ed, idx) => {
    const item = document.createElement('div');
    item.className = 'item-box';
    item.id = `item_edu_${idx}`;
    const defaultDegree = t('edu.newDegree', lang);
    const degreeLabel = t('edu.degree', lang);
    const schoolLabel = t('edu.school', lang);
    const periodLabel = t('edu.period', lang);
    const detailsLabel = t('edu.details', lang);
    const deleteTitle = t('edu.delete', lang);

    item.innerHTML = `
      <div class="item-box-header" onclick="toggleItemCollapse('item_edu_${idx}')">
        <span class="item-box-title">
          <span>🎓 #${idx + 1}: ${escapeHtml(ed.degree || defaultDegree)}</span>
        </span>
        <div style="display:flex; gap:6px; align-items:center;">
          <span style="font-size:11px; color:#94a3b8;">▼</span>
          <button class="app-btn app-btn-danger app-btn-icon" onclick="event.stopPropagation(); deleteEducation(${idx})" title="${deleteTitle}">🗑️</button>
        </div>
      </div>
      <div class="item-box-body">
        <div class="form-group">
          <label class="form-label">${degreeLabel}</label>
          <input type="text" class="form-input" value="${escapeHtml(ed.degree || '')}" oninput="updateEduField(${idx}, 'degree', this.value)" placeholder="${t('edu.degreePlaceholder', lang)}">
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">${schoolLabel}</label>
            <input type="text" class="form-input" value="${escapeHtml(ed.school || '')}" oninput="updateEduField(${idx}, 'school', this.value)" placeholder="${t('edu.schoolPlaceholder', lang)}">
          </div>
          <div class="form-group">
            <label class="form-label">${periodLabel}</label>
            <input type="text" class="form-input" value="${escapeHtml(ed.period || '')}" oninput="updateEduField(${idx}, 'period', this.value)" placeholder="${t('edu.periodPlaceholder', lang)}">
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">${detailsLabel}</label>
          <input type="text" class="form-input" value="${escapeHtml(ed.details || '')}" oninput="updateEduField(${idx}, 'details', this.value)" placeholder="${t('edu.detailsPlaceholder', lang)}">
        </div>
      </div>
    `;
    container.appendChild(item);
  });
}

function addEducation() {
  if (!currentProfile.education) currentProfile.education = [];
  currentProfile.education.push({
    id: 'edu_' + Date.now(),
    degree: 'Carrera / Bachillerato',
    school: 'Institución Educativa',
    period: '2022 – En Curso',
    details: ''
  });
  persistAndRefresh();
  renderEducationEditor();
}

function updateEduField(idx, field, value) {
  currentProfile.education[idx][field] = value;
  persistAndRefresh();
}

async function deleteEducation(idx) {
  const ed = currentProfile.education[idx];
  const edName = ed ? ed.degree : 'registro educativo';
  const ok = await showAppConfirm('Eliminar Formación Educativa', `¿Deseas eliminar "${edName}" de tu currículum?`, {
    type: 'danger',
    icon: '🗑️',
    confirmText: 'Sí, Eliminar',
    cancelText: 'Cancelar'
  });
  if (ok) {
    currentProfile.education.splice(idx, 1);
    persistAndRefresh();
    renderEducationEditor();
    showToastNotification('Registro educativo eliminado', 'info');
  }
}

// Habilidades
function renderSkillsEditor() {
  const s = currentProfile.skills || {};
  document.getElementById('in_skills_lang').value = (s.languages || []).join(', ');
  document.getElementById('in_skills_db').value = (s.databases || []).join(', ');
  document.getElementById('in_skills_tools').value = (s.tools || []).join(', ');
  document.getElementById('in_skills_soft').value = (s.softSkills || []).join(', ');
}

function syncSkills() {
  if (!currentProfile.skills) currentProfile.skills = {};
  currentProfile.skills.languages = document.getElementById('in_skills_lang').value.split(',').map(s => s.trim()).filter(Boolean);
  currentProfile.skills.databases = document.getElementById('in_skills_db').value.split(',').map(s => s.trim()).filter(Boolean);
  currentProfile.skills.tools = document.getElementById('in_skills_tools').value.split(',').map(s => s.trim()).filter(Boolean);
  currentProfile.skills.softSkills = document.getElementById('in_skills_soft').value.split(',').map(s => s.trim()).filter(Boolean);
  persistAndRefresh();
}

// KPIs
function renderKpisEditor() {
  const container = document.getElementById('kpiList');
  if (!container) return;
  container.innerHTML = '';
  const lang = (typeof currentLanguage !== 'undefined' ? currentLanguage : 'es');

  ((currentProfile && currentProfile.kpis) || []).forEach((k, idx) => {
    const row = document.createElement('div');
    row.className = 'kpi-card';
    row.innerHTML = `
      <input type="text" class="form-input" style="width:85px; flex-shrink:0; font-weight:700; color:#38bdf8;" placeholder="${t('kpi.numberPlaceholder', lang)}" value="${escapeHtml(k.number || '')}" oninput="updateKpi(${idx}, 'number', this.value)">
      <input type="text" class="form-input" style="flex:1;" placeholder="${t('kpi.labelPlaceholder', lang)}" value="${escapeHtml(k.label || '')}" oninput="updateKpi(${idx}, 'label', this.value)">
      <button class="app-btn app-btn-danger app-btn-icon" style="flex-shrink:0; padding:5px 8px;" onclick="deleteKpi(${idx})" title="${t('kpi.delete', lang)}">🗑️</button>
    `;
    container.appendChild(row);
  });
}

function addKpi() {
  if (!currentProfile.kpis) currentProfile.kpis = [];
  currentProfile.kpis.push({ number: '100%', label: 'Satisfacción / Calidad' });
  persistAndRefresh();
  renderKpisEditor();
}

function updateKpi(idx, field, val) {
  currentProfile.kpis[idx][field] = val;
  persistAndRefresh();
}

async function deleteKpi(idx) {
  const kpi = currentProfile.kpis[idx];
  const label = kpi ? `${kpi.number || ''} ${kpi.label || ''}`.trim() : 'métrica';
  const ok = await showAppConfirm('Eliminar Métrica', `¿Deseas eliminar la métrica "${label}" de tu currículum?`, {
    type: 'danger',
    icon: '🗑️',
    confirmText: 'Sí, Eliminar',
    cancelText: 'Cancelar'
  });
  if (ok) {
    currentProfile.kpis.splice(idx, 1);
    persistAndRefresh();
    renderKpisEditor();
    showToastNotification('Métrica eliminada', 'info');
  }
}

// Certificaciones
function renderCertificationsEditor() {
  const container = document.getElementById('certList');
  if (!container) return;
  container.innerHTML = '';
  const lang = (typeof currentLanguage !== 'undefined' ? currentLanguage : 'es');

  ((currentProfile && currentProfile.certifications) || []).forEach((c, idx) => {
    const card = document.createElement('div');
    card.className = 'cert-card';
    card.innerHTML = `
      <div style="display:flex; gap:6px; align-items:center;">
        <input type="text" class="form-input" style="flex:1; font-weight:600;" placeholder="${t('cert.titlePlaceholder', lang)}" value="${escapeHtml(c.title || '')}" oninput="updateCert(${idx}, 'title', this.value)">
        <button class="app-btn app-btn-danger app-btn-icon" style="flex-shrink:0; padding:5px 8px;" onclick="deleteCert(${idx})" title="${t('cert.delete', lang)}">🗑️</button>
      </div>
      <div style="display:flex; gap:6px; align-items:center;">
        <input type="text" class="form-input" style="flex:1;" placeholder="${t('cert.issuerPlaceholder', lang)}" value="${escapeHtml(c.issuer || '')}" oninput="updateCert(${idx}, 'issuer', this.value)">
        <input type="text" class="form-input" style="width:75px; flex-shrink:0; text-align:center;" placeholder="${t('cert.yearPlaceholder', lang)}" value="${escapeHtml(c.year || '')}" oninput="updateCert(${idx}, 'year', this.value)">
      </div>
    `;
    container.appendChild(card);
  });
}

function addCert() {
  if (!currentProfile.certifications) currentProfile.certifications = [];
  currentProfile.certifications.push({ title: 'Nueva Certificación', issuer: 'Emisor / Plataforma', year: '2025' });
  persistAndRefresh();
  renderCertificationsEditor();
}

function updateCert(idx, field, val) {
  currentProfile.certifications[idx][field] = val;
  persistAndRefresh();
}

async function deleteCert(idx) {
  const cert = currentProfile.certifications[idx];
  const certTitle = cert ? cert.title : 'certificación';
  const ok = await showAppConfirm('Eliminar Certificación', `¿Deseas eliminar "${certTitle}" de tu currículum?`, {
    type: 'danger',
    icon: '🗑️',
    confirmText: 'Sí, Eliminar',
    cancelText: 'Cancelar'
  });
  if (ok) {
    currentProfile.certifications.splice(idx, 1);
    persistAndRefresh();
    renderCertificationsEditor();
    showToastNotification('Certificación eliminada', 'info');
  }
}

// -------------------------------------------------------------
// MANEJO SEGURO DE FOTOGRAFÍA (Compresión Automática Canvas)
// -------------------------------------------------------------
function triggerPhotoUpload() {
  document.getElementById('photoFileInput').click();
}

function handlePhotoUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    showAppDialog({
      title: 'Formato no compatible',
      message: 'Por favor selecciona un archivo de imagen válido (JPG, PNG o WEBP).',
      type: 'warning',
      icon: '🖼️'
    });
    return;
  }

  const reader = new FileReader();
  reader.onload = function(evt) {
    const img = new Image();
    img.onload = function() {
      // Redimensionar automáticamente a máximo 320x320 para ahorrar memoria y prevenir errores
      const canvas = document.createElement('canvas');
      const maxDim = 320;
      let w = img.width;
      let h = img.height;

      if (w > h) {
        if (w > maxDim) {
          h = Math.round((h * maxDim) / w);
          w = maxDim;
        }
      } else {
        if (h > maxDim) {
          w = Math.round((w * maxDim) / h);
          h = maxDim;
        }
      }

      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);

      const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
      currentProfile.personal.photoUrl = optimizedDataUrl;
      currentProfile.settings.showPhoto = true;
      document.getElementById('opt_showPhoto').checked = true;
      persistAndRefresh();
      showToastNotification('Fotografía actualizada', 'success', 'Imagen optimizada y agregada a tu currículum.');
    };
    img.src = evt.target.result;
  };
  reader.readAsDataURL(file);
}

// -------------------------------------------------------------
// GESTOR DE PERFILES VISUAL (SIN PROMPT)
// -------------------------------------------------------------
function openProfileManager() {
  renderProfileManagerUI();
  document.getElementById('profileManagerModal').classList.add('active');
}

function renderProfileManagerUI() {
  const listContainer = document.getElementById('profileCardsContainer');
  if (!listContainer) return;
  listContainer.innerHTML = '';
  const lang = (typeof currentLanguage !== 'undefined' ? currentLanguage : 'es');

  const profiles = storage.getAllProfiles();
  const activeId = storage.getActiveProfileId();
  const totalProfiles = Object.keys(profiles).length;

  Object.values(profiles).forEach(prof => {
    const isCurrent = prof.id === activeId;
    const card = document.createElement('div');
    card.style.background = isCurrent ? 'rgba(30, 58, 95, 0.75)' : '#182234';
    card.style.border = isCurrent ? '1.5px solid #38bdf8' : '1px solid #334155';
    card.style.padding = '10px 14px';
    card.style.borderRadius = '8px';
    card.style.display = 'flex';
    card.style.justifyContent = 'space-between';
    card.style.alignItems = 'center';
    card.style.gap = '12px';

    card.innerHTML = `
      <div style="min-width:0; flex:1;">
        <div style="font-weight:700; font-size:13.5px; color:#ffffff; display:flex; align-items:center; gap:8px;">
          <span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${escapeHtml(prof.name || prof.personal?.fullName || 'Perfil')}</span>
          ${isCurrent ? `<span style="background:#059669; color:#fff; font-size:10px; font-weight:700; padding:2px 7px; border-radius:10px; flex-shrink:0;">${t('profiles.activeBadge', lang)}</span>` : ''}
        </div>
        <div style="font-size:11.5px; color:#94a3b8; margin-top:3px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
          ${t('profiles.headlineLabel', lang)} ${escapeHtml(prof.personal?.headline || (lang === 'en' ? 'No headline' : 'Sin titular'))} • ${t('profiles.templateLabel', lang)} ${escapeHtml(prof.settings?.template || 'tech')}
        </div>
      </div>
      <div style="display:flex; gap:6px; align-items:center; flex-shrink:0;">
        ${!isCurrent 
          ? `<button class="app-btn app-btn-primary" style="padding:4px 10px; font-size:12px;" onclick="selectProfileFromModal('${prof.id}')" title="Activar este perfil">✓ ${t('profiles.useBtn', lang)}</button>` 
          : `<span style="font-size:11px; color:#38bdf8; font-weight:700; background:rgba(56,189,248,0.12); padding:3px 8px; border-radius:6px; border:1px solid rgba(56,189,248,0.3);">En uso</span>`
        }
        <button class="app-btn app-btn-outline" style="padding:4px 8px; font-size:12px;" onclick="duplicateProfileFromModal('${prof.id}')" title="${t('profiles.duplicateBtn', lang)}">📑 Copiar</button>
        ${totalProfiles > 1 
          ? `<button class="app-btn app-btn-danger" style="padding:4px 9px; font-size:12px;" onclick="deleteProfileFromModal('${prof.id}')" title="${t('profiles.deleteBtn', lang)}">🗑️ Eliminar</button>` 
          : ''
        }
      </div>
    `;
    listContainer.appendChild(card);
  });
}

function selectProfileFromModal(id) {
  storage.setActiveProfile(id);
  initProfileSelector();
  loadCurrentProfile();
  updatePreview();
  closeModal('profileManagerModal');
}

function createNewProfileFromModal() {
  const input = document.getElementById('newProfileNameInput');
  const templateSelect = document.getElementById('newProfileTemplateSelect');
  const name = input.value.trim();

  if (!name) {
    showToastNotification('Nombre requerido', 'warning', 'Por favor ingresa un nombre para identificar el nuevo perfil.');
    input.focus();
    return;
  }

  const newProfile = storage.createProfile(name, templateSelect.value);
  input.value = '';
  initProfileSelector();
  storage.setActiveProfile(newProfile.id);
  document.getElementById('profileSelect').value = newProfile.id;
  loadCurrentProfile();
  updatePreview();
  closeModal('profileManagerModal');
  showToastNotification('Perfil creado con éxito', 'success', `Se ha inicializado el perfil "${name}".`);
}

function duplicateProfileFromModal(id) {
  storage.setActiveProfile(id);
  const dup = storage.duplicateActiveProfile();
  initProfileSelector();
  loadCurrentProfile();
  updatePreview();
  renderProfileManagerUI();
  showToastNotification('Perfil duplicado', 'success', `Copia creada: "${dup?.name || 'Perfil duplicado'}".`);
}

async function deleteProfileFromModal(id) {
  const confirmed = await showAppConfirm('Eliminar Perfil', '¿Estás seguro de que deseas eliminar este perfil? Esta acción no se puede deshacer.', {
    type: 'danger',
    icon: '🗑️',
    confirmText: 'Sí, Eliminar',
    cancelText: 'Cancelar'
  });
  if (confirmed) {
    storage.deleteProfile(id);
    initProfileSelector();
    loadCurrentProfile();
    updatePreview();
    renderProfileManagerUI();
    showToastNotification('Perfil eliminado', 'info', 'El perfil ha sido removido del sistema.');
  }
}

// -------------------------------------------------------------
// MODALES Y ASISTENTES
// -------------------------------------------------------------

function openBulletBankForExp(idx) {
  activeTargetBulletInput = idx;
  activeTargetBulletExpIndex = idx;
  const header = document.getElementById('bulletBankTargetHeader');
  const exp = currentProfile && currentProfile.experience && currentProfile.experience[idx];
  if (header) {
    if (exp) {
      header.innerHTML = `Insertando logro en: <strong style="color:#ffffff;">${escapeHtml(exp.role || 'Puesto #' + (idx + 1))}</strong> en <span style="color:#60a5fa;">${escapeHtml(exp.company || 'Empresa')}</span>`;
    } else {
      header.textContent = 'Selecciona una frase para tu puesto laboral';
    }
  }

  const searchInput = document.getElementById('bulletBankSearch');
  if (searchInput) {
    searchInput.value = '';
    currentBulletBankFilterText = '';
  }
  const catSelect = document.getElementById('bulletBankCategoryFilter');
  if (catSelect) {
    catSelect.value = 'all';
    currentBulletBankCategory = 'all';
  }

  renderBulletBankList();
  document.getElementById('bulletBankModal').classList.add('active');
}

function filterBulletBank(text) {
  currentBulletBankFilterText = (text || '').trim().toLowerCase();
  renderBulletBankList();
}

function filterBulletBankCategory(cat) {
  currentBulletBankCategory = cat || 'all';
  renderBulletBankList();
}

function renderBulletBankList() {
  const content = document.getElementById('bulletBankContent');
  if (!content) return;
  content.innerHTML = '';

  const q = currentBulletBankFilterText;
  const selectedCat = currentBulletBankCategory;
  const lang = (currentProfile?.settings?.cvLanguage) || (typeof currentLanguage !== 'undefined' ? currentLanguage : 'es');
  const activeBank = (typeof getBulletBank === 'function') ? getBulletBank(lang) : bulletBank;
  const isEn = lang === 'en';
  let totalMatches = 0;

  // Renderizar categorías de frases
  if (activeBank) {
    Object.entries(activeBank).forEach(([catKey, catData]) => {
      if (catKey === 'verbos') return;
      if (selectedCat !== 'all' && selectedCat !== catKey) return;

      const items = Array.isArray(catData.items) ? catData.items : [];
      const matchedPhrases = items.filter(phrase => {
        if (!q) return true;
        return phrase.toLowerCase().includes(q) || (catData.category && catData.category.toLowerCase().includes(q));
      });

      if (matchedPhrases.length === 0) return;
      totalMatches += matchedPhrases.length;

      const catBox = document.createElement('div');
      catBox.style.marginBottom = '8px';
      catBox.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <h4 style="color:#60a5fa; font-size:13px; font-weight:700; margin:0; display:flex; align-items:center; gap:6px;">
            <span>📌</span> ${escapeHtml(catData.category)}
          </h4>
          <span style="font-size:11px; color:#64748b; background:#1e293b; padding:2px 8px; border-radius:10px; border:1px solid #334155;">
            ${matchedPhrases.length} frases
          </span>
        </div>
      `;

      const list = document.createElement('div');
      list.style.display = 'flex';
      list.style.flexDirection = 'column';
      list.style.gap = '8px';

      matchedPhrases.forEach(phrase => {
        const item = document.createElement('div');
        item.className = 'bullet-bank-item';

        const highlightedText = escapeHtml(phrase).replace(/\[([^\]]+)\]/g, '<span class="highlight-param">[$1]</span>');

        item.innerHTML = `
          <div class="bullet-bank-text">
            <span style="color:#38bdf8; margin-right:6px; font-weight:bold;">•</span>${highlightedText}
          </div>
          <button class="bullet-bank-add-btn" title="Insertar en mi CV">
            ➕ Usar frase
          </button>
        `;

        item.addEventListener('click', () => insertBulletToActiveExp(phrase));
        list.appendChild(item);
      });

      catBox.appendChild(list);
      content.appendChild(catBox);
    });

    // Renderizar verbos de acción
    if (selectedCat === 'all' || selectedCat === 'verbos') {
      const verbs = activeBank.verbos || [];
      const matchedVerbs = verbs.filter(v => !q || v.toLowerCase().includes(q));

      if (matchedVerbs.length > 0) {
        totalMatches += matchedVerbs.length;
        const verbsBox = document.createElement('div');
        verbsBox.style.marginTop = '10px';
        verbsBox.style.padding = '12px 14px';
        verbsBox.style.background = '#0f172a';
        verbsBox.style.border = '1px solid #334155';
        verbsBox.style.borderRadius = '8px';

        verbsBox.innerHTML = `
          <div style="font-size:12.5px; font-weight:700; color:#38bdf8; margin-bottom:8px; display:flex; align-items:center; gap:6px;">
            <span>⚡</span> ${isEn ? 'Recommended Action Verbs for ATS (click to start phrase):' : 'Verbos de Acción Recomendados para ATS (clic para iniciar frase):'}
          </div>
          <div id="verbsChipContainer" style="display:flex; flex-wrap:wrap; gap:8px;"></div>
        `;

        const chipCont = verbsBox.querySelector('#verbsChipContainer');
        matchedVerbs.forEach(verb => {
          const chip = document.createElement('span');
          chip.className = 'verb-chip';
          chip.innerHTML = `<strong>+</strong> ${escapeHtml(verb)}`;
          chip.title = `${isEn ? 'Start achievement with' : 'Iniciar logro con'} "${verb}"`;
          chip.addEventListener('click', () => {
            const templateVerb = isEn
              ? `${verb} [action executed], achieving [quantifiable metric or outcome].`
              : `${verb} [acción realizada], logrando [resultado medible o beneficio obtenido].`;
            insertBulletToActiveExp(templateVerb);
          });
          chipCont.appendChild(chip);
        });

        content.appendChild(verbsBox);
      }
    }
  }

  if (totalMatches === 0) {
    content.innerHTML = `
      <div style="text-align:center; padding:36px 16px; color:#94a3b8;">
        <div style="font-size:32px; margin-bottom:10px;">🔍</div>
        <div style="font-size:14px; font-weight:600; color:#cbd5e1;">No encontramos frases que coincidan con "${escapeHtml(q)}"</div>
        <div style="font-size:12px; margin-top:6px;">Prueba buscando términos generales como <em>"diseñé"</em>, <em>"SQL"</em>, <em>"mantenimiento"</em> o <em>"scrum"</em>.</div>
      </div>
    `;
  }
}

function insertBulletToActiveExp(phrase) {
  const targetIdx = activeTargetBulletExpIndex !== null ? activeTargetBulletExpIndex : activeTargetBulletInput;
  if (targetIdx === null) return;
  if (!currentProfile || !currentProfile.experience || !currentProfile.experience[targetIdx]) return;

  const exp = currentProfile.experience[targetIdx];
  if (!Array.isArray(exp.bullets)) {
    exp.bullets = Array.isArray(exp.achievements) ? [...exp.achievements] : [];
  }
  exp.bullets.push(phrase);
  exp.achievements = exp.bullets;

  // Sincronizar el textarea del DOM inmediatamente si existe
  const textarea = document.getElementById(`exp_bullets_${targetIdx}`);
  if (textarea) {
    textarea.value = exp.bullets.join('\n');
  }

  persistAndRefresh();
  closeModal('bulletBankModal');

  // Notificación ejecutiva elegante
  showToastNotification('Frase añadida al CV', 'success', `Se integró el logro en "${exp.role || 'Puesto'}".`);
}

let currentAtsResult = null;

function openATSAnalyzer() {
  const modal = document.getElementById('atsModal');
  modal.classList.add('active');

  const scanOverlay = document.getElementById('atsScanOverlay');
  const resultsContainer = document.getElementById('atsResultsContainer');
  const progressFill = document.getElementById('atsScanProgressFill');
  const statusText = document.getElementById('atsScanStatusText');

  // Mostrar escaneo animado
  scanOverlay.style.display = 'flex';
  resultsContainer.style.display = 'none';
  progressFill.style.width = '0%';
  statusText.textContent = 'Iniciando escaneo de estructura sintáctica...';

  setTimeout(() => {
    progressFill.style.width = '35%';
    statusText.textContent = 'Auditando 48 parámetros contra filtros Workday & Taleo...';
  }, 250);

  setTimeout(() => {
    progressFill.style.width = '75%';
    statusText.textContent = 'Analizando densidad de palabras clave y verbos de acción...';
  }, 600);

  setTimeout(() => {
    progressFill.style.width = '100%';
    statusText.textContent = '¡Auditoría completada con éxito!';
  }, 950);

  setTimeout(() => {
    scanOverlay.style.display = 'none';
    resultsContainer.style.display = 'block';
    renderAtsResults();
  }, 1150);
}

function renderAtsResults() {
  const lang = currentProfile?.settings?.cvLanguage || (typeof currentLanguage !== 'undefined' ? currentLanguage : 'es');
  const result = ATSAnalyzer.analyze(currentProfile, lang);
  currentAtsResult = result;

  // 1. Contador animado de puntuación
  const scoreValEl = document.getElementById('atsScoreValue');
  let currentVal = 0;
  const targetVal = result.score;
  const duration = 900;
  const stepTime = 15;
  const steps = duration / stepTime;
  const increment = targetVal / steps;

  const timer = setInterval(() => {
    currentVal += increment;
    if (currentVal >= targetVal) {
      currentVal = targetVal;
      clearInterval(timer);
    }
    scoreValEl.textContent = `${Math.round(currentVal)}%`;
  }, stepTime);

  // 2. Medidor Radial SVG animado
  const circle = document.getElementById('atsGaugeProgressCircle');
  const radius = 50;
  const circumference = 2 * Math.PI * radius; // ~314.16
  circle.style.strokeDasharray = `${circumference}`;
  circle.style.strokeDashoffset = `${circumference}`;
  circle.style.stroke = result.badgeColor;

  setTimeout(() => {
    const offset = circumference - (targetVal / 100) * circumference;
    circle.style.strokeDashoffset = `${offset}`;
  }, 60);

  // 3. Veredicto y Chips
  const badgeEl = document.getElementById('atsVerdictBadge');
  badgeEl.textContent = result.rating;
  badgeEl.style.backgroundColor = result.badgeColor;
  badgeEl.style.boxShadow = `0 2px 10px ${result.badgeColor}55`;

  document.getElementById('atsVerdictText').textContent = result.verdictText;
  document.getElementById('atsChipPassed').textContent = `✓ ${result.passedChecks} Cumplidos`;
  document.getElementById('atsChipFixes').textContent = `⚡ ${result.quickFixes.length} Oportunidades`;

  // 4. Renderizar Pestaña Resumen (Dimensiones)
  const dimGrid = document.getElementById('atsDimensionsGrid');
  dimGrid.innerHTML = '';
  result.dimensions.forEach(d => {
    const card = document.createElement('div');
    card.className = 'ats-dim-card';
    const barColor = d.percentage >= 85 ? '#10b981' : (d.percentage >= 65 ? '#0284c7' : (d.percentage >= 45 ? '#f59e0b' : '#ef4444'));
    card.innerHTML = `
      <div class="ats-dim-head">
        <span class="ats-dim-title">${d.icon} ${escapeHtml(d.title)}</span>
        <span class="ats-dim-score" style="color:${barColor};">${d.score}/${d.max} (${d.percentage}%)</span>
      </div>
      <div class="ats-dim-bar-track">
        <div class="ats-dim-bar-fill" style="width:0%; background:${barColor};" data-target-w="${d.percentage}%"></div>
      </div>
      <div class="ats-dim-snippet">${escapeHtml(d.items[0]?.tip || '')}</div>
    `;
    dimGrid.appendChild(card);
  });

  setTimeout(() => {
    dimGrid.querySelectorAll('.ats-dim-bar-fill').forEach(fill => {
      fill.style.width = fill.getAttribute('data-target-w');
    });
  }, 80);

  // 5. Renderizar Pestaña Auditoría Detallada
  renderAtsAuditItems('all');

  // 6. Renderizar Pestaña Palabras Clave
  const kwCloud = document.getElementById('atsKeywordsCloud');
  kwCloud.innerHTML = '';
  if (result.keywordsFound.length === 0) {
    kwCloud.innerHTML = '<div style="font-size:12px; color:#94a3b8;">No se detectaron palabras clave específicas en las secciones analizadas.</div>';
  } else {
    result.keywordsFound.forEach(kw => {
      const chip = document.createElement('span');
      chip.className = `ats-kw-badge ats-kw-${kw.cat}`;
      chip.textContent = kw.tag;
      kwCloud.appendChild(chip);
    });
  }

  // 7. Renderizar Pestaña Quick Fixes
  const fixesList = document.getElementById('atsFixesList');
  fixesList.innerHTML = '';
  if (result.quickFixes.length === 0) {
    fixesList.innerHTML = '<div style="font-size:12px; color:#10b981; font-weight:700;">¡Felicitaciones! Tu currículum cumple con los 48 parámetros evaluados al 100%.</div>';
  } else {
    result.quickFixes.forEach(fix => {
      const card = document.createElement('div');
      card.className = 'ats-fix-card';
      const badgeText = fix.priority === 'high' ? 'Alta Prioridad' : (fix.priority === 'medium' ? 'Prioridad Media' : 'Sugerencia');
      card.innerHTML = `
        <span class="ats-fix-badge ats-fix-${fix.priority}">${badgeText}</span>
        <p class="ats-fix-text">${escapeHtml(fix.text)}</p>
      `;
      fixesList.appendChild(card);
    });
  }

  switchAtsTab('summary');
}

function switchAtsTab(tabId) {
  const tabs = ['summary', 'audit', 'keywords', 'fixes'];
  tabs.forEach(t => {
    const btn = document.getElementById(`tabBtn${t.charAt(0).toUpperCase() + t.slice(1)}`);
    const content = document.getElementById(`atsTab${t.charAt(0).toUpperCase() + t.slice(1)}`);
    if (btn) btn.classList.toggle('active', t === tabId);
    if (content) content.classList.toggle('active', t === tabId);
  });
}

function filterAtsAudit(filterType, btnEl) {
  if (btnEl) {
    document.querySelectorAll('.ats-filter-btn').forEach(b => b.classList.remove('active'));
    btnEl.classList.add('active');
  }
  renderAtsAuditItems(filterType);
}

function renderAtsAuditItems(filterType) {
  if (!currentAtsResult) return;
  const list = document.getElementById('atsAuditItemsList');
  list.innerHTML = '';

  const allItems = [];
  currentAtsResult.dimensions.forEach(dim => {
    dim.items.forEach(it => {
      allItems.push({ ...it, dimension: dim.title, icon: dim.icon });
    });
  });

  const filtered = allItems.filter(it => {
    if (filterType === 'passed') return it.passed;
    if (filterType === 'needs-fix') return !it.passed;
    return true;
  });

  filtered.forEach(it => {
    const div = document.createElement('div');
    div.className = `ats-audit-item ${it.passed ? 'passed' : 'warn'}`;
    div.innerHTML = `
      <div class="ats-audit-item-top">
        <span>${it.passed ? '✓' : '⚠️'} ${escapeHtml(it.label)}</span>
        <span style="color:${it.passed ? '#34d399' : '#fbbf24'}; font-size:11px;">${it.pts}/${it.max} pts</span>
      </div>
      <div class="ats-audit-item-desc">${escapeHtml(it.tip)}</div>
    `;
    list.appendChild(div);
  });
}

function closeModal(id) {
  document.getElementById(id).classList.remove('active');
}

// -------------------------------------------------------------
// ZOOM Y EXPORTACIÓN
// -------------------------------------------------------------

function changeZoom(factor) {
  if (factor === 'fit') {
    currentZoom = 0.85;
  } else {
    currentZoom = Math.max(0.5, Math.min(1.5, currentZoom + factor));
  }
  const paper = document.getElementById('cvPaperTarget');
  paper.style.transform = `scale(${currentZoom})`;
  document.getElementById('zoomValText').textContent = `${Math.round(currentZoom * 100)}%`;
}

// Control de Pantalla Completa
async function toggleFullScreenMode() {
  if (window.electronAPI && window.electronAPI.toggleFullScreen) {
    const isFull = await window.electronAPI.toggleFullScreen();
    updateFullScreenButtonUI(isFull);
    showToastNotification(
      isFull ? 'Pantalla Completa' : 'Modo Estándar',
      'info',
      isFull ? 'Presiona F11 o el botón superior para salir.' : 'Ventana restaurada a modo estándar.',
      2200
    );
  } else {
    // Alternativa para navegador web
    if (!document.fullscreenElement) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  }
}

function updateFullScreenButtonUI(isFull) {
  const btn = document.getElementById('btnToggleFullScreen');
  if (btn) {
    btn.innerHTML = isFull ? '🗗' : '⛶';
    btn.title = isFull ? 'Salir de pantalla completa (F11)' : 'Pantalla completa (F11)';
  }
}

async function exportToPDF() {
  const candidateName = (currentProfile.personal.fullName || 'Mi_Curriculum').replace(/[^a-zA-Z0-9_]/g, '_');
  const defaultFileName = `CV_${candidateName}.pdf`;

  if (window.electronAPI && window.electronAPI.exportPdf) {
    try {
      const res = await window.electronAPI.exportPdf({ defaultName: defaultFileName, pageSize: 'Letter' });
      if (res.success) {
        showAppDialog({
          title: '¡PDF Exportado con Éxito!',
          subtitle: 'Tu currículum ha sido generado con alta fidelidad y guardado en tu equipo.',
          details: `<span style="color:#94a3b8;">Ubicación:</span><br><code style="word-break:break-all; color:#38bdf8; font-size:11.5px;">${escapeHtml(res.filePath)}</code>`,
          confirmText: '¡Excelente!',
          type: 'success',
          icon: '📄'
        });
      } else if (!res.canceled) {
        showAppDialog({
          title: 'Error al exportar PDF',
          message: res.error || 'No se pudo completar la exportación del PDF.',
          confirmText: 'Cerrar',
          type: 'danger',
          icon: '✕'
        });
      }
    } catch (e) {
      console.error(e);
      window.print();
    }
  } else {
    window.print();
  }
}

async function exportJSON() {
  const { data, filename } = storage.exportProfileJSON();

  if (window.electronAPI && window.electronAPI.saveJsonDialog) {
    const res = await window.electronAPI.saveJsonDialog(data, filename);
    if (res.success) {
      showToastNotification('Respaldo JSON guardado', 'success', 'Archivo exportado exitosamente a tu equipo.');
    }
  } else {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    showToastNotification('Respaldo JSON descargado', 'success', `Se descargó "${filename}".`);
  }
}

async function importJSON() {
  if (window.electronAPI && window.electronAPI.loadJsonDialog) {
    const res = await window.electronAPI.loadJsonDialog();
    if (res.success) {
      storage.importProfileJSON(res.data);
      initProfileSelector();
      loadCurrentProfile();
      updatePreview();
      showToastNotification('Perfil importado con éxito', 'success', 'Los datos del CV fueron restaurados.');
    }
  } else {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (evt) => {
          try {
            const data = JSON.parse(evt.target.result);
            storage.importProfileJSON(data);
            initProfileSelector();
            loadCurrentProfile();
            updatePreview();
            showToastNotification('Perfil importado con éxito', 'success', 'Los datos del CV fueron restaurados.');
          } catch (err) {
            showAppDialog({
              title: 'Error de archivo',
              message: 'El archivo JSON no tiene un formato válido: ' + err.message,
              type: 'danger',
              icon: '❌'
            });
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }
}

// -------------------------------------------------------------
// MÓDULO: INVÍTAME UN CAFÉ / APOYO AL PROYECTO
// -------------------------------------------------------------

function openSupportModal() {
  document.getElementById('supportModal').classList.add('active');
}

function openBuyMeACoffee() {
  const url = 'https://buymeacoffee.com/coriosmwraw';
  if (window.electronAPI && window.electronAPI.openExternal) {
    window.electronAPI.openExternal(url);
  } else {
    window.open(url, '_blank');
  }
}

async function copyClabeToClipboard() {
  const clabe = '638180010128388591';
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(clabe);
    } else {
      const el = document.createElement('textarea');
      el.value = clabe;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
  } catch (err) {
    const el = document.createElement('textarea');
    el.value = clabe;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }

  const btn = document.getElementById('btnCopyClabe');
  if (btn) {
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span>✓ ¡CLABE Copiada!</span>';
    btn.classList.add('copied');
    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.classList.remove('copied');
    }, 2500);
  }

  showToastNotification('CLABE Copiada', 'success', '638180010128388591 lista para transferencias SPEI.');
}

// -------------------------------------------------------------
// MÓDULO: EXTRACTOR INTELIGENTE DE CV EXISTENTE
// -------------------------------------------------------------

let pendingExtractedProfile = null;
let pdfStatusUnsubscribe = null;

function setExtractorStatus(message, icon = '🔄', progress = null, isError = false) {
  const alertEl = document.getElementById('extractorStatusAlert');
  const msgEl = document.getElementById('extractorStatusMsg');
  const iconEl = document.getElementById('extractorStatusIcon');
  const barCont = document.getElementById('extractorProgressBarContainer');
  const barEl = document.getElementById('extractorProgressBar');

  if (!alertEl || !msgEl) return;

  if (!message) {
    alertEl.style.display = 'none';
    return;
  }

  alertEl.style.display = 'flex';
  msgEl.innerText = message;
  if (iconEl) iconEl.innerText = icon;

  if (isError) {
    alertEl.style.background = 'rgba(239, 68, 68, 0.12)';
    alertEl.style.borderColor = 'rgba(239, 68, 68, 0.3)';
    alertEl.style.color = '#f87171';
  } else {
    alertEl.style.background = 'rgba(56, 189, 248, 0.12)';
    alertEl.style.borderColor = 'rgba(56, 189, 248, 0.3)';
    alertEl.style.color = '#38bdf8';
  }

  if (barCont && barEl) {
    if (progress !== null && progress >= 0) {
      barCont.style.display = 'block';
      barEl.style.width = Math.min(100, Math.max(0, progress)) + '%';
    } else {
      barCont.style.display = 'none';
    }
  }
}

function openCvExtractorModal() {
  document.getElementById('cvExtractorModal').classList.add('active');
  document.getElementById('rawCvInput').value = '';
  document.getElementById('extractorPreviewSection').style.display = 'none';
  setExtractorStatus('');
  pendingExtractedProfile = null;

  // Registrar listener de progreso si no está suscrito
  if (window.electronAPI && window.electronAPI.onPdfExtractionStatus && !pdfStatusUnsubscribe) {
    pdfStatusUnsubscribe = window.electronAPI.onPdfExtractionStatus((data) => {
      if (data.status === 'ocr_progress') {
        setExtractorStatus(data.message, '⚡', data.progress);
      } else if (data.status === 'done') {
        setExtractorStatus(data.message, '✓', 100);
      } else {
        setExtractorStatus(data.message, '🔍');
      }
    });
  }
}

async function extractDirectlyFromPdfDialog() {
  if (window.electronAPI && window.electronAPI.selectAndExtractPdf) {
    setExtractorStatus('Abriendo selector de archivos...', '📂');
    try {
      const res = await window.electronAPI.selectAndExtractPdf();
      if (res.canceled) {
        setExtractorStatus('');
        return;
      }
      if (res.success && res.text) {
        document.getElementById('rawCvInput').value = res.text;
        if (res.method === 'ocr') {
          setExtractorStatus('⚡ Documento vectorial/escaneado procesado con OCR offline con éxito.', '✓');
        } else {
          setExtractorStatus('✓ Texto digital extraído al instante.', '✓');
        }
        analyzePastedCvText();
      } else {
        setExtractorStatus('Error al leer el archivo PDF: ' + (res.error || 'Archivo ilegible.'), '❌', null, true);
      }
    } catch (err) {
      setExtractorStatus('Error inesperado: ' + err.message, '❌', null, true);
    }
  } else {
    document.getElementById('cvTextFileInput').click();
  }
}

let lastExtractedFileName = '';

async function handleCvFileSelect(event) {
  const file = event.target.files[0];
  if (!file) return;
  lastExtractedFileName = file.name;

  const resolvedPath = (window.electronAPI && window.electronAPI.getPathForFile)
    ? window.electronAPI.getPathForFile(file)
    : (file.path || '');

  // Soporte directo para archivos Word (.docx)
  if (file.name.toLowerCase().endsWith('.docx')) {
    if (window.electronAPI && window.electronAPI.extractDocxText && resolvedPath) {
      setExtractorStatus(`Leyendo documento Word (${file.name})...`, '🔍');
      try {
        const res = await window.electronAPI.extractDocxText(resolvedPath);
        if (res.success && res.text) {
          document.getElementById('rawCvInput').value = res.text;
          setExtractorStatus('✓ Documento Word procesado con éxito.', '✓');
          analyzePastedCvText(file.name);
        } else {
          setExtractorStatus('Error al leer Word: ' + (res.error || 'Archivo ilegible.'), '❌', null, true);
        }
      } catch (err) {
        setExtractorStatus('Error: ' + err.message, '❌', null, true);
      }
      return;
    }
  }

  // Soporte directo para archivos PDF (.pdf)
  if (file.name.toLowerCase().endsWith('.pdf')) {
    if (window.electronAPI && window.electronAPI.extractPdfText && resolvedPath) {
      setExtractorStatus(`Leyendo ${file.name}...`, '🔍');
      try {
        const res = await window.electronAPI.extractPdfText(resolvedPath);
        if (res.success && res.text) {
          document.getElementById('rawCvInput').value = res.text;
          if (res.method === 'ocr') {
            setExtractorStatus('⚡ Documento escaneado procesado con OCR offline con éxito.', '✓');
          } else {
            setExtractorStatus('✓ Texto extraído al instante.', '✓');
          }
          analyzePastedCvText(file.name);
        } else {
          setExtractorStatus('Error al extraer texto del PDF: ' + (res.error || 'Archivo ilegible.'), '❌', null, true);
        }
      } catch (err) {
        setExtractorStatus('Error: ' + err.message, '❌', null, true);
      }
      return;
    } else {
      showAppDialog({
        title: 'Extracción de PDF',
        message: 'Para procesar archivos PDF directamente, por favor utiliza la versión de escritorio de OpenCV Studio o copia y pega el contenido del PDF en el área de texto.',
        type: 'info',
        icon: '📄'
      });
      return;
    }
  }

  setExtractorStatus(`Cargando ${file.name}...`, '📄');
  const reader = new FileReader();
  reader.onload = (e) => {
    const content = e.target.result;
    document.getElementById('rawCvInput').value = content;
    setExtractorStatus('✓ Archivo cargado correctamente.', '✓');
    analyzePastedCvText(file.name);
  };
  reader.readAsText(file);
}

function analyzePastedCvText(optionalFilename = '') {
  const rawText = document.getElementById('rawCvInput').value.trim();
  const filename = optionalFilename || lastExtractedFileName || '';
  if (!rawText) {
    showAppDialog({
      title: 'Texto no proporcionado',
      message: 'Por favor pega el texto de tu currículum o selecciona un archivo para que el motor inteligente pueda analizarlo.',
      type: 'warning',
      icon: '📝'
    });
    return;
  }

  try {
    const parsed = window.cvParser.parseCVText(rawText, filename);
    pendingExtractedProfile = parsed;

    const previewBox = document.getElementById('extractorPreviewBox');
    previewBox.innerHTML = '';

    const tagsContainer = document.createElement('div');
    tagsContainer.className = 'preview-tag-list';

    if (parsed.personal.fullName) {
      tagsContainer.innerHTML += `<span class="preview-tag">👤 <strong>Nombre:</strong> ${escapeHtml(parsed.personal.fullName)}</span>`;
    }
    if (parsed.personal.headline) {
      tagsContainer.innerHTML += `<span class="preview-tag">💼 <strong>Titular:</strong> ${escapeHtml(parsed.personal.headline)}</span>`;
    }
    if (parsed.personal.email) {
      tagsContainer.innerHTML += `<span class="preview-tag">📧 <strong>Email:</strong> ${escapeHtml(parsed.personal.email)}</span>`;
    }
    if (parsed.personal.phone) {
      tagsContainer.innerHTML += `<span class="preview-tag">📱 <strong>Teléfono:</strong> ${escapeHtml(parsed.personal.phone)}</span>`;
    }
    if (parsed.personal.location) {
      tagsContainer.innerHTML += `<span class="preview-tag">📍 <strong>Ubicación:</strong> ${escapeHtml(parsed.personal.location)}</span>`;
    }
    if (parsed.personal.linkedin) {
      tagsContainer.innerHTML += `<span class="preview-tag">🔗 <strong>LinkedIn:</strong> Detectado</span>`;
    }
    if (parsed.personal.github) {
      tagsContainer.innerHTML += `<span class="preview-tag">🐙 <strong>GitHub:</strong> Detectado</span>`;
    }

    const expCount = parsed.experience?.length || 0;
    tagsContainer.innerHTML += `<span class="preview-tag">🏢 <strong>Experiencias:</strong> ${expCount} detectada(s)</span>`;

    const eduCount = parsed.education?.length || 0;
    tagsContainer.innerHTML += `<span class="preview-tag">🎓 <strong>Educación:</strong> ${eduCount} detectada(s)</span>`;

    const skillsCount = (parsed.skills || []).reduce((acc, cat) => acc + (cat.items?.length || 0), 0);
    tagsContainer.innerHTML += `<span class="preview-tag">🛠️ <strong>Habilidades:</strong> ${skillsCount} extraída(s)</span>`;

    const projCount = parsed.projects?.length || 0;
    if (projCount > 0) {
      tagsContainer.innerHTML += `<span class="preview-tag">🚀 <strong>Proyectos:</strong> ${projCount} detectado(s)</span>`;
    }

    const langCount = parsed.languages?.length || 0;
    tagsContainer.innerHTML += `<span class="preview-tag">🌐 <strong>Idiomas:</strong> ${langCount} detectado(s)</span>`;

    previewBox.appendChild(tagsContainer);

    if (parsed.experience && parsed.experience.length > 0) {
      const expList = document.createElement('div');
      expList.style.fontSize = '11.5px';
      expList.style.color = '#94a3b8';
      expList.style.marginTop = '6px';
      expList.innerHTML = '<strong>Puestos encontrados:</strong> ' + parsed.experience.map(e => `${escapeHtml(e.role)} en ${escapeHtml(e.company)} (${escapeHtml(e.period)})`).join(' • ');
      previewBox.appendChild(expList);
    }

    document.getElementById('extractedProfileName').value = parsed.personal.fullName 
      ? `CV - ${parsed.personal.fullName}` 
      : 'CV Importado ' + new Date().toLocaleDateString('es-MX');

    document.getElementById('extractorPreviewSection').style.display = 'flex';
  } catch (err) {
    showAppDialog({
      title: 'Error en el análisis',
      message: 'Ocurrió un error inesperado al procesar el texto: ' + err.message,
      type: 'danger',
      icon: '❌'
    });
  }
}

function confirmExtractedProfile() {
  if (!pendingExtractedProfile) {
    showAppDialog({
      title: 'Sin datos detectados',
      message: 'No hay datos analizados para guardar. Por favor sube un archivo o pega el texto de tu currículum primero.',
      confirmText: 'Entendido',
      type: 'warning',
      icon: '⚠️'
    });
    return;
  }

  const profileName = document.getElementById('extractedProfileName').value.trim() || 'Nuevo CV Importado';
  const template = document.getElementById('extractedProfileTemplate').value || 'tech';

  pendingExtractedProfile.name = profileName;

  const newProfile = storage.createProfile(profileName, template, pendingExtractedProfile);
  initProfileSelector();
  storage.setActiveProfile(newProfile.id);
  document.getElementById('profileSelect').value = newProfile.id;
  loadCurrentProfile();
  updatePreview();

  closeModal('cvExtractorModal');

  // Diálogo Ejecutivo y Profesional de Éxito
  showAppDialog({
    title: '¡Currículum Importado con Éxito!',
    subtitle: 'Tu perfil ha sido estructurado y cargado en el editor de OpenCV Studio.',
    profileName: profileName,
    candidateName: newProfile.personal?.fullName || '',
    headline: newProfile.personal?.headline || '',
    template: template,
    confirmText: '✨ Comenzar a Personalizar mi CV',
    type: 'success',
    icon: '✓'
  });
}

// -------------------------------------------------------------
// SISTEMA DE DIÁLOGOS Y NOTIFICACIONES PROFESIONALES
// -------------------------------------------------------------

let currentDialogResolver = null;

function showAppDialog(options = {}) {
  return new Promise((resolve) => {
    currentDialogResolver = resolve;
    const modal = document.getElementById('appDialogModal');
    const iconWrapper = document.getElementById('appDialogIconWrapper');
    const iconEl = document.getElementById('appDialogIcon');
    const titleEl = document.getElementById('appDialogTitle');
    const msgEl = document.getElementById('appDialogMessage');
    const detailsCard = document.getElementById('appDialogDetailsCard');
    const detailsContent = document.getElementById('appDialogDetailsContent');
    const cancelBtn = document.getElementById('appDialogCancelBtn');
    const confirmBtn = document.getElementById('appDialogConfirmBtn');

    if (!modal) {
      resolve(true);
      return;
    }

    const type = options.type || 'info'; // 'success' | 'info' | 'warning' | 'danger'
    if (iconWrapper) iconWrapper.className = `dialog-icon-wrapper ${type}`;

    if (iconEl) {
      if (options.icon) {
        iconEl.innerText = options.icon;
      } else if (type === 'success') {
        iconEl.innerText = '✓';
      } else if (type === 'warning') {
        iconEl.innerText = '⚠️';
      } else if (type === 'danger') {
        iconEl.innerText = '🗑️';
      } else {
        iconEl.innerText = 'ℹ️';
      }
    }

    if (titleEl) titleEl.innerText = options.title || 'Aviso';
    if (msgEl) msgEl.innerHTML = options.message || options.subtitle || '';

    // Tarjeta de detalles enriquecidos
    if (detailsCard && detailsContent) {
      if (options.profileName || options.candidateName || options.headline || options.template || options.details) {
        detailsCard.style.display = 'block';
        let detailsHtml = '';

        if (options.profileName) {
          detailsHtml += `<div style="margin-bottom:6px;"><span style="color:#94a3b8;">Perfil creado:</span> <strong style="color:#f8fafc;">${escapeHtml(options.profileName)}</strong></div>`;
        }
        if (options.candidateName) {
          detailsHtml += `<div style="margin-bottom:6px;"><span style="color:#94a3b8;">Candidato:</span> <span style="color:#38bdf8; font-weight:600;">${escapeHtml(options.candidateName)}</span></div>`;
        }
        if (options.headline) {
          detailsHtml += `<div style="margin-bottom:6px;"><span style="color:#94a3b8;">Titular:</span> <span style="color:#cbd5e1;">${escapeHtml(options.headline)}</span></div>`;
        }
        if (options.template) {
          const tNames = {
            tech: 'Tech & Desarrollador',
            data: 'Industrial & Data Analyst',
            ats: 'ATS Minimalista Clásico',
            modern: 'Moderna Ejecutiva'
          };
          detailsHtml += `<div><span style="color:#94a3b8;">Plantilla activa:</span> <span class="dialog-chip">🎨 ${tNames[options.template] || options.template}</span></div>`;
        }
        if (options.details) {
          detailsHtml += `<div style="color:#cbd5e1; margin-top:4px;">${options.details}</div>`;
        }
        detailsContent.innerHTML = detailsHtml;
      } else {
        detailsCard.style.display = 'none';
        detailsContent.innerHTML = '';
      }
    }

    // Botones de acción
    if (cancelBtn) {
      if (options.showCancel) {
        cancelBtn.style.display = 'inline-flex';
        cancelBtn.innerText = options.cancelText || 'Cancelar';
      } else {
        cancelBtn.style.display = 'none';
      }
    }

    if (confirmBtn) {
      confirmBtn.innerText = options.confirmText || 'Aceptar';
      setTimeout(() => confirmBtn.focus(), 100);
    }

    modal.classList.add('active');
  });
}

function closeAppDialog(result = true) {
  const modal = document.getElementById('appDialogModal');
  if (modal) modal.classList.remove('active');
  if (currentDialogResolver) {
    currentDialogResolver(result);
    currentDialogResolver = null;
  }
}

function showAppConfirm(title, message, options = {}) {
  return showAppDialog({
    title,
    message,
    type: options.type || 'warning',
    icon: options.icon || '❓',
    showCancel: true,
    confirmText: options.confirmText || 'Aceptar',
    cancelText: options.cancelText || 'Cancelar'
  });
}

// Sistema de Notificaciones Flotantes (Toasts Ejecutivos)
function showToastNotification(title, type = 'success', subtitle = '', duration = 3200) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `app-toast ${type}`;

  let iconChar = '✓';
  if (type === 'info') iconChar = 'ℹ️';
  else if (type === 'warning') iconChar = '⚠️';
  else if (type === 'danger') iconChar = '✕';

  toast.innerHTML = `
    <div class="toast-icon">${iconChar}</div>
    <div class="toast-content">
      <div class="toast-title">${escapeHtml(title)}</div>
      ${subtitle ? `<div class="toast-body">${escapeHtml(subtitle)}</div>` : ''}
    </div>
    <button class="toast-close" style="background:none; border:none; color:#64748b; font-size:14px; cursor:pointer; padding:0 4px;" title="Cerrar">✕</button>
  `;

  const closeBtn = toast.querySelector('.toast-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      toast.style.transition = 'all 0.25s ease';
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(16px) scale(0.95)';
      setTimeout(() => {
        if (toast.parentElement) toast.remove();
      }, 250);
    });
  }

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'all 0.3s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(16px) scale(0.95)';
    setTimeout(() => {
      if (toast.parentElement) toast.remove();
    }, 300);
  }, duration);
}

// Reemplazo del alert nativo del navegador por diálogo ejecutivo
window.alert = function(msg) {
  showAppDialog({
    title: 'OpenCV Studio',
    message: String(msg),
    type: 'info',
    icon: 'ℹ️',
    confirmText: 'Entendido'
  });
};




// ==========================================================================
// CONTROL DE IDIOMAS (ESPAÑOL / INGLÉS)
// ==========================================================================

function switchLanguage(lang) {
  if (typeof setLanguage === 'function') {
    setLanguage(lang);
  }
  if (currentProfile) {
    if (!currentProfile.settings) currentProfile.settings = {};
    currentProfile.settings.cvLanguage = lang;
    const select = document.getElementById('select_cv_lang');
    if (select) select.value = lang;
    persistAndRefresh();
  }
  renderExperienceEditor();
  renderProjectsEditor();
  renderEducationEditor();
  renderKpisEditor();
  renderCertificationsEditor();

  const pmModal = document.getElementById('profileManagerModal');
  if (pmModal && pmModal.classList.contains('active')) {
    renderProfileManagerUI();
  }

  const bbModal = document.getElementById('bulletBankModal');
  if (bbModal && bbModal.classList.contains('active')) {
    renderBulletBankList();
  }

  const isEn = lang === 'en';
  showToastNotification(
    isEn ? 'Language: English' : 'Idioma: Español',
    'success',
    isEn ? 'Interface and resume headings set to English.' : 'Interfaz y encabezados de CV en Español.'
  );
}

function changeCvLanguage(lang) {
  if (!currentProfile) return;
  if (!currentProfile.settings) currentProfile.settings = {};
  currentProfile.settings.cvLanguage = lang;
  persistAndRefresh();
  const isEn = lang === 'en';
  showToastNotification(
    isEn ? 'Resume Headings: English' : 'Encabezados de CV: Español',
    'info',
    isEn ? 'Templates will render standard English ATS headings.' : 'Las plantillas mostrarán encabezados en Español.'
  );
}
