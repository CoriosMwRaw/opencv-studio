// ==========================================================================
// OpenCV Studio - Controlador Principal
// ==========================================================================

const storage = new CVStorage();
let currentProfile = null;
let currentZoom = 1.0;
let activeTargetBulletInput = null;

// Registro de Plantillas disponibles
const templates = {
  tech: TechTemplate,
  data: DataTemplate,
  ats: ATSTemplate,
  modern: ModernTemplate
};

// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', () => {
  initProfileSelector();
  loadCurrentProfile();
  setupEventListeners();
  updatePreview();
});

// Inicializar Selector de Perfiles
function initProfileSelector() {
  const select = document.getElementById('profileSelect');
  select.innerHTML = '';
  const profiles = storage.getAllProfiles();
  const activeId = storage.getActiveProfileId();

  Object.values(profiles).forEach(prof => {
    const opt = document.createElement('option');
    opt.value = prof.id;
    opt.textContent = prof.name || prof.personal.fullName;
    if (prof.id === activeId) opt.selected = true;
    select.appendChild(opt);
  });
}

// Cargar Datos del Perfil Activo en el Formulario
function loadCurrentProfile() {
  currentProfile = storage.getActiveProfile();

  if (!currentProfile.settings) {
    currentProfile.settings = { template: 'tech', colorTheme: 'navy', showPhoto: true, showKpis: true };
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

  // Selectores de plantilla y tema
  document.getElementById('select_template').addEventListener('change', (e) => {
    currentProfile.settings.template = e.target.value;
    persistAndRefresh();
  });

  document.getElementById('select_theme').addEventListener('change', (e) => {
    currentProfile.settings.colorTheme = e.target.value;
    persistAndRefresh();
  });

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
  const canvas = document.getElementById('cvPaperTarget');
  const templateId = currentProfile.settings.template || 'tech';
  const templateObj = templates[templateId] || templates['tech'];

  canvas.innerHTML = templateObj.render(currentProfile);
}

// -------------------------------------------------------------
// RENDERIZADORES DINÁMICOS DEL EDITOR
// -------------------------------------------------------------

// Experiencia Laboral
function renderExperienceEditor() {
  const container = document.getElementById('experienceList');
  container.innerHTML = '';

  (currentProfile.experience || []).forEach((exp, idx) => {
    const item = document.createElement('div');
    item.className = 'item-box';
    item.id = `item_exp_${idx}`;
    item.innerHTML = `
      <div class="item-box-header" onclick="toggleItemCollapse('item_exp_${idx}')">
        <span class="item-box-title">
          <span>💼 #${idx + 1}: ${exp.role || 'Nuevo Puesto'}</span>
        </span>
        <div style="display:flex; gap:6px; align-items:center;">
          <span style="font-size:11px; color:#94a3b8;">▼</span>
          <button class="app-btn app-btn-danger app-btn-icon" onclick="event.stopPropagation(); deleteExperience(${idx})" title="Eliminar puesto">🗑️</button>
        </div>
      </div>
      <div class="item-box-body">
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Puesto o Rol</label>
            <input type="text" class="form-input" value="${exp.role || ''}" oninput="updateExpField(${idx}, 'role', this.value)">
          </div>
          <div class="form-group">
            <label class="form-label">Empresa / Institución</label>
            <input type="text" class="form-input" value="${exp.company || ''}" oninput="updateExpField(${idx}, 'company', this.value)">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Período (ej. Ago 2023 - Presente)</label>
            <input type="text" class="form-input" value="${exp.period || ''}" oninput="updateExpField(${idx}, 'period', this.value)">
          </div>
          <div class="form-group">
            <label class="form-label">Ubicación</label>
            <input type="text" class="form-input" value="${exp.location || ''}" oninput="updateExpField(${idx}, 'location', this.value)">
          </div>
        </div>
        <div class="form-group">
          <div class="form-label">
            <span>Logros y Responsabilidades (uno por línea)</span>
            <button class="app-btn app-btn-outline" style="padding: 2px 7px; font-size: 11px;" onclick="openBulletBankForExp(${idx})">💡 Banco de Frases</button>
          </div>
          <textarea class="form-textarea" rows="4" id="exp_bullets_${idx}" oninput="updateExpBullets(${idx}, this.value)">${(exp.bullets || []).join('\n')}</textarea>
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

function deleteExperience(idx) {
  if (confirm('¿Deseas eliminar este puesto laboral de tu currículum?')) {
    currentProfile.experience.splice(idx, 1);
    persistAndRefresh();
    renderExperienceEditor();
  }
}

// Proyectos
function renderProjectsEditor() {
  const container = document.getElementById('projectsList');
  container.innerHTML = '';

  (currentProfile.projects || []).forEach((pr, idx) => {
    const item = document.createElement('div');
    item.className = 'item-box';
    item.id = `item_proj_${idx}`;
    item.innerHTML = `
      <div class="item-box-header" onclick="toggleItemCollapse('item_proj_${idx}')">
        <span class="item-box-title">
          <span>🚀 #${idx + 1}: ${pr.title || 'Nuevo Proyecto'}</span>
        </span>
        <div style="display:flex; gap:6px; align-items:center;">
          <span style="font-size:11px; color:#94a3b8;">▼</span>
          <button class="app-btn app-btn-danger app-btn-icon" onclick="event.stopPropagation(); deleteProject(${idx})">🗑️</button>
        </div>
      </div>
      <div class="item-box-body">
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Título del Proyecto</label>
            <input type="text" class="form-input" value="${pr.title || ''}" oninput="updateProjField(${idx}, 'title', this.value)">
          </div>
          <div class="form-group">
            <label class="form-label">Tecnologías (ej. React • Node.js)</label>
            <input type="text" class="form-input" value="${pr.tech || ''}" oninput="updateProjField(${idx}, 'tech', this.value)">
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Enlace / Repositorio (Opcional)</label>
          <input type="text" class="form-input" value="${pr.link || ''}" oninput="updateProjField(${idx}, 'link', this.value)">
        </div>
        <div class="form-group">
          <label class="form-label">Descripción del Proyecto</label>
          <textarea class="form-textarea" rows="2" oninput="updateProjField(${idx}, 'description', this.value)">${pr.description || ''}</textarea>
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

function deleteProject(idx) {
  if (confirm('¿Deseas eliminar este proyecto?')) {
    currentProfile.projects.splice(idx, 1);
    persistAndRefresh();
    renderProjectsEditor();
  }
}

// Educación
function renderEducationEditor() {
  const container = document.getElementById('educationList');
  container.innerHTML = '';

  (currentProfile.education || []).forEach((ed, idx) => {
    const item = document.createElement('div');
    item.className = 'item-box';
    item.id = `item_edu_${idx}`;
    item.innerHTML = `
      <div class="item-box-header" onclick="toggleItemCollapse('item_edu_${idx}')">
        <span class="item-box-title">
          <span>🎓 #${idx + 1}: ${ed.degree || 'Estudio'}</span>
        </span>
        <div style="display:flex; gap:6px; align-items:center;">
          <span style="font-size:11px; color:#94a3b8;">▼</span>
          <button class="app-btn app-btn-danger app-btn-icon" onclick="event.stopPropagation(); deleteEducation(${idx})">🗑️</button>
        </div>
      </div>
      <div class="item-box-body">
        <div class="form-group">
          <label class="form-label">Grado / Título (ej. Ingeniería en Sistemas)</label>
          <input type="text" class="form-input" value="${ed.degree || ''}" oninput="updateEduField(${idx}, 'degree', this.value)">
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Escuela / Universidad</label>
            <input type="text" class="form-input" value="${ed.school || ''}" oninput="updateEduField(${idx}, 'school', this.value)">
          </div>
          <div class="form-group">
            <label class="form-label">Período / Semestre</label>
            <input type="text" class="form-input" value="${ed.period || ''}" oninput="updateEduField(${idx}, 'period', this.value)">
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Detalles Adicionales</label>
          <input type="text" class="form-input" value="${ed.details || ''}" oninput="updateEduField(${idx}, 'details', this.value)">
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

function deleteEducation(idx) {
  if (confirm('¿Deseas eliminar este registro educativo?')) {
    currentProfile.education.splice(idx, 1);
    persistAndRefresh();
    renderEducationEditor();
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
  container.innerHTML = '';

  (currentProfile.kpis || []).forEach((k, idx) => {
    const row = document.createElement('div');
    row.className = 'form-row';
    row.style.marginBottom = '6px';
    row.innerHTML = `
      <input type="text" class="form-input" placeholder="Cifra (ej. 4+)" value="${k.number}" oninput="updateKpi(${idx}, 'number', this.value)">
      <input type="text" class="form-input" placeholder="Etiqueta (ej. Proyectos)" value="${k.label}" oninput="updateKpi(${idx}, 'label', this.value)">
    `;
    container.appendChild(row);
  });
}

function updateKpi(idx, field, val) {
  currentProfile.kpis[idx][field] = val;
  persistAndRefresh();
}

// Certificaciones
function renderCertificationsEditor() {
  const container = document.getElementById('certList');
  container.innerHTML = '';

  (currentProfile.certifications || []).forEach((c, idx) => {
    const row = document.createElement('div');
    row.className = 'form-row-3';
    row.style.marginBottom = '6px';
    row.innerHTML = `
      <input type="text" class="form-input" placeholder="Certificado" value="${c.title}" oninput="updateCert(${idx}, 'title', this.value)">
      <input type="text" class="form-input" placeholder="Emisor" value="${c.issuer}" oninput="updateCert(${idx}, 'issuer', this.value)">
      <div style="display:flex; gap:4px;">
        <input type="text" class="form-input" placeholder="Año" value="${c.year}" oninput="updateCert(${idx}, 'year', this.value)" style="width:70px;">
        <button class="app-btn app-btn-danger app-btn-icon" onclick="deleteCert(${idx})">🗑️</button>
      </div>
    `;
    container.appendChild(row);
  });
}

function addCert() {
  if (!currentProfile.certifications) currentProfile.certifications = [];
  currentProfile.certifications.push({ title: 'Nueva Certificación', issuer: 'Emisor', year: '2025' });
  persistAndRefresh();
  renderCertificationsEditor();
}

function updateCert(idx, field, val) {
  currentProfile.certifications[idx][field] = val;
  persistAndRefresh();
}

function deleteCert(idx) {
  currentProfile.certifications.splice(idx, 1);
  persistAndRefresh();
  renderCertificationsEditor();
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
    alert('Por favor selecciona un archivo de imagen válido (JPG, PNG, WEBP).');
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
  listContainer.innerHTML = '';

  const profiles = storage.getAllProfiles();
  const activeId = storage.getActiveProfileId();

  Object.values(profiles).forEach(prof => {
    const isCurrent = prof.id === activeId;
    const card = document.createElement('div');
    card.style.background = isCurrent ? '#1e3a5f' : '#182234';
    card.style.border = isCurrent ? '1.5px solid #38bdf8' : '1px solid #334155';
    card.style.padding = '10px 14px';
    card.style.borderRadius = '8px';
    card.style.display = 'flex';
    card.style.justifyContent = 'space-between';
    card.style.alignItems = 'center';

    card.innerHTML = `
      <div>
        <div style="font-weight:700; font-size:13.5px; color:#ffffff; display:flex; align-items:center; gap:8px;">
          <span>${prof.name}</span>
          ${isCurrent ? '<span style="background:#059669; color:#fff; font-size:10px; padding:2px 6px; border-radius:10px;">Activo</span>' : ''}
        </div>
        <div style="font-size:11.5px; color:#94a3b8; margin-top:2px;">
          Titular: ${prof.personal?.headline || 'Sin titular'} | Plantilla: ${prof.settings?.template || 'tech'}
        </div>
      </div>
      <div style="display:flex; gap:6px;">
        ${!isCurrent ? `<button class="app-btn app-btn-primary app-btn-icon" onclick="selectProfileFromModal('${prof.id}')" title="Cargar este perfil">Usar</button>` : ''}
        <button class="app-btn app-btn-outline app-btn-icon" onclick="duplicateProfileFromModal('${prof.id}')" title="Duplicar">📑</button>
        ${Object.keys(profiles).length > 1 ? `<button class="app-btn app-btn-danger app-btn-icon" onclick="deleteProfileFromModal('${prof.id}')" title="Eliminar">🗑️</button>` : ''}
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
    alert('Por favor escribe un nombre para el nuevo perfil.');
    input.focus();
    return;
  }

  storage.createProfile(name, templateSelect.value);
  input.value = '';
  initProfileSelector();
  loadCurrentProfile();
  updatePreview();
  closeModal('profileManagerModal');
}

function duplicateProfileFromModal(id) {
  storage.setActiveProfile(id);
  storage.duplicateActiveProfile();
  initProfileSelector();
  loadCurrentProfile();
  updatePreview();
  renderProfileManagerUI();
}

function deleteProfileFromModal(id) {
  if (confirm('¿Confirmas eliminar este perfil?')) {
    storage.deleteProfile(id);
    initProfileSelector();
    loadCurrentProfile();
    updatePreview();
    renderProfileManagerUI();
  }
}

// -------------------------------------------------------------
// MODALES Y ASISTENTES
// -------------------------------------------------------------

function openBulletBankForExp(idx) {
  activeTargetBulletInput = idx;
  const modal = document.getElementById('bulletBankModal');
  const content = document.getElementById('bulletBankContent');
  content.innerHTML = '';

  Object.entries(bulletBank).forEach(([k, cat]) => {
    if (k === 'verbos') return;
    const catBox = document.createElement('div');
    catBox.innerHTML = `<h4 style="color:#60a5fa; margin: 10px 0 6px 0; font-size:13px;">${cat.category}</h4>`;
    const list = document.createElement('ul');
    list.style.listStyle = 'none';
    list.style.display = 'flex';
    list.style.flexDirection = 'column';
    list.style.gap = '6px';

    cat.items.forEach(phrase => {
      const li = document.createElement('li');
      li.style.background = '#1e293b';
      li.style.padding = '8px 12px';
      li.style.borderRadius = '6px';
      li.style.cursor = 'pointer';
      li.style.fontSize = '12px';
      li.style.border = '1px solid #334155';
      li.textContent = phrase;
      li.onclick = () => insertBulletToActiveExp(phrase);
      list.appendChild(li);
    });

    catBox.appendChild(list);
    content.appendChild(catBox);
  });

  modal.classList.add('active');
}

function insertBulletToActiveExp(phrase) {
  if (activeTargetBulletInput !== null && currentProfile.experience[activeTargetBulletInput]) {
    currentProfile.experience[activeTargetBulletInput].bullets.push(phrase);
    persistAndRefresh();
    renderExperienceEditor();
    closeModal('bulletBankModal');
  }
}

function openATSAnalyzer() {
  const modal = document.getElementById('atsModal');
  const result = ATSAnalyzer.analyze(currentProfile);

  document.getElementById('atsScoreText').textContent = `${result.score}%`;
  document.getElementById('atsScoreBadge').textContent = result.rating;
  document.getElementById('atsScoreBadge').style.backgroundColor = result.badgeColor;

  const checksList = document.getElementById('atsChecksList');
  checksList.innerHTML = '';

  result.checks.forEach(c => {
    const item = document.createElement('div');
    item.style.background = '#182234';
    item.style.padding = '10px 14px';
    item.style.borderRadius = '6px';
    item.style.border = `1px solid ${c.passed ? '#059669' : '#d97706'}`;
    item.innerHTML = `
      <div style="display:flex; justify-content:space-between; font-weight:700; font-size:13px; color:#ffffff;">
        <span>${c.passed ? '✓' : '⚠️'} ${c.category}</span>
        <span style="color:#60a5fa;">${c.points}</span>
      </div>
      <div style="font-size:12px; color:#94a3b8; margin-top:4px;">${c.tip}</div>
    `;
    checksList.appendChild(item);
  });

  modal.classList.add('active');
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

async function exportToPDF() {
  const candidateName = (currentProfile.personal.fullName || 'Mi_Curriculum').replace(/[^a-zA-Z0-9_]/g, '_');
  const defaultFileName = `CV_${candidateName}.pdf`;

  if (window.electronAPI && window.electronAPI.exportPdf) {
    try {
      const res = await window.electronAPI.exportPdf({ defaultName: defaultFileName, pageSize: 'Letter' });
      if (res.success) {
        alert(`¡PDF generado exitosamente!\nGuardado en: ${res.filePath}`);
      } else if (!res.canceled) {
        alert('Error al exportar PDF: ' + (res.error || 'Desconocido'));
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
    if (res.success) alert('Respaldo JSON guardado correctamente.');
  } else {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
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
      alert('Perfil importado con éxito.');
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
            alert('Perfil importado con éxito.');
          } catch (err) {
            alert('Error al leer el archivo JSON: ' + err.message);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }
}
