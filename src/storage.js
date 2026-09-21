// ==========================================================================
// OpenCV Studio - Gestor de Almacenamiento Local y Perfiles Múltiples
// ==========================================================================

class CVStorage {
  constructor() {
    this.STORAGE_KEY = 'opencv_studio_profiles_v3';
    this.ACTIVE_KEY = 'opencv_studio_active_id_v3';
    this.init();
  }

  init() {
    // Purga proactiva de almacenamiento legacy para proteger datos privados
    try {
      localStorage.removeItem('opencv_studio_profiles_v1');
      localStorage.removeItem('opencv_studio_active_id_v1');
      localStorage.removeItem('opencv_studio_profiles_v2');
      localStorage.removeItem('opencv_studio_active_id_v2');
    } catch (e) {}

    let profiles = null;
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (raw) profiles = JSON.parse(raw);
    } catch (e) {
      console.error('Error al inicializar perfiles:', e);
    }

    // Si no hay perfiles o está vacío, cargar sampleProfiles genéricos
    if (!profiles || Object.keys(profiles).length === 0) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(sampleProfiles));
      localStorage.setItem(this.ACTIVE_KEY, 'estudiante_sistemas');
    } else {
      // Purgar cualquier clave privada residual si existiera
      if (profiles['cesar_perfil']) delete profiles['cesar_perfil'];
      if (profiles['cesar_alberto_maestro']) delete profiles['cesar_alberto_maestro'];

      // Asegurar que perfiles nuevos de muestra (ej. Harvard Executive) aparezcan disponibles
      let updated = false;
      for (const [key, profile] of Object.entries(sampleProfiles)) {
        if (!profiles[key]) {
          profiles[key] = profile;
          updated = true;
        }
      }
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(profiles));

      const activeId = localStorage.getItem(this.ACTIVE_KEY);
      if (!activeId || activeId === 'cesar_alberto_maestro' || activeId === 'cesar_perfil' || !profiles[activeId]) {
        localStorage.setItem(this.ACTIVE_KEY, 'estudiante_sistemas');
      }
    }
  }

  getAllProfiles() {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      return raw ? JSON.parse(raw) : sampleProfiles;
    } catch (e) {
      console.error('Error al leer perfiles:', e);
      return sampleProfiles;
    }
  }

  getActiveProfileId() {
    const active = localStorage.getItem(this.ACTIVE_KEY);
    return (active && active !== 'cesar_alberto_maestro' && active !== 'cesar_perfil') ? active : 'estudiante_sistemas';
  }

  getActiveProfile() {
    const profiles = this.getAllProfiles();
    const activeId = this.getActiveProfileId();
    return profiles[activeId] || profiles['estudiante_sistemas'] || Object.values(profiles)[0];
  }

  setActiveProfile(profileId) {
    localStorage.setItem(this.ACTIVE_KEY, profileId);
  }

  saveActiveProfile(data) {
    const profiles = this.getAllProfiles();
    const activeId = this.getActiveProfileId();
    if (profiles[activeId]) {
      profiles[activeId] = { ...profiles[activeId], ...data };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(profiles));
    }
  }

  createProfile(name, templateId = 'tech', customData = null) {
    const profiles = this.getAllProfiles();
    const newId = 'prof_' + Date.now();
    const base = sampleProfiles['perfil_en_blanco'] || sampleProfiles['estudiante_sistemas'];
    let newProfile = JSON.parse(JSON.stringify(base));

    if (customData) {
      newProfile = {
        ...newProfile,
        ...customData,
        personal: { ...newProfile.personal, ...(customData.personal || {}) },
        settings: { ...(newProfile.settings || {}), template: templateId, colorTheme: customData.colorTheme || 'navy' }
      };
    } else {
      newProfile.personal.fullName = name.trim().toUpperCase();
      newProfile.settings.template = templateId;
    }

    if (Array.isArray(newProfile.experience)) {
      newProfile.experience = newProfile.experience.map(e => {
        const b = Array.isArray(e.bullets) && e.bullets.length > 0 ? e.bullets : (Array.isArray(e.achievements) ? e.achievements : []);
        return { ...e, bullets: b, achievements: b };
      });
    }

    newProfile.id = newId;
    newProfile.name = name.trim();

    profiles[newId] = newProfile;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(profiles));
    this.setActiveProfile(newId);
    return newProfile;
  }

  duplicateActiveProfile(newName) {
    const current = this.getActiveProfile();
    const profiles = this.getAllProfiles();
    const newId = 'prof_' + Date.now();
    const clone = JSON.parse(JSON.stringify(current));
    clone.id = newId;
    clone.name = newName || (current.name + ' (Copia)');

    profiles[newId] = clone;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(profiles));
    this.setActiveProfile(newId);
    return clone;
  }

  deleteProfile(profileId) {
    const profiles = this.getAllProfiles();
    const keys = Object.keys(profiles);
    if (keys.length <= 1) {
      if (typeof showAppDialog === 'function') {
        showAppDialog({
          title: 'Acción no permitida',
          message: 'Debes conservar al menos un perfil en OpenCV Studio para continuar editando.',
          type: 'warning',
          icon: '⚠️'
        });
      }
      return false;
    }
    delete profiles[profileId];
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(profiles));
    const nextId = Object.keys(profiles)[0];
    this.setActiveProfile(nextId);
    return true;
  }

  renameProfile(profileId, newName) {
    const profiles = this.getAllProfiles();
    if (profiles[profileId] && newName.trim()) {
      profiles[profileId].name = newName.trim();
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(profiles));
      return true;
    }
    return false;
  }

  exportProfileJSON() {
    const profile = this.getActiveProfile();
    const safeName = (profile.personal.fullName || profile.name || 'Curriculum').replace(/[^a-zA-Z0-9_]/g, '_');
    const filename = `CV_${safeName}.json`;
    return { data: profile, filename };
  }

  importProfileJSON(jsonData) {
    if (!jsonData || !jsonData.personal || !jsonData.personal.fullName) {
      throw new Error('El archivo JSON no contiene una estructura de CV válida.');
    }
    const profiles = this.getAllProfiles();
    const newId = 'prof_' + Date.now();
    jsonData.id = newId;
    jsonData.name = jsonData.name || jsonData.personal.fullName;
    profiles[newId] = jsonData;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(profiles));
    this.setActiveProfile(newId);
    return jsonData;
  }
}
