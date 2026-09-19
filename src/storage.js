// ==========================================================================
// OpenCV Studio - Gestor de Almacenamiento Local y Perfiles Múltiples
// ==========================================================================

class CVStorage {
  constructor() {
    this.STORAGE_KEY = 'opencv_studio_profiles_v2';
    this.ACTIVE_KEY = 'opencv_studio_active_id_v2';
    this.init();
  }

  init() {
    let profiles = null;
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (raw) profiles = JSON.parse(raw);
    } catch (e) {
      console.error('Error al inicializar perfiles:', e);
    }

    // Limpiar caché anterior si tenía el perfil privado o si está vacío
    if (!profiles || profiles['cesar_perfil'] || Object.keys(profiles).length === 0) {
      localStorage.removeItem('opencv_studio_profiles_v1');
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(sampleProfiles));
      localStorage.setItem(this.ACTIVE_KEY, 'estudiante_sistemas');
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
    return localStorage.getItem(this.ACTIVE_KEY) || 'estudiante_sistemas';
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

  createProfile(name, templateId = 'tech') {
    const profiles = this.getAllProfiles();
    const newId = 'prof_' + Date.now();
    const base = sampleProfiles['perfil_en_blanco'] || sampleProfiles['estudiante_sistemas'];
    const newProfile = JSON.parse(JSON.stringify(base));
    
    newProfile.id = newId;
    newProfile.name = name.trim();
    newProfile.personal.fullName = name.trim().toUpperCase();
    newProfile.settings.template = templateId;

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
      alert('Debes conservar al menos un perfil en la aplicación.');
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
